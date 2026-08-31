// Phase 7D — factory calculator architecture QA (all 14 pages × 4 viewports + interactions).
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { STYLESHEET_HREF } from '../site-config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.QA_BASE || 'http://127.0.0.1:8791';
const OUT = path.join(__dirname, 'screenshots');

const FACTORY_PAGES = [
  { slug: 'marketing-roi-calculator', calc: true },
  { slug: 'email-marketing-roi-calculator', calc: true },
  { slug: 'influencer-roi-calculator', calc: true },
  { slug: 'content-marketing-roi-calculator', calc: true },
  { slug: 'equipment-roi-calculator', calc: true },
  { slug: 'working-capital-roi-calculator', calc: true },
  { slug: 'warehouse-automation-roi-calculator', calc: true },
  { slug: 'ai-tool-roi-calculator', calc: true },
  { slug: 'employee-training-roi-calculator', calc: true },
  { slug: 'logistics-efficiency-roi-calculator', calc: true },
  { slug: 'simple-roi-calculator', calc: true },
  { slug: 'roi-calculator-example', calc: true },
  { slug: 'free-roi-calculator', calc: true },
  { slug: 'roi-vs-other-metrics', calc: false }
];

const VIEWPORTS = [
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1024x768', width: 1024, height: 768 },
  { name: '390x844', width: 390, height: 844 },
  { name: '320x700', width: 320, height: 700 }
];

const REPRESENTATIVE = new Set([
  'marketing-roi-calculator',
  'equipment-roi-calculator',
  'simple-roi-calculator',
  'roi-vs-other-metrics'
]);

fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });
const results = { layout: [], interaction: [] };
let failed = false;

function fail(msg) {
  failed = true;
  console.log('FAIL', msg);
}

