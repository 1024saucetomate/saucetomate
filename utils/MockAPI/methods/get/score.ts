import MockAPI from "../..";

export function compute(
  policies: {
    id: string;
    isFor: boolean;
  }[],
) {
  const tracker: Record<string, number> = {};

  for (const policy of policies) {
    const candidateId = MockAPI.get.policies.fromId(policy.id)?.candidateId;
    if (!candidateId) {
      continue;
    }
    tracker[candidateId] = (tracker[candidateId] ?? 0) + (policy.isFor ? 1 : -1);
  }

  if (Object.keys(tracker).length === 0) {
    return null;
  }

  const topCandidate = Object.entries(tracker).reduce((prev, curr) => {
    if (prev[1] === curr[1]) {
      return Math.random() < 0.5 ? prev : curr;
    }
    return prev[1] > curr[1] ? prev : curr;
  });

  return topCandidate[0];
}
