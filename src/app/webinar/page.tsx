import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { ButtonLink } from "@/components/button-link";
import { Lines } from "@/components/lines";
import { SectionHeading } from "@/components/section-heading";
import { WebinarForm } from "@/components/webinar-form";
import { pageMetadata } from "@/lib/metadata";
import { webinar } from "@/lib/webinar";

const base = pageMetadata(
  "וובינר: לא עוד הרצאה על בינה מלאכותית",
  "וובינר חינמי בעברית ליזמים, לחברות בנייה, למשרדי תכנון וליועצי נדל״ן: חמישה מקרים אמיתיים מפרויקטי נדל״ן, ובעיה אחת שלכם שננתח בשידור. שלישי 20.10, 20:00 שעון ישראל.",
  "/webinar",
  { imagePath: "/webinar/og.jpg" },
);

export const metadata: Metadata = { ...base, openGraph: { ...base.openGraph, locale: "he_IL" } };

// thumb: optional square-ish image for the collapsed card; contain: show the whole image on a dark ground instead of cropping it.
type Case = { stage: string; title: string; hook: string; about: string; idea: string; image: string; alt: string; thumb?: string; contain?: boolean };

// The five cases follow a project's life: the deal, the tender, the contractors, the build, the investors.
const cases: Case[] = [
  {
    stage: "העסקה",
    title: "העסקה מלינק אחד",
    hook: "התשואה במודעה היא לא התשואה שלכם.",
    about: "מודעות מציגות תשואה ברוטו, לפני מסים, עמלות ומימון. נראה כלי שמקבל לינק למודעה ומחזיר ניתוח מלא: מימון, תזרים חודשי, מיסוי, והתשואה שנשארת לכם בפועל. הכלי מנתח גם את התמונות, ותופס פערים בין מה שכתוב במודעה לבין מה שרואים בהן.",
    idea: "לסנן עשר עסקאות בערב אחד, ולהגיע לשמאי ולעורך הדין עם השאלות הנכונות.",
    image: "/work/boa-architecture/santa-maria.webp",
    alt: "מבט מלמעלה על גגות של עיר בפורטוגל",
  },
  {
    stage: "המכרז",
    title: "תיק מכרז מקיף, תוך יומיים",
    hook: "מאות מסמכים, שפה זרה, ויומיים להגשה.",
    about: "איך מנתחים מאות מסמכים למכרז ומכינים תיק מקיף ומקצועי בשפה זרה, תוך יומיים? נראה את זה על מכרז אמיתי לפרויקט של מאות מיליוני יורו בבריירו, שבו הגשנו הצעה עבור חברה ישראלית: קריאת כל המסמכים, ריכוז הדרישות, הצלבת הנתונים והכנת התיק.",
    idea: "עבודה שבלי הכלים הנכונים לוקחת שבועות, נעשתה תוך יומיים, בלי לוותר על הדיוק.",
    image: "/media/hero-physical-world.webp",
    alt: "צוות עובד סביב מודל ותוכניות של פרויקט",
  },
  {
    stage: "הקבלנים",
    title: "שלוש הצעות מחיר, טבלה אחת",
    hook: "שלוש הצעות, שלושה פורמטים. ומה חסר?",
    about: "כל קבלן כותב את ההצעה בדרך משלו: אחד לפי סעיפים, אחד במחיר כולל, ואחד שחצי מההצעה שלו נאמר בטלפון. נראה איך מכניסים את כל ההצעות לטבלה אחת, סעיף מול סעיף, ומסמנים מראש את מה שחסר. וגם: איך מפיקים כתב כמויות ישירות מהתוכניות.",
    idea: "ההצעה הזולה היא לפעמים פשוט זו שחסר בה הכי הרבה.",
    image: "/webinar/case-quotes.webp",
    alt: "המחשה: שלוש הצעות מחיר בטבלה אחת, והסעיפים החסרים מסומנים",
  },
  {
    stage: "הביצוע",
    title: "הקבלן מבקש תשלום, ואתם בחו״ל",
    hook: "הקבלן אומר שהשלב הסתיים. באמת?",
    about: "המפקח לא תמיד מגיע, ואתם לא בשטח. נראה מערכת שבה כל תמונה מאתר הבנייה נשלחת למספר הוואטסאפ של הפרויקט ומתויקת לפי שלב ותאריך. בינה מלאכותית משווה את מה שרואים בתמונות לאבני הדרך שבחוזה, ופעם בשבוע מגיע דוח קצר: בוצע, בוצע חלקית, או כדאי לבדוק לפני שמשלמים.",
    idea: "משלמים על מה שנבנה, לא על מה שנאמר. וההחלטה נשארת שלכם.",
    image: "/webinar/case-payments.webp",
    alt: "המחשה: דוח שבועי לפני תשלום לקבלן, לצד תמונות מאתר הבנייה",
  },
  {
    stage: "המשקיעים",
    title: "הדוח למשקיעים, בשעה",
    hook: "דוח רבעוני: ימים של עבודה, או שעה?",
    about: "תדפיסי בנק, חשבוניות, מיילים עם הקבלן והחלטות מישיבות. הכל קיים, אבל מפוזר. נראה איך מוח שני לפרויקט מחזיק את כל הידע במקום אחד, ומפיק דוח רבעוני מתבנית קבועה בתוך כשעה, במקום כמה ימים.",
    idea: 'שאלות כמו "כמה נשאר לנו נטו?" מקבלות תשובה מיד, בלי לחכות לישיבה.',
    image: "/webinar/realizeos-missions.webp",
    thumb: "/webinar/realizeos-thumb.webp",
    contain: true,
    alt: "מסך המשימות של RealizeOS",
  },
];

