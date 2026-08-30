// Phase 7B-02 Part 1 — forensic baseline for five reference pages.
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.QA_BASE || 'http://127.0.0.1:8791';
const OUT = path.join(__dirname, 'screenshots');
const VIEWPORTS = [
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1024x768', width: 1024, height: 768 },
  { name: '390x844', width: 390, height: 844 },
  { name: '320x700', width: 320, height: 700 }
];

const PAGES = [
  { slug: 'home', url: `${BASE}/` },
  { slug: 'saas', url: `${BASE}/saas/` },
  { slug: 'real-estate', url: `${BASE}/real-estate/` },
  { slug: 'solar', url: `${BASE}/solar/roi-calculator.html` },
  { slug: 'marketing', url: `${BASE}/marketing/` }
];

function metricsScript() {
  return () => {
    const header = document.querySelector('.site-header');
    const nav = document.querySelector('.nav-main');
    const hero = document.querySelector('.hero');
    const heroH1 = document.querySelector('.hero h1') || document.querySelector('article.content-section h1');
    const calcInner =
      document.querySelector('.calculator-section-inner') ||
      document.querySelector('.calculator-card') ||
      document.querySelector('#factory-calc-form') ||
      document.querySelector('.calculator-module');
    const breadcrumb = document.querySelector('.breadcrumb');
    const strip = document.querySelector('.calculator-strip');
    const badge = document.querySelector('.badge-privacy');
    const ads = [...document.querySelectorAll('.ad-slot')];
    const sticky = document.querySelector('.sticky-calc-bar');
    const dominance = document.querySelector('.ai-answer-dominance');
    const whatIsRoi = [...document.querySelectorAll('h2, h3')].filter((el) =>
      /what is roi/i.test(el.textContent || '')
    ).length;
    const dominant = document.querySelector('.result-dominant');
    const methodology = document.querySelector('.methodology-section');

    const rect = (el) => (el ? el.getBoundingClientRect() : null);
    const heroR = rect(hero || heroH1?.closest('section, article'));
    const calcR = rect(calcInner);

    const adVisible = ads.map((el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        className: el.className,
        width: r.width,
        height: r.height,
        display: cs.display,
        visible: r.height > 2 && cs.display !== 'none' && cs.visibility !== 'hidden'
      };
    });

    return {
      headerHeight: header ? header.getBoundingClientRect().height : null,
      navLinkCount: document.querySelectorAll('.nav-links > li').length,
      hasBadge: Boolean(badge),
      hasCalculatorStrip: Boolean(strip),
      adSlotCount: ads.length,
      adVisible,
      hasBreadcrumb: Boolean(breadcrumb),
      breadcrumbText: breadcrumb ? breadcrumb.textContent.trim().slice(0, 80) : null,
      heroMaxWidth: hero ? getComputedStyle(hero).maxWidth : null,
      heroLeft: heroR ? heroR.left : null,
      heroWidth: heroR ? heroR.width : null,
      h1Top: heroH1 ? heroH1.getBoundingClientRect().top : null,
      calcLeft: calcR ? calcR.left : null,
      calcWidth: calcR ? calcR.width : null,
      calcTop: calcR ? calcR.top : null,
      heroCalcDelta:
        heroR && calcR ? Math.abs(heroR.left - calcR.left) : null,
      hasDominantResult: Boolean(dominant),
      hasMethodology: Boolean(methodology),
      hasAiAnswerDominance: Boolean(dominance),
      whatIsRoiHeadingCount: whatIsRoi,
      hasStickyBar: Boolean(sticky),
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    };
  };
}

fs.mkdirSync(OUT, { recursive: true });
const report = { base: BASE, capturedAt: new Date().toISOString(), pages: {} };

const browser = await chromium.launch({ channel: 'chrome' });
try {
  for (const p of PAGES) {
    report.pages[p.slug] = { viewports: {} };
    for (const vp of VIEWPORTS) {
      const page = await browser.newPage();
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(p.url, { waitUntil: 'load' });
      const m = await page.evaluate(metricsScript());
      report.pages[p.slug].viewports[vp.name] = m;
      const shot = path.join(OUT, `phase7b02-${p.slug}-${vp.name}.png`);
      await page.screenshot({ path: shot, fullPage: true });
      await page.close();
    }
    const desktop = report.pages[p.slug].viewports['1440x900'];
    console.log(`\n=== ${p.slug} (1440x900) ===`);
    console.log(JSON.stringify(desktop, null, 2));
  }
} finally {
  await browser.close();
}

const reportPath = path.join(OUT, 'phase7b02-forensic-baseline.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`\nWrote ${reportPath}`);
