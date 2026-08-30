// Phase 7B-02 Part 17 — production verification with cache-bust.
import { chromium } from 'playwright';

const ORIGIN = 'https://roicalculator.live';
const BUST = `?v=${Date.now()}`;
const PAGES = [
  { slug: 'home', path: '/' },
  { slug: 'saas', path: '/saas/' },
  { slug: 'real-estate', path: '/real-estate/' },
  { slug: 'solar', path: '/solar/roi-calculator.html' },
  { slug: 'marketing', path: '/marketing/' }
];

const browser = await chromium.launch({ channel: 'chrome' });
let failed = false;

try {
  for (const p of PAGES) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(ORIGIN + p.path + BUST, { waitUntil: 'networkidle' });
    const m = await page.evaluate(() => {
      const hero = document.querySelector('.hero');
      const calc =
        document.querySelector('.calculator-section-inner') ||
        document.querySelector('article.content-section');
      const heroR = hero ? hero.getBoundingClientRect() : null;
      const calcR = calc ? calc.getBoundingClientRect() : null;
      const ads = [...document.querySelectorAll('.ad-slot')].filter((el) => el.getBoundingClientRect().height > 2);
      return {
        hasBreadcrumb: Boolean(document.querySelector('.breadcrumb')),
        hasBadge: Boolean(document.querySelector('.badge-privacy')),
        adCount: ads.length,
        heroCalcDelta: heroR && calcR ? Math.abs(heroR.left - calcR.left) : null,
        hasDominance: Boolean(document.querySelector('.ai-answer-dominance'))
      };
    });
    const bad =
      m.hasBadge ||
      m.adCount > 0 ||
      m.hasDominance ||
      (p.slug !== 'home' && m.hasBreadcrumb) ||
      (p.slug === 'home' && m.hasBreadcrumb) ||
      (m.heroCalcDelta != null && m.heroCalcDelta > 1);
    if (bad) {
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
