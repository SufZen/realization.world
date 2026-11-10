import { whatsappUrl } from "./site";
import { auditSprintCheckout, bookingTypes, pillarBySlug, sessionPrice, type SystemsCopy } from "./services";

/**
 * Hebrew version of the Systems page (/he/services/ai-systems), for the ads and the
 * webinar audience. Same structure as systemsEn in services.ts; keep the two in step.
 */

const pillar = pillarBySlug("ai-systems");
const data = { pillar: "ai-systems", lang: "he" };

export const systemsHe: SystemsCopy = {
  lang: "he",
  ref: `${pillar.ref}-he`,
  hero: { eyebrow: "שירותים · מערכות", title: "מערכות בינה מלאכותית | ותפעול.", intro: "פחות עבודה ידנית בתכנון, | בבנייה, במכירה ובדיווח." },
  promise: { eyebrow: "הגישה", title: "בוחרים איפה להתחיל. | מוכיחים את זה שם." },
  fit: {
    eyebrow: "למי זה מתאים",
    title: "צוותים עמוסים: | יש כלים, אין זמן.",
    intro: "הפער כמעט אף פעם אינו גישה או הבנה. | הפער הוא להחליט מה עושים קודם ומי אחראי, | ולשמור את השעות כדי לעשות את זה.",
    strongTitle: "מתאים מאוד",
    strong: [
      "משרדים מקצועיים של 10–100 עובדים: אדריכלות, הנדסה, משפט ונדל״ן",
      "יזמים וחברות עם הרבה עבודה חוזרת על מסמכים",
      "מייסדים שרוצים מערכת בינה מלאכותית שהיא נכס של העסק",
    ],
    notYetTitle: "עוד לא מתאים",
    notYet: [
      "צוותים שמחפשים הדגמה של כלי, ולא שינוי בדרך העבודה",
      "תוכניות שאין בהן אף אחד שיכול לתת ארבע שעות בשבוע",
      "פרויקטים שחייבים להתחיל דווקא מהמידע הרגיש ביותר",
    ],
  },
  stages: {
    eyebrow: "שלבי העבודה",
    title: "שלבים נפרדים. | נקודת עצירה אחרי כל אחד.",
    intro: "כל שלב מתומחר | לפני שהוא מתחיל.",
    labels: { output: "מה מקבלים", duration: "משך", fee: "מחיר" },
    items: [
      {
        index: "התחלה",
        title: "פגישת אסטרטגיה לבינה מלאכותית",
        scope: "שעה על העסק שלכם: מאיפה כדאי להתחיל, | על מה אתם כבר משלמים ומה למדוד.",
        duration: "60 דקות · Google Meet",
        fee: `${sessionPrice}, מתקזז ממחיר האודיט`,
        amount: 150,
        cta: { label: "לקביעת פגישה", href: bookingTypes.aiStrategySession, event: "book-session-ai-systems", data, carryRef: true },
      },
      {
        index: "שלב 0",
        title: "אודיט משותף (Audit Sprint)",
        scope: "פגישת פתיחה של 90 דקות, ואחריה אודיט לעומק: | איך העבודה נעשית היום, איפה היא נתקעת | ועל מה אתם כבר משלמים. | התקנת RealizeOS לפי הצורך.",
        output: "דוח כתוב: מה לתקן קודם, | לפי סדר עדיפות. נשאר אצלכם.",
        duration: "הדוח מגיע תוך 48 שעות מהאודיט",
        fee: "495 יורו + IVA, מתקזז מההטמעה",
        amount: 495,
        cta: auditSprintCheckout
          ? { label: "לרכישת האודיט", href: auditSprintCheckout, event: "buy-audit", data }
          : { label: "לבקשת הצעה בוואטסאפ", href: whatsappUrl },
      },
      {
        index: "שלב 1",
        title: "פיילוט מלווה",
        scope: "תחום עבודה אחד, שני אנשים. | אנחנו בוחרים את הכלים ומלווים את הבנייה, | והצוות שלכם מפעיל ובודק. | רוב הזמן הולך לבדיקות מול מקרים אמיתיים.",
        output: "תהליך שעובד בפועל, | ונמדד לפני ואחרי על מקרים אמיתיים.",
        duration: "3–5 שבועות",
        fee: "לפי הצעה, אחרי האודיט",
      },
      {
        index: "שלב 2",
        title: "ליווי מדורג",
        scope: "כעשר עד שתים־עשרה שעות ייעוץ בחודש, | שיורדות ממלא לחצי ולרבע.",
        output: "צוות שמפעיל ומרחיב | את המערכת בלעדינו.",
        duration: "מסתיים בחודש השנים־עשר",
        fee: "לפי הצעה, אחרי האודיט",
      },
      {
        index: "תוספת",
        title: "סדנאות לצוות",
        scope: "מפגשים שבנויים על המקרים שלכם: | איך מזהים איפה בינה מלאכותית מתאימה | ואיך בוחרים לה את הכלי הנכון.",
        output: "אנשים שמוצאים בעצמם | את השימוש הבא.",
      },
    ],
    refuse: "מה לא נמכור לכם: לא קורס, לא רישיון, | ולא מערכת שרק אנחנו יודעים להפעיל.",
  },
  proof: {
    eyebrow: "הוכחה",
    title: "השיטה, במשרד אמיתי.",
    intro: "משרד אדריכלות של 25 איש: | שמונה תחומי עבודה מופו, פיילוט אחד נבחר, | ורף הצלחה נקבע לפני הבנייה.",
    link: { label: "לקריאת המקרה (באנגלית)", href: "/work/ai-adoption-architecture-firm" },
  },
  systems: {
    eyebrow: "מערכות שבנינו ומפעילים",
    title: "משתמשים במה שאנחנו ממליצים.",
    intro: "התפעול שלנו רץ על מערכות בינה מלאכותית שתכננו בעצמנו. | הן אפשרות עבורכם, אף פעם לא דרישה.",
    setup: { label: "לשעת התקנה של RealizeOS", href: bookingTypes.realizeosSetup, event: "book-session-ai-systems", data: { ...data, offer: "realizeos-setup" }, carryRef: true },
  },
  related: {
    text: "צריכים גם את התפקידים והתהליכים סביב זה?",
    link: { label: "הקמת צוותים ותהליכים (באנגלית)", href: "/services/team-setup" },
  },
  faq: {
    eyebrow: "שאלות",
    title: "לפני שאתם שואלים.",
    items: [
      ["כמה זמן זה לוקח מהצוות שלנו?", "שני סוגים של זמן. איש קשר פנימי אחד, לארבע עד שש שעות בשבוע, ושעתיים עד שלוש בשבוע מכל משתתף בפיילוט, בעיקר לבדיקת תוצרים. אנחנו מבקשים את השעות האלה בהצעה, כי בלעדיהן העבודה לא קורית."],
      ["האם חייבים להשתמש ב־RealizeOS או במערכות האחרות שלכם?", "לא. מתחילים ממה שאתם כבר משלמים עליו וממה שיש בשוק. RealizeOS, MeetSum והמערכות האחרות שלנו הן אפשרות כשהן מתאימות לפער, לא דרישה."],
      ["איפה אתם עובדים, ובאילו שפות?", "מרחוק, ופנים אל פנים באזור ליסבון ובברצלונה. אנחנו עובדים בעברית ובאנגלית, עם פורטוגזית וספרדית בסיסיות."],
    ],
  },
  cta: {
    eyebrow: "מתחילים בעשרים דקות",
    title: "מאיפה הבינה המלאכותית | צריכה להתחיל אצלכם?",
    text: "עשרים דקות מספיקות | כדי לדעת אם האודיט שווה את זה.",
  },
  session: { ...pillar.session, label: `לפגישת אסטרטגיה · ${sessionPrice}`, data },
  intro: { label: "לשיחת היכרות של 20 דקות", href: bookingTypes.intro, event: "book-intro", data, carryRef: true },
  alternate: { label: "In English", href: "/services/ai-systems", lang: "en" },
};
