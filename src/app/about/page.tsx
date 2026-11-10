import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/button-link";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { pageMetadata } from "@/lib/metadata";
import { Lines } from "@/components/lines";

export const metadata: Metadata = pageMetadata(
  "About",
  "Realization is Asaf Eyzenkot’s company for unrealized real estate: homes, buildings and projects that got stuck. An architect by training, he works inside the deal or the venture.",
  "/about",
);

/*
 * Approved facts only (QA 10.11): realization-studio brand/field-definition.md sections 1, 8 and 10,
 * and the BOA, Burtucala and Arena records in src/content/work.ts. The six values block is gone;
 * the field's values are the stance behind the copy, not a list on the page.
 */
export default function AboutPage() {
  return (
    <>
      <PageHero
        index="07"
        eyebrow="ABOUT REALIZATION"
        title="Each venture | releases one blockage."
        intro="Homes, buildings and projects that got stuck | still hold their value. We work on releasing it."
        actions={<ButtonLink href="/thesis" variant="dark">Read the thesis</ButtonLink>}
        theme="brand"
      />

      <section className="section">
        <div className="container-wide about-founder">
          <div className="founder-mark">
            <Image className="founder-portrait" src="/asaf/asaf-eyzenkot.jpg" alt="Asaf Eyzenkot, founder of Realization" width={480} height={480} sizes="(max-width: 760px) 60vw, 26vw" />
          </div>
          <div className="about-founder__copy">
            <p className="eyebrow">ARCHITECT AND FOUNDER</p>
            <h2>Asaf Eyzenkot</h2>
            <h3>He does not advise from outside. | He is inside the deal or the venture.</h3>
            <p><Lines text="An architecture graduate of Tel Aviv University. | In Portugal he co-founded BOA Architecture in Setúbal, | and before it Burtucala, a bridge between investors abroad | and partners in Portugal." /></p>
            <p><Lines text="Today he is the managing partner and development manager of Arena in Barreiro, | and works between Israel, Portugal and Barcelona." /></p>
            <div className="button-row"><a className="button button--dark" href="/asaf"><span>Founder profile</span></a><ButtonLink href="/work/arena-barreiro" variant="outline">See Arena</ButtonLink></div>
          </div>
        </div>
      </section>

      <section className="section surface-dark"><div className="container-wide"><SectionHeading eyebrow="HOW THE GROUP GROWS" title="Two ventures, | two kinds of blockage." intro="Arena moves one stalled site from land to homes. | FLUII works on homes stuck in inheritance and paperwork." inverse /><div className="button-row"><ButtonLink href="/work" variant="primary">Explore the work</ButtonLink><ButtonLink href="/partners" variant="outline">See partner paths</ButtonLink></div></div></section>
    </>
  );
}
