#!/usr/bin/env node
// Content engine — brand visuals. Renders PNGs for each draft cluster from the
// Realization design system (docs/design-system, marketing_kit/social): Poppins,
// marigold #FDCC33, black, white, the butterfly mark, one surface mode per piece.
//
//   node tools/content/visuals/render.mjs <drafts-dir> <out-dir> [cluster-id ...]
//
// Per cluster it writes:
//   <id>/quote-1200x627.png     LinkedIn / X card (light), Asaf's opening line
//   <id>/carousel-NN.png        Instagram / LinkedIn carousel 1080x1350 (cover, beats, close)
//   <id>/cover-1080x1920.png    Reel / Story / Shorts cover (dark)
//
// Needs Playwright with Chromium (preinstalled in Claude Code cloud sessions at /opt/pw-browsers).

import { readFileSync, readdirSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, "../../..");
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");

// Embedded as data URIs: pages rendered with setContent cannot load file:// assets.
const dataUri = (path, type) => `data:${type};base64,${readFileSync(join(repo, path)).toString("base64")}`;
const font = (w) => dataUri(`public/assets/brand/poppins-${w}.woff2`, "font/woff2");
const MARK = dataUri("public/brand/butterfly-mark.png", "image/png");
const HANDLE = "Suf Zen · Realization";
const URL_TEXT = "realization.world";

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const firstSentence = (s) => (String(s).split(/\n/).find((l) => l.trim()) || "").match(/^.*?[.?!](?=\s|$)/)?.[0] || String(s).split("\n")[0];
const sentences = (s) => String(s).replace(/\s+/g, " ").match(/[^.?!]+[.?!]+/g)?.map((x) => x.trim()) || [];
// The closing slide carries the piece's rule: the "Our rule…" sentence when the script has one, else its last two sentences.
function closingLine(script) {
  const all = sentences(script);
  const i = all.findIndex((x) => /^(our|my|the) rule\b/i.test(x));
  if (i >= 0) {
    const rule = all.slice(i, i + 2).join(" ").replace(/^(our|my|the) rule:\s*/i, "");
    return rule.charAt(0).toUpperCase() + rule.slice(1);
  }
  return all.slice(-2).join(" ");
}

const BASE = `
@font-face { font-family: Poppins; font-weight: 400; src: url(${font("regular")}) format("woff2"); }
@font-face { font-family: Poppins; font-weight: 700; src: url(${font("bold")}) format("woff2"); }
@font-face { font-family: Poppins; font-weight: 800; src: url(${font("extrabold")}) format("woff2"); }
* { box-sizing: border-box; margin: 0; }
body { font-family: Poppins, system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
.c { position: relative; overflow: hidden; display: flex; flex-direction: column; }
.light { background: #fff; color: #000; } .brand { background: #FDCC33; color: #000; } .dark { background: #000; color: #fff; }
.wm { font-weight: 800; letter-spacing: -.01em; }
.eyebrow { font-weight: 700; letter-spacing: .16em; text-transform: uppercase; }
.spaced { font-weight: 700; letter-spacing: .26em; text-transform: uppercase; }
.display { font-weight: 800; line-height: 1.04; letter-spacing: -.025em; text-wrap: balance; }
.body { font-weight: 400; line-height: 1.45; text-wrap: pretty; }
.acc { color: #FDCC33; }
.fit { overflow: hidden; }
`;

// Shrink each .fit element's font until its content fits its box.
const FIT = `<script>
for (const el of document.querySelectorAll('.fit')) {
  let size = parseFloat(getComputedStyle(el).fontSize); const min = +el.dataset.min || 24;
  while (el.scrollHeight > el.clientHeight + 4 && size > min) { size -= 2; el.style.fontSize = size + 'px'; }
}
document.body.dataset.ready = '1';
</script>`;

const page = (w, h, css, html) =>
  `<!doctype html><html><head><meta charset="utf-8"><style>${BASE}.c{width:${w}px;height:${h}px}${css}</style></head><body>${html}${FIT}</body></html>`;

function quoteCard(d) {
  const line = firstSentence(d.linkedin.text);
  return page(1200, 627, `
    .c { display: grid; grid-template-columns: 1fr 340px; }
    .l { padding: 60px 64px 52px; display: flex; flex-direction: column; min-width: 0; }
    .q { font-family: Georgia, serif; font-weight: 700; font-size: 110px; line-height: .2; color: #FDCC33; height: 50px; margin-top: 30px; }
    blockquote { font-weight: 700; font-size: 46px; line-height: 1.18; letter-spacing: -.01em; max-height: 330px; margin-top: 8px; }
    .by { margin-top: auto; font-size: 19px; color: #555; } .by b { color: #000; }
    .r { background: #FDCC33; display: grid; place-items: center; position: relative; }
    .r img { width: 210px; } .r .spaced { position: absolute; bottom: 28px; font-size: 13px; }`,
    `<div class="c light"><div class="l"><div class="wm" style="font-size:24px">Realization</div><div class="q">&rdquo;</div>
      <blockquote class="fit" data-min="26">${esc(line)}</blockquote>
      <div class="by"><b>Asaf Eyzenkot</b> · Suf Zen · Founder, Realization</div></div>
      <div class="r"><img src="${MARK}" alt=""><div class="spaced">Space · Business · Story</div></div></div>`);
}

