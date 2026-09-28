import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/button-link";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { pageMetadata } from "@/lib/metadata";
import { Lines } from "@/components/lines";

export const metadata: Metadata = pageMetadata(
  "About",
  "The purpose, founder role and operating principles behind Realization: real estate, ventures and systems.",
  "/about",
);

const values = [
  ["01", "Integration", "Connect potential, architecture | and technology into one system."],
  ["02", "Evidence", "Move on observed reality. | State uncertainty plainly."],
  ["03", "Ownership", "Make rights, operation | and data control visible."],
  ["04", "Leverage", "Put founder attention | where architecture matters most."],
  ["05", "Continuity", "Design for an operator | who can grow beyond the studio."],
  ["06", "Meaning", "Create value that matters | to owners, users and places."],
] as const;

export default function AboutPage() {
  return (
    <>
      <PageHero
        index="07"
        eyebrow="ABOUT REALIZATION"
        title="Vision | into reality."
        intro="Founded by Asaf Eyzenkot (Suf Zen). | Real estate, ventures and the systems that connect them."
        actions={<ButtonLink href="/thesis" variant="dark">Read the thesis</ButtonLink>}
        theme="brand"
      />

      <section className="section">
        <div className="container-wide about-founder">
          <div className="founder-mark">
            <Image className="founder-portrait" src="/asaf/asaf-eyzenkot.jpg" alt="Asaf Eyzenkot (Suf Zen), founder of Realization" width={480} height={480} sizes="(max-width: 760px) 60vw, 26vw" />
          </div>
          <div className="about-founder__copy">
            <p className="eyebrow">FOUNDER</p>
            <h2>Asaf Eyzenkot<br />(Suf Zen)</h2>
            <h3>Connecting the abstract with the tangible.</h3>
            <p><Lines text="Asaf is drawn to the logic behind complex systems, | and to making it clear, useful and real." /></p>
            <p><Lines text="He works between Israel, Portugal and Barcelona: | real estate development, venture architecture | and the systems behind them." /></p>
            <p><Lines text="He leads vision, architecture and validation, | and builds ventures that do not depend on him to run." /></p>
            <div className="button-row"><a className="button button--dark" href="/asaf"><span>Founder profile</span></a><ButtonLink href="/how-we-build" variant="outline">How the role works</ButtonLink></div>
          </div>
        </div>
      </section>

      <section className="section surface-brand">
        <div className="container-wide">
          <SectionHeading eyebrow="GUIDING PRINCIPLES" title="Clarity compounds." intro="The monarch stands for transformation, | and the reach of one well-placed intervention." />
          <div className="about-values">
            {values.map(([index, title, text]) => <article className="about-value" key={title}><span>{index}</span><h3><Lines text={title} /></h3><p><Lines text={text} /></p></article>)}
          </div>
        </div>
      </section>

      <section className="section surface-dark"><div className="container-wide"><SectionHeading eyebrow="THE STUDIO ROLE" title="Build the conditions. | Transfer the operation." intro="We originate and architect. | Partners own the operation." inverse /><div className="button-row"><ButtonLink href="/work" variant="primary">Explore the work</ButtonLink><ButtonLink href="/partners" variant="outline">See partner paths</ButtonLink></div></div></section>
    </>
  );
}
