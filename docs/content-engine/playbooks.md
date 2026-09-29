# Agent playbooks

Prompts for the production agents in the strategy (§16). Each takes one approved ledger item and returns a structured artefact.
Read `voice.md` first. Agents A–E (harvest, extract, privacy, dedupe, rank) run in the weekly ingestion; see `README.md`.

---

## G — Script agent

**Input:** one ledger item with `status = approved`, `privacy_level` P0/P1 (or P2 with Gate 2 approval), the target `format`.

**Prompt**

> You are writing a spoken script for the Realization content engine. Follow `docs/content-engine/voice.md`.
> Source insight: `{generalized_insight}`. Supporting evidence: `{supporting_evidence}`. Asaf's own phrasing: `{voice_lines}`.
> Format: `{format}` (short = 30–75 s, one insight, one promise, one payoff; long = 5–15 min, 4–7 chapters).
> Identity: `{brand_identity}` ("we" for REALIZATION, "I" for ASAF).
> Produce: 5 hook options, the selected hook with a one-line reason, the full spoken script, a CTA that fits the platform,
> and a list of every factual claim that needs a public source.
> Do not invent experiences, numbers, projects or outcomes. Only use what the source insight supports.
> Do not name people, companies, addresses or prices from private context.

**Length guide:** ~150 spoken words per minute. A 60-second short is about 140–160 words.

---

## H — Storyboard / visual director

**Input:** the script.

**Prompt**

> Segment this script into scenes of 3–12 seconds. For each scene give:
> `scene_no`, `duration_s`, `owner` (avatar | diagram | b_roll | real_footage | text | screen),
> `spoken_line`, `visual_description`, `camera` (for avatar: framing + angle from the production bible),
> `on_screen_text` (max 6 words), `higgsfield_prompt` (for generated visuals), `asset_needed` (for real footage).
> Long-form: 30–40% avatar, 60–70% supporting visuals. Short: avatar can carry most of the runtime.
> Prefer plans, sections, maps, simplified charts, timelines, site footage and clean diagrams.
> Diagram and generated scenes follow `visual-language.md`: black, white and marigold, flat and sharp, bold Poppins labels, marigold for the answer and a black hatch for what is locked; the style follows the topic (Term sheet, Site sheet or Swiss grid). No soft or organic imagery, icons, stock people or 3D.
> Forbidden: skyscraper montages, luxury clichés, stock handshakes, fabricated project imagery presented as real.

---

## I — Production pack (hand-off to Higgsfield)

```text
production_pack = {
  title, audience, channel_identity, primary_goal,
  hook_options[], final_hook, spoken_script,
  sources[], privacy_level, claims_to_verify[],
  scene_list[], avatar_lines[], supporting_visuals[], diagrams[], b_roll[],
  thumbnail_concepts[], cta, derivative_outputs[]
}
```

Generate scenes independently, not whole videos. Record every Higgsfield job ID and its parameters back into the ledger.

---

## J — Channel adaptation

**Input:** the master script (or long-form episode) plus its ledger item.

**Prompt**

> Create native versions. Do not reuse the same caption on two platforms.
> - **Realization YouTube**: title (≤ 60 chars, searchable), description (first 2 lines carry the promise), chapters, 3 thumbnail texts (≤ 4 words).
> - **Realization Instagram Reel / TikTok**: 30–60 s cut plan, cover text, caption (≤ 125 chars before the fold), 3–5 specific hashtags.
> - **Asaf LinkedIn**: 150–250 words, first person, in his voice (`voice.md`): open with a question, a "keep reading" teaser, a real moment or a contrast, never with the lesson as a slogan; Empathy → Authority → Generosity; one soft closing, rotated across the wave (an honest question at most one post in three); link in first comment.
> - **Asaf X**: 1 standalone post (≤ 280 chars) + optional 3–5 post thread.
> - **Facebook**: only if the audience fit is clear; otherwise output `SKIP`.
> - **realization.world/insights**: field-note article in the site's structure (see `voice.md`).

---

## Gates (humans)

| Gate | When | Asaf decides |
|---|---|---|
| 1 Editorial | Weekly brief | Approve / skip / modify candidates |
| 2 Sensitive | Any P2 item | Approve the abstraction or kill it |
| 3 Publish | Before anything goes live | Title, thumbnail, video, caption, account |

Hard stops: `BLOCKED_PRIVACY`, `BLOCKED_EVIDENCE`, `BLOCKED_IDENTITY`, `BLOCKED_ACCOUNT`. When in doubt, stop before publishing.
