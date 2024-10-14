import candidates from "@/data/candidates.json";

export function all() {
  return candidates;
}

export function fromId(id: string) {
  return candidates.find((candidate) => candidate.id === id);
}
