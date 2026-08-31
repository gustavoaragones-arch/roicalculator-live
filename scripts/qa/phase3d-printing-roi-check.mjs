// Phase 2 — 3D Printing Business ROI Calculator QA.
// Verifies the exact contract in the Phase 2 implementation brief and
// reports/audits/PHASE-3D-PRINTING-01-RESEARCH-ARCHITECTURE.md.
// Run locally before deploy, then again with
// PHASE3D_BASE=https://roicalculator.live after deploy (cache-busted).
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', '..');
const BASE = process.env.PHASE3D_BASE || 'http://127.0.0.1:8791';
const isProd = /roicalculator\.live/.test(BASE);
const PAGE_PATH = '/3d-printing/roi-calculator.html';

const results = [];
function check(name, pass, detail) {
  results.push({ name, pass, detail });
  console.log((pass ? 'PASS' : 'FAIL') + '  ' + name + (detail ? ' — ' + detail : ''));
}
function cb(url) {
  return url + (url.includes('?') ? '&' : '?') + 'cb=' + Date.now() + Math.random().toString(36).slice(2);
}

// ---------- Source checks (static file inspection) ----------
const htmlPath = path.join(ROOT, '3d-printing', 'roi-calculator.html');
const jsPath = path.join(ROOT, 'assets', 'js', '3d-printing-roi-calculator.js');
const html = fs.readFileSync(htmlPath, 'utf8');

check('Source: target HTML exists', fs.existsSync(htmlPath));
check('Source: dedicated JS exists', fs.existsSync(jsPath));

const calculatorsJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'calculators.json'), 'utf8'));
check(
  'Source: no factory calculator config was added for 3d-printing',
  !calculatorsJson.some((c) => /3d.?print/i.test(c.slug || '') || /3d.?print/i.test(c.title || ''))
);

check('Source: no ad slots', !html.includes('class="ad-slot'));
check('Source: no AdSense script', !html.includes('adsbygoogle') && !html.includes('pagead2.googlesyndication'));
check('Source: no "Quick Answer" label', !html.includes('Quick Answer'));
check('Source: no AEO answer box (.aeo-answer-block / .ai-answer-block)', !html.includes('aeo-answer-block') && !html.includes('ai-answer-block'));
check('Source: no sticky CTA', !html.includes('sticky'));
check('Source: no privacy badge', !html.includes('badge-privacy'));
check('Source: no duplicate "What is ROI?" FAQ question', !html.includes('What is ROI?'));
check('Source: exact H1', /<h1>3D Printing Business ROI Calculator<\/h1>/.test(html));
check('Source: exact title', html.includes('<title>3D Printing Business ROI Calculator | roicalculator.live</title>'));
check(
  'Source: exact hero subtitle',
  html.includes('Calculate monthly profit, payback period, and ROI for a 3D printing side business from printer cost, per-print economics, and sales volume.')
);
check(
  'Source: exact meta description',
  html.includes('Free 3D printing business ROI calculator: printer cost, material, electricity, labor, failure rate, and marketplace fees. Get monthly profit, payback period, and ROI.')
);
const expectedFaqQuestions = [
  'Why does the payback period add depreciation back instead of just using monthly profit?',
  'How does the failure rate affect my cost per print?',
  "What's the difference between the margin and markup shown in the results?",
  'Why is my printer investment excluded from monthly operating profit?'
];
check('Source: exact FAQ questions (all 4 present)', expectedFaqQuestions.every((q) => html.includes(q)));

// ---------- Sitemap checks ----------
const sitemapXml = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
check('Sitemap: contains the new canonical URL', sitemapXml.includes('https://roicalculator.live/3d-printing/roi-calculator.html'));

// ---------- No 3D printing cluster expansion ----------
const clusterUrls = [
  '3d-printing/print-farm-calculator.html',
  '3d-printing/print-service-pricing-calculator.html',
  '3d-printing/profit-margin-calculator.html',
  '3d-printing/printer-payback-calculator.html',
  '3d-printing/index.html'
];
check('Scope: no future cluster pages created', clusterUrls.every((p) => !fs.existsSync(path.join(ROOT, p))));

