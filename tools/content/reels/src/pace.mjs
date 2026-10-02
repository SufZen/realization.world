// Reading-time pacing for reels. Shared by the compositions (they take their durations from here) and by check.mjs
// (which audits a reel spec before anything renders). A scene is never timed by hand: it lasts as long as a relaxed
// viewer needs to read everything on it, then look at the drawing, then breathe. See docs/content-engine/quality.md.

export const FPS = 30;
export const BPM = 90;
export const BEAT = 20; // frames per beat at 90 BPM and 30 fps; scene lengths round up to whole beats
export const READ_CPS = 12; // characters per second for a relaxed phone reader, second-language readers included
export const ENTER = 0.6; // seconds an entrance takes before its text is readable
export const ORIENT = 0.6; // seconds to find the first line after a cut
export const TAIL = 0.8; // a breath after the last line is read, before the cut
export const XFADE = 12; // frames of cross-dissolve between scenes (added on top, so reading time is never eaten)
export const MIN_SCENE = 3; // seconds
export const MAX_WORDS = 18; // per scene, every word on screen counted, labels included
export const MAX_SCENES = 9;
export const MAX_SECONDS = 58; // leaves room under qa.mjs's 60 s for encoder and container rounding
export const MAX_LOOK = 3; // seconds of extra looking time a drawing may ask for
export const MAX_SFX_VOLUME = 0.25;

const clean = (t) => String(t).replace(/\s+/g, " ").trim();
export const chars = (t) => clean(t).length;
export const words = (t) => clean(t).split(" ").filter(Boolean).length;
export const readSeconds = (t) => Math.max(0.5, chars(t) / READ_CPS); // a two-character label is taken in at a glance

// spec: { id, music, scenes: [{ name, text: [string], cues?: [seconds], carry?: [string], look?: seconds, sfx?: { name, at } }] }
// Returns the spec with, per scene: at (cue frames), reveal, need (seconds), frames, start; and total frames.
export function plan(spec) {
  let start = 0;
  const n = spec.scenes.length;
  const scenes = spec.scenes.map((s, i) => {
    const cues = s.cues ?? s.text.map((_, k) => k * 0.8);
    const lastCue = Math.max(...cues);
    const last = s.text[cues.lastIndexOf(lastCue)];
    const reveal = lastCue + ENTER;
    const look = s.look ?? 0;
    const readAll = s.text.reduce((a, t) => a + readSeconds(t), 0);
    const need = Math.max(MIN_SCENE, ORIENT + readAll + look + TAIL, reveal + readSeconds(last) + look + TAIL);
    const body = Math.ceil((need * FPS) / BEAT) * BEAT;
    const frames = body + (i < n - 1 ? XFADE : 0);
    // `carry` lists words still on screen from the scene before: already read, so no reading time, but they count
    // towards the scene's word limit because the eye still has to sort them.
    const onScreen = [...s.text, ...(s.carry ?? [])];
    const out = { ...s, index: i, count: n, cues, at: cues.map((c) => Math.round(c * FPS)), reveal, look, need, body, frames, start, words: onScreen.reduce((a, t) => a + words(t), 0) };
    start += frames - (i < n - 1 ? XFADE : 0);
    return out;
  });
  return { ...spec, scenes, total: start };
}

// Hard errors stop the render; warnings are printed and recorded in qa.json.
export function audit(spec) {
  const p = plan(spec);
  const errors = [];
  const warnings = [];
  if (p.scenes.length > MAX_SCENES) errors.push(`${p.scenes.length} scenes; the limit is ${MAX_SCENES}. Cut an idea.`);
  const secs = p.total / FPS;
  if (secs > MAX_SECONDS) errors.push(`${secs.toFixed(1)} s long; the limit is ${MAX_SECONDS} s. Cut text or scenes, never speed.`);
  for (const s of p.scenes) {
    if (!s.text?.length) errors.push(`${s.name}: no text listed. List every word that appears on screen, labels included.`);
    if (s.cues.length !== s.text.length) errors.push(`${s.name}: ${s.text.length} texts but ${s.cues.length} cues.`);
    if (s.words > MAX_WORDS) errors.push(`${s.name}: ${s.words} words on screen; the limit is ${MAX_WORDS}. Split the scene or cut words.`);
    if (s.look > MAX_LOOK) errors.push(`${s.name}: look ${s.look} s; the limit is ${MAX_LOOK} s.`);
    if (s.reveal > 0.5 * (s.body / FPS)) warnings.push(`${s.name}: the last line lands at ${s.reveal.toFixed(1)} s of ${(s.body / FPS).toFixed(1)} s. Bring entrances forward so most of the scene is reading time.`);
    if (s.sfx && (s.sfx.volume ?? MAX_SFX_VOLUME) > MAX_SFX_VOLUME) errors.push(`${s.name}: sound effect volume above ${MAX_SFX_VOLUME}.`);
  }
  return { plan: p, errors, warnings, seconds: secs };
}

export function table(p) {
  const rows = p.scenes.map((s) => `${s.name.padEnd(22)} ${String(s.words).padStart(3)} words  ${(s.body / FPS).toFixed(1).padStart(5)} s  (needs ${s.need.toFixed(1)} s, last line in at ${s.reveal.toFixed(1)} s)`);
  return [...rows, `${"total".padEnd(22)} ${String(p.scenes.reduce((a, s) => a + s.words, 0)).padStart(3)} words  ${(p.total / FPS).toFixed(1).padStart(5)} s`].join("\n");
}
