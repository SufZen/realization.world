// Venation slide system: cover, beat, diagram, closing (carousel 1080×1350), quote card (1200×627), reel cover (1080×1920).
// Each returns { w, h, html }; render.mjs wraps it with the fonts, CSS and the FIT script.
import { wing, wingSVG, hash, INK, PAPER, POLLEN, MARIGOLD } from "./venation.mjs";
import * as D from "./diagrams.mjs";

const NIGHT = "#151411";
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

export const CSS = `
.c{position:relative;overflow:hidden;display:flex;flex-direction:column;background:${PAPER};color:${INK}}
.c.night{background:${NIGHT};color:#F4EEE2}
.art{position:absolute;inset:0}
.mono{font-family:"IBM Plex Mono",ui-monospace,monospace;letter-spacing:.06em;text-transform:uppercase;font-size:20px;color:#6B665C}
.night .mono{color:#B5AE9F}
.head{font-family:Poppins,system-ui,sans-serif;font-weight:800;letter-spacing:-.022em;line-height:1.02;text-wrap:balance}
.voice{font-family:Fraunces,Georgia,serif;font-style:italic;font-weight:380;font-variation-settings:"SOFT" 100,"WONK" 0,"opsz" 72;line-height:1.18;letter-spacing:-.005em;text-wrap:pretty}
.body{font-family:Poppins,system-ui,sans-serif;font-weight:400;line-height:1.5;color:#3D3A34;text-wrap:pretty}
.night .body{color:#D9D2C3}
.fit{overflow:hidden}
.dots{display:flex;gap:10px;align-items:center}
.dots i{display:block;width:10px;height:10px;border-radius:50%;border:1.5px solid currentColor}
.dots i.on{background:currentColor}
.foot{position:absolute;left:84px;right:84px;bottom:64px;display:flex;justify-content:space-between;align-items:center;font-family:"IBM Plex Mono",monospace;font-size:18px;letter-spacing:.08em;text-transform:uppercase}
`;

// After the fonts load: shrink text in .fit boxes until it fits; crop each diagram (svg[data-fit]) to what it
// actually draws and scale it into its box (never above data-max, default 1.15), centred.
export const FIT = `<script>
document.fonts.ready.then(() => {
  for (const el of document.querySelectorAll('.fit')) {
    let s = parseFloat(getComputedStyle(el).fontSize); const min = +el.dataset.min || 22;
    while (el.scrollHeight > el.clientHeight + 3 && s > min) { s -= 2; el.style.fontSize = s + 'px'; }
  }
  for (const svg of document.querySelectorAll('svg[data-fit]')) {
    const b = svg.getBBox(), pad = +svg.dataset.fit || 24;
    const vw = b.width + 2 * pad, vh = b.height + 2 * pad;
    svg.setAttribute('viewBox', [b.x - pad, b.y - pad, vw, vh].map((v) => Math.round(v * 10) / 10).join(' '));
    const box = svg.parentElement.getBoundingClientRect();
    const k = Math.min(box.width / vw, box.height / vh, +(svg.parentElement.dataset.max || 1.15));
    svg.setAttribute('width', Math.round(vw * k)); svg.setAttribute('height', Math.round(vh * k));
  }
  document.body.dataset.ready = '1';
});
</script>`;

const pager = (i, n) => `<span class="dots">${Array.from({ length: n }, (_, k) => `<i class="${k <= i ? "on" : ""}"></i>`).join("")}</span>`;

