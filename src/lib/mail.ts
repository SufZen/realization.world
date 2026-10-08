import { resolve4 } from "node:dns/promises";
import { isIP } from "node:net";
import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { describeRegistration, webinar, type Registration } from "@/lib/webinar";

/**
 * Outbound mail for the opportunity brief. Same SMTP setup and variables as the
 * Live Lab form (docs/handoff/livelab.md), so one relay configuration serves both:
 * SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, SUBMISSION_NOTIFY_EMAIL.
 */

/**
 * The Workspace SMTP relay allow-lists the server's IPv4 address only, and
 * nodemailer (v9+) may connect over IPv6. So we resolve the relay's IPv4
 * address ourselves, connect to it, and verify TLS against the real hostname.
 */
async function ipv4For(host: string): Promise<string> {
  if (isIP(host)) return host;
  const [address] = await resolve4(host);
  return address ?? host;
}

function escapeHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function createMailer() {
  const host = process.env.SMTP_HOST;
  if (!host) return null;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const options: SMTPTransport.Options = {
    host: await ipv4For(host),
    port,
    secure: port === 465,
    name: "realization.co.il",
    requireTLS: port !== 465,
    tls: { servername: host },
    ...(user && pass ? { auth: { user, pass } } : {}),
  };
  return nodemailer.createTransport(options);
}

export function mailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SUBMISSION_NOTIFY_EMAIL);
}

export type Brief = {
  path: string;
  name: string;
  email: string;
  organization: string;
  geography: string;
  brief: string;
  context: string;
  ref: string;
};

// Webinar email frame: the Realization × Montreza logos, the webinar image, and links to Asaf's channels.
// Images are hosted with the mailing service (Listmonk media), so they stay reachable from inboxes.
const EMAIL_ASSETS = "https://lists.realization.world/uploads/";
const SOCIAL_LINKS: Array<[string, string]> = [
  ["LinkedIn", "https://www.linkedin.com/in/sufzen"],
  ["Instagram", "https://www.instagram.com/suf.zen"],
  ["Facebook", "https://facebook.com/101076789348095"],
  ["YouTube", "https://www.youtube.com/channel/UC4iI6gWzbwtdd-z-O-Al_bQ"],
  ["TikTok", "https://www.tiktok.com/@suf.zen"],
  ["X", "https://x.com/Suf_Zen"],
];

