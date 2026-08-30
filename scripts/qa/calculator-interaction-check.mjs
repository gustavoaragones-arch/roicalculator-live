// Phase 4A-SETUP-02 — real calculator interaction test against the LOCAL
// repository (not production — production /saas/ was found to be stale,
// see report). Uses system Chrome via channel: 'chrome'. QA tooling only.
//
// KNOWN DEFECT (found by this script, not yet fixed as of Phase 4A-SETUP-02):
// this test deliberately uses each form's untouched page defaults, because
// that is what a real first-time visitor experiences. As of this writing,
// clicking Calculate with real-estate's and solar's own default inputs does
// NOT produce a visible result: #rp-purchase (min=1, step=1000, value=350000)
// and #sp-cost (min=1, step=500, value=28000) both fail native HTML5
// stepMismatch validation on their own factory-default value, which silently
// blocks the browser's native form submission before any calculator JS runs.
// See calculator-interaction-valid-input-check.mjs for proof the underlying
// calculation engines are otherwise correct once a valid value is entered.
import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:8791';

const browser = await chromium.launch({ channel: 'chrome' });
try {
  // ---------- SaaS ----------
  {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE}/saas/`, { waitUntil: 'load' });

    const resultsHiddenBefore = await page.locator('#saas-cluster-results').isHidden();
    const roiBefore = await page.locator('#saas-res-roi').textContent();

    await page.locator('#saas-monthly').fill('4000');
    await page.locator('#saas-years').fill('5');
    await page.locator('#saas-cluster-form button[type="submit"]').click();

    const resultsHiddenAfter = await page.locator('#saas-cluster-results').isHidden();
    const roiAfter = await page.locator('#saas-res-roi').textContent();
    const interpretation = await page.locator('#saas-res-interpretation').textContent();

    console.log('--- SaaS interaction ---');
    console.log('results hidden before calculate:', resultsHiddenBefore);
    console.log('ROI text before:', JSON.stringify(roiBefore));
    console.log('results hidden after calculate:', resultsHiddenAfter);
    console.log('ROI text after:', JSON.stringify(roiAfter));
    console.log('interpretation:', JSON.stringify(interpretation));
    console.log('ROI changed:', roiBefore !== roiAfter);
    await page.screenshot({ path: 'scripts/qa/screenshots/saas-after-calculate.png' });
    await page.close();
  }

  // ---------- Real Estate ----------
  {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE}/real-estate/`, { waitUntil: 'load' });

    const roiBefore = await page.locator('#rp-result-roi').textContent();

    await page.locator('#rp-purchase').fill('300000');
    await page.locator('#rp-down').fill('60000');
    await page.locator('#rp-roi-form button[type="submit"]').click();

    const panelHidden = await page.locator('#rp-results-panel').isHidden();
    const roiAfter = await page.locator('#rp-result-roi').textContent();
    const interpretation = await page.locator('#rp-result-interpretation').textContent();

    console.log('--- Real Estate interaction ---');
    console.log('ROI text before:', JSON.stringify(roiBefore));
    console.log('results panel hidden after calculate:', panelHidden);
    console.log('ROI text after:', JSON.stringify(roiAfter));
    console.log('interpretation:', JSON.stringify(interpretation));
    console.log('dominant result visible & non-empty:', !panelHidden && roiAfter && roiAfter.trim() !== '—');
    await page.screenshot({ path: 'scripts/qa/screenshots/real-estate-after-calculate.png' });
    await page.close();
  }

  // ---------- Solar ----------
  {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE}/solar/roi-calculator.html`, { waitUntil: 'load' });

    const paybackBefore = await page.locator('#sp-result-payback').textContent();

    await page.locator('#sp-credit').fill('0');
    await page.locator('#sp-rate').fill('0.22');
    await page.locator('#sp-roi-form button[type="submit"]').click();

    const panelHidden = await page.locator('#sp-results-panel').isHidden();
    const paybackAfter = await page.locator('#sp-result-payback').textContent();
    const roi20After = await page.locator('#sp-result-roi-20').textContent();
    const interpretation = await page.locator('#sp-result-interpretation').textContent();

    console.log('--- Solar interaction ---');
    console.log('payback before:', JSON.stringify(paybackBefore));
    console.log('results panel hidden after calculate:', panelHidden);
    console.log('payback after (tax credit 30->0, rate 0.16->0.22):', JSON.stringify(paybackAfter));
    console.log('ROI 20yr after:', JSON.stringify(roi20After));
    console.log('interpretation:', JSON.stringify(interpretation));
    console.log('payback changed:', paybackBefore !== paybackAfter);
    await page.screenshot({ path: 'scripts/qa/screenshots/solar-after-calculate.png' });
    await page.close();
  }
} finally {
  await browser.close();
}
