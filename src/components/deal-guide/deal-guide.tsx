"use client";

import { ArrowRight, Check as CheckIcon, Copy, MessageCircle, Printer, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  checks,
  forMarket,
  markets,
  resultIntro,
  roles,
  whoLabels,
  yieldExample,
  type Answer,
  type Market,
  type Role,
  type Who,
  type YieldExample,
} from "./content";
import styles from "./deal-guide.module.css";

declare global {
  interface Window {
    umami?: { track: (event: string, data?: Record<string, string | number>) => void };
  }
}

/** Umami custom events; a no-op where the tracker isn't loaded (dev, previews, blockers). */
const track = (event: string, data?: Record<string, string | number>) => {
  try {
    window.umami?.track(event, data);
  } catch {}
};

type WebinarInfo = { endsAt: number; when: string; href: string };

// Steps: 0 intro, 1 role, 2 market, 3..9 the seven checks, 10 the checklist.
const FIRST_CHECK = 3;
const RESULT = FIRST_CHECK + checks.length;
const GUIDE_URL = "https://realization.world/deal-check-guide";

export function DealGuide({ webinar }: { webinar: WebinarInfo }) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [role, setRole] = useState<Role | null>(null);
  const [market, setMarket] = useState<Market | null>(null);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [copied, setCopied] = useState(false);
  // After the webinar ends, the closing call to action points to the deal-check service instead.
  const [webinarAhead] = useState(() => Date.now() < webinar.endsAt);
  const rootRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  const go = (next: number) => {
    moved.current = true;
    setDirection(next > step ? "forward" : "back");
    setStep(next);
    if (next >= FIRST_CHECK && next < RESULT) track("guide-step", { step: next - FIRST_CHECK + 1, check: checks[next - FIRST_CHECK].id });
    if (next === RESULT) {
      const open = checks.filter((c) => answers[c.id] === "open" || !answers[c.id]).length;
      track("guide-complete", { role: role ?? "none", market: market ?? "none", open });
    }
  };

  // After a step change: bring the guide's top into view (phones) and move focus to the new heading.
  useEffect(() => {
    if (!moved.current) return;
    const root = rootRef.current;
    if (root && root.getBoundingClientRect().top < 0) {
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      root.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
    }
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  const pickRole = (value: Role) => {
    setRole(value);
    track("guide-role", { role: value });
    window.setTimeout(() => go(2), 260);
  };
  const pickMarket = (value: Market) => {
    setMarket(value);
    track("guide-market", { market: value });
    window.setTimeout(() => go(FIRST_CHECK), 260);
  };
  const answer = (id: string, value: Answer) => {
    setAnswers((current) => ({ ...current, [id]: value }));
    track("guide-answer", { check: id, answer: value });
  };
  const restart = () => {
    setAnswers({});
    setRole(null);
    setMarket(null);
    setCopied(false);
    track("guide-restart");
    go(0);
  };

  const m: Market = market ?? "other";
  const r: Role = role ?? "other";

  // The personal checklist: unanswered checks count as open.
  const checklist = useMemo(() => {
    const groups = new Map<Who, { id: string; title: string; ask: string }[]>();
    const done: string[] = [];
    for (const check of checks) {
      const value = answers[check.id] ?? "open";
      if (value === "done") done.push(check.title);
      if (value !== "open") continue;
      const list = groups.get(check.who) ?? [];
      list.push({ id: check.id, title: check.title, ask: forMarket(check.ask, m)! });
      groups.set(check.who, list);
    }
    return { groups: [...groups.entries()], done, openCount: [...groups.values()].reduce((sum, list) => sum + list.length, 0) };
  }, [answers, m]);

  const checklistText = () => {
    const lines = ["איך לבחון עסקה לפני שמתקדמים: מה לשאול", ""];
    for (const [who, items] of checklist.groups) {
      lines.push(`${whoLabels[who]}:`);
      for (const item of items) lines.push(`• ${item.ask}`);
      lines.push("");
    }
    if (checklist.done.length) lines.push(`כבר בידיים: ${checklist.done.join(", ")}`, "");
    lines.push("המדריך לא מחליף שמאי, עורך דין או רואה חשבון.", `המדריך המלא: ${GUIDE_URL}`);
    return lines.join("\n");
  };

  const copyList = async () => {
    try {
      await navigator.clipboard.writeText(checklistText());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {}
    track("guide-copy");
  };

  const checkIndex = step - FIRST_CHECK;
  const inChecks = checkIndex >= 0 && checkIndex < checks.length;

  return (
    <div className={styles.guide} ref={rootRef} data-step={step}>
      <Progress step={step} />

      <div className={styles.stage} key={step} data-direction={direction}>
        {step === 0 && (
          <section className={styles.screen}>
            <p className={styles.kicker}>מדריך אינטראקטיבי · כ־5 דקות · בלי הרשמה</p>
            <h1 className={styles.title} ref={headingRef} tabIndex={-1}>
              <span>איך לבחון עסקה</span> <span>לפני שמתקדמים</span>
            </h1>
            <p className={styles.lede}>
              שבע בדיקות שאנחנו עושים על כל עסקה, לפני שפונים לשמאי, לעורך דין או למימון. בדיקה אחת בכל מסך, ובסוף: רשימה אישית של מה לשאול.
            </p>
            <YieldBars example={yieldExample("pt")} mode="leverage" compact />
            <div className={styles.actions}>
              <button type="button" className="button button--primary" onClick={() => { track("guide-start"); go(1); }}>
                <span>מתחילים</span>
                <ArrowRight className="r-flip-x" aria-hidden="true" size={17} strokeWidth={2.2} />
              </button>
            </div>
            <p className={styles.byline}>אסף איזנקוט, Realization · יבגני גורקוב, Montreza</p>
          </section>
        )}

        {step === 1 && (
          <ChoiceScreen
            headingRef={headingRef}
            eyebrow="שתי שאלות קצרות, כדי להתאים את הדוגמאות"
            title="מה אתם עושים בעסקה?"
            options={roles}
            value={role}
            onPick={pickRole}
          />
        )}

        {step === 2 && (
          <ChoiceScreen
            headingRef={headingRef}
            eyebrow="ועוד שאלה אחת"
            title="איפה נמצאת העסקה?"
            options={markets}
            value={market}
            onPick={pickMarket}
          />
        )}

        {inChecks && (() => {
          const check = checks[checkIndex];
          const example = forMarket(check.example, m);
          const local = forMarket(check.local, m);
          const tip = check.roleTip?.[r];
          const current = answers[check.id];
          return (
            <section className={styles.screen} aria-labelledby={`check-${check.id}`}>
              <div className={styles.checkHead}>
                <span className={styles.num} aria-hidden="true">{checkIndex + 1}</span>
                <div>
                  <h2 className={styles.checkTitle} id={`check-${check.id}`} ref={headingRef} tabIndex={-1}>{check.title}</h2>
                </div>
              </div>
              <p className={styles.body}>{check.body}</p>
              {check.visual && <YieldBars example={yieldExample(m)} mode={check.visual} />}
              {example && (
                <div className={styles.example}>
                  <p className={styles.label}>{check.exampleLabel}</p>
                  <p>{example}</p>
                </div>
              )}
              {local && <p className={styles.local}>{local}</p>}
              {check.points && (
                <div className={styles.points}>
                  <p className={styles.label}>{check.pointsLabel}</p>
                  <ul>
                    {check.points.map((point) => <li key={point}>{point}</li>)}
                  </ul>
                </div>
              )}
              {tip && <p className={styles.tip}>{tip}</p>}
              <details className={styles.trap} onToggle={(event) => event.currentTarget.open && track("guide-trap", { check: check.id })}>
                <summary>המלכודת הנפוצה</summary>
                <p>{check.trap}</p>
              </details>
              <div className={styles.ask}>
                <p className={styles.label}>השאלה לשאול · {whoLabels[check.who]}</p>
                <p className={styles.askText}>{forMarket(check.ask, m)}</p>
              </div>
              <fieldset className={styles.choice}>
                <legend>{check.prompt}</legend>
                <div className={styles.choiceRow}>
                  {(["done", "open", "na"] as const).map((value) => {
                    const label = check.options[value];
                    if (!label) return null;
                    return (
                      <button
                        key={value}
                        type="button"
                        className={styles.pill}
                        aria-pressed={current === value}
                        onClick={() => answer(check.id, value)}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
                <p className={styles.choiceNote} aria-live="polite">
                  {current === "open" ? "נכנס לרשימה שלכם." : current === "done" ? "מעולה. נסמן את זה כבדיקה שכבר בידיים." : current === "na" ? "נדלג על זה ברשימה." : " "}
                </p>
              </fieldset>
              <Nav
                onBack={() => go(step - 1)}
                onNext={() => go(step + 1)}
                nextLabel={checkIndex === checks.length - 1 ? "לרשימה שלי" : "לבדיקה הבאה"}
                strong={Boolean(current)}
              />
            </section>
          );
        })()}

        {step === RESULT && (
          <section className={styles.screen}>
            <p className={styles.kicker}>הרשימה שלכם</p>
            <h2 className={styles.title} ref={headingRef} tabIndex={-1}>מה לשאול לפני שמתקדמים</h2>
            <p className={styles.lede}>{resultIntro[r]}</p>
            <p className={styles.tally}>
              <strong>{checklist.openCount}</strong> שאלות פתוחות · <strong>{checklist.done.length}</strong> בדיקות כבר בידיים
            </p>

            {checklist.groups.length > 0 ? (
              <ol className={styles.groups}>
                {checklist.groups.map(([who, items], groupIndex) => (
                  <li key={who} className={styles.group} style={{ "--i": groupIndex } as React.CSSProperties}>
                    <p className={styles.groupWho}>{whoLabels[who]}</p>
                    <ul>
                      {items.map((item) => (
                        <li key={item.id}>
                          <span className={styles.box} aria-hidden="true" />
                          <span><span className={styles.itemTitle}>{item.title}.</span> {item.ask}</span>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            ) : (
              <p className={styles.allDone}>
                כל הבדיקות עם תשובה. נשארת השאלה החשובה מכולן: האם העסקה מתאימה לכם, למטרה, לזמן ולהון שלכם. את זה אף רשימה לא עונה.
              </p>
            )}

            {checklist.done.length > 0 && (
              <p className={styles.doneList}>
                <CheckIcon aria-hidden="true" size={16} strokeWidth={2.6} /> כבר בידיים: {checklist.done.join(" · ")}
              </p>
            )}

            <div className={styles.tools}>
              <button type="button" className={styles.tool} onClick={copyList}>
                <Copy aria-hidden="true" size={16} /> {copied ? "הועתק" : "העתקת הרשימה"}
              </button>
              <a
                className={styles.tool}
                href={`https://wa.me/?text=${encodeURIComponent(checklistText())}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("guide-whatsapp")}
              >
                <MessageCircle aria-hidden="true" size={16} /> לשלוח לעצמי בוואטסאפ
              </a>
              <button type="button" className={styles.tool} onClick={() => { track("guide-print"); window.print(); }}>
                <Printer aria-hidden="true" size={16} /> הדפסה או PDF
              </button>
              <button type="button" className={styles.tool} onClick={restart}>
                <RotateCcw aria-hidden="true" size={16} /> מהתחלה
              </button>
            </div>

            {webinarAhead ? (
              <div className={styles.cta}>
                <p className={styles.ctaWhen}>וובינר חינמי · {webinar.when}</p>
                <p className={styles.ctaText}>
                  ככה אנחנו בודקים עסקאות, ידנית, כבר שנים. ב־20.10 בוובינר נראה איך AI עושה את שבע הבדיקות האלה מלינק אחד, בזמן אמת, ואיפה עדיין צריך אדם.
                </p>
                <div className={styles.ctaRow}>
                  <Link className="button button--primary" href={webinar.href} data-umami-event="guide-cta-webinar">
                    <span>שמרו לי מקום</span>
                    <ArrowRight className="r-flip-x" aria-hidden="true" size={17} strokeWidth={2.2} />
                  </Link>
                  <p className={styles.ctaNote}>חינם, ובסוף לא נמכור לכם קורס.</p>
                </div>
              </div>
            ) : (
              <div className={styles.cta}>
                <p className={styles.ctaText}>יש עסקה על השולחן? שלחו לנו אותה, ונעבור עליה איתכם.</p>
                <div className={styles.ctaRow}>
                  <Link className="button button--primary" href="/services/real-estate" data-umami-event="guide-cta-deal-check">
                    <span>בדיקת עסקה</span>
                    <ArrowRight className="r-flip-x" aria-hidden="true" size={17} strokeWidth={2.2} />
                  </Link>
                </div>
              </div>
            )}
            <div className={styles.disclaimer}>
              <p className={styles.label}>מה המדריך הזה לא עושה</p>
              <p>
                הוא לא מחליף שמאי, עורך דין או רואה חשבון. הוא נותן את השאלות הנכונות לפני שפונים אליהם, כך שהפגישה איתם קצרה יותר ומדויקת יותר. המספרים בדוגמאות הם להמחשה בלבד.
              </p>
            </div>

            <p className={styles.byline}>אסף איזנקוט, Realization · יבגני גורקוב, Montreza</p>
          </section>
        )}
      </div>
    </div>
  );
}

/** Seven segments for the seven checks; the two opening questions fill nothing. */
function Progress({ step }: { step: number }) {
  if (step === 0) return <div className={styles.progressSpacer} aria-hidden="true" />;
  const current = step - FIRST_CHECK; // -1 or -2 during the opening questions; checks.length on the checklist
  const label = step < FIRST_CHECK ? "שאלות פתיחה" : step === RESULT ? "סיימתם את שבע הבדיקות" : `בדיקה ${current + 1} מתוך ${checks.length}`;
  return (
    <div className={styles.progress}>
      <ol className={styles.segments} aria-hidden="true">
        {checks.map((check, index) => (
          <li key={check.id} data-state={index < current ? "done" : index === current ? "current" : "todo"} />
        ))}
      </ol>
      <p className={styles.progressLabel} aria-live="polite">{label}</p>
    </div>
  );
}

function ChoiceScreen<T extends string>({
  headingRef,
  eyebrow,
  title,
  options,
  value,
  onPick,
}: {
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  eyebrow: string;
  title: string;
  options: { id: T; label: string }[];
  value: T | null;
  onPick: (value: T) => void;
}) {
  return (
    <section className={styles.screen}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 className={styles.title} ref={headingRef} tabIndex={-1}>{title}</h2>
      <div className={styles.bigChoices}>
        {options.map((option, index) => (
          <button
            key={option.id}
            type="button"
            className={styles.bigChoice}
            aria-pressed={value === option.id}
            onClick={() => onPick(option.id)}
            style={{ "--i": index } as React.CSSProperties}
          >
            {option.label}
          </button>
        ))}
      </div>
    </section>
  );
}

function Nav({ onBack, onNext, nextLabel, strong }: { onBack: () => void; onNext: () => void; nextLabel: string; strong: boolean }) {
  return (
    <div className={styles.nav}>
      <button type="button" className={`button ${strong ? "button--primary" : "button--outline"}`} onClick={onNext}>
        <span>{nextLabel}</span>
        <ArrowRight className="r-flip-x" aria-hidden="true" size={17} strokeWidth={2.2} />
      </button>
      <button type="button" className={styles.back} onClick={onBack}>חזרה</button>
    </div>
  );
}

/** The listing's yield against what's left: bars grow in once, in order. Example numbers. */
function YieldBars({ example, mode, compact = false }: { example: YieldExample; mode: "net" | "leverage"; compact?: boolean }) {
  const rows = [
    { label: "במודעה", value: example.gross, tone: "muted" },
    { label: "נטו, אחרי עלויות", value: example.net, tone: mode === "net" ? "accent" : "muted" },
    ...(mode === "leverage" ? [{ label: "על הכסף שלכם, עם הלוואה", value: example.equity, tone: "accent" }] : []),
  ];
  return (
    <figure className={`${styles.bars} ${compact ? styles.barsCompact : ""}`}>
      <ul>
        {rows.map((row, index) => (
          <li key={row.label} data-tone={row.tone} style={{ "--w": row.value / example.gross, "--i": index } as React.CSSProperties}>
            <span className={styles.barLabel}>{row.label}</span>
            <span className={styles.barTrack}><span className={styles.barFill} /></span>
            <span className={styles.barValue} dir="ltr">{row.value.toFixed(1)}%</span>
          </li>
        ))}
      </ul>
      <figcaption>מספרים להמחשה{compact ? " · הדוגמה המלאה בפנים" : ""}</figcaption>
    </figure>
  );
}
