// Phase 7B-02 — reference-page verification + calculator interactions.
import { chromium } from 'playwright';

const BASE = process.env.QA_BASE || 'http://127.0.0.1:8791';

const PAGES = [
  { slug: 'home', url: `${BASE}/`, expectBreadcrumb: false, calcBtn: '#roi-form button[type="submit"]', result: '#result-roi', input: '#final-value', inputVal: '18000' },
  { slug: 'saas', url: `${BASE}/saas/`, expectBreadcrumb: false, calcBtn: '#saas-cluster-form button[type="submit"]', result: '#saas-res-roi', input: '#saas-monthly', inputVal: '3000' },
  { slug: 'real-estate', url: `${BASE}/real-estate/`, expectBreadcrumb: false, calcBtn: '#rp-roi-form button[type="submit"]', result: '#rp-result-roi', input: '#rp-rent', inputVal: '3000' },
  { slug: 'solar', url: `${BASE}/solar/roi-calculator.html`, expectBreadcrumb: false, calcBtn: '#sp-roi-form button[type="submit"]', result: '#sp-result-payback', input: '#sp-cost', inputVal: '30000' },
  {
    slug: 'marketing-hub',
    url: `${BASE}/marketing/`,
    expectBreadcrumb: false,
    skipCalc: true
  },
  {
    slug: 'marketing-calc',
    url: `${BASE}/calculators/marketing-roi-calculator.html`,
    expectBreadcrumb: true,
    calcBtn: '#factory-calc-form button[type="submit"]',
    result: '#factory-out-roi',
    input: '#factory-inp-adSpend',
    inputVal: '12000'
  }
];

const VIEWPORTS = [
  { name: '1440x900', width: 1440, height: 900 },
  { name: '390x844', width: 390, height: 844 },
  { name: '320x700', width: 320, height: 700 }
];

const browser = await chromium.launch({ channel: 'chrome' });
let failed = false;

try {
  for (const p of PAGES) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));

    await page.goto(p.url, { waitUntil: 'load' });
    const layout = await page.evaluate(() => {
      const hero = document.querySelector('.hero');
      const calc =
        document.querySelector('.calculator-section-inner') ||
        document.querySelector('article.content-section');
      const heroR = hero ? hero.getBoundingClientRect() : null;
      const calcR = calc ? calc.getBoundingClientRect() : null;
      const ads = [...document.querySelectorAll('.ad-slot')].filter((el) => {
        const r = el.getBoundingClientRect();
        return r.height > 2;
      });
      return {
        hasBreadcrumb: Boolean(document.querySelector('.breadcrumb')),
        hasBadge: Boolean(document.querySelector('.badge-privacy')),
        hasStrip: Boolean(document.querySelector('.calculator-strip')),
        hasSticky: Boolean(document.querySelector('.sticky-calc-bar')),
        adCount: ads.length,
        hasDominance: Boolean(document.querySelector('.ai-answer-dominance')),
        heroCalcDelta: heroR && calcR ? Math.abs(heroR.left - calcR.left) : null,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
      };
    });

  if (layout.hasBreadcrumb !== p.expectBreadcrumb) {
    console.log(`FAIL ${p.slug}: breadcrumb expected=${p.expectBreadcrumb} actual=${layout.hasBreadcrumb}`);
    failed = true;
  }
    if (layout.hasBadge || layout.hasStrip || layout.hasSticky || layout.adCount) {
      console.log(`FAIL ${p.slug} chrome:`, layout);
      failed = true;
    }
    if (layout.hasDominance) {
      console.log(`FAIL ${p.slug}: ai-answer-dominance present`);
      failed = true;
    }
    if (layout.heroCalcDelta != null && layout.heroCalcDelta > 1) {
      console.log(`FAIL ${p.slug}: hero/calc delta ${layout.heroCalcDelta}px`);
      failed = true;
    }
    if (layout.overflow) {
      console.log(`FAIL ${p.slug}: horizontal overflow`);
      failed = true;
    }

    if (!p.skipCalc) {
      await page.fill(p.input, p.inputVal);
      await page.click(p.calcBtn);
      await page.waitForTimeout(400);
      const calc = await page.evaluate(
        ({ resultSel }) => {
          const el = document.querySelector(resultSel);
          const txt = el ? el.textContent.trim() : '';
          return {
            text: txt,
            bad: !txt || txt === '—' || /NaN|Infinity/i.test(txt)
          };
        },
        { resultSel: p.result }
      );
      if (calc.bad) {
        console.log(`FAIL ${p.slug} calc: "${calc.text}"`);
        failed = true;
      }
      if (errors.length) {
        console.log(`FAIL ${p.slug} console:`, errors);
        failed = true;
      }
      console.log(`PASS ${p.slug}: roi=${calc.text} delta=${layout.heroCalcDelta}px ads=${layout.adCount}`);
    } else {
      if (errors.length) {
        console.log(`FAIL ${p.slug} console:`, errors);
        failed = true;
      }
      console.log(`PASS ${p.slug}: hub delta=${layout.heroCalcDelta}px ads=${layout.adCount}`);
    }
    await page.close();
  }

  for (const vp of VIEWPORTS) {
    for (const slug of ['home', 'saas', 'real-estate', 'solar', 'marketing']) {
      const url =
        slug === 'home'
          ? `${BASE}/`
          : slug === 'marketing'
            ? `${BASE}/marketing/`
            : slug === 'solar'
              ? `${BASE}/solar/roi-calculator.html`
              : `${BASE}/${slug}/`;
      const page = await browser.newPage();
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(url, { waitUntil: 'load' });
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      if (overflow) {
        console.log(`FAIL overflow ${slug} @ ${vp.name}`);
        failed = true;
      }
      await page.screenshot({
        path: `scripts/qa/screenshots/phase7b02-after-${slug}-${vp.name}.png`,
        fullPage: true
      });
      await page.close();
    }
  }

  // Mobile nav + calculators disclosure on marketing hub
  const navPage = await browser.newPage();
  await navPage.setViewportSize({ width: 390, height: 844 });
  await navPage.goto(`${BASE}/marketing/`, { waitUntil: 'load' });
  await navPage.click('.nav-mobile-toggle');
  await navPage.waitForTimeout(200);
  const navOpen = await navPage.evaluate(() =>
    document.querySelector('.nav-mobile-toggle')?.getAttribute('aria-expanded') === 'true'
  );
  if (!navOpen) {
    console.log('FAIL marketing mobile nav toggle');
    failed = true;
  }
  await navPage.close();
} finally {
  await browser.close();
}

if (failed) process.exitCode = 1;
