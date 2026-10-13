import type { Metadata } from "next";
import { ButtonLink } from "@/components/button-link";
import { Lines } from "@/components/lines";
import { Countdown } from "@/components/webinar/countdown";
import { whatsappUrl } from "@/content/site";
import { webinar, webinarCalendarUrl } from "@/lib/webinar";
import "../webinar-motion.css";

export const metadata: Metadata = {
  title: "נרשמתם לוובינר",
  robots: { index: false, follow: true },
};

/** A circle and a check that draw in, then the butterfly lands on them (static with reduced motion). */
function Seal() {
  return (
    <svg className="wm-seal" viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="60" r="48" fill="none" stroke="#000" strokeWidth="2" transform="rotate(-90 60 60)" />
      <path d="M40 61l13 13 27-29" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="square" />
      <image href="/brand/butterfly-mark-96.png" x="82" y="2" width="34" height="34" />
    </svg>
  );
}

export default function WebinarThankYouPage() {
  return (
    <div dir="rtl" lang="he" className="webinar-page">
      {/* PageHero's markup, with the drawn seal in place of its ✓ index so the moment shows first on phones too. */}
      <section className="page-hero page-hero--brand">
        <div className="container-wide page-hero__grid">
          <div className="page-hero__content">
            <div className="eyebrow-line wm-ty-line"><Seal /><p className="eyebrow">ההרשמה התקבלה</p></div>
            <h1><Lines text="נתראה | ב־20 באוקטובר." /></h1>
            <p className="page-hero__intro"><Lines text={`${webinar.dateLabel}, ${webinar.timeLabel}. | בדקות הקרובות תגיע אליכם במייל הזמנה ליומן עם הקישור לשידור. | ההקלטה תישלח לכל הנרשמים.`} /></p>
            <div className="button-row">
              <ButtonLink href="/work/arena-barreiro" variant="dark">הפרויקט בבריירו</ButtonLink>
              <p className="wm-cal">
                ההזמנה לא הגיעה? אפשר להוסיף ליומן:
                <a href={webinarCalendarUrl} target="_blank" rel="noopener noreferrer" data-umami-event="webinar-calendar" data-umami-event-calendar="google">Google Calendar</a>
                <a href="/webinar/event.ics" data-umami-event="webinar-calendar" data-umami-event-calendar="ics">Apple / Outlook</a>
              </p>
            </div>
          </div>
          <div className="webinar-when wm-ty-aside">
            <Countdown startUtc={webinar.startUtc} endUtc={webinar.endUtc} />
            <p className="eyebrow">רוצים שנתייחס לבעיה מסוימת?</p>
            <p>ענו למייל האישור או כתבו לנו בוואטסאפ. אולי ננתח את הבעיה שלכם בשידור.</p>
            <a className="text-link" href={whatsappUrl} rel="noopener">וואטסאפ</a>
          </div>
        </div>
      </section>
    </div>
  );
}
