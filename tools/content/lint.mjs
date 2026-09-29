#!/usr/bin/env node
// Content engine — check drafts against the voice guide and the Venation carousel spec before they reach the desk.
//
//   node tools/content/lint.mjs <drafts-dir> [--against <previous-drafts-dir>]
//
// Errors (exit code 1): never-use words, X posts over 280 characters, a carousel or diagram that breaks the
// renderer's limits, and (with --against) numbers that did not exist in the previous version of a draft.
// Warnings: LinkedIn length and rhythm, script length, too many question or sign-off closings in the wave.
// See docs/content-engine/voice.md and docs/content-engine/visual-language.md.

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const NEVER = [
  /\bhustle/i, /\bgrind\b/i, /\bcrush(ing)? it\b/i, /\bkilling it\b/i, /\bleverag/i, /\boptimi[sz]/i, /\bscalab/i, /\bsynerg/i,
  /\bend-to-end\b/i, /\bparadigm shift/i, /\bdisrupti/i, /\bseamless/i, /\bempower/i, /\bstreamlin/i, /\bunlock/i,
  /\bgame[- ]chang/i, /\brevolutionar/i, /\bamazing deal/i, /\bincredible opportunit/i, /\bdon'?t miss out/i, /\b10x\b/i,
  /\bnobody tells you/i, /\blimited time/i, /\bact now/i, /\blast chance/i, /\bspots left/i, /\boffer expires/i,
  /\bnumber one\b/i, /\bleading expert/i, /\btop-tier/i, /\bguru/i, /\bthought leader/i, /\bbest-in-class/i, /\bworld-class/i,
  /\bcutting-edge/i, /\bstate-of-the-art/i, /\bmultifaceted/i, /\bdetrimental/i, /\bvibrant/i, /\bthrive/i, /\bdelve/i,
  /\bthe real work\b/i, /\b(my|our) rule:/i,
];
const LIMITS = {
  carousel: { eyebrow: 28, hook: 60, voice: 90, rule: 120, invite: 90, quote: 140, cover: 36 },
  beat: { head: 55, body: 190, voice: 80 },
  diagram: { kicker: 28, title: 55, caption: 110, source: 50 },
  compare: { title: 26, label: 22, note: 32 },
  flight: { label: 16, note: 24 },
  cells: { label: 20, note: 26 },
  plan: { label: 14, note: 30, dimLabel: 18, dimLabelV: 12 },
  scale: { label: 12, note: 18, display: 8, unit: 30 },
  stack: { label: 20, note: 30 },
};

