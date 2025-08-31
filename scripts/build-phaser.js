#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the source files
const html = readFileSync(join(__dirname, '../index.html'), 'utf8');
const css = readFileSync(join(__dirname, '../styles.css'), 'utf8');
const js = readFileSync(join(__dirname, '../main.js'), 'utf8');

// Download Phaser from CDN and inline it
const phaserUrl = 'https://cdn.jsdelivr.net/npm/phaser@3.70.0/dist/phaser.min.js';
const phaser = await fetch(phaserUrl).then(r => r.text());

// Create the bundled HTML
const bundledHtml = html
  .replace('<link rel="stylesheet" href="styles.css" />', `<style>${css}</style>`)
  .replace('<script defer src="main.js"></script>', `<script>${phaser}\n\n${js}</script>`)
  .replace('<script src="https://cdn.jsdelivr.net/npm/phaser@3.70.0/dist/phaser.min.js"></script>', '');

// Write the bundled file
writeFileSync(join(__dirname, '../dist/golden-pharaoh-slot.html'), bundledHtml);

console.log('✅ Golden Pharaoh Slot Machine built successfully!');
console.log('📁 Output: dist/golden-pharaoh-slot.html');
console.log('🚀 Ready for MRAID deployment');
