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

const updated = "9 October 2026";

export default function PrivacyPage() {
  return (
    <>
      <PageHero index="§" eyebrow="PRIVACY NOTICE" title="Your data, | used only to reply." intro={`Plain language, no tracking cookies. Last updated ${updated}.`} theme="light" />
      <section className="section">
        <div className="container legal-copy">
          <section>
            <h2>Who is responsible</h2>
            <p>Realization Unipessoal LDA (NIPC 517298961), Largo José Afonso 44, Setúbal, Portugal, is the controller of personal data collected on realization.world. Contact: <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p>
          </section>
          <section>
            <h2>What we collect, and why</h2>
            <ul>
              <li><strong>Opportunity briefs.</strong> When you use the <Link href="/bring-an-opportunity">brief form</Link>, we receive your name, email address, and whatever you choose to write about your organisation, geography and opportunity. We use it only to assess the brief and reply to you. The legal basis is your consent and steps you ask us to take before a possible contract (GDPR art. 6(1)(a) and (b)).</li>
              <li><strong>Email, WhatsApp and booking.</strong> If you write to us or book a call, we receive what you send and the details the booking tool (TidyCal) asks for, and use them to reply and hold the meeting.</li>
              <li><strong>Webinar registrations.</strong> When you register for a webinar, we receive your name, email address, phone number if you give it, your role and the question you write. We use them to send the calendar invite, reminders and the recording, and to prepare the session. For joint webinars, the co-host (named on the registration page) sees the registrations too. The legal basis is your consent (GDPR art. 6(1)(a)).</li>
              <li><strong>Email updates.</strong> We send occasional emails (event invitations, reminders and updates) to people who subscribed or registered, and to people we have worked with or been in touch with before (our legitimate interest, GDPR art. 6(1)(f)). Every email has a one-click unsubscribe link and a link to manage your preferences. Our emails record whether you opened them and which links you clicked, linked to your email address, so we can see what is useful and follow up with people who showed interest. You can object to this at any time by unsubscribing or writing to us, and blocking images in your mail app stops the open tracking.</li>
              <li><strong>Site statistics.</strong> We use Umami, a cookieless analytics tool that we host on our own server in the EU. It counts visits and actions (such as booking clicks) without identifying you or storing anything on your device, and it respects Do Not Track.</li>
            </ul>
          </section>
          <section>
            <h2>Where it goes</h2>
            <p>The website does not store briefs in a database. A brief is sent by email to our inbox, hosted by Google Workspace. Webinar registrations are kept in our Google Workspace (Sheets and Calendar). Our mailing list runs on Listmonk, open-source software we host on our own server in the EU. We share your data only with people who need it to answer you or run the event, and never sell it.</p>
          </section>
          <section>
            <h2>How long we keep it</h2>
            <p>We keep a brief and our correspondence for up to 24 months after our last contact, unless it becomes part of an engagement, in which case the contract’s retention rules apply. Mailing-list data stays until you unsubscribe; after that we keep only your address on a do-not-email list, so we don’t write to you again by mistake. Open and click records are deleted after 24 months.</p>
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
