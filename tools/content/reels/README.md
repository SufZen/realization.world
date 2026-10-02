# Reels

Motion-design reels for Instagram Reels, TikTok, YouTube Shorts and Facebook Reels, in the Realization visual language
(`docs/content-engine/visual-language.md`) and under the readability rules of `docs/content-engine/quality.md` §1.
1080 × 1920, 30 fps, at most 58 s.

**Nothing here is timed by hand.** A reel is a spec: every word that appears on screen, in order, with the second it
starts to arrive. `src/pace.mjs` turns that into scene lengths at a relaxed reading speed (12 characters a second, plus
time to find the first line, to look at the drawing and to breathe), rounded to whole beats of the music. If a reel is
too long, too dense or too fast, it does not render: cut words or scenes, never speed.

## Setup

```bash
cd tools/content/reels
npm install
pip install numpy scipy
```

## Making a reel

1. **Spec** `src/reels/<id>.spec.mjs` (git-ignored until published): `{ id, music, scenes: [{ name, text, cues, carry?, look?, sfx? }] }`.
   `text` lists every word on screen, labels included; `carry` lists words still visible from the scene before;
   `look` adds seconds for a drawing; `sfx` is at most one quiet effect (`tap`, `paper`, `chime`).
2. **Scenes** `src/reels/<id>.jsx`: one component per scene name, rendering `s.text[i]` at frame `s.at[i]`, built from
   `src/kit.jsx` (`Line`, `Fade`, `Words`, `Slab`, `Stamp`, `Strike`, `draw`, `Sweep`, `Close`, `Reel`). Register the
   reel in `src/reels/Root.jsx`.
3. **Check** `node render.mjs --check <id>`: the pacing table, errors and warnings, without rendering.
4. **Render** `FFMPEG=/path/to/ffmpeg node render.mjs <out-dir> <id>`: builds the music bed at the reel's exact length,
   renders, sets loudness to −16 LUFS, then measures the MP4 (`qa.mjs`: format, length, no picture change closer than
   1 s, loudness). Writes `reel-1080x1920.mp4`, `cover.jpg`, `sheet.png` (one frame a second) and `qa.json`.
5. **Look** at `sheet.png`: nothing cut, overlapping or sitting on a line.
6. **Approve**: the MP4 goes to the desk; it is scheduled only when `qa.json` says `publishable` and Asaf has approved
   the video itself.

## Music

`music.json` is the palette. Synthesized entries (`audio.py bed --style warm|reflective|open --key --seed`) are calm
and warm, with no drums, regenerated per reel at its exact length. A track Asaf supplies is a `file` entry with its
licence. Only `approved: true` entries are publishable, and approving one is Asaf's call by ear.