function carousel(d) {
  const s = d.short;
  const beats = [];
  const seen = new Set();
  for (const sc of s.scenes || []) {
    const head = (sc.on_screen_text || "").trim();
    if (!head || seen.has(head.toLowerCase())) continue;
    seen.add(head.toLowerCase());
    beats.push({ head, body: (sc.spoken_line || "").trim() });
  }
  const mid = beats.slice(1, 6); // first beat usually repeats the hook
  const total = mid.length + 2;
  const foot = (n, mode) => `<div class="foot"><span>${HANDLE}</span><span>${n} / ${total}</span></div>`;
  const css = `
    .c { padding: 88px 88px 72px; }
    .top { display: flex; justify-content: space-between; align-items: center; font-size: 26px; }
    .top img { width: 64px; }
    .foot { margin-top: auto; display: flex; justify-content: space-between; font-size: 22px; font-weight: 600; opacity: .8; }
    .hook { font-size: 104px; max-height: 760px; margin-top: auto; }
    .pill { display: inline-block; margin-top: 40px; font-weight: 700; font-size: 26px; padding: 16px 32px; border-radius: 999px; }
    .brand .pill { background: #000; color: #fff; } .dark .pill { background: #FDCC33; color: #000; }
    .n { font-weight: 800; font-size: 150px; line-height: 1; color: #FDCC33; letter-spacing: -.04em; margin-top: 48px; }
    .h { font-size: 80px; margin-top: 24px; max-height: 340px; }
    .b { font-size: 38px; color: #3d3d3d; margin-top: 40px; max-height: 480px; }
    .rule { font-size: 72px; max-height: 620px; margin-top: 24px; }
    .bf { position: absolute; right: -60px; bottom: -50px; width: 420px; opacity: .16; }`;
  const slides = [];
  slides.push(page(1080, 1350, css, `<div class="c brand"><img class="bf" src="${MARK}" alt="">
    <div class="top"><span class="wm">Realization</span><span class="eyebrow" style="font-size:20px">${esc(d.pillar || "")}</span></div>
    <div class="display hook fit" data-min="56">${esc(s.selected_hook)}</div>
    <div><span class="pill">Swipe →</span></div>${foot(1)}</div>`));
  mid.forEach((b, i) => slides.push(page(1080, 1350, css, `<div class="c light">
    <div class="top"><span class="wm">Realization</span><img src="${MARK}" alt=""></div>
    <div class="n">${String(i + 1).padStart(2, "0")}</div>
    <div class="display h fit" data-min="44">${esc(b.head)}</div>
    <div class="body b fit" data-min="26">${esc(b.body)}</div>${foot(i + 2)}</div>`)));
  const close = closingLine(s.script) || s.selected_hook;
  slides.push(page(1080, 1350, css, `<div class="c dark">
    <div class="top"><span class="wm acc">Realization</span><img src="${MARK}" alt=""></div>
    <div class="eyebrow acc" style="font-size:22px;margin-top:auto">Our rule</div>
    <div class="display rule fit" data-min="40">${esc(close)}</div>
    <div><span class="pill">Follow for field notes</span></div>
    <div class="body" style="font-size:26px;margin-top:28px;opacity:.75">${URL_TEXT}</div>${foot(total)}</div>`));
  return slides;
}

function cover(d) {
  const s = d.short;
  return page(1080, 1920, `
    .c { padding: 120px 96px; }
    .bf { position: absolute; top: 110px; right: 96px; width: 90px; }
    .eyebrow { font-size: 24px; margin-top: auto; color: #fff; opacity: .85; }
    .h { font-size: 150px; margin-top: 28px; max-height: 760px; }
    .lead { font-size: 40px; margin-top: 48px; color: rgba(255,255,255,.82); max-height: 320px; }
    .url { margin-top: auto; font-size: 28px; color: rgba(255,255,255,.7); }`,
    `<div class="c dark"><img class="bf" src="${MARK}" alt=""><div class="wm acc" style="font-size:40px">Realization</div>
      <div class="eyebrow">${esc(d.pillar || "Field note")}</div>
      <div class="display h fit" data-min="72">${esc(String(s.cover_text || s.working_title).replace(/[.!?]+$/, ""))}<span class="acc">.</span></div>
      <div class="body lead fit" data-min="28">${esc(s.selected_hook)}</div>
      <div class="url">${HANDLE} · ${URL_TEXT}</div></div>`);
}

async function shot(browser, html, w, h, file) {
  const p = await browser.newPage({ viewport: { width: w, height: h } });
  await p.setContent(html, { waitUntil: "load" });
  await p.waitForSelector("body[data-ready]");
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: file });
  await p.close();
}

const [draftsDir, outDir, ...only] = process.argv.slice(2);
if (!draftsDir || !outDir) {
  console.error("Usage: node tools/content/visuals/render.mjs <drafts-dir> <out-dir> [cluster-id ...]");
  process.exit(1);
}
const exe = existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined;
const browser = await chromium.launch(exe ? { executablePath: exe } : {});
const files = readdirSync(draftsDir).filter((f) => f.endsWith(".json") && (!only.length || only.some((o) => f.startsWith(o))));
for (const f of files) {
  const d = JSON.parse(readFileSync(join(draftsDir, f), "utf8"));
  const dir = join(outDir, d.cluster_id);
  mkdirSync(dir, { recursive: true });
  await shot(browser, quoteCard(d), 1200, 627, join(dir, "quote-1200x627.png"));
  const slides = carousel(d);
  for (const [i, html] of slides.entries()) await shot(browser, html, 1080, 1350, join(dir, `carousel-${String(i + 1).padStart(2, "0")}.png`));
  await shot(browser, cover(d), 1080, 1920, join(dir, "cover-1080x1920.png"));
  console.log(`${d.cluster_id}: quote, ${slides.length} carousel slides, cover`);
}
await browser.close();
