# realization.world — Final Delivery Index

This file is the durable index for the website materials produced in the Codex task **Build realization.world website**.

## Review the website

- Local preview: http://127.0.0.1:3000
- Repository: https://github.com/SufZen/realization.world.git
- Repository root: this Git repository

The local preview must be started with `npm run dev` from the local repository. It is currently intended for review only.

## Main deliverables

- `src/app/` — all application routes and page metadata
- `src/components/` — shared navigation, cards, forms, visual systems and diagrams
- `src/content/site.ts` — central ventures, partners, markets and insights content
- `src/app/globals.css` — design tokens, responsive layouts and motion
- `public/brand/` — supplied brand assets
- `public/media/` — generated editorial imagery
- `Dockerfile` and `.dockerignore` — future Coolify-compatible container setup
- `README.md` — development, editing, governance and deployment notes

## Generated editorial imagery

- `public/media/hero-physical-world.png`
- `public/media/venture-portugal.png`
- `public/media/venture-realizeos.png`

## Main routes

- `/` — Home
- `/thesis` — Thesis
- `/how-we-build` — Venture-building model
- `/ventures` — Portfolio
- `/ventures/realization-portugal` — Realization Portugal case structure
- `/ventures/realizeos` — RealizeOS case structure
- `/partners` and `/partners/*` — audience-specific partner journeys
- `/markets` — Israel–Europe bridge
- `/markets/israel` — Israeli capital, technology and partnership side
- `/markets/portugal` — core European opportunity market
- `/markets/spain` — reserved future-market research page; not an active operation
- `/insights` and `/insights/*` — editorial structure
- `/about` — studio and founder role
- `/bring-an-opportunity` — structured opportunity brief

## Authoritative source materials

- Design archive: `docs/design-system/Realization-Design-System.zip`
- Brand strategy: `docs/strategy/realization-brand-strategy.html`
- Source index and checksums: `docs/README.md`

## Current status

- Production build and lint checks pass.
- Desktop and mobile browser verification passed.
- Israeli partnership positioning, active Portugal positioning and reserved Spain research positioning are implemented.
- Production deployment has not been performed.
