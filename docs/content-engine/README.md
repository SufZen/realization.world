# Realization content engine

Implementation of `docs/strategy/realization-content-automation-strategy.html`.
It turns real work (meetings, documents, decisions) into public content for the Realization brand and for Asaf as founder.

> Core principle: automate the *production* of expertise, never the *creation* of it.

## Files

| Path | What it is | In git |
|---|---|---|
| `docs/strategy/realization-content-automation-strategy.html` | The source strategy (v1.0) | yes |
| `docs/content-engine/voice.md` | Voice, style, hooks and red lines | yes |
| `docs/content-engine/playbooks.md` | Script, storyboard, production-pack and channel-adaptation prompts | yes |
| `tools/content/rank.mjs` | Merge + dedupe + score + editorial brief (Agents D, E) | yes |
| `content/private/` | Harvested insights with private context, ledger, briefs | **no** (ignored) |
| Google Drive ledger | Master ledger and approvals (strategy §3) | Drive only |

Private context never enters this repository. Only public-safe outputs (for example new field notes in `src/content/site.ts`) are committed, and only after Gate 3.

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

The Metricool channels are founder-branded, not Realization-branded. Until Realization YouTube / Instagram / TikTok exist and are connected, brand-identity content is `BLOCKED_ACCOUNT` for video platforms (strategy rule 19). Options: create Realization brand accounts, or formally decide that Suf Zen video channels carry the brand layer for now.

## Rollout status

| Phase | Status |
|---|---|
| 0 Account and identity setup | Routing gap above |
| 1 Content DNA | First harvest run over all Fireflies history (Dec 2025 – Sep 2026) and the Drive archive |
| 2 Digital character | Not started — needs 30–50 photos and source videos in `/ASAF_DIGITAL_CHARACTER/` on Drive |
| 3 Pilot | Waiting on Gate 1 and Phase 2 |
| 4–5 Weekly loop, analytics | After the pilot |