const audiences = [
  ["יזמים וחברות בנייה", "גם מי שבונה בחו״ל ומנהל מישראל: עסקאות, קבלנים, תשלומים ומשקיעים, מרחוק."],
  ["משרדי תכנון ואדריכלות", "מכרזים, הצעות וכתבי כמויות, וידע שנשאר אצל אנשים בודדים. מה שלמדנו בליווי משרד של 25 איש."],
  ["ליווי, ייעוץ ותיווך נדל״ן", "ניתוח עסקאות ללקוחות, מענה מהיר ללידים, ופחות עבודה ידנית שאוכלת את היום."],
];

const agenda = [
  ["0–5", "פתיחה: מי איתנו, ועל מה נדבר"],
  ["5–15", "העסקה מלינק אחד"],
  ["15–25", "תיק מכרז מקיף, תוך יומיים"],
  ["25–35", "שלוש הצעות מחיר, טבלה אחת"],
  ["35–45", "הקבלן מבקש תשלום, ואתם בחו״ל"],
  ["45–55", "הדוח למשקיעים, בשעה"],
  ["55–65", "הבעיה שלכם על המסך: מיני־אודיט בזמן אמת"],
  ["65–70", "איך ממשיכים מכאן"],
  ["70–90", "שאלות ותשובות"],
];

const faq = [
  ["כמה זה עולה?", "הוובינר בחינם, ומי שמגיע לשידור החי מקבל גם לא מעט בונוסים."],
  ["תהיה הקלטה?", "כן. ההקלטה תישלח לכל הנרשמים. ובכל זאת, שווה להצטרף לשידור החי: רק שם אפשר לשאול שאלות ולראות את הבעיה מהקהל מנותחת על המסך."],
  ["מה קורה אחרי הוובינר?", "מי שרוצה יכול לקבוע איתנו שיחת היכרות קצרה. אם יש התאמה, נעשה יחד אודיט לעסק שלכם: לאן הולכים הזמן והכסף, ובמה כדאי להתחיל. בלי התחייבות."],
  ["זה טכני? צריך לדעת לתכנת?", "לא. מדברים על תהליכים, החלטות ומספרים. אנחנו מציגים את הכלים כדי להראות מה אפשר לעשות, לא כדי ללמד תכנות."],
  ["אני פעיל רק בישראל. זה רלוונטי?", "כן. רוב המקרים מגיעים מפורטוגל, אבל הבעיות, הכלים והשיטה זהים בכל שוק."],
];

