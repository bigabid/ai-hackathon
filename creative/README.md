# Tinder-style Swipeable MRAID Ad – Creative

This folder contains the creative files for the MRAID 2.0 ad unit.

## Files
- `index.html` – Ad markup and containers
- `styles.css` – Layout, animations, responsive rules, accessibility
- `main.js` – MRAID bootstrap, swipe deck logic, tracking
- `config.json` – Card content and tracking pixel endpoints
- `assets/` – Images and icons

## Macros
Tracking URLs may include macros such as `{CACHEBUSTER}` and vendor-specific placeholders (e.g. `{CLICK_URL}`).

- `{CACHEBUSTER}` – Replaced in-creative with a timestamp-based value.
- Unknown macros – left intact for the ad server/SDK to replace.

## Packaging & Trafficking
1. Ensure total initial payload ≤ 2.5 MB; place non-critical assets in `assets/`.
2. Zip the contents of `creative/` (keep relative paths):
   - Include: `index.html`, `styles.css`, `main.js`, `config.json`, `assets/`.
3. In the ad server, enable MRAID delivery and attach click-through URL if needed.

## QA Checklist
- Swipe interaction works at 60fps on target devices
- Impression fires once when viewable (or on first render if no viewability signal)
- Click beacons fire once per card; open uses `mraid.open`
- Swipe-left/right beacons fire once per card
- Close control visible and tappable; AdChoices area not overlapped
- Layout adapts for 300×250, 320×480, 320×50 (banner mode), and expanded


