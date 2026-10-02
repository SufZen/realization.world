#!/usr/bin/env python3
"""Content engine reels: the sound of Realization. Music beds played by real recorded instruments.

The brief (docs/content-engine/sound.md): smooth, cool, light and sophisticated, the room you'd want to sign a
deal in. A soft lounge / neo-soul groove at 90 BPM (one beat = 20 frames at 30 fps, so scene cuts land on it):
a Steinway grand comping jazz voicings (rootless maj9, m9, 13sus), a vibraphone with a few unhurried notes, a round
bass, brushed-light drums (cross-stick, closed hi-hat, shaker) with a gentle swing. Bright and airy rather than
heavy: the keys sit in the middle-upper register, the low-mids are kept clear, and nothing hits hard.

Instruments are the Versilian Community Sample Library (CC0, public domain: free for commercial use, no credit
needed), fetched by ./fetch_samples.sh into samples/vcsl. The bass and the kick are synthesized (no CC0 kit kick
suits this style).

  python3 tools/content/reels/music.py <out.wav> --seconds 48 --style lounge --key F --seed 2

Styles:
  lounge  the default: piano comping, vibes melody, full light groove
  airy    no kick or snare: piano, vibes, bass, shaker and hats; the lightest
  night   minor colours, vibes forward; for risk, families, stuck property
"""
import argparse
import glob
import warnings
import os
import re
import wave

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, fftconvolve, resample, sosfilt

SR = 44100
BPM = 90
BEAT = 60 / BPM
BAR = 4 * BEAT
SWING = 0.58  # 16th-note swing: the off-16ths land late, which is most of what "smooth" means rhythmically
warnings.filterwarnings("ignore", message="Chunk")
HERE = os.path.dirname(os.path.abspath(__file__))
VCSL = os.environ.get("VCSL", os.path.join(HERE, "samples", "vcsl"))
NOTE = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11}


def midi_of(name):
    m = re.match(r"([A-G]#?)(-?\d)", name)
    return 12 * (int(m.group(2)) + 1) + NOTE[m.group(1)]


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def filt(x, kind, freq, order=2):
    return sosfilt(butter(order, freq, btype=kind, fs=SR, output="sos"), x, axis=0)


def load(path):
    sr, x = wavfile.read(path)
    if x.dtype == np.int16:
        x = x / 32768.0
    elif x.dtype == np.int32:
        x = x / 2147483648.0
    x = x.astype(np.float64)
    if x.ndim == 1:
        x = np.stack([x, x], axis=1)
    if sr != SR:
        x = resample(x, int(len(x) * SR / sr))
    # The library is recorded at very different levels (a vibraphone note peaks ~30 dB below a hi-hat), so every
    # sample is brought to the same peak and the mix sets the levels on purpose.
    return x / (np.max(np.abs(x)) or 1) * 0.9


class Sampler:
    """Pitched instrument from note-named samples, with velocity layers. Each played note is the nearest sample,
    re-pitched (at most a couple of semitones) and trimmed with a smooth release."""

    def __init__(self, pattern, note_re, layer_re, max_seconds=8.0):
        self.zones = {}
        for p in glob.glob(os.path.join(VCSL, pattern), recursive=True):
            n, l = re.search(note_re, os.path.basename(p)), re.search(layer_re, os.path.basename(p))
            if n and l:
                self.zones.setdefault(int(l.group(1)), {})[midi_of(n.group(1))] = p
        if not self.zones:
            raise SystemExit(f"No samples for {pattern}: run ./fetch_samples.sh")
        self.layers = sorted(self.zones)
        self.max = int(max_seconds * SR)
        self.cache = {}

    def _raw(self, layer, root):
        key = (layer, root)
        if key not in self.cache:
            self.cache[key] = load(self.zones[layer][root])[: self.max]
        return self.cache[key]

    def note(self, m, dur, vel=0.5, release=0.35):
        layer = self.layers[min(len(self.layers) - 1, int(vel * len(self.layers)))]
        roots = list(self.zones[layer])
        root = min(roots, key=lambda r: abs(r - m))
        key = ("p", layer, m)
        if key not in self.cache:
            x = self._raw(layer, root)
            ratio = 2 ** ((m - root) / 12)
            self.cache[key] = x if ratio == 1 else resample(x, max(1, int(len(x) / ratio)))
        x = self.cache[key]
        n = min(len(x), int((dur + release) * SR))
        out = x[:n].copy()
        r = int(release * SR)
        if n > r:
            out[-r:] *= np.linspace(1, 0, r)[:, None] ** 2
        return out * (0.35 + 0.65 * vel)