function brandedEmail(content: string) {
  const pills = SOCIAL_LINKS.map(
    ([name, url]) =>
      `<a href="${url}" style="display:inline-block;margin:3px 2px;padding:6px 11px;background:#000;color:#FDCC33;font-family:Arial,sans-serif;font-size:13px;font-weight:bold;text-decoration:none">${name}</a>`,
  ).join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f2"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border:3px solid #000">
<tr><td align="center" style="padding:14px 20px;border-bottom:1px solid #e6e2d6"><img src="${EMAIL_ASSETS}webinar-lockup.png" width="420" alt="Realization בשיתוף Montreza" style="display:block;width:100%;max-width:420px;height:auto;border:0"></td></tr>
<tr><td style="padding:0"><img src="${EMAIL_ASSETS}webinar-og.jpg" width="594" alt="${escapeHtml(webinar.shortTitle)}" style="display:block;width:100%;height:auto;border:0"></td></tr>
<tr><td style="padding:24px 32px">${content}</td></tr>
<tr><td dir="rtl" align="center" style="padding:16px 20px;background:#FDCC33;font-family:Arial,sans-serif;font-size:14px;color:#000"><b>עקבו אחרינו</b><br>${pills}</td></tr>
</table></td></tr></table>`;
}

export async function sendWebinarRegistration(reg: Registration) {
  const to = process.env.SUBMISSION_NOTIFY_EMAIL;
  const transporter = await createMailer();
  if (!to || !transporter) throw new Error("Mail is not configured");
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || to;
  const { role, market } = describeRegistration(reg);

  await transporter.sendMail({
    from,
    to,
    replyTo: { name: reg.name, address: reg.email },
    subject: `Webinar registration — ${reg.ref || "direct"} — ${reg.name}`,
    text: [
      `Name: ${reg.name}`,
      `Email: ${reg.email}`,
      `Phone: ${reg.phone || "—"}`,
      `Company: ${reg.company || "—"}`,
      `Role: ${role}`,
      `Active in: ${market}`,
      `Open to a live mini-audit: ${reg.liveAudit ? "yes" : "no"}`,
      `Came from: ${reg.ref || "—"}`,
      "",
      "Problem they most want solved:",
      reg.pain || "—",
    ].join("\n"),
  });

  const firstName = reg.name.trim().split(/\s+/)[0] || reg.name;
  const confirmation = [
    `שלום ${firstName},`,
    "",
    "תודה שנרשמת, שמרנו לך מקום.",
    "",
    `${webinar.title}.`,
    `${webinar.dateLabel}, ${webinar.timeLabel}. ${webinar.durationLabel}, בשידור חי.`,
    `מארחים: ${webinar.hostNames} (${webinar.hosts}).`,
    "",
    "בדקות הקרובות תגיע אליך הזמנה ליומן מ־Google Calendar, ובה הקישור לשידור. כדאי לאשר אותה: כך הוובינר נכנס ליומן ותגיע גם תזכורת.",
    "יום לפני ובבוקר הוובינר נשלח גם תזכורת במייל.",
    "אם ההזמנה לא הגיעה, כדאי לבדוק בתיקיית הספאם או פשוט לענות למייל הזה.",
    "",
    "הוובינר מוקלט, וההקלטה תישלח לכל הנרשמים.",
    "",
    "רוצה שנתייחס לבעיה מסוימת? אפשר לענות למייל הזה ולספר עליה.",
    "",
    "נתראה,",
    "אסף איזנקוט, Realization",
  ];

  // The confirmation is a courtesy: the registration already reached us, so a failure here is only logged.
  try {
    await transporter.sendMail({
      from: { name: "אסף איזנקוט", address: from },
      to: { name: reg.name, address: reg.email },
      replyTo: to,
      subject: `נרשמת לוובינר: ${webinar.shortTitle}`,
      text: confirmation.join("\n"),
      // Right-to-left HTML, so mail apps keep the Hebrew word order around the English names.
      html: brandedEmail(
        `<div dir="rtl" style="text-align:right;font-family:Arial,sans-serif;font-size:16px;line-height:1.65;color:#141414">${confirmation
          .map((row) => (row ? escapeHtml(row) : ""))
          .join("<br>")}</div>`,
      ),
    });
  } catch (error) {
    console.error("Webinar confirmation failed to send", error);
  }
}

export async function sendBrief(brief: Brief) {
  const to = process.env.SUBMISSION_NOTIFY_EMAIL;
  // A fresh transport per brief: volume is low and relay addresses can change.
  const transporter = await createMailer();
  if (!to || !transporter) throw new Error("Mail is not configured");

  await transporter.sendMail({
    // SMTP_FROM keeps the sender on the relay's allow-listed domain.
    from: process.env.SMTP_FROM || process.env.SMTP_USER || to,
    to,
    replyTo: { name: brief.name, address: brief.email },
    // Shared subject shape with the Live Lab: "… — <path> — <name>".
    subject: `Realization opportunity brief — ${brief.path} — ${brief.name}`,
    text: [
      `Path: ${brief.path}`,
      `Name: ${brief.name}`,
      `Email: ${brief.email}`,
      `Organization: ${brief.organization || "—"}`,
      `Geography: ${brief.geography || "—"}`,
      `Came from: ${brief.ref || "—"}`,
      "",
      "Opportunity / need:",
      brief.brief,
      "",
      "Rights, evidence or constraints:",
      brief.context || "—",
    ].join("\n"),
  });
}
