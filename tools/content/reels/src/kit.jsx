// Realization motion kit: the Term sheet visual language (docs/content-engine/visual-language.md) set in motion,
// within the readability rules of docs/content-engine/quality.md. Motion is calm and serves reading: things arrive
// once, early in a scene, and then hold still long enough to be read. Scene lengths come from src/pace.mjs, never
// from a hand-set number, and sound effects are declared per scene in the spec (one at most), never inside a scene.
import { loadFont } from "@remotion/fonts";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import React from "react";
import { AbsoluteFill, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { MAX_SFX_VOLUME, XFADE, plan } from "./pace.mjs";

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
export const X0 = 90; // left edge of the type
export const WIDTH = 880; // measure, clear of the platform buttons on the right

// Type sizes on a 1080 × 1920 frame. Nothing smaller than `label`, and anything that carries meaning (not just a
// caption on a drawing) at `support` or larger: a reel is read on a phone at about a third of this size.
export const SIZE = { hero: 200, h1: 112, h2: 84, body: 56, support: 44, label: 38 };

export const ease = Easing.bezier(0.22, 1, 0.36, 1);
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
export const prog = (f, at, dur = 18, easing = ease) => interpolate(f, [at, at + dur], [0, 1], { ...clamp, easing });

export const display = { fontFamily: "Poppins", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.98 };
export const body = { fontFamily: "Poppins", fontWeight: 600, letterSpacing: "-0.015em", lineHeight: 1.15 };
export const mono = { fontFamily: "Plex", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" };

// A shot: a full-bleed ground with a very slow drift, so the frame is alive without moving the words.
export const Shot = ({ bg = W, color = K, children, push = 0.012, style }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: bg, color, overflow: "hidden" }}>
      <AbsoluteFill style={{ scale: String(interpolate(f, [0, durationInFrames], [1, 1 + push], clamp)), ...style }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

export const At = ({ x = X0, y, w = WIDTH, children, style }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, ...style }}>{children}</div>
);

// The default entrance: a line rises out of a mask. at = frame, from the scene's cue list.
export const Line = ({ at = 0, dur = 18, children, style }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, dur);
  return (
    <div style={{ overflow: "hidden", paddingBottom: "0.14em", marginBottom: "-0.14em" }}>
      <div style={{ translate: `0px ${(1 - p) * 100}%`, opacity: f < at ? 0 : 1, ...style }}>{children}</div>
    </div>
  );
};

// A gentle fade-up for anything that isn't a line of type (labels, drawings, blocks).
export const Fade = ({ at = 0, dur = 16, rise = 18, children, style }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, dur);
  return <div style={{ opacity: p, translate: `0px ${(1 - p) * rise}px`, ...style }}>{children}</div>;
};

// Words that arrive one after another, softly. Use for a hook line; keep the stagger short so the line lands early.
export const Words = ({ text, at = 0, step = 3, style, highlight = {} }) => (
  <div style={style}>
    {text.split(" ").map((w, i) => (
      <React.Fragment key={i}>
        <Fade at={at + i * step} dur={14} rise={14} style={{ display: "inline-block", ...(highlight[w] || {}) }}>{w}</Fade>{" "}
      </React.Fragment>
    ))}
  </div>
);

