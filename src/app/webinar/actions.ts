"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { clientKey, rateLimited } from "@/lib/brief";
import { mailConfigured, sendWebinarRegistration } from "@/lib/mail";
import { cleanFbclid, metaConfigured, sendLeadEvent } from "@/lib/meta-capi";
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

  const requestHeaders = await headers();
  if (rateLimited(clientKey(requestHeaders))) {
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

  // Ad attribution for Meta, sent after the response so it can never slow or fail the registration.
  if (metaConfigured()) {
    const lead = {
      email: reg.email,
      phone: reg.phone,
      ref: reg.ref,
      fbclid: cleanFbclid(form.get("fbclid")),
      clientIp: requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || requestHeaders.get("x-real-ip") || "",
      userAgent: requestHeaders.get("user-agent") ?? "",
      sourceUrl: requestHeaders.get("referer") || "https://realization.world/webinar",
    };
    after(() => sendLeadEvent(lead));
  }

  redirect("/webinar/thank-you");
}
