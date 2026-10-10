import { timingSafeEqual } from "node:crypto";
import { mailConfigured, sendWebinarRegistration } from "@/lib/mail";
import { appendToSheet, readRegistration, sheetConfigured, validateRegistration } from "@/lib/webinar";

/**
 * Server-to-server webinar registration, for leads collected outside the site
 * (Meta Instant Forms → Make → n8n). Same validation, confirmation email and Sheet row
 * as the /webinar form. Consent is given in the source form, so it is implied here.
 * Auth: header `x-webinar-secret` must equal WEBINAR_API_SECRET (VPS env only, never in git).
 */
export const dynamic = "force-dynamic";

function authorized(request: Request) {
  const expected = process.env.WEBINAR_API_SECRET;
  const given = request.headers.get("x-webinar-secret");
  if (!expected || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  if (!authorized(request)) return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false, error: "invalid JSON" }, { status: 400 });
  }

  const reg = readRegistration((name) => (name === "liveAudit" ? (body.liveAudit === true || body.liveAudit === "yes" ? "yes" : "") : body[name]));
  const errors = validateRegistration(reg, true);
  if (Object.keys(errors).length) return Response.json({ ok: false, errors }, { status: 422 });

  if (!mailConfigured() && !sheetConfigured()) {
    return Response.json({ ok: false, error: "registration channels not configured" }, { status: 503 });
  }

  // Either channel is enough to keep the lead; the other one failing is reported.
  const [mail, sheet] = await Promise.allSettled([
    mailConfigured() ? sendWebinarRegistration(reg) : Promise.reject(new Error("mail not configured")),
    sheetConfigured() ? appendToSheet(reg) : Promise.reject(new Error("sheet not configured")),
  ]);
  for (const [label, result] of [["email", mail], ["sheet", sheet]] as const) {
    if (result.status === "rejected" && !String(result.reason).includes("not configured")) {
      console.error(`Webinar API registration ${label} failed`, result.reason);
    }
  }
  if (mail.status === "rejected" && sheet.status === "rejected") {
    return Response.json({ ok: false, error: "registration failed" }, { status: 502 });
  }
  return Response.json({ ok: true, email: mail.status === "fulfilled", sheet: sheet.status === "fulfilled" });
}
