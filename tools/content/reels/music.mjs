// Music palette for reels; the sound brief is docs/content-engine/sound.md. A reel names one entry (spec.music).
// A JS module (not JSON) so the renderer (Node) and the compositions (Remotion's bundle) read the same tempo.
//
// Entries are produced instrumental tracks, made with an AI music generator or supplied by Asaf, stored in tracks/
// (git-ignored) and noted here with their source and licence. `bpm` sets the beat grid scene cuts land on
// (src/pace.mjs); `offset` is the second of the first downbeat in the file. Only `approved: true` entries can be
// published, and approving one is Asaf's call, by ear.
//
// Retired 2026-10-02: the synthesized beds and the VCSL sampler engine (music.py): "generic, no character, no groove".
export default {
  tracks: {
    "afro-house": { bpm: 120, offset: 0, file: null, source: null, licence: null, use: "Percussion-led, organic, rolling: Lisbon at sunset.", approved: false },
    "deep-house": { bpm: 118, offset: 0, file: null, source: null, licence: null, use: "Deep / Balearic: warm, effortless, golden hour.", approved: false },
    "nu-disco": { bpm: 115, offset: 0, file: null, source: null, licence: null, use: "Funk house: upbeat and confident.", approved: false },
    "lofi-hiphop": { bpm: 88, offset: 0, file: null, source: null, licence: null, use: "Jazzy boom-bap: head-nodding, cool, smart.", approved: false },
  },
};
