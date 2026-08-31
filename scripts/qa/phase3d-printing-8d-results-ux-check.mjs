// Phase 8D — 3D Printing ROI results UX QA. Verifies the exact contract in
// the chat brief "PHASE 8D — 3D PRINTING ROI RESULTS UX". Run locally before
// deploy, then again with PHASE3D8D_BASE=https://roicalculator.live after
// deploy (cache-busted).
//
// NOTE on two newly-rendered outputs: Business ROI's `costPerSuccess` and
// `totalCostPerPrint`, and Print Farm's `monthlyCashProfit`, were already
// computed in each page's JS engine but were never written to the DOM prior
// to this phase (confirmed by direct source read of both engines before
// editing). This QA script's required-output lists ask for "Cost per
// success" / "Total cost/print" (Business ROI) and "Monthly cash profit"
// (Print Farm) to be present and verifiable — satisfying that requirement
// meant adding one new result element + one new JS line per value, using the
// pre-existing computed variable verbatim. No formula, rounding, or
// interpretation logic changed.
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', '..');
const BASE = process.env.PHASE3D8D_BASE || 'http://127.0.0.1:8791';

const results = [];
function check(name, pass, detail) {
  results.push({ name, pass, detail });
  console.log((pass ? 'PASS' : 'FAIL') + '  ' + name + (detail ? ' — ' + detail : ''));
}
function cb(url) {
  return url + (url.includes('?') ? '&' : '?') + 'cb=' + Date.now() + Math.random().toString(36).slice(2);
}

const TDP_PATH = '/3d-printing/roi-calculator.html';
const PF_PATH = '/3d-printing/print-farm-roi-calculator.html';

const TDP_REQUIRED_IDS = [
  'tdp-res-roi24', 'tdp-res-payback', 'tdp-res-monthly-profit', 'tdp-res-profit-per-print',
  'tdp-res-breakeven', 'tdp-res-cost-per-success', 'tdp-res-total-cost', 'tdp-res-margin', 'tdp-res-markup'
];
const TDP_INPUT_IDS = [
  'tdp-printer-cost', 'tdp-setup-cost', 'tdp-useful-life', 'tdp-residual', 'tdp-price', 'tdp-units',
  'tdp-filament-price', 'tdp-material-grams', 'tdp-print-time', 'tdp-wattage', 'tdp-electricity-rate',
  'tdp-failure-rate', 'tdp-labor-minutes', 'tdp-labor-rate', 'tdp-platform-fee', 'tdp-payment-fee',
  'tdp-shipping', 'tdp-fixed-costs'
];

const PF_REQUIRED_IDS = [
  'pf-res-roi24', 'pf-res-payback', 'pf-res-monthly-profit', 'pf-res-profit-per-print', 'pf-res-breakeven',
  'pf-res-monthly-prints', 'pf-res-capacity', 'pf-res-capacity-utilization', 'pf-res-revenue', 'pf-res-cash-profit'
];
const PF_INPUT_IDS = [
  'pf-printer-count', 'pf-printer-cost', 'pf-setup-cost', 'pf-useful-life', 'pf-residual', 'pf-print-time',
  'pf-utilization', 'pf-failure-rate', 'pf-price', 'pf-filament-price', 'pf-material-grams', 'pf-wattage',
  'pf-electricity-rate', 'pf-labor-minutes', 'pf-labor-rate', 'pf-platform-fee', 'pf-payment-fee',
  'pf-shipping', 'pf-fixed-costs', 'pf-orders'
];

const FORBIDDEN_STRINGS = ['Quick Answer', 'AI Answer', 'At a Glance', 'What is ROI?'];

// ---------- Source checks ----------
const tdpHtml = fs.readFileSync(path.join(ROOT, '3d-printing', 'roi-calculator.html'), 'utf8');
const pfHtml = fs.readFileSync(path.join(ROOT, '3d-printing', 'print-farm-roi-calculator.html'), 'utf8');

