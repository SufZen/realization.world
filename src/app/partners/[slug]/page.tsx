import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/button-link";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { partnerPaths } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { Lines } from "@/components/lines";

export function generateStaticParams() {
  return partnerPaths.map((path) => ({ slug: path.slug }));
}

export async function generateMetadata({ params }: PageProps<"/partners/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const path = partnerPaths.find((entry) => entry.slug === slug);
  return path ? pageMetadata(path.title, path.summary, `/partners/${path.slug}`) : {};
}

export default async function PartnerPage({ params }: PageProps<"/partners/[slug]">) {
  const { slug } = await params;
  const path = partnerPaths.find((entry) => entry.slug === slug);
  if (!path) notFound();
  const Icon = path.icon;
  const fit = {
    "opportunity-owners": [
      ["Strong fit", "A meaningful asset, clear rights, | a specific blocker and shared evidence."],
      ["Not yet", "A generic idea, no access to rights, | or a request for agency work."],
    ],
    operators: [
      ["Strong fit", "Relevant operating history, accountable leadership | and a path to build a team."],
      ["Not yet", "Interest without capacity, | or reliance on the studio to run it."],
    ],
    capital: [
      ["Strong fit", "A defined mandate, stage, geography and ticket, | and patience for evidence."],
      ["Not yet", "A request for broad deal flow, | or claims beyond verified evidence."],
    ],
    "corporate-public": [
      ["Strong fit", "A decision owner, users, data | and a time-boxed pilot budget."],
      ["Not yet", "An undefined innovation brief | or an open-ended programme."],
    ],
  }[path.slug];

  return (
    <>
      <PageHero
        index="P"
        eyebrow={path.title}
        title={path.headline}
        intro={path.summary}
        theme="brand"
        actions={<ButtonLink href={path.href} variant="dark">{path.cta}</ButtonLink>}
        aside={<div className="page-hero__mark" aria-hidden="true"><span><Icon size={38} strokeWidth={1.4} /></span><i /></div>}
      />
      <section className="section">
        <div className="container-wide">
          <SectionHeading eyebrow="YOUR JOURNEY" title="A path | to a useful decision." intro={path.promise} />
          <div className="journey-grid">
            {path.steps.map(([title, text], index) => <article className="journey-step" key={title}><span className="journey-step__number">0{index + 1}</span><h3><Lines text={title} /></h3><p><Lines text={text} /></p></article>)}
          </div>
        </div>
      </section>
      <section className="section surface-muted">
        <div className="container-wide">
          <SectionHeading eyebrow="FIT" title="Qualify before we build." intro="Clear boundaries protect | everyone involved." />
          <div className="fit-grid">
            {fit.map(([title, text]) => <article className="fit-list" key={title}><h3><Lines text={title} /></h3><p style={{ marginTop: "1rem" }}><Lines text={text} /></p></article>)}
          </div>
          <div className="button-row"><ButtonLink href={path.href} variant="dark">{path.cta}</ButtonLink></div>
        </div>
      </section>
    </>
  );
}
