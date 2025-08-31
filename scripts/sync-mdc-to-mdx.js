#!/usr/bin/env node
/**
 * Sync `.mdc` (Cursor rules) -> Storybook `.mdx` docs.
 * Usage:
 *   node scripts/sync-mdc-to-mdx.js .cursor/rules/learned-memories.mdc storybook/learned-memories
 */
const fs = require('fs');
const path = require('path');

const [,, sourceMdc, outDir] = process.argv;
if (!sourceMdc || !outDir) {
  console.error('Usage: node scripts/sync-mdc-to-mdx.js <source.mdc> <outDir>');
  process.exit(1);
}

const raw = fs.readFileSync(sourceMdc, 'utf8');
fs.mkdirSync(outDir, { recursive: true });

// Simple section splitter by H2 headings (## ).
// Maps known sections to filenames. Unknown H2s fall back to kebab-case.
const mapFilename = (title) => {
  const t = title.toLowerCase().trim();
  const table = {
    'user preferences': 'preferences.mdx',
    'technical decisions': 'technical-decisions.mdx',
    'project conventions': 'conventions.mdx',
    'components & apis': 'components.mdx',
    'data contracts': 'data-contracts.mdx',
    'environments & secrets': 'environments.mdx',
    'workflows': 'workflows.mdx',
    'testing & qa': 'testing.mdx',
    'glossary': 'glossary.mdx',
    'decisions changelog': 'changelog.mdx',
  };
  return table[t] || `${t.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}.mdx`;
};

// Extract title (H1) and split into sections (H2)
const lines = raw.split(/\r?\n/);
let projectTitle = 'Project Memory & Dev Handbook';
if (lines[0].startsWith('# ')) {
  projectTitle = lines[0].replace(/^#\s+/, '').trim();
}

// Find H2 indices
const h2Indices = [];
lines.forEach((ln, idx) => {
  if (/^##\s+/.test(ln)) h2Indices.push(idx);
});

// If no H2, write everything to index.mdx
if (h2Indices.length === 0) {
  const mdx = `import { Meta } from '@storybook/addon-docs';\n\n<Meta title="Knowledge/Index" />\n\n# ${projectTitle}\n\n` + raw;
  fs.writeFileSync(path.join(outDir, 'index.mdx'), mdx, 'utf8');
  console.log('Wrote index.mdx');
  process.exit(0);
}

// Build index from first chunk up to first H2
const firstH2 = h2Indices[0];
const intro = lines.slice(0, firstH2).join('\n');
const indexMdx = `import { Meta } from '@storybook/addon-docs';\n\n<Meta title="Knowledge/Index" />\n\n# ${projectTitle}\n\n${intro}\n`;
fs.writeFileSync(path.join(outDir, 'index.mdx'), indexMdx, 'utf8');
console.log('Wrote index.mdx');

// Emit each H2 section as its own MDX page
for (let i = 0; i < h2Indices.length; i++) {
  const start = h2Indices[i];
  const end = (i + 1 < h2Indices.length) ? h2Indices[i + 1] : lines.length;
  const sectionLines = lines.slice(start, end);
  const h2Title = sectionLines[0].replace(/^##\s+/, '').trim();
  const filename = mapFilename(h2Title);
  const body = sectionLines.slice(1).join('\n');
  const mdx = `import { Meta } from '@storybook/addon-docs';\n\n<Meta title={"Knowledge/${h2Title}"} />\n\n# ${h2Title}\n\n${body}\n`;
  fs.writeFileSync(path.join(outDir, filename), mdx, 'utf8');
  console.log(`Wrote ${filename}`);
}
