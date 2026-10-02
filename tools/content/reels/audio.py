#!/usr/bin/env python3
"""Content engine reels: original music beds and quiet sound effects, synthesized from scratch (nothing to license).

The music sits under reading, so it is calm and warm: a soft electric piano playing slow chords with a few sparse
notes, a pad, a quiet sub bass and a small room. No drums, no claps, no risers, nothing that competes with the words.
90 BPM, so one beat is 20 frames at 30 fps and scene cuts (rounded to whole beats in src/pace.mjs) land on the music.
Each bed opens with one bar of piano alone and ends on the tonic chord, held under the closing card.

  python3 tools/content/reels/audio.py bed <out.wav> --seconds 48 --style warm --key D --seed 3
  python3 tools/content/reels/audio.py sfx <out-dir>

Styles: warm (major, maj9 colours), reflective (minor, m9 colours), open (sus chords, lighter). Palette entries in
music.json name a style, key and seed, so every reel's bed can be regenerated exactly. Needs numpy and scipy.
"""
import argparse
import os
import wave

import numpy as np
from scipy.signal import butter, fftconvolve, sosfilt

SR = 44100
BPM = 90
BEAT = 60 / BPM
BAR = 4 * BEAT
NOTES = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11}
QUALITY = {"maj9": [0, 4, 7, 11, 14], "m9": [0, 3, 7, 10, 14], "sus": [0, 5, 7, 10, 14], "add9": [0, 4, 7, 14], "m7": [0, 3, 7, 10]}
STYLES = {
    # (semitones from the key root, chord quality) per bar
    "warm": [(0, "maj9"), (9, "m9"), (5, "maj9"), (7, "sus")],  # I - vi - IV - V(sus)
    "reflective": [(0, "m9"), (8, "maj9"), (3, "maj9"), (10, "sus")],  # i - VI - III - VII(sus)
    "open": [(0, "add9"), (5, "maj9"), (9, "m7"), (7, "sus")],  # I - IV - vi - V(sus)
}
TONIC = {"warm": (0, "maj9"), "reflective": (0, "m9"), "open": (0, "add9")}


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def t(sec):
    return np.arange(int(sec * SR)) / SR


def filt(x, kind, freq, order=2):
    return sosfilt(butter(order, freq, btype=kind, fs=SR, output="sos"), x, axis=0)


def place(buf, clip, at, pan=0.0):
    """Add a mono clip into a stereo buffer at `at` seconds, with constant-power pan (-1 left … 1 right)."""
    i = int(at * SR)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(clip))
    a = (pan + 1) * np.pi / 4
    buf[i:j, 0] += clip[: j - i] * np.cos(a)
    buf[i:j, 1] += clip[: j - i] * np.sin(a)


# ---------- instruments ----------

def epiano(m, dur, vel=0.6):
    """Soft FM electric piano: a round fundamental, a little bell on the attack, a gentle release."""
    x = t(dur + 1.2)
    f = hz(m)
    idx = (0.6 + 2.6 * vel * np.exp(-x * 4.0))
    s = np.sin(2 * np.pi * f * x + idx * np.sin(2 * np.pi * f * x)) + 0.18 * np.sin(2 * np.pi * 2 * f * x) * np.exp(-x * 1.5)
    tine = 0.1 * vel * np.sin(2 * np.pi * f * 7.0 * x) * np.exp(-x * 22)
    decay = np.exp(-x * (0.9 + max(0, m - 60) * 0.035))
    release = np.clip((dur + 1.2 - x) / 1.2, 0, 1) ** 2
    env = np.minimum(1, x / 0.004) * decay * np.where(x < dur, 1, release)
    return (s + tine) * env * vel * 0.32


def pad(ms, dur):
    x = t(dur)
    s = np.zeros_like(x)
    for m in ms:
        for det, ph in ((-0.06, 0.0), (0.06, 1.3)):
            s += np.sin(2 * np.pi * hz(m + det) * x + ph) + 0.18 * np.sin(2 * np.pi * 2 * hz(m + det) * x)
    s /= 2 * len(ms)
    env = np.minimum(1, x / 1.4) * np.minimum(1, (dur - x) / 1.2)
    return filt(s, "lowpass", 3200) * env * 0.11


def sub(m, dur):
    x = t(dur)
    s = np.sin(2 * np.pi * hz(m) * x) + 0.3 * np.sin(2 * np.pi * 2 * hz(m) * x)
    env = np.minimum(1, x / 0.08) * np.minimum(1, (dur - x) / 0.4) * (0.75 + 0.25 * np.exp(-x * 1.5))
    return s * env * 0.13


def room(stereo, seconds=2.2, wet=0.28, seed=11):
    """A small, dark room: two decorrelated noise tails for width."""
    rng = np.random.default_rng(seed)
    n = int(seconds * SR)
    decay = np.exp(-np.arange(n) / SR * (6.9 / seconds))
    out = np.zeros_like(stereo)
    for ch in (0, 1):
        ir = filt(rng.standard_normal(n), "lowpass", 6500) * decay
        ir /= np.sqrt(np.sum(ir ** 2))
        out[:, ch] = fftconvolve(stereo[:, ch], ir)[: len(stereo)]
    return (1 - wet) * stereo + wet * out


# ---------- the bed ----------

def voicing(root, quality, prev=None, lo=55, hi=77):
    """Chord tones without the root, placed in the piano's middle register, moving as little as possible."""
    tones = [q for q in QUALITY[quality] if q % 12 != 0] or QUALITY[quality]
    pcs = [(root + q) % 12 for q in tones]
    if prev is None:
        notes, last = [], lo - 1
        for pc in pcs:
            m = last + 1 + ((pc - (last + 1)) % 12)
            notes.append(m)
            last = m
        return sorted(notes)
    out = []
    for pc in pcs:
        cands = [m for m in range(lo, hi + 1) if m % 12 == pc]
        out.append(min(cands, key=lambda m: min(abs(m - p) for p in prev)))
    return sorted(set(out))


