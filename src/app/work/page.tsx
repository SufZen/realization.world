import type { Metadata } from "next";
import { ButtonLink } from "@/components/button-link";
import { JsonLd } from "@/components/json-ld";
import { Lines } from "@/components/lines";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { WorkCard } from "@/components/work-card";
import { bookingUrl, siteUrl } from "@/content/site";
import { work, workCategories, workInCategory } from "@/content/work";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbSchema, graph } from "@/lib/schema";

export const metadata: Metadata = pageMetadata(
  "Work — projects, ventures and systems",
  "The Realization portfolio: residential development in the Lisbon area, a property-resolution venture, AI systems we build and run, and advisory engagements on AI adoption.",
  "/work",
);

export default function WorkPage() {
  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbSchema([["Work", "/work"]]),
          {
            "@type": "CollectionPage",
            name: "Realization — Work",
            url: `${siteUrl}/work`,
            hasPart: work.map((item) => ({ "@type": "WebPage", name: item.name, url: `${siteUrl}/work/${item.slug}` })),
          },
        )}
      />
      <PageHero
        index="W"
        eyebrow="WORK & PORTFOLIO"
        title="Proof, | not promises."
        intro="Real estate we develop, ventures we build, | systems we run and engagements we lead."
        actions={<><ButtonLink href="/bring-an-opportunity" variant="dark">Bring an opportunity</ButtonLink><ButtonLink href={bookingUrl} variant="outline">Book a 30-min intro</ButtonLink></>}
        theme="brand"
      />

      <nav className="work-filter container-wide" aria-label="Portfolio categories">
        {workCategories.map((category) => (
          <a href={`#${category.id}`} key={category.id}>
            {category.label} <span>{workInCategory(category).length}</span>
          </a>
        ))}
      </nav>

      {workCategories.map((category, index) => (
        <section className={`section ${index % 2 ? "surface-muted" : ""}`} id={category.id} key={category.id}>
          <div className="container-wide">
            <SectionHeading eyebrow={`0${index + 1} · ${category.label.toUpperCase()}`} title={category.label} intro={category.intro} />
            <div className="ventures-grid">
              {workInCategory(category).map((item) => <WorkCard item={item} key={item.slug} />)}
            </div>
          </div>
        </section>
      ))}

      <section className="cta-band">
        <div className="container-wide cta-band__grid">
          <div>
            <p className="eyebrow">NEXT IN THE PORTFOLIO</p>
            <h2><Lines text="What should | we build together?" /></h2>
            <p><Lines text="A stuck asset, a capital mandate | or an organisation ready for AI." /></p>
          </div>
          <ButtonLink href="/bring-an-opportunity" variant="dark">Start the conversation</ButtonLink>
        </div>
      </section>
    </>
  );
}
