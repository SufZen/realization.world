// Venation diagram grammar. Every diagram is an SVG string sized by its viewBox.
// Lines are veins (tapered, thick → thin shows direction, a dot marks the end).
// Areas are cells (soft quadrilaterals). Marigold = realized, monarch = where layers meet,
// hatch = locked, pollen = possible. Text: Poppins for labels, Fraunces italic for the human note,
// IBM Plex Mono for measurements and sources.
import { INK, PAPER, POLLEN, MARIGOLD, MONARCH, MIST, hash, rng, wing } from "./venation.mjs";

const f = (n) => Math.round(n * 100) / 100;
// Type scale for diagrams drawn at 960 wide on a 1080 slide: nothing under 18px, labels 28, notes 22.
export const T = { title: 31, label: 28, note: 22, mono: 18 };
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

// Wrap text into lines of at most `max` characters (by words).
export function wrap(text, max) {
  const words = String(text ?? "").split(/\s+/).filter(Boolean);
  const lines = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > max && cur) { lines.push(cur); cur = w; }
    else cur = (cur + " " + w).trim();
  }
  if (cur) lines.push(cur);
  return lines;
}
function textBlock(x, y, text, { size = 24, lh = 1.3, max = 24, weight = 400, family = "Poppins", fill = INK, anchor = "start", italic = false, soft = false } = {}) {
  const lines = wrap(text, max);
  const style = italic ? ` font-style="italic"` : "";
  const vs = soft ? ` style="font-variation-settings:'SOFT' 100,'WONK' 0,'opsz' 60"` : "";
  return {
    svg: `<text x="${f(x)}" y="${f(y)}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}"${style}${vs}>${lines.map((l, i) => `<tspan x="${f(x)}" dy="${i ? f(size * lh) : 0}">${esc(l)}</tspan>`).join("")}</text>`,
    height: lines.length * size * lh,
    lines: lines.length,
  };
}

// A soft cell: rounded quad with slightly bowed sides. skew leans the outer edge like a wing cell.
function cellPath(x, y, w, h, { r = 18, bow = 5, lean = 0 } = {}) {
  const x1 = x + w, y1 = y + h;
  return `M${f(x + r)} ${f(y)} Q${f(x + w / 2)} ${f(y - bow)} ${f(x1 - r + lean)} ${f(y)} Q${f(x1 + lean)} ${f(y)} ${f(x1 + lean)} ${f(y + r)} L${f(x1)} ${f(y1 - r)} Q${f(x1)} ${f(y1)} ${f(x1 - r)} ${f(y1)} Q${f(x + w / 2)} ${f(y1 + bow)} ${f(x + r)} ${f(y1)} Q${f(x)} ${f(y1)} ${f(x)} ${f(y1 - r)} L${f(x)} ${f(y + r)} Q${f(x)} ${f(y)} ${f(x + r)} ${f(y)} Z`;
}
const defs = (id) => `<defs>
  <pattern id="${id}-hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="9" stroke="#9E9788" stroke-width="1.2"/></pattern>
  <radialGradient id="${id}-glow" cx="0.3" cy="0.4" r="0.9"><stop offset="0" stop-color="#FFFBEA"/><stop offset="1" stop-color="${POLLEN}"/></radialGradient>
</defs>`;
function cellFill(state, id) {
  if (state === "realized") return `fill="${MARIGOLD}" fill-opacity="0.85"`;
  if (state === "meet") return `fill="${MONARCH}"`;
  if (state === "locked") return `fill="url(#${id}-hatch)"`;
  if (state === "empty") return `fill="${PAPER}"`;
  return `fill="url(#${id}-glow)"`; // possible
}

