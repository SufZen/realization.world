import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/button-link";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "About",
  "The purpose, founder role and operating principles behind Realization, a physical-world venture studio.",
  "/about",
);

const values = [
  ["01", "Integration", "Connect physical potential, venture architecture and technology into one legible system."],
  ["02", "Evidence", "Advance through observed reality and state uncertainty without decoration."],
  ["03", "Ownership", "Make rights, operation, accountability and data control visible."],
  ["04", "Leverage", "Apply founder attention where vision and architecture matter most."],
  ["05", "Continuity", "Design for an operator who can build capacity beyond the studio."],
  ["06", "Meaning", "Create value that matters to owners, users and the places affected."],
] as const;

export default function AboutPage() {
  return (
    <>
      <PageHero
        index="07"
        eyebrow="ABOUT REALIZATION"
        title="Vision into reality."
        intro="Founded by Asaf Eyzenkot (Suf Zen), Realization connects physical potential, venture architecture and technology."
        actions={<ButtonLink href="/thesis" variant="dark">Read the thesis</ButtonLink>}
        theme="brand"
      />

      <section className="section">
        <div className="container-wide about-founder">
          <div className="founder-mark" aria-label="Realization monarch butterfly mark">
            <Image src="/brand/butterfly-mark.png" alt="Realization monarch butterfly" width={548} height={548} sizes="(max-width: 760px) 44vw, 20vw" />
          </div>
          <div className="about-founder__copy">
            <p className="eyebrow">FOUNDER</p>
            <h2>Asaf Eyzenkot<br />(Suf Zen)</h2>
            <h3>Connecting the abstract with the tangible.</h3>
            <p>Asaf’s perspective is shaped by a lifelong drive to understand the logic behind complex systems and make that logic clear, useful and real. Realization brings that approach into the physical world: identify the latent value, design the missing system and prove it through action.</p>
            <p>An operating lens spanning Israel and Portugal—and future market research in Spain—gives the studio a practical cross-market view. It also reinforces a core boundary: local continuity belongs to strong local and sector operators.</p>
            <p>The founder leads vision, research, venture architecture, product logic and validation. The aim is not to remain the permanent operator. It is to build ventures whose knowledge, ownership and operating systems can outlast founder dependency.</p>
            <div className="button-row"><ButtonLink href="/how-we-build" variant="dark">How the role works</ButtonLink></div>
          </div>
        </div>
      </section>

      <section className="section surface-brand">
        <div className="container-wide">
          <SectionHeading eyebrow="GUIDING PRINCIPLES" title="Clarity compounds." intro="The monarch stands for transformation—and the reach of one well-placed intervention." />
          <div className="about-values">
            {values.map(([index, title, text]) => <article className="about-value" key={title}><span>{index}</span><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="section surface-dark"><div className="container-wide"><SectionHeading eyebrow="THE STUDIO ROLE" title="Build the conditions. Transfer the operation." intro="The studio originates and architects. Ventures and partners own operation, responsibility and claims." inverse /><div className="button-row"><ButtonLink href="/ventures" variant="primary">Explore the portfolio</ButtonLink><ButtonLink href="/partners" variant="outline">See partner paths</ButtonLink></div></div></section>
    </>
  );
}
