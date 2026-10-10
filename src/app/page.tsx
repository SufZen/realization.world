import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/button-link";
import Image from "next/image";
import { ProcessRibbon } from "@/components/process-ribbon";
import { SectionHeading } from "@/components/section-heading";
import { WorkCard } from "@/components/work-card";
import { JsonLd } from "@/components/json-ld";
import { framework, partnerPaths, siteUrl } from "@/content/site";
import { featuredWork, workBySlug } from "@/content/work";
import { graph, websiteSchema } from "@/lib/schema";
import { Lines } from "@/components/lines";
import { MarketBridgeDiagram } from "@/components/diagrams";
import { WebinarBanner } from "@/components/webinar-banner";

// Title and description come from the root layout; canonical is set per page.
export const metadata: Metadata = { alternates: { canonical: siteUrl } };

const doors = [
  {
    tone: "brand",
    eyebrow: "REAL ESTATE & CAPITAL",
    title: "Develop and invest | in Portugal.",
    text: "Residential development, architecture | and a licensed way to unblock stuck homes.",
    work: ["arena-barreiro", "realization-portugal", "boa-architecture"],
    href: "/partners/capital",
    cta: "Partner on a project",
  },
  {
    tone: "dark",
    eyebrow: "AI & OPERATIONS",
    title: "Bring AI into | your operations.",
    text: "A measured adoption programme, | and the systems we built to run our own work.",
    work: ["ai-adoption-architecture-firm", "realizeos", "meetsum"],
    href: "/advisory",
    cta: "See Advisory",
  },
] as const;

const proof = [
  ["2019", "founded in Portugal"],
  ["11 homes", "in development at Arena, Barreiro"],
  ["9 projects", "designed by BOA Architecture"],
  ["3 AI systems", "built and in daily use"],
  ["Month 7", "modelled break-even in our AI adoption case"],
] as const;

export default function HomePage() {
  return (
    <>
      <JsonLd data={graph(websiteSchema)} />
      <WebinarBanner />
      <section className="home-hero">
        <div className="home-hero__bg" aria-hidden="true">
          <Image src="/media/hero-physical-world.webp" alt="" fill priority sizes="100vw" />
        </div>
        <div className="container-wide home-hero__grid">
          <div className="home-hero__content">
            <p className="eyebrow">REAL ESTATE · VENTURES · SYSTEMS</p>
            <h1><span className="ln">Untapped potential.</span> <em className="ln">Realized.</em></h1>
            <p className="home-hero__lead">
              <span className="ln">We develop real estate in Portugal</span>
              <span className="ln">and build the ventures and systems around it.</span>
            </p>
            <div className="button-row">
              <ButtonLink href="/bring-an-opportunity">Bring an opportunity</ButtonLink>
              <ButtonLink href="/work" variant="outline">Explore the work</ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="doors" aria-label="Choose your path">
        <div className="container-wide doors__grid">
          {doors.map((door) => (
            <article className={`door door--${door.tone}`} key={door.eyebrow}>
              <p className="eyebrow">{door.eyebrow}</p>
              <h2><Lines text={door.title} /></h2>
              <p><Lines text={door.text} /></p>
              <ul className="door__links">
                {door.work.map((slug) => {
                  const item = workBySlug(slug)!;
                  return <li key={slug}><Link href={`/work/${slug}`}><span>{item.name}</span><small>{item.eyebrow.split(" · ")[0].toLowerCase()}</small><ArrowUpRight aria-hidden="true" size={18} /></Link></li>;
                })}
              </ul>
              <ButtonLink href={door.href} variant={door.tone === "dark" ? "primary" : "dark"}>{door.cta}</ButtonLink>
            </article>
          ))}
        </div>
      </section>

      <section className="proof-strip" aria-label="Realization in numbers">
        <dl className="container-wide proof-strip__grid">
          {proof.map(([value, label]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
        </dl>
      </section>

      <section className="manifesto">
        <div className="container-wide manifesto__grid">
          <p className="eyebrow">THE PROBLEM</p>
          <div>
            <h2><Lines text="The value is there. | The system isn’t." /></h2>
            <p><Lines text="We build the missing layer | between an underused place and a working venture." /></p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-wide">
          <SectionHeading
            eyebrow="SELECTED WORK"
            title="Real estate is where we start."
            intro="Development in Portugal is our core. | The ventures and systems grow from it."
          />
          <div className="ventures-grid">
            {featuredWork.map((item, index) => <WorkCard item={item} featured={index === 0} key={item.slug} />)}
          </div>
          <div className="button-row"><ButtonLink href="/work" variant="dark">See all the work</ButtonLink></div>
        </div>
      </section>

      <section className="section surface-dark">
        <div className="container-wide">
          <SectionHeading
            eyebrow="OUR FRAMEWORK"
            title="Potential → system → value."
            intro="Three layers. One operating reality."
            inverse
          />
          <div className="framework-grid">
            {framework.map(({ title, text, icon: Icon }, index) => (
              <article className="framework-card" key={title}>
                <div className="framework-card__icon"><Icon size={25} strokeWidth={1.5} /></div>
                <p className="eyebrow">0{index + 1}</p>
                <h3><Lines text={title} /></h3>
                <p><Lines text={text} /></p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-wide">
          <SectionHeading
            eyebrow="HOW WE BUILD"
            title="Founder-led. Built to transfer."
            intro="Vision and validation stay with us. | Scale moves to the right operator."
          />
          <ProcessRibbon />
          <div className="button-row"><ButtonLink href="/how-we-build" variant="dark">See the full model</ButtonLink></div>
        </div>
      </section>

      <section className="section">
        <div className="container-wide diagram-row">
          <div>
            <SectionHeading
              eyebrow="WHERE WE WORK"
              title="Israel. Portugal. | Europe next."
              intro="Israeli capital and technology. | A working base in Portugal. | New relationships from Barcelona."
            />
            <ButtonLink href="/markets" variant="dark">See the markets</ButtonLink>
          </div>
          <figure className="diagram diagram--panel"><MarketBridgeDiagram /></figure>
        </div>
      </section>

      <section className="section">
        <div className="container-wide">
          <SectionHeading
            eyebrow="PARTNER PATHS"
            title="Where do you fit?"
            intro="Start with the role you can play."
          />
          <div className="audience-grid">
            {partnerPaths.map(({ slug, title, summary, icon: Icon }) => (
              <Link className="audience-card" href={`/partners/${slug}`} key={slug}>
                <Icon size={32} strokeWidth={1.5} aria-hidden="true" />
                <h3><Lines text={title} /></h3>
                <p><Lines text={summary} /></p>
                <span>Follow this path</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container-wide cta-band__grid">
          <div>
            <p className="eyebrow">A POTENTIAL REALITY</p>
            <h2>See what others miss?</h2>
            <p><Lines text="Share the asset, the rights | and what keeps it stuck." /></p>
          </div>
          <Link className="button button--dark" href="/bring-an-opportunity">Bring an opportunity <ArrowUpRight size={18} aria-hidden="true" /></Link>
        </div>
      </section>
    </>
  );
}
