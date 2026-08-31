// Phase 4 — 3D Print Service Pricing Calculator QA.
// Verifies the exact contract in the chat brief "PHASE 4 — 3D PRINT SERVICE
// PRICING CALCULATOR". Run locally before deploy, then again with
// PHASE3DSERVICE_BASE=https://roicalculator.live after deploy (cache-busted).
//
// Independently derived default-scenario expected values (brief §7 — computed
// by hand/Node BEFORE implementation, from the formulas in the brief, NOT
// from the JavaScript under test):
//   materialCost=2.5, electricityCost=0.18, depreciationCost=1.6, laborCost=25
//   baseCost=34.28, failureFactor=1/(1-0.05)=1.052631578947...
//   costBeforeFees=34.28*1.052631578947=36.084210526315786
//   priceDenominator=1-0.05-0.30=0.65
//   recommendedPrice=36.084210526315786/0.65=55.51417004048583 -> "$55.51"
//   platformFee=55.51417004048583*0.05=2.7757085020242918 -> "$2.78"
//   expectedProfit=recommendedPrice-platformFee-costBeforeFees=16.65425101214575 -> "$16.65"
//   profitMargin=(expectedProfit/recommendedPrice)*100=30 (exact, by construction) -> "30.0%"
//   effectiveHourlyEarnings=expectedProfit/(8+1)=1.850472334682861 -> "$1.85"
//   pricePerPrintedHour=recommendedPrice/8=6.939271255060729 -> "$6.94"
//   minimumViablePrice=costBeforeFees/(1-0.05)=37.98337950138504 -> "$37.98"
//   pricePerPart=recommendedPrice/1=55.51417004048583 -> "$55.51"
//   failureAllowanceCost=costBeforeFees-baseCost=1.804210526315786 -> "$1.80"
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', '..');
const BASE = process.env.PHASE3DSERVICE_BASE || 'http://127.0.0.1:8791';
const PAGE_PATH = '/3d-printing/service-pricing-calculator.html';

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

// ---------- Source-level checks ----------
const htmlPath = path.join(ROOT, '3d-printing', 'service-pricing-calculator.html');
const jsPath = path.join(ROOT, 'assets', 'js', '3d-printing-service-pricing-calculator.js');
const html = fs.readFileSync(htmlPath, 'utf8');

check('Page exists', fs.existsSync(htmlPath));
check('JS exists', fs.existsSync(jsPath));

const calculatorsJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'calculators.json'), 'utf8'));
check(
  'Page is not in calculators.json',
  !calculatorsJson.some((c) => /service.?pricing/i.test(c.slug || '') || /service.?pricing/i.test(c.title || ''))
);

check('Exact title', html.includes('<title>3D Print Service Pricing Calculator | Calculate Your Print Price</title>'));
check('Exact H1', /<h1>3D Print Service Pricing Calculator<\/h1>/.test(html));
check(
  'Exact hero subtitle',
  html.includes('Calculate a 3D-printing job price from material, machine time, labor, overhead, fees, and your target profit margin.')
);
check(
  'Exact meta description',
  html.includes(
    'Calculate a 3D-printing service price from material, machine time, labor, overhead, fees, and target profit margin. Estimate cost, profit, margin, and hourly earnings.'
  )
);
check('No ad slots', !html.includes('class="ad-slot'));
check('No AdSense script', !html.includes('adsbygoogle') && !html.includes('pagead2.googlesyndication'));
check('No privacy badge', !html.includes('badge-privacy'));
check('No sticky CTA', !html.includes('sticky'));
check('No "Quick Answer" text', !html.includes('Quick Answer'));
check('No "AI Answer" text', !html.includes('AI Answer'));
check('No "At a Glance" text', !html.includes('At a Glance'));
check('No AEO answer box (.aeo-answer-block / .ai-answer-block)', !html.includes('aeo-answer-block') && !html.includes('ai-answer-block'));
check('No "What is ROI?" in visible content', !html.includes('What is ROI?'));
check('No breadcrumb', !html.includes('class="breadcrumb"'));
check('No analytics/tracking script', !html.includes('gtag') && !html.includes('google-analytics') && !html.includes('googletagmanager'));

