// Phase 7E — production verification (Quick Answer removal + result rhythm).
import { chromium } from 'playwright';
import { STYLESHEET_HREF } from '../site-config.mjs';

const ORIGIN = 'https://roicalculator.live';
const BUST = `?v=${Date.now()}`;

const PAGES = [
  { slug: 'home', path: '/' },
  { slug: 'saas', path: '/saas/' },
  { slug: 'factory', path: '/calculators/marketing-roi-calculator.html' }
];

const browser = await chromium.launch({ channel: 'chrome' });
let failed = false;

try {
  for (const p of PAGES) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(ORIGIN + p.path + BUST, { waitUntil: 'networkidle' });
    const m = await page.evaluate((expected) => {
      const href = document.querySelector('link[rel="stylesheet"]')?.getAttribute('href');
      const quick = /Quick Answer:/i.test(document.body.innerText || '');
      const hasProjectionBlock = Boolean(document.querySelector('.calc-projection-block'));
      return { href, quick, hasProjectionBlock };
    }, STYLESHEET_HREF);
    if (p.slug === 'home') {
      await page.locator('#roi-form button[type="submit"]').click();
      await page.waitForTimeout(400);
      const after = await page.evaluate(() => ({
        quick: /Quick Answer:/i.test(document.body.innerText || ''),
        gap: (() => {
          const interp = document.querySelector('.calc-result-explanation');
          const proj = document.querySelector('.calc-projection-heading');
          if (!interp || !proj) return 0;
          return proj.getBoundingClientRect().top - interp.getBoundingClientRect().bottom;
        })()
      }));
      if (after.quick || after.gap < 16) {
        failed = true;
        console.log(`FAIL prod ${p.slug}`, after);
      } else {
        console.log(`PASS prod ${p.slug}`, { gap: after.gap.toFixed(1), href: m.href });
      }
    } else if (m.quick || m.href !== STYLESHEET_HREF) {
      failed = true;
      console.log(`FAIL prod ${p.slug}`, m);
    } else {
      console.log(`PASS prod ${p.slug}`, m);
    }
    await page.close();
  }
} finally {
  await browser.close();
}

if (failed) process.exitCode = 1;
