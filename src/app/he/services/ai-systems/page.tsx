import type { Metadata } from "next";
import { SystemsPage } from "@/components/services/systems-page";
import { siteUrl } from "@/content/site";
import { systemsHe } from "@/content/services-he";
import { pageMetadata } from "@/lib/metadata";

const path = "/he/services/ai-systems";
const base = pageMetadata(
  "מערכות בינה מלאכותית ותפעול למשרדים וליזמים",
  "אנחנו עוזרים למשרדים מקצועיים, ליזמים ולחברות בנייה להחליט מאיפה מתחילים עם בינה מלאכותית, להוכיח את זה על פיילוט אחד עם מדידה, ולמסור לצוות מערכת שנשארת שלו. פגישת אסטרטגיה של שעה, ספרינט אבחון במחיר קבוע ושלבים נפרדים עם נקודת יציאה.",
  path,
);

export const metadata: Metadata = {
  ...base,
  alternates: { ...base.alternates, languages: { en: `${siteUrl}/services/ai-systems`, he: `${siteUrl}${path}`, "x-default": `${siteUrl}/services/ai-systems` } },
  openGraph: { ...base.openGraph, locale: "he_IL" },
};

// The webinar offer ends on 20.10; regenerate hourly so it disappears without a deploy.
export const revalidate = 3600;

export default function AiSystemsHebrewPage() {
  return <SystemsPage copy={systemsHe} path={path} />;
}
