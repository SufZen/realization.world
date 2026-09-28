import type { Metadata } from "next";
import { Suspense } from "react";
import { OpportunityForm } from "@/components/opportunity-form";
import { PageHero } from "@/components/page-hero";
import { pageMetadata } from "@/lib/metadata";
import { Lines } from "@/components/lines";
import { ButtonLink } from "@/components/button-link";
import { bookingUrl } from "@/content/site";

export const metadata: Metadata = pageMetadata(
  "Bring an Opportunity",
  "Send Realization a brief: a stuck property or asset, a capital mandate, an operating capability, or an organisation that needs help adopting AI. We reply within two working days.",
  "/bring-an-opportunity",
);

export default function BringOpportunityPage() {
  return (
    <>
      <PageHero
        index="08"
        eyebrow="BRING AN OPPORTUNITY"
        title="Show us what’s stuck."
        intro="What exists? Who holds the rights? | What blocks the outcome — or what should AI take off your team?"
        theme="dark"
        actions={<ButtonLink href={bookingUrl} variant="primary">Prefer to talk? Book 30 minutes</ButtonLink>}
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
              <li>For advisory: the team, the work and the time available</li>
            </ul>
          </aside>
          <Suspense fallback={<div className="opportunity-form">Loading the opportunity brief…</div>}>
            <OpportunityForm />
          </Suspense>
        </div>
      </section>
      <section className="section surface-muted"><div className="container-wide"><div className="fit-grid"><article className="fit-list"><h3>What happens next</h3><p style={{ marginTop: "1rem" }}><Lines text="We reply within two working days. | A fit leads to a call and a fixed-scope first stage; | a non-fit gets a clear answer." /></p></article><article className="fit-list"><h3>What this is not</h3><p style={{ marginTop: "1rem" }}><Lines text="A brief creates no confidentiality, investment offer | or engagement until both sides agree one in writing. | Leave out sensitive personal or financial data." /></p></article></div></div></section>
    </>
  );
}
