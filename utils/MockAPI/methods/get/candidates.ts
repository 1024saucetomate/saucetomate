import candidates from "@/data/candidates.json";
import type { Candidate } from "@/utils/interfaces";
export const all = (): Candidate[] => candidates;

export const fromId = (id: string): Candidate | undefined => candidates.find((candidate) => candidate.id === id);

export const randomGIF = (candidateId: string): string | null => {
  const candidate = fromId(candidateId);
  if (!candidate) {
    return null;
  }
  const gifIndex = Math.floor(Math.random() * candidate.gif.count);
  return `${candidate.gif.directory}${gifIndex}.gif`;
};