try {
  for (const vp of VIEWPORTS) {
    for (const p of FACTORY_PAGES) {
      const page = await browser.newPage();
      const consoleErrors = [];
      page.on('pageerror', (e) => consoleErrors.push(e.message));
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const url = `${BASE}/calculators/${p.slug}.html`;
      await page.goto(url, { waitUntil: 'load' });

      const m = await page.evaluate((expectedHref) => {
        const hero = document.querySelector('.hero');
        const calc = document.querySelector('.calculator-section-inner') || document.querySelector('.calculator-section');
        const quick = document.querySelector('.ai-answer-block');
        const dominant = document.querySelector('.result-dominant');
        const supporting = document.querySelector('.factory-supporting');
        const related = document.querySelector('.related-calculators');
        const heroR = hero ? hero.getBoundingClientRect() : null;
        const calcR = calc ? calc.getBoundingClientRect() : null;
        const order = [...document.querySelectorAll('main > *')].map((el) => el.className || el.tagName);
        return {
          href: document.querySelector('link[rel="stylesheet"]')?.getAttribute('href'),
          pageFactory: document.body.classList.contains('page-factory'),
          hasBreadcrumb: Boolean(document.querySelector('.breadcrumb')),
          hasHero: Boolean(hero),
          hasQuickAnswer: Boolean(quick),
          hasCalc: Boolean(calc),
          calcBeforeSupporting:
            calc && supporting ? calc.compareDocumentPosition(supporting) & Node.DOCUMENT_POSITION_FOLLOWING : null,
          hasDominantClass: Boolean(dominant),
          hasInterpretation: Boolean(document.getElementById('factory-result-interpretation')),
          hasSupporting: Boolean(supporting),
          hasRelated: Boolean(related),
          heroCalcDelta: heroR && calcR ? Math.abs(heroR.left - calcR.left) : null,
          overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
          order
        };
      }, STYLESHEET_HREF);

      const issues = [];
      if (m.href !== STYLESHEET_HREF) issues.push('stylesheet');
      if (!m.pageFactory) issues.push('page-factory');
      if (!m.hasBreadcrumb) issues.push('breadcrumb');
      if (!m.hasHero) issues.push('hero');
      if (m.hasQuickAnswer) issues.push('pre-calc-quick-answer');
      if (p.calc && !m.hasCalc) issues.push('calculator');
      if (p.calc && !m.calcBeforeSupporting) issues.push('calc-order');
      if (!m.hasSupporting) issues.push('factory-supporting');
      if (!m.hasRelated) issues.push('related');
      if (m.overflow) issues.push('overflow');
      if (m.heroCalcDelta != null && m.heroCalcDelta > 2) issues.push('hero-calc-align');

      const row = { slug: p.slug, viewport: vp.name, issues, consoleErrors };
      results.layout.push(row);

      if (issues.length || consoleErrors.length) {
        fail(`${p.slug}@${vp.name}: ${[...issues, ...consoleErrors].join(', ')}`);
      } else {
        console.log(`PASS layout ${p.slug}@${vp.name}`);
      }

      await page.screenshot({
        path: path.join(OUT, `phase7d-${p.slug}-${vp.name}.png`),
        fullPage: true
      });

      await page.close();
    }
  }

  for (const p of FACTORY_PAGES.filter((x) => x.calc)) {
    const page = await browser.newPage();
    const consoleErrors = [];
    page.on('pageerror', (e) => consoleErrors.push(e.message));
    await page.setViewportSize({ width: 1440, height: 900 });
    const url = `${BASE}/calculators/${p.slug}.html`;
    await page.goto(url, { waitUntil: 'load' });

    const formValid = await page.evaluate(() => document.getElementById('factory-calc-form').checkValidity());
    await page.locator('#factory-calc-form button[type="submit"]').click();
    await page.waitForTimeout(250);

    const state = await page.evaluate(() => {
      const panel = document.getElementById('factory-results-panel');
      const dominant = document.getElementById('factory-out-roi');
      const interp = document.getElementById('factory-result-interpretation');
      const text = dominant ? dominant.textContent.trim() : '';
      return {
        panelHidden: panel ? panel.hidden : true,
        dominant: text,
        interpretation: interp ? interp.textContent.trim() : '',
        hasDominantEl: Boolean(document.querySelector('.result-dominant'))
      };
    });

    const bad =
      !formValid ||
      state.panelHidden ||
      !state.dominant ||
      state.dominant === '—' ||
      /NaN|Infinity/i.test(state.dominant) ||
      !state.hasDominantEl ||
      consoleErrors.length > 0;

    results.interaction.push({ slug: p.slug, formValid, ...state, consoleErrors, pass: !bad });
    if (bad) {
      fail(`interaction ${p.slug}: valid=${formValid} panel=${!state.panelHidden} result=${JSON.stringify(state.dominant)}`);
    } else {
      console.log(`PASS interaction ${p.slug}: ${state.dominant}`);
    }
    await page.close();
  }

  // Mobile nav + calculators disclosure on representative factory page
  {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE}/calculators/marketing-roi-calculator.html`, { waitUntil: 'load' });
    await page.locator('.nav-mobile-toggle').click();
    const navOpen = await page.locator('#site-nav-links').evaluate((el) => {
      const s = getComputedStyle(el);
      return s.display !== 'none' && el.getBoundingClientRect().height > 0;
    });
    await page.locator('.nav-dropdown-toggle').click();
    const menuOpen = await page.locator('#calculators-menu').evaluate((el) => el.getBoundingClientRect().height > 0);
    if (!navOpen || !menuOpen) {
      fail(`mobile-nav: navOpen=${navOpen} menuOpen=${menuOpen}`);
    } else {
      console.log('PASS mobile-nav + calculators disclosure');
    }
    await page.close();
  }

  // Keyboard: tab to Calculate and activate
  {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE}/calculators/simple-roi-calculator.html`, { waitUntil: 'load' });
    await page.keyboard.press('Tab');
    let found = false;
    for (let i = 0; i < 30; i++) {
      const active = await page.evaluate(() => {
        const el = document.activeElement;
        return el ? { tag: el.tagName, type: el.type, text: el.textContent } : null;
      });
      if (active && active.tag === 'BUTTON' && /calculate/i.test(active.text || '')) {
        found = true;
        await page.keyboard.press('Enter');
        break;
      }
      await page.keyboard.press('Tab');
    }
    await page.waitForTimeout(250);
    const panelHidden = await page.$eval('#factory-results-panel', (el) => el.hidden);
    if (!found || panelHidden) {
      fail(`keyboard-calc: found=${found} panelHidden=${panelHidden}`);
    } else {
      console.log('PASS keyboard navigation to Calculate');
    }
    await page.close();
  }
} finally {
  await browser.close();
}

fs.writeFileSync(path.join(OUT, 'phase7d-results.json'), JSON.stringify(results, null, 2));
console.log(failed ? 'PHASE7D QA: SOME FAILED' : 'PHASE7D QA: ALL PASS');
process.exitCode = failed ? 1 : 0;
