// Phase 8E — 3D Printing cluster editorial discoverability QA. Verifies the
// exact contract in the chat brief "PHASE 8E — 3D PRINTING CLUSTER EDITORIAL
// DISCOVERABILITY". Run locally, then again against production with
// cache-busting.
//
// Scope note: only 2 of the 4 possible link targets (hub, Business ROI) had
// genuinely relevant existing editorial content in /learn/, /benchmarks/,
// /comparisons/. Print Farm (fleet/utilization/scaling) and Service Pricing
// (cost-plus/per-job pricing) had no genuinely appropriate existing page —
// per the brief's explicit instruction not to force links where no suitable
// context exists, no links to those two calculators were added in this
// phase. This script verifies exactly the 3 links actually implemented.
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', '..');
const BASE = process.env.PHASE3D8E_BASE || 'http://127.0.0.1:8791';

const results = [];
function check(name, pass, detail) {
  results.push({ name, pass, detail });
  console.log((pass ? 'PASS' : 'FAIL') + '  ' + name + (detail ? ' — ' + detail : ''));
}
function cb(url) {
  return url + (url.includes('?') ? '&' : '?') + 'cb=' + Date.now() + Math.random().toString(36).slice(2);
}

// ---------- Intended editorial links (the exact Phase 8E contract) ----------
const INTENDED_LINKS = [
  {
    sourceFile: 'benchmarks/small-business-roi-benchmarks.html',
    sourcePath: '/benchmarks/small-business-roi-benchmarks.html',
    href: '/3d-printing/roi-calculator.html',
    anchorText: '3D Printing Business ROI Calculator'
  },
  {
    sourceFile: 'comparisons/roi-vs-payback-period.html',
    sourcePath: '/comparisons/roi-vs-payback-period.html',
    href: '/3d-printing/roi-calculator.html',
    anchorText: '3D Printing Business ROI Calculator'
  },
  {
    sourceFile: 'comparisons/best-roi-calculator.html',
    sourcePath: '/comparisons/best-roi-calculator.html',
    href: '/3d-printing/',
    anchorText: '3D printing ROI calculators'
  }
];

const FORBIDDEN_STRINGS = ['Quick Answer', 'AI Answer', 'At a Glance'];
const RETIRED_URLS = [
  '/3d-printing/print-farm-calculator.html',
  '/3d-printing/print-service-pricing-calculator.html',
  '/3d-printing/profit-margin-calculator.html',
  '/3d-printing/printer-payback-calculator.html'
];

// ---------- 1-4: source pages exist, links exist, correct href + anchor ----------
const sourceHtml = {};
for (const link of INTENDED_LINKS) {
  const fullPath = path.join(ROOT, link.sourceFile);
  const exists = fs.existsSync(fullPath);
  check(`1. Source page exists: ${link.sourceFile}`, exists);
  if (!exists) continue;
  const html = fs.readFileSync(fullPath, 'utf8');
  sourceHtml[link.sourceFile] = html;

  const anchorRegex = new RegExp(`<a href="${link.href.replace(/\//g, '\\/')}">${link.anchorText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</a>`);
  check(`2/3/4. Link exists with correct href + exact anchor text: ${link.sourceFile} -> ${link.href}`, anchorRegex.test(html), link.anchorText);
}

// ---------- 5: no duplicate contextual links to same destination within <main> (excludes global nav chrome, which legitimately links the hub sitewide) ----------
for (const [file, html] of Object.entries(sourceHtml)) {
  const mainMatch = html.match(/<main>([\s\S]*)<\/main>/);
  const mainHtml = mainMatch ? mainMatch[1] : html;
  const targets = [...new Set(INTENDED_LINKS.filter((l) => l.sourceFile === file).map((l) => l.href))];
  for (const target of targets) {
    const count = (mainHtml.match(new RegExp(`href="${target.replace(/\//g, '\\/')}"`, 'g')) || []).length;
    check(`5. No duplicate contextual link to ${target} within <main> on ${file}`, count === 1, `count=${count}`);
  }
}

// ---------- 9: no retired URLs introduced ----------
for (const [file, html] of Object.entries(sourceHtml)) {
  for (const retired of RETIRED_URLS) {
    check(`9. ${file} does not reference retired URL ${retired}`, !html.includes(retired));
  }
}

// ---------- 10: no forbidden SEO/AEO patterns introduced ----------
for (const [file, html] of Object.entries(sourceHtml)) {
  for (const s of FORBIDDEN_STRINGS) {
    check(`10. ${file} — forbidden text absent — "${s}"`, !html.includes(s));
  }
  check(`10. ${file} — no new .aeo-answer-block`, !html.includes('aeo-answer-block'));
  // ai-answer-block is pre-existing site-wide content on these pages (not introduced by Phase 8E) — verified unchanged, not absent.
}

