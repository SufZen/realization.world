// Diagram grammar for Realization carousels (docs/content-engine/visual-language.md §6).
// Flat, sharp and direct: black, white and marigold, Poppins labels, IBM Plex Mono for measurements.
// Every function takes a spec and { W, H, id, style } and returns an SVG string that the slide crops to its drawing
// (data-fit). `style` is the carousel style: "term" (default), "site" or "grid"; it changes the construction marks,
// never the meaning.

export const K = "#000", PAPER = "#FFFFFF", Y = "#FDCC33", GREY = "#555555", RULE = "#D9D9D9";
export const T = { title: 32, label: 30, note: 23, mono: 19 };

const f = (n) => Math.round(n * 100) / 100;
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

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
function text(x, y, s, { size = T.note, lh = 1.22, max = 24, weight = 400, fill = K, anchor = "start", mono = false } = {}) {
  const lines = wrap(s, max);
  const fam = mono ? "IBM Plex Mono" : "Poppins";
  const ls = mono ? ' letter-spacing="1.5"' : "";
  return {
    svg: `<text x="${f(x)}" y="${f(y)}" font-family="${fam}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}"${ls}>${lines.map((l, i) => `<tspan x="${f(x)}" dy="${i ? f(size * lh) : 0}">${esc(mono ? l.toUpperCase() : l)}</tspan>`).join("")}</text>`,
    height: lines.length * size * lh,
  };
}
const defs = (id) => `<defs><pattern id="${id}-h" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="14" height="14" fill="${PAPER}"/><line x1="0" y1="0" x2="0" y2="14" stroke="${K}" stroke-width="2.4"/></pattern></defs>`;
// State of an area: realized = marigold (the answer), locked = hatched, possible (default) = white.
const fill = (state, id) => (state === "realized" ? Y : state === "locked" ? `url(#${id}-h)` : PAPER);
const svg = (W, H, label, body) => `<svg data-fit="30" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(label)}">${body}</svg>`;
// Architectural grid bubble with a dash-dot axis (site style).
const bubble = (x, y, label, y2) => `<line x1="${f(x)}" y1="${f(y + 24)}" x2="${f(x)}" y2="${f(y2)}" stroke="${K}" stroke-width="1.2" stroke-dasharray="16 6 3 6"/><circle cx="${f(x)}" cy="${f(y)}" r="24" fill="${PAPER}" stroke="${K}" stroke-width="2"/><text x="${f(x)}" y="${f(y + 8)}" text-anchor="middle" font-family="IBM Plex Mono" font-size="22" font-weight="500">${esc(label)}</text>`;

