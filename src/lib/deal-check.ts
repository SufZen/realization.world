import { EMAIL, clip, line } from "@/lib/brief";

/**
 * The free deal check on /services/real-estate: a visitor sends a listing link and gets
 * the real numbers back. Rows go to a Google Sheet through an Apps Script web app,
 * the same way as webinar registrations (src/lib/webinar.ts). Setup notes: the PR that
 * added this file, and docs/strategy/2026-10-services-decision.md.
 */

export const dealPlans = [
  ["rent", "Buy to rent"],
  ["renovate", "Renovate and sell"],
  ["develop", "Build or redevelop"],
  ["unsure", "Not sure yet"],
] as const;

const planLabels = new Map<string, string>(dealPlans);

export type DealCheck = {
  listing: string;
  plan: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  ref: string;
};

export type DealCheckField = "listing" | "plan" | "name" | "email" | "phone" | "consent";

export function readDealCheck(input: (name: string) => unknown): DealCheck {
  return {
    listing: line(input("listing"), 500),
    plan: line(input("plan"), 20),
    name: line(input("name"), 120),
    email: line(input("email"), 200),
    phone: line(input("phone"), 40),
    notes: clip(input("notes"), 2000),
    ref: clip(input("ref"), 80).replace(/[^a-z0-9-]/gi, ""),
  };
}

function isWebLink(value: string) {
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") && url.hostname.includes(".");
  } catch {
    return false;
  }
}

export function validateDealCheck(deal: DealCheck, consent: boolean) {
  const errors: Partial<Record<DealCheckField, string>> = {};
  if (!isWebLink(deal.listing)) errors.listing = "Paste the full listing link, starting with https://.";
  if (!planLabels.has(deal.plan)) errors.plan = "Choose the plan closest to yours.";
  if (!deal.name) errors.name = "Please add your name.";
  if (!EMAIL.test(deal.email)) errors.email = "Please add a valid email address, so we can send the numbers.";
  if (deal.phone && !/^[+\d][\d\s()-]{6,}$/.test(deal.phone)) errors.phone = "That number does not look right. You can also leave it empty.";
  if (!consent) errors.consent = "Please confirm we may use these details to send you the analysis.";
  return errors;
}

export function sheetConfigured() {
  return Boolean(process.env.DEAL_CHECK_SHEET_WEBHOOK_URL && process.env.DEAL_CHECK_SHEET_SECRET);
}

/**
 * Visitors type free text; a cell that starts with = + - @ (or a tab or carriage return)
 * would run as a formula in the Sheet. A leading apostrophe makes Sheets store it as text.
 * The Apps Script escapes too; this keeps the Sheet safe whatever script sits behind it.
 */
const asText = (value: string) => (/^[=+\-@\t\r]/.test(value) ? `'${value}` : value);

/** Appends the deal check to the Sheet. Apps Script answers with a redirect; fetch follows it. */
export async function appendToSheet(deal: DealCheck) {
  const url = process.env.DEAL_CHECK_SHEET_WEBHOOK_URL;
  const secret = process.env.DEAL_CHECK_SHEET_SECRET;
  if (!url || !secret) throw new Error("Deal check sheet is not configured");
  const row = { ...deal, plan: planLabels.get(deal.plan) ?? deal.plan };
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret,
      submittedAt: new Date().toISOString(),
      source: "deal-check",
      pillar: "real-estate",
      ...Object.fromEntries(Object.entries(row).map(([key, value]) => [key, asText(value)])),
    }),
    signal: AbortSignal.timeout(8000),
  });
  const text = await response.text();
  if (!response.ok || !text.includes('"ok":true')) throw new Error(`Deal check sheet rejected the row (${response.status})`);
}
