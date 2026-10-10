# realization.world

Production website for **Realization**: real estate in Portugal, and the ventures and AI systems built around it. The site has two conversion paths — services in three pillars (real estate development, AI and operations systems, delivery and team setup) and partnerships (owners, operators, capital) — and is built to be read by people, search engines, LLMs and AI agents. Next.js App Router, TypeScript, a schema.org graph, and a standalone Docker build.

The repository also holds the static `/asaf/` founder profile (`public/asaf/`), its plain-text source and line-break audit utility, and the brand assets.

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

- `/` — homepage: three pillar doors, proof strip, testimonials (when there are any), selected work, latest videos and field notes
- `/services` — hub; `/services/real-estate`, `/services/ai-systems` (also in Hebrew at `/he/services/ai-systems`), `/services/team-setup` — what can be bought, prices and how to start. Content in `src/content/services.ts`; decision record in `docs/strategy/2026-10-services-decision.md`. `/advisory` 301-redirects to `/services/ai-systems`, `/services/delivery` to `/services/team-setup`
- `/work` and `/work/<slug>` — portfolio and case studies (`/ventures/*` 308-redirects here)
- `/partners/*` — opportunity owner, operator, capital, and corporate/public journeys
- `/insights` — Learn: field notes, the latest YouTube videos (read from the channel's RSS feed, `src/lib/youtube.ts`), webinars and the email signup; `/insights/<slug>` — field notes
- `/links` — one link for every social bio (`src/content/links.ts`, not indexed)
- `/about`, `/thesis`, `/how-we-build`, `/markets/*` — the model behind the work
- `/bring-an-opportunity` — brief form (server action → email); `/thank-you` is the conversion page
- `/privacy`, `/legal` — privacy notice and legal notice
- `/asaf` — founder profile (static, `public/asaf/`)

For LLMs and agents (all generated from the same content):

- `/llms.txt` and `/llms-full.txt` — site index and full text
- `/work/<slug>.md` and `/insights/<slug>.md` — markdown twins (rewritten to `src/app/md/*`)
- `/api/public/work`, `/api/public/work/<slug>`, `/api/public/insights`, `/openapi.json` — read-only JSON
- `/api/mcp` — MCP server (Streamable HTTP, stateless JSON-RPC): `list_work`, `get_case`, `list_insights`, `get_insight`, `get_services`, `get_contact_and_booking`, `submit_brief`

## Editing content

The portfolio lives in `src/content/work.ts`: one `WorkItem` per project, venture, system or engagement. Adding an entry there creates its case page, share image, markdown twin, JSON, MCP result, sitemap entry and `llms.txt` line. Put images in `public/work/<slug>/` as WebP, 1600 px wide or less.

Navigation, audience, market and insight content lives in `src/content/site.ts`. Page-specific narrative lives in `src/app/**/page.tsx`. Brand styling and tokens live in `src/app/globals.css`. Schema.org nodes are built in `src/lib/schema.ts`.

For changes to the `/asaf/` profile, edit `public/asaf/index.html` and `public/asaf/profile.md` together. The profile's `tools/linebreak-check.js` can be run in the browser console at 1440, 1024, 880, and 390 px; it should report `problems: []`.

The opportunity form sends the brief by email through a server action (`src/app/bring-an-opportunity/actions.ts`, `src/lib/mail.ts`) using the same SMTP variables as the Live Lab; see `.env.example`. Nothing is stored on the website. Without SMTP settings the form keeps the visitor's text and offers "open in your email app" instead. Validation and rate limiting are shared with the MCP `submit_brief` tool (`src/lib/brief.ts`).

Analytics are optional and cookieless (Umami, `src/components/analytics.tsx`). Links carry `data-umami-event` attributes: `book-intro`, `whatsapp`, `open-brief`, `submit-brief`, `outbound`; a `/thank-you` page view is a submitted brief. The Services pages add `book-session-<pillar>`, `buy-audit`, `join-webinar`, `deal-check`, and elsewhere `join-newsletter`, `watch-video` and `social` (with `pillar`, `ref` and similar properties).

Testimonials live in `src/content/testimonials.ts` (real, approved quotes only); their sections stay hidden until there is at least one. Videos are tagged to a pillar page in `src/content/videos.ts`.

## Content and claim governance

Every case study carries a `source` line, and numbers are taken from dated project overviews or repository counts. Before publishing a claim, record its source, date, definition, methodology, and permission to publish. Arena financial terms (prices, returns, capital structure) are never published; they are shared with qualified capital partners on request.

The parent studio, Realization Portugal, RealizeOS, the Israeli capital and partnership bridge, and future ventures must remain distinct. State “Built by Realization,” “Operated by [Partner],” ownership, licensing, and data-controller responsibilities separately.

The source strategy and supplied design archive are kept under `docs/`; see [`docs/README.md`](docs/README.md) for descriptions and checksums.

## Deployment

The multi-stage `Dockerfile` uses Next.js standalone output and runs as a non-root user on port `3000`.

**Merging to `main` is the deploy.** The production server checks `origin/main` every five minutes. When it has moved, the server pulls it, rebuilds the Docker image and restarts the container; the previous image is kept for rollback. A rebuild takes a few minutes, so a merge is usually live within about ten. Coolify runs on the same server but does not build or deploy this site, and settings entered in Coolify do not reach it.

- **Runtime variables** from `.env.example` (SMTP for the forms, the webinar and deal-check Sheet webhooks) are set in an env file on the server, never in the repository. After changing one, recreate the container; no rebuild is needed.
- **Build-time variables** (`NEXT_PUBLIC_*` for Umami and search-console verification, and `UMAMI_PROXY_TARGET`) are passed to the Docker build as build arguments, so changing one needs a rebuild.
- **Domain and HTTPS** are handled by the server's Traefik proxy in front of the container. Keep request limits and rate limiting there.
- **Health check:** `GET /api/health`.
- Run one instance. If scaling with dynamic caching or Server Actions, configure a shared cache and a consistent `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`.

Server access, the update script and the env file location are kept out of this public repository; ask Asaf.

## Important disclaimer

Site strategy and content are not legal, securities, trademark, tax, regulatory, privacy, licensing, investment, or SEO advice. Appropriate professional review is required in each market before launch or promotion of a venture.

## Typography — line-break rule (applies to every page)

Text breaks where a reader would pause, never where the box happens to end.

1. **Break at punctuation or between phrases.** Mark break points in copy with ` | ` and render it with `<Lines text=… />` (`src/components/lines.tsx`); each part becomes its own line. In static HTML (`public/asaf/`) use `<span class="ln">`.
2. **Never split a unit** (names, places, dates, numbers with units, emails, fixed phrases): `<span class="nw">`.
3. **No line may end on a weak word** (a, an, the, and, or, of, in, to, for, with, &) and **no one-word last line** (orphan).
4. **One short sentence per line** in detail text; split long sentences.
5. **An authored line in a heading or lead must fit on one line** from 768 px up — shorten or re-split, don't shrink the font. In narrow card text a balanced wrap inside a line is acceptable as long as rule 3 holds.
6. Safety net in CSS: `text-wrap: balance` on headings and `.ln`, `text-wrap: pretty` on paragraphs.
7. **Verify before shipping:** run `tools/linebreak-check.js` in the browser console at 1440, 1024, 880 and 390 px on every changed page; it must report `problems: []`.
