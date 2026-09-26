import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/button-link";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { markets } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

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
  const isSpain = market.slug === "spain";
  const tracks = isIsrael
    ? [["Capital", "Connect aligned Israeli investors with evidence-backed European opportunities."], ["Technology", "Match useful Israeli technology with real physical-world problems and operating contexts."], ["Operators", "Bring entrepreneurial speed, sector expertise and execution capability into the right venture."], ["Partnerships", "Build durable relationships across investors, founders, local teams and asset owners."]]
    : isPortugal
      ? [["Opportunity sourcing", "Find valuable assets, places and systems where a better operating model can unlock value."], ["Local context", "Work with the rights, regulations and relationships that shape what is possible in Portugal."], ["Operating partners", "Build with accountable local teams, including the Realization Portugal network."], ["Cross-border fit", "Connect the right opportunities with Israeli capital, technology and venture capability."]]
      : [["Research thesis", "Define the property and physical-system problems that may justify a dedicated Spanish venture."], ["Local evidence", "Test demand, ownership patterns and stakeholder needs with Spanish asset owners and sector experts."], ["Regulatory route", "Map the licensing, data, professional and operating requirements before making public claims."], ["Operator path", "Identify a capable local operator before moving from market research to venture launch."]];

  return (
    <>
      <PageHero
        index="M"
        eyebrow={market.label}
        title={market.headline}
        intro={market.summary}
        theme={isIsrael ? "dark" : isPortugal ? "brand" : "light"}
        actions={<ButtonLink href="/bring-an-opportunity" variant={isIsrael ? "primary" : "dark"}>{isIsrael ? "Build the bridge" : isPortugal ? "Bring a Portugal opportunity" : "Join the Spain research"}</ButtonLink>}
        aside={<div className="page-hero__mark" aria-hidden="true"><span><Icon size={38} strokeWidth={1.4} /></span><i /></div>}
      />
      <div className="container-wide market-stats">
        <div className="market-stat"><span>Role</span><strong>{market.role}</strong></div>
        <div className="market-stat"><span>Language architecture</span><strong>{market.language}</strong></div>
        <div className="market-stat"><span>Status</span><strong>{market.status}</strong></div>
      </div>
      <section className="section">
        <div className="container-wide">
          <SectionHeading eyebrow="MARKET PATHS" title={isIsrael ? "How Israel powers the bridge." : isPortugal ? "How Portugal makes opportunity real." : "How Spain earns a venture identity."} intro="Each market contributes a distinct part of the venture system." />
          <div className="market-tracks">
            {tracks.map(([title, text]) => <article className="market-track" key={title}><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </div>
      </section>
      <section className="section surface-muted"><div className="container-wide"><SectionHeading eyebrow="CLARITY" title={isIsrael ? "The origin side of the bridge." : isPortugal ? "A core European market." : "A future market—not an active operation."} intro={isIsrael ? "Israel contributes relationships, capital, technology and entrepreneurial capability. Realization connects those strengths to specific opportunities in Europe." : isPortugal ? "Portugal is both a broad opportunity market and the home of Realization Portugal, a distinct property-resolution venture with its own operating responsibilities." : isSpain ? "Spain remains a research hypothesis. A dedicated identity or operation follows only after the problem, economic model, regulatory route and local operator are validated." : "Market status is subject to validation."} /></div></section>
    </>
  );
}
