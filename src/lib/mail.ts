import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

/**
 * Outbound mail for the opportunity brief. Same SMTP setup and variables as the
 * Live Lab form (docs/handoff/livelab.md), so one relay configuration serves both:
 * SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, SUBMISSION_NOTIFY_EMAIL.
 */

type Mailer = ReturnType<typeof nodemailer.createTransport>;
let mailer: Mailer | null = null;

function getMailer(): Mailer | null {
  const host = process.env.SMTP_HOST;
  if (!host) return null;
  if (!mailer) {
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const options: SMTPTransport.Options & { family: 4 } = {
      host,
      port,
      secure: port === 465,
      family: 4,
      name: "realization.co.il",
      requireTLS: port !== 465,
      ...(user && pass ? { auth: { user, pass } } : {}),
    };
    mailer = nodemailer.createTransport(options);
  }
  return mailer;
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

export async function sendBrief(brief: Brief) {
  const to = process.env.SUBMISSION_NOTIFY_EMAIL;
  const transporter = getMailer();
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
