#!/usr/bin/env node
/**
 * Phase 7C — apply secondary-page visual policy + sitewide stylesheet version.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { STYLESHEET_HREF } from './site-config.mjs';
import {
  shouldShowVisibleBreadcrumb,
  shouldStripEmptyAdSlots,
  shouldStripGenericLandingStubs,
  classifyPage
} from './page-policy.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SKIP_DIRS = new Set(['.git', 'node_modules', 'templates', 'partials']);

const BREADCRUMB_RE =
  /\n[ \t]*<nav class="breadcrumb" aria-label="Breadcrumb">[\s\S]*?<\/nav>\n/;
const AD_TOP_RE = /\n[ \t]*<div class="ad-slot ad-top"[^>]*><\/div>\n/g;
const AD_BOTTOM_RE = /\n[ \t]*<div class="ad-slot ad-bottom"[^>]*><\/div>\n/g;
const STYLESHEET_RE = /href="\/assets\/css\/styles\.css(?:\?v=[^"]*)?"/g;
const GENERIC_LIMITATIONS_RE =
  /\n<section class="limitations-block">[\s\S]*?<\/section>\n/;

function walkHtml(dir, out) {
  for (const name of fs.readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walkHtml(full, out);
    else if (name.endsWith('.html')) out.push(full);
  }
}

function applyFile(file) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  let html = fs.readFileSync(file, 'utf8');
  const orig = html;
  const notes = [];

  if (STYLESHEET_RE.test(html)) {
    html = html.replace(STYLESHEET_RE, 'href="' + STYLESHEET_HREF + '"');
    notes.push('stylesheet');
  }

  if (!shouldShowVisibleBreadcrumb(rel) && BREADCRUMB_RE.test(html)) {
    html = html.replace(BREADCRUMB_RE, '\n');
    notes.push('breadcrumb');
  }

  if (shouldStripEmptyAdSlots(rel)) {
    const before = html;
    html = html.replace(AD_TOP_RE, '\n');
    html = html.replace(AD_BOTTOM_RE, '\n');
    if (html !== before) notes.push('ads');
  }

  if (shouldStripGenericLandingStubs(rel) && GENERIC_LIMITATIONS_RE.test(html)) {
    html = html.replace(GENERIC_LIMITATIONS_RE, '\n');
    notes.push('generic-stub');
  }

  if (html !== orig) {
    fs.writeFileSync(file, html, 'utf8');
  }
  return { rel, changed: html !== orig, notes, category: classifyPage(rel) };
}

function main() {
  const files = [];
  walkHtml(ROOT, files);
  const inventory = {};
  const changed = [];

  files.forEach(function (file) {
    const result = applyFile(file);
    const cat = result.category;
    inventory[cat] = (inventory[cat] || 0) + 1;
    if (result.changed) changed.push(result);
  });

  console.log('Phase 7C apply — categories:', JSON.stringify(inventory));
  console.log('Changed ' + changed.length + ' file(s):');
  changed.forEach(function (r) {
    console.log('  ' + r.rel + ' (' + r.notes.join(', ') + ')');
  });

  const stale = [];
  files.forEach(function (file) {
    const t = fs.readFileSync(file, 'utf8');
    if (t.includes('href="/assets/css/styles.css"') && !t.includes(STYLESHEET_HREF)) {
      stale.push(path.relative(ROOT, file));
    }
  });
  if (stale.length) {
    console.error('STALE stylesheet refs:', stale.join(', '));
    process.exitCode = 1;
  }
}

main();
