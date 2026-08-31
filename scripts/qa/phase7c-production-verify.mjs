// Phase 7C — production verification for secondary pages + stylesheet delivery.
import { chromium } from 'playwright';
import { STYLESHEET_HREF } from '../site-config.mjs';

const ORIGIN = 'https://roicalculator.live';
const BUST = `?v=${Date.now()}`;

const PAGES = [
  { slug: 'glossary', path: '/glossary/', breadcrumb: false },
  { slug: 'about', path: '/about.html', breadcrumb: false },
  { slug: 'benchmarks', path: '/benchmarks/', breadcrumb: false },
  { slug: 'comparisons', path: '/comparisons/', breadcrumb: false },
  { slug: 'learn', path: '/learn/what-is-roi.html', breadcrumb: true },
  { slug: 'glossary-term', path: '/glossary/annualized-return.html', breadcrumb: true },
  { slug: 'saas', path: '/saas/', breadcrumb: false }
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
      const ads = [...document.querySelectorAll('.ad-slot')].filter((el) => el.getBoundingClientRect().height > 2);
      return {
        href,
        hasBreadcrumb: Boolean(document.querySelector('.breadcrumb')),
        hasBadge: Boolean(document.querySelector('.badge-privacy')),
        adCount: ads.length
      };
    }, STYLESHEET_HREF);
    const bad =
      m.href !== STYLESHEET_HREF ||
      m.hasBreadcrumb !== p.breadcrumb ||
      m.hasBadge ||
      m.adCount > 0;
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
