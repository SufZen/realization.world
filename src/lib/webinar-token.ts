import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

/**
 * Links step 2 of the webinar registration (the optional questions on the thank-you page) to the
 * registration from step 1, without a database id, a cookie, or the email in the URL: step 1 seals
 * the email into an opaque AES-256-GCM token, step 2 opens it. Tampered, foreign or expired tokens
 * open to null. The key comes from WEBINAR_SHEET_SECRET (VPS env only); without it there is no step 2.
 */

const MAX_AGE_MS = 48 * 60 * 60 * 1000;

export type Registrant = { email: string; name: string; ref: string };

function key() {
  const secret = process.env.WEBINAR_SHEET_SECRET;
  return secret ? createHash("sha256").update(`webinar-details:${secret}`).digest() : null;
}

export function sealRegistrant(registrant: Registrant, nowMs = Date.now()) {
  const k = key();
  if (!k) return "";
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", k, iv);
  const body = Buffer.concat([cipher.update(JSON.stringify({ e: registrant.email, n: registrant.name, r: registrant.ref, t: nowMs }), "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), body]).toString("base64url");
}

export function openRegistrant(token: unknown, nowMs = Date.now()): Registrant | null {
  const k = key();
  if (!k || typeof token !== "string" || token.length > 1000) return null;
  try {
    const raw = Buffer.from(token, "base64url");
    if (raw.length < 29) return null;
    const decipher = createDecipheriv("aes-256-gcm", k, raw.subarray(0, 12));
    decipher.setAuthTag(raw.subarray(12, 28));
    const data = JSON.parse(Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]).toString("utf8")) as { e?: unknown; n?: unknown; r?: unknown; t?: unknown };
    if (typeof data.e !== "string" || typeof data.t !== "number" || nowMs - data.t > MAX_AGE_MS || data.t > nowMs + 60_000) return null;
    return { email: data.e, name: typeof data.n === "string" ? data.n : "", ref: typeof data.r === "string" ? data.r : "" };
  } catch {
    return null;
  }
}
