import { Lines } from "./lines";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  intro?: string;
  inverse?: boolean;
  align?: "split" | "stack";
};

export function SectionHeading({ eyebrow, title, intro, inverse = false, align = "stack" }: SectionHeadingProps) {
  return (
    <div className={`section-heading section-heading--${align} ${inverse ? "section-heading--inverse" : ""}`}>
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2><Lines text={title} /></h2>
      </div>
      {intro && <p className="section-heading__intro"><Lines text={intro} /></p>}
    </div>
  );
}
