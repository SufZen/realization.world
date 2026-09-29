# Venation — Realization's visual language

Venation is the pattern of veins that holds a butterfly's wing together. It is also how Realization draws: precise lines that structure soft, living areas. Every image the content engine produces (carousels, quote cards, covers, diagrams, charts) follows this document. The renderer that implements it lives in `tools/content/visuals/`.

---

## 1. The client we design for

A person arrives at Realization carrying something heavy: a family property stuck between heirs, a building whose paperwork doesn't match what stands, capital that wants to land in Portugal without a local guide, an architecture office that knows it should use AI and doesn't know where to start. They have usually spent too many nights searching alone, in a language and a legal system that aren't theirs.

What they need from us, in order:

| Moment | What they feel when it goes right | What our content does | What our visuals do |
|---|---|---|---|
| **1. Recognition** | "Someone finally describes my situation." | Opens with a real moment or question from the field, never a definition. | Show the situation honestly: the locked cells (hatched), the gap, the paper that doesn't match. |
| **2. Clarity** | "Now I understand how this works." | Explains the mechanism, cause → effect → opportunity. | One diagram that makes the mechanism visible: a sequence, a comparison, a plan with real dimensions. |
| **3. Trust** | "They have done this, and they tell the truth." | Specifics: Portuguese terms, real numbers with sources, worst case first, limits stated. | Measured drawing: dimension lines, units, sources in mono type, "illustrative" when it is. |
| **4. Invitation** | "I can take a first step without risk." | Generosity: a checklist, a question to ask, an open door. Never a pitch. | The closing card: dark, calm, a rule to take away and one soft invitation. |
| **5. Transformation** | "I always know where we are." | Step-by-step process, milestones, regular reporting. | Progress drawn as cells lighting up, one by one. |
| **6. Realization** | "It's done, and it was done beautifully." | The story told with the client's permission; the lesson generalized. | The whole wing lit. |

The emotional line runs from **weight → clarity → calm → lightness**. Every visual decision below serves one of those six moments.

## 2. Why a butterfly, and how it stays serious

The butterfly is the Realization mark, and it is the most precise metaphor we have for the work.

- **Metamorphosis is engineering, not magic.** Inside the chrysalis the caterpillar dissolves, but clusters of cells called *imaginal discs* survive. They already hold the blueprint of the wings. Realization's work is the same: the future of a stuck property already exists inside it; we find the blueprint and create the conditions for it to form.
- **A wing is a floor plan drawn by nature.** Cells of colour held by a network of veins, finished with a margin that has its own rhythm. That is exactly how an architect draws a plan: rooms held by walls.
- **Symmetry is a decision tool.** Two wings on one body make the perfect comparison device: two options, one axis, the difference visible at a glance.
- **Migration is our geography.** Monarchs cross continents over generations: Israel → Portugal → Europe.

**How it stays serious:** we never draw a cute or complete cartoon butterfly. We draw it the way a naturalist draws a specimen or an architect draws a plan. It is always half a butterfly, anchored to the edge of the frame so that the edge becomes the body, and measured. Most of the time we don't draw the insect at all, only its grammar: veins, cells, margins.

## 3. Philosophy

**Soft structure.** Hard problems deserve a gentle hand. Every drawing is built like a technical plan (true geometry, hairline construction, real units) and finished like a living thing: lines taper as veins do, corners are never sharp, colour glows rather than sits. The softness is not decoration laid on top of the precision; it is how the precision is carried.

**Light, not paint.** Colour arrives the way light passes through a wing membrane: translucent, layered, warm. The brand's marigold is the only pigment we lay down. The deeper monarch orange is never chosen from a swatch; it appears where two layers of marigold overlap, the way a monarch's colour is built from overlapping scales. Where two things meet, the colour deepens. That is the whole colour system.

**Locked to realized.** Every piece tells the same quiet story. Hatched, grey cells are potential that is still locked; pale pollen cells are what is possible; marigold cells are what has been realized. A carousel starts with a few cells lit and ends, on its closing card, with the whole wing glowing. The reader doesn't need to know the code to feel the movement.

