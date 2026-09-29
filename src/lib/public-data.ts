import { plain } from "@/components/lines";
import { bookingUrl, contactEmail, insights, siteUrl, whatsappUrl, type Insight } from "@/content/site";
import { categoryOf, formPaths, work, type WorkItem } from "@/content/work";
import { about } from "@/lib/markdown";

/** JSON shapes shared by /api/public/* and the MCP server. No React components, no line markers. */

export function workSummary(item: WorkItem) {
  return {
    slug: item.slug,
    name: item.name,
    category: categoryOf(item).label,
    status: item.status,
    years: item.years ?? null,
    location: item.location,
    role: item.role,
    summary: item.summary,
    url: `${siteUrl}/work/${item.slug}`,
    markdown: `${siteUrl}/work/${item.slug}.md`,
  };
}

export function workDetail(item: WorkItem) {
  return {
    ...workSummary(item),
    descriptor: plain(item.descriptor),
    problem: plain(item.problem),
    approach: plain(item.approach),
    outcome: plain(item.outcome),
    facts: item.facts,
    steps: item.steps?.items.map(([title, text]) => ({ title: plain(title), text: plain(text) })) ?? [],
    projects: item.projects ?? [],
    sections: item.sections?.map((section) => ({ heading: plain(section.heading), text: section.paragraphs.join("\n\n") })) ?? [],
    team: item.partners ?? [],
    stack: item.stack ?? [],
    links: item.links,
    disclosure: item.disclosure ?? null,
    source: item.source,
    updated: item.updated,
    next_step: { text: plain(item.cta.heading), brief_url: `${siteUrl}/bring-an-opportunity?path=${item.cta.path}`, booking_url: bookingUrl },
  };
}

export function insightSummary(insight: Insight) {
  return {
    slug: insight.slug,
    title: plain(insight.title),
    category: insight.category,
    excerpt: plain(insight.excerpt),
    published: insight.date,
    author: "Asaf Eyzenkot",
    url: `${siteUrl}/insights/${insight.slug}`,
    markdown: `${siteUrl}/insights/${insight.slug}.md`,
  };
}

export function insightDetail(insight: Insight) {
  return {
    ...insightSummary(insight),
    sections: insight.sections.map((section) => ({ heading: plain(section.heading), text: section.paragraphs.map(plain).join("\n\n") })),
  };
}

export const services = {
  organization: about,
  services: [
    {
      name: "Advisory — AI adoption and operations",
      url: `${siteUrl}/advisory`,
      stages: [
        "Stage 0 · Focused discovery: 2–3 sessions → decisions document, tiered roadmap, success measures",
        "Stage 1 · Guided pilot: 3–5 weeks, one domain, two people → working process measured before and after",
        "Stage 2 · Tapering support: ~10–12 advisory hours a month, ending at month 12",
        "Add-on · Team workshops on the client's own cases",
      ],
      pricing: "Each stage is priced as a separate fixed unit before it starts; stop after any stage.",
    },
    { name: "Real-estate development and capital partnerships (Portugal)", url: `${siteUrl}/partners/capital` },
    { name: "Stuck property resolution (Portugal)", url: "https://realization.pt" },
    { name: "Fractional operations and development management (Asaf Eyzenkot)", url: `${siteUrl}/asaf` },
  ],
};

export const contact = {
  email: contactEmail,
  booking_url: bookingUrl,
  whatsapp_url: whatsappUrl,
  brief_form_url: `${siteUrl}/bring-an-opportunity`,
  brief_paths: formPaths.map(([value, label]) => ({ value, label })),
  languages: ["English", "Hebrew"],
  locations: ["Remote", "Lisbon metropolitan area, Portugal", "Barcelona, Spain"],
  reply_time: "Within two working days",
};

export const findWork = (slug: string) => work.find((item) => item.slug === slug);
export const findInsight = (slug: string) => insights.find((insight) => insight.slug === slug);
