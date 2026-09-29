import { work } from "@/content/work";
import { findWork, workDetail } from "@/lib/public-data";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return work.map((item) => ({ slug: item.slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const item = findWork((await params).slug);
  if (!item) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(workDetail(item), { headers: { "Access-Control-Allow-Origin": "*" } });
}
