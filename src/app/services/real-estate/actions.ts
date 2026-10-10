"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { clientKey, rateLimited } from "@/lib/brief";
import { appendToSheet, dealCheckBrief, readDealCheck, sheetConfigured, validateDealCheck, type DealCheckField } from "@/lib/deal-check";
import { mailConfigured, sendBrief } from "@/lib/mail";

export type DealCheckState = {
  status: "idle" | "error" | "unavailable";
  message?: string;
  fieldErrors?: Partial<Record<DealCheckField, string>>;
};

const unavailable: DealCheckState = {
  status: "unavailable",
  message: "Online sending is not available right now. What you typed is still here: send it by email or WhatsApp instead.",
};

export async function submitDealCheck(_previous: DealCheckState, form: FormData): Promise<DealCheckState> {
  // Honeypot: real people never see or fill this field.
  if (String(form.get("website") ?? "").trim()) redirect("/services/real-estate/thank-you");

  const deal = readDealCheck((name) => form.get(name));
  const fieldErrors = validateDealCheck(deal, form.get("consent") === "yes");
  if (Object.keys(fieldErrors).length) {
    return { status: "error", message: "Please check the highlighted fields.", fieldErrors };
  }

  if (!sheetConfigured() && !mailConfigured()) return unavailable;

  if (rateLimited(clientKey(await headers()))) {
    return { status: "error", message: "Too many requests from this connection. Please wait a few minutes, or email us directly." };
  }

  // The Sheet keeps the record and the email tells us it arrived. Either one is enough
  // for us to answer, so the visitor sees an error only when both fail.
  const deliveries: Array<[string, () => Promise<void>]> = [];
  if (sheetConfigured()) deliveries.push(["sheet", () => appendToSheet(deal)]);
  if (mailConfigured()) deliveries.push(["email", () => sendBrief(dealCheckBrief(deal))]);
  const results = await Promise.allSettled(deliveries.map(([, deliver]) => deliver()));
  results.forEach((result, index) => {
    if (result.status === "rejected") console.error(`Deal check failed to reach the ${deliveries[index][0]}`, result.reason);
  });
  if (results.every((result) => result.status === "rejected")) return unavailable;

  redirect("/services/real-estate/thank-you");
}
