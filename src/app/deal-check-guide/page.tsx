import type { Metadata } from "next";
import { DealGuide } from "@/components/deal-guide/deal-guide";
import { pageMetadata } from "@/lib/metadata";
import { webinar } from "@/lib/webinar";

const base = pageMetadata(
  "איך לבחון עסקה לפני שמתקדמים: מדריך אינטראקטיבי",
  "שבע בדיקות שאנחנו עושים על כל עסקת נדל״ן, לפני שפונים לשמאי, לעורך דין או למימון. בדיקה אחת בכל מסך, ובסוף רשימה אישית של מה לשאול. חינם, בלי הרשמה.",
  "/deal-check-guide",
  { imagePath: "/webinar/og.jpg" },
);

export const metadata: Metadata = { ...base, openGraph: { ...base.openGraph, locale: "he_IL" } };

// "20261020T183000Z" → epoch ms; the guide's closing CTA switches to the deal-check service once the webinar is over.
const utc = (stamp: string) =>
  Date.UTC(+stamp.slice(0, 4), +stamp.slice(4, 6) - 1, +stamp.slice(6, 8), +stamp.slice(9, 11), +stamp.slice(11, 13));

// Printing the checklist: only the guide, without the site's header and footer.
const printCss = "@media print { .site-header, .site-footer, .skip-link { display: none !important; } body { background: #fff; } }";

export default function DealCheckGuidePage() {
  return (
    <div dir="rtl" lang="he" className="deal-guide-page">
      <style>{printCss}</style>
      <DealGuide webinar={{ endsAt: utc(webinar.endUtc), when: "שלישי 20.10 · 20:00 שעון ישראל", href: "/webinar?ref=guide" }} />
    </div>
  );
}
