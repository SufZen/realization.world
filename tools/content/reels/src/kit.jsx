// Realization motion kit: the Term sheet visual language (docs/content-engine/visual-language.md) set in motion.
// Every reel is built from these few primitives, cut on a 120 BPM grid: one beat = 15 frames at 30 fps.
import { loadFont } from "@remotion/fonts";
import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const fonts = [
  ["Poppins", "poppins-regular.woff2", "400"],
  ["Poppins", "poppins-bold.woff2", "700"],
  ["Poppins", "poppins-extrabold.woff2", "800"],
  ["Plex", "ibm-plex-mono-regular.woff2", "400"],
  ["Plex", "ibm-plex-mono-medium.woff2", "500"],
];
fonts.forEach(([family, file, weight]) => loadFont({ family, url: staticFile(`fonts/${file}`), weight }));

export const Y = "#FDCC33";
export const K = "#000000";
export const W = "#FFFFFF";
export const G = "#555555";
export const BEAT = 15;
export const b = (n) => Math.round(n * BEAT);
export const X0 = 90; // left edge of the type
export const WIDTH = 880; // measure, clear of the platform buttons on the right

export const ease = Easing.bezier(0.16, 1, 0.3, 1);
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const prog = (f, at, dur, easing = ease) => interpolate(f, [at, at + dur], [0, 1], { ...clamp, easing });

export const display = { fontFamily: "Poppins", fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 0.94 };
export const body = { fontFamily: "Poppins", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.12 };
export const mono = { fontFamily: "Plex", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase" };

// A shot: a full-bleed ground with a slow push-in so nothing ever sits dead still.
export const Shot = ({ bg = W, color = K, children, push = 0.03, style }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: bg, color, overflow: "hidden" }}>
      <AbsoluteFill style={{ scale: String(interpolate(f, [0, durationInFrames], [1, 1 + push], clamp)), ...style }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// Absolutely placed block.
export const At = ({ x = X0, y, w = WIDTH, children, style }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, ...style }}>{children}</div>
);

// Type that lands: a quick overshoot in scale with an instant appearance, the way a heavy word hits the page.
export const Slam = ({ at = 0, from = 1.28, dur = 8, shake = 0, origin = "left bottom", children, style }) => {
  const f = useCurrentFrame();
  if (f < at) return <span style={{ ...style, visibility: "hidden" }}>{children}</span>;
  const p = prog(f, at, dur);
  const s = shake ? interpolate(f, [at + dur - 2, at + dur, at + dur + 2, at + dur + 4], [0, shake, -shake * 0.6, 0], clamp) : 0;
  return (
    <span style={{ display: "inline-block", transformOrigin: origin, scale: String(from + (1 - from) * p), translate: `${s}px 0px`, ...style }}>{children}</span>
  );
};

// Words that slam in one after another.
export const Words = ({ text, at = 0, step = 5, style, wordStyle, highlight = {} }) => (
  <div style={style}>
    {text.split(" ").map((w, i) => (
      <React.Fragment key={i}>
        <Slam at={at + i * step} style={{ ...wordStyle, ...(highlight[w] || {}) }}>{w}</Slam>{" "}
      </React.Fragment>
    ))}
  </div>
);

// A line that rises out of a mask: for supporting text.
export const Rise = ({ at = 0, dur = 12, children, style }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, dur);
  return (
    <div style={{ overflow: "hidden", paddingBottom: "0.12em" }}>
      <div style={{ translate: `0px ${(1 - p) * 110}%`, opacity: f < at ? 0 : 1, ...style }}>{children}</div>
    </div>
  );
};

// A slab of colour that wipes across and carries its text.
export const Slab = ({ at = 0, dur = 9, bg = K, color = W, pad = "14px 26px 22px", children, style, from = "left" }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, dur);
  const clip = from === "left" ? `inset(0 ${(1 - p) * 100}% 0 0)` : `inset(0 0 0 ${(1 - p) * 100}%)`;
  return (
    <div style={{ display: "inline-block", background: bg, color, padding: pad, clipPath: clip, visibility: f < at ? "hidden" : "visible", ...style }}>
      <div style={{ translate: `${(1 - p) * -40}px 0px` }}>{children}</div>
    </div>
  );
};

// Text typed character by character with a block caret.
export const Typed = ({ text, at = 0, cps = 22, caret = true, style }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = Math.max(0, Math.floor(((f - at) / fps) * cps));
  const done = n >= text.length;
  const blink = done ? Math.floor((f - at) / 8) % 2 === 0 : true;
  return (
    <span style={style}>
      {f < at ? "" : text.slice(0, n)}
      {caret && f >= at && (!done || blink) ? <span style={{ display: "inline-block", width: "0.55em", height: "0.9em", background: "currentColor", translate: "0.08em 0.12em" }} /> : null}
    </span>
  );
};
export const typedEnd = (text, at, cps = 22, fps = 30) => at + Math.ceil((text.length / cps) * fps);

// Frames at which each typed character lands, for tick sounds (every third character keeps it musical).
export const typedTicks = (text, at, cps = 22, fps = 30, every = 3) =>
  [...text].map((_, i) => at + Math.floor(((i + 1) / cps) * fps)).filter((_, i) => i % every === 0);

