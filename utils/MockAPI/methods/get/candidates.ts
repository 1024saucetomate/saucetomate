import candidates from "@/data/candidates.json";

export function all() {
  return candidates;
}

export function fromId(id: string) {
  return candidates.find((candidate) => candidate.id === id);
}

export function randomGIF(candidateId: string) {
  // candidates.candidateId.gif.directory + candidates.candidateId.gif.count (random, from 0 to count - 1).gif
  const candidate = fromId(candidateId);
  if (!candidate) {
    return null;
  }
  const gifCount = candidate.gif.count;
  const gifIndex = Math.floor(Math.random() * gifCount);
  return `${candidate.gif.directory}${gifIndex}.gif`;
}
