import { createHash, randomUUID } from "node:crypto";

/**
 * Server-side Meta Conversions API "Lead" event for /webinar form registrations, so Meta can
 * attribute sign-ups to our ads. No browser pixel and no cookies: the click id comes from the
 * `fbclid` URL parameter, and email/phone are SHA-256 hashed before they leave the server.
 * Config (VPS env only, never in git): META_DATASET_ID, META_CAPI_TOKEN, optional
 * META_TEST_EVENT_CODE. Unset → nothing is sent.
 * Leads that arrive through /api/webinar/register (Meta Instant Forms) are already counted by
 * Meta, so only the site form calls this.
 */

const GRAPH_VERSION = "v24.0";
const TIMEOUT_MS = 2000;

export type LeadInput = {
  email: string;
  phone: string;
  ref: string;
  fbclid: string;
  clientIp: string;
  userAgent: string;
  sourceUrl: string;
};

export function metaConfigured() {
  return Boolean(process.env.META_DATASET_ID && process.env.META_CAPI_TOKEN);
}

export function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

/**
 * E.164 digits without "+", as Meta expects. The webinar is Hebrew, so a local number with a
 * leading 0 and no country code (054-123 4567) is read as Israeli. Returns "" when unusable.
 */
export function normalizePhone(phone: string) {
  const trimmed = phone.trim();
  let digits = trimmed.replace(/\D/g, "");
  if (trimmed.startsWith("+")) {
    // already international
  } else if (digits.startsWith("00")) {
    digits = digits.slice(2);
  } else if (digits.startsWith("0")) {
    digits = `972${digits.slice(1)}`;
  }
  return digits.length >= 8 && digits.length <= 15 ? digits : "";
}

/** Facebook click id from the landing URL; only the characters Meta uses, capped. */
export function cleanFbclid(value: unknown) {
  return String(value ?? "").trim().replace(/[^A-Za-z0-9_-]/g, "").slice(0, 500);
}

/** fbc in Meta's format: fb.<subdomain index>.<creation time ms>.<fbclid>. */
export function fbcFrom(fbclid: string, nowMs: number) {
  return fbclid ? `fb.1.${nowMs}.${fbclid}` : "";
}

export function buildLeadEvent(input: LeadInput, eventId: string, nowMs = Date.now()) {
  const email = normalizeEmail(input.email);
  const phone = normalizePhone(input.phone);
  const fbc = fbcFrom(input.fbclid, nowMs);
  const userData: Record<string, unknown> = {
    em: [sha256(email)],
    ...(phone && { ph: [sha256(phone)] }),
    ...(input.clientIp && { client_ip_address: input.clientIp }),
    ...(input.userAgent && { client_user_agent: input.userAgent }),
    ...(fbc && { fbc }),
  };
  return {
    event_name: "Lead",
    event_time: Math.floor(nowMs / 1000),
    // A fresh id per registration: `ref` is a campaign tag shared by many people, and Meta
    // would merge events that share an id. Keep this id for dedup if a browser pixel comes later.
    event_id: eventId,
    event_source_url: input.sourceUrl,
    action_source: "website",
    user_data: userData,
    custom_data: { content_name: "webinar-2026-10-20", ...(input.ref && { ref: input.ref }) },
  };
}

/**
 * Sends the Lead event. Never throws and gives up after 2 s: a Meta problem must not touch the
 * registration. Logs carry the status and Meta's error code only, no personal data or token.
 */
export async function sendLeadEvent(input: LeadInput, fetcher: typeof fetch = fetch) {
  const datasetId = process.env.META_DATASET_ID;
  const token = process.env.META_CAPI_TOKEN;
  if (!datasetId || !token) return false;
  try {
    const testCode = process.env.META_TEST_EVENT_CODE;
    const response = await fetcher(`https://graph.facebook.com/${GRAPH_VERSION}/${encodeURIComponent(datasetId)}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [buildLeadEvent(input, randomUUID())],
        ...(testCode && { test_event_code: testCode }),
        access_token: token,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (response.ok) return true;
    const body = (await response.json().catch(() => ({}))) as { error?: { code?: number; error_subcode?: number; fbtrace_id?: string } };
    console.error("Meta CAPI Lead rejected", response.status, body.error?.code, body.error?.error_subcode, body.error?.fbtrace_id);
  } catch (error) {
    console.error("Meta CAPI Lead failed", error instanceof Error ? error.name : "unknown error");
  }
  return false;
}
