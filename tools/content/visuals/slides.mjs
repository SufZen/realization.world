// Carousel, quote card and reel cover templates in the three Realization styles
// (docs/content-engine/visual-language.md): "term" (Term sheet, the default), "site" (Site sheet) and "grid" (Swiss grid).
// Each function returns { w, h, html }; render.mjs wraps it with the fonts, CSS and the FIT script.
import { readFileSync } from "node:fs";
import * as D from "./diagrams.mjs";

const Y = "#FDCC33", K = "#000", W = "#fff";
const MARK = `data:image/png;base64,${readFileSync(new URL("../../../public/brand/butterfly-mark.png", import.meta.url)).toString("base64")}`;
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const BRAND = "Suf Zen · Realization";

// Which style a carousel uses, when the draft doesn't set carousel.style:
// a plan (anything drawn to scale: a building, a plot, registered vs built) → site;
// AI and systems topics, and taxonomies → grid; everything else (money, markets, decisions, the founder's view) → term.
export function styleFor(d) {
  const c = d.carousel ?? {};
  if (["term", "site", "grid"].includes(c.style)) return c.style;
  if (c.diagram?.type === "plan") return "site";
  if (/\bAI\b|SYSTEM/i.test(d.pillar ?? "") || c.diagram?.type === "cells") return "grid";
  return "term";
}

export const CSS = `
.c{position:relative;overflow:hidden;width:1080px;height:1350px;font-family:Poppins,system-ui,sans-serif;color:${K};background:${W}}
.k{background:${K};color:${W}}.y{background:${Y};color:${K}}
.d{font-weight:800;letter-spacing:-.035em;line-height:1.02;text-wrap:balance}
.b{font-weight:400;line-height:1.45;text-wrap:pretty}
.m{font-family:"IBM Plex Mono",ui-monospace,monospace;text-transform:uppercase;letter-spacing:.12em;font-size:20px}
.fit{overflow:hidden}
.bar{position:absolute;left:84px;right:84px;top:84px;display:flex;justify-content:space-between;align-items:baseline}
.foot{position:absolute;left:84px;right:84px;bottom:78px;display:flex;justify-content:space-between;align-items:center}
.pull{border-left:10px solid ${Y};padding-left:28px;font-weight:600;line-height:1.3;text-wrap:pretty}
.cols{position:absolute;inset:0 60px;display:grid;grid-template-columns:repeat(6,1fr);gap:20px}
.cols i{border-left:1px solid rgba(0,0,0,.1)}.k .cols i{border-left-color:rgba(255,255,255,.14)}
.frame{position:absolute;inset:40px;border:1.5px solid currentColor;pointer-events:none}
.tb{position:absolute;left:60px;right:60px;bottom:60px;height:112px;border:2.5px solid ${K};display:grid;grid-template-columns:112px 1fr 250px 150px;background:${W};color:${K}}
.tb>div{border-right:2.5px solid ${K};padding:16px 20px}.tb>div:last-child{border-right:0}
.tb small{display:block;font-family:"IBM Plex Mono",monospace;font-size:15px;letter-spacing:.1em;text-transform:uppercase;color:#555}
.tb b{display:block;font-size:22px;margin-top:6px;line-height:1.15}
`;

// After the fonts load: shrink .fit text until it fits its box; crop each diagram to its drawing and scale it into its box.
export const FIT = `<script>
document.fonts.ready.then(() => {
  for (const el of document.querySelectorAll('.fit')) {
    let s = parseFloat(getComputedStyle(el).fontSize); const min = +el.dataset.min || 22;
    while (el.scrollHeight > el.clientHeight + s * 0.2 && s > min) { s -= 2; el.style.fontSize = s + 'px'; }
  }
  for (const svg of document.querySelectorAll('svg[data-fit]')) {
    const b = svg.getBBox(), pad = +svg.dataset.fit || 24;
    const vw = b.width + 2 * pad, vh = b.height + 2 * pad;
    svg.setAttribute('viewBox', [b.x - pad, b.y - pad, vw, vh].map((v) => Math.round(v * 10) / 10).join(' '));
    const box = svg.parentElement.getBoundingClientRect();
    const k = Math.min(box.width / vw, box.height / vh, +(svg.parentElement.dataset.max || 1.2));
    svg.setAttribute('width', Math.round(vw * k)); svg.setAttribute('height', Math.round(vh * k));
  }
  document.body.dataset.ready = '1';
});
</script>`;

