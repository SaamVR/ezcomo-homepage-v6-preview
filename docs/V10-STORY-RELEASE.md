# V10 — connected product story

## Scope and approved direction

Implements the approved desktop/mobile interface boards as the canonical EZComo homepage. The frozen implementation remains available at `/v10/`, and the repository root now serves the same V10 experience as the final homepage. V7 and previous final-preview remain available as rollback/reference snapshots. Original V6 navigation and hero markup are retained. Lower sections use the clarified release copy and receive spacing, type, footer-link and connection-status refinements.

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

Desktop: slim task rail + dark page-section navigator + scalable live storefront canvas + dark properties inspector on the right, following the supplied editor screenshot. Sell and Manage bring in the persistent right-hand guide. Mobile: full-width task forms; Preview opens separately; native merchant bottom navigation replaces the desktop sidebar. Mobile captions and a current-step guide avoid shrinking desktop panels into a phone.

The player uses viewport-relative height with an allowance for the existing navbar. Its content panels scroll internally where needed. Guided focus scrolls only those panels, never the page. Very short landscape screens use a taller readable section rather than scaling text down. When the demo reaches the top of the viewport, the navbar translates out of view and the player expands to the available height. Navbar layout space is retained to avoid page jumps. Scrolling beyond the section restores navigation; Escape and Show navigation restore it immediately. Hidden navigation is inert and removed from the accessibility tree until restored.

Autoplay starts only with at least 85% of the demo in view. Leaving the viewport, keyboard use, page hiding and layout-width changes pause the story. Mobile browser chrome height changes do not interrupt playback. Re-entering does not force a restart. A compact pause/resume control remains available. Reduced-motion mode is completely user paced and omits decorative transforms and type-on animation. Controls retain focus rings, pressed/current state and semantic labels. Demo product interface is marked English when the surrounding marketing page is switched to Bangla.

## State and interactions

`v10.js` is the authoritative owner of editor, checkout, order, courier and playback state. DOM visibility, button availability, progress, labels and guide content derive from that state. No backend is connected; all sample data lives in the tab. The same size, product and order identity continue across the customer and merchant views.

Supported manual interactions: selection and text editing across 11 page sections, section background and text alignment, canvas Overview/Detail, layout, promotion and theme selection, undo/redo, preview, save, sample publish, product details, size, cart, checkout, order creation, dashboard navigation, courier selection, booking and advancing illustrative delivery/settlement updates. Other dashboard areas are explicitly explanatory demo panels. The second catalog item directs users back to the sample product followed by this story.

Illustrative COD model: item ৳1,490 + delivery ৳60 = collected ৳1,550. Separate later remittance is ৳1,490 after a sample ৳60 courier fee. Remittance is not labelled profit or an immediately funded wallet. No real provider requests occur.

## Verification

`cd v10 && npm ci --ignore-scripts --no-audit --no-fund && npm test`

Integration checks cover the full guided sequence, pause/resume, replay, user edits, undo/redo, save versus publish, manual purchase, variant continuity, guarded courier booking, delivery versus settlement, chapter cancellation, reduced motion, mobile timing, offscreen pause, deep links, language/theme controls, unique IDs and local asset references.

The matching GitHub Actions workflow runs on changes to V10. Runtime dependencies: none. Test-only dependencies: jsdom and fake timers.

Rendered-browser QA is complete for the final homepage promotion. The live GitHub Pages build was checked in dark and light themes at 390/768/1440 with zero horizontal overflow and no browser/page errors in the tested states. The connected Build → Sell → Manage journey, reduced-motion behavior, Bangla mode, pricing contrast fixes, storefront-card contrast fixes, and persistent chapter navigation were also exercised in the deployed runtime. This repository now treats V10 as the canonical homepage preview; production `ezcomo.shop` is still unchanged.

## V10.1 visibility and focus refinement

Outer demo controls and supporting text now have explicit light/dark theme colors. Primary button uses white on forest green (7.94:1 contrast). Secondary action and surrounding copy follow scoped, high-contrast section tokens rather than inheriting the hero’s pale-on-dark button style.

Playback advances at 1.25× the original story clock, reducing total viewing time by 20% while retaining all 32 beats. Existing movement easing stays intact. New tests cover focused viewport height, navbar inert/ARIA state, Escape dismissal, explicit navigation restoration, leaving the section, and completion at the faster pace.

