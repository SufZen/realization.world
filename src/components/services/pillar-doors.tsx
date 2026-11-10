import { ButtonLink } from "@/components/button-link";
import { Lines } from "@/components/lines";
import { pillars } from "@/content/services";
import styles from "./services.module.css";

const tones = ["door--brand", "door--dark", styles.doorLight];

/** Homepage: one door per route, with the reader's problem and one link. Offers and prices live on the pillar pages. */
export function PillarDoors() {
  return (
    <section className="doors" aria-label="Where your project is stuck">
      <div className={`container-wide doors__grid ${styles.doors3}`}>
        {pillars.map(({ slug, href, title, problem }, index) => (
          <article className={`door ${tones[index]}`} key={slug}>
            <p className="eyebrow">0{index + 1} · {title.toUpperCase()}</p>
            <h2><Lines text={problem} /></h2>
            <ButtonLink href={href} variant={index === 1 ? "primary" : "dark"}>{title}</ButtonLink>
          </article>
        ))}
      </div>
    </section>
  );
}
