import policies from "@/data/policies.json";

export function GET() {
  return Response.json(policies);
}
