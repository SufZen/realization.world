# Content engine runbook

Instructions for the scheduled runs. Each run is a fresh Claude Code cloud session with this repository checked out and the Fireflies, Google Drive, Buffer and Metricool connectors attached. The session starts empty: everything it needs is in this repo, in the content desk's database, or in Drive.

Read first: `README.md`, `voice.md`, `decisions.md`, `playbooks.md` in this folder. `decisions.md` overrides older source material.

## Where state lives

| Store | What | How to use it |
|---|---|---|
| This repo (public) | Engine code, prompts, desk template | Never commit private context. `content/private/` is git-ignored scratch space. |
| Content desk database | Ledger, drafts, decisions, facts, pilot, engine state | `ArtifactData` on the desk URL given in the routine prompt. Read collections to files with `list` + `out_dir`; write with `batch` + `file_path`. |
| Content desk assets | Rendered images | `Artifact` publish with `url`, `asset: true`, `file_paths` (≤ 25 per call). |
| Google Drive · `Realization Content Engine` | Human-readable copy of every run | Drive can create but not edit files: every run writes new dated files. Folder ids are in `engine/state.drive`. |

Database collections:

| Collection | Doc id | Access | Written by |
|---|---|---|---|
| `engine/state` | one doc | owner/editors only | runs |
| `engine/notices` | one doc `{items: [...]}` | owner/editors only | runs |
| `ledger/<item id>` | one per insight (private context inside) | owner/editors only | weekly run |
| `facts/<Fnn>` | one per checked claim | owner/editors only | weekly run |
| `drafts/<cluster id>` | one per topic, public-safe | read: viewers · write: editors | weekly run |
| `decisions/<cluster id>__<channel>` | Asaf's decision per piece | the desk page | Asaf; publisher adds scheduling fields |
| `published/<cluster id>__<channel>` | post ids, URLs, metrics | owner/editors only | publisher, analytics |
| `pilot/desk`, `pilot/pack` | pilot episode | owner/editors only | — |

Channels (`decisions` keys): `linkedin`, `x`, `short`, `web`, `long`, `visuals`, `pilot`. Status values: `approved`, `edits`, `skip`, or missing (= pending).

Always pin writes to existing docs with `if_version` from your read. On a version conflict, re-read and redo; never overwrite Asaf's decision docs except to add the publisher fields named below.

---

## Run A — weekly harvest and drafts (Mondays)

