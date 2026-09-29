import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { contactEmail } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Legal notice",
  "Company information and terms of use for realization.world, operated by Realization Unipessoal LDA.",
  "/legal",
);

export default function LegalPage() {
  return (
    <>
      <PageHero index="§" eyebrow="LEGAL NOTICE" title="Who runs | this site." intro="Company information and terms of use." theme="light" />
      <section className="section">
        <div className="container legal-copy">
          <section>
            <h2>Company</h2>
            <p>realization.world is operated by Realization Unipessoal LDA, Largo José Afonso 44, Setúbal, Portugal. NIPC 517298961. Real-estate mediation licence AMI 25459. Contact: <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p>
          </section>
          <section>
            <h2>No offer or advice</h2>
            <p>Nothing on this site is an offer of securities, an invitation to invest, or legal, tax or investment advice. Project figures are shown for information, with their source and date. Financial terms for any project are shared only with qualified parties, on request and in writing.</p>
          </section>
          <section>
            <h2>Content and images</h2>
            <p>Text, diagrams and images on this site belong to Realization or its partners and are used with permission. Architectural renders are design-stage images and may change. You may quote short passages with a link back to the source page.</p>
          </section>
          <section>
            <h2>Privacy</h2>
            <p>How we handle personal data is set out in the <Link href="/privacy">privacy notice</Link>.</p>
          </section>
        </div>
      </section>
    </>
  );
}
