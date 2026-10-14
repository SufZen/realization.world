/**
 * Content of the interactive deal-check guide (/deal-check-guide).
 * Sources: the strategy draft (realization-studio campaigns/webinar-2026-10/direction/guide/)
 * and Evgeni Gurkov's deal-guide.pdf (14.10), whose worked example and market points (check 7) are used here.
 * All numbers are examples and are labelled as such on the page.
 */

export type Role = "investor" | "developer" | "agent" | "other";
export type Market = "il" | "pt" | "other";
export type Answer = "done" | "open" | "na";

/** Who each open question goes to; the checklist is grouped by this. */
export type Who = "self" | "bank" | "seller" | "lawyer" | "inspector" | "accountant" | "local";

export const whoLabels: Record<Who, string> = {
  self: "לעצמכם, עם מחשבון",
  bank: "לבנק או ליועץ המשכנתאות",
  seller: "למוכר או למתווך",
  lawyer: "לעורך דין עצמאי שלכם",
  inspector: "למהנדס או לבודק עצמאי",
  accountant: "לרואה חשבון",
  local: "למתווך, לשמאי ולמנהלי נכסים מקומיים",
};

export const roles: { id: Role; label: string }[] = [
  { id: "investor", label: "משקיעים באופן פרטי" },
  { id: "developer", label: "יזמים" },
  { id: "agent", label: "מתווכים או סוכנים" },
  { id: "other", label: "משהו אחר" },
];

export const markets: { id: Market; label: string }[] = [
  { id: "il", label: "ישראל" },
  { id: "pt", label: "פורטוגל" },
  { id: "other", label: "מדינה אחרת" },
];

/** The worked example behind checks 1–2 (example numbers). Portugal and other markets use Evgeni's example. */
export type YieldExample = { currency: "₪" | "€"; gross: number; net: number; equity: number };
export const yieldExample = (market: Market): YieldExample =>
  market === "il" ? { currency: "₪", gross: 3.6, net: 2.7, equity: 1.3 } : { currency: "€", gross: 6.0, net: 3.4, equity: 2.4 };

type ByMarket = string | Partial<Record<Market, string>> & { default: string };
export const forMarket = (value: ByMarket | undefined, market: Market) =>
  value === undefined ? undefined : typeof value === "string" ? value : value[market] ?? value.default;

export type Check = {
  id: string;
  title: string;
  /** Two or three short sentences. */
  body: string;
  /** A worked example or real case; labelled on the page. */
  example?: ByMarket;
  exampleLabel?: string;
  /** Market-specific terms and where to look. */
  local?: ByMarket;
  /** A few short points (check 7: Evgeni's market points). */
  points?: string[];
  pointsLabel?: string;
  visual?: "net" | "leverage";
  trap: string;
  /** The one question to ask; goes into the personal checklist when the answer is "open". */
  ask: ByMarket;
  who: Who;
  /** A short line for one role, where the check looks different from that seat. */
  roleTip?: Partial<Record<Role, string>>;
  prompt: string;
  options: { done: string; open: string; na?: string };
};