// A wing cell: a short inner edge (where the vein arrives), a full-height outer edge with rounded
// corners, and softly bowed sides. dir +1 opens to the right, -1 to the left.
export function wingCell(x0, y0, w, h, dir = 1, { inner = 0.62, r = 18 } = {}) {
  const ih = h * inner, iy = y0 + (h - ih) / 2;
  const xi = dir < 0 ? x0 + w : x0, xo = dir < 0 ? x0 : x0 + w, s = dir;
  const mx = (xi + xo) / 2, ri = Math.min(8, w * 0.12);
  return `M${f(xi)} ${f(iy + 6)} Q${f(xi)} ${f(iy)} ${f(xi + s * ri)} ${f(iy - 1)}` +
    ` Q${f(mx)} ${f(y0 + (iy - y0) * 0.35)} ${f(xo - s * r)} ${f(y0)}` +
    ` Q${f(xo)} ${f(y0)} ${f(xo)} ${f(y0 + r)} L${f(xo)} ${f(y0 + h - r)} Q${f(xo)} ${f(y0 + h)} ${f(xo - s * r)} ${f(y0 + h)}` +
    ` Q${f(mx)} ${f(y0 + h - (iy - y0) * 0.35)} ${f(xi + s * ri)} ${f(iy + ih + 1)} Q${f(xi)} ${f(iy + ih)} ${f(xi)} ${f(iy + ih - 6)} Z`;
}

// A fan cell: one cell of a wing, cut from a root by two radial veins and closed by a soft outer arc.
// (cx, cy) is the root, where the arriving vein ends; the cell opens toward `dir` (radians).
export function fanCell(cx, cy, { r0 = 10, r1 = 96, half = 26, dir = 0 } = {}) {
  const a0 = dir - (half * Math.PI) / 180, a1 = dir + (half * Math.PI) / 180;
  const P = (r, a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const [i0, o0, o1, i1] = [P(r0, a0), P(r1, a0), P(r1, a1), P(r0, a1)];
  return `M${f(i0[0])} ${f(i0[1])} L${f(o0[0])} ${f(o0[1])} A${r1} ${r1} 0 0 1 ${f(o1[0])} ${f(o1[1])} L${f(i1[0])} ${f(i1[1])} A${r0} ${r0} 0 0 0 ${f(i0[0])} ${f(i0[1])} Z`;
}

// A vein between two points: tapered quadratic curve, dot at the end.
export function vein(p0, p1, { bend = 0.18, w0 = 4, w1 = 1.2, color = INK, dot = true, dash = false } = {}) {
  const mx = (p0[0] + p1[0]) / 2, my = (p0[1] + p1[1]) / 2;
  const dx = p1[0] - p0[0], dy = p1[1] - p0[1];
  const c = [mx - dy * bend, my + dx * bend];
  if (dash) {
    return `<path d="M${f(p0[0])} ${f(p0[1])} Q${f(c[0])} ${f(c[1])} ${f(p1[0])} ${f(p1[1])}" fill="none" stroke="${color}" stroke-width="${f((w0 + w1) / 2)}" stroke-dasharray="2 9" stroke-linecap="round"/>` + (dot ? `<circle cx="${f(p1[0])}" cy="${f(p1[1])}" r="${f(w1 + 3.2)}" fill="${color}"/>` : "");
  }
  const N = 32, L = [], R = [];
  for (let k = 0; k <= N; k++) {
    const t = k / N, u = 1 - t;
    const x = u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0], y = u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1];
    const tx = 2 * u * (c[0] - p0[0]) + 2 * t * (p1[0] - c[0]), ty = 2 * u * (c[1] - p0[1]) + 2 * t * (p1[1] - c[1]);
    const l = Math.hypot(tx, ty) || 1, nx = -ty / l, ny = tx / l;
    const w = (w0 + (w1 - w0) * Math.pow(t, 0.8)) / 2;
    L.push([x + nx * w, y + ny * w]); R.push([x - nx * w, y - ny * w]);
  }
  const path = "M" + [...L, ...R.reverse()].map((p) => `${f(p[0])} ${f(p[1])}`).join(" L") + " Z";
  return `<path d="${path}" fill="${color}"/>` + (dot ? `<circle cx="${f(p1[0])}" cy="${f(p1[1])}" r="${f(w1 + 3.2)}" fill="${color}"/>` : "");
}

