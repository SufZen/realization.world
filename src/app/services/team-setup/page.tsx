import type { Metadata } from "next";
import Image from "next/image";
import { JsonLd } from "@/components/json-ld";
import { Lines } from "@/components/lines";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { PillarVideos, Testimonials } from "@/components/media-blocks";
import { CtaLink } from "@/components/services/cta-link";
import { CtaBand, FaqList, FitLists, InsightFeed } from "@/components/services/sections";
import styles from "@/components/services/services.module.css";
import { insights, siteUrl } from "@/content/site";
import { delivery, pillarBySlug, pillarInsights } from "@/content/services";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbSchema, graph, ids } from "@/lib/schema";

const pillar = pillarBySlug("delivery");

export const metadata: Metadata = pageMetadata(
  "Team and process setup — roles, workflows, training and handoff",
  "Clear roles, working processes and a trained team for a development project or a growing firm, handed over on a date written into the proposal. Not construction management.",
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
            description: "Team and process setup for development projects and growing firms: roles, workflows, training and a handoff date.",
            provider: { "@id": ids.organization },
            areaServed: [{ "@type": "Country", name: "Portugal" }, { "@type": "Country", name: "Israel" }, { "@type": "Country", name: "Spain" }],
            availableLanguage: ["English", "Hebrew"],
            url: `${siteUrl}${pillar.href}`,
            image: `${siteUrl}${delivery.image.src}`,
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
        actions={
          <>
            <CtaLink cta={pillar.session} pageRef={pillar.ref} variant="dark" />
          </>
        }
      />

      <section className="section">
        <div className={`container-wide ${styles.setup}`}>
          <div className={styles.setupImage}>
            <Image src={delivery.image.src} alt={delivery.image.alt} fill sizes="(max-width: 900px) 100vw, 55vw" />
          </div>
          <div>
            <SectionHeading eyebrow="WHAT YOU KEEP" title="Four things | stay when we leave." intro="For a development project, or a firm | that has outgrown working it out as it goes." />
            <ul className={styles.outcomes}>
              {delivery.outcomes.map(([title, text]) => <li key={title}><strong>{title}</strong><span><Lines text={text} /></span></li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="section surface-brand">
        <div className="container-wide">
          <SectionHeading eyebrow="BEFORE THE SETUP CALL" title="Three questions | we will ask." intro="Rough answers are enough." />
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
          <SectionHeading eyebrow="WHO IT’S FOR" title="Clear roles and processes, | not another manager." intro={pillar.forWhom} />
          <FitLists {...delivery.fit} />
        </div>
      </section>

      <Testimonials pillar="delivery" surface="surface-muted" />

      <PillarVideos pillar="delivery" title="Teams and handoff, | in short videos." />

      <InsightFeed insights={pillarInsights(pillar, insights)} title="Ownership and handoff, | from real projects." />

      <FaqList eyebrow="QUESTIONS" title="Before you ask." items={delivery.faqs} />

      <CtaBand
        eyebrow="START WITH 30 MINUTES"
        title="Too many decisions | still waiting for you?"
        text="Thirty minutes is enough | to know whether it fits."
        primary={pillar.session}
        pageRef={pillar.ref}
      />
    </>
  );
}
