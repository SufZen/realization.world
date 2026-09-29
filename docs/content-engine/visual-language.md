# Realization visual language

Decided 2026-09-29, replacing the earlier soft "Venation" direction, which read as wellness rather than development, investment and systems work. Every image the content engine produces (carousels, quote cards, reel covers, diagrams) follows this document. The renderer that implements it is `tools/content/visuals/`.

The language is built on the brand kit (`docs/design-system/`): marigold `#FDCC33`, black, white, Poppins 800 for display, sharp corners, and the butterfly mark used small or as a faint watermark, never recoloured. It has one default style and two specialist styles. They share the same colours, type and diagram grammar, and differ in attitude.

## 1. Who we design for, and what they should feel

A client arrives with something heavy: a property stuck between heirs, a building whose paperwork doesn't match what stands, capital that wants to land in Portugal, an architecture office that knows it should use AI and doesn't know where to start. They are deciding whether to trust someone with money, a building or a company. Our images must say, in the first second: this person operates, knows the numbers, and has done the work.

| Moment | What they should feel | What the visuals do |
|---|---|---|
| Recognition | "That's my situation." | The cover states the tension in very large type: the setup, then the turn. |
| Clarity | "Now I see how it works." | One diagram that shows the mechanism: a comparison, a sequence, a plan, a stack. |
| Trust | "They know the numbers and tell the truth." | Direct labels, real units, sources, "illustrative" when it is. Nothing decorative. |
| Invitation | "I can take a first step." | A closing slide on black: the one thing to keep, and one plain invitation. |

## 2. The three styles and when to use each

| Style | Reference | Signals | Use it for | Examples in wave 1 |
|---|---|---|---|---|
| **Term sheet** (default) | Business-magazine editorial: Bloomberg Businessweek under Richard Turley; FT and Economist charts | "I understand the money." Loud, confident, argued. | Money, markets, pricing, deals, decisions, opinions, the founder's view. Anything without a stronger reason to use another style. | Entry ticket, raising in risk stages, the builder as partner, the holiday let, the edge in the physical world |
| **Site sheet** | Construction drawing sets: frame, grid bubbles, title block with the mark and a sheet number; MVRDV and OMA diagram books | "I build and I measure." Precise, physical, on site. | Anything that can be drawn to scale or is about the building itself: plans, registered vs built, footprints, unit mixes, building systems, construction. | The apartment bigger than its building, the margin in metres, the portfolio you can't enter, building systems for year ten |
| **Swiss grid** | Josef Müller-Brockmann and the International Typographic Style | "There is a system behind this." Calm, ordered, rigorous. | AI, software and systems topics; processes, frameworks, checklists and taxonomies. | The tender agent, indexing the archive, build vs buy, the bureaucrat agent, the stuck-property types |

How the renderer chooses, unless a draft sets `carousel.style` (`"term"`, `"site"` or `"grid"`):
1. a `plan` diagram → Site sheet;
2. an AI or systems pillar, or a `cells` taxonomy → Swiss grid;
3. everything else → Term sheet.

Set `style` by hand when the topic says otherwise (a building-systems piece with a comparison diagram is still a Site sheet). The quote card and the reel cover are always Term sheet, so the feed stays recognisable.

Keep the mix honest: Term sheet should carry most of a wave. If more than a third of a wave lands in one specialist style, check the choices.

## 3. Colour

| Token | Hex | Use |
|---|---|---|
| Marigold | `#FDCC33` | Term-sheet covers, quote cards and reel covers; the answer in a diagram; one highlight per slide |
| Black | `#000000` | Type, lines, bars; closing slides; the slab that carries the turn of a hook |
| White | `#FFFFFF` | Beat and diagram slides |
| Grey | `#555555` | Notes, measurements, sources |

In diagrams: marigold marks the answer (the option we chose, the arrival, the bar the argument is about); a black diagonal hatch marks what is locked or blocked; white with a black outline is everything else. One marigold element per diagram where possible. No gradients, shadows or other colours.

## 4. Type

| Role | Face | Setting |
|---|---|---|
| Display: hooks, heads, rules | Poppins 800 | Sentence case, −0.035em tracking, line-height 1.02, as large as the slide allows |
| Body and notes | Poppins 400–600 | 38px body on beats, 22–30px in diagrams |
| Measurement: eyebrows, pagers, dimensions, sources | IBM Plex Mono 400–500 | Uppercase, +0.12em tracking |

On a 1080 × 1350 slide nothing goes below 19px; a carousel is read on a phone at about a third of its size. Hebrew: Open Sans, no letter-spacing.

