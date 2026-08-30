// Phase 4A fix pass — proves the stepMismatch defects are gone: each
// calculator must produce a visible, valid dominant result from a real
// click using ONLY its own untouched page defaults.
import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:8791';

const targets = [
  {
    name: 'SaaS',
    url: `${BASE}/saas/`,
    formId: 'saas-cluster-form',
    dominantId: 'saas-res-roi',
    panelId: 'saas-cluster-results'
  },
  {
    name: 'Real Estate',
    url: `${BASE}/real-estate/`,
    formId: 'rp-roi-form',
    dominantId: 'rp-result-roi',
    panelId: 'rp-results-panel'
  },
  {
    name: 'Solar',
    url: `${BASE}/solar/roi-calculator.html`,
    formId: 'sp-roi-form',
    dominantId: 'sp-result-payback',
    panelId: 'sp-results-panel'
  },
  {
    name: 'Cap Rate',
    url: `${BASE}/real-estate/cap-rate-calculator.html`,
    formId: 're-cap-form',
    dominantId: 're-cap-result',
    panelId: 're-cap-panel'
  },
  {
    name: 'Cash-on-Cash',
    url: `${BASE}/real-estate/cash-on-cash-calculator.html`,
    formId: 're-coc-form',
    dominantId: 're-coc-result',
    panelId: 're-coc-panel'
  }
];

const browser = await chromium.launch({ channel: 'chrome' });
let allPass = true;
try {
  for (const t of targets) {
    const page = await browser.newPage();
    page.on('pageerror', (err) => console.log(`[${t.name} pageerror]`, err.message));
    await page.goto(t.url, { waitUntil: 'load' });

    const formValid = await page.evaluate((id) => document.getElementById(id).checkValidity(), t.formId);
    await page.locator(`#${t.formId} button[type="submit"]`).click();
    await page.waitForTimeout(200);

    const panelHidden = await page.$eval(`#${t.panelId}`, (el) => el.hidden);
    const dominant = await page.$eval(`#${t.dominantId}`, (el) => el.textContent.trim());
    const hasNaN = /NaN/i.test(dominant);
    const hasInfinity = /Infinity/i.test(dominant);
    const isEmpty = dominant === '' || dominant === '—';

    const pass = formValid && !panelHidden && !isEmpty && !hasNaN && !hasInfinity;
    if (!pass) allPass = false;

    console.log(`--- ${t.name} ---`);
    console.log('untouched defaults valid (checkValidity):', formValid);
    console.log('panel visible after click:', !panelHidden);
    console.log('dominant result:', JSON.stringify(dominant));
    console.log('NaN:', hasNaN, '| Infinity:', hasInfinity, '| empty/placeholder:', isEmpty);
    console.log('RESULT:', pass ? 'PASS' : 'FAIL');
    console.log();

    await page.close();
  }
} finally {
  await browser.close();
}

console.log(allPass ? 'ALL PASS' : 'SOME FAILED');
process.exitCode = allPass ? 0 : 1;