class Hits:
    """Unpitched one-shots with round robins."""

    def __init__(self, pattern):
        self.files = sorted(glob.glob(os.path.join(VCSL, pattern), recursive=True))
        if not self.files:
            raise SystemExit(f"No samples for {pattern}: run ./fetch_samples.sh")
        self.data = [load(f)[: int(1.5 * SR)] for f in self.files]
        self.i = 0

    def hit(self, vel=0.5):
        self.i = (self.i + 1) % len(self.data)
        return self.data[self.i] * vel


def place(buf, clip, at, pan=0.0):
    i = int(at * SR)
    if i >= len(buf) or i < 0:
        return
    j = min(len(buf), i + len(clip))
    a = (pan + 1) * np.pi / 4
    gain = np.array([np.cos(a), np.sin(a)]) * np.sqrt(2)
    buf[i:j] += clip[: j - i] * gain


# ---------- synthesized parts ----------

def bass_note(m, dur, vel=0.6):
    """Round, warm electric-style bass: fundamental plus a little 2nd and 3rd, soft pluck, gentle low-pass."""
    x = np.arange(int((dur + 0.15) * SR)) / SR
    f = hz(m)
    s = np.sin(2 * np.pi * f * x) + 0.32 * np.sin(2 * np.pi * 2 * f * x) * np.exp(-x * 3) + 0.12 * np.sin(2 * np.pi * 3 * f * x) * np.exp(-x * 6)
    env = np.minimum(1, x / 0.006) * (0.55 + 0.45 * np.exp(-x * 5)) * np.clip((dur + 0.15 - x) / 0.15, 0, 1)
    out = filt(s * env, "lowpass", 900) * vel * 0.5
    return np.stack([out, out], axis=1)


def kick(vel=0.5):
    x = np.arange(int(0.3 * SR)) / SR
    f = 55 + 70 * np.exp(-x * 45)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 14)
    s = s + 0.05 * filt(np.random.default_rng(1).standard_normal(len(x)), "highpass", 3000) * np.exp(-x * 120)
    return np.stack([s, s], axis=1) * vel * 0.4


# ---------- harmony ----------

# Rootless voicings (no root in the hands; the bass has it), the colours of modern jazz and neo-soul.
QUALITY = {
    "maj9": [4, 7, 11, 14],
    "m9": [3, 7, 10, 14],
    "m11": [3, 7, 10, 14, 17],
    "13sus": [5, 10, 14, 21],
    "9": [4, 10, 14, 21],
    "6/9": [4, 9, 14, 19],
}
STYLES = {
    # (semitones above the key root, quality) per bar
    "lounge": [(2, "m9"), (7, "13sus"), (0, "maj9"), (9, "m9")],  # ii - V(sus) - I - vi
    "airy": [(0, "maj9"), (5, "maj9"), (2, "m9"), (7, "13sus")],  # I - IV - ii - V(sus)
    "night": [(0, "m11"), (8, "maj9"), (5, "m9"), (7, "13sus")],  # i - bVI - iv - V(sus)
}
TONIC = {"lounge": (0, "6/9"), "airy": (0, "maj9"), "night": (0, "m11")}


def voicing(root_pc, quality, prev=None, lo=57, hi=79):
    ivs = QUALITY[quality]
    best, score = None, None
    for base in range(lo - 12, hi):
        if base % 12 != root_pc:
            continue
        v = [base + i for i in ivs]
        if v[0] < lo or v[-1] > hi:
            continue
        s = 0 if prev is None else sum(min(abs(a - b) for b in prev) for a in v)
        s += abs(np.mean(v) - 67) * (0.2 if prev else 1)  # keep it centred around G4: light, not muddy
        if score is None or s < score:
            best, score = v, s
    if best is None:  # a wide voicing that doesn't fit the window: widen it a little
        return voicing(root_pc, quality, prev, lo - 3, hi + 4)
    return best


# ---------- the bed ----------

