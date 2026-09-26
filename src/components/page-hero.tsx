import type { ReactNode } from "react";
import { Lines } from "./lines";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  intro: string;
  index?: string;
  actions?: ReactNode;
  theme?: "light" | "brand" | "dark";
  aside?: ReactNode;
};

export function PageHero({ eyebrow, title, intro, index = "R/W", actions, theme = "light", aside }: PageHeroProps) {
  return (
    <section className={`page-hero page-hero--${theme}`}>
      <div className="container-wide page-hero__grid">
        <div className="page-hero__content">
          <div className="eyebrow-line"><span>{index}</span><p className="eyebrow">{eyebrow}</p></div>
          <h1><Lines text={title} /></h1>
          <p className="page-hero__intro"><Lines text={intro} /></p>
          {actions && <div className="button-row">{actions}</div>}
        </div>
        {aside || <div className="page-hero__mark" aria-hidden="true"><span>R</span><i /></div>}
      </div>
    </section>
  );
}
