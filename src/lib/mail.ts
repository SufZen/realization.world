import { resolve4 } from "node:dns/promises";
import { isIP } from "node:net";
import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

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