const pager = (i, n) => `${String(i + 1).padStart(2, "0")} / ${String(n).padStart(2, "0")}`;
// "Most bank the raise early. I call it by stage." → the setup and the turn, set differently in every style.
function split(hook) {
  const m = String(hook ?? "").match(/^(.+?[.?!])\s+(.+)$/);
  return m ? [m[1], m[2]] : [String(hook ?? ""), ""];
}
const cols = (extra = "") => `<div class="cols"${extra}>${"<i></i>".repeat(6)}</div>`;
const titleBlock = (d, i) => `<div class="tb"><div style="display:grid;place-items:center"><img src="${MARK}" style="width:72px" alt=""></div>
  <div><small>Project</small><b>${esc(d.eyebrow)}</b></div><div><small>Drawn by</small><b>${BRAND}</b></div>
  <div><small>Sheet</small><b style="font-size:40px;font-weight:800;margin-top:0">A-${String(i + 1).padStart(2, "0")}</b></div></div>`;

// ---------- cover ----------
export function cover(d, { i = 0, n = 6, style = "term" } = {}) {
  const [a, b] = split(d.hook);
  if (style === "site") return { w: 1080, h: 1350, html: `<div class="c"><div class="frame"></div>
    <div class="bar"><span class="m">${esc(d.eyebrow)}</span><span class="m">${pager(i, n)}</span></div>
    <div class="d fit" data-min="64" style="position:absolute;left:84px;right:84px;top:170px;max-height:620px;font-size:112px">${esc(a)}${b ? ` <span style="background:${Y};box-decoration-break:clone;-webkit-box-decoration-break:clone;padding:0 10px">${esc(b)}</span>` : ""}</div>
    ${d.voice ? `<div class="b fit" data-min="26" style="position:absolute;left:84px;width:760px;top:830px;max-height:160px;font-size:34px;font-weight:600">${esc(d.voice)}</div>` : ""}
    ${titleBlock(d, i)}</div>` };
  if (style === "grid") return { w: 1080, h: 1350, html: `<div class="c k">${cols()}
    <div style="position:absolute;left:60px;top:60px;width:470px;height:470px;background:${Y}"><img src="${MARK}" style="position:absolute;left:36px;top:36px;width:110px" alt=""></div>
    <div class="d fit" data-min="60" style="position:absolute;left:60px;right:60px;top:580px;max-height:520px;font-size:112px">${esc(a)}${b ? `<br>${esc(b)}` : ""}</div>
    ${d.voice ? `<div class="b fit" data-min="24" style="position:absolute;left:60px;width:720px;top:1130px;max-height:110px;font-size:28px;color:#ccc">${esc(d.voice)}</div>` : ""}
    <div class="m" style="position:absolute;left:60px;bottom:52px">${esc(d.eyebrow)} · ${pager(i, n)}</div><div class="m" style="position:absolute;right:60px;bottom:52px">${BRAND}</div></div>` };
  return { w: 1080, h: 1350, html: `<div class="c y"><img src="${MARK}" alt="" style="position:absolute;right:-190px;bottom:-130px;width:920px;opacity:.11">
    <div class="bar"><span class="m" style="font-weight:500">${esc(d.eyebrow)}</span><span class="m">${pager(i, n)}</span></div>
    <div class="d fit" data-min="72" style="position:absolute;left:80px;right:80px;top:190px;max-height:${b ? 560 : 760}px;font-size:${b ? 136 : 124}px">${esc(a)}</div>
    ${b ? `<div style="position:absolute;left:84px;right:84px;top:790px"><span class="d fit" data-min="44" style="display:inline-block;max-height:230px;background:${K};color:${W};padding:14px 30px;font-size:74px;max-width:912px">${esc(b)}</span></div>` : ""}
    ${d.voice ? `<div class="b fit" data-min="24" style="position:absolute;left:84px;width:720px;bottom:150px;max-height:130px;font-size:30px;font-weight:600">${esc(d.voice)}</div>` : ""}
    <div class="foot"><span style="font-weight:700;font-size:24px">Suf Zen <span style="font-weight:400">· Realization</span></span></div></div>` };
}

