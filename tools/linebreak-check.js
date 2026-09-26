// Line-break audit for realization.world pages (see README "Typography").
// Paste into the browser console (or run via DevTools automation) at 1440, 1024 and 390 px widths.
// Reports every multi-line text block and flags: orphans (last line of 1 word) and
// lines that end on a weak word (a, an, the, and, or, of, in, to, for, with, &) — i.e. a phrase split mid-way.
// Scope: weak-word breaks are checked on display text (headings, leads, eyebrows, and any block of <= 3 lines);
// long body paragraphs (4+ lines) only get the orphan check — breaking after 'and' is normal in running text.
(() => {
  const WEAK = /\b(a|an|the|and|or|of|in|on|to|for|with|by|at|&|·)$/i;
  const sel = 'h1,h2,h3,h4,.eyebrow,.role,.lede,dd,.pillars p,summary .name,.detail p,.intro,.note,.links strong,p';
  const seen = new Set(), out = [];
  for (const el of document.querySelectorAll(sel)) {
    if (!el.offsetParent || seen.has(el) || [...seen].some(s => s.contains(el))) continue;
    seen.add(el);
    const rows = {};
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = w.nextNode())) {
      for (let i = 0; i < n.length; i++) {
        const r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + 1);
        const rc = r.getClientRects()[0]; if (!rc || !rc.height) continue;
        const y = Math.round(rc.bottom / 4) * 4;
        rows[y] = (rows[y] || '') + n.data[i];
      }
    }
    const lines = Object.keys(rows).sort((a, b) => a - b).map(k => rows[k].replace(/\s+/g, ' ').trim()).filter(Boolean);
    if (lines.length < 2) continue;
    const issues = [];
    const last = lines[lines.length - 1];
    // Title + <small> subtitle rows and hand-authored .ln lines are broken by design; skip the orphan check there.
    if (!el.querySelector('small, .ln') && last.split(' ').length === 1) issues.push('orphan: "' + last + '"');
    const display = /^H[1-4]$/.test(el.tagName) || el.matches('.lede,.eyebrow,.role,.page-hero__intro,.section-heading__intro,.home-hero__lead,dd') || lines.length <= 3;
    if (display) lines.slice(0, -1).forEach(l => { if (WEAK.test(l)) issues.push('weak break after: "' + l.slice(-24) + '"'); });
    out.push({ el: (el.className || el.tagName).toString().slice(0, 20), lines, issues });
  }
  // Authored lines (.ln) must fit on one line from tablet width up; if they wrap, re-split the text.
  if (innerWidth >= 768) for (const ln of document.querySelectorAll('.ln')) {
    if (ln.offsetParent && ln.getClientRects().length === 1 && ln.getBoundingClientRect().height > parseFloat(getComputedStyle(ln).lineHeight) * 1.5)
      out.push({ el: 'ln', lines: [ln.textContent], issues: ['authored line wraps'] });
  }
  const problems = out.filter(o => o.issues.length);
  return { width: innerWidth, blocks: out.length, problems };
})();
