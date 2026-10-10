import Link from "next/link";
import { ButtonLink } from "@/components/button-link";
import { JsonLd } from "@/components/json-ld";
import { Lines } from "@/components/lines";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { WorkCard } from "@/components/work-card";
import { insights, siteUrl } from "@/content/site";
import { currentOffers, pillarBySlug, pillarInsights, type SystemsCopy } from "@/content/services";
import { workBySlug, type WorkItem } from "@/content/work";
import { breadcrumbSchema, graph, ids } from "@/lib/schema";
import { PillarVideos, Testimonials } from "@/components/media-blocks";
import { CtaLink } from "./cta-link";
import { HeroStatement } from "./hero-statement";
import { CtaBand, FaqList, FitLists, InsightFeed, OfferList } from "./sections";
import styles from "./services.module.css";

/** The Systems pillar page, in English (/services/ai-systems) or Hebrew (/he/services/ai-systems). */
export function SystemsPage({ copy, path }: { copy: SystemsCopy; path: string }) {
  const pillar = pillarBySlug("ai-systems");
  const [flagship, ...systems] = pillar.work.map((slug) => workBySlug(slug)).filter((item): item is WorkItem => Boolean(item));
  const he = copy.lang === "he";

  const page = (
    <>
      <JsonLd
        data={graph(
          breadcrumbSchema(he ? [["שירותים", "/services"], ["מערכות בינה מלאכותית ותפעול", path]] : [["Services", "/services"], [pillar.title, path]]),
          {
            "@type": "Service",
            "@id": `${siteUrl}${path}#service`,
            name: he ? "מערכות בינה מלאכותית ותפעול" : pillar.title,
            serviceType: "AI adoption consulting",
            description: "Discovery, a measured pilot and tapering support that move a professional firm from scattered AI experiments to one measured programme it owns.",
            provider: { "@id": ids.organization },
            areaServed: [{ "@type": "Country", name: "Portugal" }, { "@type": "Country", name: "Israel" }, { "@type": "Country", name: "Spain" }],
            availableLanguage: ["English", "Hebrew"],
            inLanguage: he ? "he" : "en",
            url: `${siteUrl}${path}`,
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: he ? "דרכים להתחיל" : "Ways to start",
              itemListElement: currentOffers(copy.offers.items).map((offer) => ({
                "@type": "Offer",
                itemOffered: { "@type": "Service", name: offer.name },
                ...(offer.amount ? { price: offer.amount, priceCurrency: "EUR" } : {}),
              })),
            },
          },
          {
            "@type": "FAQPage",
            mainEntity: copy.faq.items.map(([question, answer]) => ({
              "@type": "Question",
              name: question,
              acceptedAnswer: { "@type": "Answer", text: answer },
            })),
          },
        )}
      />
      <PageHero
        index="02"
        eyebrow={copy.hero.eyebrow}
        title={copy.hero.title}
        intro={copy.hero.intro}
        theme="dark"
        aside={<HeroStatement eyebrow={copy.promise.eyebrow} statement={copy.promise.title} support={copy.promise.intro} />}
        actions={
          <>
            <CtaLink cta={copy.session} pageRef={copy.ref} variant="primary" />
            <CtaLink cta={copy.intro} pageRef={copy.ref} variant="outline" />
            <Link className="button button--text" href={copy.alternate.href} hrefLang={copy.alternate.lang} lang={copy.alternate.lang}>{copy.alternate.label}</Link>
          </>
        }
      />

      <section className="section surface-muted" id="offers">
        <div className="container-wide">
          <SectionHeading eyebrow={copy.offers.eyebrow} title={copy.offers.title} intro={copy.offers.intro} />
          <OfferList offers={copy.offers.items} pageRef={copy.ref} />
        </div>
      </section>

      <section className="section">
        <div className="container-wide">
          <SectionHeading eyebrow={copy.fit.eyebrow} title={copy.fit.title} intro={copy.fit.intro} />
          <FitLists {...copy.fit} />
        </div>
      </section>

      <section className="section surface-dark" id="engagement">
        <div className="container-wide">
          <SectionHeading eyebrow={copy.engagement.eyebrow} title={copy.engagement.title} intro={copy.engagement.intro} inverse />
          <div className="principles-grid">
            {copy.engagement.stages.map(([index, title, text, output]) => (
              <article className="principle" key={title}>
                <span className="principle__index">{index.toUpperCase()}</span>
                <h3>{title}</h3>
                <p><Lines text={text} /></p>
                <p className="principle__output"><strong>{copy.engagement.youGet}</strong> <Lines text={output} /></p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-wide">
          <SectionHeading eyebrow={copy.principles.eyebrow} title={copy.principles.title} intro={copy.principles.intro} />
          <div className={`journey-grid ${styles.tabletTwo}`}>
            {copy.principles.items.map(([title, text], index) => (
              <article className="journey-step" key={title}>
                <span className="journey-step__number">0{index + 1}</span>
                <h3><Lines text={title} /></h3>
                <p><Lines text={text} /></p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section surface-muted">
        <div className="container-wide">
          <SectionHeading eyebrow={copy.proof.eyebrow} title={copy.proof.title} intro={copy.proof.intro} />
          {he ? (
            <div className={styles.proofLink}><ButtonLink href={copy.proof.link.href} variant="dark">{copy.proof.link.label}</ButtonLink></div>
          ) : (
            <div className="ventures-grid"><WorkCard item={flagship} featured /></div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container-wide">
          <SectionHeading eyebrow={copy.systems.eyebrow} title={copy.systems.title} intro={copy.systems.intro} />
          {he ? (
            <ul className={styles.systemLinks}>
              {systems.map((item) => (
                <li key={item.slug}><Link href={`/work/${item.slug}`} lang="en" dir="ltr">{item.name}<small><Lines text={item.descriptor} /></small></Link></li>
              ))}
            </ul>
          ) : (
            <div className="ventures-grid">{systems.map((item) => <WorkCard item={item} key={item.slug} />)}</div>
          )}
        </div>
      </section>

      <section className="section surface-muted">
        <div className="container-wide diagram-row">
          <SectionHeading eyebrow={copy.alsoAvailable.eyebrow} title={copy.alsoAvailable.title} intro={copy.alsoAvailable.intro} />
          <div className="button-row">
            {copy.alsoAvailable.links.map((cta, index) => <CtaLink cta={cta} pageRef={copy.ref} variant={index === 0 ? "dark" : "outline"} key={cta.href} />)}
          </div>
        </div>
      </section>

      {he ? <Testimonials pillar="ai-systems" eyebrow="במילים שלהם" title="מה אומרים | לקוחות ושותפים." /> : <Testimonials pillar="ai-systems" />}

      <PillarVideos pillar="ai-systems" eyebrow={he ? "צפו" : "WATCH"} title={he ? "בינה מלאכותית בפרויקטים, | בסרטונים קצרים." : "AI in real projects, | in short videos."} />

      {!he && <InsightFeed insights={pillarInsights(pillar, insights)} title="AI in practice, | from real projects." intro="Short notes on what worked, | what did not and what it cost." />}

      <FaqList {...copy.faq} />

      <CtaBand {...copy.cta} primary={copy.intro} secondary={copy.session} pageRef={copy.ref} />
    </>
  );

  return he ? <div dir="rtl" lang="he">{page}</div> : page;
}
