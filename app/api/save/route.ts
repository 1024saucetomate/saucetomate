import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import MockAPI from "@/utils/MockAPI";
import { isRateLimited } from "@/utils/rate-limit";

const prisma = new PrismaClient();

type VoteTracker = Record<string, number>;

const isValidPolicyVote = (
  item: unknown,
): item is {
  id: string;
  isFor: boolean;
} => {
  if (!item || typeof item !== "object") return false;

  const vote = item as Partial<{
    id: string;
    isFor: boolean;
  }>;
  return typeof vote.id === "string" && typeof vote.isFor === "boolean";
};

const createErrorResponse = (status: number, error: string) => {
  return NextResponse.json({ code: status, error }, { status });
};

const computeCandidateScores = (
  votes: {
    id: string;
    isFor: boolean;
  }[],
): VoteTracker => {
  const tracker: VoteTracker = {};

  for (const vote of votes) {
    const policy = MockAPI.get.policies.fromId(vote.id);
    if (!policy) {
      throw new Error(`Invalid policy ID: ${vote.id}`);
    }

    const candidateId = policy.candidateId;
    tracker[candidateId] = (tracker[candidateId] ?? 0) + (vote.isFor ? 1 : -1);
  }

  return tracker;
};

const findBestCandidate = (scores: VoteTracker) => {
  const entries = Object.entries(scores);
  if (entries.length === 0) {
    throw new Error("No votes recorded");
  }

  return entries.reduce((prev, curr) => (prev[1] > curr[1] ? prev : curr));
};

export async function POST(req: Request) {
  try {
    if (await isRateLimited()) {
      return createErrorResponse(429, "TOO_MANY_REQUESTS");
    }

    const body = await req.json();
    if (!Array.isArray(body) || !body.every(isValidPolicyVote)) {
      return createErrorResponse(400, "BAD_REQUEST");
    }

    const candidateScores = computeCandidateScores(body);
    const [winnerId] = findBestCandidate(candidateScores);

    try {
      await prisma.candidate.upsert({
        where: { id: winnerId },
        update: { votes: { increment: 1 } },
        create: { id: winnerId, votes: 1 },
      });

      body.forEach(async ({ id, isFor }) => {
        await prisma.policy.upsert({
          where: { id },
          update: { votes: { increment: isFor ? 1 : -1 } },
          create: { id, votes: isFor ? 1 : -1 },
        });
      });

      const vote = await prisma.vote.create({
        data: {
          candidateId: winnerId,
          policies: body.map(({ id }) => id),
        },
      });

      return NextResponse.json(
        {
          code: 200,
          message: "OK",
          data: {
            voteId: vote.id,
          },
        },
        { status: 200 },
      );
    } catch (error) {
      console.error("Error saving votes:", error);
      return createErrorResponse(500, "INTERNAL_SERVER_ERROR");
    }
  } catch (error) {
    console.error("Error processing votes:", error);
    return createErrorResponse(500, "INTERNAL_SERVER_ERROR");
  }
}