export default function WebinarPage() {
  return (
    <div dir="rtl" lang="he" className="webinar-page">
      <section className="wh-hero">
        <div className="wh-hero__copy">
          <p className="wh-hero__kicker">וובינר חינמי בעברית</p>
          <h1><Lines text="לא עוד הרצאה | על בינה מלאכותית." /></h1>
          <p className="wh-hero__sub"><Lines text="5 מקרים אמיתיים מפרויקטי נדל״ן, | והבעיה שלכם על המסך." /></p>
          <p className="wh-hero__for">וובינר מעשי ליזמים, לחברות בנייה ולמשרדי תכנון, מהעסקה ועד המשקיעים.</p>
          <div className="button-row">
            <ButtonLink href="#register" variant="primary">שמרו לי מקום</ButtonLink>
          </div>
          <p className="wh-hero__meta">חינם · 90 דקות · בשידור חי · מוקלט</p>
          <p className="wh-hero__brand">{webinar.hosts}</p>
        </div>
        <div className="wh-hero__media">
          <Image src="/work/arena-barreiro/facade.webp" alt="הדמיית חזית של בניין מגורים בבריירו" fill priority sizes="(max-width: 900px) 100vw, 50vw" />
          <div className="wh-hero__when">
            <p className="wh-hero__day">שלישי 20.10</p>
            <p className="wh-hero__hour">20:00</p>
            <p>שעון ישראל · 18:00 בליסבון</p>
          </div>
        </div>
        <ol className="wh-path" aria-label="חמשת המקרים">
          {cases.map((item, index) => (
            <li key={item.stage}><a href={`#case-${index + 1}`}><span>{index + 1}</span>{item.stage}</a></li>
          ))}
          <li className="wh-path__you"><a href="#your-problem"><span>+</span>הבעיה שלכם</a></li>
        </ol>
      </section>

      <section className="section" id="cases">
        <div className="container-wide">
          <SectionHeading
            title="חמישה מקרים, | עשר דקות לכל אחד."
            intro="מחזור החיים של פרויקט נדל״ן, מהעסקה ועד המשקיעים. | לחצו על מקרה כדי לראות על מה נדבר."
          />
          <div className="wh-cases">
            {cases.map((item, index) => (
              <details className="wh-case" id={`case-${index + 1}`} key={item.title} open={index === 0}>
                <summary>
                  <span className="wh-case__thumb">
                    <Image src={item.thumb ?? item.image} alt="" fill sizes="160px" />
                  </span>
                  <span className="wh-case__head">
                    <span className="wh-case__stage">{index + 1} · {item.stage}</span>
                    <span className="wh-case__title">{item.title}</span>
                    <span className="wh-case__hook">{item.hook}</span>
                  </span>
                  <span className="wh-case__toggle" aria-hidden="true" />
                </summary>
                <div className="wh-case__body">
                  <div>
                    <h3>על מה נדבר</h3>
                    <p>{item.about}</p>
                    <h3>הרעיון המרכזי</h3>
                    <p className="wh-case__idea">{item.idea}</p>
                  </div>
                  <div className={item.contain ? "wh-case__image wh-case__image--contain" : "wh-case__image"}>
                    <Image src={item.image} alt={item.alt} fill sizes="(max-width: 900px) 100vw, 40vw" />
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section surface-brand" id="your-problem">
        <div className="container-wide wh-problem">
          <h2><Lines text="והבעיה שלכם | על המסך." /></h2>
          <div>
            <p className="wh-problem__text">בהרשמה אתם כותבים בעיה אחת שהייתם רוצים לפתור, ומתוך כל הבעיות שיגיעו ננתח אחת בשידור, כמו אודיט אמיתי: מה קורה היום, לאן הולכים הזמן והכסף, ומה אפשר לשנות כבר מחר.</p>
            <ButtonLink href="#register" variant="dark">לכתוב את הבעיה שלי</ButtonLink>
          </div>
        </div>
      </section>

      <section className="section surface-dark">
        <div className="container-wide wh-os">
          <div>
            <SectionHeading
              inverse
              eyebrow="המוח השני שמאחורי הדוחות"
              title="RealizeOS"
              intro="מערכת שבנינו ב־Realization, ושעליה מבוססת כל העבודה שלנו. | צוות של סוכני בינה מלאכותית שחולקים מאגר ידע אחד על העסק, | זוכרים את מה שכבר נעשה, ופועלים רק באישור שלכם."
            />
            <ul className="wh-os__points">
              <li><strong>זוכרת את העסק.</strong> מסמכים, החלטות ושיחות, במקום אחד.</li>
              <li><strong>עובדת רק באישור.</strong> שום פעולה לא יוצאת לפועל בלי שאדם מאשר אותה.</li>
              <li><strong>נשארת שלכם.</strong> מותקנת אצלכם, והידע לא יושב אצל ספק.</li>
            </ul>
          </div>
          <figure className="wh-os__shot">
            <Image src="/work/realizeos/dream-inbox.webp" alt="מסך האינבוקס של RealizeOS: עדכוני ידע שממתינים לאישור" width={1600} height={831} sizes="(max-width: 900px) 100vw, 50vw" />
            <figcaption>עדכוני ידע שהסוכנים הציעו, בהמתנה לאישור · נתוני הדגמה</figcaption>
          </figure>
        </div>
      </section>

      <section className="section">
        <div className="container-wide">
          <SectionHeading title="למי זה מתאים" />
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
            <SectionHeading title="90 דקות, בלי חפירות." intro="עשר דקות לכל מקרה, ועשרים דקות לשאלות שלכם." />
            <ol>
              {agenda.map(([minutes, item]) => (
                <li key={minutes}><span dir="ltr">{minutes}</span><p>{item}</p></li>
              ))}
            </ol>
          </div>
          <div>
            <SectionHeading title="המארחים" intro={webinar.hosts} />
            <div className="wh-hosts">
              <article>
                <Image src="/webinar/asaf-eyzenkot.jpg" alt="אסף איזנקוט" width={112} height={112} />
                <div>
                  <h3>אסף איזנקוט</h3>
                  <p>מייסד Realization. יזם נדל״ן בפורטוגל ובונה מערכות בינה מלאכותית לעסקים. מוביל את פרויקט Arena בבריירו, בנה את RealizeOS, ומלווה משרדי אדריכלות וחברות בהטמעת בינה מלאכותית.</p>
                </div>
              </article>
              <article>
                <Image src="/webinar/evgeni-gurkov.jpg" alt="יבגני גורקוב" width={112} height={112} />
                <div>
                  <h3>יבגני גורקוב</h3>
                  <p>יזם שחי בפורטוגל ומטמיע בינה מלאכותית בעסקים, בעיקר מעולם הנדל״ן. מביא ארבע שנים של ליווי משקיעים בקייב ורקע בשוק ההון ובשיווק. ב־Montreza הוא בונה מערכות לניהול המשרד ואוטומציות לטיפול בלידים, למעקב אחרי לקוחות ולהפקת דוחות.</p>
                  <Image className="wh-hosts__logo" src="/webinar/montreza-logo.png" alt="Montreza" width={600} height={183} />
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-wide webinar-split webinar-split--form">
          <div>
            <SectionHeading title="לפני שנרשמים" />
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

      <a className="wh-sticky" href="#register">שמרו לי מקום · וובינר חינמי ב־20.10</a>
    </div>
  );
}