def bed(seconds, style="warm", key="D", seed=3):
    rng = np.random.default_rng(seed)
    k = NOTES[key]
    prog = STYLES[style]
    bars = int(np.ceil(seconds / BAR)) + 1
    n = int((seconds + 3) * SR)
    keys, warm, low = np.zeros((n, 2)), np.zeros((n, 2)), np.zeros((n, 2))
    prev = None
    end_bar = int(seconds // BAR)
    for b in range(bars):
        start = b * BAR
        if start > seconds:
            break
        final = b >= end_bar or start + BAR > seconds - 0.2
        deg, q = TONIC[style] if final else prog[b % len(prog)]
        root = (k + deg) % 12
        v = voicing(root, q, prev)
        prev = v
        hold = max(0.5, seconds - start) if final else 2 * BEAT
        # A rolled chord on the downbeat.
        for i, m in enumerate(v):
            place(keys, epiano(m, hold, 0.42 + 0.06 * rng.random()), start + 0.028 * i, pan=-0.25 + 0.5 * i / max(1, len(v) - 1))
        if not final:
            # Two or three sparse notes from the chord over the rest of the bar, softer than the chord.
            top = sorted(v)[-2:] + [v[-1] + 2 if (v[-1] + 2) % 12 in [(root + x) % 12 for x in QUALITY[q]] else v[-1]]
            for at in sorted(rng.choice([1.5, 2.0, 2.5, 3.0, 3.5], size=int(rng.integers(2, 4)), replace=False)):
                place(keys, epiano(int(rng.choice(top)) + 12, 0.9, 0.26 + 0.08 * rng.random()), start + at * BEAT, pan=0.2 * rng.standard_normal())
        if b >= 1 or final:
            place(warm, pad(v, min(BAR + 0.6, hold + 0.6)), start)
            place(low, sub(36 + (root - 0) % 12, min(BAR, hold)), start)
    mix = keys + 0.9 * warm + low
    # A slow, shallow tremolo on the piano gives it breath without movement in the rhythm.
    trem = 1 + 0.06 * np.sin(2 * np.pi * 4.5 * np.arange(n) / SR)
    mix[:, 0] *= trem
    mix[:, 1] *= trem
    mix = room(mix)
    # Voice it for phone speakers: nothing below 70 Hz, less low-mid mud, a little presence.
    mix = filt(mix, "highpass", 70)
    mix = mix - 0.35 * filt(mix, "bandpass", [120, 320]) + 0.45 * filt(mix, "bandpass", [1800, 6000])
    mix = filt(mix, "lowpass", 13000)
    mix = mix[: int(seconds * SR)]
    fade_in, fade_out = int(0.25 * SR), int(1.6 * SR)
    mix[:fade_in] *= np.linspace(0, 1, fade_in)[:, None]
    mix[-fade_out:] *= np.linspace(1, 0, fade_out)[:, None] ** 1.5
    return normalise(mix, -3.0)


# ---------- effects: three quiet ones, for one moment per scene at most ----------

def sfx():
    rng = np.random.default_rng(7)
    out = {}
    # tap: a soft felt tap, for a stamp or a counter landing
    x = t(0.25)
    out["tap"] = (np.sin(2 * np.pi * 520 * x) * np.exp(-x * 38) + 0.3 * filt(rng.standard_normal(len(x)), "lowpass", 1800) * np.exp(-x * 60)) * 0.6
    # paper: a slow, soft page movement, for a flip or a drawing being cut
    x = t(0.5)
    out["paper"] = filt(rng.standard_normal(len(x)), "bandpass", [700, 3200]) * np.sin(np.pi * x / 0.5) ** 3 * 0.35
    # chime: a quiet two-note bell, for the one reveal a reel turns on
    x = t(1.6)
    bell = sum(np.sin(2 * np.pi * hz(m) * x + 1.2 * np.exp(-x * 6) * np.sin(2 * np.pi * hz(m) * 3.5 * x)) * np.exp(-x * 2.2) for m in (79, 86))
    out["chime"] = bell * np.minimum(1, x / 0.003) * 0.25
    return {k: normalise(np.stack([v, v], axis=1), -9) for k, v in out.items()}


# ---------- io ----------

def normalise(x, db):
    peak = np.max(np.abs(x)) or 1.0
    return x / peak * 10 ** (db / 20)


def write(path, x):
    if x.ndim == 1:
        x = np.stack([x, x], axis=1)
    x = np.clip(x, -1, 1)
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x * 32767).astype("<i2").tobytes())


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    sub_ = p.add_subparsers(dest="cmd", required=True)
    s = sub_.add_parser("sfx")
    s.add_argument("out_dir")
    b = sub_.add_parser("bed")
    b.add_argument("out")
    b.add_argument("--seconds", type=float, required=True)
    b.add_argument("--style", default="warm", choices=list(STYLES))
    b.add_argument("--key", default="D", choices=list(NOTES))
    b.add_argument("--seed", type=int, default=3)
    a = p.parse_args()
    if a.cmd == "sfx":
        os.makedirs(a.out_dir, exist_ok=True)
        for name, clip in sfx().items():
            write(os.path.join(a.out_dir, f"{name}.wav"), clip)
            print(f"{name}.wav")
    else:
        write(a.out, bed(a.seconds, a.style, a.key, a.seed))
        print(a.out)