// ---------- 1. compare: two wings mirrored across a body axis ----------
// Each row is a cell that fans out from the axis: narrow where it meets the body, full height outside,
// joined to the axis by a tapered vein. Highlighted cells (e.g. "R0") are marigold.
export function compare(spec, { W = 960, H = 820, id = "cmp" } = {}) {
  const rows = Math.max(spec.left.items.length, spec.right.items.length);
  const cx = W / 2, top = 120, bottom = H - 30;
  const rowH = (bottom - top) / rows, cellH = Math.min(164, rowH - 28);
  const gapAxis = 58, cw = cx - gapAxis - 24;
  const hl = new Set((spec.highlight ?? []).map(String));
  const out = [defs(id)];
  out.push(`<line x1="${cx}" y1="${top - 34}" x2="${cx}" y2="${f(bottom - 10)}" stroke="${INK}" stroke-width="1.3"/>`);
  for (let y = top - 30; y < bottom - 10; y += 14) out.push(`<circle cx="${cx}" cy="${f(y)}" r="${(Math.round((y - top) / 14)) % 4 === 0 ? 3 : 1.6}" fill="${INK}"/>`);
  const side = (items, dir, title) => {
    out.push(textBlock(dir < 0 ? cx - gapAxis : cx + gapAxis, 62, title, { size: T.title, weight: 700, max: 24, anchor: dir < 0 ? "end" : "start" }).svg);
    items.forEach((it, i) => {
      const y = top + i * rowH + (rowH - cellH) / 2;
      const x = dir < 0 ? cx - gapAxis - cw : cx + gapAxis;
      const state = hl.has(`${dir < 0 ? "L" : "R"}${i}`) ? "realized" : it.state ?? "possible";
      out.push(vein([cx, y + cellH / 2], [dir < 0 ? cx - gapAxis + 2 : cx + gapAxis - 2, y + cellH / 2], { bend: 0, w0: 4, w1: 1.6, dot: false }));
      out.push(`<path d="${wingCell(x, y, cw, cellH, dir)}" ${cellFill(state, id)} stroke="${INK}" stroke-width="1.3"/>`);
      const tx = dir < 0 ? x + cw - 34 : x + 34;
      const a = dir < 0 ? "end" : "start";
      const lab = textBlock(tx, 0, it.label, { size: T.label, weight: 700, max: 20, lh: 1.2, anchor: a });
      const note = it.note ? textBlock(tx, 0, it.note, { size: T.note, max: 27, lh: 1.25, anchor: a, fill: "#4A463F" }) : null;
      const blockH = lab.height + (note ? note.height + 4 : 0);
      const y0 = y + cellH / 2 - blockH / 2 + T.label * 0.85;
      out.push(textBlock(tx, y0, it.label, { size: T.label, weight: 700, max: 20, lh: 1.2, anchor: a }).svg);
      if (note) out.push(textBlock(tx, y0 + lab.height + 2, it.note, { size: T.note, max: 27, lh: 1.25, anchor: a, fill: "#4A463F" }).svg);
    });
  };
  side(spec.left.items, -1, spec.left.title);
  side(spec.right.items, 1, spec.right.title);
  return `<svg data-fit="28" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(spec.caption ?? spec.left.title + " vs " + spec.right.title)}">${out.join("")}</svg>`;
}

