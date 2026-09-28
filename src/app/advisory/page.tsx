import type { Metadata } from "next";
import { ButtonLink } from "@/components/button-link";
import { JsonLd } from "@/components/json-ld";
import { Lines } from "@/components/lines";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { WorkCard } from "@/components/work-card";
import { bookingUrl, siteUrl } from "@/content/site";
import { workBySlug, type WorkItem } from "@/content/work";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbSchema, graph, ids } from "@/lib/schema";

export const metadata: Metadata = pageMetadata(
  "Advisory — AI adoption and operations",
  "Realization helps professional firms and real-estate operators decide where AI starts, prove it on one measured pilot, and hand over a system the team owns. Fixed-scope stages with a built-in exit.",
  "/advisory",
);

const briefHref = "/bring-an-opportunity?path=advisory&ref=advisory";

const stages = [
  ["Stage 0", "Focused discovery", "Two to three in-depth sessions. | We name the problem in your words, | take three management decisions | and check what you already pay for.", "A decisions document, a tiered roadmap | and agreed success measures — yours to keep."],
  ["Stage 1", "Guided pilot", "Three to five weeks, one work domain, | two people. We choose the tools and guide the build; | your team operates and tests it.", "A working process in production, | measured before and after on real cases."],
  ["Stage 2", "Tapering support", "Around ten to twelve advisory hours a month, | tapering from full to half to a quarter | and ending at month twelve.", "A team that runs and extends | the system without us."],
  ["Add-on", "Team workshops", "Sessions built on your own cases: | how to spot where AI fits | and match the right tool to it.", "People who find the next use case | themselves."],
] as const;

const principles = [
  ["Buy first, build for the gap", "We test what the market offers and what you already license | before anyone writes code."],
  ["Human in the loop, always", "The system prepares the work. | Professional judgement stays with your people."],
  ["The knowledge stays with you", "Everything is documented and handed over. | Our support is designed to end."],
  ["Start small, measure honestly", "One domain, a small group, a pass mark agreed in advance — | and a stop rule if it misses."],
] as const;

const faqs = [
  ["How quickly will we see a result?", "Discovery takes two to three sessions. A pilot runs three to five weeks, and most of that time is quality checks against real cases rather than building. In our modelled case, the programme breaks even in month seven."],
  ["How much of our team’s time does it take?", "Two kinds of time. One internal lead for four to six hours a week, and two to three hours a week from each pilot participant, mostly reviewing outputs. We ask for those hours in the proposal, because without them the work does not happen."],
  ["Do we have to use RealizeOS or your other systems?", "No. We start with what you already pay for and what the market offers. RealizeOS, MeetSum and our other systems are options when they fit the gap, not a requirement."],
  ["What does it cost?", "Each stage is priced as a separate, fixed unit before it starts, and you can stop after any stage. Discovery is deliberately a small first commitment. Ask for a proposal after a 30-minute intro call."],
  ["Where do you work, and in which languages?", "Remotely, and in person in the Lisbon area and Barcelona. We work in English and Hebrew, with basic Portuguese and Spanish."],
  ["Can you also run operations or a development project for us?", "Yes. Asaf Eyzenkot takes a limited number of fractional operations and development-management roles, contracted through Realization Unipessoal LDA."],
] as const;

