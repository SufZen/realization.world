// Venation — generative wing drawing for the Realization visual language.
// A forewing abstraction: radial veins from a root, a discal cross-vein, cells between veins,
// a dark margin band with two rows of light dots. Deterministic per seed.

export const INK = "#1B1A17";
export const PAPER = "#FBF8F1";
export const MARIGOLD = "#FDCC33";
export const POLLEN = "#FEF3CF";
export const MONARCH = "#F4A019"; // what two layers of marigold become under multiply
export const MIST = "#D8D2C6";

export function hash(str) {
  let h = 2166136261;
  for (const c of String(str)) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f = (n) => Math.round(n * 10000) / 10000;
const lerp = (a, b, t) => a + (b - a) * t;
const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const mul = (a, k) => [a[0] * k, a[1] * k];
const len = (a) => Math.hypot(a[0], a[1]);
const norm = (a) => { const l = len(a) || 1; return [a[0] / l, a[1] / l]; };
const perp = (a) => [-a[1], a[0]];

// Catmull-Rom through points (closed), sampled densely.
function catmull(points, closed = true, per = 24) {
  const out = [];
  const n = points.length;
  const get = (i) => points[closed ? (i + n) % n : Math.max(0, Math.min(n - 1, i))];
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2);
    for (let s = 0; s < per; s++) {
      const t = s / per, t2 = t * t, t3 = t2 * t;
      out.push([
        0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
        0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
      ]);
    }
  }
  if (!closed) out.push(points[n - 1]);
  return out;
}

function arcTable(pts) {
  const acc = [0];
  for (let i = 1; i < pts.length; i++) acc.push(acc[i - 1] + len(sub(pts[i], pts[i - 1])));
  return acc;
}
function atLength(pts, acc, s) {
  const total = acc[acc.length - 1];
  s = Math.max(0, Math.min(total, s));
  let i = acc.findIndex((v) => v >= s);
  if (i <= 0) return { p: pts[0], i: 0 };
  const t = (s - acc[i - 1]) / (acc[i] - acc[i - 1] || 1);
  return { p: [lerp(pts[i - 1][0], pts[i][0], t), lerp(pts[i - 1][1], pts[i][1], t)], i };
}

const quad = (p0, c, p1, t) => { const u = 1 - t; return [u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0], u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1]]; };
const quadD = (p0, c, p1, t) => [2 * (1 - t) * (c[0] - p0[0]) + 2 * t * (p1[0] - c[0]), 2 * (1 - t) * (c[1] - p0[1]) + 2 * t * (p1[1] - c[1])];

const d = (pts, close = false) => "M" + pts.map((p) => `${f(p[0])} ${f(p[1])}`).join(" L") + (close ? " Z" : "");

/**
 * Build a wing in local units (root at 0,0; apex near x=1).
 * opts: { seed, veins (8–11), fill: 0..1 share of cells lit, deep: share of lit cells doubled,
 *         locked: share of cells hatched, lit: explicit array of lit cell indexes }
 */
