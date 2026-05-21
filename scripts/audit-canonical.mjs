#!/usr/bin/env node
/**
 * Phase 18.1 — Fail if any HTML canonical/og:url uses www or http apex.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CANONICAL_ORIGIN } from './site-config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const BAD = [/https?:\/\/www\.roicalculator\.live/i, /http:\/\/roicalculator\.live/i];
const SKIP_DIRS = new Set(['node_modules', '.git']);

function walk(dir, out) {
  for (const name of fs.readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (name.endsWith('.html')) out.push(full);
  }
}

function main() {
  const files = [];
  walk(ROOT, files);
  const errors = [];
  const canonicalRe =
    /<link\s+rel="canonical"\s+href="([^"]+)"/i;
  const ogUrlRe = /<meta\s+property="og:url"\s+content="([^"]+)"/i;

  for (const file of files) {
    const rel = path.relative(ROOT, file);
    if (rel.startsWith('templates' + path.sep) || rel.startsWith('partials' + path.sep)) {
      continue;
    }
    const html = fs.readFileSync(file, 'utf8');
    const canon = html.match(canonicalRe);
    if (!canon) {
      errors.push(rel + ': missing <link rel="canonical">');
      continue;
    }
    const href = canon[1];
    if (!href.startsWith(CANONICAL_ORIGIN)) {
      errors.push(rel + ': canonical must start with ' + CANONICAL_ORIGIN + ' — got ' + href);
    }
    for (const re of BAD) {
      if (re.test(href)) errors.push(rel + ': bad canonical ' + href);
    }
    const og = html.match(ogUrlRe);
    if (og) {
      if (!og[1].startsWith(CANONICAL_ORIGIN)) {
        errors.push(rel + ': og:url must start with ' + CANONICAL_ORIGIN + ' — got ' + og[1]);
      }
      for (const re of BAD) {
        if (re.test(og[1])) errors.push(rel + ': bad og:url ' + og[1]);
      }
    }
    if (html.includes('www.roicalculator.live') && !rel.includes('_redirects')) {
      const inCanon = /www\.roicalculator\.live/.test(html);
      if (inCanon) errors.push(rel + ': contains www.roicalculator.live in page markup');
    }
  }

  if (errors.length) {
    console.error('audit-canonical: FAILED\n' + errors.join('\n'));
    process.exit(1);
  }
  console.log('audit-canonical: OK (' + files.length + ' HTML files, origin ' + CANONICAL_ORIGIN + ')');
}

main();
