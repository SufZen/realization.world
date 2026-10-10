# Services section: decision record

Date: 10 October 2026. Decided by Asaf Eyzenkot.
Source brief: `channels/website-services-brief.md` in `SufZen/realization-studio`.

## What changed

The site now has a Services section:

| Page | Title | Subtitle |
|---|---|---|
| `/services` | Places, systems and teams | Realization realizes potential in three dimensions: places, systems and teams. |
| `/services/real-estate` | Real estate development | From empty or underused to highest and best use. |
| `/services/ai-systems` | AI and operations systems | Less manual work in planning, building, selling and reporting. |
| `/services/delivery` | Delivery and team setup | We build the machine, train the team, and hand it over. |
| `/he/services/ai-systems` | The Systems page in Hebrew | |

- "Advisory" in the navigation became "Services".
- `/advisory` redirects permanently (301) to `/services/ai-systems`. The Advisory copy moved there unchanged, except that two mentions of the 30-minute intro now say 20 minutes, the intro offered on every Services page.
- Content lives in `src/content/services.ts` and `src/content/services-he.ts`.

## This overrides the brand strategy

`docs/strategy/realization-brand-strategy.html` says the main site needs no Services page, because a Services menu would pull the brand back toward a consultancy. That rule is superseded for realization.world.

Why:

- Paid ads, Facebook groups, LinkedIn and the webinar all send people to the site, and there was no clear place for them to land. "Advisory" covered only AI, and the real-estate work was spread across Work, Partners and Bring an opportunity.

What we keep from the strategy, so the site does not turn into a generic consultancy:

- **One idea, not three services.** The hub opens with the manifesto's three dimensions, which explain why one company does all three. Page titles stay in the buyer's words.
- **Every engagement ends with a handoff.** "Teams" is setup and handoff, not ongoing operations. The fractional role stays available, with limited availability, but is not the headline.
- **Partnership paths stay.** Partners and Bring an opportunity remain in the navigation and are linked from the hub and the real-estate page.

## Prices shown

- The two 60-minute sessions (Portugal Deal & Investment Consultation, AI Strategy Session): €150, credited toward the next stage.
- The Audit Sprint: €495 + VAT, bought online. It is the same offer as the 20.10 webinar's "joint audit" (אודיט משותף), with the same wording: a joint audit, a written report within 48 hours, a RealizeOS setup session, and the fee credited toward implementation.
  - The buy button on the English and Hebrew Systems pages links to a Stripe Payment Link, set in `auditSprintCheckout` (`src/content/services.ts`). Set it back to `null` and the button returns to "Ask for a proposal" (WhatsApp on the Hebrew page).
  - Stripe Tax adds VAT from the billing address. A buyer can enter a VAT number, and every purchase gets an invoice.
  - After paying, the buyer books a 90-minute kickoff on a hidden TidyCal type.
  - The AI Strategy Session credit and the webinar price are Stripe promotion codes, handed out privately.
- Everything else: "by proposal" for now.

## Measurement

Every call to action carries a Umami event, with `pillar` and `ref` as event properties:

| Event | Where |
|---|---|
| `book-intro` | 20-min intro, on every Services page |
| `book-session-real-estate`, `book-session-ai-systems`, `book-session-delivery` | The pillar's first session or qualifying intro |
| `buy-audit` | Audit Sprint checkout, on the English and Hebrew Systems pages |
| `join-webinar` | Webinar signup, until the 20.10 webinar ends |
| `deal-check` | The free deal check form |

A visitor who arrives with `?ref=` (an ad, a group post) keeps that ref on every booking and form link on the page, so a booking can be traced back to its source.

## Still open

1. TidyCal: the 60-minute meeting is €150 since 10.10, and both 60-minute sessions book it. Separate types per pillar, a dedicated delivery intro and new page copy are optional; change the URLs in `bookingTypes` (`src/content/services.ts`) if they are made.
2. ~~The Stripe Payment Link and the Audit Sprint price.~~ Done 10 Oct: €495 + VAT, Payment Link live.
3. The deal check's Sheet and Apps Script (`DEAL_CHECK_SHEET_*`), and which tool produces the numbers.
4. A weekly email list in Listmonk. After 20.10 the webinar offer gives way to the field notes on its own (the pages regenerate hourly).
5. Hebrew for the hub and the other two pillars (phase 2).
6. Which case studies may show numbers publicly.
