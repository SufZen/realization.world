import type { Metadata } from "next";
import { ButtonLink } from "@/components/button-link";
import { PageHero } from "@/components/page-hero";
import { whatsappUrl } from "@/content/site";
import { webinar } from "@/lib/webinar";

export const metadata: Metadata = {
  title: "נרשמתם לוובינר",
  robots: { index: false, follow: true },
};

export default function WebinarThankYouPage() {
  return (
    <div dir="rtl" lang="he" className="webinar-page">
      <PageHero
        index="✓"
        eyebrow="ההרשמה התקבלה"
        title="נתראה | ב־20 באוקטובר."
        intro={`${webinar.dateLabel}, ${webinar.timeLabel}. | בדקות הקרובות תגיע אליכם במייל הזמנה ליומן עם הקישור לשידור. | ההקלטה תישלח לכל הנרשמים.`}
        theme="brand"
        actions={
          <>
            <ButtonLink href="/work/arena-barreiro" variant="dark">הפרויקט בבריירו</ButtonLink>
          </>
        }
        aside={
          <div className="webinar-when">
            <p className="eyebrow">רוצים שנתייחס לבעיה מסוימת?</p>
            <p>ענו למייל האישור או כתבו לנו בוואטסאפ. אולי ננתח את הבעיה שלכם בשידור.</p>
            <a className="text-link" href={whatsappUrl} rel="noopener">וואטסאפ</a>
          </div>
        }
      />
    </div>
  );
}
