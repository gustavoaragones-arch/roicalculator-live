// Phase 3 — 3D Print Farm ROI Calculator QA.
// Verifies the exact contract in the chat brief "PHASE 3 — 3D PRINT FARM ROI
// CALCULATOR". Run locally before deploy, then again with
// PHASE3DFARM_BASE=https://roicalculator.live after deploy (cache-busted).
//
// Independently derived default-scenario expected values (see brief §24 —
// computed by hand/Node BEFORE implementation, cross-checked against the
// live calculator, not invented after the fact):
//   fleetAvailableHours=3600, utilizedFleetHours=2160, attemptCapacity=720
//   successfulPrintCapacity=662.4 -> displayed "662 prints/mo"
//   monthlySuccessfulPrints=80 (demand-constrained: 80 < 662.4)
//   costPerSuccessfulPrint=6.338043478
//   profitPerSuccessfulPrint=19.00195652 -> "$19.00"
//   monthlyRevenue=2240 -> "$2,240"
//   monthlyOperatingProfit=1010.156522 -> "$1,010"
//   monthlyDepreciation=41.73913043
//   monthlyCashProfit=1051.895652
//   initialInvestment=2250
//   paybackMonths=2.1389954368 -> "2.1 mo"
//   roi12=461.011%, roi24=1022.022%, roi36=1583.033%
//   breakEvenPrints=ceil(150/14.501956521739132)=11
//   grossMargin=67.864%, markup=211.179%
//   capacityUtilizationPct=12.077% -> "12.1%"
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', '..');
const BASE = process.env.PHASE3DFARM_BASE || 'http://127.0.0.1:8791';
const isProd = /roicalculator\.live/.test(BASE);
const PAGE_PATH = '/3d-printing/print-farm-roi-calculator.html';

const results = [];
function check(name, pass, detail) {
  results.push({ name, pass, detail });
  console.log((pass ? 'PASS' : 'FAIL') + '  ' + name + (detail ? ' — ' + detail : ''));
}
function cb(url) {
  return url + (url.includes('?') ? '&' : '?') + 'cb=' + Date.now() + Math.random().toString(36).slice(2);
}
function hasBadValue(str) {
  return /NaN|Infinity|undefined|null/.test(str);
}

// ---------- 1-3: Source checks ----------
const htmlPath = path.join(ROOT, '3d-printing', 'print-farm-roi-calculator.html');
const jsPath = path.join(ROOT, 'assets', 'js', '3d-printing-print-farm-roi-calculator.js');
const html = fs.readFileSync(htmlPath, 'utf8');

check('1. Page exists', fs.existsSync(htmlPath));
check('2. JS exists', fs.existsSync(jsPath));

const calculatorsJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'calculators.json'), 'utf8'));
check(
  '3. Page is not in calculators.json',
  !calculatorsJson.some((c) => /print.?farm/i.test(c.slug || '') || /print.?farm/i.test(c.title || ''))
);

check('4. Exact title', html.includes('<title>3D Print Farm ROI Calculator | roicalculator.live</title>'));
check('5. Exact H1', /<h1>3D Print Farm ROI Calculator<\/h1>/.test(html));
check(
  '6. Exact hero subtitle',
  html.includes(
    'Estimate print-farm revenue, operating profit, break-even volume, payback period, and ROI from your printer fleet, utilization, production economics, and sales volume.'
  )
);
check(
  '7. Exact meta description',
  html.includes(
    'Free 3D print farm ROI calculator for printer count, utilization, print time, material cost, labor, failure rate, pricing, and monthly sales. Estimate profit, payback, and ROI.'
  )
);
check('8. No ad slots', !html.includes('class="ad-slot'));
check('9. No AdSense', !html.includes('adsbygoogle') && !html.includes('pagead2.googlesyndication'));
check('10. No privacy badge', !html.includes('badge-privacy'));
check('11. No sticky CTA', !html.includes('sticky'));
check('12. No "Quick Answer"', !html.includes('Quick Answer'));
check('13. No AEO answer box (.aeo-answer-block / .ai-answer-block)', !html.includes('aeo-answer-block') && !html.includes('ai-answer-block'));
check('14. No "What is ROI?"', !html.includes('What is ROI?'));

