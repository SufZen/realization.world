import type { Metadata } from "next";
import { ButtonLink } from "@/components/button-link";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { bookingUrl } from "@/content/site";

export const metadata: Metadata = {
  title: "Brief received",
  robots: { index: false, follow: true },
};

const nextByPath: Record<string, [label: string, href: string]> = {
  capital: ["See Arena, our current development", "/work/arena-barreiro"],
  advisory: ["Read the AI adoption case study", "/work/ai-adoption-architecture-firm"],
  opportunity: ["See how we resolve stuck properties", "/work/realization-portugal"],
};

export default async function ThankYouPage({ searchParams }: PageProps<"/thank-you">) {
  const { path } = await searchParams;
  const [label, href] = nextByPath[typeof path === "string" ? path : ""] ?? ["Explore the work", "/work"];
  return (
    <>
      <PageHero
        index="✓"
        eyebrow="BRIEF RECEIVED"
        title="Thank you. | We’ll be in touch."
        intro="Your brief reached our inbox. | We reply within two working days — | usually with a question or a time to talk."
        theme="brand"
        actions={<><ButtonLink href={bookingUrl} variant="dark">Book a 30-min intro now</ButtonLink><ButtonLink href={href} variant="outline">{label}</ButtonLink></>}
      />
      <section className="section">
        <div className="container-wide">
          <SectionHeading eyebrow="WHILE YOU WAIT" title="The thinking | behind the work." intro="Short field notes from real projects: | property, development and AI in practice." />
          <ButtonLink href="/insights" variant="dark">Read the field notes</ButtonLink>
        </div>
      </section>
    </>
  );
}