export const checks: Check[] = [
  {
    id: "net",
    title: "ברוטו מול נטו",
    body: "התשואה במודעה היא שכירות שנתית חלקי מחיר. זו לא התשואה שנשארת. מורידים שורה אחר שורה: עלויות רכישה ושיפוץ, חודש ריק, ניהול, ועד בית, מס נכס, ביטוח ותחזוקה. מה שנשאר, חלקי כל הכסף שנכנס לעסקה, הוא הנטו.",
    exampleLabel: "דוגמה, מספרים להמחשה",
    example: {
      il: "דירה ב־₪2,500,000 עם שכירות של ₪7,500 בחודש: במודעה 3.6%. אחרי מס רכישה, עורך דין, תיווך ושיפוץ, חודש ריק, תחזוקה וביטוח, נשארים בערך 2.7% נטו.",
      default: "נכס ב־€250,000 עם שכירות של €1,250 בחודש: במודעה 6%. אחרי עלויות רכישה ושיפוץ (€30,000), חודש ריק, ניהול, ועד בית, מס נכס, ביטוח ותחזוקה, נשארים 3.4% נטו.",
    },
    visual: "net",
    trap: "לשכוח הוצאה קטנה כי היא ״רק כמה עשרות בחודש״. כמה כאלה ביחד הופכות ברוטו יפה לנטו נמוך.",
    ask: { il: "מה נשאר בשנה, אחרי כל העלויות, על כל שקל שנכנס לעסקה?", default: "מה נשאר בשנה, אחרי כל העלויות, על כל אירו שנכנס לעסקה?" },
    who: "self",
    roleTip: {
      investor: "קבעו מראש תשואה נטו מינימלית. עסקה שלא עוברת אותה יורדת מהשולחן, גם אם התמונות יפות.",
      agent: "לקוח שמגיע עם המספר מהמודעה מקבל מכם חישוב נטו פשוט. זו הדרך הכי מהירה לבנות אמון.",
      developer: "אותו היגיון חל על התחזית למשקיעים בפרויקט: מה נשאר אחרי כל העלויות, לא לפני.",
    },
    prompt: "חישבתם כבר נטו לעסקה שמולכם?",
    options: { done: "כן, יש לי מספר נטו", open: "עוד לא" },
  },
  {
    id: "leverage",
    title: "מימון מול תשואה",
    body: "הלוואה מגדילה את התשואה על ההון רק כשהריבית נמוכה מהתשואה נטו. כשהיא גבוהה ממנה, כל שקל או אירו שהבנק נותן מוריד את התשואה על הכסף שלכם. ובמשכנתה שנפרעת כל חודש, בודקים גם כמה יוצא מהחשבון בפועל.",
    exampleLabel: "דוגמה, מספרים להמחשה",
    example: {
      il: "נטו 2.7%, ריבית 4.5%, משכנתה של 50% מהמחיר: על הכסף שלכם נשארים בערך 1.3% בשנה, לפני החזר הקרן.",
      default: "נטו 3.4%, ריבית 4.2%, הלוואה של 60% מהמחיר: על הכסף שלכם נשארים בערך 2.4%. ובמשכנתה נפרעת ל־25 שנה, התזרים השנתי יוצא בערך מינוס €226.",
    },
    visual: "leverage",
    trap: "לראות 60% מימון ולהרגיש שהעסקה ״יעילה״. אם הריבית גבוהה מהנטו, ההלוואה לא עובדת לטובתכם.",
    ask: "מה הריבית בפועל, והאם היא נמוכה מהתשואה נטו? וכמה יוצא מהחשבון כל חודש, כולל החזר הקרן?",
    who: "bank",
    roleTip: {
      developer: "במימון פרויקט שואלים גם על לוח המשיכות ועל הריבית בתקופת הבנייה, לא רק על שיעור הריבית.",
      agent: "התשואה על ההון, לצד הנטו, עוזרת ללקוח להבין אם המימון עובד בשבילו או נגדו.",
    },
    prompt: "יש לכם הצעת מימון בכתב, עם ריבית ותנאים?",
    options: { done: "כן", open: "עוד לא", na: "קונים בלי מימון" },
  },
  {
    id: "photos",
    title: "מודעה מול תמונות",
    body: "קוראים את הטקסט ומסמנים כל טענה: חדש, משופץ, מוכן לכניסה, נוף. אחר כך עוברים על התמונות אחת אחת ומשווים. מחפשים בטון חשוף, פיגומים, חדרים שלא מופיעים, ותמונות שהן הדמיה ולא צילום.",
    exampleLabel: "מקרה אמיתי",
    example: "בית באזור סטובל, פורטוגל. במודעה: ״גמר יוקרתי, מוכן לכניסה״. בתמונות: שלד בבנייה.",
    trap: "לתת למוכר לבחור את המסלול בסיור. בסיור וידאו חי, אתם מכוונים את המצלמה: חלונות, תקרה, לוח חשמל, חדר מדרגות ורחוב.",
    ask: "מתי צולמו התמונות, מה מהן הדמיה, ואפשר סיור וידאו חי שבו אנחנו מכוונים את המצלמה?",
    who: "seller",
    roleTip: {
      agent: "כשהמודעה שלכם, השוואה כזו לפני הפרסום חוסכת שאלות לא נעימות בשלב מאוחר יותר.",
    },
    prompt: "השוויתם את הטקסט לתמונות, אחת אחת?",
    options: { done: "כן", open: "עוד לא" },
  },
  {
    id: "legal",
    title: "רישום ורישוי",
    body: "בודקים שהנכס רשום כמו שהוא מתואר, שיש היתר או רישיון לשימוש שנמכר, ושאין עליו שעבודים, עיקולים או חובות.",
    local: {
      il: "בישראל: נסח טאבו (או אישור זכויות מרמ״י או מהחברה המשכנת), היתר הבנייה, וחריגות בנייה בתיק הבניין בעירייה.",
      pt: "בפורטוגל: רישיון השימוש (Licença de Utilização), התעודה מרשם המקרקעין (Certidão Permanente) והרישום במס (Caderneta Predial). בקנייה מחו״ל שואלים גם מה קורה אם שוכר מפסיק לשלם, וכמה זמן לוקח פינוי.",
      default: "מבקשים מעורך דין מקומי ועצמאי את מסמך רישום הבעלות הרשמי, את רישיון השימוש ואת רשימת השעבודים. בקנייה מחו״ל שואלים גם אם זרים יכולים להחזיק בעלות מלאה, ומה קורה אם שוכר מפסיק לשלם.",
    },
    trap: "עורך הדין של המוכר מציע לייצג גם אתכם. מביאים עורך דין שלכם.",
    ask: "האם הרישום, הרישיון והמצב בפועל תואמים, והאם יש על הנכס שעבוד או חוב?",
    who: "lawyer",
    prompt: "עורך דין שלכם, עצמאי, כבר בדק את המסמכים?",
    options: { done: "כן", open: "עוד לא" },
  },
  {
    id: "physical",
    title: "מצב פיזי ולוח זמנים",
    body: "״מוכן לכניסה״ זו טענה, וצריך לבדוק אותה. מזמינים מהנדס או בודק עצמאי, לא של המוכר. מבקשים תמונות עדכניות עם תאריך, לוח זמנים להשלמה, ומה כלול במחיר ומה לא.",
    local: {
      il: "בדירה מקבלן: ערבות חוק מכר על כל תשלום, מועד מסירה בחוזה, ופיצוי על איחור.",
      default: "בעסקת בנייה: ערבות בנקאית או חשבון נאמנות, תשלומים לפי אבני דרך, מועד מסירה, וקנס על איחור.",
    },
    trap: "לחשוב שעורך הדין בודק גם רטיבות, או שהמהנדס בודק גם רישום. אלה בדיקות של אנשי מקצוע שונים.",
    ask: "מתי אפשר להשכיר בפועל, כמה עולה להביא את הנכס לשם, ומה קורה אם ההשלמה מתעכבת?",
    who: "inspector",
    roleTip: {
      developer: "בפרויקט, מקבלים הצעת מחיר מקבלן לפני שמגישים הצעה, לא אחרי החתימה.",
    },
    prompt: "בודק עצמאי כבר ראה את הנכס?",
    options: { done: "כן", open: "עוד לא" },
  },
  {
    id: "tax",
    title: "מס לפי מדינה ומצב אישי",
    body: "יש מס ברכישה, מס שנתי על הנכס, מס על השכירות ומס במכירה. השיעורים משתנים לפי מדינה, סוג הנכס והמצב האישי, ולכן מחשבים אותם לכל עסקה מחדש. מבנה הבעלות, פרטי או חברה, קשה לשינוי אחרי הקנייה.",
    local: {
      il: "בישראל: מס רכישה (גבוה יותר על דירה נוספת), מס על הכנסה משכירות לפי המסלול שבוחרים, ומס שבח במכירה.",
      pt: "בפורטוגל: מס רכישה (IMT) ומס בולים, מס נכס שנתי (IMI) ומס על השכירות. ואם אתם תושבי מס בישראל, גם דיווח בישראל.",
      default: "במדינת הנכס, וגם בישראל אם אתם תושבי מס בה. בודקים אם יש אמנת מס בין המדינות, ואיך עובד הזיכוי על מס ששולם בחו״ל.",
    },
    trap: "לחשב תשואה לפני מס, ולגלות אחרי הקנייה דיווח שנתי בשתי מדינות.",
    ask: {
      il: "כמה מס יוצא ברכישה, בכל שנה ובמכירה, ומה מבנה הבעלות הנכון לפני שקונים?",
      default: "כמה מס יוצא בשנה על הנכס הזה, במדינת הנכס ובישראל, ומה מבנה הבעלות הנכון לפני שקונים?",
    },
    who: "accountant",
    prompt: "רואה חשבון כבר חישב את המס לעסקה הזו?",
    options: { done: "כן", open: "עוד לא" },
  },
  {
    id: "market",
    title: "השוק מסביב",
    body: "מחיר מבוקש הוא לא מחיר שוק. משווים לעסקאות שנסגרו, לא למודעות אחרות: מודעה היא בקשה, עסקה סגורה היא ראיה. ואם השכירות במודעה גבוהה מהאזור, כל החישוב בבדיקה 1 נשען עליה.",
    pointsLabel: "מהשטח · יבגני גורקוב, Montreza",
    points: [
      "משווים רק נכסים דומים: גודל, קומה, מצב, חניה, אותו רחוב או שכונה.",
      "את השכירות בודקים מול שלושה מנהלי נכסים מקומיים, כולל כמה זמן לוקח להשכיר. עונת שיא היא לא שנה: לא מכפילים את אוגוסט ב־12.",
      "מחיר נמוך מאוד מהאזור, בלי סיבה מוכחת, הוא דגל אדום.",
      "שואלים מי יקנה מכם ביום שתרצו לצאת. אם הקונה הבא הוא רק עוד משקיע זר, היציאה תלויה בטרנד.",
    ],
    local: {
      il: "בישראל, מחירי עסקאות שנסגרו פתוחים לציבור באתר מידע נדל״ן הממשלתי (nadlan.gov.il).",
      pt: "בפורטוגל, שמאי או עורך דין מקומי יכולים להביא עסקאות שנסגרו באזור, עם שטח, מצב ותאריך.",
      default: "מבקשים מהמתווך שלוש מכירות שנסגרו בחודשים האחרונים, עם כתובת, שטח, מצב ותאריך, ובודקים מול מקור עצמאי.",
    },
    trap: "להשוות למודעות פעילות. הן מראות מה מוכרים מבקשים, לא מה קונים שילמו.",
    ask: "אילו שלוש עסקאות דומות נסגרו ליד הנכס בשנה האחרונה, בכמה הושכרו נכסים דומים, וכמה זמן זה לקח?",
    who: "local",
    roleTip: {
      agent: "שלוש עסקאות סגורות עם כתובות הן התשובה הכי חזקה לשאלה ״למה המחיר הזה?״.",
    },
    prompt: "יש לכם עסקאות סגורות להשוואה?",
    options: { done: "כן", open: "עוד לא" },
  },
];