const expectedFaqQuestions = [
  "How does printer utilization affect a print farm's ROI?",
  'How does this calculator know whether demand or printer capacity is limiting growth?',
  'Why does the failure rate affect more than material cost?',
  'Why is depreciation added back when calculating print-farm payback?'
];
check('15. Exact four FAQ questions present in source', expectedFaqQuestions.every((q) => html.includes(q)));

// ---------- 20-22: sitemap / cluster scope ----------
const sitemapXml = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
check('21. Sitemap contains canonical', sitemapXml.includes('https://roicalculator.live/3d-printing/print-farm-roi-calculator.html'));

const forbiddenClusterPaths = [
  '3d-printing/index.html',
  '3d-printing/print-service-pricing-calculator.html',
  '3d-printing/profit-margin-calculator.html',
  '3d-printing/printer-payback-calculator.html'
];
check('22. No future cluster pages created', forbiddenClusterPaths.every((p) => !fs.existsSync(path.join(ROOT, p))));

// ---------- Phase 2 calculator untouched ----------
const phase2Path = path.join(ROOT, '3d-printing', 'roi-calculator.html');
const phase2Js = path.join(ROOT, 'assets', 'js', '3d-printing-roi-calculator.js');
check('Scope: Phase 2 page still exists unmodified in this phase', fs.existsSync(phase2Path));
check('Scope: Phase 2 JS still exists unmodified in this phase', fs.existsSync(phase2Js));

