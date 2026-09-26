# Handoff — Live Lab at realization.world/livelab

The Realization Live Lab is published on this domain as a **separate app** at `/livelab`. Its source is `SufZen/Realization-Live-Lab` (branch `claude/jolly-volta-kjz57p`), a Next.js app built with `basePath: "/livelab"` and its own container, database and form. Traefik on the VPS routes `Host(realization.world) && PathPrefix(/livelab)` to that container, and every other path stays with this site.

This site's code doesn't route or rewrite `/livelab`, and it shouldn't.

Full VPS steps (DNS, image build, env, Traefik file, backups, verification, rollback) are in the Live Lab repo:
`docs/handoff/livelab.md` on branch `claude/jolly-volta-kjz57p`.

## Changes needed in this repo

Apply these on the active site branch:

1. **Link to the Lab.** Add a link to `/livelab` in the footer and/or on `/insights` or `/how-we-build`. Use a plain `<a href="/livelab">`, not `next/link`, because the Lab is a different app and client-side navigation would 404. The final wording and placement depend on the Lab's positioning, which is still open; `Live Lab` is fine as a placeholder.
2. **Sitemap.** In `src/app/robots.ts`, list both sitemaps:
   ```ts
   sitemap: [`${siteUrl}/sitemap.xml`, `${siteUrl}/livelab/sitemap.xml`],
   ```
   The Lab app ships no `robots.txt` of its own.
3. **Route collision check.** Don't create any `src/app/livelab` route or `public/livelab` folder in this app.

## One intake, two forms

The Live Lab form (`/livelab/submit`) is now the Live Lab edition of this site's opportunity brief. It uses the same four paths (`opportunity`, `operator`, `capital`, `corporate`), the same "rights, evidence or constraints" question and the same email subject shape (`Realization opportunity brief — <path> (Live Lab) — <name>`). Notifications go to `hello@realization.world`. If the path options in `src/components/opportunity-form.tsx` change, mirror them in the Lab repo (`pathOptions` in `src/content/site.ts` and `briefPaths` in `src/lib/submissions/schema.ts`).

## Strategy note

The brand strategy (`docs/strategy/realization-brand-strategy.html`) doesn't mention the Live Lab. Its role (Discover room, field-notes engine, or partner roundtable) is being decided in `docs/live-lab-strategy-alignment.md` in the Live Lab repo. Until then the Lab is presented as "A program of Realization" and links back to realization.world.
