import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:8791';

const pages = [
  { name: '404', url: `${BASE}/404.html` },
  { name: 'privacy', url: `${BASE}/privacy.html` },
  { name: 'homepage', url: `${BASE}/` },
  { name: 'methodology', url: `${BASE}/methodology/` },
  { name: 'site-structure', url: `${BASE}/site-structure.html` },
  { name: 'sitemap', url: `${BASE}/sitemap.html` },
  { name: 'saas-cac-ltv', url: `${BASE}/roi-calculator/saas/cac-ltv-roi.html` },
  { name: 'saas-sub-growth', url: `${BASE}/roi-calculator/saas/subscription-growth-roi.html` },
  { name: 'saas-ttv', url: `${BASE}/roi-calculator/saas/time-to-value-roi.html` },
  { name: 'benchmarks-avg-industry', url: `${BASE}/benchmarks/average-roi-by-industry.html` },
  { name: 'benchmarks-index', url: `${BASE}/benchmarks/index.html` },
  { name: 'comparisons-roi-vs-irr', url: `${BASE}/comparisons/roi-vs-irr.html` },
  { name: 'learn-roi-formula', url: `${BASE}/learn/roi-formula.html` },
  { name: 'glossary-cac', url: `${BASE}/glossary/cac.html` },
  { name: 'glossary-index', url: `${BASE}/glossary/` }
];

const viewports = [
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1024x768', width: 1024, height: 768 },
  { name: '390x844', width: 390, height: 844 },
  { name: '320x700', width: 320, height: 700 }
];

const browser = await chromium.launch({ channel: 'chrome' });
let anyOverflow = false;
try {
  for (const p of pages) {
    for (const vp of viewports) {
      const page = await browser.newPage();
      const errs = [];
      page.on('pageerror', (e) => errs.push(e.message));
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const resp = await page.goto(p.url, { waitUntil: 'load' });
      const m = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth
      }));
      const overflow = m.scrollWidth > m.clientWidth;
      if (overflow) anyOverflow = true;
      console.log(`${p.name} @ ${vp.name}: status=${resp.status()} scrollWidth=${m.scrollWidth} clientWidth=${m.clientWidth} overflow=${overflow} errors=${errs.length}`);
      await page.close();
    }
  }
} finally {
  await browser.close();
}
console.log(anyOverflow ? 'OVERFLOW DETECTED' : 'NO OVERFLOW ANYWHERE');
process.exitCode = anyOverflow ? 1 : 0;
