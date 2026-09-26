# Connected story release — 26 September 2026

Target: `/final-preview/`. The repository root and `/v7/` are preserved. This is a release candidate; it has not been installed into the EZComo production application.

## Story and motion

The store belongs to Threads. The customer chooses one Studio Tee, Black / M. That choice becomes order #1051, then a merchant delivery action. Each chapter changes the viewer's role: you → your customer → you.

| Time | Visible action | What the merchant learns |
| --- | --- | --- |
| 0–3s | Store editor settles in the stage | Start from a branded storefront. |
| 3–7s | Headline selection becomes visible | The content is editable. |
| 7–11s | Headline changes in both canvas and inspector | Changes appear in the storefront immediately. User edits are preserved. |
| 11–15s | Editor controls retract; the same canvas becomes a customer preview | The work you edit is what the customer sees. |
| 15–19s | A store-link card appears over the storefront | Social discovery leads into your own store. |
| 19–24s | Black and M become selected; a compact product token moves toward the summary | The customer's choices stay attached. |
| 24–29s | Total, sample payment, confirmation, #1051 | Checkout produces a specific order. |
| 29–33s | Compact receipt token moves into the merchant order row | The customer and merchant are viewing the same transaction. |
| 33–38s | Order detail opens next to the row | Product, payment and address are ready to review. |
| 38–43s | Sample booking changes status to awaiting pickup | The next operational action is clear. |
| 43–47s | Explicit “Later that day” pickup update | A later courier event remains attached to the same order. |
| 47–52s | Connected result settles; playback stops | Storefront, order and delivery form one continuous workflow. |

No live payment or courier request occurs. Item 1,490 + illustrative delivery 60 = total 1,550. Pickup is not presented as delivery completion, revenue settlement or a stock change.

## Interaction and accessibility

- No unsolicited playback: Watch explicitly starts the journey.
- One timeline controls narrative state. Pausing retains elapsed progress. Animation instances pause with it.
- Scrolling the actual stage out of view or hiding the browser tab pauses the story. Return does not restart it automatically.
- Navbar withdraws only after explicit Watch. Escape, Back to page or leaving the stage restores it. There is no scroll lock.
- Phones, short windows and reduced-motion preference use Next/Back.
- Replay is available at the end. Hands-on mode retains the full editor, including section order, inline edits, colours and alignment.
- Guided surfaces are inert; user actions are offered through explicit Try mode.
- English/Bangla switching preserves the story and sample order.
- Desktop uses a bounded three-row stage. Short-height windows and narrow screens use document flow to avoid clipping or nested guided scrolling.

## Design

Neutral background #F7F7F7, white surfaces, charcoal #202020, secondary text #626262. Forest #1D4F3D is the main action colour. Demo frame #15231C, narration accent #D99A75, Watch accent #A9432E. Pricing and local-commerce text receive higher contrast. Footer is charcoal. Existing templates, signup destinations, plan identifiers and demo links are preserved.

## Files

- `story.js`: single-clock controller, deterministic sample state, language and visibility handling.
- `story.css`: stage, editor presentation, customer/merchant surfaces and responsive rules.
- `homepage.css`: page palette, hierarchy, spacing and component refinements.
- `app.js`: existing editor, gallery, signup, FAQ and navigation; previous competing workflow controllers removed.
- `tests/journey.cjs`: interaction regression checks.

Run `npm ci` followed by `npm test` inside `final-preview` with Node 24. GitHub Actions runs the same checks.

## Verification scope and release gate

Local syntax and DOM integration tests cover the 52-second story, pause/resume, replay, edit preservation, customer-to-merchant flow, sample delivery idempotency, chapter cancellation, visibility pause, keyboard Escape, reduced-motion/phone stepping, Bangla state retention, deep links, observer fallback and unique IDs.

Fresh browser visual QA remains outstanding because the browser session reached its usage limit. DOM tests do not verify geometry, actual paint, perceived animation quality, screen-reader output or mobile browser chrome. Before promoting to ezcomo.shop, inspect 360/390/430/768/1440 widths, 1280×720, 200% zoom, both languages, both themes and reduced motion. Verify live plan/pricing and integration availability against the production catalog. Do not label this release production-certified until these gates pass.

The responsive review helper is `/final-preview/responsive.html`.
