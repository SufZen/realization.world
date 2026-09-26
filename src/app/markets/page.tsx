import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { MarketRoleMap } from "@/components/studio-visuals";
import { markets } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Markets",
  "How Realization connects Israeli capital, technology and partners with active physical-world opportunities in Portugal.",
  "/markets",
);

export default function MarketsPage() {
  return (
    <>
      <PageHero
        index="05"
        eyebrow="MARKETS"
        title="Israel meets European opportunity."
        intro="We connect Israeli capital, technology and entrepreneurial capability with active physical-world opportunities in Portugal."
        theme="dark"
      />
      <section className="section">
        <div className="container-wide">
          <SectionHeading eyebrow="MARKET ARCHITECTURE" title="One bridge. One active market." intro="Israel connects. Portugal operates." />
          <MarketRoleMap />
          <div className="market-grid">
            {markets.map(({ slug, name, label, headline, summary, status, icon: Icon }) => (
              <Link className="market-card" href={`/markets/${slug}`} key={slug}>
                <Icon strokeWidth={1.4} aria-hidden="true" />
                <p className="eyebrow">{label}</p>
                <h3>{name}</h3>
                <p>{headline} {summary}</p>
                <span>{status} · Explore market</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section surface-brand"><div className="container-wide"><SectionHeading eyebrow="OUR ROLE" title="Cross-border reach. Local responsibility." intro="Realization creates the connection and venture architecture. Trusted local partners carry context, execution and continuity." /></div></section>
    </>
  );
}
