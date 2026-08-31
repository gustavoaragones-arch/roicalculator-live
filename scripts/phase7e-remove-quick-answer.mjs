#!/usr/bin/env node
/**
 * Phase 7E — remove redundant visible "Quick Answer" sections from static HTML.
 * Strips <section class="ai-answer-block"> blocks that only contain Quick Answer: prose.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const pattern =
  /\n?<section class="ai-answer-block">\s*<p><strong>Quick Answer:<\/strong>[^<]*<\/p>\s*<\/section>/g;

const targets = [];
function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git') continue;
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full);
    else if (name.endsWith('.html')) targets.push(full);
  }
}
walk(root);

let changed = 0;
for (const file of targets) {
  const rel = path.relative(root, file);
  if (rel.startsWith('templates/') || rel.startsWith('calculators/')) continue;
  const src = fs.readFileSync(file, 'utf8');
  if (!src.includes('Quick Answer:')) continue;
  const next = src.replace(pattern, '');
  if (next !== src) {
    fs.writeFileSync(file, next);
    console.log('stripped:', rel);
    changed++;
  } else {
    console.log('no match (manual review):', rel);
  }
}
console.log('files changed:', changed);
