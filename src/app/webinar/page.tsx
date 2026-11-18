import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/button-link";
import { Lines } from "@/components/lines";
import { SectionHeading } from "@/components/section-heading";
import { WebinarMotionStyles } from "@/components/webinar/webinar-motion-styles";
import { WebinarMotion } from "@/components/webinar/webinar-motion";
import { bookingUrl, whatsappLink } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { webinar } from "@/lib/webinar";

const base = pageMetadata(
  "וובינר: לא עוד הרצאה על בינה מלאכותית",
  "וובינר בעברית לכל מי שעובד בנדל״ן: מי שבונה, מי שמתכנן, ומי שמלווה עסקאות. חמישה מקרים אמיתיים מפרויקטי נדל״ן, ובעיה אחת מהקהל שנותחה בשידור. ההקלטה המלאה ביוטיוב.",
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
  ["יזמים וקבלנים", "גם מי שבונה בחו״ל ומנהל מישראל: עסקאות, קבלנים, תשלומים ומשקיעים, מרחוק."],
  ["משרדי תכנון ואדריכלות", "מכרזים, הצעות וכתבי כמויות, וידע שנשאר אצל אנשים בודדים. מה שלמדנו בליווי משרד של 25 איש."],
  ["מתווכים, יועצים ומלווי משקיעים", "ניתוח עסקאות ללקוחות מלינק אחד, דוחות למשקיעים, ומענה מהיר ללידים, עם פחות עבודה ידנית."],
];

const agenda = [
  ["0–5", "פתיחה: מי איתנו, ועל מה נדבר"],
  ["5–15", "העסקה מלינק אחד"],
  ["15–25", "תיק מכרז מקיף, תוך יומיים"],
  ["25–35", "שלוש הצעות מחיר, טבלה אחת"],
  ["35–45", "הקבלן מבקש תשלום, ואתם בחו״ל"],
  ["45–55", "הדוח למשקיעים, בשעה"],
  ["55–65", "בעיה מהקהל על המסך: מיני־אודיט בזמן אמת"],
  ["65–70", "איך ממשיכים מכאן"],
  ["70–90", "שאלות ותשובות"],
];

/** The case's 4-second line clip from the deck, laid over its image; webinar-motion.tsx decides when it plays. */
function CaseClip({ index, kind }: { index: number; kind: "thumb" | "clip" }) {
  return (
    <video className="wm-clip" {...{ [`data-wm-${kind}`]: "" }} muted playsInline preload="none" aria-hidden="true" tabIndex={-1}>
      <source src={`/webinar/motion/case-${index + 1}.mp4`} type="video/mp4" />
    </video>
  );
}

const recordingTracking = (place: string) => ({ "data-umami-event": "webinar-recording", "data-umami-event-place": place });

