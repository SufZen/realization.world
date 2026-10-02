#!/usr/bin/env bash
# Fetch the CC0 instrument samples the music engine plays (Versilian Community Sample Library, public domain:
# https://github.com/sgossner/VCSL). Only the folders the reels use are downloaded (~450 MB), into samples/vcsl
# (git-ignored). Safe to re-run.
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
dest="$here/samples/vcsl"
if [ ! -d "$dest/.git" ]; then
  git clone -q --depth 1 --filter=blob:none --no-checkout https://github.com/sgossner/VCSL "$dest"
fi
cd "$dest"
{
  git ls-tree -r --name-only HEAD -- "Idiophones/Struck Idiophones/Vibraphone" | grep -E "Vibes_(soft|hard)_"
  git ls-tree -r --name-only HEAD -- "Chordophones/Zithers/Grand Piano, Steinway B" | grep -E "JHPiano_Sus_Close_[A-G]#?[2-6]_vl(2|3)_"
  git ls-tree -r --name-only HEAD -- "Idiophones/Struck Idiophones/Hi-Hat Cymbal" "Idiophones/Struck Idiophones/Shaker, Small"
  git ls-tree -r --name-only HEAD -- "Membranophones/Struck Membranophones/Snare Drum, Modern 1" | grep -E "stick|HitNS_v2|HitNS_v4|taps"
} | tr '\n' '\0' | xargs -0 git checkout -q HEAD --
echo "samples ready in $dest"
