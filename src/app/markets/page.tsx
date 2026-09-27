import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { MarketRoleMap } from "@/components/studio-visuals";
import { markets } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { Lines } from "@/components/lines";
import { MarketBridgeDiagram } from "@/components/diagrams";
import { Compass } from "lucide-react";

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
        title="From Israel, | through Portugal, | into Europe."
        intro="Israeli capital and technology. | A working base in Portugal. Spain next."
        theme="dark"
        aside={<figure className="page-hero__diagram diagram"><MarketBridgeDiagram /></figure>}
      />
      <section className="section">
        <div className="container-wide">
          <SectionHeading eyebrow="MARKET ARCHITECTURE" title="One bridge. | One base." intro="Israel connects. Portugal operates. | Europe is where we build next." />
          <MarketRoleMap />
          <div className="market-grid">
            {markets.map(({ slug, name, label, headline, summary, status, icon: Icon }) => (
              <Link className="market-card" href={`/markets/${slug}`} key={slug}>
                <Icon strokeWidth={1.4} aria-hidden="true" />
                <p className="eyebrow">{label}</p>
                <h3>{name}</h3>
                <p><strong className="ln"><Lines text={headline} /></strong> <Lines text={summary} /></p>
                <span>{status} · Explore market</span>
              </Link>
            ))}
            <a className="market-card market-card--next" href="/bring-an-opportunity">
              <Compass strokeWidth={1.4} aria-hidden="true" />
              <p className="eyebrow">NEXT · EUROPE</p>
              <h3>Spain</h3>
              <p><strong className="ln"><Lines text="Building relationships | from Barcelona." /></strong> <Lines text="Open to partners, projects | and conversations in Spain." /></p>
              <span>Expanding · Start a conversation</span>
            </a>
          </div>
        </div>
      </section>
      <section className="section surface-brand"><div className="container-wide"><SectionHeading eyebrow="OUR ROLE" title="Cross-border reach. | Local responsibility." intro="We create the connection and the architecture. | Local partners carry the execution." /></div></section>
    </>
  );
}