## V10.2 — reference editor and visible page structure

The supplied editor reference replaces the previous Build column arrangement. Desktop keeps the rail, section navigator, center canvas and right inspector visible throughout Build, including overview beats. The reference’s dark green navigator and inspector contrast with the ivory tool rail and storefront. Page structure covers Announcement, Header, Hero, Categories, Featured products, Collection promo, New arrivals, Brand story, Store benefits, Newsletter and Footer. Selecting a tree item or non-button canvas content selects the same section and loads its heading into the inspector. All 11 headings are editable.

Overview calculates a canvas-only scale using the available width and height; it does not shrink the editor controls or whole demo. A 30% lower bound retains a scrollable canvas on unusually small desktop areas. Detail uses a narrower logical storefront width for larger type and scrolls to the selected section. The scale percentage is visible, both modes are buttons, and the story automatically uses Detail for content/layout changes and Overview for whole-store results. Only the storefront is scaled; the editor controls retain native sizing.

Mobile uses its existing full-width forms with all sections in the selection field. Mobile previews and the Sell chapter remove desktop canvas scaling. No real subscription, publish or booking action is submitted. The existing navbar focus behavior and faster story clock remain unchanged.

Additional integration checks cover DOM column order, the 11-section navigator, generic section edits, selected-section styling, color reset, alignment, canvas width/height calculations, unscaled selling, and mobile editing/preview. Rendered-browser visual verification remains pending, as noted above.

## V10.3 — checkout, courier choice and screen magnet

Sell offers online payment (Stripe, PayPal, bKash, Nagad and City Bank) or COD, with local provider marks. The 36-beat film types a complete name, telephone and address, demonstrates online/bKash selection, then chooses COD to continue the collection-and-remittance story. Manual visitors can edit the fields and choose either payment route. Validation requires complete contact information and a provider for online payment. The same details appear in the merchant order. Automated tour details are illustrative, not verified customer records. Inputs stay in tab memory; no order or payment request is transmitted.

The courier picker includes FedEx, DHL, Pathao and Steadfast; the film opens it and selects Pathao. Arrow keys, Home/End and Escape support keyboard navigation. Brand sources are in `v10/brands/SOURCES.json`. Showing a provider does not create or verify an integration.

Manual online orders record payment at checkout, collect zero cash on delivery and never receive a second COD credit. COD retains the separate later remittance event. Build → Sell → Manage retain their design with explicit button boundaries, hover feedback and workflow connectors.

The screen magnet waits 160ms after scrolling settles, then aligns the player 12px from the top using 360ms eased scrolling (instant with reduced motion). Height is viewport minus 24px; hidden navigation is inert. The next wheel gesture, touch drag, page-navigation key, Escape or Show navigation releases focus. Native scroll events are never cancelled. Dismissal lasts until leaving the capture region. Viewports under 480px and open navigation do not auto-capture.

All 17 automated check groups pass, including form validation, five online providers, customer/payment continuity, courier keyboard selection, automatic Pathao selection, no duplicate COD credit, idle snapping, native wheel release, navigation restoration and finished tour copy. Desktop playback remains under 115 seconds. CSS parses without errors. Rendered-browser QA remains pending because browser access was blocked earlier in this session.


## Final homepage promotion — 2026-09-28

V10 is the approved final homepage design.

Canonical preview URL:

`https://saamvr.github.io/ezcomo-homepage-v6-preview/`

Frozen V10 snapshot:

`https://saamvr.github.io/ezcomo-homepage-v6-preview/v10/`

Promotion strategy:

- the root `index.html` now renders the finalized V10 homepage;
- V10 assets remain under `/v10/`, so the approved snapshot stays directly reviewable and rollback-friendly;
- the root homepage references the same tested `v10/app.js`, `v10/v10.js` and `v10/v10.css` assets;
- finished demo-store links are retained from the root;
- the previous root homepage remains recoverable through Git history;
- production/main and `ezcomo.shop` are not modified by this promotion.

Final contrast QA also includes the dark-mode pricing and storefront corrections: Free/Advanced plan names and prices use warm white on dark cards; Pricing supporting copy/fine print/link use readable dark tones on the beige surface; finished storefront headings use warm white on dark cards; and the FASHION/HOTEL/FOOD labels use the brighter clay accent. Light mode remains unchanged.
