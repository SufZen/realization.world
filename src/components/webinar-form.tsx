"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { startTransition, useActionState, useRef, useState, type FormEvent } from "react";
import { registerWebinar, type RegistrationState } from "@/app/webinar/actions";
import { contactEmail, whatsappUrl } from "@/content/site";
import { webinarMarkets, webinarRoles } from "@/lib/webinar";

const initialState: RegistrationState = { status: "idle" };

/** Builds a mailto: link from the current form values, used when online registration is unavailable. */
function mailtoFrom(form: HTMLFormElement | null) {
  const data = form ? new FormData(form) : new FormData();
  const get = (name: string) => String(data.get(name) ?? "").trim();
  const subject = `Webinar registration — ${get("name") || "—"}`;
  const body = [
    `שם: ${get("name")}`,
    `מייל: ${get("email")}`,
    `טלפון: ${get("phone") || "—"}`,
    `חברה: ${get("company") || "—"}`,
    `תפקיד: ${get("role") || "—"}`,
    `פעילים: ${get("market") || "—"}`,
    "",
    "הבעיה שהכי הייתם רוצים לפתור:",
    get("pain") || "—",
  ].join("\n");
  return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function WebinarForm() {
  const ref = useSearchParams().get("ref") ?? "";
  const [state, action, pending] = useActionState(registerWebinar, initialState);
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
    <form id="register" className="opportunity-form webinar-form" action={action} onSubmit={submit} ref={formRef} onChange={() => setMailto(mailtoFrom(formRef.current))} noValidate>
      <div>
        <p className="eyebrow">הרשמה · חינם</p>
        <h2 className="webinar-form__title">שמרו לי מקום</h2>
      </div>
      <input type="hidden" name="ref" value={ref} />
      <div className="form-honeypot" aria-hidden="true">
        <label>Website <input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <div className="form-grid">
        <label>
          <span>שם מלא *</span>
          <input id="webinar-name" name="name" type="text" autoComplete="name" required maxLength={120} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} />
          {errors.name && <em className="form-error" id="name-error">{errors.name}</em>}
        </label>
        <label>
          <span>מייל *</span>
          <input id="webinar-email" name="email" type="email" dir="ltr" autoComplete="email" required maxLength={200} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} />
          {errors.email && <em className="form-error" id="email-error">{errors.email}</em>}
        </label>
        <label>
          <span>וואטסאפ (לתזכורת)</span>
          <input id="webinar-phone" name="phone" type="tel" dir="ltr" autoComplete="tel" maxLength={40} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "phone-error" : undefined} />
          {errors.phone && <em className="form-error" id="phone-error">{errors.phone}</em>}
        </label>
        <label>
          <span>חברה / משרד</span>
          <input id="webinar-company" name="company" type="text" autoComplete="organization" maxLength={200} />
        </label>
      </div>
      <fieldset aria-describedby={errors.role ? "role-error" : undefined}>
        <legend className="eyebrow">מה הכי מתאר אותך? *</legend>
        <div className="path-options">
          {webinarRoles.map(([value, label]) => (
            <label className="path-option" key={value}>
              <input name="role" type="radio" value={value} required />
              <span>{label}</span>
            </label>
          ))}
        </div>
        {errors.role && <p className="form-error" id="role-error">{errors.role}</p>}
      </fieldset>
      <fieldset aria-describedby={errors.market ? "market-error" : undefined}>
        <legend className="eyebrow">איפה אתם פעילים? *</legend>
        <div className="path-options path-options--three">
          {webinarMarkets.map(([value, label]) => (
            <label className="path-option" key={value}>
              <input name="market" type="radio" value={value} required />
              <span>{label}</span>
            </label>
          ))}
        </div>
        {errors.market && <p className="form-error" id="market-error">{errors.market}</p>}
      </fieldset>
      <label>
        <span>איזו בעיה הכי הייתם רוצים לפתור? אחת מהן תעלה למסך.</span>
        <textarea id="webinar-pain" name="pain" rows={4} maxLength={2000} placeholder="לדוגמה: תשלומים לקבלנים, השוואת הצעות מחיר, מענה ללידים, דוחות למשקיעים." />
      </label>
      <label className="form-consent">
        <input id="webinar-live-audit" name="liveAudit" type="checkbox" value="yes" />
        <span>אשמח שהבעיה שלנו תנותח בשידור כמיני־אודיט (נתאם איתך מראש).</span>
      </label>
      <label className="form-consent">
        <input id="webinar-consent" name="consent" type="checkbox" value="yes" required aria-invalid={Boolean(errors.consent)} />
        <span>אני מאשר/ת ש־Realization ויבגני גורקוב, שמארחים יחד את הוובינר, ישתמשו בפרטים כדי לשלוח לי את הלינק, תזכורות, ההקלטה ועדכון אחרי הוובינר, לפי <Link href="/privacy">מדיניות הפרטיות</Link>. *</span>
      </label>
      {errors.consent && <p className="form-error">{errors.consent}</p>}
      <div className="form-submit">
        <button className="button button--dark" type="submit" disabled={pending} data-umami-event="webinar-register">
          {pending ? "שולחים…" : "הרשמה לוובינר"} <ArrowRight className="r-flip-x" aria-hidden="true" size={17} />
        </button>
        <p>הלינק ל־Google Meet יגיע למייל. אין ספאם, ואפשר להסיר בכל רגע.</p>
      </div>
      {state.message && (
        <div className="form-status" role={state.status === "error" ? "alert" : "status"}>
          <p>{state.message}</p>
          {state.status === "unavailable" && (
            <p className="form-status__fallback">
              <a className="button button--dark" href={mailto}>שליחה במייל</a>
              <a className="text-link" href={whatsappUrl} rel="noopener">או הודעה בוואטסאפ</a>
            </p>
          )}
        </div>
      )}
    </form>
  );
}