const expectedFaqQuestions = [
  'What costs should I include when pricing a 3D print service job?',
  'How does a failed print affect the price I should charge?',
  'How should I account for labor and post-processing time?',
  'What is the difference between minimum viable price and recommended price?'
];
check('Exactly 4 FAQ questions present in source, verbatim', expectedFaqQuestions.every((q) => html.includes(q)));

// ---------- Sitemap / scope ----------
const sitemapXml = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
check('Sitemap contains canonical', sitemapXml.includes('https://roicalculator.live/3d-printing/service-pricing-calculator.html'));

const forbiddenPaths = [
  '3d-printing/index.html',
  '3d-printing/printer-payback-calculator.html',
  '3d-printing/profit-margin-calculator.html'
];
check('No future cluster pages created', forbiddenPaths.every((p) => !fs.existsSync(path.join(ROOT, p))));
check('Phase 2 page unchanged (still exists)', fs.existsSync(path.join(ROOT, '3d-printing', 'roi-calculator.html')));
check('Phase 3 page unchanged (still exists)', fs.existsSync(path.join(ROOT, '3d-printing', 'print-farm-roi-calculator.html')));
check('Phase 2 JS unchanged (still exists)', fs.existsSync(path.join(ROOT, 'assets', 'js', '3d-printing-roi-calculator.js')));
check('Phase 3 JS unchanged (still exists)', fs.existsSync(path.join(ROOT, 'assets', 'js', '3d-printing-print-farm-roi-calculator.js')));