## 5. Formats

| Format | Size | Structure |
|---|---|---|
| Carousel (Instagram, LinkedIn document) | 1080 × 1350 | Six slides: cover → beat → beat → diagram → beat → closing |
| Quote card (LinkedIn, X) | 1200 × 627 | Marigold, Asaf's line in Poppins 700, name line, faint mark |
| Reel / Story / Shorts cover | 1080 × 1920 | Marigold, the cover line very large, the voice line on a black slab |
| Web field note | site | Diagrams inline as SVG (`diagram.svg`) |

How each style sets the carousel:

| Slide | Term sheet | Site sheet | Swiss grid |
|---|---|---|---|
| Cover | Marigold; the setup in huge type, the turn on a black slab; faint butterfly watermark | White sheet in a frame; the turn highlighted in marigold; title block with mark and sheet number | Black; six visible columns; a marigold square with the mark; the hook set flush left |
| Beat | White; head, body, and the aside as a pull line on a marigold rule | Same, inside the frame, with the title block | White with column lines; a large slide number above the head |
| Diagram | White; claim as title; caption as a pull line | Framed sheet with title block | Column lines |
| Closing | Black; the rule very large; a marigold rule; one invitation | Black, framed, headed "General note" | Marigold with column lines |

## 6. Diagram grammar

Each carousel carries one diagram, written with the draft as data. The title states the claim; the caption says what to take from it. If a sentence says it faster, write the sentence instead.

| Type | Use it for | Spec (character limits are hard) |
|---|---|---|
| `compare` | Two options, before/after | `left{title ≤ 26, items[{label ≤ 22, note ≤ 32, state?}]}`, `right{…}` with the same number of items (2–3), `highlight` ≤ 2 of `"L0"…"R2"` |
| `flight` | A process, a timeline | `steps[{label ≤ 16, note ≤ 24, wait}]`, 3–5 steps; `wait` draws the segment dashed; the last step is the arrival |
| `cells` | A taxonomy | `items[{label ≤ 20, note ≤ 26, state}]`, 4–6 numbered tiles; at most one `realized` and one `locked` |
| `plan` | Anything spatial | `shapes[{label ≤ 14, note ≤ 30, x, y, w, h, state, dashed, blend, dim[], dimLabel ≤ 18, dimLabelV ≤ 12}]`; later shapes cover earlier ones (`blend: "multiply"` lets an overlap show). Dimension labels are words unless the number is cleared |
| `scale` | Magnitudes | `bars[{label ≤ 12, note ≤ 18, value, display ≤ 8, highlight}]`, 2–4 columns, `unit`, `illustrative`; illustrative values print no numbers |
| `stack` | Layers: a capital stack, risk stages | `layers[{label ≤ 20, note ≤ 30, share, state}]`, 2–4 layers, bottom → top; `share` is relative height, not data |

Common fields: `kicker` (≤ 28), `title` (≤ 55), `caption` (≤ 110), `source` (≤ 50, only for a public fact). States: `realized` = marigold (the answer), `locked` = hatched, `possible` or empty = white. The renderer crops every diagram to its drawing and scales it into the slide.

Each draft carries its carousel as data:

```json
"carousel": {
  "style": "optional: term | site | grid",
  "eyebrow": "Development feasibility",
  "hook": "cover headline, ≤ 60 characters; a setup and a turn works best",
  "voice": "one line under it, ≤ 90",
  "beats": [{ "head": "≤ 55", "body": "≤ 190", "voice": "optional aside, ≤ 80" }],
  "diagram": { "type": "compare", "kicker": "…", "title": "…", "caption": "…" },
  "rule": "the one thing to keep, ≤ 120",
  "invite": "one plain invitation, ≤ 90",
  "quote": "Asaf's line for the quote card, ≤ 140",
  "cover": "reel cover line, ≤ 36"
}
```

## 7. Never

- Soft, organic or "wellness" imagery: watercolour, pastel, lakes, leaves, flowing curves, glowing wings, serif italics as decoration.
- A complete or cartoon butterfly, a recoloured mark, or butterflies as illustration. The mark appears small or as a faint watermark only.
- Stock photos, clip-art icons, emoji, 3D renders presented as real projects.
- Gradients, drop shadows, rounded "app" cards, more than one highlight colour.
- A diagram without a claim, a chart without a unit, a number without a source or an `ILLUSTRATIVE` label; prices unless they are the point (see `voice.md`).
- Anything cut, touching or overlapping at the edge of a slide.
