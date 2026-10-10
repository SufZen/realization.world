import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Lines } from "@/components/lines";
import { selectedWork } from "@/content/selected-work";
import { workBySlug } from "@/content/work";
import styles from "./home-sections.module.css";

/** Homepage: one project per pillar, compact cards with one strong image each. */
export function SelectedWork() {
  return (
    <ul className={styles.work}>
      {selectedWork.map(({ slug, dimension, image }, index) => {
        const item = workBySlug(slug);
        if (!item) return null;
        return (
          <li key={slug}>
            <Link className={styles.card} href={`/work/${slug}`}>
              <span className={styles.media}><Image src={image.src} alt={image.alt} fill sizes="(max-width: 900px) 100vw, 33vw" /></span>
              <span className={styles.meta}>0{index + 1} · {dimension} · {item.status}</span>
              <h3>{item.name}</h3>
              <p><Lines text={item.descriptor} /></p>
              <span className={styles.more}><span>View the case</span><ArrowUpRight aria-hidden="true" size={16} /></span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