// SVG stroke that plots on.
export const draw = (f, at, dur = 12) => {
  const p = prog(f, at, dur, Easing.bezier(0.45, 0, 0.2, 1));
  return { pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p, opacity: f < at ? 0 : 1 };
};

// Black diagonal hatch: locked, blocked, paid for but not priced.
export const HatchDef = ({ id = "hatch", ink = K, ground = W, size = 22, weight = 8 }) => (
  <pattern id={id} patternUnits="userSpaceOnUse" width={size} height={size} patternTransform="rotate(45)">
    <rect width={size} height={size} fill={ground} />
    <line x1="0" y1="0" x2="0" y2={size} stroke={ink} strokeWidth={weight} />
  </pattern>
);

// A rectangle that fills with hatch (or colour) as a sweep from left to right.
export const Sweep = ({ at, dur = 10, x, y, w, h, fill = "url(#hatch)", dir = "right" }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, dur);
  if (f < at) return null;
  if (dir === "down") return <rect x={x} y={y} width={w} height={h * p} fill={fill} />;
  if (dir === "up") return <rect x={x} y={y + h * (1 - p)} width={w} height={h * p} fill={fill} />;
  return <rect x={x} y={y} width={w * p} height={h} fill={fill} />;
};

// A rubber stamp: lands big, settles with a jolt.
export const Stamp = ({ at, children, rotate = -6, color = K, style }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = prog(f, at, 6, Easing.bezier(0.3, 0, 0.2, 1));
  const jolt = interpolate(f, [at + 6, at + 8, at + 10], [0, 7, 0], clamp);
  return (
    <div style={{ display: "inline-block", border: `9px solid ${color}`, color, padding: "10px 26px 16px", rotate: `${rotate}deg`, scale: String(2.2 - 1.2 * p), opacity: Math.min(1, p * 2.5), translate: `0px ${jolt}px`, ...display, ...style }}>
      {children}
    </div>
  );
};

// A strike line drawn across whatever it wraps.
export const Strike = ({ at, dur = 7, color = Y, thickness = 18, children, angle = -4 }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, dur);
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      {children}
      <span style={{ position: "absolute", left: "-4%", top: "52%", height: thickness, width: `${108 * p}%`, background: color, rotate: `${angle}deg`, transformOrigin: "left center", opacity: f < at ? 0 : 1 }} />
    </span>
  );
};

// A number that runs up to its value.
export const Count = ({ at, dur = 20, to, from = 0, format = (v) => String(Math.round(v)), style }) => {
  const f = useCurrentFrame();
  const v = interpolate(f, [at, at + dur], [from, to], { ...clamp, easing: Easing.bezier(0.2, 0, 0.1, 1) });
  return <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>{format(v)}</span>;
};

// The butterfly mark, small, never recoloured.
export const Mark = ({ size = 84, plate = false, style }) =>
  plate ? (
    <div style={{ width: size * 1.5, height: size * 1.5, background: Y, display: "grid", placeItems: "center", ...style }}>
      <Img src={staticFile("mark.png")} style={{ width: size, height: size }} />
    </div>
  ) : (
    <Img src={staticFile("mark.png")} style={{ width: size, height: size, ...style }} />
  );

// A panel that sweeps across the last frames of a shot, so a cut into a darker shot reads as one move.
export const WipeOut = ({ color = K, frames = 7, from = "right" }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(f, [durationInFrames - frames, durationInFrames], [0, 1], { ...clamp, easing: Easing.bezier(0.7, 0, 0.3, 1) });
  if (p <= 0) return null;
  return <AbsoluteFill style={{ background: color, clipPath: from === "right" ? `inset(0 0 0 ${(1 - p) * 100}%)` : `inset(0 ${(1 - p) * 100}% 0 0)` }} />;
};

export const Tag = ({ children, color = G, style }) => <div style={{ ...mono, fontSize: 26, color, ...style }}>{children}</div>;

// Sound: an effect on a frame, or the bed under the whole reel.
export const Sfx = ({ name, at, volume = 0.8 }) => (
  <Sequence from={Math.max(0, at)} layout="none" durationInFrames={60}>
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
  </Sequence>
);
export const Bed = ({ src, volume = 0.55 }) => <Audio src={staticFile(src)} volume={volume} />;

// The closing card every reel shares: the rule on black, a marigold rule line, one invitation, the mark.
export const Close = ({ rule, invite, at = 0, bg = K, color = W, accent = Y, ruleSize = 84, children }) => {
  const f = useCurrentFrame();
  const line = prog(f, at + b(2), 14);
  return (
    <Shot bg={bg} color={color} push={0.015}>
      {children}
      <At y={430}>
        <Words text={rule} at={at + 4} step={3} style={{ ...display, fontSize: ruleSize, lineHeight: 1.0 }} />
        <div style={{ height: 16, width: 360 * line, background: accent, marginTop: 44 }} />
        <div style={{ marginTop: 44 }}>
          <Rise at={at + b(3)} style={{ ...body, fontWeight: 400, fontSize: 44, opacity: 0.92 }}>{invite}</Rise>
        </div>
      </At>
      <At y={1440} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Rise at={at + b(4)} style={{ ...mono, fontSize: 30 }}>realization.world</Rise>
        <div style={{ opacity: prog(f, at + b(4), 10) }}>
          <Mark size={80} plate={bg === K} />
        </div>
      </At>
    </Shot>
  );
};