// ---------- 2. flight: a sequence along a soft rising curve, labels hung on a common baseline ----------
export function flight(spec, { W = 960, H = 820, id = "fl" } = {}) {
  const steps = spec.steps, n = steps.length;
  const out = [defs(id)];
  const colW = W / n, x0 = colW / 2, x1 = W - colW / 2;
  const P = (t) => [x0 + t * (x1 - x0), H * 0.4 - t * H * 0.16 + Math.sin(t * Math.PI) * -46];
  const pts = Array.from({ length: 80 }, (_, k) => P(k / 79));
  out.push(`<path d="M${pts.map((p) => `${f(p[0])} ${f(p[1])}`).join(" L")}" fill="none" stroke="${INK}" stroke-opacity="0.16" stroke-width="1" stroke-dasharray="1 7" stroke-linecap="round"/>`);
  const baseY = H * 0.56;
  // Labels shrink (never below 20px) until the longest word fits its column.
  const longest = Math.max(...steps.map((s) => Math.max(...String(s.label).split(/\s+/).map((w) => w.length))));
  const size = Math.round(Math.max(20, Math.min(T.label, (colW - 18) / (longest * 0.6))));
  const noteSize = Math.round(Math.max(18, Math.min(T.note, size * 0.82)));
  const maxChars = Math.max(8, Math.floor((colW - 16) / (size * 0.56)));
  const noteChars = Math.max(10, Math.floor((colW - 12) / (noteSize * 0.5)));
  const fan = { r0: 10, r1: 100, half: 27 }, rootDx = 64; // the arrival cell's root sits left of the node
  steps.forEach((s, i) => {
    const p = P(i / (n - 1 || 1));
    const last = i === n - 1;
    if (i < n - 1) {
      const q = P((i + 1) / (n - 1));
      const intoLast = i + 1 === n - 1;
      out.push(vein([p[0] + 12, p[1]], [q[0] - (intoLast ? rootDx - fan.r0 + 2 : 14), q[1]], { bend: 0.04, w0: 4.4, w1: 1.4, dot: false, dash: !!steps[i + 1].wait }));
      if (steps[i + 1].wait) out.push(`<text x="${f((p[0] + q[0]) / 2)}" y="${f((p[1] + q[1]) / 2 - 22)}" text-anchor="middle" font-family="IBM Plex Mono" font-size="${T.mono}" fill="#6B665C">wait</text>`);
    }
    // leader from node to label baseline
    const fanDrop = fan.r1 * Math.sin((fan.half * Math.PI) / 180);
    out.push(`<line x1="${f(p[0])}" y1="${f(p[1] + (last ? fanDrop + 8 : 16))}" x2="${f(p[0])}" y2="${f(baseY - 44)}" stroke="${INK}" stroke-width="0.8" stroke-opacity="0.45"/>`);
    // The arrival is a lit wing cell, a fan opening from the vein that reaches it.
    if (last) {
      const rx = p[0] - rootDx, ry = p[1];
      out.push(`<path d="${fanCell(rx, ry, fan)}" fill="${MARIGOLD}" fill-opacity="0.92" stroke="${INK}" stroke-width="1.4" stroke-linejoin="round"/>`);
      // two inner veins and a row of margin dots make it a fragment of a wing, not a shape
      for (const a of [-fan.half / 3, fan.half / 3]) {
        const t = (a * Math.PI) / 180;
        out.push(`<line x1="${f(rx + (fan.r0 + 8) * Math.cos(t))}" y1="${f(ry + (fan.r0 + 8) * Math.sin(t))}" x2="${f(rx + (fan.r1 - 3) * Math.cos(t))}" y2="${f(ry + (fan.r1 - 3) * Math.sin(t))}" stroke="${INK}" stroke-width="0.9" stroke-opacity="0.7"/>`);
      }
      for (let k = 0; k <= 6; k++) {
        const t = ((-fan.half + 4 + (k * (2 * fan.half - 8)) / 6) * Math.PI) / 180;
        out.push(`<circle cx="${f(rx + (fan.r1 - 9) * Math.cos(t))}" cy="${f(ry + (fan.r1 - 9) * Math.sin(t))}" r="${k % 2 ? 1.3 : 1.9}" fill="${INK}"/>`);
      }
    }
    else {
      const r = 7 + i * 1.5;
      out.push(`<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${f(r + 6)}" fill="${PAPER}"/><circle cx="${f(p[0])}" cy="${f(p[1])}" r="${f(r)}" fill="${INK}"/>`);
    }
    const lx = p[0];
    out.push(`<text x="${f(lx)}" y="${f(baseY - 16)}" font-family="IBM Plex Mono" font-size="${T.mono}" fill="#6B665C" text-anchor="middle">${String(i + 1).padStart(2, "0")}</text>`);
    const lab = textBlock(lx, baseY + size * 0.75, s.label, { size, weight: 700, max: maxChars, lh: 1.18, anchor: "middle" });
    out.push(lab.svg);
    if (s.note) out.push(textBlock(lx, baseY + size * 0.75 + lab.height + 4, s.note, { size: noteSize, max: noteChars, lh: 1.25, anchor: "middle", fill: "#4A463F" }).svg);
  });
  return `<svg data-fit="28" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(spec.caption ?? "Sequence")}">${out.join("")}</svg>`;
}

