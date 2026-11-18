"use client";

import { ArrowRight, CircleAlert } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { startTransition, useActionState, useRef, useState, type FormEvent } from "react";
import { sendMessage, type MessageState } from "@/app/contact/actions";
import { contactEmail, whatsappUrl } from "@/content/site";

const initialState: MessageState = { status: "idle" };

/** A mailto: link with what the visitor typed, used when online sending is unavailable. */
function mailtoFrom(form: HTMLFormElement | null) {
  const data = form ? new FormData(form) : new FormData();
  const get = (name: string) => String(data.get(name) ?? "").trim();
  const subject = `Message from realization.world: ${get("name") || "—"}`;
  return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(get("message"))}`;
}

/** The short general route: name, email, message. The long brief stays on /bring-an-opportunity. */
export function ContactForm() {
  const ref = useSearchParams().get("ref") ?? "";
  const [state, action, pending] = useActionState(sendMessage, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [mailto, setMailto] = useState(`mailto:${contactEmail}`);
  const errors = state.fieldErrors ?? {};

  // Submit without React's automatic form reset, so an error never loses what was typed.
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
      </div>
      <label>
        <span>Message *</span>
        <textarea name="message" rows={5} required maxLength={5000} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "message-error" : undefined} />
        {errors.message && <em className="form-error" id="message-error">{errors.message}</em>}
      </label>
      <label className="form-consent">
        <input name="consent" type="checkbox" value="yes" required aria-invalid={Boolean(errors.consent)} />
        <span>I agree that Realization may use these details to reply to me, as described in the <Link href="/privacy">privacy notice</Link>. *</span>
      </label>
      {errors.consent && <p className="form-error">{errors.consent}</p>}
      <div className="form-submit">
        <button className="button button--dark" type="submit" disabled={pending} data-umami-event="send-message">
          {pending ? "Sending…" : "Send"} <ArrowRight aria-hidden="true" size={17} />
        </button>
        <p>Leave out sensitive personal or financial data.</p>
      </div>
      {state.message && (
        <div className="form-status" role={state.status === "error" ? "alert" : "status"}>
          <p className="form-status__head"><CircleAlert aria-hidden="true" size={18} /><strong>Not sent.</strong> {state.message}</p>
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
