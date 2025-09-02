## PRD: MRAID Tinder-Style Swipe Interstitial Ad

### Introduction/Overview
Build a mobile interstitial ad creative that conforms to MRAID 2.0 and presents a Tinder-like swipe interface. Users swipe through a stack of ad cards; swiping right opens the advertiser’s landing page, swiping left dismisses and advances to the next card. The goal is to deliver a lightweight, engaging, and compliant creative that runs reliably across major in-app ad SDKs.

### Goals
- **Deliver MRAID-compliant interstitial**: Works in MRAID 2.0 containers, passes exchange QA.
- **Tinder-like UX**: Smooth card stack swipes at 60 FPS on mid-tier devices.
- **Lightweight footprint**: Fast initial render (<1s on average networks), minimal JS/CSS.
- **Clear conversion path**: Right-swipe or CTA tap opens landing page via `mraid.open`.
- **No external runtime dependencies**: All assets packaged; no remote config/fetch.

### User Stories
- As a mobile user, I can swipe left to skip an ad card and immediately see the next one.
- As a mobile user, I can swipe right (or tap the CTA) to learn more, opening the landing page.
- As a mobile user, I can see how many cards remain via a simple progress indicator.
- As a mobile user, I can close the interstitial at any time using the standard close control.

### Functional Requirements
1. **Initialization and MRAID readiness**
   - Wait for `mraid.getState() === 'default'` and `mraid.isViewable()` or `ready` event before rendering.
   - If `mraid` is not present (local preview), run in a safe fallback mode and use `window.open` for clickthrough.
2. **Orientation**
   - Lock to portrait using `mraid.setOrientationProperties({ allowOrientationChange: false, forceOrientation: 'portrait' })`.
3. **Layout and sizing**
   - Use `mraid.getMaxSize()`/`getScreenSize()` to size the creative to the full interstitial viewport.
4. **Card stack**
   - Render N cards (configurable) as a stack with the top card interactive.
   - Apply subtle depth/parallax to underlying cards.
5. **Gestures**
   - Swipe right: treat as positive intent; trigger `mraid.open(clickthroughUrl)` and advance to next card.
   - Swipe left: dismiss current card and advance to next card without opening.
   - Tap CTA button: same as swipe right.
   - Include swipe thresholds and velocity detection to avoid accidental triggers.
6. **End state**
   - After last card, show an end-card with a persistent CTA and option to close.
7. **Progress indicator**
   - Show remaining count or dots updated as cards advance.
8. **Close behavior**
   - Rely on container’s default close. Do not enable `useCustomClose` unless the network requires it.
9. **Assets**
   - All images and JSON manifest are packaged with the creative; no remote fetches.
   - Support responsive image sizing and cover-fit without layout jank.
10. **Performance**
    - Use GPU-accelerated transforms (translate/rotate/scale) and `requestAnimationFrame` for animation.
    - Avoid forced reflows; minimize layout thrashing.
11. **Accessibility/Usability**
    - Minimum 44×44 px tap targets. High-contrast CTA. Respect reduced motion if detectable.
12. **Config-driven content**
    - Load a local JSON manifest describing cards, assets, and clickthrough URLs.
13. **Basic analytics (local only)**
    - Count impressions, swipes, and clicks in-memory for QA preview. No network pings by default.
14. **Error handling**
    - If an asset fails to load, skip that card gracefully and proceed.

### Non-Goals (Out of Scope)
- Remote data fetching or third-party analytics beacons.
- Video playback or inline media beyond static images.
- Custom close buttons unless explicitly required by the ad network.
- Rewind/undo for previous cards.

### Design Considerations
- **Visual style**: Clean, high-contrast card layout with image-first design, concise headline, subcopy, and a single primary CTA.
- **Motion**: Natural swipe with slight rotation; snappy settle/exit animations <250ms.
- **Brand flexibility**: Colors and type can be themed via CSS variables.
- **Progress UI**: Dot indicators or numeric “x of y”.

### Technical Considerations
- **Technology stack**: Vanilla HTML/CSS/JS; MRAID 2.0 API; no framework. Optionally include a tiny gesture helper (only if needed and approved by network weight limits). Prefer custom lightweight gesture handling.
- **Packaging**: Single zip with `index.html`, `styles.css`, `main.js`, `manifest.json`, and assets under `assets/`.
- **MRAID integration**:
  - Use `mraid.addEventListener('ready'|'viewableChange'|'stateChange', ...)` to coordinate rendering and lifecycle.
  - Enforce portrait orientation via `setOrientationProperties`.
  - Use `mraid.open(url)` for clickthroughs.
- **Fallback shim**: Provide a minimal `mraid` shim for local testing (no-ops except `open` → `window.open`).
- **Performance budgets**:
  - JS ≤ 40 KB gzip, CSS ≤ 15 KB gzip, HTML ≤ 10 KB gzip (targets, not hard caps).
  - Total creative (excluding images) ≤ 100 KB gzip. Total zip ideally ≤ 2.5 MB including images.

### JSON Manifest Schema (packaged)
The creative reads a local `manifest.json` at load time.

```json
{
  "version": 1,
  "cards": [
    {
      "id": "card-1",
      "headline": "Discover Product X",
      "subcopy": "Fast. Simple. Secure.",
      "image": "assets/card1.jpg",
      "ctaText": "Learn more",
      "clickthroughUrl": "https://example.com/x"
    }
  ],
  "theme": {
    "primaryColor": "#0055FF",
    "ctaTextColor": "#FFFFFF",
    "backgroundColor": "#000000"
  }
}
```

### Success Metrics
- CTR from right-swipe or CTA tap ≥ baseline interstitial CTR for the placement.
- Completion rate: ≥ 60% of users swipe at least two cards (tunable by card count).
- Average time-to-first-render < 1s on mid-tier devices.

### Open Questions
- How many cards should be included by default (e.g., 3–5)?
- Any strict asset size/dimensions (e.g., 1080×1920 JPEGs, ≤ 300 KB each)?
- Are specific brand fonts required, or use system fonts only?
- Any networks requiring `useCustomClose(true)`?
- Should we allow optional remote tracking if permitted by the exchange (feature flag)?

### Assumptions (Chosen Defaults)
- Stack: Vanilla HTML/CSS/JS, MRAID 2.0, no framework.
- Placement: Interstitial, portrait-locked.
- Content source: Local packaged JSON manifest and assets only.


