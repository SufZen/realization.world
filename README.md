# realization.world

Production website for **Realization**, a **Physical-World Venture Studio** realizing untapped potential in the physical world. The site uses Next.js App Router, TypeScript, accessible responsive components, first-party metadata, and a standalone Docker build for Coolify.

The repository also retains the existing `/asaf/` founder profile, its plain-text source and line-break audit utility, the supplied brand assets, and the existing root holding page. The Next.js application and retained static materials are both part of this project.

## Local development

Requires Node.js 20.9 or newer.

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

Quality checks:

```bash
npm run lint
npm run build
npm audit --omit=dev
```

The health endpoint is available at `GET /api/health`.

## Site structure

- `/` — Realization studio homepage
- `/thesis` — physical-world venture thesis
- `/how-we-build` — Discover → Architect → Build → Validate → Transfer
- `/ventures` — portfolio index
- `/ventures/realization-portugal` and `/ventures/realizeos` — venture case studies
- `/partners/*` — opportunity owner, operator, capital, and corporate/public journeys
- `/markets/*` — Israeli capital and partnership bridge, active Portugal market, and Spain research page
- `/insights/*` — editorial structure and field notes
- `/about` — studio and founder role
- `/bring-an-opportunity` — structured opportunity brief
- `/asaf/` — retained founder profile

## Editing content

Shared navigation, venture, audience, market, and insight content lives in `src/content/site.ts`. Page-specific narrative lives in `src/app/**/page.tsx`. Brand styling and tokens live in `src/app/globals.css`.

For changes to the `/asaf/` profile, edit `asaf/index.html` and `asaf/profile.md` together. The profile's `tools/linebreak-check.js` can be run in the browser console at 1440, 1024, 880, and 390 px; it should report `problems: []`.

The opportunity form opens a structured email to `hello@realization.world` and does not store submissions. Add server-side intake only after its destination, retention policy, privacy notice, and security controls are approved.

## Content and claim governance

Realization Portugal and RealizeOS pages mark unresolved status, operator, licensing, customer, deployment, and outcome claims for verification. Before publishing a claim, record its source, date, definition, methodology, and permission to publish.

The parent studio, Realization Portugal, RealizeOS, the Israeli capital and partnership bridge, and future ventures must remain distinct. State “Built by Realization,” “Operated by [Partner],” ownership, licensing, and data-controller responsibilities separately.

The source strategy and supplied design archive are kept under `docs/`; see [`docs/README.md`](docs/README.md) for descriptions and checksums.

## Future Coolify deployment

The multi-stage `Dockerfile` uses Next.js standalone output and runs as a non-root user on port `3000`.

1. Connect this repository in Coolify and select Dockerfile deployment.
2. Expose container port `3000`.
3. Configure the domain and HTTPS at the platform proxy.
4. Set the health check path to `/api/health`.
5. Start with one application instance. If scaling with dynamic caching or Server Actions, configure shared cache and a consistent `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`.
6. Keep a reverse proxy in front of Node.js and configure request limits and rate limiting there.

Pushing this source does not deploy the site. Production deployment will be configured separately through Coolify.

## Important disclaimer

Site strategy and content are not legal, securities, trademark, tax, regulatory, privacy, licensing, investment, or SEO advice. Appropriate professional review is required in each market before launch or promotion of a venture.