for (const [name, html, requiredIds, inputIds] of [
  ['Business ROI', tdpHtml, TDP_REQUIRED_IDS, TDP_INPUT_IDS],
  ['Print Farm ROI', pfHtml, PF_REQUIRED_IDS, PF_INPUT_IDS]
]) {
  check(`STRUCTURE: ${name} — exactly one <h1>`, (html.match(/<h1[ >]/g) || []).length === 1);
  check(`STRUCTURE: ${name} — dominant result-dominant present`, html.includes('class="result-dominant"'));
  const dominantIdx = html.indexOf('class="result-dominant"');
  const firstGroupHeadingIdx = html.indexOf('<h4 class="results-group-heading">');
  check(`STRUCTURE: ${name} — dominant result appears before supporting result groups`, dominantIdx < firstGroupHeadingIdx && dominantIdx > -1 && firstGroupHeadingIdx > -1);
  check(`STRUCTURE: ${name} — result-interpretation present`, html.includes('class="result-interpretation"'));
  check(`PRESERVATION: ${name} — all required output IDs present`, requiredIds.every((id) => html.includes(`id="${id}"`)), JSON.stringify(requiredIds.filter((id) => !html.includes(`id="${id}"`))));
  check(`PRESERVATION: ${name} — all calculator input IDs unchanged`, inputIds.every((id) => html.includes(`id="${id}"`)), JSON.stringify(inputIds.filter((id) => !html.includes(`id="${id}"`))));
  for (const s of FORBIDDEN_STRINGS) {
    check(`ANTI-REGRESSION: ${name} — forbidden text absent — "${s}"`, !html.includes(s));
  }
  check(`ANTI-REGRESSION: ${name} — no .aeo-answer-block / .ai-answer-block`, !html.includes('aeo-answer-block') && !html.includes('ai-answer-block'));
  check(`ANTI-REGRESSION: ${name} — no ad slots`, !html.includes('class="ad-slot'));
  check(`ANTI-REGRESSION: ${name} — no AdSense script`, !html.includes('adsbygoogle') && !html.includes('pagead2.googlesyndication'));
  check(`ANTI-REGRESSION: ${name} — no sticky CTA`, !html.includes('sticky'));
  check(`ANTI-REGRESSION: ${name} — no privacy badge`, !html.includes('badge-privacy'));
}

// ---------- Phase 8A/8B preservation ----------
check('PHASE 8A: Business ROI retains hub link', tdpHtml.includes('href="/3d-printing/">3D Printing Calculators</a>'));
check('PHASE 8A: Business ROI retains Print Farm link', tdpHtml.includes('href="/3d-printing/print-farm-roi-calculator.html">3D Print Farm ROI Calculator</a>'));
check('PHASE 8A: Business ROI retains Service Pricing link', tdpHtml.includes('href="/3d-printing/service-pricing-calculator.html">3D Print Service Pricing Calculator</a>'));
check('PRESERVATION: Business ROI retains existing FAQ (4 questions)', (tdpHtml.match(/class="faq-item"/g) || []).length === 4);
check('PRESERVATION: Business ROI retains "How to use" supporting content', tdpHtml.includes('How to use this for a purchase or scaling decision'));

check('PHASE 8A: Print Farm ROI retains hub link', pfHtml.includes('href="/3d-printing/">3D Printing Calculators</a>'));
check('PHASE 8A: Print Farm ROI retains Business ROI link', pfHtml.includes('href="/3d-printing/roi-calculator.html">3D Printing Business ROI Calculator</a>'));
check('PHASE 8A: Print Farm ROI retains Service Pricing link (added in 8A)', pfHtml.includes('href="/3d-printing/service-pricing-calculator.html">3D Print Service Pricing Calculator</a>'));
check('PRESERVATION: Print Farm ROI retains existing FAQ (4 questions)', (pfHtml.match(/class="faq-item"/g) || []).length === 4);
check('PRESERVATION: Print Farm ROI retains "How to use" supporting content', pfHtml.includes('How to use this for a print-farm scaling decision'));

// ---------- CSS scope check: page-scoped <style> only, no global CSS file touched ----------
check('CSS SCOPE: assets/css/styles.css was not modified by this phase (git-tracked check happens in scope audit; here verify page-scoped <style> exists inline)', tdpHtml.includes('<style>') && pfHtml.includes('<style>'));