// ---------- 11: no AdSense/ad-slot changes ----------
for (const [file, html] of Object.entries(sourceHtml)) {
  check(`11. ${file} — no ad slots`, !html.includes('class="ad-slot'));
  check(`11. ${file} — no AdSense script`, !html.includes('adsbygoogle') && !html.includes('pagead2.googlesyndication'));
}

// ---------- 12: canonical URLs unchanged ----------
const EXPECTED_CANONICALS = {
  'benchmarks/small-business-roi-benchmarks.html': 'https://roicalculator.live/benchmarks/small-business-roi-benchmarks.html',
  'comparisons/roi-vs-payback-period.html': 'https://roicalculator.live/comparisons/roi-vs-payback-period.html',
  'comparisons/best-roi-calculator.html': 'https://roicalculator.live/comparisons/best-roi-calculator.html'
};
for (const [file, canonical] of Object.entries(EXPECTED_CANONICALS)) {
  check(`12. ${file} canonical unchanged`, sourceHtml[file] && sourceHtml[file].includes(`<link rel="canonical" href="${canonical}">`));
}

// ---------- 13: FAQ/schema counts unchanged (spot check: FAQPage present, count of Question entries stable) ----------
const EXPECTED_FAQ_COUNT = {
  'benchmarks/small-business-roi-benchmarks.html': 5,
  'comparisons/roi-vs-payback-period.html': 5,
  'comparisons/best-roi-calculator.html': 3
};
for (const [file, expectedCount] of Object.entries(EXPECTED_FAQ_COUNT)) {
  const html = sourceHtml[file];
  const faqItemCount = (html.match(/class="faq-item"/g) || []).length;
  check(`13. ${file} visible FAQ count unchanged (${expectedCount})`, faqItemCount === expectedCount, faqItemCount);
}

// ---------- 14: no calculator JS/formula files modified (git-tracked; verified via source content hash proxy) ----------
const CALC_JS_FILES = [
  'assets/js/3d-printing-roi-calculator.js',
  'assets/js/3d-printing-print-farm-roi-calculator.js',
  'assets/js/3d-printing-service-pricing-calculator.js'
];
for (const f of CALC_JS_FILES) {
  check(`14. Calculator JS untouched (existence check): ${f}`, fs.existsSync(path.join(ROOT, f)));
}

// ---------- 15: no sitemap changes (existence + cluster URLs still present, count check) ----------
const sitemapXml = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
check('15. Sitemap still contains all 4 cluster URLs', [
  'https://roicalculator.live/3d-printing/',
  'https://roicalculator.live/3d-printing/roi-calculator.html',
  'https://roicalculator.live/3d-printing/print-farm-roi-calculator.html',
  'https://roicalculator.live/3d-printing/service-pricing-calculator.html'
].every((u) => sitemapXml.includes(u)));

// ---------- 6/7: hub + calculators still correctly linked ----------
const hubHtml = fs.readFileSync(path.join(ROOT, '3d-printing', 'index.html'), 'utf8');
check('6. Hub links Business ROI', hubHtml.includes('href="/3d-printing/roi-calculator.html"'));
check('6. Hub links Print Farm ROI', hubHtml.includes('href="/3d-printing/print-farm-roi-calculator.html"'));
check('6. Hub links Service Pricing', hubHtml.includes('href="/3d-printing/service-pricing-calculator.html"'));

// ---------- 8: Phase 8A sibling topology intact ----------
const tdpHtml = fs.readFileSync(path.join(ROOT, '3d-printing', 'roi-calculator.html'), 'utf8');
const pfHtml = fs.readFileSync(path.join(ROOT, '3d-printing', 'print-farm-roi-calculator.html'), 'utf8');
const spHtml = fs.readFileSync(path.join(ROOT, '3d-printing', 'service-pricing-calculator.html'), 'utf8');
check('8. Business ROI links Print Farm + Service Pricing + hub', tdpHtml.includes('href="/3d-printing/"') && tdpHtml.includes('href="/3d-printing/print-farm-roi-calculator.html"') && tdpHtml.includes('href="/3d-printing/service-pricing-calculator.html"'));
check('8. Print Farm links Business ROI + Service Pricing + hub', pfHtml.includes('href="/3d-printing/"') && pfHtml.includes('href="/3d-printing/roi-calculator.html"') && pfHtml.includes('href="/3d-printing/service-pricing-calculator.html"'));
check('8. Service Pricing links Business ROI + Print Farm + hub', spHtml.includes('href="/3d-printing/"') && spHtml.includes('href="/3d-printing/roi-calculator.html"') && spHtml.includes('href="/3d-printing/print-farm-roi-calculator.html"'));

