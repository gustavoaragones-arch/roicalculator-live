// Phase 7D — production verification for factory calculators + reference regression.
import { chromium } from 'playwright';
import { STYLESHEET_HREF } from '../site-config.mjs';

const ORIGIN = 'https://roicalculator.live';
const BUST = `?v=${Date.now()}`;

const FACTORY_SAMPLES = [
  { slug: 'marketing-roi-calculator', label: 'Marketing (factory)' },
  { slug: 'equipment-roi-calculator', label: 'Operations (factory)' },
  { slug: 'simple-roi-calculator', label: 'General (factory)' }
];

const REFERENCE = [
  { slug: 'home', path: '/' },
  { slug: 'saas', path: '/saas/' },
  { slug: 'real-estate', path: '/real-estate/' },
  { slug: 'solar', path: '/solar/roi-calculator.html' },
  { slug: 'marketing-hub', path: '/marketing/' }
];

const browser = await chromium.launch({ channel: 'chrome' });
let failed = false;

try {
  for (const p of FACTORY_SAMPLES) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    const url = `${ORIGIN}/calculators/${p.slug}.html${BUST}`;
    await page.goto(url, { waitUntil: 'networkidle' });
    const m = await page.evaluate(() => ({
      pageFactory: document.body.classList.contains('page-factory'),
      hasHero: Boolean(document.querySelector('.hero')),
      hasQuick: Boolean(document.querySelector('.ai-answer-block')),
      hasDominant: Boolean(document.querySelector('.result-dominant')),
      href: document.querySelector('link[rel="stylesheet"]')?.getAttribute('href')
    }));
    await page.locator('#factory-calc-form button[type="submit"]').click();
    await page.waitForTimeout(300);
    const result = await page.$eval('#factory-out-roi', (el) => el.textContent.trim());
    const bad =
      !m.pageFactory ||
      !m.hasHero ||
      m.hasQuick ||
      !m.hasDominant ||
      m.href !== STYLESHEET_HREF ||
      !result ||
      result === '—' ||
      /NaN|Infinity/i.test(result);
    if (bad) {
      failed = true;
      console.log(`FAIL prod factory ${p.slug}`, { ...m, result });
    } else {
      console.log(`PASS prod factory ${p.slug}`, { result });
    }
    await page.close();
  }

  for (const p of REFERENCE) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(ORIGIN + p.path + BUST, { waitUntil: 'networkidle' });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    if (overflow) {
      failed = true;
      console.log(`FAIL prod ref overflow ${p.slug}`);
    } else {
      console.log(`PASS prod ref ${p.slug}`);
    }
    await page.close();
  }
} finally {
  await browser.close();
}

if (failed) process.exitCode = 1;