const browser = await chromium.launch({ channel: 'chrome' });
try {
  // ---------- Schema checks ----------
  {
    const page = await browser.newPage();
    await page.goto(cb(`${BASE}${PAGE_PATH}`), { waitUntil: 'load' });
    const content = await page.content();
    const ldBlocks = [...content.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
    let webPageOk = false;
    let faqOk = false;
    let faqMatchesVisible = true;
    for (const block of ldBlocks) {
      try {
        const parsed = JSON.parse(block);
        if (parsed['@type'] === 'WebPage') webPageOk = true;
        if (parsed['@type'] === 'FAQPage') {
          faqOk = true;
          const schemaQuestions = (parsed.mainEntity || []).map((q) => q.name);
          faqMatchesVisible = expectedFaqQuestions.every((q) => schemaQuestions.includes(q)) && schemaQuestions.length === expectedFaqQuestions.length;
        }
      } catch (e) {
        check('Schema: valid JSON-LD (' + e.message + ')', false);
      }
    }
    check('Schema: WebPage present', webPageOk);
    check('Schema: FAQPage present and matches visible FAQ exactly', faqOk && faqMatchesVisible);
    await page.close();
  }

  // ---------- Canonical ----------
  {
    const page = await browser.newPage();
    await page.goto(cb(`${BASE}${PAGE_PATH}`), { waitUntil: 'load' });
    const canonical = await page.getAttribute('link[rel="canonical"]', 'href');
    check('Canonical: exact match', canonical === 'https://roicalculator.live/3d-printing/roi-calculator.html', canonical);
    await page.close();
  }

  // ---------- Calculation checks ----------
  {
    const page = await browser.newPage();
    const consoleErrors = [];
    page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    page.on('pageerror', (e) => consoleErrors.push(String(e)));
    await page.goto(cb(`${BASE}${PAGE_PATH}`), { waitUntil: 'load' });

    // Default scenario
    await page.click('#tdp-form button[type="submit"]');
    await page.waitForTimeout(200);
    const roi24 = await page.textContent('#tdp-res-roi24');
    const payback = await page.textContent('#tdp-res-payback');
    const monthlyProfit = await page.textContent('#tdp-res-monthly-profit');
    const profitPerPrint = await page.textContent('#tdp-res-profit-per-print');
    const breakeven = await page.textContent('#tdp-res-breakeven');
    check('Calc: default 24-mo ROI ≈ 1311%', roi24.startsWith('1311.4'), roi24);
    check('Calc: default payback ≈ 1.7 mo', payback.trim() === '1.7 mo', payback);
    check('Calc: default monthly operating profit ≈ $255', monthlyProfit.trim() === '$255', monthlyProfit);
    check('Calc: default profit per print ≈ $14.50', profitPerPrint.trim() === '$14.50', profitPerPrint);
    check('Calc: default break-even = 3 prints/mo', breakeven.trim() === '3 prints/mo', breakeven);

    // Modified scenario
    await page.fill('#tdp-printer-cost', '800');
    await page.fill('#tdp-price', '40');
    await page.fill('#tdp-units', '50');
    await page.fill('#tdp-failure-rate', '20');
    await page.fill('#tdp-labor-minutes', '30');
    await page.click('#tdp-form button[type="submit"]');
    await page.waitForTimeout(200);
    const modRoi = await page.textContent('#tdp-res-roi24');
    check('Calc: modified scenario changes ROI', modRoi.trim() !== roi24.trim(), modRoi);

    // Loss scenario
    await page.reload({ waitUntil: 'load' });
    await page.fill('#tdp-price', '5');
    await page.click('#tdp-form button[type="submit"]');
    await page.waitForTimeout(200);
    const lossProfit = await page.textContent('#tdp-res-profit-per-print');
    const lossMargin = await page.textContent('#tdp-res-margin');
    const lossRoi = await page.textContent('#tdp-res-roi24');
    check('Calc: loss scenario shows negative profit', lossProfit.trim().startsWith('-'), lossProfit);
    check('Calc: loss scenario shows negative margin (not hidden)', lossMargin.trim().startsWith('-'), lossMargin);
    check('Calc: loss scenario shows negative ROI', lossRoi.trim().startsWith('-'), lossRoi);
    check('Calc: loss scenario has no NaN/Infinity', ![lossProfit, lossMargin, lossRoi].some((v) => /NaN|Infinity|undefined|null/.test(v)));

    // 99% failure scenario
    await page.reload({ waitUntil: 'load' });
    await page.fill('#tdp-failure-rate', '99');
    await page.click('#tdp-form button[type="submit"]');
    await page.waitForTimeout(200);
    const failResults = await Promise.all(
      ['tdp-res-roi24', 'tdp-res-payback', 'tdp-res-monthly-profit', 'tdp-res-profit-per-print'].map((id) => page.textContent('#' + id))
    );
    check('Calc: 99% failure scenario produces a usable result (no NaN/Infinity)', !failResults.some((v) => /NaN|Infinity|undefined|null/.test(v)), JSON.stringify(failResults));

    // Zero-volume scenario
    await page.reload({ waitUntil: 'load' });
    await page.fill('#tdp-units', '0');
    await page.click('#tdp-form button[type="submit"]');
    await page.waitForTimeout(200);
    const zeroMonthlyProfit = await page.textContent('#tdp-res-monthly-profit');
    const zeroPayback = await page.textContent('#tdp-res-payback');
    const zeroRoi = await page.textContent('#tdp-res-roi24');
    check('Calc: zero-volume monthly profit = -$35 (negative fixed costs)', zeroMonthlyProfit.trim() === '-$35', zeroMonthlyProfit);
    check('Calc: zero-volume payback = —', zeroPayback.trim() === '—', zeroPayback);
    check('Calc: zero-volume ROI is a real negative number, not —', /^-?\d/.test(zeroRoi.trim()), zeroRoi);

    // Zero investment scenario
    await page.reload({ waitUntil: 'load' });
    await page.fill('#tdp-printer-cost', '0');
    await page.fill('#tdp-setup-cost', '0');
    await page.click('#tdp-form button[type="submit"]');
    await page.waitForTimeout(200);
    const zeroInvPayback = await page.textContent('#tdp-res-payback');
    check('Calc: zero-investment payback shows "0 mo (no investment entered)"', zeroInvPayback.trim() === '0 mo (no investment entered)', zeroInvPayback);

    check('Calc: no console errors across all scenarios', consoleErrors.length === 0, JSON.stringify(consoleErrors));
    await page.close();
  }

  // ---------- Responsive checks ----------
  {
    const viewports = [
      { name: '1440x900', width: 1440, height: 900 },
      { name: '1024x768', width: 1024, height: 768 },
      { name: '390x844', width: 390, height: 844 },
      { name: '320x700', width: 320, height: 700 }
    ];
    for (const vp of viewports) {
      const page = await browser.newPage();
      await page.setViewportSize(vp);
      await page.goto(cb(`${BASE}${PAGE_PATH}`), { waitUntil: 'load' });
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      check(`Responsive: no horizontal overflow @ ${vp.name}`, scrollWidth <= clientWidth, `scrollWidth=${scrollWidth} clientWidth=${clientWidth}`);
      await page.close();
    }
  }

  // ---------- Navigation ----------
  {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(cb(`${BASE}${PAGE_PATH}`), { waitUntil: 'load' });
    const toggle = page.locator('.nav-mobile-toggle');
    const navLinks = page.locator('#site-nav-links');
    await toggle.click();
    check('Navigation: mobile menu opens', await navLinks.isVisible());
    const calcTrigger = page.locator('.nav-dropdown-toggle');
    await calcTrigger.click();
    check('Navigation: nested Calculators disclosure opens', await page.locator('#calculators-menu').isVisible());
    await page.close();
  }
} finally {
  await browser.close();
}

const failed = results.filter((r) => !r.pass);
console.log('\n' + (failed.length ? failed.length + ' FAILED' : 'ALL PASSED') + ' out of ' + results.length + ' checks');
if (failed.length) process.exitCode = 1;
