import { plain } from "@/components/lines";
import { bookingUrl, contactEmail, siteUrl, type Insight } from "@/content/site";
import { socialLinks } from "@/content/social";
import type { WorkItem } from "@/content/work";

/** Stable schema.org identifiers so every page describes the same entities. */
export const ids = {
  organization: `${siteUrl}/#organization`,
  website: `${siteUrl}/#website`,
  founder: `${siteUrl}/asaf#person`,
};

const sameAs = [
  "https://www.linkedin.com/in/sufzen",
  "https://github.com/SufZen",
  "https://realization.pt",
  "https://realizeos.ai",
  "https://realization.co.il",
  "https://www.boaarc.com",
];

export const organizationSchema = {
  "@type": "Organization",
  "@id": ids.organization,
  name: "Realization",
  legalName: "Realization Unipessoal LDA",
  url: siteUrl,
  logo: `${siteUrl}/brand/butterfly-mark.png`,
  description:
    "Realization develops real estate in Portugal and builds the ventures and AI systems around it: residential development, property resolution, and advisory on AI adoption and operations.",
  founder: { "@id": ids.founder },
  foundingDate: "2019",
  email: contactEmail,
  areaServed: [
    { "@type": "Country", name: "Portugal" },
    { "@type": "Country", name: "Israel" },
  ],
  address: { "@type": "PostalAddress", streetAddress: "Largo José Afonso 44", addressLocality: "Setúbal", addressCountry: "PT" },
  taxID: "517298961",
  sameAs,
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "sales",
      email: contactEmail,
      url: `${siteUrl}/bring-an-opportunity`,
      availableLanguage: ["English", "Hebrew", "Portuguese"],
    },
  ],
  potentialAction: { "@type": "ScheduleAction", name: "Book a 30-minute intro call", target: bookingUrl },
};

export const websiteSchema = {
  "@type": "WebSite",
  "@id": ids.website,
  url: siteUrl,
  name: "Realization",
  publisher: { "@id": ids.organization },
  inLanguage: "en",
};

export const founderSchema = {
  "@type": "Person",
  "@id": ids.founder,
  name: "Asaf Eyzenkot",
  alternateName: "Suf Zen",
  url: `${siteUrl}/asaf`,
  image: `${siteUrl}/asaf/asaf-eyzenkot.jpg`,
  jobTitle: "Founder, Realization",
  worksFor: { "@id": ids.organization },
  sameAs: ["https://github.com/SufZen", ...socialLinks.map((link) => link.href)],
};

export function breadcrumbSchema(trail: Array<[name: string, path: string]>) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [["Home", ""] as [string, string], ...trail].map(([name, path], index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: `${siteUrl}${path}`,
    })),
  };
}

export function workSchema(item: WorkItem) {
  const url = `${siteUrl}/work/${item.slug}`;
  const base = {
    "@id": `${url}#work`,
    name: item.name,
    url,
    description: item.summary,
    image: item.cover ? `${siteUrl}${item.cover.src}` : undefined,
    dateModified: item.updated,
    subjectOf: { "@type": "WebPage", url },
  };
  if (item.schema === "SoftwareApplication") {
    return {
      "@type": "SoftwareApplication",
      ...base,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Linux (self-hosted, Docker)",
      author: { "@id": ids.organization },
      sameAs: item.links.map((link) => link.href),
    };
  }
  if (item.schema === "Organization") {
    return {
      "@type": "Organization",
      ...base,
      founder: { "@id": ids.founder },
      parentOrganization: item.kind === "venture" && item.status !== "Concluded" ? { "@id": ids.organization } : undefined,
      sameAs: item.links.map((link) => link.href),
    };
  }
  return {
    "@type": "CreativeWork",
    ...base,
    creator: { "@id": ids.organization },
    locationCreated: { "@type": "Place", name: item.location },
    about: plain(item.problem),
  };
}

export function articleSchema(insight: Insight) {
  const url = `${siteUrl}/insights/${insight.slug}`;
  return {
    "@type": "Article",
    "@id": `${url}#article`,
    headline: plain(insight.title),
    description: plain(insight.excerpt),
    url,
    mainEntityOfPage: url,
    datePublished: insight.date,
    dateModified: insight.date,
    articleSection: insight.category,
    author: { "@id": ids.founder },
    publisher: { "@id": ids.organization },
    image: `${siteUrl}/insights/${insight.slug}/opengraph-image`,
    inLanguage: "en",
  };
}

/** Serialises one or more nodes into a single schema.org graph. */
export function graph(...nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
