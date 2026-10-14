"use client";

import { ArrowRight } from "lucide-react";
import { startTransition, useActionState, useRef, useState, type FormEvent } from "react";
import { saveWebinarDetails, type DetailsState } from "@/app/webinar/actions";
import { whatsappUrl } from "@/content/site";
import { webinarMarkets, webinarRoles } from "@/lib/webinar";

const initialState: DetailsState = { status: "idle" };

// Example problems for the "pain" field: the same four as its placeholder.
const examples = ["תשלומים לקבלנים", "השוואת הצעות מחיר", "מענה ללידים", "דוחות למשקיעים"];

/**
 * Step 2 of the webinar registration, on the thank-you page: optional questions added to the
 * registration step 1 already saved. `token` ties them to it (lib/webinar-token.ts).
 */
export function WebinarDetailsForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(saveWebinarDetails, initialState);
  const painRef = useRef<HTMLTextAreaElement>(null);
  const [picked, setPicked] = useState<string[]>([]);

  function addExample(example: string) {
    const pain = painRef.current;
    if (!pain) return;
    const current = pain.value.trim();
    if (!current.includes(example)) pain.value = current ? `${current}, ${example}` : example;
    setPicked((list) => (list.includes(example) ? list : [...list, example]));
    pain.focus();
  }

  // Without React's automatic reset, so a failed save keeps the answers on screen.
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => action(data));
  }

  if (state.status === "saved") {
    return (
      <div className="opportunity-form webinar-form wm-details" role="status">
        <p className="eyebrow">עוד רגע אחד</p>
        <h2 className="webinar-form__title">תודה, קיבלנו. נתראה בשלישי, 20.10 ב־20:00.</h2>
      </div>
    );
  }

  return (
    <form id="details" className="opportunity-form webinar-form wm-details" action={action} onSubmit={submit} noValidate>
      <div>
        <p className="eyebrow">עוד רגע אחד</p>
        <h2 className="webinar-form__title">ספרו לנו קצת עליכם</h2>
        <p>לא חובה. זה עוזר לנו לבחור על מה להתעכב בשידור.</p>
      </div>
      <input type="hidden" name="t" value={token} />
      <fieldset>
        <legend className="eyebrow">מה הכי מתאר אתכם?</legend>
        <div className="path-options">
          {webinarRoles.map(([value, label]) => (
            <label className="path-option" key={value}>
              <input name="role" type="radio" value={value} />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="eyebrow">איפה אתם פעילים?</legend>
        <div className="path-options path-options--three">
          {webinarMarkets.map(([value, label]) => (
            <label className="path-option" key={value}>
              <input name="market" type="radio" value={value} />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="form-grid">
        <label>
          <span>חברה / משרד</span>
          <input id="webinar-company" name="company" type="text" autoComplete="organization" maxLength={200} />
        </label>
      </div>
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
        <span>אפשר לנתח את הבעיה שלי בשידור, בלי שם</span>
      </label>
      <div className="form-submit">
        <button className="button button--dark" type="submit" disabled={pending} aria-busy={pending || undefined} data-umami-event="webinar-details">
          {pending ? "שולחים…" : "שליחה"} <ArrowRight className="r-flip-x" aria-hidden="true" size={17} />
        </button>
      </div>
      {state.status === "error" && state.message && (
        <div className="form-status" role="alert">
          <p>{state.message}</p>
          <p className="form-status__fallback">
            <a className="text-link" href={whatsappUrl} rel="noopener">וואטסאפ</a>
          </p>
        </div>
      )}
    </form>
  );
}
