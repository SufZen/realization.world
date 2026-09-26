import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { partnerPaths } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { Lines } from "@/components/lines";

export const metadata: Metadata = pageMetadata(
  "Partners",
  "Choose a Realization partnership path for opportunity ownership, venture operation, capital, or corporate and public collaboration.",
  "/partners",
);

export default function PartnersPage() {
  return (
    <>
      <PageHero
        index="04"
        eyebrow="PARTNER PATHS"
        title="Choose your role."
        intro="Four paths. One clear next step."
        theme="light"
      />
      <section className="section surface-muted">
        <div className="container-wide">
          <SectionHeading eyebrow="CHOOSE YOUR PATH" title="What do you bring?" intro="Select the role closest to your mandate." />
          <div className="partner-jump-grid">
            {partnerPaths.map(({ slug, title, headline, summary, icon: Icon }) => (
              <Link className="partner-jump" href={`/partners/${slug}`} key={slug}>
                <Icon strokeWidth={1.4} aria-hidden="true" />
                <p className="eyebrow">{title}</p>
                <h3>{headline}</h3>
                <p><Lines text={summary} /></p>
                <span>Follow this path</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <div className="statement-band"><div className="container"><p>The next step should reveal fit—not create dependency.</p></div></div>
    </>
  );
}
