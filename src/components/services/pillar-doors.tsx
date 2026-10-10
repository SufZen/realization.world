import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/button-link";
import { Lines } from "@/components/lines";
import { currentOffers, pillars } from "@/content/services";
import styles from "./services.module.css";

const tones = ["door--brand", "door--dark", styles.doorLight];

/** Homepage: one door per pillar, with its first offers and prices. */
export function PillarDoors() {
  return (
    <section className="doors" aria-label="Choose what you need">
      <div className={`container-wide doors__grid ${styles.doors3}`}>
        {pillars.map(({ slug, href, dimension, title, subtitle, offers }, index) => (
          <article className={`door ${tones[index]}`} key={slug}>
            <p className="eyebrow">0{index + 1} · {dimension.toUpperCase()}</p>
            <h2>{title}</h2>
            <p><Lines text={subtitle} /></p>
            <ul className="door__links">
              {currentOffers(offers).slice(0, 3).map((offer) => (
                <li key={offer.name}>
                  <Link href={`${href}#offers`}><span>{offer.name}</span>{offer.price && <small>{offer.price}</small>}<ArrowUpRight aria-hidden="true" size={18} /></Link>
                </li>
              ))}
            </ul>
            <ButtonLink href={href} variant={index === 1 ? "primary" : "dark"}>See prices and how to start<span className="sr-only">: {title}</span></ButtonLink>
          </article>
        ))}
      </div>
    </section>
  );
}
