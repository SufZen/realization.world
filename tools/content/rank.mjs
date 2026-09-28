#!/usr/bin/env node
// Content engine — Agents D + E: merge harvested insight files, dedupe by title,
// apply the editorial scoring model (strategy §7) and write a ranked ledger plus
// a weekly editorial brief.
//
// Usage: node tools/content/rank.mjs <out-dir> <insights.json> [more.json ...]
//
// Inputs may contain private context. Keep <out-dir> outside git (content/private/ is ignored).

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const POSITIVE = [
  "audience_value",
  "expertise_signal",
  "originality",
  "strategic_fit",
  "evidence_strength",
  "visual_potential",
  "timeliness",
  "commercial_relevance",
];
const PENALTIES = ["privacy_risk", "genericness"];

const MIN_SCORE = 26; // of 40; below this an item stays a candidate but is not briefed
const MAX_GENERICNESS = 3;
const MAX_BRIEF = 30;

const [outDir, ...inputs] = process.argv.slice(2);
if (!outDir || inputs.length === 0) {
  console.error("Usage: node tools/content/rank.mjs <out-dir> <insights.json> [...]");
  process.exit(1);
}

const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();

function score(s = {}) {
  const pos = POSITIVE.reduce((sum, k) => sum + (Number(s[k]) || 0), 0);
  const pen = PENALTIES.reduce((sum, k) => sum + (Number(s[k]) || 0), 0);
  return pos - pen;
}

function stateFor(item) {
  if (item.privacy_level === "P3") return "blocked_privacy";
  if ((item.scores?.genericness ?? 0) > MAX_GENERICNESS) return "archived";
  return "candidate";
}

const items = [];
const seen = new Map();
for (const file of inputs) {
  for (const item of JSON.parse(readFileSync(file, "utf8"))) {
    const key = normalize(item.working_title ?? item.id);
    if (seen.has(key)) {
      // Recurrence across sources strengthens the expertise signal (strategy §5.3).
      const kept = seen.get(key);
      kept.source_ids = [...new Set([...(kept.source_ids ?? []), ...(item.source_ids ?? [])])];
      kept.related_content_ids = [...(kept.related_content_ids ?? []), item.id];
      continue;
    }
    seen.set(key, item);
    items.push(item);
  }
}

for (const item of items) {
  const recurrence = (item.related_content_ids?.length ?? 0) > 0 ? 1 : 0;
  item.total_score = score(item.scores) + recurrence;
  item.status = stateFor(item);
  item.human_approval_required = item.privacy_level !== "P0" && item.privacy_level !== "P1";
  item.publishable = item.status === "candidate" && !item.human_approval_required;
}

items.sort((a, b) => b.total_score - a.total_score);

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "ledger.json"), JSON.stringify(items, null, 2));

const briefed = items
  .filter((i) => i.status === "candidate" && i.total_score >= MIN_SCORE)
  .slice(0, MAX_BRIEF);

const lines = [
  `# Editorial brief — ${new Date().toISOString().slice(0, 10)}`,
  "",
  `${items.length} insights harvested · ${briefed.length} briefed · ` +
    `${items.filter((i) => i.status === "blocked_privacy").length} blocked (P3) · ` +
    `${items.filter((i) => i.privacy_level === "P2").length} need Gate 2`,
  "",
  "| # | Score | Privacy | Identity | Pillar | Working title | Formats |",
  "|---|---|---|---|---|---|---|",
  ...briefed.map(
    (i, n) =>
      `| ${n + 1} | ${i.total_score} | ${i.privacy_level} | ${i.brand_identity} | ${i.pillar} | ${i.working_title} | ${(i.best_formats ?? []).join(", ")} |`,
  ),
  "",
  ...briefed.flatMap((i, n) => [
    `## ${n + 1}. ${i.working_title}`,
    "",
    i.generalized_insight,
    "",
    `Hooks: ${(i.hook_ideas ?? []).map((h) => `“${h}”`).join(" · ")}`,
    "",
  ]),
];
writeFileSync(join(outDir, "editorial-brief.md"), lines.join("\n"));

console.log(`ledger: ${items.length} items, brief: ${briefed.length} → ${outDir}`);