**The human voice in italic.** Structure speaks in a geometric sans; the person speaks in a soft serif italic. When Asaf's own sentence appears (a line from a meeting, the rule at the end), it is set in Fraunces italic at full softness. It should always feel like a hand-written note in the margin of a precise drawing.

**Craft is the message.** A client judges how we will handle their building by how we handle a single slide. Every image must look as if someone labored over it: spacing counted, labels aligned to a grid, nothing touching, nothing cut, nothing generic. If it could have come from any other account, it is not finished.

## 4. The elements

| Element | What it is | Rule |
|---|---|---|
| **Vein** (line) | Every connecting line | Tapers from thick at its origin to thin at its destination; the taper shows direction. No arrowheads; a small dot marks the end. Waiting periods are dotted. |
| **Cell** (area) | Every box, node, category | Soft quadrilateral: bowed sides, rounded corners. In comparisons, cells fan out from the axis like wing cells. |
| **Cell states** | The meaning of a fill | Hatch = locked · Pollen = possible · Marigold = realized · Monarch = where two things meet (emphasis) · Paper = empty. |
| **Margin** | Borders, rhythm, counting | A double hairline with dots between (light ground), or a dark band with light dots (dark ground). Page counters are margin dots. |
| **Wing** | The signature illustration | Generated per topic from its id, so every topic has its own wing and the same topic always gets the same one. Half a butterfly, anchored to the frame edge. |
| **Construction** | Measured-drawing marks | Compass arcs, dimension lines with 45° ticks, north arrow, dotted grid. Always quiet (≤ 25% opacity). |
| **Flight path** | Sequences over time | A soft rising curve, not a straight arrow. Nodes grow as the process advances; the arrival is a lit fan cell, a fragment of wing with its own veins and margin dots. |

## 5. Colour

| Token | Hex | Use | Share of a frame |
|---|---|---|---|
| Ink | `#1B1A17` | Veins, text, outlines | ~10% |
| Paper | `#FBF8F1` | Ground | ~55% |
| Pollen | `#FEF3CF` | Wing membrane, "possible" cells, soft fields | ~15% |
| Marigold | `#FDCC33` | Brand colour; "realized" cells, the single data hue | ~15% |
| Monarch | `#F4A019` | Only where marigold layers overlap; emphasis | ≤ 5% |
| Mist | `#D8D2C6` / hatch `#9E9788` | Locked, dormant | as needed |
| Night | `#151411` | Dark ground for closing cards and reel covers | full frame |
| Teal | `#19C2C2` | Rare: water, information, the machine side of a comparison | ≤ 2% |

Rules: marigold is for areas, never for text on paper (it fails contrast). Text is always ink (or warm white on Night). No gradients except the membrane glow (pale gold to pollen). No drop shadows. No pink; softness comes from light, curve and space, not from colour clichés.

## 6. Type

| Role | Face | Setting |
|---|---|---|
| Structure: headlines, labels | **Poppins** 700–800 | Sentence case, tight tracking (−0.02em), line-height 1.02 |
| Human voice: quotes, the rule, the one line spoken to the reader | **Fraunces** italic | Variable axes `SOFT 100`, `WONK 0`, `opsz 72`, weight ~380 |
| Measurement: eyebrows, dimensions, sources, counters | **IBM Plex Mono** 400–500 | Uppercase for eyebrows, +0.06em tracking, small |

Scale on a 1080 × 1350 slide: 84 cover headline · 72 beat headline · 52 diagram title · 40 voice · 36 body · 28 diagram label · 22 diagram note · 18–20 mono. A carousel is read on a phone at about a third of its size, so nothing goes below 18px. Never more than three sizes in one frame. Hebrew: Open Sans (as on the site); do not letter-space Hebrew.

## 7. Diagram grammar

Six types cover almost everything the content needs. Each is a spec the writer agents produce with the draft (`diagram` field) and the renderer draws.

