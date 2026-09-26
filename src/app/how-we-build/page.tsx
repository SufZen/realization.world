import type { Metadata } from "next";
import { ButtonLink } from "@/components/button-link";
import { PageHero } from "@/components/page-hero";
import { ProcessRibbon } from "@/components/process-ribbon";
import { SectionHeading } from "@/components/section-heading";
import { EvidenceTrack } from "@/components/studio-visuals";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "How We Build",
  "Realization’s Discover, Architect, Build, Validate and Transfer model for physical-world ventures.",
  "/how-we-build",
);

const gates = [
  ["Problem", "Is the physical-world friction consequential, repeated and understood by the people living it?"],
  ["Rights", "Are ownership, authority, data and access sufficient to test a real solution?"],
  ["Model", "Can value creation and value capture align without hiding dependency or risk?"],
  ["Regulation", "Is there a credible path through licensed, legal and data responsibilities?"],
  ["Operator", "Can a capable team own continuity and scale after validation?"],
  ["Evidence", "Can progress be defined, observed and published with permission?"],
] as const;

export default function HowWeBuildPage() {
  return (
    <>
      <PageHero
        index="02"
        eyebrow="HOW WE BUILD"
        title="Build. Prove. Transfer."
        intro="Founder judgment shapes the system. Evidence moves it forward. The right operator carries it on."
        actions={<ButtonLink href="/bring-an-opportunity">Test an opportunity</ButtonLink>}
        theme="dark"
      />

      <section className="section">
        <div className="container-wide">
          <SectionHeading
            eyebrow="THE FIVE STAGES"
            title="Evidence moves the venture."
            intro="Every stage earns the next—or stops the build."
          />
          <ProcessRibbon />
          <EvidenceTrack />
        </div>
      </section>

      <section className="section surface-brand">
        <div className="container-wide">
          <SectionHeading
            eyebrow="VALIDATION GATES"
            title="Six gates before scale."
            intro="A strong story is not enough."
          />
          <div className="criteria-grid">
            {gates.map(([title, text], index) => <article className="criteria-card" key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="section surface-dark">
        <div className="container-wide">
          <SectionHeading
            eyebrow="TRANSFER BY DESIGN"
            title="Continuity starts on day one."
            intro="Operator, rights, decisions, data and evidence are designed in from the start."
            inverse
          />
          <div className="principles-grid">
            <article className="principle"><span className="principle__index">BUILT BY</span><h3>Realization</h3><p>Research, architecture, product, technology and validation.</p></article>
            <article className="principle"><span className="principle__index">OPERATED BY</span><h3>The right partner</h3><p>Execution, local responsibility, team, continuity and scale.</p></article>
            <article className="principle"><span className="principle__index">OWNED BY</span><h3>The defined venture entity</h3><p>IP, equity, data and contract rights made explicit for the chosen structure.</p></article>
            <article className="principle"><span className="principle__index">EVIDENCED BY</span><h3>Verified outcomes</h3><p>Permissioned claims with a source, date, definition and method.</p></article>
          </div>
          <div className="button-row"><ButtonLink href="/partners/operators" variant="primary">Explore operating partnerships</ButtonLink></div>
        </div>
      </section>
    </>
  );
}
