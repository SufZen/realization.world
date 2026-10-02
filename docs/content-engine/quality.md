# Quality, readability and UX guardrails

Decided 2026-10-02, after the round-2 reels went out too fast to read and with the wrong music. Everything the content engine publishes passes these rules first. Where a rule can be measured, a tool enforces it and fails the run; the rest is the pre-publish checklist in §8. When a rule and a deadline collide, the post waits.

The principle behind every rule: **people decide in a second whether to stay, and leave the moment something is hard to read.** So every piece gives one idea at a time, at a size and a pace a tired person on a phone can read, in a calm, confident register that matches what we do (development, money, buildings, systems).

## 1. Reels (Instagram Reels, TikTok, YouTube Shorts, Facebook Reels)

### Pacing: timed from the words, never by hand
`tools/content/reels/src/pace.mjs` computes every scene's length from the words on it; `render.mjs` refuses to render a reel that breaks a rule.

| Rule | Value | Enforced by |
|---|---|---|
| Reading speed | 12 characters per second (relaxed, second-language readers included) | `pace.mjs` |
| Scene length | time to find the first line (0.6 s) + read every line + look at the drawing + a breath (0.8 s); and the last line gets its full reading time after it lands; at least 3 s; rounded up to whole beats of the music | `pace.mjs` |
| Words on screen per scene | at most 18, labels and carried-over words included | `render.mjs --check` |
| Scenes per reel | at most 9 | `render.mjs --check` |
| Reel length | at most 58 s (cut words or scenes, never speed) | `render.mjs --check`, `qa.mjs` |
| Big picture changes | never closer than 1 s (error), ideally 2 s apart (warning) | `qa.mjs` (measured on the MP4) |
| Entrances | 0.5–0.7 s, eased, early in the scene; the last line lands in the first half | `pace.mjs` warning |
| Between scenes | a 0.4 s cross-dissolve, added on top of reading time | kit `Reel` |

### Motion
- Things arrive once and then hold still. No shakes, bounces, slams, flashes, fast counters or typing effects.
- A slow drift of the whole frame (≤ 1.2 %) keeps it alive without moving the words.
- One move per idea: a line drawn, a strip hatched, a bar changing. Never two competing moves at once.

### Type and layout (1080 × 1920)
| Role | Minimum |
|---|---|
| Headline | 84 px (most heads 100–170) |
| Supporting text that carries meaning | 44 px |
| Labels on drawings, tags | 38 px |

Key content stays between y 240 and 1500 and x 80 and 960, clear of the platforms' buttons and caption. No label may sit on a line, a hatch or another label; use a legend instead. Text on marigold is black; marigold text only on black.

### Sound
- **Music sits under reading.** Calm and warm: piano, pads, no drums, claps, hi-hats or risers, nothing with a beat that pushes the viewer. 70–100 BPM.
- **Only approved tracks.** The palette is `tools/content/reels/music.json`; a track is publishable only after Asaf has listened and set `approved: true`. A track Asaf supplies goes in the palette with its licence. Never trending or copyrighted music in a file we render; if a platform's own library track is wanted, it is added in the app at posting time.
- **Effects:** at most one per scene, quiet (volume ≤ 0.25), only `tap`, `paper` or `chime`, and only on the moment the scene turns on.
- **Loudness:** −16 LUFS integrated, true peak ≤ −1.5 dBTP (set by `render.mjs`, checked by `qa.mjs`).

### First and last frame
The first frame already shows the hook (it is the thumbnail and the autoplay frame). The cover image is the hook fully landed (`cover.jpg`). The last scene holds the rule and one invitation long enough to read twice.

### The reel gate
A reel is scheduled only when **all three** hold:
1. `qa.json` from `render.mjs` says `"publishable": true` (pacing audit, video QA and music approval all pass);
2. Asaf has approved **the rendered video itself** on the desk, not just the script;
3. the AI-content flag is set if any shot is generated (Instagram `isAiGenerated`, TikTok `isAigc`, YouTube `isAiGeneratedContent`). Motion graphics from our own kit are not AI-generated footage.

