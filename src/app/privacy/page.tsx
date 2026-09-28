import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { contactEmail } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Privacy notice",
  "How Realization Unipessoal LDA handles the personal data you send through realization.world.",
  "/privacy",
);

const updated = "28 September 2026";

export default function PrivacyPage() {
  return (
    <>
      <PageHero index="§" eyebrow="PRIVACY NOTICE" title="Your data, | used only to reply." intro={`Plain language, no tracking cookies. Last updated ${updated}.`} theme="light" />
      <section className="section">
        <div className="container legal-copy">
          <section>
            <h2>Who is responsible</h2>
            <p>Realization Unipessoal LDA, based in Setúbal, Portugal, is the controller of personal data collected on realization.world. Contact: <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p>
          </section>
          <section>
            <h2>What we collect, and why</h2>
            <ul>
              <li><strong>Opportunity briefs.</strong> When you use the <Link href="/bring-an-opportunity">brief form</Link>, we receive your name, email address, and whatever you choose to write about your organisation, geography and opportunity. We use it only to assess the brief and reply to you. The legal basis is your consent and steps you ask us to take before a possible contract (GDPR art. 6(1)(a) and (b)).</li>
              <li><strong>Email, WhatsApp and booking.</strong> If you write to us or book a call, we receive what you send and the details the booking tool (TidyCal) asks for, and use them to reply and hold the meeting.</li>
              <li><strong>Site statistics.</strong> We may use privacy-friendly, cookieless analytics that count visits and actions without identifying you or storing anything on your device.</li>
            </ul>
          </section>
          <section>
            <h2>Where it goes</h2>
            <p>The website does not store briefs in a database. A brief is sent by email to our inbox, hosted by Google Workspace. We share it only with people who need it to answer you, and never sell it.</p>
          </section>
          <section>
            <h2>How long we keep it</h2>
            <p>We keep a brief and our correspondence for up to 24 months after our last contact, unless it becomes part of an engagement, in which case the contract’s retention rules apply.</p>
          </section>
          <section>
            <h2>Your rights</h2>
            <p>You can ask to access, correct, delete or export your data, object to its use, or withdraw consent at any time by writing to <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. You can also complain to the Portuguese data protection authority, the CNPD (<a href="https://www.cnpd.pt" rel="noopener">cnpd.pt</a>).</p>
          </section>
        </div>
      </section>
    </>
  );
}
