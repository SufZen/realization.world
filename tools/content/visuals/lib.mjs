// Used by render.mjs (images): fonts, page wrapper, and the slide list for a draft. Videos are made in tools/content/reels.
import { readFileSync, existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import * as S from "./slides.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, "../../..");
const require = createRequire(import.meta.url);
export const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");

// Fonts are embedded as data URIs: pages rendered with setContent cannot load file:// assets.
const font = (file) => `url(data:font/woff2;base64,${readFileSync(join(repo, "public/assets/brand", file)).toString("base64")}) format("woff2")`;
export const FONTS = `
@font-face{font-family:Poppins;font-weight:400;src:${font("poppins-regular.woff2")}}
@font-face{font-family:Poppins;font-weight:700;src:${font("poppins-bold.woff2")}}
@font-face{font-family:Poppins;font-weight:800;src:${font("poppins-extrabold.woff2")}}
@font-face{font-family:"IBM Plex Mono";font-weight:400;src:${font("ibm-plex-mono-regular.woff2")}}
@font-face{font-family:"IBM Plex Mono";font-weight:500;src:${font("ibm-plex-mono-medium.woff2")}}`;

export const page = ({ w, h, html }) =>
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

export function slidesFor(d) {
  const c = d.carousel ?? derive(d);
  const v = { cluster_id: d.cluster_id, eyebrow: c.eyebrow ?? titleCase(d.pillar), ...c };
  const style = S.styleFor({ ...d, carousel: c });
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
    kind === "cover" ? S.cover(v, { i, n, style }) : kind === "beat" ? S.beat(v, x, { i, n, style }) : kind === "diagram" ? S.diagramSlide(v, x, { i, n, style }) : S.closing(v, { i, n, style }));
  return { carousel, quote: S.quoteCard(v), reel: S.reelCover(v), hasDiagram: !!c.diagram, style };
}

export async function launch() {
  const exe = existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined;
  return chromium.launch(exe ? { executablePath: exe } : {});
}
