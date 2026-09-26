import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Venture } from "@/content/site";

export function VentureCard({ venture, featured = false }: { venture: Venture; featured?: boolean }) {
  const Icon = venture.icon;
  return (
    <article className={`venture-card ${featured ? "venture-card--featured" : ""}`}>
      <div className="venture-card__media">
        <Image src={venture.image} alt={venture.imageAlt} fill sizes="(max-width: 760px) 100vw, 50vw" />
        <span>{venture.eyebrow}</span>
      </div>
      <div className="venture-card__top">
        <div className="venture-card__icon"><Icon size={27} strokeWidth={1.5} /></div>
        <span className={`status status--${venture.stage === "Active" ? "active" : "verify"}`}>{venture.stage}</span>
      </div>
      <h3>{venture.name}</h3>
      <p>{venture.descriptor}</p>
      <Link href={`/ventures/${venture.slug}`}>View venture <ArrowUpRight aria-hidden="true" size={18} /></Link>
    </article>
  );
}
