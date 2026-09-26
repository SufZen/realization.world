import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/button-link";
import { EditorialMedia } from "@/components/editorial-media";
import { ProcessRibbon } from "@/components/process-ribbon";
import { SectionHeading } from "@/components/section-heading";
import { StudioSystemMap } from "@/components/studio-visuals";
import { VentureCard } from "@/components/venture-card";
import { framework, insights, partnerPaths, projects, ventures } from "@/content/site";

export default function HomePage() {
  return (
    <>
      <section className="home-hero">
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
              <ButtonLink href="/ventures" variant="outline">Explore the portfolio</ButtonLink>
            </div>
          </div>
          <EditorialMedia
            src="/media/hero-physical-world.png"
            alt="A multidisciplinary team shaping a physical site model at an architectural worktable"
            label="FROM REALITY → TO VENTURE"
            caption="Physical opportunity. Digital leverage. An operating future."
            priority
            className="home-hero__media"
          />
          <p className="spaced-caps home-hero__tagline">PHYSICAL POTENTIAL. DIGITAL SYSTEMS. REALIZED VALUE.</p>
        </div>
      </section>

      <section className="manifesto">
        <div className="container-wide manifesto__grid">
          <p className="eyebrow">THE UNREALIZED PROBLEM</p>
          <div>
            <h2>The value is there. The system isn’t.</h2>
            <p>We build the missing layer between an underused reality and a venture that can change it.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-wide">
          <SectionHeading
            eyebrow="PROVEN GROUND"
            title="Real estate is where we start."
            intro="Residential development in Portugal is the core of our work—and the evidence behind what we build next."
          />
          <div className="project-list">
            {projects.map((project) => (
              <article className="project-row" key={project.name}>
                <div><h3>{project.name}</h3><p>{project.location}</p></div>
                <p>{project.type}<br />{project.role}</p>
                <span className="status status--active">{project.status}</span>
              </article>
            ))}
          </div>
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
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <StudioSystemMap />
        </div>
      </section>

      <section className="section">
        <div className="container-wide">
          <SectionHeading
            eyebrow="HOW WE BUILD"
            title="Founder-led. Built to transfer."
            intro="Vision, architecture and validation stay close. Scale moves to the right operator."
          />
          <ProcessRibbon />
          <div className="button-row"><ButtonLink href="/how-we-build" variant="dark">See the full model</ButtonLink></div>
        </div>
      </section>

      <section className="section surface-muted">
        <div className="container-wide">
          <SectionHeading
            eyebrow="VENTURES"
            title="The ventures prove the thesis."
            intro="Clear problem. Working system. Visible status. Defined operator path."
          />
          <div className="ventures-grid">
            {ventures.map((venture, index) => <VentureCard venture={venture} featured={index === 0} key={venture.slug} />)}
          </div>
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
            {partnerPaths.map(({ slug, title, summary, icon: Icon }, index) => (
              <Link className="audience-card" href={`/partners/${slug}`} key={slug}>
                <span className="audience-card__number">0{index + 1}</span>
                <Icon size={32} strokeWidth={1.5} aria-hidden="true" />
                <h3>{title}</h3>
                <p>{summary}</p>
                <span>Follow this path</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section surface-dark">
        <div className="container-wide">
          <SectionHeading
            eyebrow="INSIGHTS"
            title="Field notes. Real systems."
            intro="Venture architecture, market evidence and transfer."
            inverse
          />
          <div className="insights-grid">
            {insights.slice(0, 2).map(({ slug, category, title, excerpt, published, readTime, icon: Icon }) => (
              <Link className="insight-card" href={`/insights/${slug}`} key={slug}>
                <div className="insight-card__icon"><Icon size={25} strokeWidth={1.5} /></div>
                <div>
                  <p className="eyebrow">{category}</p>
                  <h3>{title}</h3>
                  <p>{excerpt}</p>
                  <div className="insight-card__meta"><span>{published}</span><span>{readTime}</span></div>
                </div>
              </Link>
            ))}
          </div>
          <div className="button-row"><ButtonLink href="/insights" variant="light">Read all insights</ButtonLink></div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container-wide cta-band__grid">
          <div>
            <p className="eyebrow">A POTENTIAL REALITY</p>
            <h2>See what others miss?</h2>
            <p>Share the asset, the rights and what keeps it stuck.</p>
          </div>
          <Link className="button button--dark" href="/bring-an-opportunity">Bring an opportunity <ArrowUpRight size={18} aria-hidden="true" /></Link>
        </div>
      </section>
    </>
  );
}