1. **Load state.** `list` `engine` → read `state.json` (last harvest date, processed meeting ids, next cluster number, Drive ids, channel ids, cadence, weights). `list` `ledger` and `drafts` to files for dedupe.
2. **Harvest (Agent A).** Fireflies meetings from `harvested_through` to today (`fireflies_get_transcripts` with `fromDate`; page with `toDate`). Skip ids in `processed_meeting_ids`, recordings under 8 minutes, and third-party talks where Asaf only listens. Drive: files owned by info@realization.co.il modified since `drive_processed_through`, excluding invoices, receipts, personal files and anything Lifebook.
3. **Extract, privacy, score (Agents B, C, E).** Follow the extraction brief in the "Brief" section below. Write items to `content/private/<run date>/harvest/*.json`. For more than ~15 meetings, fan out subagents by date range, each writing only its own file.
4. **Rank and dedupe (Agent D).** `node tools/content/rank.mjs content/private/<date> content/private/<date>/harvest/*.json`. Then compare the top items against existing `ledger` titles and generalized insights: when a new item repeats an existing one, don't create a new topic. Add the new source to the existing item and add +1 to its evidence_strength.
5. **Verify (Agent F) before writing.** Check every `claims_to_verify` of the items you will draft against primary Portuguese sources (dre.pt, Portal das Finanças, INE, Banco de Portugal, gov.pt, law-firm notes). Re-check any existing fact older than 60 days that a new draft relies on. Write `facts/<Fnn>` docs, continuing the numbering.
6. **Cluster and draft (Agents G, H, J).** Pick 4–8 topics for the wave: the highest-scoring P0/P1 items (weighted by `state.weights`), plus 1–2 untouched high scorers from the ledger. Skip P2 items unless Asaf has approved them (see step 9), and never draft P3. Cluster ids continue from `next_cluster_seq`: `C20-<slug>`, `C21-<slug>`… Write drafts with the exact JSON shape used by existing `drafts` docs (LinkedIn, X, short with storyboard, long_form_seed, `carousel` with one diagram per `visual-language.md` §7 and §9; `web_article` for at most 2 topics). Write every piece in Asaf's voice (`voice.md`) and rotate openings and closings across the wave. Add `wave: "<run date>"` and `source_item_ids`. Mark up to 1 piece per wave `film` when it is best recorded by Asaf himself (a sentence on why). Then run `node tools/content/lint.mjs <drafts-dir>` and fix every error (never-use words, X length, carousel and diagram limits) and every rhythm warning before moving on.
7. **Visuals.** `npm i --no-save --prefix /tmp/pw playwright` then `PLAYWRIGHT_MODULE=/tmp/pw/node_modules/playwright node tools/content/visuals/render.mjs <drafts-dir> <visuals-dir>`. It draws each draft's `carousel` in its style (Term sheet by default; Site sheet for plans and buildings; Swiss grid for AI, systems and taxonomies; see `visual-language.md` §2), cover to closing, plus the quote card, the reel cover and `diagram.svg` for the web. Look at every carousel before uploading: nothing cut, nothing overlapping. Upload each cluster's PNGs as desk assets (≤ 25 per call), and set each draft's `visuals` to `{ "<file name>": "/_blob/<asset id>" }`.
8. **Write back.** `batch` set the new `drafts/*`, `ledger/*` (with `cluster_id`, `status: drafted` for drafted items; `candidate` for the rest), `facts/*`, and update `engine/state` (`harvested_through`, `processed_meeting_ids`, `drive_processed_through`, `next_cluster_seq`, `last_run`, append to `waves`).
9. **Notices.** Rewrite `engine/notices.items`: what this wave added, P2 ideas waiting for Asaf (title plus one line each, no private details), any account or tool problem, and rules due for a re-check. The desk shows these at the top. To approve a P2 idea, Asaf comments on the desk or replies in chat; the next run drafts it.
10. **Rebuild the desk.** Export `drafts`, `facts`, `pilot`, `engine` with `list` + `out_dir` into one folder, run `python3 tools/content/desk/build.py <folder> <out.html>`, then publish that file to the desk URL (`Artifact` publish with `url`; omit `capabilities` so the rules stay).
11. **Drive copy.** In `02 Drafts`, create one Google Doc per new cluster (HTML upload, same layout as the wave-1 docs). In `01 Ledger`, create a Sheet with the new ledger rows (CSV upload). Name them `Wave <date> · …`.
12. **Analytics (Agent L).** For every `published/*` doc from the last 30 days: fetch metrics (Buffer `get_post` / `get_aggregated_post_metrics`; Metricool `getAnalyticsDataByMetrics`), store them on the doc, then recompute `state.weights.pillar` and `state.weights.format` as the ratio of each group's median engagement rate to the overall median, clamped to 0.8–1.25. Qualified comments and inbound leads count more than reach (strategy §14).
13. **Report.** End the session with a short summary: new meetings read, items, topics drafted, facts corrected, anything blocked.

## Run B — publish approved pieces (Tuesday and Friday mornings)

