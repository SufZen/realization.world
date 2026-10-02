#!/usr/bin/env node
// Content engine reels: from a reel spec to a checked, finished 9:16 MP4.
//
//   node tools/content/reels/render.mjs <out-dir> <reel-id ...>      check, render, measure
//   node tools/content/reels/render.mjs --check <reel-id ...>        pacing audit only (no render)
//
// For each reel (src/reels/<id>.spec.mjs + src/reels/<id>.jsx, registered in src/reels/Root.jsx):
//   1. audits the spec against the reading-time rules (src/pace.mjs); any error stops here
//   2. builds the music bed from the palette entry the spec names (music.json), at the reel's exact length
//   3. renders with Remotion, then sets loudness to -16 LUFS with a -1.5 dBTP ceiling
//   4. measures the result (qa.mjs) and writes <out-dir>/<id>/: reel-1080x1920.mp4, cover.jpg, sheet.png and qa.json
// qa.json says `publishable: true` only when the pacing audit, the video QA and the music approval all pass.
// Publishing still needs Asaf's approval of the rendered video on the desk.
// Uses the preinstalled headless shell (Claude Code cloud sessions) unless REMOTION_BROWSER points elsewhere, and
// ffmpeg from FFMPEG or PATH.
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { FPS, audit, table } from "./src/pace.mjs";
import { qa } from "./qa.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const checkOnly = args[0] === "--check";
const [outDir, ...ids] = checkOnly ? [null, ...args.slice(1)] : args;
if ((!checkOnly && !outDir) || !ids.length) {
  console.error("Usage: node tools/content/reels/render.mjs <out-dir> <reel-id ...>\n       node tools/content/reels/render.mjs --check <reel-id ...>");
  process.exit(1);
}
const FFMPEG = process.env.FFMPEG || "ffmpeg";
const shell = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const browser = process.env.REMOTION_BROWSER || (existsSync(shell) ? shell : null);
const palette = JSON.parse(readFileSync(join(here, "music.json"), "utf8")).tracks;

let failed = false;
for (const id of ids) {
  const spec = (await import(pathToFileURL(join(here, "src/reels", `${id}.spec.mjs`)).href)).default;
  const a = audit(spec);
  console.log(`\n${id}: pacing\n${table(a.plan)}`);
  a.warnings.forEach((w) => console.log(`  warning: ${w}`));
  a.errors.forEach((e) => console.log(`  ERROR: ${e}`));
  const track = palette[spec.music];
  if (!track) a.errors.push(`Music "${spec.music}" is not in music.json.`);
  if (a.errors.length) {
    failed = true;
    console.log(`${id}: not rendered (fix the errors above).`);
    continue;
  }
  if (checkOnly) continue;

  // Music bed at the reel's exact length.
  const seconds = a.plan.total / FPS;
  mkdirSync(join(here, "public/music"), { recursive: true });
  const bed = join(here, "public/music", `${id}.wav`);
  if (track.file) {
    execFileSync(FFMPEG, ["-y", "-loglevel", "error", "-i", track.file, "-t", String(seconds), "-af", `afade=t=out:st=${Math.max(0, seconds - 2)}:d=2`, "-ar", "44100", "-ac", "2", bed]);
  } else {
    execFileSync("python3", [join(here, "audio.py"), "bed", bed, "--seconds", seconds.toFixed(3), "--style", track.style, "--key", track.key, "--seed", String(track.seed)], { stdio: "ignore" });
  }

  const dir = join(outDir, id);
  mkdirSync(dir, { recursive: true });
  const raw = join(dir, ".raw.mp4");
  const r = ["remotion", "render", "src/index.jsx", id, raw, "--concurrency=4", "--crf=17", "--log=error"];
  if (browser) r.push(`--browser-executable=${browser}`);
  execFileSync("npx", r, { cwd: here, stdio: "inherit" });

  // Two-pass loudness normalisation: measure, then apply linearly.
  const probe = spawnSync(FFMPEG, ["-hide_banner", "-i", raw, "-af", "loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"], { encoding: "utf8" }).stderr;
  let m = null;
  try {
    m = JSON.parse(probe.slice(probe.lastIndexOf("{"), probe.lastIndexOf("}") + 1));
  } catch {}
  const measured = m ? `:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true` : "";
  const out = join(dir, "reel-1080x1920.mp4");
  execFileSync(FFMPEG, ["-y", "-loglevel", "error", "-i", raw, "-c:v", "copy", "-af", `loudnorm=I=-16:TP=-1.5:LRA=11${measured}`, "-ar", "48000", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", out]);
  rmSync(raw, { force: true });

  // Cover (the hook, fully landed) and a one-frame-per-second contact sheet for review.
  execFileSync(FFMPEG, ["-y", "-loglevel", "error", "-ss", "1.5", "-i", out, "-frames:v", "1", "-q:v", "2", join(dir, "cover.jpg")]);
  execFileSync(FFMPEG, ["-y", "-loglevel", "error", "-i", out, "-vf", "fps=1,scale=216:384,tile=10x6:padding=4:color=0x888888", "-frames:v", "1", join(dir, "sheet.png")]);

  const v = qa(out);
  const music = { id: spec.music, approved: !!track.approved };
  const blockers = [...v.errors, ...(music.approved ? [] : [`Music "${spec.music}" is not approved yet (music.json).`])];
  const report = { id, publishable: blockers.length === 0, blockers, warnings: [...a.warnings, ...v.warnings], seconds: v.seconds, scenes: a.plan.scenes.map((s) => ({ name: s.name, words: s.words, seconds: +(s.body / FPS).toFixed(2) })), video: v, music };
  writeFileSync(join(dir, "qa.json"), JSON.stringify(report, null, 2));
  console.log(`${id}: ${v.seconds} s, ${v.changes} picture changes (closest ${v.minGap} s apart), ${v.loudness} LUFS → ${report.publishable ? "publishable" : `not publishable: ${blockers.join(" ")}`}`);
  if (v.errors.length) failed = true;
}
process.exit(failed ? 2 : 0);
