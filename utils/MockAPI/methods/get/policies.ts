import policies from "@/data/policies.json";

export function random(count: number) {
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

  const randomCandidateId = candidateIds[Math.floor(Math.random() * candidateIds.length)];
  const extraPolicy = getRandomPolicy(randomCandidateId);
  if (extraPolicy) {
    candidatePolicies[randomCandidateId].push(extraPolicy);
  }

  const result = Object.values(candidatePolicies).flat();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

export function fromId(id: string) {
  return policies.find((policy) => policy.id === id);
}
