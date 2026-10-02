#!/usr/bin/env node
// Content engine — brand visuals (docs/content-engine/visual-language.md).
// Renders every draft's carousel, quote card and reel cover from its `carousel` spec, in the style the draft calls for:
// Term sheet by default, Site sheet for anything drawn to scale, Swiss grid for AI, systems and taxonomies.
//
//   node tools/content/visuals/render.mjs <drafts-dir> <out-dir> [cluster-id ...]
//
// Per cluster it writes:
//   <id>/carousel-NN.png        Instagram / LinkedIn carousel, 1080x1350:
//                               cover → beats → diagram (after the second beat) → closing
//   <id>/quote-1200x627.png     LinkedIn / X card: Asaf's line on marigold
//   <id>/cover-1080x1920.png    Reel / Story / Shorts cover
//   <id>/diagram.svg            the carousel diagram, cropped to its drawing, for web field notes
//   <id>/carousel-NN.jpg        JPEG copies (TikTok photo posts reject PNG)
//   <id>/alt.json               alt text for every image, in slide order (alt.mjs)
//
// A draft without `carousel` gets a plain one derived from its short-video script (no diagram).
// Join a carousel into a LinkedIn document with carousel-pdf.py.
// Needs Playwright with Chromium (preinstalled in Claude Code cloud sessions at /opt/pw-browsers).

import { readFileSync, readdirSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { page, slidesFor, launch } from "./lib.mjs";
import { altFor } from "./alt.mjs";

async function shot(browser, slide, file, { svgOut, jpg } = {}) {
  const p = await browser.newPage({ viewport: { width: slide.w, height: slide.h } });
  await p.setContent(page(slide), { waitUntil: "load" });
  await p.waitForFunction(() => document.body.dataset.ready === "1");
  await p.screenshot({ path: file });
  if (jpg) await p.screenshot({ path: file.replace(/\.png$/, ".jpg"), type: "jpeg", quality: 92 });
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
const browser = await launch();
const files = readdirSync(draftsDir).filter((f) => f.endsWith(".json") && (!only.length || only.some((o) => f.startsWith(o))));
for (const f of files) {
  const d = JSON.parse(readFileSync(join(draftsDir, f), "utf8"));
  const dir = join(outDir, d.cluster_id);
  mkdirSync(dir, { recursive: true });
  const { carousel, quote, reel, hasDiagram, style } = slidesFor(d);
  for (const [i, slide] of carousel.entries()) {
    const isDiagram = hasDiagram && slide.html.includes("data-fit");
    await shot(browser, slide, join(dir, `carousel-${String(i + 1).padStart(2, "0")}.png`), { svgOut: isDiagram ? join(dir, "diagram.svg") : null, jpg: true });
  }
  await shot(browser, quote, join(dir, "quote-1200x627.png"));
  await shot(browser, reel, join(dir, "cover-1080x1920.png"));
  writeFileSync(join(dir, "alt.json"), JSON.stringify(altFor(d), null, 2));
  console.log(`${d.cluster_id}: ${style} · ${carousel.length} carousel slides${hasDiagram ? " (with diagram)" : ""}, quote, cover`);
}
await browser.close();
