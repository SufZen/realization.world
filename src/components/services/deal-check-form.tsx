"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { unstable_rethrow, useSearchParams } from "next/navigation";
import { startTransition, useActionState, useRef, useState, type FormEvent } from "react";
import { submitDealCheck, type DealCheckState } from "@/app/services/real-estate/actions";
import { contactEmail, whatsappUrl } from "@/content/site";
import { dealPlans } from "@/lib/deal-check";

const initialState: DealCheckState = { status: "idle" };

/**
 * A page opened before a deploy still points at the previous build's server action, and
 * the server answers 404. Without this, the click does nothing visible; with it, the
 * visitor gets the email and WhatsApp fallback with what they typed.
 */
async function submitOrFallBack(previous: DealCheckState, form: FormData): Promise<DealCheckState> {
  try {
    return await submitDealCheck(previous, form);
  } catch (error) {
    unstable_rethrow(error);
    console.error("Deal check could not reach the server", error);
    return {
      status: "unavailable",
      message: "The site was updated while this page was open, so it could not send. Reload the page and send again, or send what you typed by email or WhatsApp.",
    };
  }
}

/** Builds a mailto: link from the current form values, used when online sending is unavailable. */
function mailtoFrom(form: HTMLFormElement | null) {
  const data = form ? new FormData(form) : new FormData();
  const get = (name: string) => String(data.get(name) ?? "").trim();
  const subject = `Deal check — ${get("name") || "—"}`;
  const body = [
    `Listing: ${get("listing")}`,
    `Plan: ${get("plan") || "—"}`,
    `Name: ${get("name")}`,
    `Email: ${get("email")}`,
    `WhatsApp: ${get("phone") || "—"}`,
    "",
    "Notes:",
    get("notes") || "—",
  ].join("\n");
  return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function DealCheckForm() {
  const ref = (useSearchParams().get("ref") ?? "").replace(/[^a-z0-9-]/gi, "").slice(0, 80) || "services-real-estate";
  const [state, action, pending] = useActionState(submitOrFallBack, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [mailto, setMailto] = useState(`mailto:${contactEmail}`);
  const errors = state.fieldErrors ?? {};

  // Submit through the action without React's automatic form reset,
  // so a validation error or fallback never loses what the visitor typed.
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setMailto(mailtoFrom(event.currentTarget));
    startTransition(() => action(data));
  }

  return (
    <form className="opportunity-form" action={action} onSubmit={submit} ref={formRef} onChange={() => setMailto(mailtoFrom(formRef.current))} noValidate>
      <input type="hidden" name="ref" value={ref} />
      <div className="form-honeypot" aria-hidden="true">
        <label>Website <input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <label>
        <span>Listing link *</span>
        <input id="deal-listing" name="listing" type="url" inputMode="url" placeholder="https://www.idealista.pt/…" required maxLength={500} aria-invalid={Boolean(errors.listing)} aria-describedby={errors.listing ? "listing-error" : undefined} />
        {errors.listing && <em className="form-error" id="listing-error">{errors.listing}</em>}
      </label>
      <fieldset aria-describedby={errors.plan ? "plan-error" : undefined}>
        <legend className="eyebrow">What is the plan? *</legend>
        <div className="path-options">
          {dealPlans.map(([value, label]) => (
            <label className="path-option" key={value}>
              <input name="plan" type="radio" value={value} required />
              <span>{label}</span>
            </label>
          ))}
        </div>
        {errors.plan && <p className="form-error" id="plan-error">{errors.plan}</p>}
      </fieldset>
      <div className="form-grid">
        <label>
          <span>Name *</span>
          <input id="deal-name" name="name" type="text" autoComplete="name" required maxLength={120} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "deal-name-error" : undefined} />
          {errors.name && <em className="form-error" id="deal-name-error">{errors.name}</em>}
        </label>
        <label>
          <span>Email *</span>
          <input id="deal-email" name="email" type="email" autoComplete="email" required maxLength={200} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "deal-email-error" : undefined} />
          {errors.email && <em className="form-error" id="deal-email-error">{errors.email}</em>}
        </label>
      </div>
      <label>
        <span>WhatsApp (optional)</span>
        <input id="deal-phone" name="phone" type="tel" autoComplete="tel" maxLength={40} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "deal-phone-error" : undefined} />
        {errors.phone && <em className="form-error" id="deal-phone-error">{errors.phone}</em>}
      </label>
      <label>
        <span>Anything we should know? (optional)</span>
        <textarea id="deal-notes" name="notes" rows={3} maxLength={2000} placeholder="Budget, cash or mortgage, what worries you about this one." />
      </label>
      <label className="form-consent">
        <input id="deal-consent" name="consent" type="checkbox" value="yes" required aria-invalid={Boolean(errors.consent)} />
        <span>I agree that Realization may use these details to send me the analysis and follow up about this deal, as described in the <Link href="/privacy">privacy notice</Link>. *</span>
      </label>
      {errors.consent && <p className="form-error">{errors.consent}</p>}
      <div className="form-submit">
        <button className="button button--dark" type="submit" disabled={pending} data-umami-event="deal-check" data-umami-event-pillar="real-estate" data-umami-event-ref={ref}>
          {pending ? "Sending…" : "Check this deal"} <ArrowRight className="r-flip-x" aria-hidden="true" size={17} />
        </button>
        <p>Free. We reply within two working days, by email.</p>
      </div>
      {state.message && (
        <div className="form-status" role={state.status === "error" ? "alert" : "status"}>
          <p>{state.message}</p>
          {state.status === "unavailable" && (
            <p className="form-status__fallback">
              <a className="button button--dark" href={mailto}>Send by email</a>
              <a className="text-link" href={whatsappUrl} rel="noopener" data-umami-event="whatsapp">or message us on WhatsApp</a>
            </p>
          )}
        </div>
      )}
    </form>
  );
}
