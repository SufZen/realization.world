# Rules for Claude sessions in realization.world

This repo is the website only. Everything else Realization makes (brand, strategy, content engine, campaigns, avatar studio) lives in `SufZen/realization-studio`, normally cloned next to this one at `../realization-studio`. Heavy media lives on Google Drive. Don't add non-website material here.

Several Claude sessions work at the same time, sometimes in the same folder. The active-session board is `../realization-studio/SESSIONS.md`; full rules are in `../realization-studio/CLAUDE.md`. In short:

## Start of session

1. `git pull`, then read `SESSIONS.md` and add or update your row (task, branch, folder, paths you own, status).
2. Work on your own branch **in your own git worktree**. The main checkout belongs to whichever session `SESSIONS.md` names as its owner.
3. Edit only paths you own. Shared hotspots (`src/app/globals.css`, `src/app/sitemap.ts`, `src/lib/mail.ts`, `src/content/*`, `README.md`) are edited only by the session that owns them; otherwise ask Asaf.

## Never, in a folder another session may be using

- `git checkout` / `git switch`, `git stash`, `git reset`, `git clean`
- `git add -A`, `git add .`, `git commit -a`. Stage files by name.
- Force-push, rewrite history, or delete or move files you don't own

## Automated routines use this repo

Two scheduled cloud routines (the content engine, details in `../realization-studio/SESSIONS.md`) run from this repo. **If you are one of those routines:** follow your routine prompt and the RUNBOOK; the session-board and worktree steps above don't apply to you.

For everyone else:

- Never delete, rename, rebase or force-push `claude/funny-darwin-d3s6gf` (engine code), `content-media` (public image host for Buffer and Metricool) or `content/field-note-*` (field-note PRs). Breaking them breaks publishing.
- This repo is **public**. Never commit private context: client names, prices, addresses, meeting notes.
- Field-note PRs all edit `src/content/site.ts`; don't restructure that file without checking for open field-note PRs.

## Shipping

- `main` changes only through a pull request. Follow the merge order in `SESSIONS.md`.
- Before a PR: `npm run lint` and `npm run build` pass.
- End of session: commit by name, push, update your row in `SESSIONS.md`.
