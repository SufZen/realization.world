import type { Metadata } from "next";
import { ButtonLink } from "@/components/button-link";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { CtaLink } from "@/components/services/cta-link";
import { pillarBySlug } from "@/content/services";

export const metadata: Metadata = {
  title: "Deal check received",
  robots: { index: false, follow: true },
};

const pillar = pillarBySlug("real-estate");

export default function DealCheckThankYouPage() {
  return (
    <>
      <PageHero
        index="✓"
        eyebrow="DEAL CHECK RECEIVED"
        title="Thank you. | The numbers are on their way."
        intro="We read the listing and reply by email | within two working days, | usually with the numbers and one or two questions."
        theme="brand"
        actions={
          <>
            <CtaLink cta={pillar.session} pageRef="deal-check-thank-you" variant="dark" />
            <ButtonLink href="/work/arena-barreiro" variant="outline">See Arena, our current development</ButtonLink>
          </>
        }
      />
      <section className="section">
        <div className="container-wide">
          <SectionHeading eyebrow="WHILE YOU WAIT" title="How we read | a deal." intro="Short field notes on pricing, | financing and stuck properties." />
          <ButtonLink href="/insights" variant="dark">Read the field notes</ButtonLink>
        </div>
      </section>
    </>
  );
}
