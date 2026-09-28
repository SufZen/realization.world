"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { clientKey, rateLimited, readBrief, validateBrief, type BriefField } from "@/lib/brief";
import { mailConfigured, sendBrief } from "@/lib/mail";

export type BriefState = {
  status: "idle" | "error" | "unavailable";
  message?: string;
  fieldErrors?: Partial<Record<BriefField, string>>;
};

export async function submitBrief(_previous: BriefState, form: FormData): Promise<BriefState> {
  // Honeypot: real people never see or fill this field.
  if (String(form.get("website") ?? "").trim()) redirect("/thank-you");

  const brief = readBrief((name) => form.get(name));
  const fieldErrors = validateBrief(brief, form.get("consent") === "yes");
  if (Object.keys(fieldErrors).length) {
    return { status: "error", message: "Please check the highlighted fields.", fieldErrors };
  }

  if (!mailConfigured()) {
    return { status: "unavailable", message: "Online sending is not available right now. Your brief is still here — send it by email instead." };
  }

  if (rateLimited(clientKey(await headers()))) {
    return { status: "error", message: "Too many briefs from this connection. Please wait a few minutes, or email us directly." };
  }

  try {
    await sendBrief(brief);
  } catch (error) {
    console.error("Opportunity brief failed to send", error);
    return { status: "unavailable", message: "We could not send your brief just now. It is still here — send it by email instead." };
  }

  redirect(`/thank-you?path=${brief.path}`);
}
