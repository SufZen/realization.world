import type { Metadata } from "next";
import { CtaLink } from "@/components/services/cta-link";
import { SocialLinks } from "@/components/social-links";
import { bioLinks } from "@/content/links";
import { currentOffers } from "@/content/services";
import { pageMetadata } from "@/lib/metadata";
import styles from "./links.module.css";

const base = pageMetadata(
  "Links — Realization and Suf Zen",
  "Book an intro call, join the free webinar, check a deal in Portugal, watch on YouTube or get Realization updates by email.",
  "/links",
);

// A link hub for social bios: not a page for search results.
export const metadata: Metadata = { ...base, robots: { index: false, follow: true } };

// The webinar link ends on 20.10: regenerate hourly.
export const revalidate = 3600;

export default function LinksPage() {
  return (
    <section className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.head}>
          <p className="eyebrow">REALIZATION · SUF ZEN</p>
          <h1>Start here.</h1>
          <p>Real estate in Portugal, AI systems and delivery teams. Built with you, then handed over.</p>
        </div>
        <ul className={styles.stack}>
          {currentOffers(bioLinks).map((link, index) => (
            <li key={link.href}><CtaLink cta={link} pageRef="links" variant={index === 0 ? "dark" : index === 1 ? "primary" : "outline"} /></li>
          ))}
        </ul>
        <div className={styles.social}><SocialLinks /></div>
      </div>
    </section>
  );
}
