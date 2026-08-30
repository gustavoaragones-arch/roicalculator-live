// Phase 4A-SETUP-02 — real rendered-browser smoke test of the three
// canonical reference pages, using system Chrome via channel: 'chrome'.
// QA tooling only; not part of the production site.
import { chromium } from 'playwright';

const pages = [
  { name: 'SaaS', url: 'https://roicalculator.live/saas/', formSelector: '#saas-cluster-form' },
  { name: 'Real Estate', url: 'https://roicalculator.live/real-estate/', formSelector: '#rp-roi-form' },
  { name: 'Solar', url: 'https://roicalculator.live/solar/roi-calculator.html', formSelector: '#sp-roi-form' }
];

const browser = await chromium.launch({ channel: 'chrome' });
try {
  for (const p of pages) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });

    const response = await page.goto(p.url, { waitUntil: 'load' });
    const status = response ? response.status() : null;
    const title = await page.title();
    const h1 = await page.locator('h1').first().textContent().catch(() => null);
    const formCount = await page.locator(p.formSelector).count();
    const jsExecuted = await page.evaluate(() => typeof window !== 'undefined' && document.readyState === 'complete');

    const shotPath = `scripts/qa/screenshots/${p.name.toLowerCase().replace(/\s+/g, '-')}-smoke.png`;
    await page.screenshot({ path: shotPath, fullPage: false });

    console.log(`--- ${p.name} ---`);
    console.log('url:', p.url);
    console.log('status:', status);
    console.log('title:', JSON.stringify(title));
    console.log('h1:', JSON.stringify(h1 ? h1.trim() : h1));
    console.log('form present:', formCount > 0, `(selector ${p.formSelector}, count=${formCount})`);
    console.log('js executed (readyState complete):', jsExecuted);
    console.log('screenshot:', shotPath);
    console.log();

    await page.close();
  }
} finally {
  await browser.close();
}
