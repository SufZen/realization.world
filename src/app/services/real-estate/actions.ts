"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { clientKey, rateLimited } from "@/lib/brief";
import { appendToSheet, readDealCheck, sheetConfigured, validateDealCheck, type DealCheckField } from "@/lib/deal-check";

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

  if (!sheetConfigured()) return unavailable;

  if (rateLimited(clientKey(await headers()))) {
    return { status: "error", message: "Too many requests from this connection. Please wait a few minutes, or email us directly." };
  }

  try {
    await appendToSheet(deal);
  } catch (error) {
    console.error("Deal check failed to reach the sheet", error);
    return unavailable;
  }

  redirect("/services/real-estate/thank-you");
}
