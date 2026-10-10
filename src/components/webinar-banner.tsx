import Link from "next/link";
import { webinar } from "@/lib/webinar";

// Homepage strip for the 20.10 webinar. Profile links that can only point at the homepage
// (TikTok, some bios) land here, so registration stays one tap away. Rendered only before
// the webinar ends (checked when the page is built; the homepage is static), and remove the
// component after 20.10.
const showBanner = Date.now() < Date.parse("2026-10-20T18:30:00Z");

export function WebinarBanner() {
  if (!showBanner) return null;
  return (
    <aside className="webinar-banner" dir="rtl" lang="he" aria-label="וובינר חינמי">
      <Link href="/webinar?ref=site-banner" className="webinar-banner__link">
        <span className="webinar-banner__tag">וובינר חינמי בעברית</span>
        <span className="webinar-banner__title">{webinar.shortTitle}</span>
        <span className="webinar-banner__when">שלישי 20.10 · 20:00 שעון ישראל</span>
        <span className="webinar-banner__cta">להרשמה</span>
      </Link>
    </aside>
  );
}
