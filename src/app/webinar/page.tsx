import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { ButtonLink } from "@/components/button-link";
import { EditorialMedia } from "@/components/editorial-media";
import { Lines } from "@/components/lines";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { WebinarForm } from "@/components/webinar-form";
import { pageMetadata } from "@/lib/metadata";
import { webinar } from "@/lib/webinar";

const base = pageMetadata(
  "וובינר: לא עוד הרצאה על AI · 4 כלים חיים לנדל״ן",
  "וובינר חינמי בעברית ליזמים, חברות בנייה, משרדי תכנון ויועצי נדל״ן. 4 כלי AI חיים על פרויקט אמיתי בברריירו, ובעיה אחת שלכם שנפרק בשידור. שלישי 20.10, 20:00 שעון ישראל, ב־Google Meet.",
  "/webinar",
);

export const metadata: Metadata = { ...base, openGraph: { ...base.openGraph, locale: "he_IL" } };

// The four tools, in the order of a project's life: the deal, the tender, the build, the investors.
const tools = [
  ["התשואה במודעה | היא לא התשואה שלכם.", "מדביקים לינק למודעה ומקבלים את התמונה המלאה: מימון, תזרים ומיסוי, וגם מה שהתמונות מגלות על המצב האמיתי של הנכס.", "יבגני"],
  ["שלוש הצעות מחיר, | שלושה פורמטים.", "כל הצעות הקבלנים בטבלה אחת, וכל סעיף חסר מסומן לפני שהוא מתגלה באמצע העבודה. מבחירת הקבלן שאנחנו עושים עכשיו בברריירו.", "אסף"],
  ["הקבלן מבקש תשלום, | ואתם בחו״ל.", "בקרת תשלומים מול תמונות ואבני דרך: לפני שמעבירים כסף, יודעים מה באמת נבנה. ודוח קצר בוואטסאפ, פעם בשבוע.", "יבגני"],
  ["המשקיע מחכה | לדוח הרבעוני.", 'מוח שני לפרויקט, שמחבר את החשבון בבנק, המסמכים והשיחות. הדוח יוצא בשעה במקום בימים, ו־"כמה נשאר לנו נטו?" מקבלת תשובה מיד.', "אסף"],
];

const audiences = [
  ["יזמים וחברות בנייה", "גם מי שבונה בחו״ל ומנהל מישראל: קבלנים, תשלומים ומשקיעים, מרחוק."],
  ["משרדי תכנון ואדריכלות", "הצעות, כתבי כמויות, וידע שיושב אצל אנשים בודדים. מה שלמדנו עם משרד של 25 איש."],
  ["ליווי, ייעוץ ותיווך נדל״ן", "ניתוח עסקאות ללקוחות, מענה ללידים, ועבודה ידנית שאוכלת את היום."],
];

const agenda = [
  ["0–5", "פתיחה: מי בחדר, והפרויקט שילווה אותנו"],
  ["5–15", "העסקה מלינק אחד · יבגני"],
  ["15–25", "מכרז קבלנים בלי כאב ראש · אסף"],
  ["25–35", "הקבלן מבקש תשלום, ואתם בחו״ל · יבגני"],
  ["35–45", "הדוח למשקיעים, בשעה · אסף"],
  ["45–55", "הבעיה שלכם על המסך: מיני־אודיט חי"],
  ["55–60", "איך ממשיכים מכאן, והבונוסים למשתתפים"],
  ["60–85", "שאלות ותשובות"],
  ["85–90", "סיכום"],
];

const faq = [
  ["כמה זה עולה?", "הוובינר חינמי. ומי שמגיע לשידור החי יקבל לא מעט בונוסים, גם הם בחינם."],
  ["תהיה הקלטה?", "כן. כל הנרשמים יקבלו את ההקלטה אחרי הוובינר. ובכל זאת שווה להגיע בשידור: הבעיה שעולה למסך והשאלות קורות שם."],
  ["מה קורה אחרי הוובינר?", "מי שרוצה, קובע שיחת היכרות קצרה עם אחד מאיתנו. אם יש התאמה, נעשה יחד אודיט לעסק שלכם: איפה הולכים זמן וכסף, ומה עושים קודם. בלי התחייבות."],
  ["זה טכני? צריך לדעת לתכנת?", "לא. מדברים על תהליכים, החלטות ומספרים. הכלים מוצגים כדי להראות מה אפשרי, לא כדי ללמד קוד."],
  ["אני פעיל רק בישראל. זה רלוונטי?", "כן. הפרויקט שמלווה אותנו נמצא בפורטוגל, אבל הבעיות, הכלים והשיטה זהים בכל שוק."],
];

