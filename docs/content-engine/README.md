# Realization content engine

Implementation of `docs/strategy/realization-content-automation-strategy.html`.
It turns real work (meetings, documents, decisions) into public content for the Realization brand and for Asaf as founder.

> Core principle: automate the *production* of expertise, never the *creation* of it.

## Files

| Path | What it is | In git |
|---|---|---|
| `docs/strategy/realization-content-automation-strategy.html` | The source strategy (v1.0) | yes |
| `docs/content-engine/voice.md` | Voice, style, hooks and red lines | yes |
| `docs/content-engine/visual-language.md` | Venation: the client journey, the butterfly, colour, type, diagram grammar, formats | yes |
| `docs/content-engine/playbooks.md` | Script, storyboard, production-pack and channel-adaptation prompts | yes |
| `docs/content-engine/decisions.md` | Asaf's gate decisions; overrides older sources | yes |
| `docs/content-engine/RUNBOOK.md` | Step-by-step for the scheduled runs | yes |
| `tools/content/rank.mjs` | Merge + dedupe + score + editorial brief (Agents D, E) | yes |
| `tools/content/visuals/` | Venation renderer (carousel with diagram, quote card, reel cover, web diagram SVG) and carousel PDF; see `visual-language.md` | yes |
| `tools/content/desk/` | Content desk template and builder | yes |
| `content/private/` | Scratch space for a run (private context) | **no** (ignored) |
| Content desk (private claude.ai page) | Review and approvals; its database holds the ledger, drafts, decisions, facts and engine state | claude.ai only |
| Google Drive · `00- REALization/Realization Content Engine` | Human-readable copy of every run, plus `ASAF_DIGITAL_CHARACTER/` for the avatar dataset | Drive only |

Private context never enters this repository. Only public-safe outputs (for example new field notes in `src/content/site.ts`) are committed, and only after Gate 3.

## Automation

Two scheduled Claude Code routines run the loop; `RUNBOOK.md` is their instruction set.

| Routine | When (Lisbon) | Does |
|---|---|---|
| Weekly harvest and drafts | Monday morning | New meetings and Drive files → insights → fact checks → 4–8 new topics with drafts and visuals → desk rebuilt → Drive copy → analytics back into weights |
| Publish approved | Tuesday and Friday mornings | Approved pieces → Buffer (LinkedIn, X) and Metricool (Instagram, TikTok) on the cadence in `engine/state`; approved field notes → pull request |

Asaf's part: open the desk, approve / edit / skip, and merge field-note pull requests. Everything else runs on its own.

## Weekly loop

```text
1. Harvest   Fireflies meetings + recently modified Drive files        (Agent A)
2. Extract   atomic insights, Asaf's phrasing, claims to verify        (Agent B)
3. Privacy   P0–P3, generalized public-safe version, P3 blocked        (Agent C)
4. Rank      node tools/content/rank.mjs content/private/<week> ...    (Agents D, E)
5. Gate 1    Asaf approves / skips / edits the brief
6. Produce   script → storyboard → production pack (playbooks.md)      (Agents F, G, H)
7. Generate  Higgsfield scenes with Soul ID + voice                    (Agent I)
8. Adapt     native versions per channel                               (Agent J)
9. Gate 3    final review, then Buffer (founder) / Metricool (brand)   (Agent K)
10. Learn    analytics back into scores                                (Agent L)
```

## Account routing (current state)

Checked 2026-09-28 through the connected accounts:

| Tool | Connected channels | Strategy expects |
|---|---|---|
| Buffer (free plan: 3 channels, 10 scheduled posts) | LinkedIn *Suf Zen – Asaf Eyzenkot*, X *@Suf_Zen*, Facebook page *Suf Zen* | Founder channels ✔ |
| Metricool brand *Suf Zen* | YouTube, Instagram *@suf.zen*, TikTok *Suf Zen \| Asaf Eyzenkot*, Facebook | **Realization** brand channels ✘ |

**Decision 2026-09-28:** use the channels as they are. Suf Zen is the personal brand leading Realization, so the Metricool Suf Zen channels carry brand video until separate Realization accounts are justified. See `decisions.md`.

## Rollout status

| Phase | Status |
|---|---|
| 0 Account and identity setup | Done: Suf Zen channels carry the brand (Buffer: LinkedIn, X, Facebook · Metricool: YouTube, Instagram, TikTok) |
| 1 Content DNA | Done 2026-09-28: 287 meetings (Dec 2025 – Sep 2026) + Drive archive → 141 insights (18 P0, 98 P1, 23 P2, 2 P3 blocked), 16 documented frameworks, 98 fact checks |
| Wave 1 drafts | 19 topic clusters × LinkedIn, X, short video + storyboard, long-form seed; 4 web field notes (06–09). Awaiting Gate 1 in the content desk |
| 2 Digital character | Photoshoot planned the week of 2026-09-28; avatar work starts after. Until then: written content, brand-system visuals, and self-filmed video when a piece deserves it |
| 3 Pilot | Production pack written ("The Apartment Bigger Than Its Own Building", 8:36, 60 scenes); waiting on Gate 1 and Phase 2 |
| 4–5 Weekly loop, analytics | After the pilot |

## Lessons from the first run

- Run Agent F (verification) before writing, not after. The first run caught a wrong mortgage-guarantee cap and an outdated licence-of-use claim that several drafts relied on.
- Portuguese rules move fast: DL 108/2026 (planning, from 1 Oct 2026), the youth mortgage guarantee (ends 31 Dec 2026 unless extended) and the heir-sale decree (due ~Feb 2027) need a re-check before any piece that cites them goes out.
- Fireflies speaker labels are unreliable in shared-room and Hebrew recordings. Attribute quotes by content and confirm them with Asaf at Gate 1.
- Parallel agents must write only their own files and use uniquely named helper scripts.
