import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/button-link";
import Image from "next/image";
import { SectionHeading } from "@/components/section-heading";
import { WorkCard } from "@/components/work-card";
import { JsonLd } from "@/components/json-ld";
import { Testimonials, VideoGrid } from "@/components/media-blocks";
import { CtaLink } from "@/components/services/cta-link";
import { PillarDoors } from "@/components/services/pillar-doors";
import { approachNavigation, framework, insights, partnerPaths, siteUrl } from "@/content/site";
import { introCta } from "@/content/services";
import { featuredWork } from "@/content/work";
import { graph, websiteSchema } from "@/lib/schema";
import { Lines } from "@/components/lines";
import { WebinarBanner } from "@/components/webinar-banner";
import { latestVideos } from "@/lib/youtube";

// Title and description come from the root layout; canonical is set per page.
export const metadata: Metadata = { alternates: { canonical: siteUrl } };

// The latest videos come from the YouTube feed: regenerate hourly.
export const revalidate = 3600;

const proof = [
  ["2019", "founded in Portugal"],
  ["11 homes", "in development at Arena, Barreiro"],
  ["9 projects", "designed by BOA Architecture"],
  ["3 AI systems", "built and in daily use"],
  ["Month 7", "modelled break-even in our AI adoption case"],
] as const;

export default async function HomePage() {
  const videos = await latestVideos(3);
  const notes = [...insights].sort((a, b) => b.date.localeCompare(a.date)).slice(0, videos.length ? 2 : 4);

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
            <p className="eyebrow">REAL ESTATE · AI SYSTEMS · DELIVERY</p>
            <h1><span className="ln">Untapped potential.</span> <em className="ln">Realized.</em></h1>
            <p className="home-hero__lead">
              <span className="ln">We realize potential in three dimensions:</span>
              <span className="ln">places, systems and teams.</span>
            </p>
            <div className="button-row">
              <ButtonLink href="/services">See our services</ButtonLink>
              <CtaLink cta={introCta("home")} pageRef="home" variant="outline" />
            </div>
          </div>
        </div>
      </section>

      <PillarDoors />

      <section className="proof-strip" aria-label="Realization in numbers">
        <dl className="container-wide proof-strip__grid">
          {proof.map(([value, label]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
        </dl>
      </section>

      <Testimonials />

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

      <section className="section surface-muted">
        <div className="container-wide">
          <SectionHeading eyebrow="LEARN FROM THE FIELD" title="Notes and videos | from real projects." intro="What worked, what did not | and what it cost." />
          <VideoGrid videos={videos} place="home" />
          <div className="insights-grid" style={videos.length ? { marginTop: "clamp(2rem, 4vw, 3rem)" } : undefined}>
            {notes.map(({ slug, category, title, excerpt, published, readTime, icon: Icon }) => (
              <Link className="insight-card" href={`/insights/${slug}`} key={slug}>
                <div className="insight-card__icon"><Icon size={25} strokeWidth={1.5} /></div>
                <div><p className="eyebrow">{category}</p><h3><Lines text={title} /></h3><p><Lines text={excerpt} /></p><div className="insight-card__meta"><span>{published}</span><span>{readTime}</span></div></div>
              </Link>
            ))}
          </div>
          <div className="button-row"><ButtonLink href="/insights" variant="dark">Go to Learn</ButtonLink></div>
        </div>
      </section>

      <section className="section surface-dark">
        <div className="container-wide">
          <SectionHeading
            eyebrow="OUR FRAMEWORK"
            title="Potential → system → value."
            intro="Three layers. One operating reality. | Every engagement ends with a handoff."
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
          <div className="button-row">
            {approachNavigation.map((item) => <ButtonLink href={item.href} variant="outline" key={item.href}>{item.label}</ButtonLink>)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-wide">
          <SectionHeading
            eyebrow="PARTNER WITH US"
            title="Bringing a property, | capital or a team?"
            intro="Owners, operators and capital partners | have their own paths into our projects."
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
            <p className="eyebrow">NOT SURE WHERE TO START?</p>
            <h2><Lines text="Twenty minutes | is enough." /></h2>
            <p><Lines text="One call to know which of the three | your problem sits in, or whether we fit at all." /></p>
          </div>
          <div className="button-row">
            <CtaLink cta={introCta("home")} pageRef="home" variant="dark" />
            <Link className="button button--outline" href="/bring-an-opportunity" data-umami-event="open-brief" data-umami-event-path="general">Bring an opportunity <ArrowUpRight size={18} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
