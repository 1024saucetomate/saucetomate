import { NextResponse } from "next/server";

import MockAPI from "@/utils/MockAPI";
import { prisma } from "@/utils/prisma";
import { isRateLimited } from "@/utils/rate-limit";

type PolicyVote = {
  id: string;
  isFor: boolean;
};

const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

const ERROR_MESSAGES = {
  TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",
  BAD_REQUEST: "BAD_REQUEST",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
} as const;

const isValidPolicyVote = (item: unknown): item is PolicyVote => {
  if (!item || typeof item !== "object") return false;
  const vote = item as Partial<PolicyVote>;
  return typeof vote.id === "string" && typeof vote.isFor === "boolean";
};

const createResponse = <T>(status: number, data: T) => {
  return NextResponse.json({ code: status, ...data }, { status });
};

const createErrorResponse = (status: number, error: keyof typeof ERROR_MESSAGES) => {
  return createResponse(status, { error: ERROR_MESSAGES[error] });
};

export async function POST(req: Request) {
  try {
    if (await isRateLimited()) {
      return createErrorResponse(HTTP_STATUS.TOO_MANY_REQUESTS, "TOO_MANY_REQUESTS");
    }

    const body = await req.json();
    if (!Array.isArray(body) || !body.every(isValidPolicyVote)) {
      return createErrorResponse(HTTP_STATUS.BAD_REQUEST, "BAD_REQUEST");
    }

    const winnerId = await MockAPI.get.score.compute(body);
    if (!winnerId) {
      return createErrorResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR");
    }

    const result = await prisma.$transaction(async (tx) => {
      await tx.candidate.upsert({
        where: { id: winnerId },
        update: { votes: { increment: 1 } },
        create: { id: winnerId, votes: 1 },
      });

      return tx.vote.create({
        data: {
          candidateId: winnerId,
          policies: body.map((policy) => JSON.stringify(policy)),
        },
      });
    });

    return createResponse(HTTP_STATUS.OK, {
      message: "OK",
      data: { voteId: result.id },
    });
  } catch (error) {
    console.error("Error processing votes:", error);
    return createErrorResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR");
  } finally {
    await prisma.$disconnect();
  }
}
