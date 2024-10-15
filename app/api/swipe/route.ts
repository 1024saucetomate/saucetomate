import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

import MockAPI from "@/utils/MockAPI";
import prisma from "@/utils/prisma";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.fixedWindow(1, "60 s"),
});

async function handlePostRequest(req: NextRequest) {
  const ip = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for") || req.ip || "unknown";
  const { candidateId } = await req.json();

  const rateLimiting = await ratelimit.limit(ip);
  if (!rateLimiting.success) {
    return NextResponse.json({ error: "RATE_LIMIT_EXCEEDED" }, { status: 429 });
  }

  if (!candidateId) {
    return NextResponse.json({ error: "MISSING_CANDIDATE_ID" }, { status: 400 });
  }

  if (!MockAPI.get.candidates.id(candidateId)) {
    return NextResponse.json({ error: "CANDIDATE_NOT_FOUND" }, { status: 404 });
  }

  await prisma.swipe.upsert({
    where: { candidateId },
    update: { count: { increment: 1 } },
    create: { candidateId, count: 1 },
  });

  return NextResponse.json({ message: "OK" }, { status: 200 });
}

async function handleGetRequest() {
  let swipes = await prisma.swipe.findMany();

  if (swipes.length === 0) {
    const candidates = MockAPI.get.candidates.all();
    if (candidates.length > 0) {
      await prisma.$transaction(async (prisma) => {
        for (const candidate of candidates) {
          await prisma.swipe.upsert({
            where: { candidateId: candidate.id },
            update: {},
            create: { candidateId: candidate.id, count: 0 },
          });
        }
      });
      swipes = await prisma.swipe.findMany();
    }
  }

  return NextResponse.json(swipes, { status: 200 });
}

export async function POST(req: NextRequest) {
  return handlePostRequest(req);
}

export async function GET() {
  return handleGetRequest();
}