// ---------- 3. cells: categories as the cells of a hindwing, numbered, with a legend ----------
export function cells(spec, { W = 960, H = 820, id = "cl", seed = 1, wingSVG } = {}) {
  const items = spec.items;
  const Wg = wing({ seed, kind: "hind", veins: items.length + 1 });
  const lit = items.map((it, i) => (it.state === "realized" ? i : null)).filter((v) => v !== null);
  const locked = items.map((it, i) => (it.state === "locked" ? i : null)).filter((v) => v !== null);
  const out = [defs(id)];
  const scale = 760, ox = W - 90, oy = 120, rot = -8;
  out.push(wingSVG(Wg, { scale, x: ox, y: oy, rotate: rot, flip: true, lit, locked, id: id + "w", border: "drawn" }));
  const ang = (rot * Math.PI) / 180, cs = Math.cos(ang), sn = Math.sin(ang);
  const toCanvas = (p) => [ox + scale * (-p[0] * cs - p[1] * sn), oy + scale * (-p[0] * sn + p[1] * cs)];
  const q = (v, t) => { const u = 1 - t; return [u * u * v.start[0] + 2 * u * t * v.ctrl[0] + t * t * v.end[0], u * u * v.start[1] + 2 * u * t * v.ctrl[1] + t * t * v.end[1]]; };
  items.forEach((_, i) => {
    const a = q(Wg.veins[i], 0.66), b = q(Wg.veins[i + 1], 0.66);
    const [x, y] = toCanvas([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]);
    out.push(`<circle cx="${f(x)}" cy="${f(y)}" r="19" fill="${PAPER}" stroke="${INK}" stroke-width="1.3"/><text x="${f(x)}" y="${f(y + 6)}" text-anchor="middle" font-family="IBM Plex Mono" font-size="${T.mono}" font-weight="500" fill="${INK}">${i + 1}</text>`);
  });
  let y = 70;
  items.forEach((it, i) => {
    out.push(`<text x="40" y="${f(y)}" font-family="IBM Plex Mono" font-size="${T.mono}" fill="#6B665C">${String(i + 1).padStart(2, "0")}</text>`);
    const b = textBlock(90, y, it.label, { size: T.label, weight: 700, max: 17, lh: 1.18 });
    out.push(b.svg);
    y += b.height;
    if (it.note) { const n2 = textBlock(90, y + 2, it.note, { size: T.note, max: 21, lh: 1.25, fill: "#4A463F" }); out.push(n2.svg); y += n2.height + 4; }
    y += 22;
  });
  return `<svg data-fit="28" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(spec.caption ?? "Categories")}">${out.join("")}</svg>`;
}

