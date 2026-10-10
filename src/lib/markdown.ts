import { plain } from "@/components/lines";
import { bookingUrl, contactEmail, insights, partnerPaths, siteUrl, type Insight } from "@/content/site";
import { categoryOf, work, workCategories, workInCategory, type WorkItem } from "@/content/work";

/**
 * Plain-markdown renderings of site content for LLMs and AI agents
 * (/llms.txt, /llms-full.txt, /work/<slug>.md, /insights/<slug>.md).
 * Everything is generated from the same content objects as the HTML pages.
 */

export const markdownHeaders = {
  "Content-Type": "text/markdown; charset=utf-8",
  "Cache-Control": "public, max-age=3600, s-maxage=86400",
  "X-Robots-Tag": "noindex",
};

export const about =
  "Realization (Realization Unipessoal LDA, Setúbal, Portugal; founded 2019 by Asaf Eyzenkot, also known as Suf Zen) develops residential real estate in the Lisbon metropolitan area and builds the ventures and AI systems around it. It works with two audiences: real-estate owners, capital partners and operators in Portugal, and organisations that want help adopting AI in their operations.";

export function workToMarkdown(item: WorkItem) {
  const lines = [
    `# ${item.name}`,
    "",
    `> ${item.summary}`,
    "",
    `- Category: ${categoryOf(item).label} (${item.eyebrow.toLowerCase()})`,
    `- Status: ${item.status}`,
    ...(item.years ? [`- Years: ${item.years}`] : []),
    `- Location: ${item.location}`,
    `- Realization's role: ${item.role}`,
    ...(item.partners ? [`- Team: ${item.partners.join("; ")}`] : []),
    ...(item.stack ? [`- Stack: ${item.stack.join(", ")}`] : []),
    ...item.links.map((link) => `- Link: [${link.label}](${link.href})`),
    `- Page: ${siteUrl}/work/${item.slug}`,
    "",
    "## Key facts",
    "",
    ...item.facts.map((fact) => `- **${fact.value}** — ${fact.label}`),
    "",
    "## Problem",
    "",
    plain(item.problem),
    "",
    "## Approach",
    "",
    plain(item.approach),
    "",
    "## Outcome",
    "",
    plain(item.outcome),
    "",
  ];
  if (item.steps) {
    lines.push(`## ${plain(item.steps.title)}`, "", plain(item.steps.intro), "");
    item.steps.items.forEach(([title, text], index) => lines.push(`${index + 1}. **${plain(title)}** — ${plain(text)}`));
    lines.push("");
  }
  if (item.projects) {
    lines.push("## Projects", "");
    item.projects.forEach((project) => lines.push(`- ${project.name} — ${project.place} (${project.status})`));
    lines.push("");
  }
  item.sections?.forEach((section) => lines.push(`## ${plain(section.heading)}`, "", ...section.paragraphs.flatMap((paragraph) => [paragraph, ""])));
  if (item.disclosure) lines.push(`Note: ${item.disclosure}`, "");
  lines.push(
    `Source: ${item.source}`,
    "",
    `Next step: ${plain(item.cta.heading)} → ${siteUrl}/bring-an-opportunity?path=${item.cta.path} · Book a 30-minute intro: ${bookingUrl}`,
    "",
  );
  return lines.join("\n");
}

export function insightToMarkdown(insight: Insight) {
  return [
    `# ${plain(insight.title)}`,
    "",
    `> ${plain(insight.excerpt)}`,
    "",
    `- Category: ${insight.category}`,
    `- Published: ${insight.date}`,
    "- Author: Asaf Eyzenkot (Suf Zen), founder of Realization",
    `- Page: ${siteUrl}/insights/${insight.slug}`,
    "",
    ...insight.sections.flatMap((section) => [`## ${plain(section.heading)}`, "", ...section.paragraphs.flatMap((paragraph) => [plain(paragraph), ""])]),
  ].join("\n");
}

/** /llms.txt — index in the llmstxt.org format. */
export function llmsIndex() {
  return [
    "# Realization",
    "",
    `> ${about}`,
    "",
    "Contact: " + contactEmail + ` · Book a 30-minute intro: ${bookingUrl} · Send a brief: ${siteUrl}/bring-an-opportunity`,
    "",
    "Every page below has a plain-markdown version; the full text of all of them is at " + `${siteUrl}/llms-full.txt.`,
    "",
    ...workCategories.flatMap((category) => [
      `## Work — ${category.label}`,
      "",
      ...workInCategory(category).map((item) => `- [${item.name}](${siteUrl}/work/${item.slug}.md): ${item.summary.split(". ")[0]}.`),
      "",
    ]),
    "## Services",
    "",
    `- [Services](${siteUrl}/services): Realization realizes potential in three dimensions: places, systems and teams.`,
    `- [Real estate development](${siteUrl}/services/real-estate): free deal check, a 60-minute deal consultation (€150, credited), feasibility studies and financial models, and development management in Portugal.`,
    `- [AI and operations systems](${siteUrl}/services/ai-systems): a 60-minute strategy session (€150, credited), a fixed-price Audit Sprint, one measured pilot and tapering support; fixed-scope stages with a stop point after each. In Hebrew: ${siteUrl}/he/services/ai-systems.`,
    `- [Team and process setup](${siteUrl}/services/team-setup): clear roles, working processes and a trained team for a development project or a growing firm, with a handoff date; limited fractional operations and development-management roles. Not construction management.`,
    ...partnerPaths.map((path) => `- [${plain(path.title)}](${siteUrl}/partners/${path.slug}): ${plain(path.summary)}`),
    "",
    "## Field notes",
    "",
    ...insights.map((insight) => `- [${plain(insight.title)}](${siteUrl}/insights/${insight.slug}.md): ${plain(insight.excerpt)}`),
    "",
    "## Founder",
    "",
    `- [Asaf Eyzenkot — profile](${siteUrl}/asaf/profile.md): founder-operator in real estate development, business operations and AI-enabled systems; available for B2B fractional and project work.`,
    "",
    "## For agents",
    "",
    `- [MCP server](${siteUrl}/api/mcp): read-only tools to list work, read case studies and field notes, get services and booking details (Streamable HTTP, JSON-RPC over POST).`,
    `- [OpenAPI](${siteUrl}/openapi.json): JSON endpoints under ${siteUrl}/api/public/.`,
    "",
    "## Optional",
    "",
    `- [How we build](${siteUrl}/how-we-build): Discover, Architect, Build, Validate, Transfer.`,
    `- [Thesis](${siteUrl}/thesis): why value hides in broken physical-world systems.`,
    `- [Markets](${siteUrl}/markets): Israel (capital and partnerships), Portugal (base), Europe next.`,
    "",
  ].join("\n");
}

/** /llms-full.txt — the index followed by the full text of every case and note. */
export function llmsFull() {
  return [
    llmsIndex(),
    "---",
    "",
    ...work.flatMap((item) => [workToMarkdown(item), "---", ""]),
    ...insights.flatMap((insight) => [insightToMarkdown(insight), "---", ""]),
  ].join("\n");
}
