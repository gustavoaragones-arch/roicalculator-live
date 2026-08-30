// Phase 5 — default-click validation for every retained/canonical Marketing
// calculator, using ONLY untouched page defaults (real browser click).
import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:8791';

const targets = [
  {
    name: 'Marketing ROI (flagship, factory)',
    url: `${BASE}/calculators/marketing-roi-calculator.html`,
    formId: 'factory-calc-form',
    dominantId: 'factory-out-roi',
    panelId: 'factory-results-panel'
  },
  {
    name: 'Email Marketing ROI (factory)',
    url: `${BASE}/calculators/email-marketing-roi-calculator.html`,
    formId: 'factory-calc-form',
    dominantId: 'factory-out-roi',
    panelId: 'factory-results-panel'
  },
  {
    name: 'Influencer ROI (factory)',
    url: `${BASE}/calculators/influencer-roi-calculator.html`,
    formId: 'factory-calc-form',
    dominantId: 'factory-out-roi',
    panelId: 'factory-results-panel'
  },
  {
    name: 'Content Marketing ROI (factory)',
    url: `${BASE}/calculators/content-marketing-roi-calculator.html`,
    formId: 'factory-calc-form',
    dominantId: 'factory-out-roi',
    panelId: 'factory-results-panel'
  },
  {
    name: 'ROAS Calculator (hand-authored, retained)',
    url: `${BASE}/roi-calculator/marketing/roas-calculator.html`,
    formId: 'roas-form',
    dominantId: 'roas-ratio',
    panelId: 'roas-results'
  },
  {
    name: 'Lead Generation ROI (hand-authored, retained)',
    url: `${BASE}/roi-calculator/marketing/lead-generation-roi.html`,
    formId: 'lead-form',
    dominantId: 'lead-roi',
    panelId: 'lead-results'
  }
];

const browser = await chromium.launch({ channel: 'chrome' });
let allPass = true;
try {
  for (const t of targets) {
    const page = await browser.newPage();
    const consoleErrors = [];
    page.on('pageerror', (err) => consoleErrors.push(err.message));
    await page.goto(t.url, { waitUntil: 'load' });

    const formValid = await page.evaluate((id) => document.getElementById(id).checkValidity(), t.formId);
    await page.locator(`#${t.formId} button[type="submit"]`).click();
    await page.waitForTimeout(200);

    const panelHidden = await page.$eval(`#${t.panelId}`, (el) => el.hidden);
    const dominant = await page.$eval(`#${t.dominantId}`, (el) => el.textContent.trim());
    const hasNaN = /NaN/i.test(dominant);
    const hasInfinity = /Infinity/i.test(dominant);
    const isEmpty = dominant === '' || dominant === '—';

    const pass = formValid && !panelHidden && !isEmpty && !hasNaN && !hasInfinity && consoleErrors.length === 0;
    if (!pass) allPass = false;

    console.log(`--- ${t.name} ---`);
    console.log('untouched defaults valid:', formValid);
    console.log('panel visible after click:', !panelHidden);
    console.log('dominant result:', JSON.stringify(dominant));
    console.log('console errors:', consoleErrors);
    console.log('RESULT:', pass ? 'PASS' : 'FAIL');
    console.log();

    await page.close();
  }
} finally {
  await browser.close();
}

console.log(allPass ? 'ALL PASS' : 'SOME FAILED');
process.exitCode = allPass ? 0 : 1;
