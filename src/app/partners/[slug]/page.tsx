import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/button-link";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { partnerPaths } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

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
      ["Strong fit", "A meaningful physical asset or system; credible rights or authority; a specific blocker; identifiable beneficiaries; willingness to share evidence."],
      ["Not yet", "A generic idea, no route to rights or access, a request for normal agency work, or an expectation of indefinite founder operation."],
    ],
    operators: [
      ["Strong fit", "Relevant operating history, accountable leadership, local or sector capability, a team-building path and comfort with structured governance."],
      ["Not yet", "Interest without operating capacity, unclear accountability, dependence on the studio for day-to-day execution or no route to required licensing."],
    ],
    capital: [
      ["Strong fit", "A defined mandate, stage, geography, ticket and instrument—plus patience for evidence-led physical-world venture building."],
      ["Not yet", "A request for broad deal flow, unclear source of funds, mismatched time horizon or an expectation of public claims beyond verified evidence."],
    ],
    "corporate-public": [
      ["Strong fit", "A decision owner, affected users, access to relevant data, a time-boxed validation budget and a credible route to operation."],
      ["Not yet", "An undefined innovation brief, no authority to test, procurement without venture intent or an open-ended transformation programme."],
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
          <SectionHeading eyebrow="YOUR JOURNEY" title="A path to a useful decision." intro={path.promise} />
          <div className="journey-grid">
            {path.steps.map(([title, text], index) => <article className="journey-step" key={title}><span className="journey-step__number">0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </div>
      </section>
      <section className="section surface-muted">
        <div className="container-wide">
          <SectionHeading eyebrow="FIT" title="Qualify before we build." intro="Clear boundaries protect the opportunity, the partner and the studio." />
          <div className="fit-grid">
            {fit.map(([title, text]) => <article className="fit-list" key={title}><h3>{title}</h3><p style={{ marginTop: "1rem" }}>{text}</p></article>)}
          </div>
          <div className="button-row"><ButtonLink href={path.href} variant="dark">{path.cta}</ButtonLink></div>
        </div>
      </section>
    </>
  );
}
