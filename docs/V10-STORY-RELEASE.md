# V10 — connected product story

## Scope and approved direction

Implements the approved desktop/mobile interface boards as one demonstration at `/v10/`. The root homepage, V7 and previous final-preview remain intact. Original V6 navigation and hero markup are retained. Lower sections use the clarified release copy and receive spacing, type, footer-link and connection-status refinements.

Audience: Bangladesh merchants, with phone users a first-class surface. Core message: familiar editor controls lead to a storefront, the storefront creates an order, and the same order reaches a merchant workspace and fulfilment flow.

Visual language: warm off-white demo surfaces, graphite text, forest green actions, sage guide surfaces and restrained terracotta chapter markers. Flat vector product illustrations and stroke icons. The overall page retains its existing theme control.

## Motion direction

The story is a 32-beat, approximately 102-second desktop / 114-second mobile sequence. Build gets about half the screen time. Chapter shortcuts and previous/next controls allow skipping. One requestAnimationFrame clock owns all sequencing and type-on progress. No nested setTimeout choreography, scroll lock, external animation dependency, payment call or booking request.

| Passage | Action and meaningful result | Motion principle |
| --- | --- | --- |
| Page | Headline and support copy type into the form and immediately update the store | Anticipation → action → readable result |
| Sections | Centered and editorial hero options reorganize existing content | Spatial continuity; FLIP translation |
| Promotion | Feature changes into a statement banner | Preserve the message while changing presentation |
| Style | Sage and Clay recolor buttons, background and promotional elements | Coordinated secondary action |
| Publish | Draft and published sample states stay distinct | Explicit state feedback |
| Product | Studio Tee opens its detail page | Matched product illustration transition |
| Sell | Product choice and size lead to checkout; order #1051 appears in the guide | One focal action; guide enters after context |
| Manage | Merchant workspace takes over while the guide persists | Continuity across roles |
| Courier | Select courier, book, then see pickup, transit and delivery | Staged causality; later events labelled |
| Settlement | Separate later remittance card appears | Restrained overshoot as a completion reward |

Control anticipation is about 650–850ms. Most interface responses settle over 550–850ms with cubic-bezier(.22,1,.36,1). Each beat then holds so the result can be understood. Motion is in service of product explanation; no continuous decorative bouncing or confetti.

## Responsive and accessibility behavior

Desktop: narrow task rail + edit panel + live storefront. Sell and Manage bring in the persistent right-hand guide. Mobile: full-width task forms; Preview opens separately; native merchant bottom navigation replaces the desktop sidebar. Mobile captions and a current-step guide avoid shrinking desktop panels into a phone.

The player uses viewport-relative height with an allowance for the existing navbar. Its content panels scroll internally where needed. Guided focus scrolls only those panels, never the page. Very short landscape screens use a taller readable section rather than scaling text down. When the demo reaches the top of the viewport, the navbar translates out of view and the player expands to the available height. Navbar layout space is retained to avoid page jumps. Scrolling beyond the section restores navigation; Escape and Show navigation restore it immediately. Hidden navigation is inert and removed from the accessibility tree until restored.

Autoplay starts only with at least 85% of the demo in view. Leaving the viewport, keyboard use, page hiding and layout-width changes pause the story. Mobile browser chrome height changes do not interrupt playback. Re-entering does not force a restart. A compact pause/resume control remains available. Reduced-motion mode is completely user paced and omits decorative transforms and type-on animation. Controls retain focus rings, pressed/current state and semantic labels. Demo product interface is marked English when the surrounding marketing page is switched to Bangla.

## State and interactions

`v10.js` is the authoritative owner of editor, checkout, order, courier and playback state. DOM visibility, button availability, progress, labels and guide content derive from that state. No backend is connected; all sample data lives in the tab. The same size, product and order identity continue across the customer and merchant views.

Supported manual interactions: text edits, layout, promotion and theme selection, undo/redo, preview, save, sample publish, product details, size, cart, checkout, order creation, dashboard navigation, courier selection, booking and advancing illustrative delivery/settlement updates. Other dashboard areas are explicitly explanatory demo panels. The second catalog item directs users back to the sample product followed by this story.

Illustrative COD model: item ৳1,490 + delivery ৳60 = collected ৳1,550. Separate later remittance is ৳1,490 after a sample ৳60 courier fee. Remittance is not labelled profit or an immediately funded wallet. No real provider requests occur.

## Verification

`cd v10 && npm ci --ignore-scripts --no-audit --no-fund && npm test`

Integration checks cover the full guided sequence, pause/resume, replay, user edits, undo/redo, save versus publish, manual purchase, variant continuity, guarded courier booking, delivery versus settlement, chapter cancellation, reduced motion, mobile timing, offscreen pause, deep links, language/theme controls, unique IDs and local asset references.

The matching GitHub Actions workflow runs on changes to V10. Runtime dependencies: none. Test-only dependencies: jsdom and fake timers.

Rendered-browser QA remains outstanding: the session's earlier browser access was blocked, so DOM tests are not being presented as visual verification. Before production promotion, inspect 360/390/430/768/1440 widths, short laptop height, keyboard focus and a complete film on an actual phone. V10 is published as a reviewable preview, not a replacement of ezcomo.shop.

## V10.1 visibility and focus refinement

Outer demo controls and supporting text now have explicit light/dark theme colors. Primary button uses white on forest green (7.94:1 contrast). Secondary action and surrounding copy follow scoped, high-contrast section tokens rather than inheriting the hero’s pale-on-dark button style.

Playback advances at 1.25× the original story clock, reducing total viewing time by 20% while retaining all 32 beats. Existing movement easing stays intact. New tests cover focused viewport height, navbar inert/ARIA state, Escape dismissal, explicit navigation restoration, leaving the section, and completion at the faster pace.
