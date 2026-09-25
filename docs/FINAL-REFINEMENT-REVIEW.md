# EZComo V6 final-candidate refinement

Date: 25 September 2026. Baseline: `8ff1acc45ef594d5275ea9c28ab973856377eeca`.

The existing V6 homepage is preserved. The isolated candidate is published under `/final-preview/`; the branch `refine/connected-story-final` holds the proposed root-page changes.

## What the runtime audit found

At the inspected 1363 × 936 desktop viewport, V6's Build stage was 936px tall before its narration, playback controls and outcome footer. The guided Build beat was only 1.4 seconds; the entire sequence was approximately 12 seconds. The tour highlighted the editor but did not demonstrate an edit. Manage was now actionable and the explicit demo state was a solid foundation worth preserving.

The candidate keeps the editor's eleven sections, original workflow graphics, actual order-detail interactions, sample pricing/cost assumptions, English/Bangla switching, theme switching, template examples and existing external destinations.

## Implemented changes

- One persistent command area groups chapter navigation, narration, playback and shared product/order context.
- An approximately 49.5-second desktop tour makes a real sample headline edit, preserves the edited storefront into the shopper view, and animates the receipt into its workspace order row.
- Previously entered merchant text is retained. Replay keeps edits; Reset all explicitly describes its effect.
- Delivery booking and later pickup remain distinct, labeled actions. Existing stock reservation remains idempotent.
- Guided and exploring states have accurate labels. Chapter selection interrupts playback; direct order and delivery interactions take control of the demo.
- Manual workflow segments can pause and resume. Reset cancels pending callbacks.
- Phone screens and reduced-motion preferences use Next step rather than an automatically advancing story.
- Readable operational text, stronger demo invitation, simpler scene headings, calmer surfaces, expanded mobile editor controls and visible mobile delivery actions.
- Hero/body/FAQ/pricing/supporting typography refined without inventing testimonials, changing prices or adding integration claims.
- Added an EZComo favicon and a clearly labeled storefront preview in place of an ambiguous live-store label.

## 20 UX principles translated into concrete review criteria

This is a practical checklist combining heuristics, perceptual principles and accessibility practices. It is not a scientific guarantee that exactly twenty rules make a homepage successful.

| # | Principle | Concrete application |
|---|---|---|
| 1 | Visible system status | Chapter, playback label, progress and order state are exposed |
| 2 | Match real work | Customer places an order; merchant books delivery; pickup is a later event |
| 3 | User control | Pause, resume, explore, replay and chapter selection |
| 4 | Consistency | Shared button, surface and status styling; preserved navigation conventions |
| 5 | Error prevention | Idempotent stock/order transitions and reset confirmation |
| 6 | Recognition | Product and order identity remain visible across scenes |
| 7 | Flexible use | Guided presentation plus full manual editor |
| 8 | Minimal presentation | Remove duplicated guided scene introductions and redundant checkout action |
| 9 | Recoverability | Replay retains edits; reset cancels pending work |
| 10 | Contextual help | Stationary narration describes the action occurring now |
| 11 | Hick's law | One clear next business action; secondary controls visually quieter |
| 12 | Fitts's law | Main actions have generous targets and predictable positions |
| 13 | Familiar conventions | Native buttons, inputs, focus and disclosure behavior |
| 14 | Gestalt proximity | Narration/control grouping; related order data grouped together |
| 15 | Visual continuity | Storefront and receipt handoffs connect the three acts |
| 16 | Selective emphasis | Warm demo invitation against the existing forest identity |
| 17 | Primacy/recency | Clear opening promise and connected-business outcome |
| 18 | Peak/end experience | Memorable order arrival, followed by a useful final workspace |
| 19 | Manage cognitive load | Slower desktop beats; visitor-paced phone and reduced-motion flow |
| 20 | Accessible aesthetic quality | Contrast, text size, focus visibility, reflow and motion preferences |

Reference foundations:
- https://www.nngroup.com/articles/ten-usability-heuristics/
- https://lawsofux.com/
- https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
- https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html

## Verification

DOM integration checks pass for guided edits, pause/resume, complete journey, replay without duplicate inventory deduction, preservation of merchant edits, manual chapter navigation, booking/pickup, reset cancellation, reduced motion, direct Manage links, language persistence and unique IDs.

Run from the repository root with `jsdom` and `@sinonjs/fake-timers` installed in an external QA directory:

```sh
NODE_PATH=/tmp/ezcomo-qa/node_modules node tests/journey.cjs
node --check app.js
```

These tests do not replace visual browser verification. Runtime findings and remaining limitations are recorded after the candidate review below.
