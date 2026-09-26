# realization.world

Static site served by GitHub Pages at https://realization.world. No build step, no dependencies.

| Path | What it is |
|---|---|
| `index.html` | Realization holding page (placeholder until the brand site exists) |
| `asaf/index.html` | Asaf Eyzenkot's professional profile — https://realization.world/asaf/ |
| `asaf/profile.md` | Plain-text version of the profile, for AI tools and screeners |
| `llms.txt` | Pointer for AI crawlers |
| `assets/brand/` | Poppins (OFL, Latin subset woff2) and the butterfly mark |

## Updating

- **Text change:** edit `asaf/index.html` and `asaf/profile.md` (keep them in sync), commit, push. Live in about a minute.
- **No public CV** by design: each recruiter receives a role-specific CV; the page offers one on request.
- Case studies and testimonials: a commented `PROOF SLOT` in `asaf/index.html` is ready to fill.

## Branches

- `main` — **live**. The VPS pulls it every 5 minutes (`/opt/realization-world/update.sh`).
- `structure` — draft of the full brand site (home, services, projects, markets, contact) with dashed PLACEHOLDER blocks and `noindex`. Merge into `main` only when placeholders are replaced with content from the strategy/domain-roles document.
- Shared design system for multi-page content: `assets/site.css`. `/asaf` stays self-contained.
## Typography — line-break rule (applies to every page)

Text breaks where a reader would pause, never where the box happens to end.

1. **Break at punctuation or between phrases.** Short display text (hero lines, pillar text, box values) is authored line by line: wrap each line in `<span class="ln">` (renders as its own line). Example: `Clear structure, coordinated people, lean systems.` / `That's how I make complex work run.` — two lines, split at the full stop.
2. **Never split a unit.** Names, places, dates, numbers with units, emails and fixed phrases stay whole: wrap in `<span class="nw">` (no wrap). E.g. `Lisbon area & Barcelona`, `Early October 2026`, `Tel Aviv University`, `11-unit`.
3. **No line may end on a weak word** (a, an, the, and, or, of, in, to, for, with, &) and **no one-word last line** (orphan).
4. **One sentence per line in detail text** where sentences are short; split long sentences into two.
5. **An authored line must fit on one line** from 768 px up. If it wraps, shorten or re-split it — don't shrink the font.
6. CSS safety net (already in place): `text-wrap: balance` on headings and short display text, `text-wrap: pretty` on paragraphs.
7. **Verify before shipping:** run `tools/linebreak-check.js` in the browser console at 1440, 1024, 880 and 390 px. It must report `problems: []`.
