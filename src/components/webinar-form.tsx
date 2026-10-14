"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { startTransition, useActionState, useRef, useState, type FocusEvent, type FormEvent, type ReactNode } from "react";
import { registerWebinar, type RegistrationState } from "@/app/webinar/actions";
import { contactEmail, whatsappUrl } from "@/content/site";
import { webinarMarkets, webinarRoles } from "@/lib/webinar";

const initialState: RegistrationState = { status: "idle" };

// Same rules and wording as validateRegistration in lib/webinar.ts; the server stays the authority.
// The email pattern is lib/brief.ts's EMAIL, copied so the brief helpers stay out of the browser bundle.
const EMAIL = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const checks = {
  name: (value: string) => (value ? "" : "צריך למלא שם מלא."),
  email: (value: string) => (EMAIL.test(value) ? "" : "צריך כתובת מייל תקינה, כדי שנוכל לשלוח את הקישור."),
  phone: (value: string) => (!value || /^[+\d][\d\s()-]{6,}$/.test(value) ? "" : "מספר הטלפון לא נראה תקין. אפשר גם להשאיר את השדה ריק."),
};
type CheckedField = keyof typeof checks;

// Example problems for the "pain" field: the same four as its placeholder.
const examples = ["תשלומים לקבלנים", "השוואת הצעות מחיר", "מענה ללידים", "דוחות למשקיעים"];

/** Counts the five required answers, for the progress line. */
function requiredDone(form: HTMLFormElement | null) {
  if (!form) return 0;
  const data = new FormData(form);
  const get = (name: string) => String(data.get(name) ?? "").trim();
  return [get("name") !== "", !checks.email(get("email")), get("role") !== "", get("market") !== "", data.get("consent") === "yes"].filter(Boolean).length;
}

