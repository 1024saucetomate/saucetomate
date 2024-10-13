import { NextRequest, NextResponse } from "next/server";

import policies from "@/data/policies.json";

export function GET(req: NextRequest) {
  let count = (req.nextUrl.searchParams.get("count") || "20") as string | number;
  try {
    count = parseInt(count as string, 10);
  } catch {
    count = 20;
  }

  const candidateIds = Array.from(new Set(policies.map((policy) => policy.candidateId)));

  const basePoliciesPerCandidate = Math.floor(count / candidateIds.length);
  let remainingPolicies = count % candidateIds.length;

  const candidatePolicies: { [key: string]: unknown[] } = {};
  candidateIds.forEach((id) => {
    candidatePolicies[id] = [];
  });

  const getRandomPolicy = (candidateId: string): unknown | undefined => {
    const availablePolicies = policies.filter(
      (p) => p.candidateId === candidateId && !candidatePolicies[candidateId].includes(p),
    );
    if (availablePolicies.length === 0) return undefined;
    return availablePolicies[Math.floor(Math.random() * availablePolicies.length)];
  };

  candidateIds.forEach((id) => {
    for (let i = 0; i < basePoliciesPerCandidate; i++) {
      const policy = getRandomPolicy(id);
      if (policy) candidatePolicies[id].push(policy);
    }
  });

  while (remainingPolicies > 0) {
    const randomCandidateId = candidateIds[Math.floor(Math.random() * candidateIds.length)];
    const policy = getRandomPolicy(randomCandidateId);
    if (policy) {
      candidatePolicies[randomCandidateId].push(policy);
      remainingPolicies--;
    }
  }

  const result = Object.values(candidatePolicies).flat();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return NextResponse.json(result);
}