export default function WebinarPage() {
  return (
    <div dir="rtl" lang="he" className="webinar-page">
      <PageHero
        index="LIVE"
        eyebrow="וובינר חינמי בעברית · שלישי 20.10 · 20:00"
        title="לא עוד הרצאה על AI. | 4 כלים חיים, פרויקט אמיתי, | והבעיה שלכם על המסך."
        intro="וובינר מעשי ליזמים, חברות בנייה ומשרדי תכנון: | מהשרטוט ועד המשקיע."
        theme="dark"
        actions={<ButtonLink href="#register" variant="primary">שמרו לי מקום</ButtonLink>}
        aside={
          <div className="webinar-when">
            <p className="eyebrow">מתי</p>
            <p className="webinar-when__date">{webinar.dateLabel}</p>
            <p>{webinar.timeLabel}</p>
            <p className="webinar-when__meta">{webinar.platform} · {webinar.durationLabel}</p>
            <p className="webinar-when__meta">{webinar.hosts}</p>
          </div>
        }
      />

      <section className="section">
        <div className="container-wide">
          <SectionHeading
            eyebrow="4 כלים חיים · 10 דקות לכל אחד"
            title="לא סיור בכלים. | ארבע בעיות אמיתיות, | וכלי שכבר פותר כל אחת."
            intro="כל כלי מוצג בשידור חי, על פרויקט אמיתי: | בניין של 11 דירות בברריירו שליד ליסבון, | שאנחנו מפתחים עכשיו."
          />
          <ol className="webinar-tools">
            {tools.map(([title, text, host], index) => (
              <li className="fit-list" key={title}>
                <span className="webinar-tools__index" dir="ltr">0{index + 1}</span>
                <h3><Lines text={title} /></h3>
                <p>{text}</p>
                <p className="webinar-tools__host">מציג: {host}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section surface-brand">
        <div className="container-wide">
          <SectionHeading
            eyebrow="ועוד נושא אחד, מכם"
            title="והבעיה שלכם | על המסך."
            intro="בהרשמה כותבים בעיה אחת שהייתם רוצים לפתור. | אחת מהן נפרק בשידור, כמו אודיט אמיתי: | מה קורה היום, איפה הולכים זמן וכסף, | ומה אפשר לעשות כבר מחר."
          />
          <ButtonLink href="#register" variant="dark">לכתוב את הבעיה שלי</ButtonLink>
        </div>
      </section>

      <section className="section">
        <div className="container-wide">
          <SectionHeading eyebrow="למי זה מתאים" title="אותו פרויקט, | שלוש נקודות מבט." />
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
            <SectionHeading eyebrow="90 דקות, בלי מילוי" title="10 דקות לכל כלי, | ו־25 דקות | לשאלות שלכם." />
            <ol>
              {agenda.map(([minutes, item]) => (
                <li key={minutes}><span dir="ltr">{minutes}</span><p>{item}</p></li>
              ))}
            </ol>
          </div>
          <EditorialMedia src="/work/arena-barreiro/facade.webp" alt="הדמיית חזית הפרויקט בברריירו" label="ARENA · BARREIRO" caption="הפרויקט שמלווה את הוובינר: 11 דירות בברריירו, מעבר לנהר מליסבון." />
        </div>
      </section>

      <section className="section">
        <div className="container-wide">
          <SectionHeading eyebrow="המנחים" title="שני צדדים | של אותו שולחן." intro={`${webinar.hosts}.`} />
          <div className="webinar-hosts">
            <article>
              <Image src="/asaf/asaf-eyzenkot.jpg" alt="אסף איזנקוט" width={96} height={96} />
              <div>
                <h3>אסף איזנקוט</h3>
                <p>מייסד Realization. יזם נדל״ן בפורטוגל ומפתח מערכות AI. מוביל את פרויקט Arena בברריירו, בנה את RealizeOS, ומלווה משרדי אדריכלות וחברות בהטמעת AI.</p>
              </div>
            </article>
            <article>
              <span className="webinar-hosts__initials" aria-hidden="true">EG</span>
              <div>
                <h3>יבגני גורקוב</h3>
                <p>יועץ AI לעסקי נדל״ן ובנייה, עם רקע בנדל״ן ובשיווק דיגיטלי. בונה מערכות CRM, בוטים ו־Deal Analyzer שמנתח עסקה מלינק אחד.</p>
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
