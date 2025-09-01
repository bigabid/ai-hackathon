## Task List – Tinder-style Swipeable Multi-Card MRAID Ad

Follow this checklist to implement the PRD in `/tasks/prd-mraid-tinder-swipe-ad.md`.

### 0. Setup
- [x] Create feature folder and boilerplate files
  - [x] `creative/index.html`
  - [x] `creative/styles.css`
  - [x] `creative/main.js`
  - [x] `creative/assets/` (images, icons)
  - [x] `creative/config.json` (embedded at build for MVP)

### 1. MRAID Integration
- [x] Add robust MRAID bootstrap
  - [x] Detect `window.mraid`, wait for `ready`, set fallback timeout (~750ms)
  - [x] Subscribe to `stateChange`, `sizeChange`, `viewableChange`, `error`
  - [x] Implement `open`, `expand`, `close` wrappers
- [x] Handle states and placement types
  - [x] Respect `default`, `expanded`, `hidden` states
  - [x] Visible close in `expanded`
- [x] Graceful no‑MRAID fallback path enabled

### 2. Swipeable Card Deck
- [x] Implement deck with 3–6 cards (configurable)
  - [x] Render stack with depth, shadows, peek of next cards
  - [x] Top card drag with pointer/touch events (passive listeners)
  - [x] Physics/threshold (≥25% width or velocity) for left/right dismiss
  - [x] 60fps transforms (`translate3d`, `will-change`), `requestAnimationFrame`
  - [x] Animate next card into place after dismissal
  - [x] End card after final swipe

### 3. Content Config & Assets
- [x] Define embedded `config.json` schema (cards, copy, CTA, URLs, pixels)
- [ ] Implement loader/validator for config
- [x] Prefetch top 2–3 card images; lazy-load remaining upon viewable
- [ ] Use WebP/AVIF with PNG/JPEG fallback

### 4. CTAs & Navigation
- [x] Primary CTA per card (≥44×44 dp) wired to `mraid.open(url)`
- [x] Cachebuster and click tracking fired before `open`
- [x] Optional secondary action (defer to v2) – ensure out of scope for MVP

### 5. Tracking & Analytics
- [x] Impression beacon on first viewable (or first render if no signal)
- [x] Swipe-left and swipe-right events per card
- [x] Click events per card
- [x] Macro placeholders support (e.g., `{CLICK_URL}`, `{CACHEBUSTER}`)
- [x] Debounce and error-safe beacon sending

### 6. Layout & Responsiveness
- [x] Portrait-optimized layouts: 300×250, 320×480, 320×50 (letterbox), expanded
- [x] Respect `mraid.getMaxSize()` and safe areas (notch)
- [ ] Orientation lock to portrait (MVP)

### 7. Controls & Compliance
- [x] Always-visible close (top-right; ≥44×44 dp)
- [x] Reserve space for AdChoices/Privacy icon to avoid overlap
- [x] No auto-audio; future video starts muted, user-initiated sound only
- [x] Accessibility: contrast ≥ 4.5:1; focus states; aria labels for CTA/close

### 8. Fallback (Non‑MRAID)
- [ ] If no MRAID after timeout: render first card, disable gestures
- [ ] Tap anywhere opens landing page via `window.open`

### 9. Performance Budget
- [ ] Initial payload ≤ 2.5 MB; polite assets ≤ +1.5 MB
- [ ] First interactive ≤ 1.5s on LTE median
- [ ] Avoid layout thrash; audit with DevTools performance

### 10. QA & Validation
- [ ] Cross‑SDK sanity: GAM/Ad Manager, MoPub/Ironsource, AppLovin, Amazon
- [ ] iOS 14–18 Safari webviews; Android 9–14 WebView/Chrome
- [ ] Verify sizes: 300×250, 320×480, 320×50 (letterbox), expanded
- [ ] Validate beacons fire exactly once per event; verify macros replaced

### 11. Packaging & Delivery
- [ ] Single HTML bundle (inline CSS/JS where allowed) or zipped package
- [x] Update README with trafficking notes and macro support
- [ ] Generate final asset manifest and size report

### 12. Documentation
- [x] `README.md` with:
  - [x] Implementation overview and config schema
  - [x] Packaging/traffic instructions and size constraints
  - [x] QA checklist and troubleshooting

---

### Relevant Files (keep updated)
- `creative/index.html` – Ad markup, container elements
- `creative/styles.css` – Layout, animations, accessibility styles
- `creative/main.js` – MRAID integration, deck logic, tracking
- `creative/config.json` – Cards, URLs, tracking endpoints (embedded at build)
- `creative/assets/*` – Images/icons (WebP/AVIF with fallbacks)
- `README.md` – Trafficking & QA guide


