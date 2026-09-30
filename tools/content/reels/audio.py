#!/usr/bin/env python3
"""Content engine reels: original music beds and sound effects, synthesized from scratch.

Everything is generated here, so there is nothing to license. The bed is minimal and editorial: a soft kick, closed hats,
a sub bass, a plucked mallet arpeggio and a quiet pad. It locks to the reels' 120 BPM edit grid (one beat = 15 frames
at 30 fps), and its last bar drops to one held chord under the closing card.

  python3 tools/content/reels/audio.py sfx <out-dir>
  python3 tools/content/reels/audio.py bed <out.wav> --seconds 28 --key A --mode minor --seed 1 --tail-bars 2

Needs numpy and scipy.
"""
import argparse
import os
import wave

import numpy as np
from scipy.signal import butter, sosfilt

SR = 44100
BPM = 120
BEAT = 60 / BPM
NOTES = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11}


def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


def t(sec):
    return np.arange(int(sec * SR)) / SR


def env(n, a=0.002, d=0.2, curve=4.0):
    """Attack then exponential-ish decay over n samples."""
    x = np.arange(n) / SR
    att = np.clip(x / max(a, 1e-4), 0, 1)
    dec = np.exp(-curve * np.clip(x - a, 0, None) / max(d, 1e-4))
    return att * dec


def filt(x, kind, freq, order=2):
    sos = butter(order, freq, btype=kind, fs=SR, output="sos")
    return sosfilt(sos, x)


def place(buf, clip, at):
    i = int(at * SR)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(clip))
    buf[i:j] += clip[: j - i]


# ---------- instruments ----------

def kick():
    x = t(0.45)
    f = 48 + 90 * np.exp(-x * 38)  # pitch drop
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * env(len(x), 0.001, 0.32, 3.2)
    click = filt(np.random.default_rng(3).standard_normal(len(x)), "highpass", 2500) * env(len(x), 0.0005, 0.006)
    return np.tanh(1.6 * (body + 0.25 * click)) * 0.9


def hat(open_=False, seed=0):
    n = int((0.18 if open_ else 0.05) * SR)
    noise = np.random.default_rng(seed).standard_normal(n)
    x = filt(noise, "highpass", 7000, 4)
    return x * env(n, 0.0008, 0.09 if open_ else 0.018, 3) * 0.22


def clap(seed=0):
    n = int(0.22 * SR)
    noise = filt(np.random.default_rng(seed).standard_normal(n), "bandpass", [900, 2600], 2)
    e = np.zeros(n)
    for k, off in enumerate([0, 0.011, 0.022]):
        i = int(off * SR)
        e[i:] += env(n - i, 0.0005, 0.012 if k < 2 else 0.12, 3)
    return noise * e * 0.35


def bass(midi, sec):
    x = t(sec)
    f = hz(midi)
    # Harmonics and drive so the line still reads on a phone speaker that cannot play the fundamental.
    s = np.sin(2 * np.pi * f * x) + 0.45 * np.sin(2 * np.pi * 2 * f * x) + 0.25 * np.sin(2 * np.pi * 3 * f * x)
    e = np.minimum(1, x / 0.008) * np.exp(-x * 2.2)
    return np.tanh(2.2 * s) * e * 0.3


def pluck(midi, sec=0.6, bright=1.0):
    """Two-operator FM mallet: warm, short, a little woody."""
    x = t(sec)
    f = hz(midi)
    idx = 2.2 * bright * np.exp(-x * 14)
    s = np.sin(2 * np.pi * f * x + idx * np.sin(2 * np.pi * f * 3.5 * x))
    return s * env(len(x), 0.001, 0.28, 3.5) * 0.3


def pad(midis, sec):
    x = t(sec)
    s = np.zeros_like(x)
    for m in midis:
        for det in (-0.07, 0.0, 0.07):
            f = hz(m + det)
            s += 2 * (x * f % 1) - 1  # saw
    s = filt(s / (3 * len(midis)), "lowpass", 2400, 2)
    e = np.minimum(1, x / 0.35) * np.minimum(1, (sec - x) / 0.4)
    return s * e * 0.26


# ---------- the bed ----------

PROGRESSIONS = {
    "minor": [[0, 3, 7], [-4, 0, 3], [-9, -5, -2], [-2, 2, 5]],  # i - VI - III - VII
    "major": [[0, 4, 7], [-3, 0, 4], [-7, -3, 0], [-5, -1, 2]],  # I - vi - IV - V
}