const browser = await chromium.launch({ channel: 'chrome' });
try {
  for (const [name, urlPath, formSel, btnSel, dominantId, dominantExpected] of [
    ['Business ROI', TDP_PATH, '#tdp-form', '#tdp-form button[type="submit"]', 'tdp-res-roi24', '1311.4%'],
    ['Print Farm ROI', PF_PATH, '#pf-form', '#pf-form button[type="submit"]', 'pf-res-roi24', '1022.0%']
  ]) {
    const page = await browser.newPage();
    const consoleErrors = [];
    page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    page.on('pageerror', (e) => consoleErrors.push(String(e)));
    await page.goto(cb(`${BASE}${urlPath}`), { waitUntil: 'load' });
    check(`BROWSER: ${name} — no console errors on load`, consoleErrors.length === 0, JSON.stringify(consoleErrors));

    await page.click(btnSel);
    await page.waitForTimeout(200);
    const dominantValue = await page.textContent('#' + dominantId);
    check(`CALCULATOR REGRESSION: ${name} default = ${dominantExpected}`, dominantValue.trim() === dominantExpected, dominantValue);

    const allValues = await page.$$eval('.results-panel .value', (els) => els.map((e) => e.textContent.trim()));
    check(`CALCULATOR REGRESSION: ${name} — no NaN/Infinity/undefined/null in any result`, !allValues.some((v) => /NaN|Infinity|undefined|null/.test(v)), JSON.stringify(allValues));
    check(`CALCULATOR REGRESSION: ${name} — no console errors after calculate`, consoleErrors.length === 0, JSON.stringify(consoleErrors));

    // Visual prominence: dominant font-size strictly greater than key-metric group, which is >= secondary group
    const dominantFontSize = await page.locator('.result-dominant-value').evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    const keyGroupSelector = name === 'Business ROI' ? '#tdp-results-box .value' : '#pf-results-box .value';
    const keyFontSize = await page.locator(keyGroupSelector).first().evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    const secondaryFontSize = await page.locator('.results-secondary .value').first().evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    check(`VISUAL PRIORITY: ${name} — dominant result strictly larger than key metrics`, dominantFontSize > keyFontSize, `${dominantFontSize} vs ${keyFontSize}`);
    check(`VISUAL PRIORITY: ${name} — key metrics larger than or equal to secondary group`, keyFontSize >= secondaryFontSize, `${keyFontSize} vs ${secondaryFontSize}`);

    await page.close();
  }

  // ---------- Responsive ----------
  const viewports = [
    { name: '1440x900', width: 1440, height: 900 },
    { name: '1024x768', width: 1024, height: 768 },
    { name: '390x844', width: 390, height: 844 },
    { name: '320x700', width: 320, height: 700 }
  ];
  for (const [name, urlPath, btnSel] of [
    ['Business ROI', TDP_PATH, '#tdp-form button[type="submit"]'],
    ['Print Farm ROI', PF_PATH, '#pf-form button[type="submit"]']
  ]) {
    for (const vp of viewports) {
      const page = await browser.newPage();
      await page.setViewportSize(vp);
      await page.goto(cb(`${BASE}${urlPath}`), { waitUntil: 'load' });
      await page.click(btnSel);
      await page.waitForTimeout(200);
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      check(`RESPONSIVE: ${name} no horizontal overflow @ ${vp.name}`, scrollWidth <= clientWidth, `scrollWidth=${scrollWidth} clientWidth=${clientWidth}`);
      const clipped = await page.$$eval('.results-panel .result-item', (els) => els.filter((el) => el.scrollWidth > el.clientWidth + 1).length);
      check(`RESPONSIVE: ${name} no clipped result cards @ ${vp.name}`, clipped === 0, clipped);
      await page.close();
    }
  }
} finally {
  await browser.close();
}

const failed = results.filter((r) => !r.pass);
console.log('\n' + (failed.length ? failed.length + ' FAILED' : 'ALL PASSED') + ' out of ' + results.length + ' checks');
if (failed.length) process.exitCode = 1;
