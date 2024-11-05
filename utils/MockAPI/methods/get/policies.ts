import policies from "@/data/policies.json";
import type { Policy } from "@/utils/interfaces";

export const random = (count: number): Policy[] => {
  const candidateIds = Array.from(new Set(policies.map((policy) => policy.candidateId)));

  const basePoliciesPerCandidate = Math.floor(count / candidateIds.length);
  let remainingPolicies = count % candidateIds.length;

  const candidatePolicies: { [key: string]: Policy[] } = {};
  candidateIds.forEach((id) => {
    candidatePolicies[id as string] = [];
  });

  const getRandomPolicy = (candidateId: string): Policy | undefined => {
    const availablePolicies = policies.filter(
      (p) => p.candidateId === candidateId && !candidatePolicies[candidateId].includes(p),
    ) as Policy[];

    if (availablePolicies.length === 0) return undefined;
    return availablePolicies[Math.floor(Math.random() * availablePolicies.length)];
  };

  candidateIds.forEach((id) => {
    for (let i = 0; i < basePoliciesPerCandidate; i++) {
      const policy = getRandomPolicy(id as string);
      if (policy) candidatePolicies[id as string].push(policy);
    }
  });

  while (remainingPolicies > 0) {
    const randomCandidateId = candidateIds[Math.floor(Math.random() * candidateIds.length)];
    if (randomCandidateId !== undefined) {
      const policy = getRandomPolicy(randomCandidateId);
      if (policy) {
        candidatePolicies[randomCandidateId].push(policy);
        remainingPolicies--;
      }
    }
  }

  const randomCandidateId = candidateIds[Math.floor(Math.random() * candidateIds.length)];
  if (randomCandidateId !== undefined) {
    const extraPolicy = getRandomPolicy(randomCandidateId);
    if (extraPolicy) {
      candidatePolicies[randomCandidateId].push(extraPolicy);
    }
  }

  const result = Object.values(candidatePolicies).flat();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

export const fromId = (id: string): Policy | undefined => {
  const policy = policies.find((policy) => policy.id === id);
  return policy as Policy | undefined;
};

export const categories = (): string[] => Array.from(new Set(policies.map((policy) => policy.category)));

export const all = (): Policy[] => policies;