// ---------- beat ----------
export function beat(d, x, { i, n, style = "term" }) {
  const g = style === "grid", x0 = g ? 60 : 84;
  const chrome = style === "site" ? titleBlock(d, i) : `<div class="foot" style="left:${x0}px;right:${x0}px"><span class="m">${BRAND}</span><img src="${MARK}" alt="" style="width:64px"></div>`;
  return { w: 1080, h: 1350, html: `<div class="c">${style === "site" ? `<div class="frame"></div>` : g ? cols() : ""}
    <div class="bar" style="left:${x0}px;right:${x0}px;top:${g ? 60 : 84}px"><span class="m">${esc(d.eyebrow)}</span><span class="m">${pager(i, n)}</span></div>
    <div style="position:absolute;left:${x0}px;right:${x0}px;top:${g ? 170 : 260}px">
      ${g ? `<div class="d" style="font-size:150px;line-height:1">${String(i + 1).padStart(2, "0")}</div>` : ""}
      <div class="d fit" data-min="48" style="font-size:78px;max-height:330px;margin-top:${g ? 30 : 0}px">${esc(x.head)}</div>
      ${x.body ? `<div class="b fit" data-min="28" style="font-size:38px;margin-top:44px;max-height:${g ? 330 : 380}px;max-width:880px;color:#1a1a1a">${esc(x.body)}</div>` : ""}
      ${x.voice ? `<div class="pull fit" data-min="26" style="font-size:36px;margin-top:48px;max-width:840px;max-height:150px">${esc(x.voice)}</div>` : ""}
    </div>${chrome}</div>` };
}

// ---------- diagram ----------
export function diagramSlide(d, spec, { i, n, style = "term" }) {
  const fn = D[spec.type];
  // Narrow drawings are scaled up into the box, so their labels read at phone size.
  const svg = fn(spec, { W: spec.type === "flight" && style !== "grid" ? 720 : spec.type === "plan" ? 860 : 960, H: spec.type === "plan" ? 640 : undefined, id: "dg" + i, style });
  const g = style === "grid", x0 = g ? 60 : 84, bottom = style === "site" ? 200 : 150;
  return { w: 1080, h: 1350, html: `<div class="c">${style === "site" ? `<div class="frame"></div>` : g ? cols() : ""}
    <div class="bar" style="left:${x0}px;right:${x0}px;top:${g ? 60 : 84}px"><span class="m">${esc(spec.kicker ?? d.eyebrow)}</span><span class="m">${pager(i, n)}</span></div>
    <div class="d fit" data-min="40" style="position:absolute;left:${x0}px;right:${x0}px;top:${g ? 120 : 150}px;font-size:66px;max-height:150px">${esc(spec.title)}</div>
    <div style="position:absolute;left:${x0}px;right:${x0}px;top:330px;bottom:${bottom + (spec.caption ? 150 : 40)}px;display:flex;align-items:center;justify-content:center" data-max="1.6">${svg}</div>
    ${spec.caption ? `<div class="pull fit" data-min="24" style="position:absolute;left:${x0}px;right:${x0 + 60}px;bottom:${bottom}px;font-size:32px;max-height:130px">${esc(spec.caption)}</div>` : ""}
    ${style === "site" ? titleBlock(d, i) : `<div class="foot" style="left:${x0}px;right:${x0}px"><span class="m">${esc(spec.source ?? BRAND)}</span></div>`}</div>` };
}

