#!/usr/bin/env node
// Content engine — alt text for every image the renderer makes, from the same carousel spec, in slide order.
// Screen-reader users get the slide's actual words, never "Carousel slide 2".
//
//   node tools/content/visuals/alt.mjs <drafts-dir> <out-dir> [cluster-id ...]
//
// Writes <out-dir>/<id>/alt.json: { carousel: [{ file, short, long }], quote: {...}, cover: {...} }.
// `short` is at most 100 characters (Instagram's limit); `long` carries the whole slide for X, LinkedIn, Facebook
// and Buffer (at most 400). render.mjs writes the same file next to the images it renders.
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const clean = (s) => String(s ?? "").replace(/\s+/g, " ").trim();
const cut = (s, n) => {
  s = clean(s);
  if (s.length <= n) return s;
  const t = s.slice(0, n - 1);
  return `${t.slice(0, Math.max(t.lastIndexOf(" "), n - 20))}…`;
};
const end = (s) => (/[.?!…]$/.test(s) ? s : `${s}.`);
const pair = (short, long) => ({ short: cut(short, 100), long: cut(long, 400) });

export function altFor(d) {
  const c = d.carousel ?? {};
  const beats = c.beats ?? [];
  const order = [["cover"]];
  beats.forEach((b, k) => {
    order.push(["beat", b]);
    if (k === 1 && c.diagram) order.push(["diagram", c.diagram]);
  });
  if (c.diagram && beats.length < 2) order.push(["diagram", c.diagram]);
  order.push(["closing"]);
  const carousel = order.map(([kind, x], i) => {
    const file = `carousel-${String(i + 1).padStart(2, "0")}.png`;
    if (kind === "cover") return { file, ...pair(end(clean(c.hook)), `${end(clean(c.hook))} ${clean(c.voice)}`) };
    if (kind === "beat") return { file, ...pair(end(clean(x.head)), `${end(clean(x.head))} ${clean(x.body)}${x.voice ? ` ${clean(x.voice)}` : ""}`) };
    if (kind === "diagram") return { file, ...pair(`Diagram: ${end(clean(x.title))}`, `Diagram: ${end(clean(x.title))} ${clean(x.caption)}`) };
    return { file, ...pair(end(clean(c.rule)), `${end(clean(c.rule))} ${clean(c.invite)}`) };
  });
  const by = "Asaf Eyzenkot, Suf Zen, founder of Realization";
  return {
    carousel,
    quote: { file: "quote-1200x627.png", ...pair(`Quote card: "${clean(c.quote)}"`, `Quote card: "${clean(c.quote)}" ${by}.`) },
    cover: { file: "cover-1080x1920.png", ...pair(end(clean(c.cover ?? c.hook)), `${end(clean(c.cover ?? c.hook))} ${by}.`) },
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [draftsDir, outDir, ...only] = process.argv.slice(2);
  if (!draftsDir || !outDir) {
    console.error("Usage: node tools/content/visuals/alt.mjs <drafts-dir> <out-dir> [cluster-id ...]");
    process.exit(1);
  }
  for (const f of readdirSync(draftsDir).filter((x) => x.endsWith(".json") && (!only.length || only.some((o) => x.startsWith(o))))) {
    const d = JSON.parse(readFileSync(join(draftsDir, f), "utf8"));
    const dir = join(outDir, d.cluster_id);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "alt.json"), JSON.stringify(altFor(d), null, 2));
    console.log(`${d.cluster_id}: alt.json`);
  }
}
