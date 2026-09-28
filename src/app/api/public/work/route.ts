import { work } from "@/content/work";
import { workSummary } from "@/lib/public-data";

export const dynamic = "force-static";

export function GET() {
  return Response.json({ work: work.map(workSummary) }, { headers: { "Access-Control-Allow-Origin": "*" } });
}