// ---------- compare: two options side by side, rows aligned by meaning; the answer is marigold ----------
export function compare(spec, { W = 960, H = 820, id = "cmp", style = "term" } = {}) {
  const L = spec.left.items, R = spec.right.items, rows = Math.max(L.length, R.length);
  const hl = new Set((spec.highlight ?? []).map(String));
  const gap = 48, cw = (W - gap) / 2, top = 120, rowH = 168, cellH = 144;
  const out = [defs(id)];
  if (style === "site") out.push(bubble(W / 2, 30, "A", top + rows * rowH));
  else out.push(`<line x1="${W / 2}" y1="${top - 20}" x2="${W / 2}" y2="${top + rows * rowH - 24}" stroke="${K}" stroke-width="${style === "grid" ? 1.2 : 3}"/>`);
  const side = (items, x, key, title) => {
    const winner = items.some((_, i) => hl.has(`${key}${i}`)) || items.some((it) => it.state === "realized");
    out.push(text(x, 64, title, { size: T.title, weight: 800, max: 22 }).svg);
    out.push(`<rect x="${f(x)}" y="86" width="${f(cw)}" height="${winner ? 10 : 3}" fill="${winner ? Y : K}"/>`);
    items.forEach((it, i) => {
      const y = top + i * rowH;
      const state = hl.has(`${key}${i}`) ? "realized" : it.state ?? "possible";
      out.push(`<rect x="${f(x)}" y="${f(y)}" width="${f(cw)}" height="${cellH}" fill="${fill(state, id)}" stroke="${K}" stroke-width="${state === "possible" ? 2.5 : 0}"/>`);
      if (style === "grid") out.push(`<text x="${f(x + 22)}" y="${f(y + 36)}" font-family="IBM Plex Mono" font-size="${T.mono}" fill="${state === "realized" ? K : GREY}">${String(i + 1).padStart(2, "0")}</text>`);
      const lab = text(0, 0, it.label, { size: T.label, weight: 800, max: 20 });
      const note = it.note ? text(0, 0, it.note, { size: T.note, max: 28 }) : null;
      const bh = lab.height + (note ? note.height + 6 : 0);
      const ty = y + cellH / 2 - bh / 2 + T.label * 0.8 + (style === "grid" ? 10 : 0);
      const boxed = state === "locked";
      if (boxed) out.push(`<rect x="${f(x + 14)}" y="${f(ty - T.label)}" width="${f(cw - 28)}" height="${f(bh + 18)}" fill="${PAPER}"/>`);
      out.push(text(x + 26, ty, it.label, { size: T.label, weight: 800, max: 20 }).svg);
      if (note) out.push(text(x + 26, ty + lab.height + 4, it.note, { size: T.note, max: 28, fill: state === "realized" ? K : GREY }).svg);
    });
  };
  side(L, 0, "L", spec.left.title);
  side(R, cw + gap, "R", spec.right.title);
  return svg(W, top + rows * rowH, spec.caption ?? `${spec.left.title} vs ${spec.right.title}`, out.join(""));
}

// ---------- flight: a process in steps; dashed where you wait; the arrival is marigold ----------
export function flight(spec, { W = 960, id = "fl", style = "term" } = {}) {
  const steps = spec.steps, n = steps.length, out = [defs(id)];
  const colW = W / n;
  const maxChars = Math.max(8, Math.floor((colW - 14) / (T.label * 0.58)));
  const noteChars = Math.max(10, Math.floor((colW - 10) / (T.note * 0.5)));
  if (style === "grid") {
    // Swiss columns: a rule, a big number, the label, the note. The arrival carries the marigold rule.
    steps.forEach((s, i) => {
      const x = i * colW + (i ? 10 : 0), w = colW - 20, last = i === n - 1;
      out.push(`<rect x="${f(x)}" y="0" width="${f(w)}" height="${last ? 16 : 4}" fill="${last ? Y : K}"/>`);
      if (s.wait) out.push(`<text x="${f(x)}" y="-14" font-family="IBM Plex Mono" font-size="${T.mono}" fill="${GREY}">WAIT</text>`);
      out.push(`<text x="${f(x)}" y="118" font-family="Poppins" font-weight="800" font-size="104" fill="${K}">${i + 1}</text>`);
      const lab = text(x, 176, s.label, { size: T.label, weight: 800, max: maxChars });
      out.push(lab.svg);
      if (s.note) out.push(text(x, 176 + lab.height + 8, s.note, { size: T.note, max: noteChars, fill: GREY }).svg);
    });
    return svg(W, 420, spec.caption ?? "Sequence", out.join(""));
  }
  // term and site: nodes on a heavy baseline; each step is a block that grows toward the arrival.
  const base = 300;
  const x = (i) => colW * i + colW / 2;
  for (let i = 0; i < n - 1; i++) {
    const dashed = !!steps[i + 1].wait;
    out.push(`<line x1="${f(x(i))}" y1="${base}" x2="${f(x(i + 1))}" y2="${base}" stroke="${K}" stroke-width="${dashed ? 4 : 6}" ${dashed ? 'stroke-dasharray="4 12" stroke-linecap="round"' : ""}/>`);
    if (dashed) out.push(`<text x="${f((x(i) + x(i + 1)) / 2)}" y="${base - 22}" text-anchor="middle" font-family="IBM Plex Mono" font-size="${T.mono}" fill="${GREY}">WAIT</text>`);
  }
  steps.forEach((s, i) => {
    const last = i === n - 1, cx = x(i);
    if (style === "site") out.push(bubble(cx, 40, String(i + 1), base - 40));
    const size = last ? 76 : 30 + i * 6;
    out.push(`<rect x="${f(cx - size / 2)}" y="${f(base - size / 2)}" width="${f(size)}" height="${f(size)}" fill="${last ? Y : K}" stroke="${K}" stroke-width="${last ? 3 : 0}"/>`);
    if (style !== "site") out.push(`<text x="${f(cx)}" y="${base + 78}" text-anchor="middle" font-family="IBM Plex Mono" font-size="${T.mono}" fill="${GREY}">${String(i + 1).padStart(2, "0")}</text>`);
    const ly = base + (style === "site" ? 86 : 122);
    const lab = text(cx, ly, s.label, { size: T.label, weight: 800, max: maxChars, anchor: "middle" });
    out.push(lab.svg);
    if (s.note) out.push(text(cx, ly + lab.height + 6, s.note, { size: T.note, max: noteChars, anchor: "middle", fill: GREY }).svg);
  });
  return svg(W, 600, spec.caption ?? "Sequence", out.join(""));
}

