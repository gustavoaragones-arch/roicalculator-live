// Phase 6 — real-browser regression for the 3 SaaS child calculators
// whose boilerplate was removed this phase (no math/JS touched, verifying
// nothing broke).
import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:8791';

const targets = [
  { name: 'CAC vs LTV ROI', url: `${BASE}/roi-calculator/saas/cac-ltv-roi.html`, formId: 'cac-ltv-form', dominantId: 'roi', panelId: 'cac-ltv-results' },
  { name: 'Subscription Growth ROI', url: `${BASE}/roi-calculator/saas/subscription-growth-roi.html`, formId: 'sub-form', dominantId: 'sub-roi', panelId: 'sub-results' },
  { name: 'Time-to-Value ROI', url: `${BASE}/roi-calculator/saas/time-to-value-roi.html`, formId: 'ttv-form', dominantId: 'ttv-roi', panelId: 'ttv-results' }
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

    const panelHidden = await page.$eval(`#${t.panelId}`, (el) => el.hidden ?? false);
    const dominant = await page.$eval(`#${t.dominantId}`, (el) => el.textContent.trim());
    const hasNaN = /NaN/i.test(dominant);
    const hasInfinity = /Infinity/i.test(dominant);
    const isEmpty = dominant === '' || dominant === '—';

    const pass = formValid && !isEmpty && !hasNaN && !hasInfinity && consoleErrors.length === 0;
    if (!pass) allPass = false;

    console.log(`--- ${t.name} ---`);
    console.log('untouched defaults valid:', formValid);
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
