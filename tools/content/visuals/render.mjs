#!/usr/bin/env node
// Content engine — brand visuals in the Venation language (docs/content-engine/visual-language.md).
// Renders every draft's carousel, quote card and reel cover from its `carousel` spec.
//
//   node tools/content/visuals/render.mjs <drafts-dir> <out-dir> [cluster-id ...]
//
// Per cluster it writes:
//   <id>/carousel-NN.png        Instagram / LinkedIn carousel, 1080x1350:
//                               cover → beats → diagram (after the second beat) → closing on Night
//   <id>/quote-1200x627.png     LinkedIn / X card: Asaf's line in Fraunces italic, the topic's wing
//   <id>/cover-1080x1920.png    Reel / Story / Shorts cover (Night)
//   <id>/diagram.svg            the carousel diagram, cropped to its drawing, for web field notes
//
// A draft without `carousel` gets a plain one derived from its short-video script (no diagram).
// Join a carousel into a LinkedIn document with carousel-pdf.py.
// Needs Playwright with Chromium (preinstalled in Claude Code cloud sessions at /opt/pw-browsers).

import { readFileSync, readdirSync, mkdirSync, existsSync, writeFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import * as S from "./slides.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, "../../..");
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");

// Fonts are embedded as data URIs: pages rendered with setContent cannot load file:// assets.
const font = (file) => `url(data:font/woff2;base64,${readFileSync(join(repo, "public/assets/brand", file)).toString("base64")}) format("woff2")`;
const FONTS = `
@font-face{font-family:Poppins;font-weight:400;src:${font("poppins-regular.woff2")}}
@font-face{font-family:Poppins;font-weight:700;src:${font("poppins-bold.woff2")}}
@font-face{font-family:Poppins;font-weight:800;src:${font("poppins-extrabold.woff2")}}
@font-face{font-family:Fraunces;font-style:normal;font-weight:100 900;src:${font("fraunces-var.woff2")}}
@font-face{font-family:Fraunces;font-style:italic;font-weight:100 900;src:${font("fraunces-var-italic.woff2")}}
@font-face{font-family:"IBM Plex Mono";font-weight:400;src:${font("ibm-plex-mono-regular.woff2")}}
@font-face{font-family:"IBM Plex Mono";font-weight:500;src:${font("ibm-plex-mono-medium.woff2")}}`;

const page = ({ w, h, html }) =>
  `<!doctype html><html><head><meta charset="utf-8"><style>${FONTS}*{margin:0;box-sizing:border-box}body{width:${w}px;height:${h}px;overflow:hidden;-webkit-font-smoothing:antialiased}${S.CSS}</style></head><body>${html}${S.FIT}</body></html>`;

const sentences = (s) => String(s ?? "").replace(/\s+/g, " ").match(/[^.?!]+[.?!]+/g)?.map((x) => x.trim()) || [];
const titleCase = (s) => String(s ?? "").toLowerCase().replace(/^./, (c) => c.toUpperCase());

// Older drafts have no carousel spec: build a plain one from the short-video scenes.
function derive(d) {
  const s = d.short ?? {};
  const seen = new Set();
  const beats = [];
  for (const sc of s.scenes ?? []) {
    const head = (sc.on_screen_text ?? "").trim();
    if (!head || seen.has(head.toLowerCase())) continue;
    seen.add(head.toLowerCase());
    beats.push({ head, body: (sc.spoken_line ?? "").trim() });
  }
  const all = sentences(s.script);
  return {
    hook: s.selected_hook, beats: beats.slice(1, 4), rule: all.slice(-2).join(" "),
    quote: sentences(d.linkedin?.text)[0], cover: s.cover_text ?? s.working_title,
  };
}

function slidesFor(d) {
  const c = d.carousel ?? derive(d);
  const v = { cluster_id: d.cluster_id, eyebrow: c.eyebrow ?? titleCase(d.pillar), ...c };
  const beats = c.beats ?? [];
  const order = [["cover"]];
  beats.forEach((b, k) => {
    order.push(["beat", b]);
    if (k === 1 && c.diagram) order.push(["diagram", c.diagram]);
  });
  if (c.diagram && beats.length < 2) order.push(["diagram", c.diagram]);
  order.push(["closing"]);
  const n = order.length;
  const carousel = order.map(([kind, x], i) =>
    kind === "cover" ? S.cover(v, { i, n }) : kind === "beat" ? S.beat(v, x, { i, n }) : kind === "diagram" ? S.diagramSlide(v, x, { i, n }) : S.closing(v, { i, n }));
  return { carousel, quote: S.quoteCard(v), reel: S.reelCover(v), hasDiagram: !!c.diagram };
}

async function shot(browser, slide, file, { svgOut } = {}) {
  const p = await browser.newPage({ viewport: { width: slide.w, height: slide.h } });
  await p.setContent(page(slide), { waitUntil: "load" });
  await p.waitForFunction(() => document.body.dataset.ready === "1");
  await p.screenshot({ path: file });
  if (svgOut) {
    const svg = await p.$eval("svg[data-fit]", (s) => s.outerHTML).catch(() => null);
    if (svg) writeFileSync(svgOut, svg.replace(/ (width|height)="\d+"/g, "").replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" '));
  }
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
  const { carousel, quote, reel, hasDiagram } = slidesFor(d);
  for (const [i, slide] of carousel.entries()) {
    const isDiagram = hasDiagram && slide.html.includes("data-fit");
    await shot(browser, slide, join(dir, `carousel-${String(i + 1).padStart(2, "0")}.png`), { svgOut: isDiagram ? join(dir, "diagram.svg") : null });
  }
  await shot(browser, quote, join(dir, "quote-1200x627.png"));
  await shot(browser, reel, join(dir, "cover-1080x1920.png"));
  console.log(`${d.cluster_id}: ${carousel.length} carousel slides${hasDiagram ? " (with diagram)" : ""}, quote, cover`);
}
await browser.close();
