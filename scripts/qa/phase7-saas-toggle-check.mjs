// Phase 7 — verify the [hidden] / .form-row fix: default state and revenue-mode toggle.
import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:8791';

const browser = await chromium.launch({ channel: 'chrome' });
try {
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE}/saas/`, { waitUntil: 'load' });

  const consoleErrors = [];
  page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  page.on('pageerror', (err) => consoleErrors.push(String(err)));

  const initial = await page.evaluate(() => ({
    timeFieldsVisible: getComputedStyle(document.getElementById('saas-time-fields')).display !== 'none',
    revenueFieldVisible: getComputedStyle(document.getElementById('saas-revenue-field')).display !== 'none'
  }));
  console.log('Default state:', JSON.stringify(initial));

  await page.check('#saas-revenue-mode');
  await page.waitForTimeout(100);
  const afterToggleOn = await page.evaluate(() => ({
    timeFieldsVisible: getComputedStyle(document.getElementById('saas-time-fields')).display !== 'none',
    revenueFieldVisible: getComputedStyle(document.getElementById('saas-revenue-field')).display !== 'none'
  }));
  console.log('After enabling revenue mode:', JSON.stringify(afterToggleOn));

  await page.uncheck('#saas-revenue-mode');
  await page.waitForTimeout(100);
  const afterToggleOff = await page.evaluate(() => ({
    timeFieldsVisible: getComputedStyle(document.getElementById('saas-time-fields')).display !== 'none',
    revenueFieldVisible: getComputedStyle(document.getElementById('saas-revenue-field')).display !== 'none'
  }));
  console.log('After disabling revenue mode:', JSON.stringify(afterToggleOff));

  await page.click('#saas-cluster-form button[type="submit"]');
  await page.waitForTimeout(200);
  const roi = await page.textContent('#saas-res-roi');
  console.log('ROI after calculate with defaults:', roi);

  console.log('Console errors:', consoleErrors.length ? consoleErrors : 'none');

  await page.close();
} finally {
  await browser.close();
}
