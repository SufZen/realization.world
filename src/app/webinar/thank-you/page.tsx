import type { Metadata } from "next";
import { ButtonLink } from "@/components/button-link";
import { PageHero } from "@/components/page-hero";
import { whatsappUrl } from "@/content/site";
import { webinar, webinarCalendarUrl } from "@/lib/webinar";

export const metadata: Metadata = {
  title: "נרשמת לוובינר",
  robots: { index: false, follow: true },
};

export default function WebinarThankYouPage() {
  return (
    <div dir="rtl" lang="he" className="webinar-page">
      <PageHero
        index="✓"
        eyebrow="ההרשמה התקבלה"
        title="נתראה | ב-20 באוקטובר."
        intro={`${webinar.dateLabel}, ${webinar.timeLabel}. | לינק ה-Google Meet יגיע למייל לפני השידור.`}
        theme="brand"
        actions={
          <>
            <ButtonLink href={webinarCalendarUrl} variant="dark">הוספה ל-Google Calendar</ButtonLink>
            <ButtonLink href="/work/arena-barreiro" variant="outline">הפרויקט בברריירו</ButtonLink>
          </>
        }
        aside={
          <div className="webinar-when">
            <p className="eyebrow">יש שאלה?</p>
            <p>אפשר לענות למייל האישור, או לכתוב לנו.</p>
            <a className="text-link" href={whatsappUrl} rel="noopener">וואטסאפ</a>
          </div>
        }
      />
    </div>
  );
}
