#!/usr/bin/env node
/**
 * Phase 18.4 — Insert Popular Tools footer and BreadcrumbList on pages missing them.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  POPULAR_TOOLS_FOOTER_HTML,
  breadcrumbJsonLdString,
  staticPageBreadcrumbJsonLd
} from './site-chrome.mjs';
import { canonicalUrl } from './site-config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SKIP_DIRS = new Set(['.git', 'node_modules', 'templates', 'partials']);

const FOOTER_MARKER = '  <nav class="footer-secondary">';
const BREADCRUMB_SCRIPT =
  '  <script type="application/ld+json">' + '\n' + '  __BREADCRUMB_PLACEHOLDER__\n' + '  </script>\n';

const STATIC_BREADCRUMBS = {
  'about.html': ['Site', null, 'About', 'about.html'],
  'contact.html': ['Site', null, 'Contact', 'contact.html'],
  'privacy.html': ['Site', null, 'Privacy', 'privacy.html'],
  'terms.html': ['Site', null, 'Terms', 'terms.html'],
  '404.html': ['Site', null, 'Page Not Found', '404.html'],
  'sitemap.html': ['Site', null, 'Sitemap', 'sitemap.html'],
  'site-structure.html': ['Site', null, 'Site Structure', 'site-structure.html'],
  'methodology/index.html': ['Methodology', 'methodology/', 'Methodology', 'methodology/']
};

function walkHtml(dir, out) {
  for (const name of fs.readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walkHtml(full, out);
    else if (name.endsWith('.html')) out.push(full);
  }
}

function insertPopularFooter(html) {
  if (html.includes('footer-popular') || !html.includes(FOOTER_MARKER)) return html;
  return html.replace(FOOTER_MARKER, POPULAR_TOOLS_FOOTER_HTML + FOOTER_MARKER);
}

function insertBreadcrumb(html, relPath) {
  if (html.includes('BreadcrumbList')) return html;
  if (relPath === 'index.html') return html;

  var sectionUrl = null;
  var sectionName = 'Site';
  var pageName = 'Page';
  var pageUrl = null;

  if (STATIC_BREADCRUMBS[relPath]) {
    var row = STATIC_BREADCRUMBS[relPath];
    sectionName = row[0];
    sectionUrl = row[1] ? canonicalUrl('/' + row[1]) : null;
    pageName = row[2];
    pageUrl = row[3] ? canonicalUrl('/' + row[3]) : null;
  } else if (relPath.startsWith('learn/')) {
    sectionName = 'Learn';
    sectionUrl = canonicalUrl('/learn/what-is-roi.html');
    pageName = path.basename(relPath, '.html').replace(/-/g, ' ');
    pageUrl = canonicalUrl('/' + relPath);
  } else if (relPath.startsWith('comparisons/') && relPath !== 'comparisons/index.html') {
    sectionName = 'ROI Comparisons';
    sectionUrl = canonicalUrl('/comparisons/');
    pageName = path.basename(relPath, '.html').replace(/-/g, ' ');
    pageUrl = canonicalUrl('/' + relPath);
  } else if (relPath.startsWith('benchmarks/') && relPath !== 'benchmarks/index.html') {
    sectionName = 'ROI Benchmarks';
    sectionUrl = canonicalUrl('/benchmarks/');
    pageName = path.basename(relPath, '.html').replace(/-/g, ' ');
    pageUrl = canonicalUrl('/' + relPath);
  } else if (relPath.startsWith('glossary/') && relPath !== 'glossary/index.html') {
    sectionName = 'Glossary';
    sectionUrl = canonicalUrl('/glossary/');
    pageName = path.basename(relPath, '.html').replace(/-/g, ' ');
    pageUrl = canonicalUrl('/' + relPath);
  } else {
    return html;
  }

  var ld = staticPageBreadcrumbJsonLd(sectionName, sectionUrl, pageName, pageUrl);
  var block = BREADCRUMB_SCRIPT.replace('__BREADCRUMB_PLACEHOLDER__', ld);
  if (html.includes('<link rel="stylesheet"')) {
    return html.replace(
      '<link rel="stylesheet"',
      block + '  <link rel="stylesheet"'
    );
  }
  return html;
}

function main() {
  var files = [];
  walkHtml(ROOT, files);
  var footers = 0;
  var crumbs = 0;

  files.forEach(function (file) {
    var rel = path.relative(ROOT, file);
    var orig = fs.readFileSync(file, 'utf8');
    var html = insertPopularFooter(orig);
    html = insertBreadcrumb(html, rel);
    if (html !== orig) {
      if (!orig.includes('footer-popular') && html.includes('footer-popular')) footers++;
      if (!orig.includes('BreadcrumbList') && html.includes('BreadcrumbList')) crumbs++;
      fs.writeFileSync(file, html, 'utf8');
    }
  });

  console.log('patch-site-chrome: Popular Tools footer +' + footers + ', breadcrumbs +' + crumbs);
}

main();