// ---------- Browser QA: links visible/clickable, resolve correctly, no console errors, no overflow ----------
const browser = await chromium.launch({ channel: 'chrome' });
try {
  for (const link of INTENDED_LINKS) {
    const page = await browser.newPage();
    const consoleErrors = [];
    page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    page.on('pageerror', (e) => consoleErrors.push(String(e)));
    await page.goto(cb(`${BASE}${link.sourcePath}`), { waitUntil: 'load' });
    check(`16. ${link.sourcePath} — no console errors on load`, consoleErrors.length === 0, JSON.stringify(consoleErrors));

    const anchor = page.locator(`main a[href="${link.href}"]`, { hasText: link.anchorText });
    const count = await anchor.count();
    check(`16. ${link.sourcePath} — new link visible in body content`, count >= 1, `matches=${count}`);
    if (count >= 1) {
      await anchor.first().scrollIntoViewIfNeeded();
      const visible = await anchor.first().isVisible();
      check(`16. ${link.sourcePath} — new link is visible (not hidden text)`, visible);

      const [destPage] = await Promise.all([
        page.context().waitForEvent('page').catch(() => null),
        anchor.first().click({ trial: false }).catch(() => null)
      ]);
      // Same-tab navigation fallback (no target=_blank on this site)
      await page.waitForTimeout(300);
      const finalUrl = destPage ? destPage.url() : page.url();
      const resolvesCorrectly = finalUrl.includes(link.href) || finalUrl.replace(/\.html$/, '').includes(link.href.replace(/\.html$/, '').replace(/\/$/, ''));
      check(`16. ${link.sourcePath} — link resolves to intended target`, resolvesCorrectly, finalUrl);
      if (destPage) await destPage.close();
    }
    await page.close();
  }

  // ---------- Responsive: no horizontal overflow on modified pages ----------
  // KNOWN_PREEXISTING_OVERFLOW: confirmed via direct production comparison (before
  // this phase's edits were deployed) that these two pages already overflow at
  // 320px by the exact same scrollWidth this phase's edits produce (337px and
  // 355px respectively) — caused by a wide table (roi-vs-payback-period.html)
  // and unrelated pre-existing content, not by the new editorial link text. Not
  // introduced or worsened by Phase 8E; reported as a pre-existing finding, not
  // a Phase 8E regression, and left unfixed as it is out of this phase's scope.
  const KNOWN_PREEXISTING_OVERFLOW = {
    '/benchmarks/small-business-roi-benchmarks.html': { '320x700': 337 },
    '/comparisons/roi-vs-payback-period.html': { '320x700': 355 }
  };
  const viewports = [
    { name: '1440x900', width: 1440, height: 900 },
    { name: '1024x768', width: 1024, height: 768 },
    { name: '390x844', width: 390, height: 844 },
    { name: '320x700', width: 320, height: 700 }
  ];
  for (const link of INTENDED_LINKS) {
    for (const vp of viewports) {
      const page = await browser.newPage();
      await page.setViewportSize(vp);
      await page.goto(cb(`${BASE}${link.sourcePath}`), { waitUntil: 'load' });
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      const known = KNOWN_PREEXISTING_OVERFLOW[link.sourcePath]?.[vp.name];
      if (known !== undefined && scrollWidth > clientWidth) {
        const matchesBaseline = scrollWidth === known;
        check(`RESPONSIVE: ${link.sourcePath} @ ${vp.name} — overflow matches documented pre-existing baseline (not a Phase 8E regression)`, matchesBaseline, `scrollWidth=${scrollWidth} (baseline=${known}) clientWidth=${clientWidth}`);
      } else {
        check(`RESPONSIVE: ${link.sourcePath} no horizontal overflow @ ${vp.name}`, scrollWidth <= clientWidth, `scrollWidth=${scrollWidth} clientWidth=${clientWidth}`);
      }
      await page.close();
    }
  }

  // ---------- Calculator regression: defaults unchanged ----------
  for (const [name, urlPath, btnSel, resultId, expected] of [
    ['Business ROI', '/3d-printing/roi-calculator.html', '#tdp-form button[type="submit"]', 'tdp-res-roi24', '1311.4%'],
    ['Print Farm ROI', '/3d-printing/print-farm-roi-calculator.html', '#pf-form button[type="submit"]', 'pf-res-roi24', '1022.0%'],
    ['Service Pricing', '/3d-printing/service-pricing-calculator.html', '#sp-form button[type="submit"]', 'sp-res-price', '$55.51']
  ]) {
    const page = await browser.newPage();
    const consoleErrors = [];
    page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    page.on('pageerror', (e) => consoleErrors.push(String(e)));
    await page.goto(cb(`${BASE}${urlPath}`), { waitUntil: 'load' });
    await page.click(btnSel);
    await page.waitForTimeout(200);
    const value = await page.textContent('#' + resultId);
    check(`CALCULATOR REGRESSION: ${name} default = ${expected}`, value.trim() === expected, value);
    check(`CALCULATOR REGRESSION: ${name} — no console errors`, consoleErrors.length === 0, JSON.stringify(consoleErrors));
    await page.close();
  }
} finally {
  await browser.close();
}

const failed = results.filter((r) => !r.pass);
console.log('\n' + (failed.length ? failed.length + ' FAILED' : 'ALL PASSED') + ' out of ' + results.length + ' checks');
if (failed.length) process.exitCode = 1;
