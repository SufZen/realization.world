import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/button-link";
import { EditorialMedia } from "@/components/editorial-media";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { ventures } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { Lines } from "@/components/lines";
import { AreaGapDiagram } from "@/components/diagrams";

export function generateStaticParams() {
  return ventures.map((venture) => ({ slug: venture.slug }));
}

export async function generateMetadata({ params }: PageProps<"/ventures/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const venture = ventures.find((entry) => entry.slug === slug);
  if (!venture) return {};
  return pageMetadata(venture.name, venture.descriptor, `/ventures/${venture.slug}`);
}

export default async function VenturePage({ params }: PageProps<"/ventures/[slug]">) {
  const { slug } = await params;
  const venture = ventures.find((entry) => entry.slug === slug);
  if (!venture) notFound();
  const isPortugal = venture.slug === "realization-portugal";

  return (
    <>
      <PageHero
        index="V"
        eyebrow={venture.eyebrow}
        title={venture.name.split(" ").join(" | ")}
        intro={venture.descriptor}
        theme={isPortugal ? "brand" : "dark"}
        actions={isPortugal ? <ButtonLink href="/bring-an-opportunity" variant="dark">Bring a property case</ButtonLink> : venture.externalHref ? <ButtonLink href={venture.externalHref} variant="primary">View on GitHub</ButtonLink> : undefined}
        aside={<EditorialMedia src={venture.image} alt={venture.imageAlt} label={venture.stage.toUpperCase()} className="page-hero__media" />}
      />

      <section className="section">
        <div className="container-wide venture-detail">
          <aside className="venture-detail__aside">
            <p className="eyebrow">VENTURE STATUS</p>
            <span className={`status status--${venture.stage === "Active" ? "active" : "verify"}`}>{venture.stage}</span>
            <p><Lines text={venture.ask} /></p>
          </aside>
          <div>
            <SectionHeading eyebrow="CASE STUDY" title="The system. Clearly." align="stack" />
            <dl className="venture-detail__facts">
              <div className="venture-fact"><dt>The problem</dt><dd><Lines text={venture.problem} /></dd></div>
              <div className="venture-fact"><dt>The system</dt><dd><Lines text={venture.system} /></dd></div>
              <div className="venture-fact"><dt>Realization</dt><dd><Lines text={venture.realizationRole} /></dd></div>
              <div className="venture-fact"><dt>Operator path</dt><dd><Lines text={venture.operator} /></dd></div>
              <div className="venture-fact"><dt>Evidence</dt><dd><Lines text={venture.evidence} /></dd></div>
              <div className="venture-fact"><dt>Current ask</dt><dd>{venture.ask}</dd></div>
            </dl>
          </div>
        </div>
      </section>

      {isPortugal && (
        <section className="section surface-muted">
          <div className="container-wide diagram-row">
            <SectionHeading eyebrow="THE PROBLEM, DRAWN" title="Three areas. | One building." intro="When registry, licence and building disagree, | the property cannot move." />
            <figure className="diagram diagram--panel"><AreaGapDiagram /><figcaption>Only the yellow part exists on paper.</figcaption></figure>
          </div>
        </section>
      )}

      <section className="section surface-dark">
        <div className="container-wide">
          <SectionHeading
            eyebrow={isPortugal ? "DESIGNED PATH" : "PLATFORM ROLE"}
            title={isPortugal ? "Deadlock → | resolution." : "Context → | coordinated action."}
            intro={isPortugal
              ? "The venture organizes diagnosis and coordination, | keeping regulated work with licensed parties."
              : "RealizeOS connects knowledge, agents and workflows for a lean team. | We share it freely and keep improving it."}
            inverse
          />
          <div className="principles-grid">
            {(isPortugal
              ? [["01", "Diagnose", "Structure the case, rights, | blockers and missing evidence."], ["02", "Blueprint", "Create a coordinated path | and decision sequence."], ["03", "Coordinate", "Work through licensed professionals | and responsible parties."], ["04", "Resolve", "Reach a documented outcome | and capture permitted evidence."]]
              : [["01", "Context", "A durable knowledge | and identity layer."], ["02", "Agents", "Specialized agents | on governed routines and tools."], ["03", "Traceability", "An event log of what acted, | when and why."], ["04", "Open", "Free to use and source-available, | improved through real use."]]
            ).map(([index, title, text]) => <article className="principle" key={title}><span className="principle__index">{index}</span><h3><Lines text={title} /></h3><p><Lines text={text} /></p></article>)}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container-wide cta-band__grid"><div><p className="eyebrow">CURRENT ASK</p><h2><Lines text={isPortugal ? "Bring a case, | or the capacity to operate." : "Explore it. | Use it."} /></h2><p><Lines text={venture.ask} /></p></div>{isPortugal || !venture.externalHref ? <ButtonLink href="/bring-an-opportunity" variant="dark">Start the right conversation</ButtonLink> : <ButtonLink href={venture.externalHref} variant="dark">View on GitHub</ButtonLink>}</div>
      </section>
    </>
  );
}
