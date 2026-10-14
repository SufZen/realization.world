"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { clientKey, rateLimited } from "@/lib/brief";
import { mailConfigured, sendWebinarRegistration } from "@/lib/mail";
import { cleanFbclid, metaConfigured, sendLeadEvent } from "@/lib/meta-capi";
import { addDetailsToSheet, appendToSheet, detailsEmpty, readDetails, readRegistration, sheetConfigured, validateRegistration, type RegistrationField } from "@/lib/webinar";
import { openRegistrant, sealRegistrant } from "@/lib/webinar-token";

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

  // Opens the optional step 2 on the thank-you page, tied to this registration (see lib/webinar-token.ts).
  const token = sheetConfigured() ? sealRegistrant({ email: reg.email, name: reg.name, ref: reg.ref }) : "";
  redirect(token ? `/webinar/thank-you?t=${token}` : "/webinar/thank-you");
}

export type DetailsState = { status: "idle" | "saved" | "error"; message?: string };

/** Step 2: optional answers from the thank-you page, added to the row step 1 created. */
export async function saveWebinarDetails(_previous: DetailsState, form: FormData): Promise<DetailsState> {
  const registrant = openRegistrant(form.get("t"));
  const fallback = "לא הצלחנו לשמור את התשובות. אפשר לשלוח אותן בתשובה למייל האישור או בוואטסאפ.";
  if (!registrant) return { status: "error", message: fallback };
  const details = readDetails((name) => form.get(name));
  if (detailsEmpty(details)) return { status: "saved" };
  // Own bucket, so answering step 2 doesn't use up the registration limit of a shared connection.
  if (rateLimited(`${clientKey(await headers())}:details`)) {
    return { status: "error", message: "יותר מדי שליחות מהחיבור הזה. נסו שוב בעוד כמה דקות." };
  }
  try {
    await addDetailsToSheet(registrant, details);
    return { status: "saved" };
  } catch (error) {
    console.error("Webinar details sheet update failed", error instanceof Error ? error.message : "unknown error");
    return { status: "error", message: fallback };
  }
}
