## PRD: Tinder-style Swipeable Multi-Card MRAID Ad

### 1) Introduction / Overview
Create an interactive, MRAID 2.0-compliant mobile display ad that presents a Tinder-like swipe interface. Users swipe left/right through a stack of branded cards (each a distinct product/offer/creative variant) within a single ad unit. The unit aims to increase engagement through familiar gestures while still driving primary campaign outcomes (click-through to landing page) with strong secondary engagement metrics (swipe interactions and time-in-unit).

### 2) Goals
- **Primary KPI**: Click-through to advertiser landing page with CTR ≥ 1.5%.
- **Secondary KPIs**:
  - Swipe interaction rate ≥ 40% of impressions that reach interactive state.
  - Average time-in-unit ≥ 6 seconds.
  - Viewability (MRC) ≥ 70% of measured impressions (when tracked by the host SDK/ad server).
- **Performance/Weight**:
  - First interactive ≤ 1.5s on typical LTE conditions.
  - Initial load ≤ 2.5 MB; polite/deferred assets ≤ additional 1.5 MB.

### 3) User Stories
- As a mobile user, I can swipe left/right to browse multiple ad cards so I can quickly see different offers.
- As a mobile user, I can tap a clear CTA on any card to open the advertiser landing page in the in‑app browser.
- As a mobile user, I can close the ad at any time using a visible close control.
- As a mobile user, I can optionally expand the ad to full screen (when supported) to view the creative with more space.
- As a mobile user, after I reach the end of the deck, I see an end card that summarizes the offer or presents a final CTA.

### 4) Functional Requirements
1. MRAID Compliance
   1.1. The creative must be MRAID 2.0 compliant: handle `mraid.getState()`, `mraid.getPlacementType()`, and subscribe to `ready`, `error`, `stateChange`, `sizeChange`, and `viewableChange` events.
   1.2. Use `mraid.open(url)` for all click-throughs. Do not navigate with `window.open` when MRAID is present.
   1.3. Support states: `default`, `expanded`, `hidden`; provide a visible close control when `expanded`.
   1.4. Degrade gracefully when MRAID is not available (render a single tappable card that opens the landing page via `window.open` as fallback).

2. Card Deck & Gestures
   2.1. Display a stack of 3–6 cards (configurable) with top card interactive and off-axis cards visible with depth/shadow.
   2.2. Support swipe right/left with natural physics and 60fps animations using GPU-accelerated transforms.
   2.3. Define swipe threshold (e.g., horizontal drag > 25% of width or sufficient velocity) to complete a dismissal.
   2.4. On dismissal, animate the next card into position; allow a brief undo (optional, not required for MVP).
   2.5. Provide an end card after the final swipe with a prominent CTA.

3. CTAs and Interactions
   3.1. Each card defines a primary CTA (button area ≥ 44×44 dp) and destination URL.
   3.2. Optional secondary actions (e.g., learn more, gallery) are out-of-scope for MVP.
   3.3. A persistent brand/logo area is visible on all cards.

4. Layout & Responsiveness
   4.1. Default portrait layout optimized for 320×480 and 300×250 placements; adapt responsively to common mobile display sizes.
   4.2. When expanded, fill available screen size while respecting safe areas (e.g., notches). Consider `mraid.getMaxSize()` and `mraid.getCurrentPosition()`.
   4.3. Orientation lock to portrait for MVP. Landscape support optional v2.

5. Assets & Loading
   5.1. Card content defined via a JSON config (embedded for MVP) specifying image URL(s), headline, body, CTA text/URL, and tracking pixels.
   5.2. Prefetch top 2–3 card images up-front; lazy-load subsequent card assets after `viewableChange` indicates viewable.
   5.3. Use modern formats (WebP/AVIF) with PNG/JPEG fallback.

6. Tracking & Analytics
   6.1. Fire impression pixel(s) once when the ad becomes viewable (if MRAID reports viewable) or on first render if no viewability signal.
   6.2. Fire swipe-left and swipe-right events per card using image pixels or GET beacons with cachebuster macro.
   6.3. Fire click pixel(s) upon `mraid.open` invocation and per-card click events.
   6.4. Support common macro placeholders from ad servers (e.g., `{CLICK_URL}`, `{CACHEBUSTER}`) where applicable.