// A slab of colour that wipes in and carries its text.
export const Slab = ({ at = 0, dur = 16, bg = K, color = W, pad = "8px 26px 20px", children, style }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, dur);
  return (
    <div style={{ display: "inline-block", background: bg, color, padding: pad, clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`, visibility: f < at ? "hidden" : "visible", ...style }}>
      {children}
    </div>
  );
};

// SVG stroke that plots on.
export const draw = (f, at, dur = 20) => {
  const p = prog(f, at, dur, Easing.bezier(0.45, 0, 0.25, 1));
  return { pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p, opacity: f < at ? 0 : 1 };
};

// Black diagonal hatch: locked, blocked, paid for but not priced.
export const HatchDef = ({ id = "hatch", ink = K, ground = W, size = 24, weight = 8 }) => (
  <pattern id={id} patternUnits="userSpaceOnUse" width={size} height={size} patternTransform="rotate(45)">
    <rect width={size} height={size} fill={ground} />
    <line x1="0" y1="0" x2="0" y2={size} stroke={ink} strokeWidth={weight} />
  </pattern>
);

// A rectangle that fills with hatch (or colour) as a sweep.
export const Sweep = ({ at, dur = 18, x, y, w, h, fill = "url(#hatch)", dir = "right" }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, dur);
  if (f < at) return null;
  if (dir === "down") return <rect x={x} y={y} width={w} height={h * p} fill={fill} />;
  if (dir === "up") return <rect x={x} y={y + h * (1 - p)} width={w} height={h * p} fill={fill} />;
  return <rect x={x} y={y} width={w * p} height={h} fill={fill} />;
};

// A stamp: settles once, no bounce.
export const Stamp = ({ at, children, rotate = -5, color = K, style }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = prog(f, at, 14);
  return (
    <div style={{ display: "inline-block", border: `9px solid ${color}`, color, padding: "10px 28px 18px", rotate: `${rotate}deg`, scale: String(1.25 - 0.25 * p), opacity: p, ...display, ...style }}>
      {children}
    </div>
  );
};

// A strike line drawn across whatever it wraps.
export const Strike = ({ at, dur = 16, color = Y, thickness = 18, children, angle = -3 }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, dur);
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      {children}
      <span style={{ position: "absolute", left: "-3%", top: "52%", height: thickness, width: `${106 * p}%`, background: color, rotate: `${angle}deg`, transformOrigin: "left center", opacity: f < at ? 0 : 1 }} />
    </span>
  );
};

// A number that runs up to its value, then holds.
export const Count = ({ at, dur = 24, to, from = 0, format = (v) => String(Math.round(v)), style }) => {
  const f = useCurrentFrame();
  const v = interpolate(f, [at, at + dur], [from, to], { ...clamp, easing: Easing.bezier(0.2, 0, 0.1, 1) });
  return <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>{format(v)}</span>;
};

// The butterfly mark, small, never recoloured; on dark grounds it sits on a marigold plate.
export const Mark = ({ size = 84, plate = false, style }) =>
  plate ? (
    <div style={{ width: size * 1.5, height: size * 1.5, background: Y, display: "grid", placeItems: "center", ...style }}>
      <Img src={staticFile("mark.png")} style={{ width: size, height: size }} />
    </div>
  ) : (
    <Img src={staticFile("mark.png")} style={{ width: size, height: size, ...style }} />
  );

export const Tag = ({ children, color = G, style }) => <div style={{ ...mono, fontSize: SIZE.label, color, ...style }}>{children}</div>;

// The closing card every reel shares: the rule, a marigold line, one invitation, the address and the mark.
// s.text = [rule, invite, "realization.world"]; s.at = their cue frames.
export const Close = ({ s, bg = K, color = W, accent = Y, ruleSize = SIZE.h2, children }) => {
  const f = useCurrentFrame();
  return (
    <Shot bg={bg} color={color}>
      {children}
      <At y={440}>
        <Line at={s.at[0]} style={{ ...display, fontSize: ruleSize, lineHeight: 1.04 }}>{s.text[0]}</Line>
        <div style={{ height: 14, width: 340 * prog(f, s.at[0] + 10, 20), background: accent, marginTop: 48 }} />
        <div style={{ marginTop: 48 }}>
          <Line at={s.at[1]} style={{ ...body, fontWeight: 400, fontSize: 50 }}>{s.text[1]}</Line>
        </div>
      </At>
      <At y={1420} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Fade at={s.at[2]} style={{ ...mono, fontSize: SIZE.label }}>{s.text[2]}</Fade>
        <Fade at={s.at[2]}><Mark size={80} plate={bg === K} /></Fade>
      </At>
    </Shot>
  );
};

// A whole reel from its spec: scenes in order with a short cross-dissolve, the music bed under everything with a
// fade at the end, and at most one quiet effect per scene. `scenes` maps each spec scene name to its component.
export const Reel = ({ spec, scenes }) => {
  const p = plan(spec);
  const { fps } = useVideoConfig();
  const items = [];
  p.scenes.forEach((s, i) => {
    const C = scenes[s.name];
    if (!C) throw new Error(`No component for scene "${s.name}"`);
    items.push(
      <TransitionSeries.Sequence key={s.name} name={s.name} durationInFrames={s.frames}>
        <C s={s} />
        {s.sfx ? (
          <Sequence from={Math.round(s.sfx.at * fps)} layout="none" durationInFrames={2 * fps}>
            <Audio src={staticFile(`sfx/${s.sfx.name}.wav`)} volume={Math.min(MAX_SFX_VOLUME, s.sfx.volume ?? 0.18)} />
          </Sequence>
        ) : null}
      </TransitionSeries.Sequence>,
    );
    if (i < p.scenes.length - 1) items.push(<TransitionSeries.Transition key={`t${i}`} presentation={fade()} timing={linearTiming({ durationInFrames: XFADE })} />);
  });
  const end = p.total;
  return (
    <>
      <TransitionSeries>{items}</TransitionSeries>
      <Audio src={staticFile(`music/${spec.id}.wav`)} volume={(f) => (spec.musicVolume ?? 0.5) * interpolate(f, [0, 12, end - 45, end], [0, 1, 1, 0], clamp)} />
    </>
  );
};
