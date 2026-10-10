import type { Metadata } from "next";
import { SystemsPage } from "@/components/services/systems-page";
import { siteUrl } from "@/content/site";
import { systemsEn } from "@/content/services";
import { pageMetadata } from "@/lib/metadata";

const path = "/services/ai-systems";
const base = pageMetadata(
  "AI and operations systems — AI adoption for firms and developers",
  "Realization helps professional firms and real-estate operators decide where AI starts, prove it on one measured pilot, and hand over a system the team owns. A 60-minute strategy session, a fixed-price Audit Sprint, and fixed-scope stages with a built-in exit.",
  path,
);

// The former /advisory page (it 301-redirects here, see next.config.ts).
export const metadata: Metadata = {
  ...base,
  alternates: { ...base.alternates, languages: { en: `${siteUrl}${path}`, he: `${siteUrl}/he${path}`, "x-default": `${siteUrl}${path}` } },
};

// The webinar offer ends on 20.10; regenerate hourly so it disappears without a deploy.
export const revalidate = 3600;

export default function AiSystemsPage() {
  return <SystemsPage copy={systemsEn} path={path} />;
}
