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

  return tracker;
}
