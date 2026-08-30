// Re-run of calculator interaction, using values that satisfy each form's
// native HTML5 constraints (the discovered stepMismatch defect on
// rp-purchase/sp-cost is worked around here ONLY to prove the calculation
// path itself functions correctly once validation passes — this does not
// fix or excuse the underlying defect, which is reported separately).
import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:8791';

const browser = await chromium.launch({ channel: 'chrome' });
try {
  // SaaS (already confirmed working with real defaults)
  {
    const page = await browser.newPage();
    await page.goto(`${BASE}/saas/`, { waitUntil: 'load' });
    const roiBefore = await page.locator('#saas-res-roi').textContent();
    await page.locator('#saas-monthly').fill('4000');
    await page.locator('#saas-cluster-form button[type="submit"]').click();
    const roiAfter = await page.locator('#saas-res-roi').textContent();
    console.log('SaaS: ROI before/after real click:', roiBefore, '->', roiAfter, '| changed:', roiBefore !== roiAfter);
    await page.close();
  }

  // Real Estate — use a valid purchase price (350001, one dollar above the
  // broken default) to prove the calculation engine itself is correct.
  {
    const page = await browser.newPage();
    await page.goto(`${BASE}/real-estate/`, { waitUntil: 'load' });
    await page.locator('#rp-purchase').fill('350001');
    await page.locator('#rp-down').fill('60000');
    const formValid = await page.evaluate(() => document.getElementById('rp-roi-form').checkValidity());
    await page.locator('#rp-roi-form button[type="submit"]').click();
    await page.waitForTimeout(200);
    const roi = await page.locator('#rp-result-roi').textContent();
    const interpretation = await page.locator('#rp-result-interpretation').textContent();
    console.log('Real Estate: form valid after fix-value:', formValid, '| ROI:', roi);
    console.log('Real Estate interpretation:', interpretation);
    await page.close();
  }

  // Solar — use a valid system cost (28001) for the same reason.
  {
    const page = await browser.newPage();
    await page.goto(`${BASE}/solar/roi-calculator.html`, { waitUntil: 'load' });
    await page.locator('#sp-cost').fill('28001');
    const formValidBefore = await page.evaluate(() => document.getElementById('sp-roi-form').checkValidity());
    await page.locator('#sp-roi-form button[type="submit"]').click();
    await page.waitForTimeout(200);
    const payback = await page.locator('#sp-result-payback').textContent();
    const interpretation = await page.locator('#sp-result-interpretation').textContent();
    console.log('Solar: form valid after fix-value:', formValidBefore, '| payback:', payback);
    console.log('Solar interpretation:', interpretation);

    // Now change tax credit + rate and recalc to confirm dominant result changes
    await page.locator('#sp-credit').fill('0');
    await page.locator('#sp-roi-form button[type="submit"]').click();
    await page.waitForTimeout(200);
    const paybackAfterChange = await page.locator('#sp-result-payback').textContent();
    console.log('Solar: payback after removing tax credit:', paybackAfterChange, '| changed from prior:', payback !== paybackAfterChange);
    await page.close();
  }
} finally {
  await browser.close();
}