1. **Load** `engine/state` and `decisions`, `drafts`, `published` (to files).
2. **Select** decisions with `status: approved` and no `scheduled_for`, oldest `updatedAt` first. Also find decisions changed to `skip` after being scheduled: delete that Buffer post (`delete_post`) or Metricool post if it hasn't gone out, and clear `scheduled_for`.
3. **Slots.** Use `state.cadence` (Europe/Lisbon) to fill the next 7 days only: Buffer's free plan holds at most 10 scheduled posts, so check `list_posts` status `scheduled` first. At most one post per channel per day. When a topic has both LinkedIn and X approved, put X one day after LinkedIn.
4. **Media.** Public image URLs are needed. For each approved piece, copy its rendered images (re-render from the draft if needed) to the `content-media` branch under `media/<cluster id>/`, commit and push. Use `https://cdn.jsdelivr.net/gh/SufZen/realization.world@content-media/media/<cluster id>/<file>`. Only approved pieces ever go on this branch. If the push is refused, post LinkedIn and X text-only, hold Instagram and TikTok, and say so in `engine/notices`.
5. **Create posts.**
   - `linkedin` → Buffer channel `state.channels.buffer_linkedin`, `schedulingType: automatic`, `mode: customScheduled`, `dueAt` in the slot. Attach the carousel as a document when it exists (`tools/content/visuals/carousel-pdf.py`, title = topic, thumbnail = carousel-01), otherwise the quote card image with alt text. Put `linkedin.first_comment` in `metadata.linkedin.firstComment`.
   - `x` → Buffer channel `state.channels.buffer_x`, quote card image, thread items in `metadata.twitter.thread` when present.
   - `short` → until video exists, Metricool (`blogId` `state.channels.metricool_blog`): Instagram carousel post (all carousel PNGs, caption `short.captions.instagram`) and TikTok photo post (caption `short.captions.tiktok`). When a video URL is present on the draft (`short.video_url`, added after Asaf films or the avatar renders), post it as an Instagram Reel, TikTok video and YouTube Short instead. Set the AI-content flags whenever the video uses the avatar.
   - `web` → create branch `content/field-note-<slug>` from `main`, add the article to the `insights` array in `src/content/site.ts` (follow the line-break rule in the root README), run `npm run lint`, push, and open a pull request titled `Field note: <title>`. Merging it is Asaf's final gate.
   - `facebook` is skipped unless `state.cadence.facebook` has slots.
6. **Record.** Update each decision with `scheduled_for` and `post_ids` (keep all other fields) and write `published/<key>` with channel, post id, `dueAt` and media URLs. After the post time passes, the next run adds `published_url` when the platform returns it.

## Hard stops (strategy §17)

Stop, and write the reason in `engine/notices`, instead of publishing when:
- `BLOCKED_PRIVACY`: a draft contains a name, address, price or other private field from the ledger's `private_context`. Scan for these before every publish.
- `BLOCKED_EVIDENCE`: a factual claim has no confirmed or partly-confirmed `facts` entry.
- `BLOCKED_IDENTITY`: an avatar or voice render is inconsistent.
- `BLOCKED_ACCOUNT`: the target channel doesn't match the routing in `decisions.md`.

## Brief — extraction (for Run A step 3)

Mine for atomic knowledge objects Asaf or Realization actually expressed, decided, learned or experienced. One idea per item. Types: problem, decision, framework, misconception, lesson, mistake, question, disagreement, principle, observation, prediction, tradeoff. Output English. Keep private specifics only in `private_context` and `claims_to_verify`; `generalized_insight`, hooks and titles must be public-safe. Privacy: P0 public · P1 generalizable · P2 sensitive (needs Asaf) · P3 confidential (record, never draft). Reject anything generic. Capture 1–2 lines of Asaf's real phrasing per item (`voice_lines`). Fireflies speaker labels are unreliable in shared-room and Hebrew recordings; attribute by content.

Item fields: `id` (`W<run date>-<nn>`), `source_ids`, `source_dates`, `source_titles`, `pillar`, `subtopics`, `insight_type`, `working_title`, `private_context`, `generalized_insight`, `supporting_evidence`, `voice_lines`, `claims_to_verify`, `privacy_level`, `sensitive_fields_removed`, `brand_identity`, `target_audience`, `scores` (audience_value, expertise_signal, originality, strategic_fit, evidence_strength, visual_potential, timeliness, commercial_relevance: 1–5; privacy_risk, genericness: 0–5), `best_formats`, `hook_ideas`.
