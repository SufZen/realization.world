# The sound of Realization

Decided 2026-10-02, after two rejected music beds: the first too busy (a drum beat that fought the reading), the second "better, but too heavy". This is the sonic half of the brand, as binding as `visual-language.md`. The engine that plays it is `tools/content/reels/music.py`; the palette is `tools/content/reels/music.json`; the mix and loudness rules are in `quality.md` §1.

## 1. What the sound has to say

The visuals say *this person operates and knows the numbers*. The sound says the same thing to the ear in the first second:

| The message | The sound |
|---|---|
| Confident, not loud: he has done this before | An unhurried groove that never pushes; nothing hits hard |
| Sophisticated: international capital, architecture, Lisbon | Jazz harmony (maj9, m9, 13sus voicings), real piano and vibraphone, a small warm room |
| Calm control of complex things | A steady pulse with a light swing; clear space between parts |
| Light, open, forward-looking | Bright and airy: the keys sit above middle C, low-mids kept clear, a little air on top |
| Serious when the subject is (families, risk) | The same language in minor colours, slower to move |

**Words for the brief:** smooth, cool, light, sophisticated, unhurried, warm, expensive-sounding.
**Not us:** epic or cinematic builds, corporate ukulele and claps, EDM drops, trap hats, sad solo piano, anything with lyrics, trending meme sounds, anything heavy in the bass.

Genre neighbours, for anyone choosing or briefing a track: lounge and nu-jazz, neo-soul instrumentals, downtempo, hotel-lobby jazz with a modern pulse. Reference the feel, never copy a track.

## 2. The palette

| Entry | Style | Use it for | Instruments |
|---|---|---|---|
| `lounge-f` (default) | Smooth groove, F major, 90 BPM | Development, money, decisions, the founder's view | Steinway grand comping, vibraphone motif, round bass, cross-stick, closed hi-hat, shaker, soft kick |
| `airy-d` | The lightest, D major | AI, software, systems, processes | Piano, vibraphone, bass, hi-hat and shaker; no kick or snare |
| `night-a` | Minor colours, A minor | Stuck properties, families, inheritance, risk | As lounge, with minor 11 and minor 9 chords and the vibraphone forward |

Every bed opens with the piano alone for one bar (the hook frame is never fighting a full mix), builds over two bars, and resolves to the tonic chord under the closing card. Tempo is 90 BPM so scene cuts land on the beat (`src/pace.mjs`).

Instruments are the Versilian Community Sample Library, recorded acoustic instruments released CC0 (public domain): free for commercial use, no credit needed. `fetch_samples.sh` downloads only what the palette uses. The bass and the soft kick are synthesized.

## 3. How a track gets approved

1. A palette entry starts `approved: false`.
2. Asaf listens (a standalone sample and the bed under a real reel) and approves, rejects or asks for changes.
3. Only approved entries can be published (`render.mjs` marks reels with unapproved music as not publishable).
4. A track Asaf supplies (bought or licensed) enters the palette as a `file` entry with its licence noted.

What can be measured is checked: under 12 % of the energy below 100 Hz, presence above 2 kHz, −16 LUFS integrated, true peak ≤ −1.5 dBTP. What can't be measured (whether it feels right) is Asaf's ear; the engine never assumes it.

## 4. Platform music

- **Instagram and TikTok** reward their own library audio with discovery. When a trending *instrumental* track fits the words above, it may replace our bed at posting time (added in the app, or by Metricool's Instagram `audioConfiguration`), with the video's own music muted. Never a track with lyrics under text.
- **LinkedIn, Facebook, YouTube Shorts:** our own bed.
- **With a voice** (when Asaf films or the avatar speaks): music drops 18–20 dB under the voice and stays out of 1–4 kHz.

## 5. If the engine isn't enough

The engine is the free, fully automatic default. Two paid routes exist if a topic needs more: an AI music generator connected to Claude (for example the Creative Claw plugin's music skill), or a licensed library track Asaf picks. Either enters the same palette and the same approval step.
