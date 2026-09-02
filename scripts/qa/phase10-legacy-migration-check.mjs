// Phase 10 — Legacy Calculator Design-System Migration QA.
// Verifies the 5 Gen-1 legacy calculators (3 SaaS + 2 Solar) now use the
// established Gen-2+ design-system pattern (.result-dominant +
// .result-interpretation + .results-grid.results-box), preserve their exact
// pre-migration mathematics/IDs, preserve SEO/schema, and support the
// generic PDF export contract, with zero regression to already-modernized
// calculator pages.
//
// Run locally: node scripts/qa/phase10-legacy-migration-check.mjs
// Run against production: PHASE10_BASE=https://roicalculator.live node scripts/qa/phase10-legacy-migration-check.mjs
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', '..');
const BASE = process.env.PHASE10_BASE || 'http://127.0.0.1:8791';

const results = [];
function check(name, pass, detail) {
  results.push({ name, pass, detail });
  console.log((pass ? 'PASS' : 'FAIL') + '  ' + name + (detail ? ' — ' + detail : ''));
}
function cb(url) {
  return url + (url.includes('?') ? '&' : '?') + 'cb=' + Date.now() + Math.random().toString(36).slice(2);
}

const PAGES = [
  {
    file: 'roi-calculator/saas/cac-ltv-roi.html',
    path: '/roi-calculator/saas/cac-ltv-roi.html',
    btn: '#cac-ltv-form button[type="submit"]',
    dominantId: 'roi',
    expectedDominant: '35.00%',
    resultIds: ['roi', 'ltv', 'ratio', 'payback'],
    inputIds: ['cac', 'arpu', 'margin', 'lifespan'],
    canonical: 'https://roicalculator.live/roi-calculator/saas/cac-ltv-roi.html',
    hasFaq: true
  },
  {
    file: 'roi-calculator/saas/subscription-growth-roi.html',
    path: '/roi-calculator/saas/subscription-growth-roi.html',
    btn: '#sub-form button[type="submit"]',
    dominantId: 'sub-projected',
    expectedDominant: '2,033',
    resultIds: ['sub-projected', 'sub-rev-growth', 'sub-mrr', 'sub-roi'],
    inputIds: ['sub-initial', 'sub-growth', 'sub-churn', 'sub-arpu', 'sub-horizon', 'sub-spend', 'sub-margin'],
    canonical: 'https://roicalculator.live/roi-calculator/saas/subscription-growth-roi.html',
    hasFaq: false
  },
  {
    file: 'roi-calculator/saas/time-to-value-roi.html',
    path: '/roi-calculator/saas/time-to-value-roi.html',
    btn: '#ttv-form button[type="submit"]',
    dominantId: 'ttv-roi',
    expectedDominant: '20.00%',
    resultIds: ['ttv-roi', 'ttv-total', 'ttv-break-even', 'ttv-gain12'],
    inputIds: ['ttv-tool', 'ttv-impl', 'ttv-gain', 'ttv-months'],
    canonical: 'https://roicalculator.live/roi-calculator/saas/time-to-value-roi.html',
    hasFaq: false
  },
  {
    file: 'roi-calculator/solar/ev-charger-roi.html',
    path: '/roi-calculator/solar/ev-charger-roi.html',
    btn: '#ev-form button[type="submit"]',
    dominantId: 'ev-roi',
    expectedDominant: '433.33%',
    resultIds: ['ev-roi', 'ev-net', 'ev-break-even', 'ev-gain'],
    inputIds: ['ev-cost', 'ev-fuel-savings', 'ev-electricity', 'ev-incentives', 'ev-years'],
    canonical: 'https://roicalculator.live/roi-calculator/solar/ev-charger-roi.html',
    hasFaq: false
  },
  {
    file: 'roi-calculator/solar/heat-pump-roi.html',
    path: '/roi-calculator/solar/heat-pump-roi.html',
    btn: '#hp-form button[type="submit"]',
    dominantId: 'hp-roi',
    expectedDominant: '67.39%',
    resultIds: ['hp-roi', 'hp-net', 'hp-break-even', 'hp-total'],
    inputIds: ['hp-cost', 'hp-rebates', 'hp-savings', 'hp-inflation', 'hp-years'],
    canonical: 'https://roicalculator.live/roi-calculator/solar/heat-pump-roi.html',
    hasFaq: false
  }
];

