import { formPaths } from "@/content/work";
import type { Brief } from "@/lib/mail";

/** Validation and rate limiting shared by the brief form and the MCP submit_brief tool. */

export type BriefField = "path" | "name" | "email" | "brief" | "consent";

const validPaths = new Set<string>(formPaths.map(([value]) => value));
const EMAIL = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

const clip = (value: unknown, max: number) => String(value ?? "").trim().slice(0, max);
/** Single-line fields end up in mail headers: no control characters or line breaks. */
const line = (value: unknown, max: number) => clip(String(value ?? "").replace(/[\u0000-\u001f\u007f]+/g, " "), max);

export function readBrief(input: (name: string) => unknown): Brief {
  return {
    path: line(input("path"), 40),
    name: line(input("name"), 120),
    email: line(input("email"), 200),
    organization: line(input("organization"), 200),
    geography: line(input("geography"), 120),
    brief: clip(input("brief"), 5000),
    context: clip(input("context"), 5000),
    ref: clip(input("ref"), 80).replace(/[^a-z0-9-]/gi, ""),
  };
}

export function validateBrief(brief: Brief, consent: boolean) {
  const errors: Partial<Record<BriefField, string>> = {};
  if (!validPaths.has(brief.path)) errors.path = "Choose the path that fits you best.";
  if (!brief.name) errors.name = "Please add your name.";
  if (!EMAIL.test(brief.email)) errors.email = "Please add a valid email address.";
  if (brief.brief.length < 10) errors.brief = "A sentence or two is enough, but we need something to go on.";
  if (!consent) errors.consent = "Please confirm we may use these details to reply.";
  return errors;
}

/* In-memory rate limit: 5 briefs per key per 10 minutes, per server instance. */
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;
const hits = new Map<string, number[]>();

export function rateLimited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > LIMIT;
}

export function clientKey(headers: Headers) {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "local";
}
