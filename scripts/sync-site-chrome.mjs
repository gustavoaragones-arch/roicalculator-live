#!/usr/bin/env node
/**
 * Phase 1 remediation — sanctioned chrome-sync tool.
 *
 * Replaces the <header class="site-header">...</header> and
 * <footer class="site-footer">...</footer> blocks on every already-published
 * HTML page with the current canonical markup from scripts/site-chrome.mjs
 * (SITE_HEADER_HTML / SITE_FOOTER_HTML) — the single source of truth
 * established in this phase (see reports/audits/AUDIT-05-ARCHITECTURE.md and
 * reports/audits/MASTER-DIAGNOSTIC.md).
 *
 * This supersedes the retired scripts/_retired/patch-phase176.mjs, which did
 * the same kind of structural replacement but from its own private hardcoded
 * copy of the markup instead of a shared source. Unlike that script, this one:
 *   - sources its replacement text from exactly one place (site-chrome.mjs)
 *   - only ever touches the header/footer block boundaries, nothing else
 *   - reports a diff-sized summary (files changed vs. files already in sync)
 *     rather than silently overwriting everything unconditionally
 *   - explicitly does not touch templates/ or partials/, which are handled
 *     by their own mechanisms (template placeholders / direct hand-edit)
 *
 * This script intentionally does ONE job (chrome sync) and is not chained
 * into any other script's automatic run — it must be invoked explicitly:
 *   node scripts/sync-site-chrome.mjs           (apply)
 *   node scripts/sync-site-chrome.mjs --check   (report only, exit 1 if any
 *                                                 file would change)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SITE_HEADER_HTML, SITE_FOOTER_HTML } from './site-chrome.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SKIP_DIRS = new Set(['.git', 'node_modules', 'templates', 'partials', 'scripts', 'es']);

const HEADER_RE = /<header class="site-header">[\s\S]*?<\/header>/;
const FOOTER_RE = /<footer class="site-footer">[\s\S]*?<\/footer>/;

function walkHtml(dir, out) {
  for (const name of fs.readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walkHtml(full, out);
    else if (name.endsWith('.html')) out.push(full);
  }
}

function indentToMatch(original, replacement) {
  // Preserve whatever leading indentation the existing block opened with.
  var m = original.match(/^([ \t]*)/);
  var indent = m ? m[1] : '';
  return indent + replacement;
}

function syncFile(file, checkOnly) {
  var rel = path.relative(ROOT, file);
  var text = fs.readFileSync(file, 'utf8');
  var changed = false;
  var notes = [];

  var hMatch = text.match(HEADER_RE);
  if (hMatch) {
    var newHeader = indentToMatch(hMatch[0], SITE_HEADER_HTML);
    if (hMatch[0] !== newHeader) {
      text = text.slice(0, hMatch.index) + newHeader + text.slice(hMatch.index + hMatch[0].length);
      changed = true;
      notes.push('header');
    }
  }

  var fMatch = text.match(FOOTER_RE);
  if (fMatch) {
    var newFooter = indentToMatch(fMatch[0], SITE_FOOTER_HTML);
    if (fMatch[0] !== newFooter) {
      text = text.slice(0, fMatch.index) + newFooter + text.slice(fMatch.index + fMatch[0].length);
      changed = true;
      notes.push('footer');
    }
  }

  if (changed && !checkOnly) {
    fs.writeFileSync(file, text, 'utf8');
  }

  return { rel: rel, changed: changed, notes: notes };
}

function main() {
  var checkOnly = process.argv.includes('--check');
  var files = [];
  walkHtml(ROOT, files);

  var changedFiles = [];
  var unchangedCount = 0;

  files.forEach(function (file) {
    var result = syncFile(file, checkOnly);
    if (result.changed) {
      changedFiles.push(result);
    } else {
      unchangedCount++;
    }
  });

  if (changedFiles.length) {
    console.log((checkOnly ? '[check] Would update' : 'Updated') + ' ' + changedFiles.length + ' file(s):');
    changedFiles.forEach(function (r) {
      console.log('  ' + r.rel + ' (' + r.notes.join(', ') + ')');
    });
  }
  console.log((checkOnly ? 'Already in sync' : 'Already in sync') + ': ' + unchangedCount + ' file(s)');
  console.log('Total scanned: ' + files.length + ' file(s) (excluding ' + Array.from(SKIP_DIRS).join(', ') + ')');

  if (checkOnly && changedFiles.length) {
    process.exitCode = 1;
  }
}

main();
