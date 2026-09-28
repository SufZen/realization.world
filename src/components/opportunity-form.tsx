"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { startTransition, useActionState, useRef, useState, type FormEvent } from "react";
import { submitBrief, type BriefState } from "@/app/bring-an-opportunity/actions";
import { contactEmail, whatsappUrl } from "@/content/site";
import { formPaths } from "@/content/work";

const initialState: BriefState = { status: "idle" };

/** Builds a mailto: link from the current form values, used when online sending is unavailable. */
function mailtoFrom(form: HTMLFormElement | null) {
  const data = form ? new FormData(form) : new FormData();
  const get = (name: string) => String(data.get(name) ?? "").trim();
  const subject = `Realization opportunity brief — ${get("path") || "general"} — ${get("name") || "—"}`;
  const body = [
    `Name: ${get("name")}`,
    `Email: ${get("email")}`,
    `Organization: ${get("organization") || "—"}`,
    `Path: ${get("path") || "—"}`,
    `Geography: ${get("geography") || "—"}`,
    "",
    "Opportunity / need:",
    get("brief"),
    "",
    "Rights, evidence or constraints:",
    get("context") || "—",
  ].join("\n");
  return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function OpportunityForm() {
  const searchParams = useSearchParams();
  const requested = searchParams.get("path");
  const initialPath = formPaths.some(([value]) => value === requested) ? requested : "opportunity";
  const ref = searchParams.get("ref") ?? "";
  const [state, action, pending] = useActionState(submitBrief, initialState);
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
      <fieldset aria-describedby={errors.path ? "path-error" : undefined}>
        <legend className="eyebrow">Choose your path</legend>
        <div className="path-options">
          {formPaths.map(([value, label]) => (
            <label className="path-option" key={value}>
              <input name="path" type="radio" value={value} defaultChecked={initialPath === value} required />
              <span>{label}</span>
            </label>
          ))}
        </div>
        {errors.path && <p className="form-error" id="path-error">{errors.path}</p>}
      </fieldset>
      <input type="hidden" name="ref" value={ref} />
      <div className="form-honeypot" aria-hidden="true">
        <label>Website <input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <div className="form-grid">
        <label>
          <span>Name *</span>
          <input name="name" type="text" autoComplete="name" required maxLength={120} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} />
          {errors.name && <em className="form-error" id="name-error">{errors.name}</em>}
        </label>
        <label>
          <span>Email *</span>
          <input name="email" type="email" autoComplete="email" required maxLength={200} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} />
          {errors.email && <em className="form-error" id="email-error">{errors.email}</em>}
        </label>
        <label><span>Organization</span><input name="organization" type="text" autoComplete="organization" maxLength={200} /></label>
        <label><span>Geography</span><input name="geography" type="text" placeholder="Country or market" maxLength={120} /></label>
      </div>
      <label>
        <span>What is the opportunity or need? *</span>
        <textarea name="brief" rows={5} required maxLength={5000} aria-invalid={Boolean(errors.brief)} aria-describedby={errors.brief ? "brief-error" : undefined} placeholder="The asset, venture, capital mandate — or the work you want AI to help with." />
        {errors.brief && <em className="form-error" id="brief-error">{errors.brief}</em>}
      </label>
      <label>
        <span>What rights, evidence or constraints already exist?</span>
        <textarea name="context" rows={4} maxLength={5000} placeholder="Ownership, users, data, licences, partners, timing or budget." />
      </label>
      <label className="form-consent">
        <input name="consent" type="checkbox" value="yes" required aria-invalid={Boolean(errors.consent)} />
        <span>I agree that Realization may use these details to reply to me, as described in the <Link href="/privacy">privacy notice</Link>. *</span>
      </label>
      {errors.consent && <p className="form-error">{errors.consent}</p>}
      <div className="form-submit">
        <button className="button button--dark" type="submit" disabled={pending} data-umami-event="submit-brief">
          {pending ? "Sending…" : "Send the brief"} <ArrowRight aria-hidden="true" size={17} />
        </button>
        <p>We reply within two working days. Leave out sensitive personal or financial data.</p>
      </div>
      {state.message && (
        <div className="form-status" role={state.status === "error" ? "alert" : "status"}>
          <p>{state.message}</p>
          {state.status === "unavailable" && (
            <p className="form-status__fallback">
              <a className="button button--dark" href={mailto}>Open in your email app</a>
              <a className="text-link" href={whatsappUrl} rel="noopener">or message on WhatsApp</a>
            </p>
          )}
        </div>
      )}
    </form>
  );
}