// ---------- closing ----------
export function closing(d, { i, n, style = "term" }) {
  if (style === "grid") return { w: 1080, h: 1350, html: `<div class="c y">${cols(' style="opacity:.5"')}
    <div class="bar" style="left:60px;right:60px;top:60px"><span class="m">Take this with you</span><span class="m">${pager(i, n)}</span></div>
    <div class="d fit" data-min="50" style="position:absolute;left:60px;right:60px;top:260px;max-height:640px;font-size:104px">${esc(d.rule)}</div>
    ${d.invite ? `<div class="b fit" data-min="24" style="position:absolute;left:60px;width:760px;bottom:180px;max-height:130px;font-size:32px;font-weight:600">${esc(d.invite)}</div>` : ""}
    <div class="m" style="position:absolute;left:60px;bottom:60px">realization.world</div><img src="${MARK}" alt="" style="position:absolute;right:60px;bottom:44px;width:92px"></div>` };
  return { w: 1080, h: 1350, html: `<div class="c k">${style === "site" ? `<div class="frame" style="color:${W}"></div>` : ""}
    <div class="bar"><span class="m" style="color:${Y}">${style === "site" ? "General note" : "Take this with you"}</span><span class="m" style="color:#aaa">${pager(i, n)}</span></div>
    <div class="d fit" data-min="50" style="position:absolute;left:84px;right:84px;top:190px;max-height:560px;font-size:100px">${esc(d.rule)}</div>
    <div style="position:absolute;left:84px;right:84px;top:800px;height:8px;background:${Y}"></div>
    ${d.invite ? `<div class="b fit" data-min="24" style="position:absolute;left:84px;width:820px;top:850px;max-height:150px;font-size:34px;color:#ddd">${esc(d.invite)}</div>` : ""}
    <div class="foot"><span style="font-weight:700;font-size:26px">realization.world</span><img src="${MARK}" alt="" style="width:92px"></div></div>` };
}

// ---------- quote card (always Term sheet, so the feed stays recognisable) ----------
export function quoteCard(d) {
  return { w: 1200, h: 627, html: `<div class="c y" style="width:1200px;height:627px"><img src="${MARK}" alt="" style="position:absolute;right:-120px;bottom:-150px;width:620px;opacity:.11">
    <div class="m" style="position:absolute;left:72px;top:60px;font-weight:500">${esc(d.eyebrow)}</div>
    <div class="d" style="position:absolute;left:66px;top:88px;font-size:150px;line-height:1">“</div>
    <div class="fit" data-min="30" style="position:absolute;left:72px;top:190px;width:900px;max-height:280px;font-size:52px;font-weight:700;line-height:1.14;letter-spacing:-.02em;text-wrap:balance">${esc(d.quote)}</div>
    <div style="position:absolute;left:72px;bottom:52px;font-size:22px"><b>Asaf Eyzenkot</b> · Suf Zen · Founder, Realization</div></div>` };
}

// ---------- reel / story / shorts cover (always Term sheet) ----------
export function reelCover(d) {
  return { w: 1080, h: 1920, html: `<div class="c y" style="height:1920px"><img src="${MARK}" alt="" style="position:absolute;right:-240px;bottom:-120px;width:1100px;opacity:.11">
    <div class="m" style="position:absolute;left:84px;top:150px;font-weight:500">${esc(d.eyebrow)}</div>
    <div class="d fit" data-min="80" style="position:absolute;left:80px;right:80px;top:230px;max-height:760px;font-size:156px">${esc(d.cover)}</div>
    ${d.voice ? `<div style="position:absolute;left:84px;right:84px;top:1080px"><span class="b fit" data-min="30" style="display:inline-block;background:${K};color:${W};padding:22px 32px;font-size:42px;font-weight:600;max-height:260px">${esc(d.voice)}</span></div>` : ""}
    <div style="position:absolute;left:84px;bottom:150px;font-weight:700;font-size:28px">Suf Zen <span style="font-weight:400">· Realization · realization.world</span></div></div>` };
}