const browser = await chromium.launch({ channel: 'chrome' });
try {
  // ---------- A: Page load ----------
  {
    const page = await browser.newPage();
    const consoleErrors = [];
    page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    page.on('pageerror', (e) => consoleErrors.push(String(e)));
    const resp = await page.goto(cb(`${BASE}${PAGE_PATH}`), { waitUntil: 'load' });
    check('A: HTTP 200', resp && resp.ok(), resp && resp.status());
    check('A: title correct', (await page.title()) === '3D Print Service Pricing Calculator | Calculate Your Print Price');
    check('A: H1 correct', (await page.textContent('h1')).trim() === '3D Print Service Pricing Calculator');
    const canonical = await page.getAttribute('link[rel="canonical"]', 'href');
    check('A: canonical correct', canonical === 'https://roicalculator.live/3d-printing/service-pricing-calculator.html', canonical);
    check('A: no console errors on load', consoleErrors.length === 0, JSON.stringify(consoleErrors));
    await page.close();
  }

  // ---------- JS 200 ----------
  {
    const page = await browser.newPage();
    const resp = await page.goto(cb(`${BASE}/assets/js/3d-printing-service-pricing-calculator.js`));
    check('JS loads with 200', resp && resp.ok(), resp && resp.status());
    await page.close();
  }

  // ---------- B: default validity ----------
  {
    const page = await browser.newPage();
    await page.goto(cb(`${BASE}${PAGE_PATH}`), { waitUntil: 'load' });
    const validity = await page.evaluate(() => {
      const form = document.getElementById('sp-form');
      const invalids = [];
      for (const input of form.querySelectorAll('input')) {
        if (!input.checkValidity()) invalids.push({ id: input.id, value: input.value, msg: input.validationMessage });
      }
      return { formValid: form.checkValidity(), invalids };
    });
    check('B: every default input passes checkValidity()', validity.formValid && validity.invalids.length === 0, JSON.stringify(validity.invalids));
    await page.close();
  }

  // ---------- C: default calculation vs independently derived values ----------
  {
    const page = await browser.newPage();
    const consoleErrors = [];
    page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    page.on('pageerror', (e) => consoleErrors.push(String(e)));
    await page.goto(cb(`${BASE}${PAGE_PATH}`), { waitUntil: 'load' });
    await page.click('#sp-form button[type="submit"]');
    await page.waitForTimeout(200);

    const price = await page.textContent('#sp-res-price');
    const minPrice = await page.textContent('#sp-res-min-price');
    const profit = await page.textContent('#sp-res-profit');
    const margin = await page.textContent('#sp-res-margin');
    const hourly = await page.textContent('#sp-res-hourly');
    const pricePerHour = await page.textContent('#sp-res-price-per-hour');
    const pricePerPart = await page.textContent('#sp-res-price-per-part');

    check('C: recommended price visible, not placeholder', price.trim() !== '—' && price.trim() !== '');
    check('C: recommended price matches independently derived value ($55.51)', price.trim() === '$55.51', price);
    check('C: minimum viable price matches ($37.98)', minPrice.trim() === '$37.98', minPrice);
    check('C: expected profit matches ($16.65)', profit.trim() === '$16.65', profit);
    check('C: profit margin matches (30.0%)', margin.trim() === '30.0%', margin);
    check('C: effective hourly earnings matches ($1.85)', hourly.trim() === '$1.85', hourly);
    check('C: price per printed hour matches ($6.94)', pricePerHour.trim() === '$6.94', pricePerHour);
    check('C: price per part matches ($55.51)', pricePerPart.trim() === '$55.51', pricePerPart);
    check('C: no NaN/Infinity in any default result', ![price, minPrice, profit, margin, hourly, pricePerHour, pricePerPart].some(hasBadValue));

    const bdMaterial = await page.textContent('#sp-bd-material');
    const bdElectricity = await page.textContent('#sp-bd-electricity');
    const bdDepreciation = await page.textContent('#sp-bd-depreciation');
    const bdLabor = await page.textContent('#sp-bd-labor');
    const bdOverhead = await page.textContent('#sp-bd-overhead');
    const bdFailure = await page.textContent('#sp-bd-failure');
    const bdCostBeforeFees = await page.textContent('#sp-bd-cost-before-fees');
    const bdPlatformFee = await page.textContent('#sp-bd-platform-fee');
    const bdPrice = await page.textContent('#sp-bd-price');
    check('C: cost breakdown material matches ($2.50)', bdMaterial.trim() === '$2.50', bdMaterial);
    check('C: cost breakdown electricity matches ($0.18)', bdElectricity.trim() === '$0.18', bdElectricity);
    check('C: cost breakdown depreciation matches ($1.60)', bdDepreciation.trim() === '$1.60', bdDepreciation);
    check('C: cost breakdown labor matches ($25.00)', bdLabor.trim() === '$25.00', bdLabor);
    check('C: cost breakdown overhead matches ($5.00)', bdOverhead.trim() === '$5.00', bdOverhead);
    check('C: cost breakdown failure allowance matches ($1.80)', bdFailure.trim() === '$1.80', bdFailure);
    check('C: cost breakdown production cost matches ($36.08)', bdCostBeforeFees.trim() === '$36.08', bdCostBeforeFees);
    check('C: cost breakdown platform fee matches ($2.78)', bdPlatformFee.trim() === '$2.78', bdPlatformFee);
    check('C: cost breakdown recommended price matches ($55.51)', bdPrice.trim() === '$55.51', bdPrice);

    const interpretation = await page.textContent('#sp-res-interpretation');
    check(
      'C: interpretation is factual and mentions 30.0% margin',
      interpretation.includes('30.0%') && !/great|excellent|smart|ideal|highly profitable/i.test(interpretation),
      interpretation
    );

    check('C: no console errors', consoleErrors.length === 0, JSON.stringify(consoleErrors));
    await page.close();
  }

  // ---------- D: modified scenario — direction checks ----------
  {
    const page = await browser.newPage();
    await page.goto(cb(`${BASE}${PAGE_PATH}`), { waitUntil: 'load' });
    await page.click('#sp-form button[type="submit"]');
    await page.waitForTimeout(200);
    const basePrice = parseFloat((await page.textContent('#sp-res-price')).replace(/[^0-9.]/g, ''));

    await page.fill('#sp-material-grams', '500');
    await page.fill('#sp-print-time', '20');
    await page.fill('#sp-labor-rate', '50');
    await page.fill('#sp-target-margin', '50');
    await page.fill('#sp-platform-fee', '10');
    await page.fill('#sp-failure-rate', '20');
    await page.click('#sp-form button[type="submit"]');
    await page.waitForTimeout(200);
    const newPrice = parseFloat((await page.textContent('#sp-res-price')).replace(/[^0-9.]/g, ''));
    check('D: increasing material/time/labor/margin/fee/failure increases recommended price', newPrice > basePrice, `${basePrice} -> ${newPrice}`);
    await page.close();
  }

  // ---------- E: edge cases ----------
  const edgeCases = [
    ['zero material', { 'sp-material-grams': '0' }],
    ['zero print time', { 'sp-print-time': '0' }],
    ['zero labor', { 'sp-setup-hours': '0' }],
    ['zero overhead', { 'sp-overhead': '0' }],
    ['zero failure rate', { 'sp-failure-rate': '0' }],
    ['high failure rate (95%)', { 'sp-failure-rate': '95' }],
    ['platform fee + target margin >= 100%', { 'sp-platform-fee': '50', 'sp-target-margin': '60' }],
    ['zero platform fee', { 'sp-platform-fee': '0' }],
    ['zero target margin', { 'sp-target-margin': '0' }],
    ['multiple printed parts (5)', { 'sp-printed-parts': '5' }]
  ];
  for (const [name, fills] of edgeCases) {
    const page = await browser.newPage();
    const consoleErrors = [];
    page.on('pageerror', (e) => consoleErrors.push(String(e)));
    await page.goto(cb(`${BASE}${PAGE_PATH}`), { waitUntil: 'load' });
    for (const [id, val] of Object.entries(fills)) {
      await page.fill('#' + id, val);
    }
    await page.click('#sp-form button[type="submit"]');
    await page.waitForTimeout(200);
    const vals = await Promise.all(
      ['sp-res-price', 'sp-res-min-price', 'sp-res-profit', 'sp-res-margin', 'sp-res-hourly', 'sp-res-price-per-hour', 'sp-res-price-per-part'].map((id) =>
        page.textContent('#' + id)
      )
    );
    check(`E: ${name} — no NaN/Infinity, no console errors`, !vals.some(hasBadValue) && consoleErrors.length === 0, JSON.stringify(vals));
    await page.close();
  }
  // Explicit check for the fee+margin>=100% guard message
  {
    const page = await browser.newPage();
    await page.goto(cb(`${BASE}${PAGE_PATH}`), { waitUntil: 'load' });
    await page.fill('#sp-platform-fee', '50');
    await page.fill('#sp-target-margin', '60');
    await page.click('#sp-form button[type="submit"]');
    await page.waitForTimeout(200);
    const price = await page.textContent('#sp-res-price');
    const interpretation = await page.textContent('#sp-res-interpretation');
    check('E: fee+margin>=100% shows "—" for recommended price', price.trim() === '—', price);
    check('E: fee+margin>=100% shows explanatory validation message', interpretation.toLowerCase().includes('100%'), interpretation);
    await page.close();
  }

  // ---------- F: responsive ----------
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
      check(`F: no horizontal overflow @ ${vp.name}`, scrollWidth <= clientWidth, `scrollWidth=${scrollWidth} clientWidth=${clientWidth}`);
      await page.screenshot({ path: path.join(ROOT, 'scripts', 'qa', 'screenshots', `sp-${vp.name}.png`), fullPage: true });
      await page.close();
    }
  }

  // ---------- G: keyboard ----------
  {
    const page = await browser.newPage();
    await page.goto(cb(`${BASE}${PAGE_PATH}`), { waitUntil: 'load' });
    let tabs = 0;
    let reachedButton = false;
    while (tabs < 60) {
      await page.keyboard.press('Tab');
      tabs++;
      const isButton = await page.evaluate(() => document.activeElement && document.activeElement.type === 'submit');
      if (isButton) {
        reachedButton = true;
        break;
      }
    }
    check('G: Calculate button reachable via keyboard', reachedButton, `${tabs} tabs`);
    if (reachedButton) {
      await page.keyboard.press('Enter');
      await page.waitForTimeout(200);
      const price = await page.textContent('#sp-res-price');
      check('G: Calculate button operable via keyboard (Enter triggers calculation)', price.trim() === '$55.51', price);
    }
    await page.close();
  }

  // ---------- Schema ----------
  {
    const page = await browser.newPage();
    await page.goto(cb(`${BASE}${PAGE_PATH}`), { waitUntil: 'load' });
    const visibleFaq = await page.$$eval('.faq-list .faq-item h3', (els) => els.map((e) => e.textContent.trim()));
    check('FAQ visible with exactly the 4 expected questions', expectedFaqQuestions.every((q) => visibleFaq.includes(q)) && visibleFaq.length === 4, JSON.stringify(visibleFaq));

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
    check('WebPage JSON-LD exists', webPageOk);
    check('FAQPage JSON-LD (if present) exactly matches visible FAQ', !faqOk || faqMatchesVisible);
    await page.close();
  }

  // ---------- Existing-site regression ----------
  {
    const page = await browser.newPage();
    await page.goto(cb(`${BASE}/`), { waitUntil: 'load' });
    await page.fill('#initial-investment', '10000');
    await page.fill('#final-value', '15000');
    await page.click('#roi-form button[type="submit"]');
    await page.waitForTimeout(200);
    check('Regression: homepage calculator still works', (await page.textContent('#result-roi')).trim().startsWith('50'));
    await page.close();
  }
  {
    const page = await browser.newPage();
    await page.goto(cb(`${BASE}/3d-printing/roi-calculator.html`), { waitUntil: 'load' });
    await page.click('#tdp-form button[type="submit"]');
    await page.waitForTimeout(200);
    check('Regression: Phase 2 3D-printing ROI calculator still works', (await page.textContent('#tdp-res-roi24')).trim() === '1311.4%');
    await page.close();
  }
  {
    const page = await browser.newPage();
    await page.goto(cb(`${BASE}/3d-printing/print-farm-roi-calculator.html`), { waitUntil: 'load' });
    await page.click('#pf-form button[type="submit"]');
    await page.waitForTimeout(200);
    check('Regression: Phase 3 print-farm calculator still works', (await page.textContent('#pf-res-roi24')).trim() === '1022.0%');
    await page.close();
  }
  {
    const page = await browser.newPage();
    await page.goto(cb(`${BASE}/saas/`), { waitUntil: 'load' });
    await page.click('#saas-cluster-form button[type="submit"]');
    await page.waitForTimeout(200);
    const roi = await page.textContent('#saas-res-roi');
    check('Regression: SaaS reference calculator still works', roi.trim() !== '—' && roi.trim() !== '', roi);
    await page.close();
  }
  {
    const page = await browser.newPage();
    await page.goto(cb(`${BASE}/real-estate/`), { waitUntil: 'load' });
    await page.click('#rp-roi-form button[type="submit"]');
    await page.waitForTimeout(200);
    const roi = await page.textContent('#rp-result-roi');
    check('Regression: Real Estate reference calculator still works', roi.trim() !== '—' && roi.trim() !== '', roi);
    await page.close();
  }
  {
    const page = await browser.newPage();
    await page.goto(cb(`${BASE}/solar/roi-calculator.html`), { waitUntil: 'load' });
    await page.click('#sp-roi-form button[type="submit"]');
    await page.waitForTimeout(200);
    const payback = await page.textContent('#sp-result-payback');
    check('Regression: Solar reference calculator still works', payback.trim() !== '—' && payback.trim() !== '', payback);
    await page.close();
  }
  {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(cb(`${BASE}/`), { waitUntil: 'load' });
    const trigger = page.locator('.nav-dropdown-toggle');
    await trigger.click();
    check('Regression: desktop navigation still works', await page.locator('#calculators-menu').isVisible());
    await page.close();
  }
  {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(cb(`${BASE}/`), { waitUntil: 'load' });
    const toggle = page.locator('.nav-mobile-toggle');
    await toggle.click();
    check('Regression: mobile navigation still works', await page.locator('#site-nav-links').isVisible());
    await page.close();
  }
} finally {
  await browser.close();
}

const failed = results.filter((r) => !r.pass);
console.log('\n' + (failed.length ? failed.length + ' FAILED' : 'ALL PASSED') + ' out of ' + results.length + ' checks');
if (failed.length) process.exitCode = 1;
