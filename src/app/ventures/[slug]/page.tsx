import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/button-link";
import { EditorialMedia } from "@/components/editorial-media";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { ventures } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

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
        title={venture.name}
        intro={venture.descriptor}
        theme={isPortugal ? "brand" : "dark"}
        actions={<><ButtonLink href="/bring-an-opportunity" variant={isPortugal ? "dark" : "primary"}>{isPortugal ? "Bring a property case" : "Discuss a deployment"}</ButtonLink>{venture.externalHref && <ButtonLink href={venture.externalHref} variant="outline">Visit product site</ButtonLink>}</>}
        aside={<EditorialMedia src={venture.image} alt={venture.imageAlt} label={venture.stage.toUpperCase()} className="page-hero__media" />}
      />

      <section className="section">
        <div className="container-wide venture-detail">
          <aside className="venture-detail__aside">
            <p className="eyebrow">VENTURE STATUS</p>
            <span className={`status status--${venture.stage === "Active" ? "active" : "verify"}`}>{venture.stage}</span>
            <p>{venture.ask}</p>
          </aside>
          <div>
            <SectionHeading eyebrow="CASE STUDY" title="The system. Clearly." align="stack" />
            <dl className="venture-detail__facts">
              <div className="venture-fact"><dt>The problem</dt><dd>{venture.problem}</dd></div>
              <div className="venture-fact"><dt>The system</dt><dd>{venture.system}</dd></div>
              <div className="venture-fact"><dt>Realization</dt><dd>{venture.realizationRole}</dd></div>
              <div className="venture-fact"><dt>Operator path</dt><dd>{venture.operator}</dd></div>
              <div className="venture-fact"><dt>Evidence</dt><dd>{venture.evidence}</dd></div>
              <div className="venture-fact"><dt>Current ask</dt><dd>{venture.ask}</dd></div>
            </dl>
            <div className="verification-note">
              <strong>Verification boundary</strong>
              {isPortugal
                ? "Venture status, operator identity, licensing responsibility, data-controller role, case outcomes and any performance claims require confirmation before public promotion."
                : "Deployment counts, customer use, time-saved metrics, licensing language and any commercial claims require confirmation against current product records before publication."}
            </div>
          </div>
        </div>
      </section>

      <section className="section surface-dark">
        <div className="container-wide">
          <SectionHeading
            eyebrow={isPortugal ? "DESIGNED PATH" : "PLATFORM ROLE"}
            title={isPortugal ? "Deadlock → resolution." : "Context → coordinated action."}
            intro={isPortugal
              ? "The venture is intended to organize diagnosis and professional coordination while keeping licensed and regulated responsibilities with the appropriate parties."
              : "RealizeOS supports venture knowledge, agents and workflows. Its commercial future is self-hosted and partner-implemented—not dependent on ongoing founder operation."}
            inverse
          />
          <div className="principles-grid">
            {(isPortugal
              ? [["01", "Diagnose", "Structure the case, rights, blockers and missing evidence."], ["02", "Blueprint", "Create a coordinated resolution path and decision sequence."], ["03", "Coordinate", "Work through the relevant licensed professionals and responsible parties."], ["04", "Resolve", "Reach a documented outcome and capture permissioned evidence."]]
              : [["01", "Context", "Create a durable knowledge and identity layer for the operation."], ["02", "Agents", "Connect specialized agents to governed routines and tools."], ["03", "Traceability", "Use the event log to understand what acted, when and why."], ["04", "Deployment", "Self-host or license with qualified implementation support."]]
            ).map(([index, title, text]) => <article className="principle" key={title}><span className="principle__index">{index}</span><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container-wide cta-band__grid"><div><p className="eyebrow">CURRENT ASK</p><h2>{isPortugal ? "Bring a case—or the capacity to operate." : "Deploy, inspect or implement."}</h2><p>{venture.ask}</p></div><ButtonLink href="/bring-an-opportunity" variant="dark">Start the right conversation</ButtonLink></div>
      </section>
    </>
  );
}
