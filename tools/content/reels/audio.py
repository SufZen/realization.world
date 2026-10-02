#!/usr/bin/env python3
"""Content engine reels: three quiet sound effects, synthesized from scratch (nothing to license). Music is music.py.

  python3 tools/content/reels/audio.py sfx <out-dir>

Needs numpy and scipy.
"""
import argparse
import os
import wave

import numpy as np
from scipy.signal import butter, sosfilt

SR = 44100


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def t(sec):
    return np.arange(int(sec * SR)) / SR


def filt(x, kind, freq, order=2):
    return sosfilt(butter(order, freq, btype=kind, fs=SR, output="sos"), x, axis=0)


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
    a = p.parse_args()
    if a.cmd == "sfx":
        os.makedirs(a.out_dir, exist_ok=True)
        for name, clip in sfx().items():
            write(os.path.join(a.out_dir, f"{name}.wav"), clip)
            print(f"{name}.wav")
