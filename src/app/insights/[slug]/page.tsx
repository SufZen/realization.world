import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/button-link";
import { PageHero } from "@/components/page-hero";
import { insights } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { Lines } from "@/components/lines";
import { insightDiagrams } from "@/components/diagrams";

export function generateStaticParams() {
  return insights.map((insight) => ({ slug: insight.slug }));
}

export async function generateMetadata({ params }: PageProps<"/insights/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const insight = insights.find((entry) => entry.slug === slug);
  return insight ? pageMetadata(insight.title, insight.excerpt, `/insights/${insight.slug}`) : {};
}

export default async function InsightPage({ params }: PageProps<"/insights/[slug]">) {
  const { slug } = await params;
  const insight = insights.find((entry) => entry.slug === slug);
  if (!insight) notFound();
  const Icon = insight.icon;
  const Cover = insightDiagrams[insight.slug];
  return (
    <>
      <PageHero
        index="I"
        eyebrow={insight.category}
        title={insight.title}
        intro={insight.excerpt}
        theme="dark"
        aside={Cover ? <figure className="page-hero__diagram diagram"><Cover /></figure> : <div className="page-hero__mark" aria-hidden="true"><span><Icon size={38} strokeWidth={1.4} /></span><i /></div>}
      />
      <article className="section">
        <div className="container article-shell">
          <aside className="article-meta">
            <p className="eyebrow">{insight.published}</p>
            <p>{insight.readTime}</p>
            <a href="/asaf">By Asaf Eyzenkot</a>
            <Link href="/insights"><ArrowLeft className="r-flip-x" size={16} /> All insights</Link>
          </aside>
          <div className="article-content">
            {insight.sections.map((section) => <section key={section.heading}><h2><Lines text={section.heading} /></h2>{section.paragraphs.map((paragraph) => <p key={paragraph}><Lines text={paragraph} /></p>)}</section>)}
          </div>
        </div>
      </article>
      <section className="cta-band"><div className="container-wide cta-band__grid"><div><p className="eyebrow">FROM NOTE TO VENTURE</p><h2><Lines text="What physical system | are you seeing?" /></h2></div><ButtonLink href="/bring-an-opportunity" variant="dark">Share the opportunity</ButtonLink></div></section>
    </>
  );
}
