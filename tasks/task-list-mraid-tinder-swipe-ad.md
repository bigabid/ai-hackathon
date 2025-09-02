### Task List — MRAID Tinder-Style Swipe Interstitial Ad

Parent PRD: `tasks/prd-mraid-tinder-swipe-ad.md`

Follow the cadence: one sub-task at a time. After finishing a sub-task, mark `[x]`, update Relevant Files, then pause for approval before starting the next.

---

## 1) Scaffold creative project structure
- [x] Create directories: `creative/`, `creative/assets/`
- [x] Add `creative/index.html` (MRAID-safe boilerplate, portrait meta, minimal DOM root)
- [x] Add `creative/styles.css` (variables for theme, base layout, card styles)
- [x] Add `creative/main.js` (entry, feature flags, init)
- [x] Add `creative/manifest.json` (local packaged content reflecting PRD schema)
- [x] Add `creative/mraid-shim.js` (local preview: `open` → `window.open`, safe no-ops)

## 2) MRAID readiness and orientation
- [ ] Wait for `mraid.ready` or fallback if `window.mraid` absent
- [ ] `mraid.setOrientationProperties({ allowOrientationChange: false, forceOrientation: 'portrait' })`
- [ ] Use `mraid.getMaxSize()` / `getScreenSize()` to size creative
- [ ] Handle `viewableChange` and `stateChange` (pause/resume animations)

## 3) Card stack rendering and progress UI
- [ ] Parse `manifest.json` safely (validate required fields)
- [ ] Render N-card stack (image, headline, subcopy, CTA)
- [ ] Depth/parallax styling for underlying cards
- [ ] Progress indicator (dots or “x of y”)

## 4) Gestures and thresholds
- [ ] Implement touch/pointer handlers using GPU transforms
- [ ] Right-swipe threshold/velocity → clickthrough; advance stack
- [ ] Left-swipe threshold/velocity → dismiss; advance stack
- [ ] Tap CTA → same as right-swipe
- [ ] Snap-back animation for canceled swipes

## 5) Clickthrough and end-card
- [ ] `mraid.open(clickthroughUrl)` on positive intent or CTA
- [ ] End-card after last item with persistent CTA and close affordance
- [ ] Respect container close (no custom close unless required)

## 6) Performance and accessibility
- [ ] 60 FPS target: `requestAnimationFrame`, avoid layout thrash
- [ ] Use `will-change`, `transform`, and `opacity` transitions
- [ ] Minimum 44×44 px tap targets; high-contrast CTA
- [ ] Reduced motion preference fallback

## 7) Packaging and QA
- [ ] Ensure no external network calls (assets + manifest packaged)
- [ ] Validate weight budgets (JS/CSS/HTML) and total ZIP size
- [ ] Provide local preview instructions (no-MRAID mode)
- [ ] Prepare final ZIP with `creative/` content

## 8) Optional: local analytics counters (QA only)
- [ ] In-memory counters for impressions, swipes, clicks
- [ ] Toggle via feature flag; no beacons by default

## 9) Compliance checks
- [ ] Cross-network sanity check (MRAID 2.0 behaviors)
- [ ] Verify orientation lock and close behavior

## 10) Final polish
- [ ] Code cleanup, comments where non-obvious
- [ ] Light lint/format pass
- [ ] README snippet for traffickers

---

### Completion protocol (applies when all subtasks in a parent task are done)
1. Run tests if present (or run a smoke build/preview).
2. Stage changes: `git add .`
3. Clean up temporary code/files.
4. Commit using conventional format (single line command with multiple `-m` flags), e.g.:
   ```
   git commit -m "feat: scaffold MRAID Tinder interstitial creative" -m "- Adds index.html/styles.css/main.js/manifest.json" -m "- Includes MRAID readiness and portrait lock" -m "Related to PRD: prd-mraid-tinder-swipe-ad"
   ```

---

### Relevant Files (keep updated)
- [ ] `creative/index.html` — Interstitial HTML and base structure
- [ ] `creative/styles.css` — Theme variables and layout
- [ ] `creative/main.js` — Init, MRAID lifecycle, gestures, flow
- [x] `creative/manifest.json` — Packaged content config (updated with real game data)
- [ ] `creative/mraid-shim.js` — Local preview shim
- [ ] `tasks/prd-mraid-tinder-swipe-ad.md` — Source PRD
- [x] `tasks/task-list-mraid-tinder-swipe-ad.md` — This file
- [x] `creative/assets/clash_of_clans.jpg` — Game artwork
- [x] `creative/assets/genshin_impact.jpg` — Game artwork
- [x] `creative/assets/subway_surfers.jpg` — Game artwork