// ---------- cells: a taxonomy as numbered tiles ----------
export function cells(spec, { W = 960, id = "cl", style = "term" } = {}) {
  const items = spec.items, n = items.length, cols = n <= 4 ? 2 : 3, rows = Math.ceil(n / cols);
  const gap = 20, tw = (W - gap * (cols - 1)) / cols, th = cols === 2 ? 230 : 250;
  const out = [defs(id)];
  items.forEach((it, i) => {
    const x = (i % cols) * (tw + gap), y = Math.floor(i / cols) * (th + gap), st = it.state ?? "possible";
    if (style === "grid") out.push(`<rect x="${f(x)}" y="${f(y)}" width="${f(tw)}" height="${st === "realized" ? 16 : 4}" fill="${st === "realized" ? Y : K}"/>`);
    else out.push(`<rect x="${f(x)}" y="${f(y)}" width="${f(tw)}" height="${th}" fill="${fill(st, id)}" stroke="${K}" stroke-width="${st === "possible" ? 2.5 : 0}"/>`);
    const pad = style === "grid" ? 0 : 24;
    if (st === "locked" && style !== "grid") out.push(`<rect x="${f(x + 14)}" y="${f(y + 14)}" width="${f(tw - 28)}" height="${th - 28}" fill="${PAPER}"/>`);
    out.push(`<text x="${f(x + pad)}" y="${f(y + 86)}" font-family="Poppins" font-weight="800" font-size="64" fill="${K}">${String(i + 1).padStart(2, "0")}</text>`);
    const lab = text(x + pad, y + 138, it.label, { size: T.label - 2, weight: 800, max: Math.floor((tw - 2 * pad) / 16) });
    out.push(lab.svg);
    if (it.note) out.push(text(x + pad, y + 138 + lab.height + 4, it.note, { size: T.note - 1, max: Math.floor((tw - 2 * pad) / 11.5), fill: st === "realized" ? K : GREY }).svg);
    if (st === "locked") out.push(`<text x="${f(x + tw - pad)}" y="${f(y + 52)}" text-anchor="end" font-family="IBM Plex Mono" font-size="${T.mono - 2}" fill="${GREY}">LOCKED</text>`);
  });
  return svg(W, rows * th + (rows - 1) * gap, spec.caption ?? "Categories", out.join(""));
}

