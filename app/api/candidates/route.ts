import candidates from "@/data/candidates.json";

export function GET() {
  return Response.json(candidates);
}