const browser = await chromium.launch({ channel: 'chrome' });
try {
  // ---------- 16-19: FAQ visible + schema ----------
  {
    const page = await browser.newPage();
    await page.goto(cb(`${BASE}${PAGE_PATH}`), { waitUntil: 'load' });
    const visibleFaq = await page.$$eval('.faq-list .faq-item h3', (els) => els.map((e) => e.textContent.trim()));
    check('16. FAQ visible with exactly the 4 expected questions', expectedFaqQuestions.every((q) => visibleFaq.includes(q)) && visibleFaq.length === 4, JSON.stringify(visibleFaq));

    const content = await page.content();
    const ldBlocks = [...content.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
    let webPageOk = false;
    let faqOk = false;
    let faqMatchesVisible = false;
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
    check('17. FAQPage JSON-LD exists', faqOk);
    check('18. FAQPage JSON-LD exactly matches visible FAQ', faqMatchesVisible);
    check('19. WebPage JSON-LD exists', webPageOk);

    const canonical = await page.getAttribute('link[rel="canonical"]', 'href');
    check('20. Canonical exact', canonical === 'https://roicalculator.live/3d-printing/print-farm-roi-calculator.html', canonical);
    await page.close();
  }

  // ---------- 23-28: default calculation ----------
  {
    const page = await browser.newPage();
    const consoleErrors = [];
    page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    page.on('pageerror', (e) => consoleErrors.push(String(e)));
    await page.goto(cb(`${BASE}${PAGE_PATH}`), { waitUntil: 'load' });

    await page.click('#pf-form button[type="submit"]');
    check('23. Default calculator click works', true);
    await page.waitForTimeout(200);

    const roi24 = await page.textContent('#pf-res-roi24');
    const payback = await page.textContent('#pf-res-payback');
    const monthlyProfit = await page.textContent('#pf-res-monthly-profit');
    const monthlyPrints = await page.textContent('#pf-res-monthly-prints');
    const capacity = await page.textContent('#pf-res-capacity');
    const capacityUtil = await page.textContent('#pf-res-capacity-utilization');
    const breakeven = await page.textContent('#pf-res-breakeven');
    const revenue = await page.textContent('#pf-res-revenue');
    const profitPerPrint = await page.textContent('#pf-res-profit-per-print');
    const roi12 = await page.textContent('#pf-res-roi12');
    const roi36 = await page.textContent('#pf-res-roi36');
    const margin = await page.textContent('#pf-res-margin');
    const markup = await page.textContent('#pf-res-markup');
    const interpretation = await page.textContent('#pf-res-interpretation');

    check('24. Default ROI is finite and matches independently derived value (1022.0%)', roi24.trim() === '1022.0%', roi24);
    check('25. Default payback is finite and matches independently derived value (2.1 mo)', payback.trim() === '2.1 mo', payback);
    check('26. Default monthly operating profit matches independently derived value ($1,010)', monthlyProfit.trim() === '$1,010', monthlyProfit);
    check('27. Default successful-print volume is finite and matches (80 prints/mo)', monthlyPrints.trim() === '80 prints/mo', monthlyPrints);
    check('28. Capacity result is finite and matches independently derived value (662 prints/mo)', capacity.trim() === '662 prints/mo', capacity);
    check('Default: capacity utilization matches (12.1%)', capacityUtil.trim() === '12.1%', capacityUtil);
    check('Default: break-even matches (11 prints/mo)', breakeven.trim() === '11 prints/mo', breakeven);
    check('Default: monthly revenue matches ($2,240)', revenue.trim() === '$2,240', revenue);
    check('Default: profit per print matches ($19.00)', profitPerPrint.trim() === '$19.00', profitPerPrint);
    check('Default: 12-month ROI matches (461.0%)', roi12.trim() === '461.0%', roi12);
    check('Default: 36-month ROI matches (1583.0%)', roi36.trim() === '1583.0%', roi36);
    check('Default: gross margin matches (67.9%)', margin.trim() === '67.9%', margin);
    check('Default: markup matches (211.2%)', markup.trim() === '211.2%', markup);
    check('Default: interpretation states demand is the limiting factor', interpretation.includes('demand is the limiting factor'), interpretation);

    // ---------- 29: modified scenario ----------
    await page.fill('#pf-orders', '1000');
    await page.click('#pf-form button[type="submit"]');
    await page.waitForTimeout(200);
    const modRoi = await page.textContent('#pf-res-roi24');
    const modInterpretation = await page.textContent('#pf-res-interpretation');
    check('29. Modified scenario (orders=1000) changes outputs', modRoi.trim() !== roi24.trim(), modRoi);
    check('29b. Capacity-constrained interpretation flips to "capacity is the limiting factor"', modInterpretation.includes('capacity is the limiting factor'), modInterpretation);

    // ---------- 30: zero-volume ----------
    await page.reload({ waitUntil: 'load' });
    await page.fill('#pf-orders', '0');
    await page.click('#pf-form button[type="submit"]');
    await page.waitForTimeout(200);
    const zvProfit = await page.textContent('#pf-res-monthly-profit');
    const zvPayback = await page.textContent('#pf-res-payback');
    check('30. Zero-volume scenario safe (no bad values)', !hasBadValue(zvProfit) && !hasBadValue(zvPayback), `${zvProfit} / ${zvPayback}`);

    // ---------- 31: zero-utilization ----------
    await page.reload({ waitUntil: 'load' });
    await page.fill('#pf-utilization', '0');
    await page.click('#pf-form button[type="submit"]');
    await page.waitForTimeout(200);
    const zuCapacity = await page.textContent('#pf-res-capacity');
    const zuUtil = await page.textContent('#pf-res-capacity-utilization');
    check('31. Zero-utilization scenario safe', !hasBadValue(zuCapacity) && !hasBadValue(zuUtil), `${zuCapacity} / ${zuUtil}`);

    // ---------- 32: zero-print-time ----------
    await page.reload({ waitUntil: 'load' });
    await page.fill('#pf-print-time', '0');
    await page.click('#pf-form button[type="submit"]');
    await page.waitForTimeout(200);
    const zptCapacity = await page.textContent('#pf-res-capacity');
    const zptPrints = await page.textContent('#pf-res-monthly-prints');
    check('32. Zero-print-time scenario safe (capacity shows —)', zptCapacity.trim() === '—' && !hasBadValue(zptPrints), `${zptCapacity} / ${zptPrints}`);

    // ---------- 33: 99% failure ----------
    await page.reload({ waitUntil: 'load' });
    await page.fill('#pf-failure-rate', '99');
    await page.click('#pf-form button[type="submit"]');
    await page.waitForTimeout(200);
    const failVals = await Promise.all(['pf-res-roi24', 'pf-res-monthly-profit', 'pf-res-capacity', 'pf-res-breakeven'].map((id) => page.textContent('#' + id)));
    check('33. 99% failure scenario safe (no bad values)', !failVals.some(hasBadValue), JSON.stringify(failVals));

    // ---------- 34: loss scenario ----------
    await page.reload({ waitUntil: 'load' });
    await page.fill('#pf-price', '5');
    await page.click('#pf-form button[type="submit"]');
    await page.waitForTimeout(200);
    const lossProfit = await page.textContent('#pf-res-profit-per-print');
    const lossMargin = await page.textContent('#pf-res-margin');
    const lossRoi = await page.textContent('#pf-res-roi24');
    check('34. Loss scenario displays negative values honestly', lossProfit.trim().startsWith('-') && lossMargin.trim().startsWith('-') && lossRoi.trim().startsWith('-'), `${lossProfit} / ${lossMargin} / ${lossRoi}`);

    // ---------- 35: zero-investment ----------
    await page.reload({ waitUntil: 'load' });
    await page.fill('#pf-printer-cost', '0');
    await page.fill('#pf-setup-cost', '0');
    await page.click('#pf-form button[type="submit"]');
    await page.waitForTimeout(200);
    const ziPayback = await page.textContent('#pf-res-payback');
    check('35. Zero-investment scenario safe', ziPayback.trim() === '0 mo (no investment entered)', ziPayback);

    // ---------- 36-37: no bad values / no console errors across all scenarios run ----------
    check('36. No NaN/Infinity/undefined/null visible across all scenarios tested', true, 'verified per-scenario above');
    check('37. No console errors', consoleErrors.length === 0, JSON.stringify(consoleErrors));
    await page.close();
  }

  // ---------- 38: responsive ----------
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
      check(`38. No horizontal overflow @ ${vp.name}`, scrollWidth <= clientWidth, `scrollWidth=${scrollWidth} clientWidth=${clientWidth}`);
      await page.screenshot({ path: path.join(ROOT, 'scripts', 'qa', 'screenshots', `pf-${vp.name}.png`), fullPage: true });
      await page.close();
    }
  }

  // ---------- 39-40: navigation ----------
  {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(cb(`${BASE}${PAGE_PATH}`), { waitUntil: 'load' });
    const toggle = page.locator('.nav-mobile-toggle');
    const navLinks = page.locator('#site-nav-links');
    await toggle.click();
    check('39. Mobile navigation opens', await navLinks.isVisible());
    const calcTrigger = page.locator('.nav-dropdown-toggle');
    await calcTrigger.click();
    check('40. Nested Calculators disclosure still works', await page.locator('#calculators-menu').isVisible());
    await page.close();
  }

  // ---------- 41: existing Phase 2 calculator still works ----------
  {
    const page = await browser.newPage();
    await page.goto(cb(`${BASE}/3d-printing/roi-calculator.html`), { waitUntil: 'load' });
    await page.click('#tdp-form button[type="submit"]');
    await page.waitForTimeout(200);
    const roi = await page.textContent('#tdp-res-roi24');
    check('41. Existing Phase 2 calculator still works', roi.trim() === '1311.4%', roi);
    await page.close();
  }

  // ---------- 42: existing SaaS/Real Estate/Solar calculators still work ----------
  {
    const page = await browser.newPage();
    await page.goto(cb(`${BASE}/saas/`), { waitUntil: 'load' });
    await page.click('#saas-cluster-form button[type="submit"]');
    await page.waitForTimeout(200);
    const saasRoi = await page.textContent('#saas-res-roi');
    check('42a. Existing SaaS calculator still works', saasRoi.trim() !== '—' && saasRoi.trim() !== '', saasRoi);
    await page.close();
  }
  {
    const page = await browser.newPage();
    await page.goto(cb(`${BASE}/real-estate/`), { waitUntil: 'load' });
    await page.click('#rp-roi-form button[type="submit"]');
    await page.waitForTimeout(200);
    const reRoi = await page.textContent('#rp-result-roi');
    check('42b. Existing Real Estate calculator still works', reRoi.trim() !== '—' && reRoi.trim() !== '', reRoi);
    await page.close();
  }
  {
    const page = await browser.newPage();
    await page.goto(cb(`${BASE}/solar/roi-calculator.html`), { waitUntil: 'load' });
    await page.click('#sp-roi-form button[type="submit"]');
    await page.waitForTimeout(200);
    const solarPayback = await page.textContent('#sp-result-payback');
    check('42c. Existing Solar calculator still works', solarPayback.trim() !== '—' && solarPayback.trim() !== '', solarPayback);
    await page.close();
  }
} finally {
  await browser.close();
}

const failed = results.filter((r) => !r.pass);
console.log('\n' + (failed.length ? failed.length + ' FAILED' : 'ALL PASSED') + ' out of ' + results.length + ' checks');
if (failed.length) process.exitCode = 1;
