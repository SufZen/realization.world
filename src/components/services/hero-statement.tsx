import { Lines, plain } from "@/components/lines";
import styles from "./services.module.css";

/** The side column of a pillar page hero: who it is for, or the promise. The column is narrow, so the statement flows freely. */
export function HeroStatement({ eyebrow, statement, support }: { eyebrow: string; statement: string; support?: string }) {
  return (
    <div className={styles.heroStatement}>
      <p className="eyebrow">{eyebrow}</p>
      <strong><Lines text={plain(statement)} /></strong>
      {support && <p><Lines text={support} /></p>}
    </div>
  );
}
