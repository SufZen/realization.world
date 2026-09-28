import { plain } from "@/components/lines";
import { insights } from "@/content/site";
import { ogCard, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Realization field note";

export function generateStaticParams() {
  return insights.map((insight) => ({ slug: insight.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const insight = insights.find((entry) => entry.slug === slug);
  return ogCard({
    eyebrow: `FIELD NOTE · ${(insight?.category ?? "INSIGHTS").toUpperCase()}`,
    title: plain(insight?.title ?? "Realization field notes"),
    footer: "BY ASAF EYZENKOT · REALIZATION.WORLD",
  });
}