// ---------- plan: anything spatial, drawn as a measured plan with dimension lines and a legend ----------
export function plan(spec, { W = 960, H = 820, id = "pl", style = "site" } = {}) {
  const shapes = spec.shapes;
  const maxX = Math.max(...shapes.map((s) => s.x + s.w)), maxY = Math.max(...shapes.map((s) => s.y + s.h));
  const k = Math.min((W - 470) / maxX, (H - 250) / maxY);
  const ox = 90, oy = 120, out = [defs(id)];
  const g = spec.grid ?? 1;
  for (let gx = 0; gx <= maxX + 0.01; gx += g) for (let gy = 0; gy <= maxY + 0.01; gy += g) out.push(`<circle cx="${f(ox + gx * k)}" cy="${f(oy + gy * k)}" r="1.6" fill="${K}" fill-opacity="0.25"/>`);
  const dims = { top: 0, bottom: 0, left: 0, right: 0 };
  shapes.forEach((s) => {
    const x = ox + s.x * k, y = oy + s.y * k, w = s.w * k, h = s.h * k;
    // Later shapes cover earlier ones; `blend: "multiply"` lets an overlap show through instead.
    const multiply = s.blend === "multiply";
    out.push(`<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="${fill(s.state, id)}"${multiply ? ' style="mix-blend-mode:multiply" fill-opacity="0.85"' : ""} stroke="${K}" stroke-width="${s.dashed ? 2 : 3.5}" ${s.dashed ? 'stroke-dasharray="12 8"' : ""}/>`);
    for (const side of [].concat(s.dim ?? [])) {
      const off = 34 + dims[side]++ * 36;
      if (side === "top" || side === "bottom") {
        const yy = side === "bottom" ? oy + maxY * k + off : oy - off + 10;
        out.push(`<line x1="${f(x)}" y1="${f(yy)}" x2="${f(x + w)}" y2="${f(yy)}" stroke="${K}" stroke-width="1.4"/>`);
        for (const xx of [x, x + w]) out.push(`<line x1="${f(xx - 7)}" y1="${f(yy + 7)}" x2="${f(xx + 7)}" y2="${f(yy - 7)}" stroke="${K}" stroke-width="2.4"/>`);
        out.push(`<text x="${f(x + w / 2)}" y="${f(yy - 10)}" text-anchor="middle" font-family="IBM Plex Mono" font-size="${T.mono}" fill="${K}">${esc((s.dimLabel ?? s.w + " m").toUpperCase())}</text>`);
      } else {
        const xx = side === "right" ? ox + maxX * k + off : ox - off;
        out.push(`<line x1="${f(xx)}" y1="${f(y)}" x2="${f(xx)}" y2="${f(y + h)}" stroke="${K}" stroke-width="1.4"/>`);
        for (const yy of [y, y + h]) out.push(`<line x1="${f(xx - 7)}" y1="${f(yy + 7)}" x2="${f(xx + 7)}" y2="${f(yy - 7)}" stroke="${K}" stroke-width="2.4"/>`);
        out.push(`<text transform="translate(${f(xx + (side === "right" ? 22 : -10))} ${f(y + h / 2)}) rotate(-90)" text-anchor="middle" font-family="IBM Plex Mono" font-size="${T.mono}" fill="${K}">${esc((s.dimLabelV ?? s.h + " m").toUpperCase())}</text>`);
      }
    }
  });
  let ly = oy;
  const lx = ox + maxX * k + 100;
  shapes.forEach((s) => {
    out.push(`<rect x="${f(lx)}" y="${f(ly)}" width="40" height="30" fill="${fill(s.state, id)}" stroke="${K}" stroke-width="${s.dashed ? 2 : 3}" ${s.dashed ? 'stroke-dasharray="7 5"' : ""}/>`);
    const b = text(lx, ly + 70, s.label, { size: T.label - 2, weight: 800, max: 12 });
    out.push(b.svg);
    let hh = b.height;
    if (s.note) { const n2 = text(lx, ly + 70 + b.height, s.note, { size: T.note - 2, max: 16, fill: GREY }); out.push(n2.svg); hh += n2.height; }
    ly += 96 + hh;
  });
  out.push(`<g transform="translate(${f(lx + 22)} ${f(ly + 10)})"><circle r="22" fill="none" stroke="${K}" stroke-width="1.6"/><path d="M0 -18 L6 6 L0 2 L-6 6 Z" fill="${K}"/><text y="46" text-anchor="middle" font-family="IBM Plex Mono" font-size="16">N</text></g>`);
  return svg(W, H, spec.caption ?? "Plan", out.join(""));
}

