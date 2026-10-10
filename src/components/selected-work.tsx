import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Lines } from "@/components/lines";
import { selectedWork } from "@/content/selected-work";
import { workBySlug } from "@/content/work";
import styles from "./home-sections.module.css";

/** Homepage: one example per pillar, compact cards with one strong image each. */
export function SelectedWork() {
  return (
    <ul className={styles.work}>
      {selectedWork.map((entry, index) => {
        const card =
          entry.kind === "work"
            ? (() => {
                const item = workBySlug(entry.slug);
                return item && { href: `/work/${entry.slug}`, title: item.name, text: item.descriptor, status: item.status, more: "View the case" };
              })()
            : { href: entry.href, title: entry.title, text: entry.text, status: entry.status, more: "See how it works" };
        if (!card) return null;
        return (
          <li key={card.href}>
            <Link className={styles.card} href={card.href}>
              <span className={styles.media}><Image src={entry.image.src} alt={entry.image.alt} fill sizes="(max-width: 900px) 100vw, 33vw" /></span>
              <span className={styles.meta}>0{index + 1} · {entry.dimension} · {card.status}</span>
              <h3>{card.title}</h3>
              <p><Lines text={card.text} /></p>
              <span className={styles.more}><span>{card.more}</span><ArrowUpRight aria-hidden="true" size={16} /></span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
