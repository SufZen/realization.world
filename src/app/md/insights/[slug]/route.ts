import { insights, siteUrl } from "@/content/site";
import { insightToMarkdown, markdownHeaders } from "@/lib/markdown";

// Served at /insights/<slug>.md through a rewrite in next.config.ts.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return insights.map((insight) => ({ slug: insight.slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const insight = insights.find((entry) => entry.slug === slug);
  if (!insight) return new Response("Not found", { status: 404 });
  return new Response(insightToMarkdown(insight), {
    headers: { ...markdownHeaders, Link: `<${siteUrl}/insights/${insight.slug}>; rel="canonical"` },
  });
}