7. Controls & Compliance
   7.1. Visible close button at top-right with a hit area ≥ 44×44 dp.
   7.2. Respect platform-provided AdChoices/Privacy icon if injected by the host; reserve space top-right to avoid overlap.
   7.3. No auto-audio. Any video (if used in later versions) starts muted with user-initiated sound only.

8. Fallback Behavior (Non-MRAID)
   8.1. If `window.mraid` not present or not `ready` within a short timeout (e.g., 750ms), initialize basic interaction: render the first card, allow tap to navigate with `window.open`.
   8.2. Disable advanced gestures in fallback to reduce risk of incompatibilities.

### 5) Non-Goals (Out of Scope for MVP)
- No dynamic content feed from a remote CMS; JSON is embedded at build time.
- No user data capture (forms, emails, PII) inside the ad.
- No complex video playback or audio-on by default.
- No social sharing or save-to-favorites features.
- No real-time bid optimization or creative personalization.

### 6) Design Considerations
- Visual style evokes a familiar Tinder stack: elevated top card, partially peeking cards behind, subtle shadows.
- Clear hierarchy: brand/logo, headline, supporting copy, prominent CTA.
- Motion: smooth spring-like transitions on drag and release; avoid jank and reflow.
- Accessibility: color contrast ≥ 4.5:1 for text on backgrounds; interactive elements ≥ 44×44 dp; labels for CTA buttons.
- Reserve top-right space for close and privacy icon; ensure they remain tappable and unobscured.

### 7) Technical Considerations (Chosen Defaults)
- Stack: HTML5 + CSS + vanilla JS (no heavy frameworks). Use `requestAnimationFrame` and CSS transforms for animations.
- MRAID: Target MRAID 2.0; handle popular SDKs/webviews (Google IMA/Ad Manager, MoPub/Ironsource, Amazon, Meta Audience Network, AppLovin, Unity Ads) with graceful degradation.
- Performance: GPU-accelerated transforms (`translate3d`, `will-change`), passive event listeners, debounced tracking, avoid layout thrash.
- Packaging: Single HTML with inline CSS/JS where allowed; external assets minimized; initial payload ≤ 2.5 MB.
- Assets: Prefer vector/SVG for icons; compress images aggressively; preconnect/dns-prefetch disabled unless required by ad server policy.
- Tracking: Image beacon endpoints configurable per event (impression, swipe-left/right, click). Include cachebuster query param.
- QA Matrix (minimum): iOS 14–18 Safari webviews; Android 9–14 WebView/Chrome; test across 300×250, 320×480, 320×50 (letterbox), and full-screen expanded.

### 8) Success Metrics
- CTR ≥ 1.5%.
- Swipe interaction rate ≥ 40%.
- Average time-in-unit ≥ 6 seconds.
- Viewability ≥ 70% (where measurable).
- Error rate (runtime console errors) ≤ 0.5% of impressions.
- First interactive ≤ 1.5s on LTE median.

### 9) Open Questions
1. Final card count and exact content per card (assets, copy, CTA URLs)?
2. Which ad servers/SDKs will traffic this unit (to finalize macro syntax and file-size rules)?
3. Should we include an optional undo after swipe or a carousel indicator?
4. Any brand/legal copy that must persist across all cards?
5. Do we need an expanded mode requirement or keep default-only for MVP?
6. Any third-party verification/vendor tags (OMS DK/viewability, IAS/MOAT) to integrate via host?

---

Implementation notes (non-binding):
- Use a simple JSON config embedded in the HTML like:
  ```json
  {
    "cards": [
      { "image": "card1.webp", "headline": "Title 1", "body": "Copy 1", "ctaText": "Shop Now", "ctaUrl": "https://example.com/1" },
      { "image": "card2.webp", "headline": "Title 2", "body": "Copy 2", "ctaText": "Learn More", "ctaUrl": "https://example.com/2" }
    ],
    "tracking": {
      "impression": ["https://track.example.com/imp?cb={CACHEBUSTER}"],
      "swipeLeft": ["https://track.example.com/swipeL?cb={CACHEBUSTER}"],
      "swipeRight": ["https://track.example.com/swipeR?cb={CACHEBUSTER}"],
      "click": ["https://track.example.com/click?cb={CACHEBUSTER}"]
    }
  }
  ```
- Keep animations CSS-driven where possible and compute drag with pointer/touch events using passive listeners; update transforms only.
- Gate MRAID usage: wait for `mraid` `ready` or time out to fallback after ~750ms.


