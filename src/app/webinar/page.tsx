import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { ButtonLink } from "@/components/button-link";
import { EditorialMedia } from "@/components/editorial-media";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { WebinarForm } from "@/components/webinar-form";
import { pageMetadata } from "@/lib/metadata";
import { webinar } from "@/lib/webinar";

const base = pageMetadata(
  "וובינר: AI בפרויקט נדל״ן, מהשרטוט ועד המשקיע",
  "וובינר חינמי בעברית לחברות נדל״ן, יזמים ומשרדי תכנון ואדריכלות. case study חי מפרויקט בברריירו, פורטוגל, ודמו של אודיט AI. שלישי 20.10, 20:00 שעון ישראל, ב-Google Meet.",
  "/webinar",
);

export const metadata: Metadata = { ...base, openGraph: { ...base.openGraph, locale: "he_IL" } };

const audiences = [
  ["משרדי תכנון ואדריכלות", "איך משרד של 30 איש עם תהליכים של 30 שנה מכניס AI בלי לעצור את העבודה."],
  ["יזמים וחברות ייזום", "קבלנים, שיווק וגיוס משקיעים בפרויקט אמיתי, עם מספרים של לפני ואחרי."],
  ["חברות נדל״ן וסוכנויות", "מענה ללידים, CRM ובוטים שעובדים בשבילך גם בלילה."],
];

const agenda = [
  ["0–5", "פתיחה: מי בחדר, ומה ניקח מכאן"],
  ["5–25", "ברריירו בפועל: AI בתכנון, בקבלנים, בשיווק ובגיוס משקיעים"],
  ["25–40", "איפה העסק מאבד כסף: שיטת האודיט, ודמו של ניתוח עסקה בזמן אמת"],
  ["40–50", "מיני-אודיט חי לאחד המשתתפים"],
  ["50–60", "שאלות ותשובות"],
];

const faq = [
  ["כמה זה עולה?", "הוובינר חינמי. בסוף נציג הצעה למשתתפים שירצו אודיט מעמיק לעסק שלהם, בלי שום חובה."],
  ["זה טכני? צריך לדעת לתכנת?", "לא. מדברים על תהליכים, החלטות ומספרים. הכלים מוצגים כדי להראות מה אפשרי, לא כדי ללמד קוד."],
  ["תהיה הקלטה?", "נרשמים יקבלו סיכום אחרי הוובינר. הכי שווה להגיע בשידור, כי המיני-אודיט והשאלות קורים שם."],
  ["אני פעיל רק בישראל. זה רלוונטי?", "כן. הדוגמה המרכזית היא מפורטוגל, אבל התהליכים, הכלים והשיטה זהים בכל שוק."],
];

export default function WebinarPage() {
  return (
    <div dir="rtl" lang="he" className="webinar-page">
      <PageHero
        index="LIVE"
        eyebrow="וובינר חינמי · בעברית"
        title="מהשרטוט ועד המשקיע: | איך AI עובד | בפרויקט נדל״ן אמיתי."
        intro="case study חי מפרויקט שאנחנו בונים עכשיו בברריירו, פורטוגל, | ושיטה לזהות איפה העסק שלכם מאבד זמן וכסף."
        theme="dark"
        actions={<ButtonLink href="#register" variant="primary">שמרו לי מקום</ButtonLink>}
        aside={
          <div className="webinar-when">
            <p className="eyebrow">מתי</p>
            <p className="webinar-when__date">{webinar.dateLabel}</p>
            <p>{webinar.timeLabel}</p>
            <p className="webinar-when__meta">{webinar.platform} · 60 דקות</p>
          </div>
        }
      />

      <section className="section">
        <div className="container-wide">
          <SectionHeading eyebrow="למי זה מתאים" title="אותו פרויקט, | שלוש נקודות מבט." intro="מחזור החיים של פרויקט נדל״ן: תכנון, ביצוע, שיווק וגיוס. | כל אחד יראה איפה AI כבר עובד בשלב שלו." />
          <div className="webinar-audiences">
            {audiences.map(([title, text]) => (
              <article className="fit-list" key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section surface-muted">
        <div className="container-wide webinar-split">
          <div className="webinar-agenda">
            <SectionHeading eyebrow="מה נעשה ב-60 דקות" title="בלי סיור בכלים. | תהליכים, ומספרים." />
            <ol>
              {agenda.map(([minutes, item]) => (
                <li key={minutes}><span dir="ltr">{minutes}</span><p>{item}</p></li>
              ))}
            </ol>
          </div>
          <EditorialMedia src="/work/arena-barreiro/facade.webp" alt="הדמיית חזית הפרויקט בברריירו" label="ARENA · BARREIRO" caption="הפרויקט שנפרק בוובינר: בניין מגורים בברריירו, מעבר לנהר מליסבון." />
        </div>
      </section>

      <section className="section">
        <div className="container-wide">
          <SectionHeading eyebrow="המנחים" title="שני צדדים | של אותו שולחן." />
          <div className="webinar-hosts">
            <article>
              <Image src="/asaf/asaf-eyzenkot.jpg" alt="אסף איזנקוט" width={96} height={96} />
              <div>
                <h3>אסף איזנקוט</h3>
                <p>מייסד Realization. יזם נדל״ן בפורטוגל ואדריכל מערכות AI. מוביל את פרויקט Arena בברריירו, ומלווה משרדי אדריכלות וחברות בהטמעת AI.</p>
              </div>
            </article>
            <article>
              <span className="webinar-hosts__initials" aria-hidden="true">EG</span>
              <div>
                <h3>יבגני גורקוב</h3>
                <p>יועץ AI לעסקים עם רקע בנדל״ן ובשיווק דיגיטלי. עושה אודיט לתהליכים, ובונה מערכות CRM, בוטים וכלי ניתוח עסקאות לחברות נדל״ן.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section surface-muted">
        <div className="container-wide webinar-split webinar-split--form">
          <div>
            <SectionHeading eyebrow="שאלות" title="לפני שנרשמים." />
            <div className="faq-list">
              {faq.map(([question, answer]) => (
                <details className="faq-item" key={question}>
                  <summary>{question}</summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
          <Suspense fallback={<div className="opportunity-form">טוען את טופס ההרשמה…</div>}>
            <WebinarForm />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