const words = (s) => String(s ?? "").trim().split(/\s+/).filter(Boolean).length;
const sentences = (s) => String(s ?? "").replace(/\s+/g, " ").match(/[^.?!…]+[.?!…]+["”’)]?/g)?.map((x) => x.trim()) ?? [];
const texts = (o, out = []) => {
  if (typeof o === "string") out.push(o);
  else if (Array.isArray(o)) o.forEach((x) => texts(x, out));
  else if (o && typeof o === "object") Object.entries(o).forEach(([k, v]) => k !== "privacy_check" && k !== "voice_rewrite" && texts(v, out));
  return out;
};
// "3D", "9:16" and similar production terms are not claims.
const numbers = (s) => new Set(String(s).replace(/\b\d+D\b|\b\d+:\d+\b/g, "").match(/\d+(?:[.,]\d+)?/g) ?? []);

function checkDiagram(g, err) {
  const L = LIMITS[g.type];
  if (!L) return err(`diagram type "${g.type}" is not one of ${Object.keys(LIMITS).slice(3).join(", ")}`);
  for (const [k, max] of Object.entries(LIMITS.diagram)) if ((g[k] ?? "").length > max) err(`diagram ${k} is ${g[k].length} chars (max ${max})`);
  const lim = (x, what) => { for (const [k, max] of Object.entries(L)) if (x && typeof x[k] === "string" && x[k].length > max) err(`${what} ${k} "${x[k]}" is ${x[k].length} chars (max ${max})`); };
  if (g.type === "compare") {
    for (const side of ["left", "right"]) { lim({ title: g[side]?.title }, `compare ${side}`); (g[side]?.items ?? []).forEach((it, i) => lim(it, `compare ${side}[${i}]`)); }
    const a = g.left?.items?.length ?? 0, b = g.right?.items?.length ?? 0;
    if (a !== b || a < 2 || a > 3) err(`compare needs 2–3 items per side, the same on both (has ${a} and ${b})`);
  }
  if (g.type === "flight") { const n = g.steps?.length ?? 0; if (n < 3 || n > 5) err(`flight needs 3–5 steps (has ${n})`); (g.steps ?? []).forEach((x, i) => lim(x, `flight step ${i}`)); }
  if (g.type === "cells") { const n = g.items?.length ?? 0; if (n < 4 || n > 6) err(`cells needs 4–6 items (has ${n})`); (g.items ?? []).forEach((x, i) => lim(x, `cells item ${i}`)); }
  if (g.type === "plan") { if (!g.shapes?.length) err("plan has no shapes"); (g.shapes ?? []).forEach((x, i) => { lim(x, `plan shape ${i}`); for (const k of ["x", "y", "w", "h"]) if (typeof x[k] !== "number") err(`plan shape ${i} needs a numeric ${k}`); }); }
  if (g.type === "scale") { const n = g.bars?.length ?? 0; if (n < 2 || n > 4) err(`scale needs 2–4 bars (has ${n})`); lim({ unit: g.unit }, "scale"); (g.bars ?? []).forEach((x, i) => { lim(x, `scale bar ${i}`); if (typeof x.value !== "number") err(`scale bar ${i} needs a numeric value`); }); }
  if (g.type === "stack") { const n = g.layers?.length ?? 0; if (n < 2 || n > 4) err(`stack needs 2–4 layers (has ${n})`); (g.layers ?? []).forEach((x, i) => lim(x, `stack layer ${i}`)); }
}

const args = process.argv.slice(2);
const dir = args[0];
const against = args.includes("--against") ? args[args.indexOf("--against") + 1] : null;
if (!dir) { console.error("Usage: node tools/content/lint.mjs <drafts-dir> [--against <previous-drafts-dir>]"); process.exit(2); }

let errors = 0;
const closings = {}, openings = {};
for (const f of readdirSync(dir).filter((x) => x.endsWith(".json")).sort()) {
  const d = JSON.parse(readFileSync(join(dir, f), "utf8"));
  const id = d.cluster_id ?? f;
  const E = [], W = [];
  const err = (m) => E.push(m), warn = (m) => W.push(m);

  const all = texts(d).join("\n");
  for (const re of NEVER) { const m = all.match(re); if (m) err(`never-use word: "${m[0]}"`); }

  const li = d.linkedin?.text ?? "";
  const n = words(li);
  if (n < 150 || n > 250) warn(`LinkedIn is ${n} words (150–250)`);
  const ss = sentences(li);
  if (ss.filter((x) => words(x) >= 20).length < 2) warn("LinkedIn has fewer than two sentences of 20+ words");
  let run = 0, maxRun = 0;
  for (const x of ss) { run = words(x) <= 6 ? run + 1 : 0; maxRun = Math.max(maxRun, run); }
  if (maxRun > 3) warn(`LinkedIn has ${maxRun} short sentences in a row (max 3)`);
  if ((li.match(/!/g) ?? []).length > 1) warn("more than one \"!\" in LinkedIn");

  if ((d.x?.post ?? "").length > 280) err(`X post is ${d.x.post.length} characters`);
  (d.x?.thread ?? []).forEach((t, i) => t.length > 280 && err(`X thread post ${i + 1} is ${t.length} characters`));
  if (/até já/i.test(d.x?.post ?? "")) err("sign-off on X");

  const sw = words(d.short?.script);
  if (d.short && (sw < 130 || sw > 175)) warn(`script is ${sw} words (140–165)`);

  const c = d.carousel;
  if (!c) warn("no carousel spec (the renderer will derive a plain one)");
  else {
    for (const [k, max] of Object.entries(LIMITS.carousel)) if ((c[k] ?? "").length > max) err(`carousel ${k} is ${c[k].length} chars (max ${max})`);
    for (const k of ["hook", "rule", "quote"]) if (!c[k]) err(`carousel has no ${k}`);
    const nb = c.beats?.length ?? 0;
    if (nb < 2 || nb > 4) err(`carousel needs 2–4 beats (has ${nb})`);
    (c.beats ?? []).forEach((b, i) => { for (const [k, max] of Object.entries(LIMITS.beat)) if ((b[k] ?? "").length > max) err(`beat ${i + 1} ${k} is ${b[k].length} chars (max ${max})`); });
    if (c.diagram) checkDiagram(c.diagram, err); else warn("carousel has no diagram");
  }

  if (against && existsSync(join(against, f))) {
    const old = JSON.parse(readFileSync(join(against, f), "utf8"));
    const before = numbers(texts(old).join("\n"));
    // Only string values count: diagram geometry, durations and word counts are numbers, not claims.
    const claimed = [...numbers(texts(d).join("\n"))].filter((x) => !before.has(x));
    if (claimed.length) err(`numbers not in the previous version: ${claimed.join(", ")}`);
  }

  const vr = d.voice_rewrite ?? {};
  if (vr.closing) closings[vr.closing] = (closings[vr.closing] ?? 0) + 1;
  if (vr.opening) openings[vr.opening] = (openings[vr.opening] ?? 0) + 1;

  errors += E.length;
  const tag = E.length ? "FAIL" : W.length ? "warn" : "ok  ";
  console.log(`${tag} ${id}  LinkedIn ${n}w · script ${sw}w · ${c?.diagram?.type ?? "no diagram"}`);
  for (const m of E) console.log(`     ✗ ${m}`);
  for (const m of W) console.log(`     · ${m}`);
}
const total = Object.values(closings).reduce((a, b) => a + b, 0);
if (total) {
  console.log(`\nopenings: ${JSON.stringify(openings)}\nclosings: ${JSON.stringify(closings)}`);
  if ((closings.question ?? 0) > Math.ceil(total / 3)) console.log(`· more than one post in three closes on a question`);
  if ((closings.sign_off ?? 0) > Math.ceil(total / 5)) console.log(`· more than one post in five signs off with "até já"`);
}
process.exit(errors ? 1 : 0);