/** After the event (20.10): the recording, what it covers, and the 20-minute intro as the next step. */
export default function WebinarPage() {
  return (
    <div dir="rtl" lang="he" className="webinar-page">
      <WebinarMotionStyles />
      <section className="wh-hero">
        <div className="wh-hero__copy">
          <p className="wh-hero__kicker">וובינר בעברית · התקיים ב־20.10</p>
          <h1><Lines text="לא עוד הרצאה | על בינה מלאכותית." /></h1>
          <p className="wh-hero__sub"><Lines text="5 מקרים אמיתיים מפרויקטי נדל״ן. | ההקלטה המלאה, ביוטיוב." /></p>
          <p className="wh-hero__for">לכל מי שעובד בנדל״ן: מי שבונה, מי שמתכנן, ומי שמלווה עסקאות.</p>
          <div className="button-row">
            <ButtonLink href={webinar.recordingUrl} variant="primary" tracking={recordingTracking("hero")}>לצפייה בהקלטה</ButtonLink>
            <ButtonLink href={bookingUrl} variant="light">שיחת היכרות של 20 דקות</ButtonLink>
          </div>
          <p className="wh-hero__meta">חינם · 90 דקות · ביוטיוב</p>
          <p className="wh-hero__brand">{webinar.hosts}</p>
        </div>
        <div className="wh-hero__media">
          <Image className="wm-hero__still" src="/webinar/motion/hero-loop.webp" alt="" fill priority fetchPriority="high" unoptimized />
          <video className="wm-hero__loop" data-wm-hero muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1}>
            <source src="/webinar/motion/hero-loop.mp4" type="video/mp4" />
          </video>
          <div className="wh-hero__when">
            <p className="wh-hero__day">שלישי 20.10</p>
            <p className="wh-hero__hour">בהקלטה</p>
            <p>90 דקות · ביוטיוב</p>
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
            intro="מחזור החיים של פרויקט נדל״ן, מהעסקה ועד המשקיעים. | לחצו על מקרה כדי לראות על מה דיברנו."
          />
          <div className="wh-cases">
            {cases.map((item, index) => (
              <details className="wh-case" id={`case-${index + 1}`} key={item.title} open={index === 0} data-reveal>
                <summary>
                  <span className="wh-case__thumb">
                    <Image src={item.thumb ?? item.image} alt="" fill sizes="160px" />
                    <CaseClip index={index} kind="thumb" />
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
                    <h3>על מה דיברנו</h3>
                    <p>{item.about}</p>
                    <h3>הרעיון המרכזי</h3>
                    <p className="wh-case__idea">{item.idea}</p>
                  </div>
                  <div className={item.contain ? "wh-case__image wh-case__image--contain" : "wh-case__image"}>
                    <Image src={item.image} alt={item.alt} fill sizes="(max-width: 900px) 100vw, 40vw" />
                    <CaseClip index={index} kind="clip" />
                  </div>
                </div>
              </details>
            ))}
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
              <li data-reveal><strong>זוכרת את העסק.</strong> מסמכים, החלטות ושיחות, במקום אחד.</li>
              <li data-reveal><strong>עובדת רק באישור.</strong> שום פעולה לא יוצאת לפועל בלי שאדם מאשר אותה.</li>
              <li data-reveal><strong>נשארת שלכם.</strong> מותקנת אצלכם, והידע לא יושב אצל ספק.</li>
            </ul>
          </div>
          <figure className="wh-os__shot" data-reveal>
            <div className="wm-brain">
              <Image className="wm-brain__still" src="/webinar/motion/brain.webp" alt="המחשה: מסמכים, מייל, וואטסאפ ויומן נכנסים למוח אחד של הפרויקט, שעונה על שאלה עם המקורות שלה וממתין לאישור" width={1280} height={720} unoptimized />
              <video className="wm-brain__clip" data-wm-brain muted playsInline preload="none" aria-hidden="true" tabIndex={-1}>
                <source src="/webinar/motion/brain.mp4" type="video/mp4" />
              </video>
              <button type="button" className="wm-brain__replay" data-wm-replay>להפעיל שוב</button>
            </div>
            <Image className="wm-brain__shot" src="/work/realizeos/dream-inbox.webp" alt="מסך האינבוקס של RealizeOS: עדכוני ידע שממתינים לאישור" width={1600} height={831} sizes="(max-width: 900px) 100vw, 50vw" />
            <figcaption>
              <span className="wm-brain__caption">המוח של הפרויקט: מקורות, תשובה עם הפניות, ועדכון שממתין לאישור · נתוני הדגמה</span>
              <span className="wm-brain__shot-caption">עדכוני ידע שהסוכנים הציעו, בהמתנה לאישור · נתוני הדגמה</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="section">
        <div className="container-wide">
          <SectionHeading title="למי זה מתאים" intro="לכל מי שעובד בנדל״ן: מי שבונה, מי שמתכנן, ומי שמלווה עסקאות." />
          <div className="webinar-audiences">
            {audiences.map(([title, text]) => (
              <article className="fit-list" key={title} data-reveal>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section surface-muted">
        <div className="container-wide webinar-split">
          <div className="webinar-agenda" data-reveal>
            <SectionHeading title="מה יש בהקלטה." intro="עשר דקות לכל מקרה, ועשרים דקות לשאלות מהקהל." />
            <ol>
              {agenda.map(([minutes, item]) => (
                <li key={minutes}><span dir="ltr">{minutes}</span><p>{item}</p></li>
              ))}
            </ol>
          </div>
          <div>
            <SectionHeading title="המארחים" intro={webinar.hosts} />
            <div className="wh-hosts" data-reveal>
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

      <section className="section surface-brand" id="your-problem">
        <div className="container-wide wh-problem">
          <h2 data-reveal>והבעיה שלכם? נבדוק אותה בשיחה.</h2>
          <div data-reveal>
            <p className="wh-problem__text">שיחת היכרות של 20 דקות: מה קורה היום, לאן הולכים הזמן והכסף, ובמה כדאי להתחיל. בלי התחייבות.</p>
            <div className="button-row">
              <ButtonLink href={bookingUrl} variant="dark">לקבוע שיחת היכרות</ButtonLink>
              <ButtonLink href={webinar.recordingUrl} variant="outline" tracking={recordingTracking("closing")}>לצפייה בהקלטה</ButtonLink>
            </div>
            <p className="wh-problem__alt">מעדיפים לכתוב? <a href={whatsappLink("היי, ראיתי את הקלטת הוובינר ואשמח לדבר.")} rel="noopener" data-umami-event="whatsapp" data-umami-event-place="webinar">בוואטסאפ</a></p>
          </div>
        </div>
      </section>

      <WebinarMotion />
    </div>
  );
}
