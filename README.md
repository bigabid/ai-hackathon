# Playable Starter Kit

This repository is a lightweight starter kit for building **MRAID‑compliant
playable ads** using **Cursor**.  It provides a simple tap game, a
build process to inline assets into a single HTML file, and a
framework for choosing between **PixiJS**, **Phaser** or no engine.

## Features

- **Engine selection:** The default `index.html` lets you choose
  PixiJS, Phaser or no engine at runtime.  Each option sets up a
  minimal example (a moving sprite or animated text) to demonstrate
  how to integrate engines.
- **Rule categories:** Project rules in `.cursor/rules/` use
  categories (`Always apply`, `Apply intelligently`, `Apply to specific
  files`, `Apply manually`) to clarify how guidelines should be
  applied.  See `05-intake.mdc` for an intake flow that asks the user
  questions and generates a new game specification file.
- **Video processing:** A Node script (`scripts/process-video.js`)
  leverages `ffmpeg` to extract frames from a video.  Use this when
  the user provides a reference video so you can study the core loop
  and style.  Run with `npm run process:video -- --input <file>`.
- **Single‑file build:** The build script (`scripts/build-inline.js`)
  combines your HTML, CSS and JS into `dist/index.html`.  Upload
  this single file to an ad network.

## Getting started

```bash
npm install       # install dependencies if you add any
npm run preview   # start a local server at http://localhost:5173

# After editing index.html, styles.css or main.js
npm run build:inline
# dist/index.html now contains everything inline

# If you have a gameplay video
npm run process:video -- --input path/to/video.mp4 --output assets/frames
```

## How to create a new game spec

Open this project in **Cursor** and follow the intake flow defined in
`.cursor/rules/05-intake.mdc`:

1. **Engine:** Decide whether to use PixiJS or Phaser (or none).  The
   rule will guide you to the appropriate engine‑specific file.
2. **Video:** Provide a link or local path to a short video of the
   reference game.  Download it and run `npm run process:video` to
   extract key frames.
3. **Questions:** Answer the follow‑up questions about core loop,
   orientation, controls, session length, CTA and art style.
4. **Spec file:** Based on your answers, create
   `.cursor/rules/50-game-spec.mdc` with sections for summary,
   controls & flow, assets & budget, MRAID hooks and engine tasks.  See
   the template in `05-intake.mdc` for guidance.

After the spec is defined, you can implement the game under
`src/pixi/` or `src/phaser/` and modify `main.js` to wire it up.

## Dependencies

This starter kit uses only Node’s built‑in modules.  If you want to
develop with PixiJS or Phaser, include them via `<script>` tags in
`index.html` during development and bundle them into your single
file for production.  Ensure you do not fetch them from a CDN in the
final build.

## License

This starter kit is provided as‑is for educational and hackathon use.
Feel free to adapt it for your own projects.