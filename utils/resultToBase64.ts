import MockAPI from "./MockAPI";

export default function resultToBase64(
  results: {
    id: string;
    validated: boolean;
  }[],
) {
  const policies = results.map((result) => {
    return {
      id: result.id,
      validated: result.validated,
      candidate: MockAPI.get.policies.id(result.id)?.candidateId,
    };
  });

  const candidateCount: { [key: string]: number } = {};

  policies.forEach((policy) => {
    if (policy.candidate) {
      if (candidateCount[policy.candidate]) {
        if (policy.validated) {
          candidateCount[policy.candidate]++;
        }
      } else {
        candidateCount[policy.candidate] = policy.validated ? 1 : 0;
      }
    }
  });

  return btoa(
    JSON.stringify({
      policies,
      candidateCount,
    }),
  );
}