# Mix levels, tuned by measurement to the brief: under 12 % of the energy below 100 Hz, at least 6 % above 2 kHz.
GAIN = {"piano": 0.55, "vibes": 0.5, "bass": 0.3, "drums": 0.55, "air": 0.25}

def t16(bar_start, n16):
    """Time of the n-th 16th note in a bar, swung."""
    beat, sub = divmod(n16, 4)
    pos = beat * BEAT + {0: 0, 1: SWING * 0.5, 2: 0.5, 3: 0.5 + SWING * 0.5}[sub] * BEAT
    return bar_start + pos


def bed(seconds, style="lounge", key="F", seed=2):
    rng = np.random.default_rng(seed)
    k = NOTE[key]
    piano = Sampler("Chordophones/**/JHPiano_Sus_Close_*.wav", r"Close_([A-G]#?\d)_", r"_vl(\d)_", 6)
    vibes = Sampler("Idiophones/**/Vibraphone/**/Vibes_soft_*.wav", r"_soft_([A-G]#?\d)_", r"_v(\d)_", 6)
    hat = Hits("Idiophones/**/Hi-Hat Cymbal/HiHat_Close_*.wav")
    hatc = Hits("Idiophones/**/Hi-Hat Cymbal/HiHat_HitC_v1_*.wav")
    shaker = Hits("Idiophones/**/Shaker, Small/Mid_ShakerDouble_*.wav")
    stick = Hits("Membranophones/**/Snare2_stick_*.wav")

    n = int((seconds + 4) * SR)
    keys, mallets, low, drums = (np.zeros((n, 2)) for _ in range(4))
    prog = STYLES[style]
    bars = int(np.ceil(seconds / BAR))
    prev = None
    motif = None
    for b in range(bars):
        s0 = b * BAR
        if s0 >= seconds:
            break
        final = s0 + BAR > seconds - 0.1
        deg, q = TONIC[style] if final else prog[b % len(prog)]
        root = (k + deg) % 12
        v = voicing(root, q, prev)
        prev = v
        bass_root = 36 + (root - 36) % 12  # C2..B2
        if bass_root > 43:
            bass_root -= 12

        # Piano: a soft chord on 1 (rolled a hair), a lighter re-hit on the and of 2, an anticipation into the next bar.
        hits = [(0, 1.6, 0.42), (6, 0.9, 0.28), (14, 0.5, 0.3)] if not final else [(0, max(1.0, seconds - s0), 0.45)]
        for n16, dur, vel in hits:
            if final and n16:
                continue
            at = t16(s0, n16)
            vv = v if n16 != 14 or final else voicing((k + (TONIC[style] if b + 1 >= bars else prog[(b + 1) % len(prog)])[0]) % 12, (TONIC[style] if b + 1 >= bars else prog[(b + 1) % len(prog)])[1], v)
            for i, m in enumerate(vv):
                place(keys, piano.note(m, dur * BEAT, vel * (0.9 + 0.2 * rng.random()), release=0.5), at + 0.012 * i, pan=-0.3 + 0.6 * i / max(1, len(vv) - 1))

        # Bass from bar 2: root on 1, a passing note on the and of 2, the fifth on 3, approach into the next bar.
        if b >= 1 and not final:
            nxt = (k + prog[(b + 1) % len(prog)][0]) % 12
            approach = 36 + (nxt - 36) % 12
            approach = approach - 12 if approach > 43 else approach
            for n16, m, dur, vel in [(0, bass_root, 1.4, 0.7), (6, bass_root + 12 if rng.random() < 0.3 else bass_root, 0.4, 0.45), (8, bass_root + 7, 1.2, 0.6), (15, approach - 1 if rng.random() < 0.5 else approach + 1, 0.22, 0.45)]:
                place(low, bass_note(m, dur * BEAT, vel), t16(s0, n16))
        elif final:
            place(low, bass_note(bass_root, min(3 * BEAT, max(0.5, seconds - s0)), 0.6), s0)

        # Vibes from bar 3: a short motif (chord tones, 2-4 notes), repeated with small changes so it sounds written.
        if b >= 2 or final:
            tones = sorted({m + 12 for m in v} | {m for m in v if m >= 67})
            if final:
                place(mallets, vibes.note(max(tones[-2], 74), 3 * BEAT, 0.45, release=1.2), s0 + 0.5 * BEAT, pan=0.25)
            else:
                if motif is None or rng.random() < 0.35:
                    motif = sorted(rng.choice([2, 3, 6, 7, 10, 11, 12], size=int(rng.integers(2, 4)), replace=False))
                for j, n16 in enumerate(motif):
                    m = tones[min(len(tones) - 1, (j + b) % len(tones))]
                    place(mallets, vibes.note(m, 1.2 * BEAT, 0.35 + 0.15 * rng.random(), release=0.9), t16(s0, int(n16)), pan=0.25)

        # Drums: light, swung, never loud. Shaker from bar 1, hats from bar 2, kick and cross-stick from bar 3 (lounge, night).
        if final:
            continue
        for n16 in range(16):
            if n16 % 2 == 1 or rng.random() < 0.7:
                place(drums, shaker.hit(0.10 + 0.08 * (n16 % 4 == 2)), t16(s0, n16), pan=0.35)
        if b >= 1:
            for n16 in range(0, 16, 2):
                place(drums, (hatc if n16 % 4 == 0 else hat).hit(0.16 if n16 % 4 == 2 else 0.11), t16(s0, n16), pan=-0.2)
        if b >= 2 and style != "airy":
            for n16 in (0, 7, 10):  # 1, the and-a of 2 (late), and 3-and: a laid-back neo-soul pattern
                place(drums, kick(0.55 if n16 == 0 else 0.4), t16(s0, n16))
            for n16 in (4, 12):
                place(drums, stick.hit(0.22), t16(s0, n16), pan=0.1)

    # Mix. Keys and vibes in a small warm room; low-mids kept clear so the bed feels light, not heavy.
    keys = filt(keys, "highpass", 140)
    keys = keys - 0.3 * filt(keys, "bandpass", [200, 420])
    mallets = filt(mallets, "highpass", 200)
    trem = 1 + 0.12 * np.sin(2 * np.pi * 5.2 * np.arange(n) / SR)  # the vibraphone's motor
    mallets *= trem[:, None]
    wet = room(GAIN["piano"] * keys + GAIN["vibes"] * mallets, seconds=1.8)
    low = filt(low, "highpass", 40)
    # Gentle sidechain: the bass leans out of the kick's way.
    drums = drums + room(drums, seconds=0.8, wet=0.12)
    mix = GAIN["piano"] * keys + GAIN["vibes"] * mallets + 0.3 * wet + GAIN["bass"] * low + GAIN["drums"] * drums
    mix = mix + GAIN["air"] * filt(mix, "highpass", 4500)  # a little air on top: light and expensive, not dark
    mix = np.tanh(mix * 1.1) / 1.1  # soft glue
    mix = filt(mix, "lowpass", 16000)
    mix = mix[: int(seconds * SR)]
    fi, fo = int(0.2 * SR), int(1.8 * SR)
    mix[:fi] *= np.linspace(0, 1, fi)[:, None]
    mix[-fo:] *= (np.linspace(1, 0, fo) ** 1.6)[:, None]
    return mix / (np.max(np.abs(mix)) or 1) * 10 ** (-3 / 20)


def room(x, seconds=1.8, wet=1.0, seed=7):
    rng = np.random.default_rng(seed)
    n = int(seconds * SR)
    decay = np.exp(-np.arange(n) / SR * (6.9 / seconds))
    out = np.zeros_like(x)
    for ch in (0, 1):
        ir = filt(rng.standard_normal(n), "lowpass", 7000) * decay
        ir[: int(0.012 * SR)] = 0  # pre-delay keeps the attack clear
        ir /= np.sqrt(np.sum(ir ** 2))
        out[:, ch] = fftconvolve(x[:, ch], ir)[: len(x)]
    return out * wet if wet != 1.0 else out


def write(path, x):
    x = np.clip(x, -1, 1)
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x * 32767).astype("<i2").tobytes())


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("out")
    p.add_argument("--seconds", type=float, required=True)
    p.add_argument("--style", default="lounge", choices=list(STYLES))
    p.add_argument("--key", default="F", choices=list(NOTE))
    p.add_argument("--seed", type=int, default=2)
    a = p.parse_args()
    write(a.out, bed(a.seconds, a.style, a.key, a.seed))
    print(a.out)
