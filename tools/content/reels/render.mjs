#!/usr/bin/env node
// Content engine reels: render Remotion compositions to finished 9:16 MP4s.
//
//   node tools/content/reels/render.mjs <out-dir> <composition-id ...>
//
// Per composition it writes <out-dir>/<id>/reel-1080x1920.mp4: H.264, 30 fps, AAC, loudness-normalised to -14 LUFS
// with a -1.5 dBTP ceiling (what Instagram, TikTok and YouTube normalise to, so the reel is neither quiet nor squashed).
// Uses the preinstalled headless shell (Claude Code cloud sessions) unless REMOTION_BROWSER points elsewhere, and
// ffmpeg from FFMPEG or PATH.
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, rmSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const [outDir, ...ids] = process.argv.slice(2);
if (!outDir || !ids.length) {
  console.error("Usage: node tools/content/reels/render.mjs <out-dir> <composition-id ...>");
  process.exit(1);
}
const FFMPEG = process.env.FFMPEG || "ffmpeg";
const shell = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const browser = process.env.REMOTION_BROWSER || (existsSync(shell) ? shell : null);

for (const id of ids) {
  const dir = join(outDir, id);
  mkdirSync(dir, { recursive: true });
  const raw = join(dir, ".raw.mp4");
  const args = ["remotion", "render", "src/index.jsx", id, raw, "--concurrency=4", "--crf=17", "--log=error"];
  if (browser) args.push(`--browser-executable=${browser}`);
  execFileSync("npx", args, { cwd: here, stdio: "inherit" });

  // Two-pass loudness normalisation: measure, then apply linearly.
  const probe = spawnSync(FFMPEG, ["-hide_banner", "-i", raw, "-af", "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"], { encoding: "utf8" }).stderr;
  let m;
  try {
    m = JSON.parse(probe.slice(probe.lastIndexOf("{"), probe.lastIndexOf("}") + 1));
  } catch {
    m = null;
  }
  const measured = m ? `:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true` : "";
  const out = join(dir, "reel-1080x1920.mp4");
  execFileSync(FFMPEG, ["-y", "-loglevel", "error", "-i", raw, "-c:v", "copy", "-af", `loudnorm=I=-14:TP=-1.5:LRA=11${measured}`, "-ar", "48000", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", out]);
  rmSync(raw, { force: true });
  console.log(`${id} → ${out}`);
}
