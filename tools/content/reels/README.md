# Reels

Motion-design reels for Instagram Reels, TikTok and YouTube Shorts, built with [Remotion](https://www.remotion.dev) in the
Realization visual language (`docs/content-engine/visual-language.md`). 1080 × 1920, 30 fps, 20–30 s, cut on a
120 BPM grid (one beat = 15 frames).

## Setup

```bash
cd tools/content/reels
npm install
pip install numpy scipy
python3 audio.py sfx public/sfx                       # effects (already committed)
python3 audio.py bed public/music/<id>.wav --seconds 28 --key A --mode minor --seed 1 --tail-bars 2
```

The music beds and effects are synthesized from scratch, so there is nothing to license. Match `--seconds` to the reel
and `--tail-bars` to the closing card, so the bed drops to a held chord under the close.

## Making a reel

1. **Storyboard first.** Shot by shot: picture, motion, sound, time in beats. Keep it private, next to the drafts.
2. **Build it** in `src/reels/<id>.jsx` (git-ignored: it carries copy before it is published) from the primitives in
   `src/kit.jsx`, and register it in `src/reels/Root.jsx`, which `src/index.jsx` loads.
3. **Render**: `FFMPEG=/path/to/ffmpeg node render.mjs <out-dir> <id>` writes `<out-dir>/<id>/reel-1080x1920.mp4`,
   loudness-normalised to −14 LUFS.
4. **Look at it**: a one-frame-per-second contact sheet (`ffmpeg -i reel.mp4 -vf "fps=1,scale=270:480,tile=7x4" -frames:v 1 sheet.png`)
   shows collisions, cut-offs and empty shots at a glance.

## Craft rules

- The first frame already carries the hook: no fade-in from blank.
- One idea per shot, at most seven words on screen at once, one visual metaphor per beat.
- Cuts land on beats; hard cuts by default, at most two wipes per reel.
- Nothing sits still: every shot drifts, and every element enters with a spring, never a plain fade.
- Every sound effect is tied to something on screen: tick for typing and counters, thud for slams, whoosh for wipes,
  snap for flips, stamp for stamps.
- Key content stays between y 240 and 1500 and x 80 and 960, clear of the platform buttons and captions.
- Only approved copy and approved numbers. Charts without cleared numbers are relative and tagged ILLUSTRATIVE.
- Styles: Term sheet for money and decisions; Site sheet (one drawing sheet revised shot by shot) for anything drawn to
  scale; Swiss grid (six visible columns) for AI and systems.

## Kit

`Shot` (ground plus drift), `At` (placement), `Slam` / `Words` (type that lands), `Rise` (masked rise), `Slab` (colour
slab that wipes in), `Typed` / `typedTicks`, `draw` (SVG plot-on), `HatchDef` / `Sweep` (hatch fills), `Stamp`, `Strike`,
`Count`, `Mark` (on a marigold plate on dark grounds), `WipeOut`, `Sfx`, `Bed`, `Close` (the shared closing card).
