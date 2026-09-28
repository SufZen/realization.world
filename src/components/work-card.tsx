import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { WorkItem } from "@/content/work";
import { Lines } from "./lines";

const liveStatuses = new Set<WorkItem["status"]>(["Live", "Ongoing", "In daily use"]);

export function WorkCard({ item, featured = false }: { item: WorkItem; featured?: boolean }) {
  const Icon = item.icon;
  return (
    <article className={`venture-card work-card ${featured ? "venture-card--featured" : ""}`}>
      {item.cover ? (
        <div className="venture-card__media">
          <Image src={item.cover.src} alt={item.cover.alt} fill sizes="(max-width: 760px) 100vw, 50vw" />
          <span>{item.eyebrow}</span>
        </div>
      ) : (
        <p className="eyebrow work-card__eyebrow">{item.eyebrow}</p>
      )}
      <div className="venture-card__top">
        <div className="venture-card__icon"><Icon size={27} strokeWidth={1.5} /></div>
        <span className={`status status--${liveStatuses.has(item.status) ? "active" : "verify"}`}>{item.status}</span>
      </div>
      <h3>{item.name}</h3>
      <p><Lines text={item.descriptor} /></p>
      <p className="work-card__meta">{[item.role.split(";")[0], item.years].filter(Boolean).join(" · ")}</p>
      <Link href={`/work/${item.slug}`}>View the case <ArrowUpRight aria-hidden="true" size={18} /><span className="sr-only"> — {item.name}</span></Link>
    </article>
  );
}