// One butterfly per topic, from its id; progress lights cells as the reader moves through.
export function butterfly(topicId) {
  const seed = hash(topicId);
  return { F: wing({ seed, kind: "fore" }), H: wing({ seed: seed + 7, kind: "hind" }), seed };
}
function litFor(W, share, seed) {
  const n = W.cells.length, k = Math.round(n * share);
  const order = W.cells.map((_, i) => i).sort((a, b) => ((a * 7919 + seed) % 97) - ((b * 7919 + seed) % 97));
  return order.slice(0, k);
}
// Half a butterfly anchored to the right edge: the canvas edge is the body.
function halfButterfly(B, { x = 1080, y = 900, s = 1, share = 0.4, dark = false, locked = true, id = "b" }) {
  const lf = litFor(B.F, share, B.seed), lh = litFor(B.H, share, B.seed + 3);
  const lockF = locked && share < 1 ? [B.F.cells.findIndex((_, i) => !lf.includes(i))] : [];
  const border = dark ? "band" : "drawn";
  const full = share >= 1;
  return wingSVG(B.H, { scale: 620 * s, x, y: y + 22 * s, rotate: -4, flip: true, lit: lh, deep: lh.slice(0, 1), id: id + "h", border, dark }) +
    wingSVG(B.F, { scale: 760 * s, x, y, rotate: 24, flip: true, lit: lf, deep: lf.slice(0, 1), locked: lockF, id: id + "f", border, dark, discal: full });
}

export function cover(d, { i = 0, n = 7 } = {}) {
  const B = butterfly(d.cluster_id);
  const art = `<svg class="art" viewBox="0 0 1080 1350">${halfButterfly(B, { x: 1080, y: 1010, s: 0.92, share: 0.35, id: "cv" })}</svg>`;
  return { w: 1080, h: 1350, html: `<div class="c" style="width:1080px;height:1350px">${art}
    <div style="position:absolute;left:84px;top:92px;width:740px">
      <div class="mono">${esc(d.eyebrow ?? d.pillar ?? "Field note")}</div>
      <div class="head fit" data-min="54" style="font-size:84px;margin-top:30px;max-height:352px">${esc(d.hook)}</div>
      ${d.voice ? `<div class="voice fit" data-min="28" style="font-size:40px;margin-top:44px;max-width:450px;max-height:250px">${esc(d.voice)}</div>` : ""}
    </div>
    <div class="foot"><span style="display:flex;gap:26px;align-items:center">Suf Zen · Realization ${pager(i, n)}</span></div></div>` };
}

export function beat(d, b, { i, n }) {
  const B = butterfly(d.cluster_id);
  // A small forewing in the top-right corner fills in, cell by cell, as the reader progresses.
  const share = (i + 1) / n;
  const art = `<svg class="art" viewBox="0 0 1080 1350">${wingSVG(B.F, { scale: 300, x: 1080, y: 170, rotate: 24, flip: true, lit: litFor(B.F, share, B.seed), id: "bt" + i })}</svg>`;
  return { w: 1080, h: 1350, html: `<div class="c" style="width:1080px;height:1350px">${art}
    <div style="position:absolute;left:84px;top:96px" class="mono">${String(i).padStart(2, "0")} / ${String(n - 1).padStart(2, "0")}</div>
    <div style="position:absolute;left:84px;right:84px;top:390px">
      <div class="head fit" data-min="44" style="font-size:72px;max-height:360px">${esc(b.head)}</div>
      ${b.body ? `<div class="body fit" data-min="26" style="font-size:36px;margin-top:40px;max-height:420px;max-width:860px">${esc(b.body)}</div>` : ""}
      ${b.voice ? `<div class="voice" style="font-size:40px;margin-top:40px;max-width:820px">${esc(b.voice)}</div>` : ""}
    </div>
    <div class="foot"><span>Suf Zen · Realization</span>${pager(i, n)}</div></div>` };
}