// ---------- scale: magnitudes as columns; one marigold column for the one the argument is about ----------
export function scale(spec, { W = 960, id = "sc" } = {}) {
  const bars = spec.bars, n = bars.length, max = Math.max(...bars.map((b) => b.value));
  const base = 560, top = 90, gap = 32, bw = (W - gap * (n - 1)) / n;
  const out = [defs(id)];
  bars.forEach((b, i) => {
    const h = Math.max(14, ((base - top) * b.value) / max), x = i * (bw + gap);
    out.push(`<rect x="${f(x)}" y="${f(base - h)}" width="${f(bw)}" height="${f(h)}" fill="${b.highlight ? Y : K}"/>`);
    const shown = b.display ?? (spec.illustrative ? "" : String(b.value));
    out.push(`<text x="${f(x)}" y="${f(base - h - 18)}" font-family="Poppins" font-weight="800" font-size="${T.label + 2}" fill="${K}">${esc(b.label)}${shown ? `<tspan font-weight="400" fill="${GREY}"> ${esc(shown)}</tspan>` : ""}</text>`);
    if (b.note) out.push(text(x, base + 42, b.note, { size: T.note, max: Math.floor(bw / 11.5), fill: K }).svg);
  });
  out.push(`<line x1="0" y1="${base}" x2="${W}" y2="${base}" stroke="${K}" stroke-width="3"/>`);
  if (spec.illustrative || spec.unit) out.push(`<text x="0" y="${base + 130}" font-family="IBM Plex Mono" font-size="${T.mono}" letter-spacing="1.5" fill="${GREY}">${spec.illustrative ? "ILLUSTRATIVE · " : ""}${esc((spec.unit ?? "").toUpperCase())}</text>`);
  return svg(W, base + 150, spec.caption ?? "Comparison", out.join(""));
}

// ---------- stack: layers bottom → top, heights by share ----------
export function stack(spec, { W = 960, H = 760, id = "st" } = {}) {
  const layers = spec.layers, n = layers.length, gap = 10, w = 470, total = H - 40;
  const sum = layers.reduce((a, l) => a + (l.share ?? 1), 0);
  const out = [defs(id)];
  let y = total;
  layers.forEach((l, i) => {
    const h = ((total - gap * (n - 1)) * (l.share ?? 1)) / sum;
    y -= h;
    const st = l.state ?? (i === 0 ? "realized" : "possible");
    out.push(`<rect x="0" y="${f(y)}" width="${w}" height="${f(h)}" fill="${fill(st, id)}" stroke="${K}" stroke-width="${st === "possible" ? 2.5 : 0}"/>`);
    out.push(`<line x1="${w + 10}" y1="${f(y + h / 2)}" x2="${w + 44}" y2="${f(y + h / 2)}" stroke="${K}" stroke-width="3"/>`);
    out.push(text(w + 62, y + h / 2 - (l.note ? 6 : -10), l.label, { size: T.label, weight: 800, max: 16 }).svg);
    if (l.note) out.push(text(w + 62, y + h / 2 + 28, l.note, { size: T.note, max: 22, fill: GREY }).svg);
    y -= gap;
  });
  return svg(W, total + 10, spec.caption ?? "Layers", out.join(""));
}