export function wing(opts = {}) {
  const r = rng(opts.seed ?? 1);
  const j = (k) => (r() - 0.5) * k;
  const kind = opts.kind ?? "fore";
  const outline = kind === "hind"
    ? [
        [0, 0], [0.22, -0.06 + j(0.02)], [0.46 + j(0.02), -0.04], [0.64 + j(0.02), 0.05],
        [0.745 + j(0.02), 0.2], [0.755 + j(0.02), 0.365], [0.665 + j(0.02), 0.5],
        [0.5 + j(0.02), 0.6], [0.33, 0.62], [0.18, 0.52], [0.08, 0.32], [0.02, 0.14],
      ]
    : [
        [0, 0], [0.14 + j(0.02), -0.105], [0.46 + j(0.03), -0.215 + j(0.02)], [0.8 + j(0.03), -0.29 + j(0.02)],
        [0.985, -0.285 + j(0.02)], [1.025 + j(0.02), -0.17], [0.975 + j(0.02), 0.01 + j(0.02)],
        [0.84 + j(0.03), 0.18 + j(0.02)], [0.64 + j(0.02), 0.285 + j(0.02)], [0.41 + j(0.02), 0.235], [0.19, 0.12],
      ];
  const edge = catmull(outline, true, 28);
  const acc = arcTable(edge);
  const total = acc[acc.length - 1];
  const [fa, fb] = kind === "hind" ? [0.16, 0.8] : [0.2, 0.7];
  const sStart = total * fa, sEnd = total * fb;
  const nV = opts.veins ?? 9 + Math.floor(r() * 3);
  const veins = [];
  for (let i = 0; i < nV; i++) {
    const u = (i + 0.5 + j(0.18)) / nV;
    const end = atLength(edge, acc, lerp(sStart, sEnd, u)).p;
    // Veins leave a short root arc, fanning out.
    const rootT = i / (nV - 1);
    const start = kind === "hind"
      ? [0.03 + 0.02 * Math.sin(rootT * Math.PI), lerp(-0.01, 0.07, rootT)]
      : [0.035 + 0.03 * Math.sin(rootT * Math.PI), lerp(-0.035, 0.05, rootT)];
    const mid = mul(add(start, end), 0.5);
    const bow = mul(perp(norm(sub(end, start))), (0.035 + j(0.02)) * (rootT < 0.5 ? -1 : 1) * -1);
    const ctrl = add(mid, add(bow, [0.02, -0.02]));
    veins.push({ start, ctrl, end });
  }
  // Discal cross-vein closes a cell among the middle veins.
  const dA = 2, dB = Math.min(nV - 3, 6);
  const tCross = 0.42 + j(0.04);
  const crossPts = [];
  for (let i = dA; i <= dB; i++) crossPts.push(quad(veins[i].start, veins[i].ctrl, veins[i].end, tCross + (i - dA) * 0.012));
  // Cells between consecutive veins, from their inner closure out to the margin.
  const cells = [];
  const endS = veins.map((v) => { let best = 0, bd = 1e9; edge.forEach((p, k) => { const dd = len(sub(p, v.end)); if (dd < bd) { bd = dd; best = k; } }); return best; });
  for (let i = 0; i < nV - 1; i++) {
    const a = veins[i], b = veins[i + 1];
    const t0 = i >= dA && i < dB ? tCross + (i - dA) * 0.012 : 0.2;
    const t1 = i >= dA && i < dB ? tCross + (i + 1 - dA) * 0.012 : 0.2;
    const side = [];
    for (let k = 0; k <= 16; k++) side.push(quad(a.start, a.ctrl, a.end, lerp(t0, 1, k / 16)));
    let k0 = endS[i], k1 = endS[i + 1];
    const seg = [];
    if (k1 >= k0) for (let k = k0; k <= k1; k++) seg.push(edge[k]);
    else for (let k = k0; k <= k1 + edge.length; k++) seg.push(edge[k % edge.length]);
    const other = [];
    for (let k = 16; k >= 0; k--) other.push(quad(b.start, b.ctrl, b.end, lerp(t1, 1, k / 16)));
    cells.push([...side, ...seg, ...other]);
  }
  // Discal cell polygon.
  const discal = [];
  for (let k = 0; k <= 12; k++) discal.push(quad(veins[dA].start, veins[dA].ctrl, veins[dA].end, lerp(0.08, tCross, k / 12)));
  for (let i = dA; i <= dB; i++) discal.push(crossPts[i - dA]);
  for (let k = 12; k >= 0; k--) discal.push(quad(veins[dB].start, veins[dB].ctrl, veins[dB].end, lerp(0.08, tCross + (dB - dA) * 0.012, k / 12)));
  // Margin dots: two rows along the outer boundary.
  const dots = [];
  const band = opts.band ?? 0.034;
  const step = (sEnd - sStart) / (nV * 1.6);
  for (let s = sStart + step * 0.5, row = 0; s < sEnd - step * 0.5; s += step, row++) {
    const { p, i } = atLength(edge, acc, s);
    const tangent = norm(sub(edge[Math.min(i + 1, edge.length - 1)], edge[Math.max(i - 1, 0)]));
    const inward = perp(tangent); // outline runs clockwise in screen space, so perp points inward
    dots.push({ p: add(p, mul(inward, band * 0.34)), r: band * 0.13 });
    if (row % 2 === 0) dots.push({ p: add(add(p, mul(inward, band * 0.74)), mul(tangent, step * 0.5)), r: band * 0.09 });
  }
  // The margin runs along the outer boundary only; its inner edge is an inward offset of it.
  const i0 = Math.max(1, atLength(edge, acc, sStart - (sEnd - sStart) * 0.06).i);
  const i1 = Math.min(edge.length - 2, atLength(edge, acc, sEnd + (sEnd - sStart) * 0.04).i);
  const margin = edge.slice(i0, i1 + 1);
  const inner = margin.map((p, k) => {
    const a = margin[Math.max(0, k - 1)], b = margin[Math.min(margin.length - 1, k + 1)];
    return add(p, mul(perp(norm(sub(b, a))), band));
  });
  return { edge, veins, cells, discal, crossPts, dots, band, nV, r, margin, inner };
}

function taperedVein(v, w0, w1, steps = 28) {
  const left = [], right = [];
  for (let k = 0; k <= steps; k++) {
    const t = k / steps;
    const p = quad(v.start, v.ctrl, v.end, t);
    const n = perp(norm(quadD(v.start, v.ctrl, v.end, t)));
    const w = lerp(w0, w1, Math.pow(t, 0.7)) / 2;
    left.push(add(p, mul(n, w)));
    right.push(add(p, mul(n, -w)));
  }
  return d([...left, ...right.reverse()], true);
}

