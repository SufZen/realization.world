import type { Metadata } from "next";
import { ButtonLink } from "@/components/button-link";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { bookingUrl } from "@/content/site";

export const metadata: Metadata = {
  title: "Received",
  robots: { index: false, follow: true },
};

const nextByPath: Record<string, [label: string, href: string]> = {
  capital: ["See Arena, our current development", "/work/arena-barreiro"],
  advisory: ["Read the AI adoption case study", "/work/ai-adoption-architecture-firm"],
  opportunity: ["See how we resolve stuck properties", "/work/realization-portugal"],
};

export default async function ThankYouPage({ searchParams }: PageProps<"/thank-you">) {
  const { path } = await searchParams;
  const key = typeof path === "string" ? path : "";
  const [label, href] = nextByPath[key] ?? ["Explore the work", "/work"];
  // No reply time is promised until one is agreed (18.11.2026).
  return (
    <>
      <PageHero
        index="✓"
        eyebrow={key === "general" ? "RECEIVED · MESSAGE" : "RECEIVED · BRIEF"}
        title="Thank you. | It’s in our inbox."
        intro={`Your ${key === "general" ? "message" : "brief"} reached us, | and a person will reply by email. | Want to talk sooner? Book 20 minutes.`}
        theme="brand"
        actions={<><ButtonLink href={bookingUrl} variant="dark">Book a 20-minute intro</ButtonLink><ButtonLink href={href} variant="outline">{label}</ButtonLink></>}
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
