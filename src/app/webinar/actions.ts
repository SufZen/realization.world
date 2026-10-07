"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { clientKey, rateLimited } from "@/lib/brief";
import { mailConfigured, sendWebinarRegistration } from "@/lib/mail";
import { appendToSheet, readRegistration, sheetConfigured, validateRegistration, type RegistrationField } from "@/lib/webinar";

export type RegistrationState = {
  status: "idle" | "error" | "unavailable";
  message?: string;
  fieldErrors?: Partial<Record<RegistrationField, string>>;
};

export async function registerWebinar(_previous: RegistrationState, form: FormData): Promise<RegistrationState> {
  // Honeypot: real people never see or fill this field.
  if (String(form.get("website") ?? "").trim()) redirect("/webinar/thank-you");

  const reg = readRegistration((name) => form.get(name));
  const fieldErrors = validateRegistration(reg, form.get("consent") === "yes");
  if (Object.keys(fieldErrors).length) {
    return { status: "error", message: "חסר משהו קטן, סימנו את השדות.", fieldErrors };
  }

  const unavailable: RegistrationState = {
    status: "unavailable",
    message: "ההרשמה המקוונת לא זמינה כרגע. הפרטים שמילאת עדיין כאן, ואפשר לשלוח אותם במייל או בוואטסאפ.",
  };
  if (!mailConfigured() && !sheetConfigured()) return unavailable;

  if (rateLimited(clientKey(await headers()))) {
    return { status: "error", message: "יותר מדי הרשמות מהחיבור הזה. נסו שוב בעוד כמה דקות." };
  }

  // Either channel is enough to keep the lead; the other one failing is only logged.
  const results = await Promise.allSettled([
    mailConfigured() ? sendWebinarRegistration(reg) : Promise.reject(new Error("mail not configured")),
    sheetConfigured() ? appendToSheet(reg) : Promise.reject(new Error("sheet not configured")),
  ]);
  results.forEach((result, index) => {
    if (result.status === "rejected" && !String(result.reason).includes("not configured")) {
      console.error(`Webinar registration ${index === 0 ? "email" : "sheet"} failed`, result.reason);
    }
  });
  if (!results.some((result) => result.status === "fulfilled")) return unavailable;

  redirect("/webinar/thank-you");
}
