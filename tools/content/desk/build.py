#!/usr/bin/env python3
"""Content engine — build the content desk page (the review page for Gate 1 and Gate 3).

    python3 tools/content/desk/build.py <data-dir> <out.html>

<data-dir> is a local export of the desk's database, made with ArtifactData `list` + `out_dir`
(see docs/content-engine/RUNBOOK.md):
  drafts/*.json         one public-safe draft per topic cluster (may carry `visuals`, `film`, `wave`)
  facts/*.json          verified claims (optional)
  pilot/desk.json       pilot episode in desk format (optional)
  engine/notices.json   {"items": [...]} banner notices (optional)

Only public-safe fields are embedded; private context never reaches the page.
"""
import glob, json, os, sys

KEEP = ["cluster_id", "topic", "pillar", "wave", "linkedin", "x", "short", "long_form_seed", "web_article"]


def load(path, default):
    return json.load(open(path)) if os.path.exists(path) else default


def main(data_dir, out):
    drafts, visuals, film = [], {}, {}
    for f in sorted(glob.glob(os.path.join(data_dir, "drafts", "*.json"))):
        d = json.load(open(f))
        if d.get("visuals"):
            visuals[d["cluster_id"]] = d["visuals"]
        if d.get("film"):
            film[d["cluster_id"]] = d["film"]
        drafts.append({k: d[k] for k in KEEP if d.get(k)})
    facts = [
        {
            "verdict": f["verdict"],
            "public_safe_statement": f.get("public_safe_statement", ""),
            "sources": [{"publisher": s.get("publisher") or s.get("title"), "url": s.get("url")} for s in f.get("sources", [])[:2]],
        }
        for f in (json.load(open(p)) for p in sorted(glob.glob(os.path.join(data_dir, "facts", "*.json"))))
        if f.get("verdict") != "internal"
    ]
    waves = sorted({d.get("wave", "") for d in drafts if d.get("wave")})
    data = {
        "date": waves[-1] if waves else "",
        "drafts": drafts,
        "facts": facts,
        "pilot": load(os.path.join(data_dir, "pilot", "desk.json"), None),
        "notices": load(os.path.join(data_dir, "engine", "notices.json"), {}).get("items", []),
        "visuals": visuals,
        "film": film,
    }
    blob = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")
    template = open(os.path.join(os.path.dirname(__file__), "template.html")).read()
    open(out, "w").write(template.replace("/*__DATA__*/", blob))
    print(f"{len(drafts)} drafts, {len(facts)} facts, pilot={'yes' if data['pilot'] else 'no'} → {out}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(*sys.argv[1:])
