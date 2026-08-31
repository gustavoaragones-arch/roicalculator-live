// Phase 7C — secondary page visual consolidation QA.
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { STYLESHEET_HREF } from '../site-config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.QA_BASE || 'http://127.0.0.1:8791';
const OUT = path.join(__dirname, 'screenshots');

const PAGES = [
  { slug: 'home', url: `${BASE}/`, breadcrumb: false },
  { slug: 'saas', url: `${BASE}/saas/`, breadcrumb: false },
  { slug: 'learn', url: `${BASE}/learn/what-is-roi.html`, breadcrumb: true },
  { slug: 'glossary-index', url: `${BASE}/glossary/`, breadcrumb: false },
  { slug: 'glossary-term', url: `${BASE}/glossary/annualized-return.html`, breadcrumb: true },
  { slug: 'about', url: `${BASE}/about.html`, breadcrumb: false },
  { slug: 'methodology', url: `${BASE}/methodology/`, breadcrumb: false },
  { slug: 'benchmarks', url: `${BASE}/benchmarks/`, breadcrumb: false },
  { slug: 'benchmark-article', url: `${BASE}/benchmarks/average-roi-by-industry.html`, breadcrumb: true },
  { slug: 'comparisons', url: `${BASE}/comparisons/`, breadcrumb: false },
  { slug: 'comparison-article', url: `${BASE}/comparisons/roi-vs-irr.html`, breadcrumb: true },
  { slug: 'privacy', url: `${BASE}/privacy.html`, breadcrumb: false },
  { slug: 'terms', url: `${BASE}/terms.html`, breadcrumb: false },
  { slug: '404', url: `${BASE}/404.html`, breadcrumb: false }
];

const VIEWPORTS = [
  { name: '1440x900', width: 1440, height: 900 },
  { name: '390x844', width: 390, height: 844 }
];

function walkHtml(dir, out) {
  for (const name of fs.readdirSync(dir)) {
    if (name === '.git' || name === 'node_modules' || name === 'templates' || name === 'partials') continue;
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walkHtml(full, out);
    else if (name.endsWith('.html')) out.push(full);
  }
}

const stale = [];
walkHtml(path.join(__dirname, '..', '..'), stale);
stale.forEach((f) => {
  const t = fs.readFileSync(f, 'utf8');
  if (/href="\/assets\/css\/styles\.css"/.test(t) && !t.includes(STYLESHEET_HREF)) {
    console.log('FAIL stale stylesheet:', path.relative(path.join(__dirname, '..', '..'), f));
    process.exitCode = 1;
  }
});

fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });
let failed = false;

try {
  for (const vp of VIEWPORTS) {
    for (const p of PAGES) {
      const page = await browser.newPage();
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(p.url, { waitUntil: 'load' });
      const m = await page.evaluate((expectedHref) => {
        const href = document.querySelector('link[rel="stylesheet"]')?.getAttribute('href');
        const ads = [...document.querySelectorAll('.ad-slot')].filter((el) => el.getBoundingClientRect().height > 2);
        const title = document.querySelector('article.content-section h1, .hero h1');
        const content = document.querySelector('article.content-section') || document.querySelector('.hero');
        const tR = title ? title.getBoundingClientRect() : null;
        const cR = content ? content.getBoundingClientRect() : null;
        return {
          href,
          hasBreadcrumb: Boolean(document.querySelector('.breadcrumb')),
          hasBadge: Boolean(document.querySelector('.badge-privacy')),
          hasStrip: Boolean(document.querySelector('.calculator-strip')),
          hasSticky: Boolean(document.querySelector('.sticky-calc-bar')),
          adCount: ads.length,
          overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
          titleContentDelta: tR && cR ? Math.abs(tR.left - cR.left) : 0
        };
      }, STYLESHEET_HREF);

      const issues = [];
      if (m.href !== STYLESHEET_HREF) issues.push('stylesheet=' + m.href);
      if (m.hasBreadcrumb !== p.breadcrumb) issues.push('breadcrumb');
      if (m.hasBadge) issues.push('badge');
      if (m.hasStrip || m.hasSticky) issues.push('legacy-chrome');
      if (m.adCount) issues.push('ads=' + m.adCount);
      if (m.overflow) issues.push('overflow');
      if (issues.length) {
        failed = true;
        console.log(`FAIL ${p.slug}@${vp.name}: ${issues.join(', ')}`);
      } else {
        console.log(`PASS ${p.slug}@${vp.name}`);
      }
      if (vp.name === '1440x900' && ['glossary-index', 'about', 'benchmarks', 'comparisons', 'learn'].includes(p.slug)) {
        await page.screenshot({ path: path.join(OUT, `phase7c-${p.slug}-${vp.name}.png`), fullPage: true });
      }
      await page.close();
    }
  }
} finally {
  await browser.close();
}

if (failed) process.exitCode = 1;