// ---------- A. SOURCE QA ----------
for (const p of PAGES) {
  const filePath = path.join(ROOT, p.file);
  check(`A. Source file exists: ${p.file}`, fs.existsSync(filePath));
  if (!fs.existsSync(filePath)) continue;
  const html = fs.readFileSync(filePath, 'utf8');

  check(`A. ${p.file} — exactly one <h1>`, (html.match(/<h1[ >]/g) || []).length === 1);
  check(`A. ${p.file} — has .result-dominant`, html.includes('class="result-dominant"'));
  check(`A. ${p.file} — has .result-interpretation`, html.includes('class="result-interpretation"'));
  check(`A. ${p.file} — has .results-grid.results-box`, html.includes('results-grid results-box'));
  check(`A. ${p.file} — has hero section`, html.includes('<section class="hero">'));
  check(`A. ${p.file} — has calculator-section wrapper`, html.includes('class="calculator-section"'));
  check(`A. ${p.file} — results panel has hidden attribute`, /results-panel"[^>]*\shidden/.test(html));
  check(`A. ${p.file} — Download PDF button present`, html.includes('id="btn-pdf"') && html.includes('>Download PDF<'));
  check(`A. ${p.file} — references pdf-export.js`, html.includes('pdf-export.js'));
  // All existing input/output IDs preserved
  for (const id of [...p.resultIds, ...p.inputIds]) {
    check(`A. ${p.file} — preserves id="${id}"`, html.includes(`id="${id}"`));
  }
  // E. SEO — canonical preserved
  check(`E. ${p.file} — canonical preserved`, html.includes(`<link rel="canonical" href="${p.canonical}">`));
  // No new FAQPage schema introduced where none existed
  const faqSchemaCount = (html.match(/"@type":\s*"FAQPage"/g) || []).length;
  check(`E. ${p.file} — FAQPage schema count matches expectation (${p.hasFaq ? 1 : 0})`, faqSchemaCount === (p.hasFaq ? 1 : 0), faqSchemaCount);
  // Valid nesting: no orphaned </nav> where a <section> was opened for related-topics
  const relatedTopicsMatch = html.match(/<section class="related-topics">[\s\S]*?(<\/section>|<\/nav>)/);
  if (relatedTopicsMatch) {
    check(`A. ${p.file} — related-topics closed with matching </section> (not </nav>)`, relatedTopicsMatch[1] === '</section>');
  }
}

// ---------- Browser QA ----------
const browser = await chromium.launch({ channel: 'chrome' });
try {
  for (const p of PAGES) {
    const page = await browser.newPage();
    const consoleErrors = [];
    page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    page.on('pageerror', (e) => consoleErrors.push(String(e)));
    await page.goto(cb(`${BASE}${p.path}`), { waitUntil: 'load' });
    check(`B. ${p.path} — no console errors on load`, consoleErrors.length === 0, JSON.stringify(consoleErrors));

    // B. Calculator QA: default calculation matches pre-migration value
    const dominantValue = await page.textContent('#' + p.dominantId);
    check(`B. ${p.path} — default dominant result unchanged (${p.expectedDominant})`, dominantValue.trim() === p.expectedDominant, dominantValue);

    // C. Design-system QA
    const dominantFontSize = await page.locator('.result-dominant-value').evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    check(`C. ${p.path} — dominant result uses established large font size (>=32px)`, dominantFontSize >= 32, dominantFontSize);
    const interpText = await page.locator('.result-interpretation').textContent();
    check(`C. ${p.path} — interpretation is non-empty and calculator-specific`, interpText.trim().length > 20, interpText);

    // Recalculate via click, confirm identical (mathematically stable, no drift)
    await page.click(p.btn);
    await page.waitForTimeout(200);
    const dominantAfterClick = await page.textContent('#' + p.dominantId);
    check(`B. ${p.path} — recalculation matches default (no drift)`, dominantAfterClick.trim() === p.expectedDominant, dominantAfterClick);
    check(`B. ${p.path} — no console errors after calculate`, consoleErrors.length === 0, JSON.stringify(consoleErrors));

    // G. PDF QA
    const pdfBtn = page.locator('#btn-pdf');
    const pdfEnabled = await pdfBtn.isEnabled();
    check(`G. ${p.path} — PDF button enabled after calculation`, pdfEnabled === true);
    const [popup] = await Promise.all([
      page.context().waitForEvent('page', { timeout: 5000 }).catch(() => null),
      pdfBtn.click()
    ]);
    await page.waitForTimeout(300);
    check(`G. ${p.path} — PDF click opens a new window`, popup !== null);
    if (popup) {
      const content = await popup.content().catch(() => '');
      check(`G. ${p.path} — PDF popup has content`, content.length > 200, content.length);
      check(`G. ${p.path} — PDF popup contains roicalculator.live branding`, content.includes('roicalculator.live'));
      check(`G. ${p.path} — PDF popup contains disclaimer`, /informational purposes only/.test(content));
      await popup.close().catch(() => {});
    }
    const dominantAfterPdf = await page.textContent('#' + p.dominantId);
    check(`G. ${p.path} — clicking PDF did not alter results`, dominantAfterPdf.trim() === p.expectedDominant, dominantAfterPdf);

    // F. Accessibility QA
    for (const id of p.inputIds.slice(0, 2)) {
      const hasLabel = await page.locator(`label[for="${id}"]`).count();
      check(`F. ${p.path} — input #${id} has an associated <label>`, hasLabel === 1);
    }
    const pdfFocusable = await page.evaluate(() => {
      document.getElementById('btn-pdf').focus();
      return document.activeElement.id;
    });
    check(`F. ${p.path} — PDF button is keyboard-focusable`, pdfFocusable === 'btn-pdf');

    await page.close();
  }

  // D. Responsive QA
  const viewports = [
    { name: 'desktop-1440x900', width: 1440, height: 900 },
    { name: 'tablet-1024x768', width: 1024, height: 768 },
    { name: 'mobile-390x844', width: 390, height: 844 },
    { name: 'mobile-320x700', width: 320, height: 700 }
  ];
  for (const p of PAGES) {
    for (const vp of viewports) {
      const page = await browser.newPage();
      await page.setViewportSize(vp);
      await page.goto(cb(`${BASE}${p.path}`), { waitUntil: 'load' });
      await page.click(p.btn);
      await page.waitForTimeout(150);
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      check(`D. ${p.path} no horizontal overflow @ ${vp.name}`, scrollWidth <= clientWidth, `scrollWidth=${scrollWidth} clientWidth=${clientWidth}`);
      await page.close();
    }
  }

  // ---------- Regression: representative already-modernized pages ----------
  const REGRESSION_PAGES = [
    { name: 'Homepage', path: '/', btn: '#roi-form button[type="submit"]', dominant: '#result-roi' },
    { name: 'Real Estate (flip-roi)', path: '/real-estate/flip-roi-calculator.html', btn: '#re-flip-form button[type="submit"]', dominant: '#re-flip-roi', expected: '23.43%' },
    { name: '3D Printing (Business ROI)', path: '/3d-printing/roi-calculator.html', btn: '#tdp-form button[type="submit"]', dominant: '#tdp-res-roi24', expected: '1311.4%' },
    { name: 'SaaS reference', path: '/saas/', btn: '#saas-cluster-form button[type="submit"]', dominant: '#saas-res-roi' },
    { name: 'Solar reference', path: '/solar/roi-calculator.html', btn: '#sp-roi-form button[type="submit"]', dominant: '#sp-result-payback', expected: '9.7 yr' },
    { name: 'HVAC (Gen-2)', path: '/hvac/roi-calculator.html', btn: '#hvac-roi-form button[type="submit"]', dominant: '#hvac-result-payback', expected: '27.9 yr' }
  ];
  for (const p of REGRESSION_PAGES) {
    const page = await browser.newPage();
    const consoleErrors = [];
    page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    page.on('pageerror', (e) => consoleErrors.push(String(e)));
    await page.goto(cb(`${BASE}${p.path}`), { waitUntil: 'load' });
    await page.click(p.btn);
    await page.waitForTimeout(200);
    const val = await page.textContent(p.dominant);
    if (p.expected) {
      check(`REGRESSION: ${p.name} default unchanged (${p.expected})`, val.trim() === p.expected, val);
    } else {
      check(`REGRESSION: ${p.name} produces a non-placeholder result`, val.trim() !== '—' && val.trim() !== '', val);
    }
    check(`REGRESSION: ${p.name} no console errors`, consoleErrors.length === 0, JSON.stringify(consoleErrors));
    await page.close();
  }
} finally {
  await browser.close();
}

const failed = results.filter((r) => !r.pass);
console.log('\n' + (failed.length ? failed.length + ' FAILED' : 'ALL PASSED') + ' out of ' + results.length + ' checks');
if (failed.length) process.exitCode = 1;