## 2. Carousels (Instagram, LinkedIn documents, Facebook)
- 6 slides, one idea per slide; character limits in `visual-language.md` §6 are hard (`lint.mjs` fails a draft that breaks them).
- Nothing smaller than 19 px on a 1080 × 1350 slide; body 38 px; nothing touching or cut at an edge (renderer check plus a look at every slide).
- **Alt text on every image**, from the slide's own words: `alt.json` next to the images (`short` ≤ 100 characters for Instagram, `long` for X, LinkedIn, Facebook and Buffer). Never "Carousel slide 2".
- TikTok photo posts take the `carousel-NN.jpg` copies (TikTok rejects PNG).

## 3. Quote cards and covers
- Quote ≤ 140 characters, in Asaf's words, attributed.
- Alt text: the full quote and attribution (`alt.json` → `quote`).

## 4. Text posts
| Channel | Rule | Enforced by |
|---|---|---|
| LinkedIn | The hook lands before "see more": first paragraph ≤ 210 characters (error above 300) | `lint.mjs` |
| LinkedIn | No paragraph over 400 characters; 150–250 words; at most one "!"; at most 3 hashtags | `lint.mjs` |
| LinkedIn | A document (carousel PDF) title ≤ 60 characters; links go in the first comment once the field note is live | runbook |
| X | ≤ 280 characters per post; no sign-off; image alt text | `lint.mjs`, runbook |
| Instagram caption | First line ≤ 125 characters (it truncates there); 3–5 hashtags; no links | `lint.mjs` |
| TikTok caption | ≤ 150 characters before hashtags; 3–5 hashtags | `lint.mjs` |
| Facebook | The LinkedIn text cut to its core (≤ 4 paragraphs); reels preferred over images | runbook |

Voice and privacy rules stay in `voice.md` and the runbook.

## 5. Platform formats
| Format | Spec |
|---|---|
| Reel | MP4, H.264 + AAC, 1080 × 1920, 30 fps, 10–58 s, −16 LUFS |
| Instagram carousel | PNG or JPEG, 1080 × 1350 (4:5), up to 10 |
| TikTok photo post | JPEG or WebP only, within 1080 × 1920 |
| LinkedIn document | PDF from the carousel (`carousel.pdf`) |
| X / LinkedIn image | PNG 1200 × 627 (quote card) |
| Media hosting | `raw.githubusercontent.com/SufZen/realization.world/content-media/media/<id>/` (Buffer cannot read jsDelivr) |

## 6. Accessibility
- Contrast: black on white or marigold, white on black, marigold on black; never white on marigold. Grey `#555555` only on white.
- Every image and video has alt text or a caption that carries its message without the picture.
- No information by colour alone: states in diagrams are also hatched, outlined or labelled.
- No flashing (the 1 s rule above also keeps reels well clear of photosensitivity limits).

## 7. What changed for content already made (2026-10-02)
- The round-2 reels were withdrawn everywhere (Instagram removed by Asaf, TikTok moved to Metricool drafts, files removed from `content-media`).
- C01, C02 and C08 were rebuilt under these rules (58, 53 and 58 s; every scene timed from its words; calm music), and wait for Asaf's approval of video and music.
- Alt text was generated for all approved carousels and added to the posts already scheduled.

## 8. Pre-publish checklist (the publish routine runs it for every post)
1. Approved on the desk for this channel (and, for a reel, the rendered video approved).
2. `lint.mjs` passes for the draft; reels: `qa.json` publishable.
3. Media in the right format for the platform (§5), from `content-media`.
4. Alt text attached from `alt.json`.
5. Caption first line, hashtags and length within §4.
6. Not a duplicate of something already scheduled or published (check the desk's `post_ids`).
7. If anything fails: don't post; write a notice to the desk saying what failed and what's needed.