| Type | Use it for | Spec (character limits are hard) |
|---|---|---|
| `compare` | Two options, before/after, architect vs market | `left{title ≤ 26, items[{label ≤ 22, note ≤ 32, state?}]}`, `right{…}` with the same number of items (2–3), `highlight` ≤ 2 of `"L0"…"R2"` |
| `flight` | A process, a timeline, a sequence of decisions | `steps[{label ≤ 16, note ≤ 24, wait}]`, 3–5 steps; `wait` draws the segment dotted; the last step is the arrival |
| `cells` | Categories, archetypes, a taxonomy | `items[{label ≤ 20, note ≤ 26, state}]`, 4–6 items drawn as numbered cells of a hindwing with a legend; at most one `realized` and one `locked` |
| `plan` | Anything spatial: registered vs built, footprints, unit mixes | `shapes[{label ≤ 14, note ≤ 30, x, y, w, h, state, dashed, blend, dim[], dimLabel ≤ 18, dimLabelV ≤ 12}]`; later shapes draw on top. `blend: "multiply"` (default) deepens overlaps; `"normal"` covers what's below, so the uncovered part shows the difference. Dimension labels are words unless the number is cleared |
| `scale` | A single comparison of magnitudes | `bars[{label ≤ 12, note ≤ 18, value, display ≤ 8, highlight}]`, 2–4 bars, `unit`, `illustrative`; illustrative values print no numbers |
| `stack` | Layers: capital stack, knowledge layers, risk stages | `layers[{label ≤ 20, note ≤ 30, share, state}]`, 2–4 layers, bottom → top; `share` is relative height, not data |

Common fields: `kicker` (≤ 28, the mono eyebrow), `title` (the claim, ≤ 55), `caption` (≤ 110, in the voice face), `source` (≤ 50, only for a public fact). The renderer crops every diagram to what it draws and centres it in the slide, so a spec never needs sizes.

Every diagram has a title that states the claim and a caption in the voice face that says what to take from it. Label the lines, not just the boxes. If a sentence explains it faster, write the sentence instead.

## 8. Charts

One hue (marigold) for data; monarch only for the one bar the argument is about. Rounded data ends anchored to a hairline baseline, direct labels in mono, text in ink, never in the data colour. Grid lines dotted and faint. Illustrative numbers are always labelled `ILLUSTRATIVE`; real numbers carry a source line. One axis per chart.

## 9. Formats

| Format | Size | Structure |
|---|---|---|
| Carousel (Instagram, LinkedIn document) | 1080 × 1350 | Six slides: **cover** (half wing, a few cells lit, headline, one voice line) → **beat** → **beat** (the corner wing fills cell by cell) → **diagram** → **beat** → **closing** on Night (whole wing lit, the rule in italic, one soft invitation) |
| Quote card (LinkedIn, X) | 1200 × 627 | Asaf's sentence in Fraunces italic, name line, wing at the right edge |
| Reel / Story / Shorts cover | 1080 × 1920 | Night ground, large wing, cover line, voice line |
| Web field note | site | Title and excerpt per the line-break rule; diagrams inline as SVG |
| Video (later) | 16:9 / 9:16 | Veins draw from the root, cells light one by one, margin dots count time. Slow ease, no bounce. |

Each draft carries its carousel as data, written with the text, so the renderer never has to guess:

```json
"carousel": {
  "eyebrow": "Development feasibility",
  "hook": "cover headline, ≤ 60 characters",
  "voice": "one human line under it, ≤ 90",
  "beats": [{ "head": "≤ 55", "body": "≤ 190", "voice": "optional, ≤ 80" }],
  "diagram": { "type": "compare", "kicker": "…", "title": "…", "caption": "…" },
  "rule": "the one thing to keep, ≤ 120, phrased as shared",
  "invite": "one soft line, ≤ 90",
  "quote": "Asaf's line for the quote card, ≤ 140",
  "cover": "reel cover line, ≤ 36"
}
```

## 10. Never

- A complete, cute or cartoon butterfly; butterflies flying around text; glitter, sparkles, pastel pink.
- Stock photos, clip-art icons, emoji as decoration, 3D renders presented as real projects.
- More than one monarch accent per frame; marigold text on paper; drop shadows; heavy gradients.
- Anything touching, overlapping or cut at the frame edge (except the wing, which is anchored to the edge on purpose).
- A diagram without a claim, a chart without a unit, a number without a source or an `ILLUSTRATIVE` label.
