import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:8791';

const pages = [
  { name: 'saas', url: `${BASE}/saas/` },
  { name: 'real-estate', url: `${BASE}/real-estate/` },
  { name: 'solar', url: `${BASE}/solar/roi-calculator.html` }
];

const viewports = [
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1024x768', width: 1024, height: 768 },
  { name: '390x844', width: 390, height: 844 },
  { name: '320x700', width: 320, height: 700 }
];

const browser = await chromium.launch({ channel: 'chrome' });
try {
  for (const p of pages) {
    for (const vp of viewports) {
      const page = await browser.newPage();
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(p.url, { waitUntil: 'load' });

      const measurements = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth
      }));
      const overflow = measurements.scrollWidth > measurements.clientWidth;

      const shotPath = `scripts/qa/screenshots/${p.name}-${vp.name}.png`;
      await page.screenshot({ path: shotPath, fullPage: true });

      console.log(
        `${p.name} @ ${vp.name}: scrollWidth=${measurements.scrollWidth} clientWidth=${measurements.clientWidth} overflow=${overflow} screenshot=${shotPath}`
      );

      await page.close();
    }
  }
} finally {
  await browser.close();
}