/** An input with a small check mark that draws in once its value is valid. */
function Checked({ valid, children }: { valid: boolean; children: ReactNode }) {
  return (
    <span className={`wm-field${valid ? " is-valid" : ""}`}>
      {children}
      <svg className="wm-field__ok" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10.5l4 4 8-9" /></svg>
    </span>
  );
}

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
    "הבעיה שהכי חשוב לכם לפתור:",
    get("pain") || "—",
  ].join("\n");
  return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function WebinarForm() {
  const params = useSearchParams();
  const ref = params.get("ref") ?? "";
  // Meta ad click id from the landing URL (not a cookie); the server turns it into fbc for ad attribution.
  const fbclid = params.get("fbclid") ?? "";
  const [state, action, pending] = useActionState(registerWebinar, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const painRef = useRef<HTMLTextAreaElement>(null);
  const [mailto, setMailto] = useState(`mailto:${contactEmail}`);
  const [done, setDone] = useState(0);
  const [valid, setValid] = useState<Partial<Record<CheckedField, boolean>>>({});
  // Messages from leaving a field. "" means checked and fine, which also clears an older server message.
  const [inline, setInline] = useState<Partial<Record<string, string>>>({});
  const [picked, setPicked] = useState<string[]>([]);
  const errors: Partial<Record<string, string>> = { ...state.fieldErrors };
  for (const [name, message] of Object.entries(inline)) errors[name] = message || undefined;

  function check(name: CheckedField, raw: string, leaving: boolean) {
    const value = raw.trim();
    const message = checks[name](value);
    setValid((current) => ({ ...current, [name]: !message && value !== "" }));
    // While typing, only update a message that is already showing: no nagging before the field is left.
    if ((leaving && value) || errors[name]) setInline((current) => ({ ...current, [name]: message }));
  }
  const checkEvents = (name: CheckedField) => ({
    onBlur: (event: FocusEvent<HTMLInputElement>) => check(name, event.currentTarget.value, true),
    onInput: (event: FormEvent<HTMLInputElement>) => check(name, event.currentTarget.value, false),
  });

  function addExample(example: string) {
    const pain = painRef.current;
    if (!pain) return;
    const current = pain.value.trim();
    if (!current.includes(example)) pain.value = current ? `${current}, ${example}` : example;
    setPicked((list) => (list.includes(example) ? list : [...list, example]));
    setMailto(mailtoFrom(formRef.current));
    pain.focus();
  }

  // Submit through the action without React's automatic form reset,
  // so a validation error or fallback never loses what the visitor typed.
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setMailto(mailtoFrom(event.currentTarget));
    setInline({});
    startTransition(() => action(data));
  }

  function changed() {
    setMailto(mailtoFrom(formRef.current));
    setDone(requiredDone(formRef.current));
    // A choice that is now made clears its message from the last submit.
    const data = new FormData(formRef.current ?? undefined);
    const answered = (["role", "market", "consent"] as const).filter((name) => data.get(name) && errors[name]);
    if (answered.length) setInline((current) => ({ ...current, ...Object.fromEntries(answered.map((name) => [name, ""])) }));
  }

  return (
    <form id="register" className="opportunity-form webinar-form" action={action} onSubmit={submit} ref={formRef} onChange={changed} noValidate>
      <div>
        <p className="eyebrow">הרשמה · חינם</p>
        <h2 className="webinar-form__title">שמרו לי מקום</h2>
      </div>
      <div className={`wm-progress${done === 5 ? " is-done" : ""}`} role="progressbar" aria-label="שדות חובה שמולאו" aria-valuemin={0} aria-valuemax={5} aria-valuenow={done} aria-valuetext={`${done} מתוך 5`}>
        <span className="wm-progress__track"><span className="wm-progress__fill" style={{ transform: `scaleX(${done / 5})` }} /></span>
        <span className="wm-progress__text" aria-hidden="true">{done} מתוך 5</span>
      </div>
      <input type="hidden" name="ref" value={ref} />
      <input type="hidden" name="fbclid" value={fbclid} />
      <div className="form-honeypot" aria-hidden="true">
        <label>Website <input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <div className="form-grid">
        <label>
          <span>שם מלא *</span>
          <Checked valid={Boolean(valid.name)}>
            <input id="webinar-name" name="name" type="text" autoComplete="name" required maxLength={120} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} {...checkEvents("name")} />
          </Checked>
          {errors.name && <em className="form-error" id="name-error">{errors.name}</em>}
        </label>
        <label>
          <span>מייל *</span>
          <Checked valid={Boolean(valid.email)}>
            <input id="webinar-email" name="email" type="email" dir="ltr" autoComplete="email" required maxLength={200} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} {...checkEvents("email")} />
          </Checked>
          {errors.email && <em className="form-error" id="email-error">{errors.email}</em>}
        </label>
        <label>
          <span>וואטסאפ (לתזכורת)</span>
          <Checked valid={Boolean(valid.phone)}>
            <input id="webinar-phone" name="phone" type="tel" dir="ltr" autoComplete="tel" maxLength={40} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "phone-error" : undefined} {...checkEvents("phone")} />
          </Checked>
          {errors.phone && <em className="form-error" id="phone-error">{errors.phone}</em>}
        </label>
        <label>
          <span>חברה / משרד</span>
          <input id="webinar-company" name="company" type="text" autoComplete="organization" maxLength={200} />
        </label>
      </div>
      <fieldset aria-describedby={errors.role ? "role-error" : undefined}>
        <legend className="eyebrow">מה הכי מתאר אתכם? *</legend>
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
      <div className="wm-pain">
        <label>
          <span>איזו בעיה הייתם רוצים לפתור? אולי ננתח אותה בשידור.</span>
          <textarea id="webinar-pain" name="pain" rows={4} maxLength={2000} placeholder="למשל: תשלומים לקבלנים, השוואת הצעות מחיר, מענה ללידים, דוחות למשקיעים." ref={painRef} />
        </label>
        <div className="wm-chips" role="group" aria-label="דוגמאות לבעיה">
          <span aria-hidden="true">למשל:</span>
          {examples.map((example) => (
            <button className="wm-chip" type="button" key={example} aria-pressed={picked.includes(example)} onClick={() => addExample(example)}>{example}</button>
          ))}
        </div>
      </div>
      <label className="form-consent">
        <input id="webinar-live-audit" name="liveAudit" type="checkbox" value="yes" />
        <span>אשמח שתנתחו את הבעיה שלנו בשידור (בתיאום מראש).</span>
      </label>
      <label className="form-consent">
        <input id="webinar-consent" name="consent" type="checkbox" value="yes" required aria-invalid={Boolean(errors.consent)} />
        <span>אני מאשר/ת ש־Realization ו־Montreza, שמארחות יחד את הוובינר, ישתמשו בפרטים שלי כדי לשלוח לי את הקישור, את התזכורות, את ההקלטה ועדכון אחרי הוובינר, בהתאם ל<Link href="/privacy">מדיניות הפרטיות</Link>. *</span>
      </label>
      {errors.consent && <p className="form-error">{errors.consent}</p>}
      <div className="form-submit">
        <button className="button button--dark" type="submit" disabled={pending} aria-busy={pending || undefined} data-umami-event="webinar-register">
          {pending ? "שולחים…" : "הרשמה לוובינר"} <ArrowRight className="r-flip-x" aria-hidden="true" size={17} />
        </button>
        <p>הקישור לשידור יישלח במייל. בלי ספאם, ואפשר לבטל את ההרשמה בכל רגע.</p>
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
