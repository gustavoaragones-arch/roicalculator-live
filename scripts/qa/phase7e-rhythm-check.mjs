// Phase 7E — visual rhythm, Quick Answer removal, result-area spacing QA.
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { STYLESHEET_HREF } from '../site-config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.QA_BASE || 'http://127.0.0.1:8791';
const OUT = path.join(__dirname, 'screenshots');

const PAGES = [
  { slug: 'home', url: `${BASE}/`, calc: '#roi-form button[type="submit"]', hasProjection: true },
  { slug: 'saas', url: `${BASE}/saas/`, calc: '#saas-cluster-form button[type="submit"]', hasProjection: true },
  { slug: 'real-estate', url: `${BASE}/real-estate/`, calc: '#rp-roi-form button[type="submit"]', input: '#rp-purchase', inputVal: '300000', hasProjection: true },
  { slug: 'solar', url: `${BASE}/solar/roi-calculator.html`, calc: '#sp-roi-form button[type="submit"]', input: '#sp-cost', inputVal: '30000', hasProjection: false },
  { slug: 'factory', url: `${BASE}/calculators/marketing-roi-calculator.html`, calc: '#factory-calc-form button[type="submit"]', hasProjection: false },
  { slug: 'learn', url: `${BASE}/learn/what-is-roi.html`, calc: null, hasProjection: false },
  { slug: 'glossary', url: `${BASE}/glossary/cac.html`, calc: null, hasProjection: false },
  { slug: 'comparison', url: `${BASE}/comparisons/roi-vs-irr.html`, calc: null, hasProjection: false },
  { slug: 'benchmark', url: `${BASE}/benchmarks/marketing-roi-benchmarks.html`, calc: null, hasProjection: false }
];

const VIEWPORTS = [
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1024x768', width: 1024, height: 768 },
  { name: '390x844', width: 390, height: 844 },
  { name: '320x700', width: 320, height: 700 }
];

fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });
let failed = false;

function fail(msg) {
  failed = true;
  console.log('FAIL', msg);
}

try {
  for (const vp of VIEWPORTS) {
    for (const p of PAGES) {
      const page = await browser.newPage();
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(p.url, { waitUntil: 'load' });

      const m = await page.evaluate(() => {
        const text = document.body.innerText || '';
        const quickLabel = /Quick Answer:/i.test(text);
        const greenBox = Boolean(
          document.querySelector('.aeo-answer-block[style], .aeo-answer-block') &&
            getComputedStyle(document.querySelector('.aeo-answer-block')).backgroundColor !== 'rgba(0, 0, 0, 0)'
        );
        const aiBox = document.querySelector('.ai-answer-block');
        const aiBoxBg = aiBox ? getComputedStyle(aiBox).backgroundColor : null;
        const overflow = document.documentElement.scrollWidth > document.documentElement.clientWidth;
        return {
          href: document.querySelector('link[rel="stylesheet"]')?.getAttribute('href'),
          quickLabel,
          aiBoxHasFill: aiBoxBg && aiBoxBg !== 'rgba(0, 0, 0, 0)' && !aiBoxBg.includes('0, 0, 0'),
          overflow
        };
      }, STYLESHEET_HREF);

      const issues = [];
      if (m.href !== STYLESHEET_HREF) issues.push('stylesheet');
      if (m.quickLabel) issues.push('quick-answer-label');
      if (m.overflow) issues.push('overflow');
      if (issues.length || errors.length) {
        fail(`${p.slug}@${vp.name}: ${[...issues, ...errors].join(', ')}`);
      } else {
        console.log(`PASS layout ${p.slug}@${vp.name}`);
      }

      if (vp.name === '1440x900') {
        await page.screenshot({ path: path.join(OUT, `phase7e-${p.slug}-${vp.name}.png`), fullPage: true });
      }
      await page.close();
    }
  }

  // Homepage: spacing between interpretation and projection after calculate
  {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE}/`, { waitUntil: 'load' });
    await page.locator('#roi-form button[type="submit"]').click();
    await page.waitForTimeout(300);
    const gap = await page.evaluate(() => {
      const interp = document.querySelector('.calc-result-explanation, .calc-result-explanation-text');
      const proj = document.querySelector('.calc-projection-heading');
      if (!interp || !proj) return { ok: false, reason: 'missing nodes' };
      const iR = interp.getBoundingClientRect();
      const pR = proj.getBoundingClientRect();
      const gapPx = pR.top - iR.bottom;
      const quick = /Quick Answer:/i.test(document.body.innerText);
      return { ok: gapPx >= 16, gapPx, quick };
    });
    if (!gap.ok || gap.quick) {
      fail(`home-spacing: gap=${gap.gapPx}px quick=${gap.quick}`);
    } else {
      console.log(`PASS home interpretation→projection gap: ${gap.gapPx.toFixed(1)}px`);
    }
    await page.screenshot({ path: path.join(OUT, 'phase7e-home-after-calculate-1440x900.png'), fullPage: false });
    await page.close();
  }

  // Interaction smoke
  for (const p of PAGES.filter((x) => x.calc)) {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(p.url, { waitUntil: 'load' });
    if (p.input) await page.locator(p.input).fill(p.inputVal);
    await page.locator(p.calc).click();
    await page.waitForTimeout(300);
    const quick = await page.evaluate(() => /Quick Answer:/i.test(document.body.innerText));
    if (quick || errors.length) {
      fail(`interaction ${p.slug}: quick=${quick} errors=${errors.join(';')}`);
    } else {
      console.log(`PASS interaction ${p.slug}`);
    }
    await page.close();
  }

  // Mobile nav
  {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE}/`, { waitUntil: 'load' });
    await page.locator('.nav-mobile-toggle').click();
    const open = await page.locator('#site-nav-links').evaluate((el) => el.getBoundingClientRect().height > 0);
    if (!open) fail('mobile-nav');
    else console.log('PASS mobile-nav');
    await page.close();
  }
} finally {
  await browser.close();
}

console.log(failed ? 'PHASE7E QA: SOME FAILED' : 'PHASE7E QA: ALL PASS');
process.exitCode = failed ? 1 : 0;
