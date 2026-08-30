// Phase 7 — confirm the remaining shared-CSS pages are visually unaffected
// by the new body.ref-page-scoped rules (none of these carry that class).
import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:8791';
const pages = [
  { name: 'index', url: `${BASE}/` },
  { name: 'hvac', url: `${BASE}/hvac/roi-calculator.html` },
  { name: 'hr', url: `${BASE}/hr/roi-calculator.html` }
];

const browser = await chromium.launch({ channel: 'chrome' });
try {
  for (const p of pages) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(p.url, { waitUntil: 'load' });
    const hasRefPage = await page.evaluate(() => document.body.classList.contains('ref-page'));
    const metrics = await page.evaluate(() => {
      const hero = document.querySelector('.hero');
      const card = document.querySelector('.calculator-card');
      const cs = card ? getComputedStyle(card) : null;
      return {
        heroPaddingTop: hero ? getComputedStyle(hero).paddingTop : null,
        cardBackdropFilter: cs ? cs.backdropFilter : null,
        cardBoxShadow: cs ? cs.boxShadow : null,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth
      };
    });
    console.log(`${p.name}: hasRefPageClass=${hasRefPage} heroPaddingTop=${metrics.heroPaddingTop} cardBackdropFilter=${metrics.cardBackdropFilter} overflow=${metrics.scrollWidth > metrics.clientWidth}`);
    await page.screenshot({ path: `scripts/qa/screenshots/phase7-safety-${p.name}.png`, fullPage: true });
    await page.close();
  }
} finally {
  await browser.close();
}