/**
 * Render a wing as an SVG <g>. Transform maps local units to canvas: scale, rotate (deg), x, y, flip.
 * lit: cell indexes (or a share 0..1) coloured marigold · deep: cells given a second marigold layer (monarch)
 * locked: hatched cells · border: "drawn" (paper band, double hairline, ink dots) or "band" (dark monarch band, light dots)
 */
export function wingSVG(W, { scale = 900, rotate = 0, x = 0, y = 0, id = "w", lit, deep = [], locked = [], construction = false, stroke = 1, dark = false, glow = true, border = "drawn", flip = false, discal = false, opacity = 1 } = {}) {
  const lineInk = dark && border === "drawn" ? "#EDE6D6" : INK;
  const tf = `translate(${f(x)} ${f(y)}) rotate(${f(rotate)}) scale(${f(flip ? -scale : scale)} ${f(scale)})`;
  const u = 1 / scale;
  const litSet = new Set(Array.isArray(lit) ? lit : W.cells.map((_, i) => i).filter(() => W.r() < (lit ?? 0.5)));
  const deepSet = new Set(deep), lockSet = new Set(locked);
  const out = [];
  out.push(`<defs>
    <clipPath id="${id}-clip"><path d="${d(W.edge, true)}"/></clipPath>
    <pattern id="${id}-hatch" width="${f(7 * u)}" height="${f(7 * u)}" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="${f(7 * u)}" stroke="#9E9788" stroke-width="${f(1 * u)}"/>
    </pattern>
    <radialGradient id="${id}-glow" cx="0.3" cy="0.45" r="0.8">
      <stop offset="0" stop-color="#FFFBEA"/>
      <stop offset="1" stop-color="${POLLEN}"/>
    </radialGradient>
  </defs>`);
  out.push(`<g transform="${tf}" opacity="${opacity}">`);
  out.push(`<path d="${d(W.edge, true)}" fill="${glow ? `url(#${id}-glow)` : POLLEN}"/>`);
  out.push(`<g clip-path="url(#${id}-clip)">`);
  W.cells.forEach((c, i) => {
    if (lockSet.has(i)) out.push(`<path d="${d(c, true)}" fill="url(#${id}-hatch)"/>`);
    else if (litSet.has(i)) {
      out.push(`<path d="${d(c, true)}" fill="${MARIGOLD}" fill-opacity="0.8"/>`);
      if (deepSet.has(i)) out.push(`<path d="${d(c, true)}" fill="${MARIGOLD}" fill-opacity="0.85" style="mix-blend-mode:multiply"/>`);
    }
  });
  if (discal) out.push(`<path d="${d(W.discal, true)}" fill="${MARIGOLD}" fill-opacity="0.8"/>`);
  // Veins, tapered from root to margin
  W.veins.forEach((v) => out.push(`<path d="${taperedVein(v, 3.2 * stroke * u, 0.8 * stroke * u)}" fill="${INK}"/>`));
  out.push(`<path d="${d(W.crossPts)}" fill="none" stroke="${INK}" stroke-width="${f(1.3 * stroke * u)}" stroke-linecap="round"/>`);
  // Margin
  if (border === "band") {
    // The monarch's dark edge runs all the way round, so no band ends show near the root.
    out.push(`<path d="${d(W.edge, true)}" fill="none" stroke="${INK}" stroke-width="${f(W.band * 2)}" stroke-linejoin="round"/>`);
    W.dots.forEach((o) => out.push(`<circle cx="${f(o.p[0])}" cy="${f(o.p[1])}" r="${f(o.r)}" fill="#F7F1E3"/>`));
  } else {
    out.push(`<path d="${d(W.margin)}" fill="none" stroke="${PAPER}" stroke-width="${f(W.band * 2)}" stroke-linecap="round" stroke-linejoin="round"/>`);
    out.push(`<path d="${d(W.inner)}" fill="none" stroke="${INK}" stroke-width="${f(0.9 * u)}"/>`);
    W.dots.forEach((o) => out.push(`<circle cx="${f(o.p[0])}" cy="${f(o.p[1])}" r="${f(o.r * 0.7)}" fill="${INK}"/>`));
  }
  out.push(`</g>`);
  out.push(`<path d="${d(W.edge, true)}" fill="none" stroke="${INK}" stroke-width="${f(1.3 * u)}"/>`);
  if (construction) {
    for (const rr of [0.25, 0.5, 0.75, 1.0]) out.push(`<circle cx="0" cy="0" r="${rr}" fill="none" stroke="${lineInk}" stroke-opacity="0.2" stroke-width="${f(0.8 * u)}" stroke-dasharray="${f(2 * u)} ${f(6 * u)}"/>`);
    out.push(`<circle cx="0" cy="0" r="${f(3.5 * u)}" fill="${lineInk}"/>`);
  }
  out.push(`</g>`);
  return out.join("\n");
}
