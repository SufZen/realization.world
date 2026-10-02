#!/usr/bin/env node
// Content engine reels: quality gate on a finished MP4, independent of how it was made. It measures what a viewer
// gets: format, length, how often the picture changes, and loudness. render.mjs runs it on every reel and writes
// qa.json next to the video; a reel is publishable only when qa.json says so and Asaf has approved the video itself.
//
//   node tools/content/reels/qa.mjs <video.mp4>
//
// Needs ffmpeg (FFMPEG=/path/to/ffmpeg, or ffmpeg on PATH).
import { spawnSync } from "node:child_process";

const FFMPEG = process.env.FFMPEG || "ffmpeg";
export const LIMITS = {
  width: 1080,
  height: 1920,
  fps: 30,
  minSeconds: 10,
  maxSeconds: 60,
  flashGap: 1.0, // two big picture changes closer than this read as flicker: error
  calmGap: 2.0, // closer than this: warning
  loudness: -16, // integrated LUFS target for a reel whose sound is music only
  loudnessTolerance: 1.5,
  truePeak: -1.0, // dBTP ceiling
};

const run = (args) => spawnSync(FFMPEG, ["-hide_banner", ...args], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }).stderr;

export function qa(file) {
  const errors = [];
  const warnings = [];
  const info = run(["-i", file]);
  const dur = /Duration: (\d+):(\d+):([\d.]+)/.exec(info);
  const seconds = dur ? +dur[1] * 3600 + +dur[2] * 60 + +dur[3] : 0;
  const v = /Video: .*?, (\d+)x(\d+).*?, ([\d.]+) fps/.exec(info);
  const hasAudio = /Audio: /.test(info);
  if (!v) errors.push("No video stream.");
  else {
    if (+v[1] !== LIMITS.width || +v[2] !== LIMITS.height) errors.push(`Frame is ${v[1]}x${v[2]}; reels are ${LIMITS.width}x${LIMITS.height}.`);
    if (Math.round(+v[3]) !== LIMITS.fps) errors.push(`${v[3]} fps; reels are ${LIMITS.fps} fps.`);
  }
  if (seconds < LIMITS.minSeconds || seconds > LIMITS.maxSeconds) errors.push(`${seconds.toFixed(1)} s; reels run ${LIMITS.minSeconds}-${LIMITS.maxSeconds} s.`);
  if (!hasAudio) errors.push("No audio track.");

  // Big picture changes: cuts, wipes, anything that redraws much of the frame at once.
  const scene = run(["-i", file, "-vf", "select='gt(scene,0.2)',showinfo", "-an", "-f", "null", "-"]);
  const times = [...scene.matchAll(/pts_time:([\d.]+)/g)].map((m) => +m[1]);
  const marks = [0, ...times];
  const gaps = marks.slice(1).map((t, i) => +(t - marks[i]).toFixed(2));
  const flashes = gaps.filter((g) => g < LIMITS.flashGap).length;
  const quick = gaps.filter((g) => g >= LIMITS.flashGap && g < LIMITS.calmGap).length;
  if (flashes) errors.push(`${flashes} picture change(s) less than ${LIMITS.flashGap} s apart: the frame flickers faster than anyone can read.`);
  if (quick) warnings.push(`${quick} picture change(s) less than ${LIMITS.calmGap} s apart. Check they are part of one move, not a new screen.`);

  let loud = null;
  if (hasAudio) {
    const ln = run(["-i", file, "-af", "loudnorm=print_format=json", "-f", "null", "-"]);
    try {
      loud = JSON.parse(ln.slice(ln.lastIndexOf("{"), ln.lastIndexOf("}") + 1));
      if (Math.abs(+loud.input_i - LIMITS.loudness) > LIMITS.loudnessTolerance) warnings.push(`Loudness ${loud.input_i} LUFS; target ${LIMITS.loudness} ±${LIMITS.loudnessTolerance}.`);
      if (+loud.input_tp > LIMITS.truePeak) errors.push(`True peak ${loud.input_tp} dBTP; ceiling ${LIMITS.truePeak}.`);
    } catch {
      warnings.push("Loudness could not be measured.");
    }
  }
  return { file, seconds: +seconds.toFixed(2), changes: times.length, minGap: gaps.length ? Math.min(...gaps) : null, loudness: loud ? +loud.input_i : null, truePeak: loud ? +loud.input_tp : null, errors, warnings, pass: errors.length === 0 };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const file = process.argv[2];
  if (!file) {
    console.error("Usage: node tools/content/reels/qa.mjs <video.mp4>");
    process.exit(1);
  }
  const r = qa(file);
  console.log(JSON.stringify(r, null, 2));
  process.exit(r.pass ? 0 : 2);
}
