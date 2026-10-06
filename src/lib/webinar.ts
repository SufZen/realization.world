import { EMAIL, clip, line } from "@/lib/brief";

/** The joint AI × real estate webinar with Evgeni Gurkov (Hebrew, Google Meet). */

// Titles stay Hebrew-only: calendars, email subjects and browser tabs render text left to right,
// and a Latin word inside a Hebrew title scrambles the word order there.
export const webinar = {
  title: "לא עוד הרצאה על בינה מלאכותית: 5 מקרים אמיתיים מפרויקטי נדל״ן, והבעיה שלכם על המסך",
  shortTitle: "לא עוד הרצאה על בינה מלאכותית",
  hosts: "Realization בשיתוף Montreza",
  hostNames: "אסף איזנקוט ויבגני גורקוב",
  // Tue 20 Oct 2026, 20:00–21:30 Israel (UTC+3) / 18:00–19:30 Lisbon (UTC+1).
  startUtc: "20261020T170000Z",
  endUtc: "20261020T183000Z",
  dateLabel: "יום שלישי, 20 באוקטובר 2026",
  timeLabel: "20:00 שעון ישראל · 18:00 שעון ליסבון",
  durationLabel: "90 דקות",
  platform: "Google Meet",
};

export const webinarCalendarUrl = (() => {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `וובינר: ${webinar.shortTitle}`,
    dates: `${webinar.startUtc}/${webinar.endUtc}`,
    details: [
      `${webinar.title}.`,
      `וובינר חינמי בעברית, 90 דקות: חמישה מקרים אמיתיים, בעיה אחת מהקהל על המסך, ושאלות ותשובות. מארחים: ${webinar.hostNames}.`,
      "הקישור לשידור יישלח במייל לפני תחילת הוובינר. הוובינר מוקלט.",
    ].join("\n\n"),
    location: "שידור חי, הקישור יישלח במייל",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
})();

export const webinarRoles = [
  ["architect", "משרד תכנון / אדריכלות"],
  ["developer", "יזם / חברת בנייה"],
  ["company", "ליווי, ייעוץ או תיווך נדל״ן"],
  ["investor", "משקיע/ה"],
  ["other", "אחר"],
] as const;

export const webinarMarkets = [
  ["israel", "בישראל"],
  ["abroad", "בחו״ל"],
  ["both", "גם וגם"],
] as const;

const roleLabels = new Map<string, string>(webinarRoles);
const marketLabels = new Map<string, string>(webinarMarkets);

export type Registration = {
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  market: string;
  pain: string;
  liveAudit: boolean;
  ref: string;
};

export type RegistrationField = "name" | "email" | "phone" | "role" | "market" | "consent";

export function readRegistration(input: (name: string) => unknown): Registration {
  return {
    name: line(input("name"), 120),
    email: line(input("email"), 200),
    phone: line(input("phone"), 40),
    company: line(input("company"), 200),
    role: line(input("role"), 20),
    market: line(input("market"), 20),
    pain: clip(input("pain"), 2000),
    liveAudit: input("liveAudit") === "yes",
    ref: clip(input("ref"), 80).replace(/[^a-z0-9-]/gi, ""),
  };
}

export function validateRegistration(reg: Registration, consent: boolean) {
  const errors: Partial<Record<RegistrationField, string>> = {};
  if (!reg.name) errors.name = "צריך למלא שם מלא.";
  if (!EMAIL.test(reg.email)) errors.email = "צריך כתובת מייל תקינה, כדי שנוכל לשלוח את הקישור.";
  if (reg.phone && !/^[+\d][\d\s()-]{6,}$/.test(reg.phone)) errors.phone = "מספר הטלפון לא נראה תקין. אפשר גם להשאיר את השדה ריק.";
  if (!roleLabels.has(reg.role)) errors.role = "בחרו את התיאור שהכי מתאים לכם.";
  if (!marketLabels.has(reg.market)) errors.market = "בחרו איפה אתם פעילים.";
  if (!consent) errors.consent = "סמנו את תיבת האישור כדי שנוכל לשלוח לכם את הקישור והתזכורות.";
  return errors;
}

/** Plain-text summary used in the notification email and the Sheet row. */
export function describeRegistration(reg: Registration) {
  return {
    role: roleLabels.get(reg.role) ?? reg.role,
    market: marketLabels.get(reg.market) ?? reg.market,
  };
}

export function sheetConfigured() {
  return Boolean(process.env.WEBINAR_SHEET_WEBHOOK_URL && process.env.WEBINAR_SHEET_SECRET);
}

/**
 * Appends the registration to the "Webinar leads" Google Sheet through its Apps Script
 * web app (realization-studio: campaigns/webinar-2026-10/webinar.md). Apps Script answers
 * with a redirect; fetch follows it.
 */
export async function appendToSheet(reg: Registration) {
  const url = process.env.WEBINAR_SHEET_WEBHOOK_URL;
  const secret = process.env.WEBINAR_SHEET_SECRET;
  if (!url || !secret) throw new Error("Webinar sheet is not configured");
  const { role, market } = describeRegistration(reg);
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret, submittedAt: new Date().toISOString(), ...reg, role, market }),
    signal: AbortSignal.timeout(8000),
  });
  const text = await response.text();
  if (!response.ok || !text.includes('"ok":true')) throw new Error(`Webinar sheet rejected the row (${response.status})`);
}
