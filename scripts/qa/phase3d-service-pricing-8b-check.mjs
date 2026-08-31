// Phase 8B — Service Pricing content-parity QA. Verifies the exact contract
// in the chat brief "PHASE 8B — 3D PRINTING SERVICE PRICING CONTENT PARITY".
// Run locally before deploy, then again with
// PHASE3DSP8B_BASE=https://roicalculator.live after deploy (cache-busted).
//
// NOTE on the "Limitations and Assumptions" list item 1: the Director's
// exact-required wording read "Printer depreciation is modeled from the
// printer's cost, residual value, useful life, and print time entered in the
// calculator." Service Pricing's calculator has NO residual-value input
// (confirmed by direct source read of this page's Machine cost fields, and
// independently documented in both PHASE-3D-PRINTING-05-CLUSTER-REVIEW.md
// and PHASE-3D-PRINTING-08-CLUSTER-SEO-CONTENT-UX-REVIEW.md, which state
// "no residual-value input exists on this page" for Service Pricing). The
// phrase "residual value, " was removed as the minimal factual correction;
// this QA script checks for the corrected sentence, not the originally
// supplied one.
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', '..');
const BASE = process.env.PHASE3DSP8B_BASE || 'http://127.0.0.1:8791';
const PAGE_PATH = '/3d-printing/service-pricing-calculator.html';

const results = [];
function check(name, pass, detail) {
  results.push({ name, pass, detail });
  console.log((pass ? 'PASS' : 'FAIL') + '  ' + name + (detail ? ' — ' + detail : ''));
}
function cb(url) {
  return url + (url.includes('?') ? '&' : '?') + 'cb=' + Date.now() + Math.random().toString(36).slice(2);
}

const REQUIRED_STRINGS = [
  'How to Use This Calculator',
  "Enter the material cost, print time, electricity cost, printer depreciation, labor, overhead, failure rate, platform fees, and target profit margin for the job. The calculator combines these costs, accounts for expected failed prints, and estimates a price that meets your target margin after platform fees.",
  'Use your actual material cost rather than the retail price of a full spool.',
  'Include the time you spend preparing, monitoring, finishing, packaging, and handling the order when those activities are part of your labor cost.',
  'Increase the failure rate when the job or material has a meaningful risk of failed prints.',
  "The recommended price is a pricing model, not a required market price. Compare it with the customer's requirements, your competitive position, and any additional costs that are specific to the job.",
  'Limitations and Assumptions',
  'The calculator estimates job pricing from the costs and target margin you enter. It does not determine what customers will pay, account for every possible business expense, or predict the actual failure rate of a print.',
  "Printer depreciation is modeled from the printer's cost, useful life, and print time entered in the calculator.", // corrected — see note above
  'Failure rate increases the expected cost of a successful print by accounting for failed attempts across the full production cost.',
  'Platform fees are applied according to the percentage you enter and may not represent every marketplace or payment-processing charge.',
  'Shipping, taxes, refunds, discounts, and other order-specific charges are not automatically included unless you incorporate them into the relevant cost inputs.',
  'Use the result as a pricing and margin-planning estimate. For a customer quote, review the full job scope and any costs that are not represented by the calculator inputs.'
];

const FORBIDDEN_STRINGS = [
  'What is ROI?',
  'What is 3D printing?',
  'Quick Answer',
  'AI Answer',
  'At a Glance',
  'residual value, useful life' // the uncorrected, factually-inaccurate original phrasing must not appear
];

// ---------- Source checks ----------
const htmlPath = path.join(ROOT, '3d-printing', 'service-pricing-calculator.html');
const html = fs.readFileSync(htmlPath, 'utf8');

check('STRUCTURE: page exists', fs.existsSync(htmlPath));
check('STRUCTURE: exactly one <h1>', (html.match(/<h1[ >]/g) || []).length === 1);
check('STRUCTURE: "How to Use This Calculator" appears exactly once', (html.match(/How to Use This Calculator/g) || []).length === 1);
check('STRUCTURE: "Limitations and Assumptions" appears exactly once', (html.match(/Limitations and Assumptions/g) || []).length === 1);

const calcIdx = html.indexOf('id="sp-form"');
const howToIdx = html.indexOf('How to Use This Calculator');
const limitsIdx = html.indexOf('Limitations and Assumptions');
const faqIdx = html.indexOf('Frequently asked questions');
check('STRUCTURE: "How to Use" appears after the calculator form', howToIdx > calcIdx);
check('STRUCTURE: "Limitations" appears after the calculator form', limitsIdx > calcIdx);
check('STRUCTURE: "How to Use" appears before the FAQ', howToIdx < faqIdx);
check('STRUCTURE: "Limitations" appears before the FAQ', limitsIdx < faqIdx);

// ---------- Content checks ----------
for (const s of REQUIRED_STRINGS) {
  check(`CONTENT: required text present — "${s.slice(0, 60)}${s.length > 60 ? '…' : ''}"`, html.includes(s));
}
for (const s of FORBIDDEN_STRINGS) {
  check(`CONTENT: forbidden text absent — "${s}"`, !html.includes(s));
}
check('CONTENT: no .aeo-answer-block / .ai-answer-block', !html.includes('aeo-answer-block') && !html.includes('ai-answer-block'));

