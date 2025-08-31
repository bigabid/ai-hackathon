import fs from 'node:fs';
import path from 'node:path';

// Build script to inline CSS and JS into index.html.  Outputs to
// dist/index.html.  This yields a single file suitable for upload to
// ad networks.

const root = process.cwd();
const srcHtml = path.join(root, 'index.html');
const srcCss = path.join(root, 'styles.css');
const srcJs = path.join(root, 'main.js');
const distDir = path.join(root, 'dist');
const outHtml = path.join(distDir, 'index.html');

fs.mkdirSync(distDir, { recursive: true });

const html = fs.readFileSync(srcHtml, 'utf8');
const css = fs.readFileSync(srcCss, 'utf8');
const js = fs.readFileSync(srcJs, 'utf8');

// Replace the link and script tags with inline content
const inlined = html
  .replace(/<link rel="stylesheet"[^>]*>/, `<style>${css}</style>`) // inline CSS
  .replace(/<script defer src="main\.js"><\/script>/, `<script>${js}</script>`); // inline JS

fs.writeFileSync(outHtml, inlined, 'utf8');
console.log('Built', path.relative(root, outHtml));