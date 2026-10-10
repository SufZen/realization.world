import type { Metadata } from "next";
import { Suspense } from "react";
import { ButtonLink } from "@/components/button-link";
import { JsonLd } from "@/components/json-ld";
import { Lines } from "@/components/lines";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { PillarVideos, Testimonials } from "@/components/media-blocks";
import { CtaLink } from "@/components/services/cta-link";
import { DealCheckForm } from "@/components/services/deal-check-form";
import { HeroStatement } from "@/components/services/hero-statement";
import { CtaBand, FaqList, FitLists, InsightFeed, OfferList } from "@/components/services/sections";
import { WorkCard } from "@/components/work-card";
import { insights, siteUrl } from "@/content/site";
import { introCta, pillarBySlug, pillarInsights, realEstate } from "@/content/services";
import { workBySlug, type WorkItem } from "@/content/work";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbSchema, graph, ids } from "@/lib/schema";

const pillar = pillarBySlug("real-estate");

export const metadata: Metadata = pageMetadata(
  "Real estate development in Portugal — deal checks, feasibility, development management",
  "From empty or underused to highest and best use. A free deal check, a 60-minute deal consultation, feasibility studies and financial models, and development management in Portugal.",
  pillar.href,
);

const checks = [
  "Purchase costs: transfer tax (IMT), stamp duty, notary and fees",
  "Cash needed, with and without a mortgage",
  "The yield in the listing against the yield after tax, fees and empty months",
  "Gaps between the listing, the photos and the paperwork",
];

export default function RealEstatePage() {
  const work = pillar.work.map((slug) => workBySlug(slug)).filter((item): item is WorkItem => Boolean(item));

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbSchema([["Services", "/services"], [pillar.title, pillar.href]]),
          {
            "@type": "Service",
            "@id": `${siteUrl}${pillar.href}#service`,
            name: pillar.title,
            serviceType: "Real estate development consulting",
            description: "Deal checks, feasibility studies and financial models, and development management for investors and developers in Portugal.",
            provider: { "@id": ids.organization },
            areaServed: [{ "@type": "Country", name: "Portugal" }],
            availableLanguage: ["English", "Hebrew"],
            url: `${siteUrl}${pillar.href}`,
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Ways to start",
              itemListElement: pillar.offers.map((offer) => ({
                "@type": "Offer",
                itemOffered: { "@type": "Service", name: offer.name },
                ...(offer.amount ? { price: offer.amount, priceCurrency: "EUR" } : {}),
              })),
            },
          },
          {
            "@type": "FAQPage",
            mainEntity: realEstate.faqs.map(([question, answer]) => ({
              "@type": "Question",
              name: question,
              acceptedAnswer: { "@type": "Answer", text: answer },
            })),
          },
        )}
      />
      <PageHero
        index="01"
        eyebrow="SERVICES · PLACES"
        title="Real estate | development."
        intro={pillar.subtitle}
        theme="brand"
        aside={<HeroStatement eyebrow="FOR" statement={pillar.forWhom} />}
        actions={
          <>
            <ButtonLink href="#deal-check" variant="dark">Check a deal, free</ButtonLink>
            <CtaLink cta={pillar.session} pageRef={pillar.ref} variant="outline" />
          </>
        }
      />

      <section className="section surface-muted" id="offers">
        <div className="container-wide">
          <SectionHeading eyebrow="WAYS TO START" title="Start with the numbers. | Then decide." intro="A free check on one listing, | a paid hour on one deal, | a fixed-scope study on one site." />
          <OfferList offers={pillar.offers} pageRef={pillar.ref} />
        </div>
      </section>

      <section className="section" id="deal-check">
        <div className="container-wide opportunity-layout">
          <div className="opportunity-intro">
            <p className="eyebrow">FREE DEAL CHECK</p>
            <h2><Lines text="Send a listing. | Get the real numbers back." /></h2>
            <p><Lines text="The return in a listing is usually gross: | before tax, fees and financing. | We work out what is left." /></p>
            <ul className="opportunity-checklist">
              {checks.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <Suspense>
            <DealCheckForm />
          </Suspense>
        </div>
      </section>

      <section className="section">
        <div className="container-wide">
          <SectionHeading eyebrow="WHO IT’S FOR" title="Investors and developers | who want the numbers first." intro="We work best on one deal or one site at a time, | with a decision to make." />
          <FitLists {...realEstate.fit} />
        </div>
      </section>

      <section className="section surface-muted">
        <div className="container-wide">
          <SectionHeading eyebrow="PROOF" title="We develop | what we advise on." intro="Arena, eleven homes in Barreiro, | and a licensed venture for stuck homes." />
          <div className="ventures-grid">
            {work.map((item, index) => <WorkCard item={item} featured={index === 0} key={item.slug} />)}
          </div>
        </div>
      </section>

      <Testimonials pillar="real-estate" />

      <PillarVideos pillar="real-estate" title="Deals and numbers, | in short videos." intro="How we read a listing, | price a project and spot the risks." />

      <InsightFeed insights={pillarInsights(pillar, insights)} title="Development and investing, | from real projects." intro="How we price, model and unblock | real properties in Portugal." />

      <section className="section surface-muted">
        <div className="container-wide diagram-row">
          <SectionHeading eyebrow="PARTNERSHIPS" title="Looking for a partner, | not a service?" intro="Owners, operators and capital partners | have their own paths into our projects." />
          <div className="button-row">
            <ButtonLink href="/partners/capital" variant="dark">Capital partners</ButtonLink>
            <CtaLink cta={{ label: "Bring an opportunity", href: "/bring-an-opportunity?path=opportunity", carryRef: true }} pageRef={pillar.ref} variant="outline" />
          </div>
        </div>
      </section>

      <FaqList eyebrow="QUESTIONS" title="Before you ask." items={realEstate.faqs} />

      <CtaBand
        eyebrow="ONE DEAL AT A TIME"
        title="Have a deal | on the table?"
        text="Book an hour to go through it together. | The fee is credited toward a feasibility study."
        primary={pillar.session}
        secondary={introCta("real-estate")}
        pageRef={pillar.ref}
      />
    </>
  );
}
