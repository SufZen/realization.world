import type { Metadata } from "next";
import { Suspense } from "react";
import { OpportunityForm } from "@/components/opportunity-form";
import { PageHero } from "@/components/page-hero";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Bring an Opportunity",
  "Share a physical-world opportunity, operating capability, capital mandate or strategic venture brief with Realization.",
  "/bring-an-opportunity",
);

export default function BringOpportunityPage() {
  return (
    <>
      <PageHero
        index="08"
        eyebrow="BRING AN OPPORTUNITY"
        title="Show us what’s stuck."
        intro="What exists? Who holds the rights? What blocks the outcome?"
        theme="dark"
      />
      <section className="section">
        <div className="container-wide opportunity-layout">
          <aside className="opportunity-intro">
            <p className="eyebrow">A USEFUL BRIEF</p>
            <h2>Context beats polish.</h2>
            <p>A specific, evidence-aware brief is all we need.</p>
            <ul className="opportunity-checklist">
              <li>Physical asset, place or system</li>
              <li>Rights, authority or route to access</li>
              <li>Visible blocker and affected people</li>
              <li>What has already been tried or learned</li>
              <li>Timing, geography and capital context</li>
            </ul>
          </aside>
          <Suspense fallback={<div className="opportunity-form">Loading the opportunity brief…</div>}>
            <OpportunityForm />
          </Suspense>
        </div>
      </section>
      <section className="section surface-muted"><div className="container-wide"><div className="fit-grid"><article className="fit-list"><h3>What happens next</h3><p style={{ marginTop: "1rem" }}>We review for thesis, rights, consequence and a plausible validation path. A fit may lead to focused discovery. A non-fit may be declined or, where appropriate, redirected.</p></article><article className="fit-list"><h3>What this is not</h3><p style={{ marginTop: "1rem" }}>Submitting a brief does not create confidentiality, representation, an investment offer or a professional advisory relationship. Do not include secrets or sensitive personal data.</p></article></div></div></section>
    </>
  );
}
