import candidates from "@/data/candidates.json";

export function all() {
  return candidates;
}

export function fromId(id: string) {
  return candidates.find((candidate) => candidate.id === id);
}

export function randomGIF(candidateId: string) {
  const candidate = fromId(candidateId);
  if (!candidate) {
    return null;
  }
  const gifCount = candidate.gif.count;
  const gifIndex = Math.floor(Math.random() * gifCount);
  return `${candidate.gif.directory}${gifIndex}.gif`;
}
