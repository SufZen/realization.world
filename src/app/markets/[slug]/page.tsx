import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/button-link";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { markets } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { Lines } from "@/components/lines";

export function generateStaticParams() {
  return markets.map((market) => ({ slug: market.slug }));
}

export async function generateMetadata({ params }: PageProps<"/markets/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const market = markets.find((entry) => entry.slug === slug);
  return market ? pageMetadata(`${market.name} Market`, market.summary, `/markets/${market.slug}`) : {};
}

export default async function MarketPage({ params }: PageProps<"/markets/[slug]">) {
  const { slug } = await params;
  const market = markets.find((entry) => entry.slug === slug);
  if (!market) notFound();
  const Icon = market.icon;
  const isIsrael = market.slug === "israel";
  const isPortugal = market.slug === "portugal";
  const tracks = isIsrael
    ? [["Capital", "Aligned Israeli investors, | matched to evidence-backed opportunities."], ["Technology", "Useful Israeli technology, | matched to real physical-world problems."], ["Operators", "Entrepreneurial speed and sector expertise | for the right venture."], ["Partnerships", "Durable relationships | across investors, founders and owners."]]
    : isPortugal
      ? [["Opportunity sourcing", "Assets and places | where a better model unlocks value."], ["Local context", "Rights, regulation and relationships | that shape what is possible."], ["Operating partners", "Accountable local teams, | including the Realization Portugal network."], ["Cross-border fit", "The right opportunities, | connected to Israeli capital and technology."]]
      : [];

  return (
    <>
      <PageHero
        index="M"
        eyebrow={market.label}
        title={market.headline}
        intro={market.summary}
        theme={isIsrael ? "dark" : isPortugal ? "brand" : "light"}
        actions={<ButtonLink href="/bring-an-opportunity" variant={isIsrael ? "primary" : "dark"}>{isIsrael ? "Build the bridge" : isPortugal ? "Bring a Portugal opportunity" : "Bring an opportunity"}</ButtonLink>}
        aside={<div className="page-hero__mark" aria-hidden="true"><span><Icon size={38} strokeWidth={1.4} /></span><i /></div>}
      />
      <div className="container-wide market-stats">
        <div className="market-stat"><span>Role</span><strong>{market.role}</strong></div>
        <div className="market-stat"><span>Language architecture</span><strong>{market.language}</strong></div>
        <div className="market-stat"><span>Status</span><strong>{market.status}</strong></div>
      </div>
      <section className="section">
        <div className="container-wide">
          <SectionHeading eyebrow="MARKET PATHS" title={isIsrael ? "How Israel powers the bridge." : isPortugal ? "How Portugal makes opportunity real." : "How this market works."} intro="Each market plays a distinct role." />
          <div className="market-tracks">
            {tracks.map(([title, text]) => <article className="market-track" key={title}><h3><Lines text={title} /></h3><p><Lines text={text} /></p></article>)}
          </div>
        </div>
      </section>
      <section className="section surface-muted"><div className="container-wide"><SectionHeading eyebrow="CLARITY" title={isIsrael ? "The origin side of the bridge." : isPortugal ? "A core European market." : "Market status."} intro={isIsrael ? "Israel brings relationships, capital and technology. | Realization connects them to specific opportunities." : isPortugal ? "A broad opportunity market, | and home of the Realization Portugal venture." : "Market status is subject to validation."} /></div></section>
    </>
  );
}
