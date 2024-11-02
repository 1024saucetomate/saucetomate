import type { PolicyVote, ScoreTracker } from "@/utils/interfaces";

import MockAPI from "../..";

export const compute = (policies: PolicyVote[]): ScoreTracker => {
  return policies.reduce((tracker: ScoreTracker, policy: PolicyVote) => {
    const candidateId = MockAPI.get.policies.fromId(policy.id)?.candidateId;
    if (candidateId) {
      tracker[candidateId] = (tracker[candidateId] ?? 0) + (policy.isFor ? 1 : -1);
    }
    return tracker;
  }, {});
};