// ---------- 4. plan: footprints drawn as a floor plan, with dimension lines and a legend ----------
export function plan(spec, { W = 960, H = 820, id = "pl" } = {}) {
  const shapes = spec.shapes;
  const maxX = Math.max(...shapes.map((s) => s.x + s.w)), maxY = Math.max(...shapes.map((s) => s.y + s.h));
  const k = Math.min((W - 470) / maxX, (H - 250) / maxY);
  const ox = 90, oy = 120;
  const out = [defs(id)];
  const g = spec.grid ?? 1;
  for (let gx = 0; gx <= maxX + 0.01; gx += g) for (let gy = 0; gy <= maxY + 0.01; gy += g) out.push(`<circle cx="${f(ox + gx * k)}" cy="${f(oy + gy * k)}" r="1.4" fill="${INK}" fill-opacity="0.22"/>`);
  const dims = { top: 0, bottom: 0, left: 0, right: 0 };
  shapes.forEach((s, i) => {
    const x = ox + s.x * k, y = oy + s.y * k, w = s.w * k, h = s.h * k;
    const fill = s.state === "locked" ? `url(#${id}-hatch)` : s.state === "realized" ? MARIGOLD : POLLEN;
    // blend "multiply": overlaps deepen (two layers of light). blend "normal": the shape sits on top, so what's
    // left visible around it is the difference (e.g. registered drawn over built leaves the unregistered part).
    const normal = s.blend === "normal";
    if (normal) out.push(`<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="2" fill="${PAPER}"/>`);
    out.push(`<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="2" fill="${fill}" fill-opacity="${normal ? 0.9 : s.state === "realized" ? 0.62 : 0.9}"${normal ? "" : ' style="mix-blend-mode:multiply"'} stroke="${INK}" stroke-width="${s.dashed ? 1.4 : 2.4}" ${s.dashed ? 'stroke-dasharray="8 6"' : ""}/>`);
    for (const side of [].concat(s.dim ?? [])) {
      const off = 30 + dims[side]++ * 34;
      if (side === "top" || side === "bottom") {
        const yy = side === "bottom" ? oy + maxY * k + off : oy - off + 10;
        out.push(`<line x1="${f(x)}" y1="${f(yy)}" x2="${f(x + w)}" y2="${f(yy)}" stroke="${INK}" stroke-width="1"/>`);
        for (const xx of [x, x + w]) out.push(`<line x1="${f(xx - 6)}" y1="${f(yy + 6)}" x2="${f(xx + 6)}" y2="${f(yy - 6)}" stroke="${INK}" stroke-width="1.5"/>`);
        out.push(`<text x="${f(x + w / 2)}" y="${f(yy - 9)}" text-anchor="middle" font-family="IBM Plex Mono" font-size="${T.mono}" fill="${INK}">${esc(s.dimLabel ?? s.w + " m")}</text>`);
      } else {
        const xx = side === "right" ? ox + maxX * k + off : ox - off;
        out.push(`<line x1="${f(xx)}" y1="${f(y)}" x2="${f(xx)}" y2="${f(y + h)}" stroke="${INK}" stroke-width="1"/>`);
        for (const yy of [y, y + h]) out.push(`<line x1="${f(xx - 6)}" y1="${f(yy + 6)}" x2="${f(xx + 6)}" y2="${f(yy - 6)}" stroke="${INK}" stroke-width="1.5"/>`);
        out.push(`<text transform="translate(${f(xx + (side === "right" ? 20 : -10))} ${f(y + h / 2)}) rotate(-90)" text-anchor="middle" font-family="IBM Plex Mono" font-size="${T.mono}" fill="${INK}">${esc(s.dimLabelV ?? s.h + " m")}</text>`);
      }
    }
  });
  // Legend, to the right of the drawing
  let ly = oy;
  const lx = ox + maxX * k + 96;
  shapes.forEach((s, i) => {
    const fill = s.state === "locked" ? `url(#${id}-hatch)` : s.state === "realized" ? MARIGOLD : POLLEN;
    out.push(`<rect x="${f(lx)}" y="${f(ly)}" width="34" height="26" rx="2" fill="${fill}" fill-opacity="${s.state === "realized" ? 0.62 : 0.9}" stroke="${INK}" stroke-width="${s.dashed ? 1.3 : 2}" ${s.dashed ? 'stroke-dasharray="6 4"' : ""}/>`);
    const b = textBlock(lx, ly + 64, s.label, { size: T.label - 2, weight: 700, max: 13, lh: 1.18 });
    out.push(b.svg);
    let hh = b.height;
    if (s.note) { const n2 = textBlock(lx, ly + 64 + b.height, s.note, { size: T.note - 2, max: 17, lh: 1.25, fill: "#4A463F" }); out.push(n2.svg); hh += n2.height; }
    ly += 90 + hh;
  });
  out.push(`<g transform="translate(${f(lx + 22)} ${f(ly + 16)})"><circle r="20" fill="none" stroke="${INK}" stroke-width="1"/><path d="M0 -16 L5.5 5 L0 1.5 L-5.5 5 Z" fill="${INK}"/><text y="42" text-anchor="middle" font-family="IBM Plex Mono" font-size="14" fill="${INK}">N</text></g>`);
  return `<svg data-fit="28" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(spec.caption ?? "Plan")}">${out.join("")}</svg>`;
}

