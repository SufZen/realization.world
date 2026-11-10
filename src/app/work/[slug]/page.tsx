import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/button-link";
import { AreaGapDiagram } from "@/components/diagrams";
import { EditorialMedia } from "@/components/editorial-media";
import { JsonLd } from "@/components/json-ld";
import { Lines, plain } from "@/components/lines";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { bookingUrl, insights } from "@/content/site";
import { categoryOf, work, workBySlug } from "@/content/work";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbSchema, graph, workSchema } from "@/lib/schema";

export function generateStaticParams() {
  return work.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = workBySlug(slug);
  if (!item) return {};
  return pageMetadata(`${item.name} — ${categoryOf(item).label}`, item.summary, `/work/${item.slug}`, {
    modifiedTime: item.updated,
    markdownPath: `/work/${item.slug}.md`,
    imagePath: `/work/${item.slug}/opengraph-image`,
  });
}

export default async function WorkItemPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const item = workBySlug(slug);
  if (!item) notFound();
  const Icon = item.icon;
  const dark = item.kind === "system" || item.kind === "advisory";
  const formHref = `/bring-an-opportunity?path=${item.cta.path}&ref=${item.slug}`;
  const related = insights.filter((insight) => item.related?.includes(insight.slug));
  const isLive = ["Live", "Launching", "Ongoing", "PIP approved · 7.2026", "Pre-launch", "In daily use"].includes(item.status);

  return (
    <>
      <JsonLd data={graph(workSchema(item), breadcrumbSchema([["Work", "/work"], [item.name, `/work/${item.slug}`]]))} />
      <PageHero
        index={categoryOf(item).label.charAt(0)}
        eyebrow={item.eyebrow}
        title={item.name}
        intro={item.descriptor}
        theme={dark ? "dark" : "brand"}
        actions={
          <>
            <ButtonLink href={formHref} variant={dark ? "primary" : "dark"}>{item.cta.label}</ButtonLink>
            {item.links[0] && <ButtonLink href={item.links[0].href} variant="outline">{item.links[0].label}</ButtonLink>}
          </>
        }
        aside={
          item.cover
            ? <EditorialMedia src={item.cover.src} alt={item.cover.alt} label={item.status.toUpperCase()} priority className="page-hero__media" />
            : <div className="page-hero__mark" aria-hidden="true"><span><Icon size={38} strokeWidth={1.4} /></span><i /></div>
        }
      />

      {/* One narrative and one compact fact strip (QA 10.11). The summary feeds metadata and cards. */}
      <section className="section">
        <div className="container-wide case-summary">
          <div className="case-story">
            <p className="eyebrow">THE STORY</p>
            <p className="case-summary__lead">{plain(item.problem)}</p>
            <p>{plain(item.approach)}</p>
            <p>{plain(item.outcome)}</p>
          </div>
          <aside className="case-aside">
            <span className={`status status--${isLive ? "active" : "verify"}`}>{item.status}</span>
            <dl>
              {item.years && <div><dt>Years</dt><dd>{item.years}</dd></div>}
              <div><dt>Where</dt><dd>{item.location}</dd></div>
              <div><dt>Our role</dt><dd>{item.role}</dd></div>
              {item.partners && <div><dt>Team</dt><dd><ul>{item.partners.map((partner) => <li key={partner}>{partner}</li>)}</ul></dd></div>}
              {item.links.length > 0 && <div><dt>Links</dt><dd><ul>{item.links.map((link) => <li key={link.href}><a href={link.href} target="_blank" rel="noopener">{link.label}</a></li>)}</ul></dd></div>}
            </dl>
            {item.facts.length > 0 && (
              <dl className="case-facts">
                {item.facts.map((fact) => (
                  <div className="case-fact" key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>
                ))}
              </dl>
            )}
          </aside>
        </div>
      </section>

      {item.diagram === "area-gap" && (
        <section className="section">
          <div className="container-wide diagram-row">
            <SectionHeading eyebrow="THE PROBLEM, DRAWN" title="Three areas. | One building." intro="When registry, licence and building disagree, | the property cannot move." />
            <figure className="diagram diagram--panel"><AreaGapDiagram /><figcaption>Only the yellow part exists on paper.</figcaption></figure>
          </div>
        </section>
      )}

      {item.projects && (
        <section className="section">
          <div className="container-wide">
            <SectionHeading eyebrow="PROJECTS" title="Selected work" intro="Residential, interior | and small urban projects." />
            {item.projects.every((project) => project.image) ? (
              <div className="project-grid">
                {item.projects.map((project) => (
                  <figure className="project-tile" key={project.name}>
                    <div className="project-tile__image">
                      <Image src={project.image!} alt={`${project.name}, ${project.place}`} fill sizes="(max-width: 760px) 100vw, 33vw" />
                    </div>
                    <figcaption>
                      <h3>{project.name}</h3>
                      <p>{project.place}</p>
                      <span className={`status status--${project.status === "Finished" ? "active" : "verify"}`}>{project.status}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            ) : (
              <div className="project-list">
                {item.projects.map((project) => (
                  <article className="project-row" key={project.name}>
                    <div><h3>{project.name}</h3></div>
                    <p>{project.place}</p>
                    <span className={`status status--${project.status === "Finished" ? "active" : "verify"}`}>{project.status}</span>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {item.sections && (
        <section className="section">
          <div className="container article-shell">
            <aside className="article-meta"><p className="eyebrow">THE DETAIL</p><p>{item.sections.length} {item.sections.length === 1 ? "part" : "parts"}</p></aside>
            <div className="article-content">
              {item.sections.map((section) => (
                <section key={section.heading}>
                  <h2><Lines text={section.heading} /></h2>
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </section>
              ))}
            </div>
          </div>
        </section>
      )}

      {item.gallery && (
        <section className="section surface-muted">
          <div className="container-wide">
            <SectionHeading eyebrow="IMAGES" title="The work, | shown." />
            <div className="case-gallery">
              {item.gallery.map((image) => (
                <figure key={image.src} className={image.wide ? "case-gallery__wide" : undefined}>
                  <Image src={image.src} alt={image.alt} width={1600} height={1000} sizes={image.wide ? "(max-width: 1480px) 100vw, 1400px" : "(max-width: 760px) 100vw, 50vw"} />
                  {image.caption && <figcaption>{image.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="case-notes">
        <div className="container-wide">
          {item.disclosure && <p><strong>Note.</strong> {item.disclosure}</p>}
          <p><strong>Source.</strong> {item.source}</p>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section surface-muted">
          <div className="container-wide">
            <SectionHeading eyebrow="RELATED FIELD NOTES" title="The thinking | behind it." />
            <div className="insights-grid">
              {related.map((insight) => {
                const InsightIcon = insight.icon;
                return (
                  <Link className="insight-card" href={`/insights/${insight.slug}`} key={insight.slug}>
                    <div className="insight-card__icon"><InsightIcon size={24} strokeWidth={1.5} /></div>
                    <div>
                      <p className="eyebrow">{insight.category}</p>
                      <h3><Lines text={insight.title} /></h3>
                      <p><Lines text={insight.excerpt} /></p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="cta-band">
        <div className="container-wide cta-band__grid">
          <div>
            <p className="eyebrow">NEXT STEP</p>
            <h2><Lines text={item.cta.heading} /></h2>
            <p>Or <a className="text-link" href={bookingUrl} target="_blank" rel="noopener">book a 20-minute intro call</a> with Asaf.</p>
          </div>
          <ButtonLink href={formHref} variant="dark">{item.cta.label}</ButtonLink>
        </div>
      </section>
    </>
  );
}
