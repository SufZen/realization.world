import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { insights } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Insights",
  "Field notes from Realization on venture architecture, physical-world systems, market evidence and transfer.",
  "/insights",
);

export default function InsightsPage() {
  return (
    <>
      <PageHero
        index="06"
        eyebrow="INSIGHTS"
        title="Field notes. Real systems."
        intro="Ideas for building, proving and transferring physical-world ventures."
        theme="light"
      />
      <section className="section surface-dark">
        <div className="container-wide">
          <SectionHeading eyebrow="FIELD NOTES" title="Built from reality." intro="Venture architecture, physical systems, markets and governance." inverse />
          <div className="insights-grid">
            {insights.map(({ slug, category, title, excerpt, published, readTime, icon: Icon }) => (
              <Link className="insight-card" href={`/insights/${slug}`} key={slug}>
                <div className="insight-card__icon"><Icon size={25} strokeWidth={1.5} /></div>
                <div><p className="eyebrow">{category}</p><h3>{title}</h3><p>{excerpt}</p><div className="insight-card__meta"><span>{published}</span><span>{readTime}</span></div></div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="cta-band"><div className="container-wide cta-band__grid"><div><p className="eyebrow">FIELD SIGNAL</p><h2>See a system others are missing?</h2><p>The best insights can become briefs. The best briefs can become ventures.</p></div><Link className="button button--dark" href="/bring-an-opportunity">Bring an opportunity</Link></div></section>
    </>
  );
}
