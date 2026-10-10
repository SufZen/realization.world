import type { Metadata } from "next";
import Image from "next/image";
import { JsonLd } from "@/components/json-ld";
import { Lines } from "@/components/lines";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { PillarVideos, Testimonials } from "@/components/media-blocks";
import { CtaLink } from "@/components/services/cta-link";
import { HeroStatement } from "@/components/services/hero-statement";
import { CtaBand, FaqList, FitLists, InsightFeed, OfferList } from "@/components/services/sections";
import styles from "@/components/services/services.module.css";
import { insights, siteUrl } from "@/content/site";
import { delivery, introCta, pillarBySlug, pillarInsights } from "@/content/services";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbSchema, graph, ids } from "@/lib/schema";

const pillar = pillarBySlug("delivery");

export const metadata: Metadata = pageMetadata(
  "Team and process setup — roles, workflows, training and handoff",
  "We build the machine, train the team, and hand it over: clear roles, working processes and a trained team for a development project or a growing firm, with a handoff date agreed at the start. Not construction management.",
  pillar.href,
);

export default function TeamSetupPage() {
  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbSchema([["Services", "/services"], [pillar.title, pillar.href]]),
          {
            "@type": "Service",
            "@id": `${siteUrl}${pillar.href}#service`,
            name: pillar.title,
            serviceType: "Operations consulting",
            description: "Team and process setup for development projects and growing firms: roles, workflows, training and a handoff date. Also fractional operations or development management.",
            provider: { "@id": ids.organization },
            areaServed: [{ "@type": "Country", name: "Portugal" }, { "@type": "Country", name: "Israel" }, { "@type": "Country", name: "Spain" }],
            availableLanguage: ["English", "Hebrew"],
            url: `${siteUrl}${pillar.href}`,
            image: `${siteUrl}${delivery.image.src}`,
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Ways to start",
              itemListElement: pillar.offers.map((offer) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: offer.name } })),
            },
          },
          {
            "@type": "FAQPage",
            mainEntity: delivery.faqs.map(([question, answer]) => ({
              "@type": "Question",
              name: question,
              acceptedAnswer: { "@type": "Answer", text: answer },
            })),
          },
        )}
      />
      <PageHero
        index="03"
        eyebrow="SERVICES · TEAMS"
        title="Team and | process setup."
        intro={pillar.subtitle}
        theme="light"
        aside={<HeroStatement eyebrow="FOR" statement={pillar.forWhom} />}
        actions={
          <>
            <CtaLink cta={pillar.session} pageRef={pillar.ref} variant="dark" />
            <CtaLink cta={introCta("delivery")} pageRef={pillar.ref} variant="outline" />
          </>
        }
      />

      <section className="section">
        <div className={`container-wide ${styles.setup}`}>
          <div className={styles.setupImage}>
            <Image src={delivery.image.src} alt={delivery.image.alt} fill sizes="(max-width: 900px) 100vw, 55vw" />
          </div>
          <div>
            <SectionHeading eyebrow="WHAT A SETUP LEAVES BEHIND" title="A machine | your team runs." intro="For a development project, or a firm | that has outgrown working it out as it goes." />
            <ul className={styles.outcomes}>
              {delivery.outcomes.map(([title, text]) => <li key={title}><strong>{title}</strong><span><Lines text={text} /></span></li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="section surface-muted">
        <div className="container-wide">
          <SectionHeading eyebrow="HOW IT WORKS" title="Built to be | handed over." intro="Every engagement ends on a handoff date | agreed at the start." />
          <div className={`journey-grid ${styles.tabletTwo}`}>
            {delivery.steps.map(([title, text], index) => (
              <article className="journey-step" key={title}>
                <span className="journey-step__number">0{index + 1}</span>
                <h3>{title}</h3>
                <p><Lines text={text} /></p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="offers">
        <div className="container-wide">
          <SectionHeading eyebrow="WAYS TO START" title="Three ways in." intro="A free intro, a fixed-scope setup, | or a fractional role while the team grows." />
          <OfferList offers={pillar.offers} pageRef={pillar.ref} />
        </div>
      </section>

      <section className="section surface-brand">
        <div className="container-wide">
          <SectionHeading eyebrow="BEFORE THE INTRO" title="Three questions | we will ask." intro="Rough answers are enough. | They tell us both whether this fits." />
          <ol className={styles.questions}>
            {delivery.questions.map((question) => <li key={question}><Lines text={question} /></li>)}
          </ol>
          <div className="button-row">
            <CtaLink cta={pillar.session} pageRef={pillar.ref} variant="dark" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-wide">
          <SectionHeading eyebrow="WHO IT’S FOR" title="Clear roles and processes, | not another manager." />
          <FitLists {...delivery.fit} />
        </div>
      </section>

      <Testimonials pillar="delivery" surface="surface-muted" />

      <PillarVideos pillar="delivery" title="Teams and handoff, | in short videos." />

      <InsightFeed insights={pillarInsights(pillar, insights)} title="Ownership and handoff, | from real projects." />

      <FaqList eyebrow="QUESTIONS" title="Before you ask." items={delivery.faqs} />

      <CtaBand
        eyebrow="START WITH 30 MINUTES"
        title="Need the machine built, | not another manager?"
        text="Thirty minutes and three questions | tell us both whether it fits."
        primary={pillar.session}
        secondary={introCta("delivery")}
        pageRef={pillar.ref}
      />
    </>
  );
}
