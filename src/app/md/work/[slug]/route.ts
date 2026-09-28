import { siteUrl } from "@/content/site";
import { work, workBySlug } from "@/content/work";
import { markdownHeaders, workToMarkdown } from "@/lib/markdown";

// Served at /work/<slug>.md through a rewrite in next.config.ts.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return work.map((item) => ({ slug: item.slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const item = workBySlug((await params).slug);
  if (!item) return new Response("Not found", { status: 404 });
  return new Response(workToMarkdown(item), {
    headers: { ...markdownHeaders, Link: `<${siteUrl}/work/${item.slug}>; rel="canonical"` },
  });
}
