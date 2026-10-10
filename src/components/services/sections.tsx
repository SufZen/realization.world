import Link from "next/link";
import { Lines, plain } from "@/components/lines";
import { SectionHeading } from "@/components/section-heading";
import type { Insight } from "@/content/site";
import type { Cta, Offer } from "@/content/services";
import { CtaLink } from "./cta-link";
import styles from "./services.module.css";

/** Shared blocks of the Services pages. */

export function OfferList({ offers, pageRef }: { offers: Offer[]; pageRef: string }) {
  return (
    <ol className={styles.offers}>
      {offers.map((offer, index) => (
        <li className={styles.offer} key={offer.name}>
          <span className={styles.offerIndex}>0{index + 1}</span>
          <div>
            <h3>{offer.name}</h3>
            <p><Lines text={plain(offer.text)} /></p>
          </div>
          <div className={styles.offerMeta}>
            {offer.price && <span className={styles.offerPrice}>{offer.price}</span>}
            <span>{offer.format}</span>
          </div>
          <div className={styles.offerCta}>
            {offer.cta && <CtaLink cta={offer.cta} pageRef={pageRef} variant={offer.cta.event?.startsWith("book-") || offer.cta.event === "buy-audit" ? "dark" : "outline"} />}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function InsightFeed({ insights, eyebrow = "FIELD NOTES", title, intro }: { insights: Insight[]; eyebrow?: string; title: string; intro?: string }) {
  if (!insights.length) return null;
  return (
    <section className="section surface-dark">
      <div className="container-wide">
        <SectionHeading eyebrow={eyebrow} title={title} intro={intro} inverse />
        <div className="insights-grid">
          {insights.map(({ slug, category, title: noteTitle, excerpt, published, readTime, icon: Icon }) => (
            <Link className="insight-card" href={`/insights/${slug}`} key={slug}>
              <div className="insight-card__icon"><Icon size={25} strokeWidth={1.5} /></div>
              <div><p className="eyebrow">{category}</p><h3><Lines text={noteTitle} /></h3><p><Lines text={excerpt} /></p><div className="insight-card__meta"><span>{published}</span><span>{readTime}</span></div></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqList({ eyebrow, title, items }: { eyebrow: string; title: string; items: ReadonlyArray<readonly [string, string]> }) {
  return (
    <section className="section">
      <div className="container">
        <SectionHeading eyebrow={eyebrow} title={title} />
        <div className="faq-list">
          {items.map(([question, answer]) => (
            <details className="faq-item" key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaBand({ eyebrow, title, text, primary, secondary, pageRef }: { eyebrow: string; title: string; text: string; primary: Cta; secondary?: Cta; pageRef: string }) {
  return (
    <section className="cta-band">
      <div className="container-wide cta-band__grid">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2><Lines text={title} /></h2>
          <p><Lines text={text} /></p>
        </div>
        <div className="button-row">
          <CtaLink cta={primary} pageRef={pageRef} variant="dark" />
          {secondary && <CtaLink cta={secondary} pageRef={pageRef} variant="outline" />}
        </div>
      </div>
    </section>
  );
}

export function FitLists({ strongTitle = "A strong fit", strong, notYetTitle = "Not yet a fit", notYet }: { strongTitle?: string; strong: readonly string[]; notYetTitle?: string; notYet: readonly string[] }) {
  return (
    <div className="fit-grid">
      <article className="fit-list"><h3>{strongTitle}</h3><ul>{strong.map((item) => <li key={item}>{item}</li>)}</ul></article>
      <article className="fit-list"><h3>{notYetTitle}</h3><ul>{notYet.map((item) => <li key={item}>{item}</li>)}</ul></article>
    </div>
  );
}
