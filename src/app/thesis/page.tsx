import type { Metadata } from "next";
import { ButtonLink } from "@/components/button-link";
import { EditorialMedia } from "@/components/editorial-media";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { thesisDomains } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { Lines } from "@/components/lines";

export const metadata: Metadata = pageMetadata(
  "Thesis",
  "Why Realization builds ventures around untapped potential in property, infrastructure, places, water, energy and physical-world operations.",
  "/thesis",
);

const principles = [
  ["Potential precedes product", "We begin with a real physical need, | not a software feature looking for a market."],
  ["Systems unlock value", "The blocker is rarely one missing service. | It is a fragmented system."],
  ["Digital creates leverage", "Technology matters when it organizes | the real-world process."],
  ["Evidence earns expansion", "A venture advances on demand, economics, | regulation and an operator path."],
  ["Operation is a distinct craft", "The team that imagines a venture | may not be the one to run it."],
  ["Clarity compounds trust", "Ownership, operation, data and status | stay visible."],
] as const;

export default function ThesisPage() {
  return (
    <>
      <PageHero
        index="01"
        eyebrow="OUR THESIS"
        title="Value hides | in broken systems."
        intro="Assets stay stuck when rights, people and operations don’t connect. | That missing system is the opportunity."
        actions={<><ButtonLink href="/how-we-build" variant="dark">See how we build</ButtonLink><ButtonLink href="/bring-an-opportunity" variant="outline">Bring a case</ButtonLink></>}
        theme="brand"
        aside={<EditorialMedia src="/media/hero-physical-world.png" alt="A team mapping a physical-world venture around an architectural model" label="THE MISSING LAYER" className="page-hero__media" />}
      />

      <section className="section">
        <div className="container-wide">
          <SectionHeading
            eyebrow="WHERE WE LOOK"
            title="Where systems shape reality."
            intro="We focus where a better system | changes a lasting physical outcome."
          />
          <div className="content-grid">
            {thesisDomains.map(({ title, text, icon: Icon }) => (
              <article className="content-card" key={title}>
                <div className="content-card__icon"><Icon size={24} strokeWidth={1.5} /></div>
                <h3><Lines text={title} /></h3>
                <p><Lines text={text} /></p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section surface-dark">
        <div className="container-wide">
          <SectionHeading
            eyebrow="SIX PRINCIPLES"
            title="Six rules. No theatre."
            intro="The discipline behind every venture decision."
            inverse
          />
          <div className="principles-grid">
            {principles.map(([title, text], index) => (
              <article className="principle" key={title}>
                <span className="principle__index">0{index + 1}</span>
                <h3><Lines text={title} /></h3>
                <p><Lines text={text} /></p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="statement-band"><div className="container"><p>Physical potential → digital systems → realized value.</p></div></div>

      <section className="section">
        <div className="container-wide">
          <SectionHeading
            eyebrow="A DELIBERATE BOUNDARY"
            title="Build the venture. | End the dependency."
            intro="The outcome is a defined system with clear ownership and an operating future."
          />
          <div className="fit-grid">
            <article className="fit-list"><h3>What Realization owns at the start</h3><ul><li>Vision and problem definition</li><li>Venture and system architecture</li><li>Product, workflow and technology design</li><li>Evidence design and early validation</li><li>Operator criteria and transfer architecture</li></ul></article>
            <article className="fit-list"><h3>What scale requires next</h3><ul><li>A capable and accountable operator</li><li>Explicit legal, data and regulatory roles</li><li>Repeatable operating knowledge</li><li>Capital matched to stage and instrument</li><li>Governance for continuity beyond the founder</li></ul></article>
          </div>
        </div>
      </section>
    </>
  );
}
