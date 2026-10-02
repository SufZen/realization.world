# The sound of Realization

Decided 2026-10-02, after three rejected rounds of music composed note by note: a synth bed that fought the reading, a calmer one that was "too heavy", and a jazz-lounge sampler that was "generic, no character, no groove". The direction changed entirely: **instrumental music with real groove and beat**, made by tools built for music and chosen by Asaf's ear. This is the sonic half of the brand, as binding as `visual-language.md`. The palette is `tools/content/reels/music.mjs`; the mix and loudness rules are in `quality.md` §1.

## 1. What the sound has to say

| The message | The sound |
|---|---|
| Confident, not loud: he has done this before | A groove that sits in the pocket and doesn't push; no drops, no build-ups |
| Sophisticated: international capital, architecture, Lisbon | Real-sounding instruments, rich chords, a producer's polish |
| Good energy: this is a person you want to work with | A beat you nod to in the first four seconds |
| Room to read | The first two seconds stay light (the hook is on screen); no harsh highs; round bass, never booming |

**Words for the brief:** groove, smooth, warm, sophisticated, good vibes, sunset, effortless, confident.
**Not us:** vocals of any kind (lyrics, chops, spoken words), EDM drops and risers, trap hats, epic or cinematic builds, corporate ukulele and claps, sad solo piano, trending meme sounds.

## 2. The candidates

Four directions, sampled 2026-10-02 for Asaf to choose from. Never name a real artist in a generator prompt.

| Entry | Direction | Tempo | Instruments |
|---|---|---|---|
| `afro-house` | Afro house: organic, percussion-led, rolling; a Lisbon rooftop at sunset | ~120 | Congas, shakers, rim clicks, light log-drum bass, marimba or kalimba hook, airy pad |
| `deep-house` | Deep / Balearic house: golden hour, open sea, effortless | ~118 | Soft four-on-the-floor kick, Rhodes chords, plucked arpeggio, a touch of nylon guitar, wide pads |
| `nu-disco` | Nu-disco / funk house: upbeat and confident, a smile in it | ~115 | Finger bass groove, clean funk guitar chops, filtered disco strings, crisp open hats |
| `lofi-hiphop` | Jazzy lo-fi hip-hop: head-nodding, cool, smart | ~88 | Swung boom-bap drums, jazz piano / Rhodes (9ths, 11ths), upright bass, light vinyl texture |

Once Asaf picks, this section names the default and which subjects get which entry, and every reel gets a fresh track in the chosen direction, so the feed never repeats one loop.

## 3. How a track gets made and approved

1. **Made** with an AI music generator connected to Claude (Abracadabrax or Creative Claw, paid in their credits; cost shown before a batch), or **supplied** by Asaf (bought or licensed). Generator prompts follow §1 and §2: instrumental, about 60 s, light first two seconds, groove in by second 4, clean ending.
2. **Recorded** in `music.mjs` with its tempo, file (in `tracks/`, git-ignored), source and the licence terms as the tool states them for commercial social use.
3. **Approved** by Asaf by ear: a standalone listen and the track under a real reel. Only `approved: true` entries can be published; `render.mjs` marks a reel with unapproved music as not publishable.
4. **Fitted** automatically: `render.mjs` cuts the track to the reel's exact length with a fade under the closing card, `src/pace.mjs` lands every scene cut on the track's beat grid, and loudness is set to −16 LUFS (true peak ≤ −1.5 dBTP).

## 4. Platform music

- **Instagram and TikTok** reward their own library audio with discovery. When a trending *instrumental* track fits §1, it may replace our track at posting time (added in the app, or by Metricool's Instagram `audioConfiguration`), with the video's own music muted. Never a track with lyrics under text.
- **LinkedIn, Facebook, YouTube Shorts:** our own track.
- **With a voice** (when Asaf films or the avatar speaks): music drops 18–20 dB under the voice and stays out of 1–4 kHz.
