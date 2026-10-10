import type { Metadata } from "next";
import { ButtonLink } from "@/components/button-link";
import { JsonLd } from "@/components/json-ld";
import { Lines, plain } from "@/components/lines";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { Testimonials } from "@/components/media-blocks";
import { CtaLink } from "@/components/services/cta-link";
import { CtaBand } from "@/components/services/sections";
import styles from "@/components/services/services.module.css";
import { siteUrl } from "@/content/site";
import { currentOffers, hub, introCta, isWebinarOpen, pillars, type Cta } from "@/content/services";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbSchema, graph, ids } from "@/lib/schema";

export const metadata: Metadata = pageMetadata(
  "Services — places, systems and teams",
  "Realization realizes potential in three dimensions: places, systems and teams. Real estate development in Portugal, AI and operations systems, and delivery and team setup, each built to be handed over.",
  "/services",
);

const webinarCta: Cta = { label: "Free webinar, in Hebrew · 20.10", href: "/webinar", event: "join-webinar", data: { pillar: "hub" }, carryRef: true };

// The webinar offer ends on 20.10; regenerate hourly so it disappears without a deploy.
export const revalidate = 3600;

export default function ServicesPage() {
  const webinarOpen = isWebinarOpen();
  return (
    <>
      <JsonLd
        data={graph(breadcrumbSchema([["Services", "/services"]]), {
          "@type": "ItemList",
          "@id": `${siteUrl}/services#services`,
          name: "Realization services",
          itemListElement: pillars.map((pillar, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "Service",
              "@id": `${siteUrl}${pillar.href}#service`,
              name: pillar.title,
              description: plain(pillar.subtitle),
              provider: { "@id": ids.organization },
              url: `${siteUrl}${pillar.href}`,
            },
          })),
        })}
      />
      <PageHero
        index="S"
        eyebrow="SERVICES"
        title="Places, systems | and teams."
        intro={hub.sentence}
        theme="light"
        actions={
          <>
            <CtaLink cta={introCta("hub")} pageRef={hub.ref} variant="dark" />
            {webinarOpen && <CtaLink cta={webinarCta} pageRef={hub.ref} variant="outline" />}
          </>
        }
      />

      <section className="section">
        <div className="container-wide">
          <SectionHeading eyebrow="THREE PILLARS" title="Pick the one | in front of you." intro="Each page lists what you can buy, | what it costs and how to start." />
          <div className={styles.pillars}>
            {pillars.map(({ slug, href, dimension, title, subtitle, forWhom, icon: Icon, offers }, index) => (
              <article className={styles.pillar} key={slug}>
                <div className={styles.pillarTop}>
                  <span className={styles.pillarDimension}>0{index + 1} · {dimension}</span>
                  <span className={styles.pillarIcon}><Icon size={25} strokeWidth={1.5} /></span>
                </div>
                <h3>{title}</h3>
                <p className={styles.pillarSubtitle}><Lines text={subtitle} /></p>
                <p className={styles.pillarFor}><Lines text={forWhom} /></p>
                <ul className={styles.pillarOffers}>
                  {currentOffers(offers).slice(0, 4).map((offer) => (
                    <li key={offer.name}><span>{offer.name}</span>{offer.price && <small>{offer.price}</small>}</li>
                  ))}
                </ul>
                <div className={styles.pillarLink}>
                  <ButtonLink href={href} variant="dark">{title}</ButtonLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Testimonials surface="surface-muted" />

      <section className="section surface-dark">
        <div className="container-wide">
          <SectionHeading eyebrow={hub.why.eyebrow} title={hub.why.title} intro={hub.why.intro} inverse />
          <div className={`framework-grid ${styles.tabletOne}`}>
            {hub.why.items.map(([title, text], index) => {
              const Icon = pillars[index].icon;
              return (
                <article className="framework-card" key={title}>
                  <div className="framework-card__icon"><Icon size={27} strokeWidth={1.5} /></div>
                  <h3>{title}</h3>
                  <p><Lines text={text} /></p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-wide">
          <SectionHeading eyebrow="HOW WE WORK" title="Every engagement | is built to end." />
          <div className="content-grid">
            {hub.principles.map(([title, text]) => (
              <article className="content-card" key={title}>
                <h3>{title}</h3>
                <p><Lines text={text} /></p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section surface-muted">
        <div className="container-wide diagram-row">
          <SectionHeading eyebrow="PARTNERSHIPS" title="Looking for a partner, | not a service?" intro="Owners, operators and capital partners | have their own paths into our projects." />
          <div className="button-row">
            <ButtonLink href="/partners" variant="dark">See partner paths</ButtonLink>
            <CtaLink cta={{ label: "Bring an opportunity", href: "/bring-an-opportunity", carryRef: true }} pageRef={hub.ref} variant="outline" />
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="NOT SURE WHERE TO START?"
        title="Start with | twenty minutes."
        text="One call is enough to know | which of the three your problem sits in."
        primary={introCta("hub")}
        secondary={webinarOpen ? webinarCta : undefined}
        pageRef={hub.ref}
      />
    </>
  );
}