def bed(seconds, key="A", mode="minor", seed=1, tail_bars=1):
    rng = np.random.default_rng(seed)
    root = 45 + NOTES[key]  # bass octave
    prog = PROGRESSIONS[mode]
    bar = 4 * BEAT
    bars = int(np.ceil(seconds / bar))
    n = int(seconds * SR) + SR
    drums, low, mid = np.zeros(n), np.zeros(n), np.zeros(n)
    k, arp_shape = kick(), rng.permutation([0, 1, 2, 1, 2, 0, 2, 1])
    for b in range(bars):
        start = b * bar
        chord = prog[b % len(prog)]
        last = b >= bars - tail_bars
        if last:
            # One held chord under the close, then a single low hit on the downbeat.
            place(mid, pad([root + 12 + c for c in chord], bar + 0.8) * 1.6, start)
            place(low, bass(root + chord[0], bar), start)
            place(drums, k, start)
            continue
        for q in range(4):
            place(drums, k * (1.0 if q in (0, 2) else 0.0), start + q * BEAT)
            if q in (1, 3) and b > 0:
                place(drums, clap(seed + b * 4 + q), start + q * BEAT)
        for e8 in range(8):
            place(drums, hat(open_=(e8 == 7 and b % 2 == 1), seed=b * 8 + e8) * (1.0 if e8 % 2 else 0.6), start + e8 * BEAT / 2)
        # Sub bass on the root, pushing on the and-of-two.
        for at, dur in ((0, 1.5 * BEAT), (1.5 * BEAT, 0.5 * BEAT), (2 * BEAT, 2 * BEAT)):
            place(low, bass(root + chord[0], dur), start + at)
        # Mallet arpeggio from bar 2: eighth notes over the chord, an octave up.
        if b >= 1:
            for e8 in range(8):
                if rng.random() < 0.18:
                    continue
                note = root + 24 + chord[arp_shape[e8] % 3] + (12 if e8 == 6 else 0)
                place(mid, pluck(note, 0.5, 0.8 + 0.4 * rng.random()), start + e8 * BEAT / 2)
        place(mid, pad([root + 12 + c for c in chord], bar) * 0.55, start)
    # Light sidechain: duck the mids under each kick.
    duck = np.ones(n)
    for b in range(bars):
        for q in (0, 2):
            i = int((b * bar + q * BEAT) * SR)
            m = int(0.18 * SR)
            if i + m < n:
                duck[i : i + m] = np.minimum(duck[i : i + m], 0.45 + 0.55 * np.linspace(0, 1, m) ** 0.6)
    mix = 0.75 * drums + 0.6 * low + 1.5 * mid * duck
    mix = filt(mix, "highpass", 28, 2)
    mix = mix[: int(seconds * SR)]
    fade = int(0.35 * SR)
    mix[-fade:] *= np.linspace(1, 0, fade)
    return normalise(mix, -1.5)


# ---------- effects ----------

def sfx():
    rng = np.random.default_rng(7)
    out = {}
    # tick: a short, dry wooden click for typing and counters
    x = t(0.035)
    out["tick"] = np.sin(2 * np.pi * 2400 * x) * env(len(x), 0.0003, 0.008, 3) * 0.5
    # thud: a low hit for slams
    x = t(0.35)
    f = 70 + 60 * np.exp(-x * 30)
    out["thud"] = np.tanh(2 * np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(x), 0.001, 0.2, 3)) * 0.8
    # stamp: thud plus a paper slap
    slap = filt(rng.standard_normal(len(x)), "bandpass", [600, 3500]) * env(len(x), 0.0005, 0.04, 3)
    out["stamp"] = np.tanh(out["thud"] * 1.2 + slap * 0.6) * 0.85
    # snap: a crisp transient for cuts and flips
    x = t(0.08)
    out["snap"] = filt(rng.standard_normal(len(x)), "highpass", 3000) * env(len(x), 0.0003, 0.012, 3) * 0.6
    # whoosh: band-passed noise sweeping up then down
    x = t(0.45)
    noise = rng.standard_normal(len(x))
    lo = filt(noise, "bandpass", [300, 1200])
    hi = filt(noise, "bandpass", [1500, 5000])
    shape = np.sin(np.pi * np.clip(x / 0.45, 0, 1)) ** 2
    mixw = (lo * (1 - x / 0.45) + hi * (x / 0.45)) * shape
    out["whoosh"] = mixw * 0.5
    # whip: a faster, brighter whoosh for strike-throughs and cuts
    x = t(0.2)
    noise = filt(rng.standard_normal(len(x)), "highpass", 1800)
    out["whip"] = noise * (np.sin(np.pi * np.clip(x / 0.2, 0, 1)) ** 3) * 0.55
    # riser: a two-second filtered-noise lift
    x = t(1.0)
    noise = rng.standard_normal(len(x))
    parts = [filt(noise[i : i + 4410], "bandpass", [200 + 5000 * (i / len(x)), 400 + 7000 * (i / len(x))]) for i in range(0, len(x), 4410)]
    r = np.concatenate(parts)[: len(x)]
    out["riser"] = r * (x / 1.0) ** 2 * 0.35
    # scratch: a pen drawing a line
    x = t(0.4)
    noise = filt(rng.standard_normal(len(x)), "bandpass", [2500, 6000])
    grain = 0.6 + 0.4 * np.sin(2 * np.pi * 38 * x + 3 * np.sin(2 * np.pi * 5 * x))
    out["scratch"] = noise * grain * np.minimum(1, x / 0.03) * np.minimum(1, (0.4 - x) / 0.06) * 0.22
    return {k: normalise(v, -3 if k not in ("tick", "scratch") else -8) for k, v in out.items()}


# ---------- io ----------

def normalise(x, db):
    peak = np.max(np.abs(x)) or 1.0
    return x / peak * 10 ** (db / 20)


def write(path, x):
    x = np.clip(x, -1, 1)
    stereo = np.stack([x, x], axis=1)
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((stereo * 32767).astype("<i2").tobytes())


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("sfx")
    s.add_argument("out_dir")
    b = sub.add_parser("bed")
    b.add_argument("out")
    b.add_argument("--seconds", type=float, default=26)
    b.add_argument("--key", default="A")
    b.add_argument("--mode", default="minor", choices=list(PROGRESSIONS))
    b.add_argument("--seed", type=int, default=1)
    b.add_argument("--tail-bars", type=int, default=1)
    a = p.parse_args()
    if a.cmd == "sfx":
        os.makedirs(a.out_dir, exist_ok=True)
        for name, clip in sfx().items():
            write(os.path.join(a.out_dir, f"{name}.wav"), clip)
            print(f"{name}.wav")
    else:
        write(a.out, bed(a.seconds, a.key, a.mode, a.seed, a.tail_bars))
        print(a.out)
