"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { formPaths, type FormPath } from "@/content/work";
import { mailConfigured, sendBrief } from "@/lib/mail";

export type BriefState = {
  status: "idle" | "error" | "unavailable";
  message?: string;
  fieldErrors?: Partial<Record<"path" | "name" | "email" | "brief" | "consent", string>>;
};

const validPaths = new Set<string>(formPaths.map(([value]) => value));
const EMAIL = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

/* Small in-memory rate limit: 5 briefs per address per 10 minutes, per server instance. */
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;
const hits = new Map<string, number[]>();

function rateLimited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > LIMIT;
}

const field = (form: FormData, name: string, max: number) => String(form.get(name) ?? "").trim().slice(0, max);

export async function submitBrief(_previous: BriefState, form: FormData): Promise<BriefState> {
  // Honeypot: real people never see or fill this field.
  if (field(form, "website", 200)) redirect("/thank-you");

  const brief = {
    path: field(form, "path", 40),
    name: field(form, "name", 120),
    email: field(form, "email", 200),
    organization: field(form, "organization", 200),
    geography: field(form, "geography", 120),
    brief: field(form, "brief", 5000),
    context: field(form, "context", 5000),
    ref: field(form, "ref", 80).replace(/[^a-z0-9-]/gi, ""),
  };

  const fieldErrors: BriefState["fieldErrors"] = {};
  if (!validPaths.has(brief.path)) fieldErrors.path = "Choose the path that fits you best.";
  if (!brief.name) fieldErrors.name = "Please add your name.";
  if (!EMAIL.test(brief.email)) fieldErrors.email = "Please add a valid email address.";
  if (brief.brief.length < 10) fieldErrors.brief = "A sentence or two is enough, but we need something to go on.";
  if (form.get("consent") !== "yes") fieldErrors.consent = "Please confirm we may use these details to reply.";
  if (Object.keys(fieldErrors).length) {
    return { status: "error", message: "Please check the highlighted fields.", fieldErrors };
  }

  if (!mailConfigured()) {
    return { status: "unavailable", message: "Online sending is not available right now. Your brief is still here — send it by email instead." };
  }

  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() || headerStore.get("x-real-ip") || "local";
  if (rateLimited(ip)) {
    return { status: "error", message: "Too many briefs from this connection. Please wait a few minutes, or email us directly." };
  }

  try {
    await sendBrief(brief);
  } catch (error) {
    console.error("Opportunity brief failed to send", error);
    return { status: "unavailable", message: "We could not send your brief just now. It is still here — send it by email instead." };
  }

  redirect(`/thank-you?path=${brief.path as FormPath}`);
}
