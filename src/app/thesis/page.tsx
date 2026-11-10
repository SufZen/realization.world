import type { Metadata } from "next";
import { Building2, Factory, Landmark, Waves } from "lucide-react";
import { ButtonLink } from "@/components/button-link";
import { EditorialMedia } from "@/components/editorial-media";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { pageMetadata } from "@/lib/metadata";
import { Lines } from "@/components/lines";

export const metadata: Metadata = pageMetadata(
  "Thesis",
  "Empty homes are rarely a market problem: they are stuck on paper, between people, or with no one holding the whole chain. Our current work is property; water, energy and cities are partnerships where the domain experts lead.",
  "/thesis",
);

/* Source: realization-studio brand/field-definition.md sections 1, 3, 6 and 10 (locked 7.11.2026). */

/** The four forms the problem takes: our current work. */
const forms = [
  ["Inheritances and partnerships", "Estates that were never split, | co-owners who disagree, | owners who live far away."],
  ["Paper that doesn’t match", "Extensions never registered, | the wrong designated use, | a registry that disagrees with the building."],
  ["Abandoned buildings", "Buildings left empty | until they became a problem | for the street or the town."],
  ["Stalled projects", "Sites and projects stuck | on a permit, on financing, | or with a developer who fell."],
] as const;

/** Adjacent fields: partnerships, not our current work. */
const adjacent = [
  { title: "Water and energy", icon: Waves },
  { title: "Cities and public systems", icon: Landmark },
  { title: "Construction", icon: Factory },
] as const;

export default function ThesisPage() {
  return (
    <>
      <PageHero
        index="01"
        eyebrow="OUR THESIS"
        title="An empty home | is rarely a market problem."
        intro="It is stuck on paper, between people, | or with no one holding the whole chain."
        actions={<><ButtonLink href="/work" variant="dark">See the work</ButtonLink><ButtonLink href="/bring-an-opportunity" variant="outline">Bring a case</ButtonLink></>}
        theme="brand"
        aside={<EditorialMedia src="/media/hero-physical-world.webp" alt="A team working around an architectural model of a stuck property" label="UNREALIZED REAL ESTATE" className="page-hero__media" />}
      />

      <section className="section">
        <div className="container-wide">
          <SectionHeading
            eyebrow="OUR WORK NOW: PROPERTY"
            title="One problem, | four forms."
            intro="Portugal is our lab, because there the problem is plainest. | It exists in every market, in different clothes."
          />
          <div className="content-grid">
            {forms.map(([title, text]) => (
              <article className="content-card" key={title}>
                <div className="content-card__icon"><Building2 size={24} strokeWidth={1.5} /></div>
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
            eyebrow="PARTNERSHIPS AND AREAS TO EXPLORE"
            title="Next to property, | the experts lead."
            intro="What we learn from property carries into these fields. | We join as partners and bring what we do best; | we don’t run them."
            inverse
          />
          <div className="principles-grid">
            {adjacent.map(({ title, icon: Icon }) => (
              <article className="principle" key={title}>
                <span className="principle__index"><Icon size={22} strokeWidth={1.5} /></span>
                <h3><Lines text={title} /></h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="statement-band"><div className="container"><p>We earn from the release, not from the distress. The owner has to come out better off.</p></div></div>
    </>
  );
}