export function diagramSlide(d, spec, { i, n }) {
  const fn = D[spec.type];
  const H = { flight: 640, scale: 700 }[spec.type] ?? 820;
  const svg = fn(spec, { W: 960, H, id: "dg" + i, seed: hash(d.cluster_id) + 11, wingSVG });
  return { w: 1080, h: 1350, html: `<div class="c" style="width:1080px;height:1350px">
    <div style="position:absolute;left:84px;top:96px;right:84px">
      <div class="mono">${String(i).padStart(2, "0")} / ${String(n - 1).padStart(2, "0")} · ${esc(spec.kicker ?? "How it works")}</div>
      <div class="head fit" data-min="36" style="font-size:52px;margin-top:22px;max-height:130px">${esc(spec.title)}</div>
    </div>
    <div style="position:absolute;left:60px;right:60px;top:300px;height:${spec.caption ? 730 : 860}px;display:flex;align-items:center;justify-content:center">${svg}</div>
    ${spec.caption ? `<div class="voice fit" data-min="26" style="position:absolute;left:84px;right:120px;bottom:150px;font-size:36px;max-height:130px">${esc(spec.caption)}</div>` : ""}
    <div class="foot"><span>${esc(spec.source ?? "Suf Zen · Realization")}</span>${pager(i, n)}</div></div>` };
}

export function closing(d, { i, n }) {
  const B = butterfly(d.cluster_id);
  const art = `<svg class="art" viewBox="0 0 1080 1350">${halfButterfly(B, { x: 1080, y: 1030, s: 0.86, share: 1, dark: true, locked: false, id: "cl" })}</svg>`;
  return { w: 1080, h: 1350, html: `<div class="c night" style="width:1080px;height:1350px">${art}
    <div style="position:absolute;left:84px;top:96px;width:620px">
      <div class="mono" style="color:${MARIGOLD}">Take this with you</div>
      <div class="voice fit" data-min="34" style="font-size:58px;margin-top:30px;max-height:470px;color:#FBF6EA">${esc(d.rule)}</div>
      ${d.invite ? `<div class="body" style="font-size:28px;margin-top:36px;max-width:560px">${esc(d.invite)}</div>` : ""}
    </div>
    <div class="foot" style="color:#D9D2C3"><span style="display:flex;gap:26px;align-items:center">realization.world ${pager(n - 1, n)}</span></div></div>` };
}

export function quoteCard(d) {
  const B = butterfly(d.cluster_id);
  const art = `<svg class="art" viewBox="0 0 1200 627">${halfButterfly(B, { x: 1200, y: 430, s: 0.6, share: 0.55, id: "q" })}</svg>`;
  return { w: 1200, h: 627, html: `<div class="c" style="width:1200px;height:627px">${art}
    <div style="position:absolute;left:72px;top:64px;width:600px">
      <div class="mono" style="font-size:17px">${esc(d.eyebrow ?? d.pillar ?? "")}</div>
      <div class="voice fit" data-min="30" style="font-size:50px;margin-top:22px;max-height:340px">“${esc(d.quote)}”</div>
    </div>
    <div style="position:absolute;left:72px;bottom:58px;font-family:Poppins;font-size:20px"><b>Asaf Eyzenkot</b> <span style="color:#6B665C">· Suf Zen · Founder, Realization</span></div></div>` };
}

export function reelCover(d) {
  const B = butterfly(d.cluster_id);
  const art = `<svg class="art" viewBox="0 0 1080 1920">${halfButterfly(B, { x: 1080, y: 1360, s: 1.18, share: 0.7, dark: true, locked: false, id: "rc" })}</svg>`;
  return { w: 1080, h: 1920, html: `<div class="c night" style="width:1080px;height:1920px">${art}
    <div style="position:absolute;left:84px;top:150px;width:880px">
      <div class="mono" style="color:${MARIGOLD}">${esc(d.eyebrow ?? d.pillar ?? "")}</div>
      <div class="head fit" data-min="70" style="font-size:118px;margin-top:34px;max-height:520px;color:#FBF6EA">${esc(d.cover)}</div>
      ${d.voice ? `<div class="voice" style="font-size:46px;margin-top:40px;max-width:640px;color:#E9E1CF">${esc(d.voice)}</div>` : ""}
    </div>
    <div class="foot" style="color:#D9D2C3;bottom:120px"><span>Suf Zen · Realization · realization.world</span></div></div>` };
}
