"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { EMAIL, clientKey, clip, line, rateLimited } from "@/lib/brief";
import { mailConfigured, sendBrief } from "@/lib/mail";

export type MessageField = "name" | "email" | "message" | "consent";

export type MessageState = {
  status: "idle" | "error" | "unavailable";
  message?: string;
  fieldErrors?: Partial<Record<MessageField, string>>;
};

/**
 * The short general message from /contact. It goes through the same mail backend as the
 * opportunity brief (path "general"), so it lands in the same inbox with the same subject shape.
 */
export async function sendMessage(_previous: MessageState, form: FormData): Promise<MessageState> {
  // Honeypot: real people never see or fill this field.
  if (String(form.get("website") ?? "").trim()) redirect("/thank-you?path=general");

  const name = line(form.get("name"), 120);
  const email = line(form.get("email"), 200);
  const message = clip(form.get("message"), 5000);
  const fieldErrors: Partial<Record<MessageField, string>> = {};
  if (!name) fieldErrors.name = "Please add your name.";
  if (!EMAIL.test(email)) fieldErrors.email = "Please add a valid email address.";
  if (message.length < 2) fieldErrors.message = "A line or two is enough.";
  if (form.get("consent") !== "yes") fieldErrors.consent = "Please confirm we may use these details to reply.";
  if (Object.keys(fieldErrors).length) {
    return { status: "error", message: "Please check the highlighted fields.", fieldErrors };
  }

  if (!mailConfigured()) {
    return { status: "unavailable", message: "Online sending is not available right now. Your message is still here: send it by email or WhatsApp instead." };
  }
  if (rateLimited(clientKey(await headers()))) {
    return { status: "error", message: "Too many messages from this connection. Please wait a few minutes, or email us directly." };
  }

  try {
    await sendBrief({
      path: "general",
      name,
      email,
      organization: "",
      geography: "",
      brief: message,
      context: "",
      ref: clip(form.get("ref"), 80).replace(/[^a-z0-9-]/gi, ""),
    });
  } catch (error) {
    console.error("Contact message failed to send", error);
    return { status: "unavailable", message: "We could not send your message just now. It is still here: send it by email or WhatsApp instead." };
  }

  redirect("/thank-you?path=general");
}