// ---------- 5. scale: horizontal bars, one hue, rounded data ends ----------
export function scale(spec, { W = 960, H = 820, id = "sc" } = {}) {
  const bars = spec.bars;
  const max = Math.max(...bars.map((b) => b.value)) * 1.08;
  const left = 270, right = W - 150;
  const rowH = Math.min(128, (H - 200) / bars.length);
  const top = Math.max(90, (H - rowH * bars.length) / 2);
  const out = [defs(id)];
  // baseline + quiet ticks
  out.push(`<line x1="${left}" y1="${top - 20}" x2="${left}" y2="${f(top + bars.length * rowH - 10)}" stroke="${INK}" stroke-width="1.4"/>`);
  for (let q = 1; q <= 4; q++) {
    const x = left + ((right - left) * q) / 4;
    out.push(`<line x1="${f(x)}" y1="${top - 20}" x2="${f(x)}" y2="${f(top + bars.length * rowH - 10)}" stroke="${INK}" stroke-opacity="0.12" stroke-width="1" stroke-dasharray="2 6"/>`);
  }
  bars.forEach((b, i) => {
    const y = top + i * rowH, h = Math.min(56, rowH - 36);
    const w = ((right - left) * b.value) / max;
    const fill = b.highlight ? MONARCH : MARIGOLD;
    out.push(`<path d="M${left} ${f(y)} H${f(left + w - 8)} Q${f(left + w)} ${f(y)} ${f(left + w)} ${f(y + 8)} V${f(y + h - 8)} Q${f(left + w)} ${f(y + h)} ${f(left + w - 8)} ${f(y + h)} H${left} Z" fill="${fill}" fill-opacity="${b.highlight ? 1 : 0.85}"/>`);
    out.push(textBlock(left - 22, y + h / 2 + (b.note ? -4 : 9), b.label, { size: T.label - 2, weight: 700, max: 12, anchor: "end" }).svg);
    if (b.note) out.push(textBlock(left - 22, y + h / 2 + 24, b.note, { size: T.note - 2, max: 18, anchor: "end", fill: "#4A463F" }).svg);
    out.push(`<text x="${f(left + w + 14)}" y="${f(y + h / 2 + 8)}" font-family="IBM Plex Mono" font-size="${T.mono + 4}" fill="${INK}">${esc(b.display ?? (spec.illustrative ? "" : b.value))}</text>`);
  });
  if (spec.illustrative || spec.unit) out.push(`<text x="${left}" y="${f(top + bars.length * rowH + 30)}" font-family="IBM Plex Mono" font-size="${T.mono}" fill="#6B665C">${spec.illustrative ? "ILLUSTRATIVE · " : ""}${esc(spec.unit ?? "")}</text>`);
  return `<svg data-fit="28" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(spec.caption ?? "Comparison")}">${out.join("")}</svg>`;
}

// ---------- 6. stack: translucent layers, bottom → top ----------
export function stack(spec, { W = 960, H = 820, id = "st" } = {}) {
  const layers = spec.layers;
  const n = layers.length;
  const out = [defs(id)];
  const x = 60, w = 400, gap = 16, top = 70, total = H - top - 90;
  const weights = layers.map((l) => l.share ?? 1), sum = weights.reduce((a, b) => a + b, 0);
  let y = top + total;
  layers.forEach((l, i) => {
    const h = (total - gap * (n - 1)) * (weights[i] / sum);
    y -= h;
    const state = l.state ?? (i === 0 ? "realized" : "possible");
    out.push(`<path d="${cellPath(x + i * 6, y, w - i * 12, h, { r: 16, bow: 3, lean: 8 })}" ${cellFill(state, id)} stroke="${INK}" stroke-width="1.3"/>`);
    out.push(textBlock(x + w + 50, y + h / 2 - (l.note ? 6 : -9), l.label, { size: T.label, weight: 700, max: 18 }).svg);
    if (l.note) out.push(textBlock(x + w + 50, y + h / 2 + 26, l.note, { size: T.note, max: 24, lh: 1.25, fill: "#4A463F" }).svg);
    out.push(vein([x + w + 6, y + h / 2], [x + w + 40, y + h / 2], { bend: 0, w0: 2.4, w1: 1, dot: false }));
    y -= gap;
  });
  return `<svg data-fit="28" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(spec.caption ?? "Layers")}">${out.join("")}</svg>`;
}
