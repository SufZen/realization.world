"use server";

import { headers } from "next/headers";
import { after } from "next/server";
import { buildChecklist, checklistText, checks, markets, roles, type Answer, type Market, type Role } from "@/components/deal-guide/content";
import { EMAIL, clientKey, line, rateLimited } from "@/lib/brief";
import { mailConfigured, sendGuideLead } from "@/lib/mail";
import { cleanFbclid, metaConfigured, sendLeadEvent } from "@/lib/meta-capi";

export type GuideLeadInput = {
  name: string;
  email: string;
  consent: boolean;
  role: string;
  market: string;
  answers: Record<string, string>;
  ref: string;
  fbclid: string;
  /** Honeypot: real people never see or fill it. */
  website: string;
};

export type GuideLeadResult =
  | { status: "ok"; emailed: boolean }
  | { status: "error"; message: string; fields?: Partial<Record<"name" | "email" | "consent", string>> }
  /** Our side failed: the page opens the checklist anyway and says the email didn't go out. */
  | { status: "unavailable" };

const GUIDE_URL = "https://realization.world/deal-check-guide";

export async function submitGuideLead(input: GuideLeadInput): Promise<GuideLeadResult> {
  if (String(input.website ?? "").trim()) return { status: "ok", emailed: true };

  const name = line(input.name, 120);
  const email = line(input.email, 200).toLowerCase();
  const fields: Partial<Record<"name" | "email" | "consent", string>> = {};
  if (name.length < 2) fields.name = "איך לפנות אליכם?";
  if (!EMAIL.test(email)) fields.email = "צריך כתובת מייל תקינה.";
  if (input.consent !== true) fields.consent = "צריך לאשר כדי שנוכל לשלוח.";
  if (Object.keys(fields).length) return { status: "error", message: "חסר משהו קטן, סימנו את השדות.", fields };

  if (!mailConfigured()) return { status: "unavailable" };
  const requestHeaders = await headers();
  if (rateLimited(`${clientKey(requestHeaders)}:guide`)) {
    return { status: "error", message: "יותר מדי שליחות מהחיבור הזה. נסו שוב בעוד כמה דקות." };
  }

  // Only known ids and values from the client; the checklist itself is rebuilt here from content.ts.
  const role = roles.find((item) => item.id === input.role)?.id ?? ("other" as Role);
  const market = markets.find((item) => item.id === input.market)?.id ?? ("other" as Market);
  const answers: Record<string, Answer> = {};
  for (const check of checks) {
    const value = input.answers?.[check.id];
    if (value === "done" || value === "open" || value === "na") answers[check.id] = value;
  }
  const checklist = buildChecklist(answers, market);
  const ref = line(input.ref, 60).replace(/[^\w.-]/g, "");

  let emailed: boolean;
  try {
    emailed = await sendGuideLead({
      name,
      email,
      role: roles.find((item) => item.id === role)!.label,
      market: markets.find((item) => item.id === market)!.label,
      ref,
      openCount: checklist.openCount,
      checklist: checklistText(checklist, GUIDE_URL),
    });
  } catch (error) {
    console.error("Guide lead notification failed", error instanceof Error ? error.message : "unknown error");
    return { status: "unavailable" };
  }

  // Ad attribution for Meta, after the response so it can never slow or fail the gate.
  if (metaConfigured()) {
    const lead = {
      email,
      phone: "",
      ref,
      fbclid: cleanFbclid(input.fbclid),
      clientIp: requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || requestHeaders.get("x-real-ip") || "",
      userAgent: requestHeaders.get("user-agent") ?? "",
      sourceUrl: GUIDE_URL,
      contentName: "deal-check-guide",
    };
    after(() => sendLeadEvent(lead));
  }

  return { status: "ok", emailed };
}
