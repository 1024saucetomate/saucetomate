import md5 from "md5";
import { NextResponse } from "next/server";

import { getIp } from "@/utils/get-ip";
import type { PolicyVote } from "@/utils/interfaces";
import MockAPI from "@/utils/MockAPI";
import { prisma } from "@/utils/prisma";
import { isRateLimited } from "@/utils/rate-limit";

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

const isValidPolicyVote = async (item: unknown): Promise<boolean> => {
  if (!item || typeof item !== "object") return false;
  const vote = item as Partial<PolicyVote>;
  if (typeof vote.id !== "string" || typeof vote.isFor !== "boolean") return false;

  const policyExists = MockAPI.get.policies.fromId(vote.id) !== undefined;

  return policyExists;
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

    const contentType = req.headers.get("Content-Type");
    if (!contentType || !contentType.includes("application/json")) {
      return createErrorResponse(HTTP_STATUS.BAD_REQUEST, "BAD_REQUEST");
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return createErrorResponse(HTTP_STATUS.BAD_REQUEST, "BAD_REQUEST");
    }

    if (!Array.isArray(body) || !(await Promise.all(body.map(isValidPolicyVote))).every((isValid) => isValid)) {
      return createErrorResponse(HTTP_STATUS.BAD_REQUEST, "BAD_REQUEST");
    }

    const score = MockAPI.get.score.compute(body as PolicyVote[]);
    const winnerId = Object.entries(score).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
    console.log(MockAPI.get.score.compute(body as PolicyVote[]));
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
          policies: body.map((policy: PolicyVote) => JSON.stringify(policy)),
          deviceId: md5((await getIp()) || "UNKNOWN"),
        },
      });
    });

    return createResponse(HTTP_STATUS.OK, {
      data: { voteId: result.id },
    });
  } catch (error) {
    console.error("Error processing votes:", error);
    return createErrorResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR");
  } finally {
    await prisma.$disconnect();
  }
}