// ---------- Preservation checks ----------
check('PRESERVATION: calculator form (#sp-form) present', html.includes('id="sp-form"'));
const preservedIds = [
  'sp-material-grams', 'sp-material-price', 'sp-print-time', 'sp-printed-parts',
  'sp-printer-price', 'sp-printer-life', 'sp-electricity-rate', 'sp-printer-power',
  'sp-setup-hours', 'sp-labor-rate', 'sp-overhead',
  'sp-platform-fee', 'sp-target-margin', 'sp-failure-rate',
  'sp-res-price', 'sp-res-min-price', 'sp-res-profit', 'sp-res-margin', 'sp-res-hourly', 'sp-res-price-per-hour', 'sp-res-price-per-part'
];
check('PRESERVATION: all existing calculator input/result IDs unchanged', preservedIds.every((id) => html.includes(`id="${id}"`)), JSON.stringify(preservedIds.filter((id) => !html.includes(`id="${id}"`))));

const existingFaqQuestions = [
  'What costs should I include when pricing a 3D print service job?',
  'How does a failed print affect the price I should charge?',
  'How should I account for labor and post-processing time?',
  'What is the difference between minimum viable price and recommended price?'
];
check('PRESERVATION: existing FAQ questions all still present', existingFaqQuestions.every((q) => html.includes(q)));

const ldBlocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
let webPageOk = false;
let faqOk = false;
let faqMatchesVisible = false;
for (const block of ldBlocks) {
  const parsed = JSON.parse(block);
  if (parsed['@type'] === 'WebPage') webPageOk = true;
  if (parsed['@type'] === 'FAQPage') {
    faqOk = true;
    const schemaQuestions = (parsed.mainEntity || []).map((q) => q.name);
    faqMatchesVisible = existingFaqQuestions.every((q) => schemaQuestions.includes(q)) && schemaQuestions.length === existingFaqQuestions.length;
  }
}
check('PRESERVATION: WebPage JSON-LD present unchanged', webPageOk);
check('PRESERVATION: FAQPage JSON-LD present and matches the 4 existing questions (unchanged)', faqOk && faqMatchesVisible);

check('PRESERVATION: Phase 8A sibling link to hub present', html.includes('href="/3d-printing/">3D Printing Calculators</a>'));
check('PRESERVATION: Phase 8A sibling link to Business ROI present', html.includes('href="/3d-printing/roi-calculator.html">3D Printing Business ROI Calculator</a>'));
check('PRESERVATION: Phase 8A sibling link to Print Farm ROI present', html.includes('href="/3d-printing/print-farm-roi-calculator.html">3D Print Farm ROI Calculator</a>'));

check('PRESERVATION: canonical unchanged', html.includes('<link rel="canonical" href="https://roicalculator.live/3d-printing/service-pricing-calculator.html">'));
check('PRESERVATION: title unchanged', html.includes('<title>3D Print Service Pricing Calculator | Calculate Your Print Price</title>'));
check('PRESERVATION: no ad slots', !html.includes('class="ad-slot'));
check('PRESERVATION: no AdSense script', !html.includes('adsbygoogle') && !html.includes('pagead2.googlesyndication'));
check('PRESERVATION: no inline style attributes introduced in new content', !/style="/.test(html.slice(howToIdx - 50, faqIdx)));

const browser = await chromium.launch({ channel: 'chrome' });
try {
  // ---------- Regression: calculator still computes correctly ----------
  {
    const page = await browser.newPage();
    const consoleErrors = [];
    page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    page.on('pageerror', (e) => consoleErrors.push(String(e)));
    await page.goto(cb(`${BASE}${PAGE_PATH}`), { waitUntil: 'load' });

    const h1Count = await page.$$eval('h1', (els) => els.length);
    check('REGRESSION: exactly one rendered <h1>', h1Count === 1, h1Count);

    await page.click('#sp-form button[type="submit"]');
    await page.waitForTimeout(200);
    const price = await page.textContent('#sp-res-price');
    const profit = await page.textContent('#sp-res-profit');
    const margin = await page.textContent('#sp-res-margin');
    check('REGRESSION: default recommended price = $55.51', price.trim() === '$55.51', price);
    check('REGRESSION: default expected profit = $16.65', profit.trim() === '$16.65', profit);
    check('REGRESSION: default profit margin = 30.0%', margin.trim() === '30.0%', margin);
    check('REGRESSION: no NaN/Infinity/undefined/null', ![price, profit, margin].some((v) => /NaN|Infinity|undefined|null/.test(v)));
    check('REGRESSION: no console errors', consoleErrors.length === 0, JSON.stringify(consoleErrors));
    await page.close();
  }

  // ---------- Responsive ----------
  {
    const viewports = [
      { name: '1440x900', width: 1440, height: 900 },
      { name: '1024x768', width: 1024, height: 768 },
      { name: '390x844', width: 390, height: 844 },
      { name: '320x700', width: 320, height: 700 }
    ];
    for (const vp of viewports) {
      const page = await browser.newPage();
      await page.setViewportSize(vp);
      await page.goto(cb(`${BASE}${PAGE_PATH}`), { waitUntil: 'load' });
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      check(`RESPONSIVE: no horizontal overflow @ ${vp.name}`, scrollWidth <= clientWidth, `scrollWidth=${scrollWidth} clientWidth=${clientWidth}`);
      const newSectionVisible = await page.locator('h2:has-text("How to Use This Calculator")').isVisible();
      check(`RESPONSIVE: "How to Use This Calculator" heading visible @ ${vp.name}`, newSectionVisible);
      await page.screenshot({ path: path.join(ROOT, 'scripts', 'qa', 'screenshots', `sp8b-${vp.name}.png`), fullPage: true });
      await page.close();
    }
  }
} finally {
  await browser.close();
}

const failed = results.filter((r) => !r.pass);
console.log('\n' + (failed.length ? failed.length + ' FAILED' : 'ALL PASSED') + ' out of ' + results.length + ' checks');
if (failed.length) process.exitCode = 1;
