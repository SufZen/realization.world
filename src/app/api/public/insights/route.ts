import { insights } from "@/content/site";
import { insightDetail } from "@/lib/public-data";

export const dynamic = "force-static";

export function GET() {
  return Response.json({ insights: insights.map(insightDetail) }, { headers: { "Access-Control-Allow-Origin": "*" } });
}
