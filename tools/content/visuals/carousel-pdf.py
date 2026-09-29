#!/usr/bin/env python3
"""Content engine — join a cluster's carousel slides into one PDF for a LinkedIn document post.

    python3 tools/content/visuals/carousel-pdf.py <cluster-visuals-dir> <out.pdf>

Reads carousel-*.png in slide order. Needs Pillow (pip install pillow).
"""
import glob, os, sys

from PIL import Image


def main(src, out):
    slides = sorted(glob.glob(os.path.join(src, "carousel-*.png")))
    if not slides:
        sys.exit(f"no carousel-*.png in {src}")
    pages = [Image.open(p).convert("RGB") for p in slides]
    pages[0].save(out, save_all=True, append_images=pages[1:], resolution=144)
    print(f"{len(pages)} slides → {out}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(*sys.argv[1:])