export default function AdvisoryPage() {
  const flagship = workBySlug("ai-adoption-architecture-firm")!;
  const systems = ["realizeos", "meetsum", "lifebook"].map((slug) => workBySlug(slug)).filter((item): item is WorkItem => Boolean(item));

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbSchema([["Advisory", "/advisory"]]),
          {
            "@type": "Service",
            "@id": `${siteUrl}/advisory#service`,
            name: "AI adoption and operations advisory",
            serviceType: "AI adoption consulting",
            description: "Discovery, a measured pilot and tapering support that move a professional firm from scattered AI experiments to one measured programme it owns.",
            provider: { "@id": ids.organization },
            areaServed: [{ "@type": "Country", name: "Portugal" }, { "@type": "Country", name: "Israel" }, { "@type": "Country", name: "Spain" }],
            availableLanguage: ["English", "Hebrew"],
            url: `${siteUrl}/advisory`,
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Engagement stages",
              itemListElement: stages.map(([, name]) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
            },
          },
          {
            "@type": "FAQPage",
            mainEntity: faqs.map(([question, answer]) => ({
              "@type": "Question",
              name: question,
              acceptedAnswer: { "@type": "Answer", text: answer },
            })),
          },
        )}
      />
      <PageHero
        index="A"
        eyebrow="ADVISORY · AI & OPERATIONS"
        title="AI that pays back, | in the right order."
        intro="We help professional firms and operators decide where AI starts, | prove it on one measured problem, | and hand over a system the team owns."
        theme="dark"
        actions={<><ButtonLink href={bookingUrl} variant="primary">Book a 30-min intro</ButtonLink><ButtonLink href={briefHref} variant="outline">Send a brief</ButtonLink></>}
      />

      <section className="section">
        <div className="container-wide">
          <SectionHeading
            eyebrow="WHO IT’S FOR"
            title="Busy teams with the tools, | but not the time."
            intro="The gap is rarely access or understanding. | It is deciding what to do first, who owns it | and protecting the hours to do it."
          />
          <div className="fit-grid">
            <article className="fit-list"><h3>A strong fit</h3><ul><li>Professional firms of 10–100 people: architecture, engineering, legal, real estate</li><li>Developers and operators with repetitive document work</li><li>Founders who want an AI operation that belongs to the business</li></ul></article>
            <article className="fit-list"><h3>Not yet a fit</h3><ul><li>Teams looking for a tool demo, not a change in how work gets done</li><li>Programmes with no one who can give four hours a week</li><li>Projects that must start with the most sensitive data</li></ul></article>
          </div>
        </div>
      </section>

      <section className="section surface-dark">
        <div className="container-wide">
          <SectionHeading eyebrow="THE ENGAGEMENT" title="Separate stages. | A stop point after each." intro="There is no commitment to the sequence. | The retainer tapers on a schedule written into the proposal." inverse />
          <div className="principles-grid">
            {stages.map(([index, title, text, output]) => (
              <article className="principle" key={title}>
                <span className="principle__index">{index.toUpperCase()}</span>
                <h3>{title}</h3>
                <p><Lines text={text} /></p>
                <p className="principle__output"><strong>You get:</strong> <Lines text={output} /></p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-wide">
          <SectionHeading eyebrow="GROUND RULES" title="Four principles, | agreed before any tool." intro="Tools change. | These are what keep a programme alive | in a busy organisation." />
          <div className="journey-grid">
            {principles.map(([title, text], index) => (
              <article className="journey-step" key={title}>
                <span className="journey-step__number">0{index + 1}</span>
                <h3><Lines text={title} /></h3>
                <p><Lines text={text} /></p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section surface-muted">
        <div className="container-wide">
          <SectionHeading eyebrow="PROOF" title="The method, in a real firm." intro="A 25-person architecture practice: | eight domains mapped, one pilot chosen, | break-even modelled at month seven." />
          <div className="ventures-grid">
            <WorkCard item={flagship} featured />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-wide">
          <SectionHeading eyebrow="SYSTEMS WE BUILT AND RUN" title="We use what we recommend." intro="Our own operations run on AI systems we designed. | They are options for you, never a requirement." />
          <div className="ventures-grid">
            {systems.map((item) => <WorkCard item={item} key={item.slug} />)}
          </div>
        </div>
      </section>

      <section className="section surface-muted">
        <div className="container-wide diagram-row">
          <SectionHeading
            eyebrow="ALSO AVAILABLE"
            title="Fractional operations | and development management."
            intro="Asaf Eyzenkot takes a limited number of B2B roles: | operating models, project coordination | and real-estate development management."
          />
          <div className="button-row"><ButtonLink href="/asaf" variant="dark">See Asaf’s profile</ButtonLink><ButtonLink href={bookingUrl} variant="outline">Book a 30-min intro</ButtonLink></div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="QUESTIONS" title="Before you ask." />
          <div className="faq-list">
            {faqs.map(([question, answer]) => (
              <details className="faq-item" key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container-wide cta-band__grid">
          <div>
            <p className="eyebrow">START WITH DISCOVERY</p>
            <h2><Lines text="Where should AI | start in your firm?" /></h2>
            <p><Lines text="Thirty minutes is enough | to know whether discovery is worth it." /></p>
          </div>
          <ButtonLink href={bookingUrl} variant="dark">Book a 30-min intro</ButtonLink>
        </div>
      </section>
    </>
  );
}
