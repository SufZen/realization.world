# realization.world

Static site served by GitHub Pages at https://realization.world. No build step, no dependencies.

| Path | What it is |
|---|---|
| `index.html` | Realization holding page (placeholder until the brand site exists) |
| `asaf/index.html` | Asaf Eyzenkot's professional profile — https://realization.world/asaf/ |
| `asaf/profile.md` | Plain-text version of the profile, for AI tools and screeners |
| `asaf/Asaf_Eyzenkot_CV.pdf` | Generic CV served by the page |
| `llms.txt` | Pointer for AI crawlers |
| `assets/brand/` | Poppins (OFL, Latin subset woff2) and the butterfly mark |

## Updating

- **Text change:** edit `asaf/index.html` and `asaf/profile.md` (keep them in sync), commit, push. Live in about a minute.
- **New CV:** replace `asaf/Asaf_Eyzenkot_CV.pdf` with the new master PDF, same filename.
- Case studies and testimonials: a commented `PROOF SLOT` in `asaf/index.html` is ready to fill.

## Branches

- `main` — **live**. The VPS pulls it every 5 minutes (`/opt/realization-world/update.sh`).
- `structure` — draft of the full brand site (home, services, projects, markets, contact) with dashed PLACEHOLDER blocks and `noindex`. Merge into `main` only when placeholders are replaced with content from the strategy/domain-roles document.
- Shared design system for multi-page content: `assets/site.css`. `/asaf` stays self-contained.
