import type { Metadata } from "next";
import { ButtonLink } from "@/components/button-link";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { VentureCard } from "@/components/venture-card";
import { futureVenture, ventures } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Ventures",
  "The Realization portfolio: physical-world ventures and operating platforms built through an explicit evidence and transfer model.",
  "/ventures",
);

export default function VenturesPage() {
  const FutureIcon = futureVenture.icon;
  return (
    <>
      <PageHero
        index="03"
        eyebrow="VENTURES & PORTFOLIO"
        title="Built to become real."
        intro="Not assignments. Ventures with a problem, a system, a status and an operating path."
        actions={<ButtonLink href="/bring-an-opportunity" variant="dark">Bring the next opportunity</ButtonLink>}
        theme="brand"
      />

      <section className="section">
        <div className="container-wide">
          <SectionHeading
            eyebrow="CURRENT PORTFOLIO"
            title="Two ventures. One method."
            intro="Property resolution in Portugal. Operating intelligence for physical-world teams."
          />
          <div className="ventures-grid">
            {ventures.map((venture, index) => <VentureCard venture={venture} featured={index === 0} key={venture.slug} />)}
          </div>
        </div>
      </section>

      <section className="section surface-muted">
        <div className="container-wide">
          <SectionHeading
            eyebrow="FUTURE VENTURES"
            title="Evidence earns an identity."
            intro="A name is not a venture."
          />
          <article className="venture-card">
            <div className="venture-card__top"><div className="venture-card__icon"><FutureIcon size={27} strokeWidth={1.5} /></div><span className="status status--verify">{futureVenture.stage}</span></div>
            <p className="eyebrow">{futureVenture.eyebrow}</p>
            <h3>{futureVenture.name}</h3>
            <p>{futureVenture.descriptor}</p>
          </article>
        </div>
      </section>

      <section className="section surface-dark">
        <div className="container-wide">
          <SectionHeading eyebrow="PORTFOLIO GOVERNANCE" title="Status tells the truth." intro="One lifecycle language separates a hypothesis from an operation." inverse />
          <div className="process-ribbon process-ribbon--compact">
            {["Exploring", "Validating", "Building", "Partnering", "Operating"].map((status, index) => <article className="process-step" key={status}><div className="process-step__number">0{index + 1}</div><div><h3>{status}</h3></div></article>)}
          </div>
          <p style={{ marginTop: "1.5rem", color: "rgba(255,255,255,.62)", fontSize: ".82rem" }}>Additional closed-loop statuses: Transferred · Archived.</p>
        </div>
      </section>
    </>
  );
}
