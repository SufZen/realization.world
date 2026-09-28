import { plain } from "@/components/lines";
import { categoryOf, work, workBySlug } from "@/content/work";
import { ogCard, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Realization case study";

export function generateStaticParams() {
  return work.map((item) => ({ slug: item.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const item = workBySlug((await params).slug);
  if (!item) return ogCard({ eyebrow: "WORK", title: "Realization", footer: "REALIZATION.WORLD/WORK" });
  return ogCard({
    eyebrow: item.eyebrow,
    title: `${item.name}: ${plain(item.descriptor)}`.slice(0, 110),
    footer: `${categoryOf(item).label.toUpperCase()} · ${item.status.toUpperCase()} · REALIZATION.WORLD`,
  });
}
