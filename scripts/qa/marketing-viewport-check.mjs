import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:8791';

const pages = [
  { name: 'marketing-hub', url: `${BASE}/marketing/` },
  { name: 'marketing-roi-calc', url: `${BASE}/calculators/marketing-roi-calculator.html` },
  { name: 'email-marketing-roi-calc', url: `${BASE}/calculators/email-marketing-roi-calculator.html` },
  { name: 'influencer-roi-calc', url: `${BASE}/calculators/influencer-roi-calculator.html` },
  { name: 'content-marketing-roi-calc', url: `${BASE}/calculators/content-marketing-roi-calculator.html` },
  { name: 'roas-calculator', url: `${BASE}/roi-calculator/marketing/roas-calculator.html` },
  { name: 'lead-generation-roi', url: `${BASE}/roi-calculator/marketing/lead-generation-roi.html` }
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
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(p.url, { waitUntil: 'load' });

      const m = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth
      }));
      const overflow = m.scrollWidth > m.clientWidth;
      if (overflow) anyOverflow = true;

      const shotPath = `scripts/qa/screenshots/${p.name}-${vp.name}.png`;
      await page.screenshot({ path: shotPath, fullPage: true });

      console.log(`${p.name} @ ${vp.name}: scrollWidth=${m.scrollWidth} clientWidth=${m.clientWidth} overflow=${overflow}`);
      await page.close();
    }
  }
} finally {
  await browser.close();
}
console.log(anyOverflow ? 'OVERFLOW DETECTED' : 'NO OVERFLOW ANYWHERE');
process.exitCode = anyOverflow ? 1 : 0;