export const resultIntro: Record<Role, string> = {
  investor: "הרשימה שלכם לעסקה הזו. קחו אותה לכל פגישה.",
  developer: "הרשימה שלכם לפני שמתקדמים עם העסקה או הפרויקט.",
  agent: "רשימה לעבור עליה עם הלקוח, לפני שמתקדמים.",
  other: "הרשימה שלכם לעסקה הזו. קחו אותה לכל פגישה.",
};

export type ChecklistGroup = { who: Who; items: { id: string; title: string; ask: string }[] };

/** The personal checklist: unanswered checks count as open. Shared by the page and the email. */
export function buildChecklist(answers: Partial<Record<string, Answer>>, market: Market) {
  const groups = new Map<Who, ChecklistGroup["items"]>();
  const done: string[] = [];
  for (const check of checks) {
    const value = answers[check.id] ?? "open";
    if (value === "done") done.push(check.title);
    if (value !== "open") continue;
    const items = groups.get(check.who) ?? [];
    items.push({ id: check.id, title: check.title, ask: forMarket(check.ask, market)! });
    groups.set(check.who, items);
  }
  const list: ChecklistGroup[] = [...groups.entries()].map(([who, items]) => ({ who, items }));
  return { groups: list, done, openCount: list.reduce((sum, group) => sum + group.items.length, 0) };
}

/** Plain-text checklist for copy, WhatsApp and the email. */
export function checklistText(checklist: ReturnType<typeof buildChecklist>, guideUrl: string) {
  const lines = ["איך לבחון עסקה לפני שמתקדמים: מה לשאול", ""];
  for (const group of checklist.groups) {
    lines.push(`${whoLabels[group.who]}:`);
    for (const item of group.items) lines.push(`• ${item.ask}`);
    lines.push("");
  }
  if (checklist.done.length) lines.push(`כבר בידיים: ${checklist.done.join(", ")}`, "");
  lines.push("המדריך לא מחליף שמאי, עורך דין או רואה חשבון.", `המדריך המלא: ${guideUrl}`);
  return lines.join("\n");
}
