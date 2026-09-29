# realization.world

Production website for **Realization**: real estate in Portugal, and the ventures and AI systems built around it. The site has two conversion paths — real estate & capital, and AI & operations advisory — and is built to be read by people, search engines, LLMs and AI agents. Next.js App Router, TypeScript, a schema.org graph, and a standalone Docker build for Coolify.

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

- `/` — homepage: two audience doors, proof strip, selected work
- `/work` and `/work/<slug>` — portfolio and case studies (`/ventures/*` 308-redirects here)
- `/advisory` — AI adoption and operations engagement model, with FAQ
- `/partners/*` — opportunity owner, operator, capital, and corporate/public journeys
- `/insights/*` — field notes
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

Analytics are optional and cookieless (Umami, `src/components/analytics.tsx`). Links carry `data-umami-event` attributes: `book-intro`, `whatsapp`, `open-brief`, `submit-brief`, `outbound`; a `/thank-you` page view is a submitted brief.

## Content and claim governance

Every case study carries a `source` line, and numbers are taken from dated project overviews or repository counts. Before publishing a claim, record its source, date, definition, methodology, and permission to publish. Arena financial terms (prices, returns, capital structure) are never published; they are shared with qualified capital partners on request.

The parent studio, Realization Portugal, RealizeOS, the Israeli capital and partnership bridge, and future ventures must remain distinct. State “Built by Realization,” “Operated by [Partner],” ownership, licensing, and data-controller responsibilities separately.

The source strategy and supplied design archive are kept under `docs/`; see [`docs/README.md`](docs/README.md) for descriptions and checksums.

## Coolify deployment

The multi-stage `Dockerfile` uses Next.js standalone output and runs as a non-root user on port `3000`.

1. Connect this repository in Coolify and select Dockerfile deployment.
2. Expose container port `3000`.
3. Configure the domain and HTTPS at the platform proxy.
4. Set the health check path to `/api/health`.
5. Add the environment variables from `.env.example` (SMTP for the brief form; Umami and search-console verification optional).
6. Start with one application instance. If scaling with dynamic caching or Server Actions, configure shared cache and a consistent `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`.
7. Keep a reverse proxy in front of Node.js and configure request limits and rate limiting there.

Pushing this source does not deploy the site; deploys are triggered in Coolify.

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
