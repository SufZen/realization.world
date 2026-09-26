import type { Metadata } from "next";
import { ButtonLink } from "@/components/button-link";
import { PageHero } from "@/components/page-hero";
import { ProcessRibbon } from "@/components/process-ribbon";
import { SectionHeading } from "@/components/section-heading";
import { EvidenceTrack } from "@/components/studio-visuals";
import { pageMetadata } from "@/lib/metadata";
import { Lines } from "@/components/lines";

export const metadata: Metadata = pageMetadata(
  "How We Build",
  "Realization’s Discover, Architect, Build, Validate and Transfer model for physical-world ventures.",
  "/how-we-build",
);

const gates = [
  ["Problem", "Is the friction real, repeated | and understood by those living it?"],
  ["Rights", "Are ownership, access and data | enough to test a real solution?"],
  ["Model", "Can value creation and capture align | without hidden risk?"],
  ["Regulation", "Is there a credible path | through licensed and legal duties?"],
  ["Operator", "Can a capable team | own continuity and scale?"],
  ["Evidence", "Can progress be observed | and published with permission?"],
] as const;

export default function HowWeBuildPage() {
  return (
    <>
      <PageHero
        index="02"
        eyebrow="HOW WE BUILD"
        title="Build. Prove. | Transfer."
        intro="Judgment shapes the system. Evidence moves it forward. | The right operator carries it on."
        actions={<ButtonLink href="/bring-an-opportunity">Test an opportunity</ButtonLink>}
        theme="dark"
      />

      <section className="section">
        <div className="container-wide">
          <SectionHeading
            eyebrow="THE FIVE STAGES"
            title="Evidence moves the venture."
            intro="Every stage earns the next, | or stops the build."
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
            {gates.map(([title, text], index) => <article className="criteria-card" key={title}><span>0{index + 1}</span><h3><Lines text={title} /></h3><p><Lines text={text} /></p></article>)}
          </div>
        </div>
      </section>

      <section className="section surface-dark">
        <div className="container-wide">
          <SectionHeading
            eyebrow="TRANSFER BY DESIGN"
            title="Continuity starts on day one."
            intro="Operator, rights and evidence | are designed in from day one."
            inverse
          />
          <div className="principles-grid">
            <article className="principle"><span className="principle__index">BUILT BY</span><h3>Realization</h3><p><Lines text="Research, architecture, product | and validation." /></p></article>
            <article className="principle"><span className="principle__index">OPERATED BY</span><h3>The right partner</h3><p><Lines text="Execution, local responsibility, | continuity and scale." /></p></article>
            <article className="principle"><span className="principle__index">OWNED BY</span><h3>The defined venture entity</h3><p><Lines text="IP, equity, data and contracts, | made explicit." /></p></article>
            <article className="principle"><span className="principle__index">EVIDENCED BY</span><h3>Verified outcomes</h3><p><Lines text="Permitted claims with a source, | date and method." /></p></article>
          </div>
          <div className="button-row"><ButtonLink href="/partners/operators" variant="primary">Explore operating partnerships</ButtonLink></div>
        </div>
      </section>
    </>
  );
}
