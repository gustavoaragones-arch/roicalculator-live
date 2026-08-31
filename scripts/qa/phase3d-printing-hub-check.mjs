// Phase 6 — 3D Printing Hub QA. Verifies the exact contract in the chat brief
// "PHASE 6 — 3D PRINTING HUB + CLUSTER DISCOVERABILITY". Run locally before
// deploy, then again with PHASE3DHUB_BASE=https://roicalculator.live after
// deploy (cache-busted).
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', '..');
const BASE = process.env.PHASE3DHUB_BASE || 'http://127.0.0.1:8791';
const HUB_PATH = '/3d-printing/';

const results = [];
function check(name, pass, detail) {
  results.push({ name, pass, detail });
  console.log((pass ? 'PASS' : 'FAIL') + '  ' + name + (detail ? ' — ' + detail : ''));
}
function cb(url) {
  return url + (url.includes('?') ? '&' : '?') + 'cb=' + Date.now() + Math.random().toString(36).slice(2);
}

// ---------- Source checks ----------
const hubHtmlPath = path.join(ROOT, '3d-printing', 'index.html');
const hubHtml = fs.readFileSync(hubHtmlPath, 'utf8');
check('Hub page exists', fs.existsSync(hubHtmlPath));
check('Hub not added to data/calculators.json', !JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'calculators.json'), 'utf8')).some((c) => /3d.?print/i.test(c.slug || '')));
check('No FAQ where visible FAQ absent — N/A: hub DOES include a visible FAQ', hubHtml.includes('faq-list'));
check('No ad slots', !hubHtml.includes('class="ad-slot'));
check('No AdSense', !hubHtml.includes('adsbygoogle') && !hubHtml.includes('pagead2.googlesyndication'));
check('No privacy badge', !hubHtml.includes('badge-privacy'));
check('No sticky CTA', !hubHtml.includes('sticky'));
check('No "Quick Answer" text', !hubHtml.includes('Quick Answer'));
check('No "AI Answer" text', !hubHtml.includes('AI Answer'));
check('No green AEO card (.aeo-answer-block / .ai-answer-block)', !hubHtml.includes('aeo-answer-block') && !hubHtml.includes('ai-answer-block'));
check('No generic "What is 3D printing?" content', !hubHtml.includes('What is 3D printing?') && !hubHtml.includes('What is a 3D printer?'));
check('No generic "What is ROI?" content', !hubHtml.includes('What is ROI?'));
check('No visible breadcrumb', !hubHtml.includes('class="breadcrumb"'));

const sitemapXml = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
const hubUrlOccurrences = (sitemapXml.match(/https:\/\/roicalculator\.live\/3d-printing\/<\/loc>/g) || []).length;
check('Sitemap contains exactly one hub entry', hubUrlOccurrences === 1, `${hubUrlOccurrences} occurrence(s)`);
check('No /3d-printing/index.html entry in sitemap', !sitemapXml.includes('3d-printing/index.html'));

const browser = await chromium.launch({ channel: 'chrome' });
try {
  // ---------- Hub content checks ----------
  {
    const page = await browser.newPage();
    const consoleErrors = [];
    page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    page.on('pageerror', (e) => consoleErrors.push(String(e)));
    const resp = await page.goto(cb(`${BASE}${HUB_PATH}`), { waitUntil: 'load' });
    check('Hub: HTTP loads', resp && resp.ok(), resp && resp.status());
    check('Hub: title exact', (await page.title()) === '3D Printing Calculators: ROI, Print Farm & Pricing Tools | roicalculator.live');
    check('Hub: H1 exact', (await page.textContent('h1')).trim() === '3D Printing Calculators');
    check('Hub: hero subtitle exact', (await page.textContent('.hero-sub')).trim() === "Choose the right tool for your situation: evaluate a printer purchase, model a multi-printer operation, or price a customer job.");
    const bodyText = await page.textContent('body');
    check('Hub: short intro exact text present', bodyText.includes("These three calculators answer different questions. Use the comparison below to find the one that matches what you're deciding."));
    const canonical = await page.getAttribute('link[rel="canonical"]', 'href');
    check('Hub: canonical exact', canonical === 'https://roicalculator.live/3d-printing/', canonical);
    check('Hub: no visible breadcrumb element', (await page.$('.breadcrumb')) === null);
    check('Hub: no console errors', consoleErrors.length === 0, JSON.stringify(consoleErrors));

    const cards = await page.$$eval('.hub-card', (els) => els.map((e) => ({ href: e.getAttribute('href'), title: e.querySelector('h3').textContent.trim() })));
    check('Hub: exactly 3 calculator cards', cards.length === 3, JSON.stringify(cards));
    const expectedCards = [
      { href: '/3d-printing/roi-calculator.html', title: '3D Printing Business ROI Calculator' },
      { href: '/3d-printing/print-farm-roi-calculator.html', title: '3D Print Farm ROI Calculator' },
      { href: '/3d-printing/service-pricing-calculator.html', title: '3D Print Service Pricing Calculator' }
    ];
    check('Hub: card 1 exact (title + URL)', cards[0] && cards[0].title === expectedCards[0].title && cards[0].href === expectedCards[0].href, JSON.stringify(cards[0]));
    check('Hub: card 2 exact (title + URL)', cards[1] && cards[1].title === expectedCards[1].title && cards[1].href === expectedCards[1].href, JSON.stringify(cards[1]));
    check('Hub: card 3 exact (title + URL)', cards[2] && cards[2].title === expectedCards[2].title && cards[2].href === expectedCards[2].href, JSON.stringify(cards[2]));

    const table = await page.$('.summary-table-box table');
    check('Hub: comparison table exists', table !== null);
    const tableRows = await page.$$eval('.summary-table-box tbody tr', (rows) => rows.length);
    check('Hub: comparison table has exactly 3 rows', tableRows === 3, tableRows);
    const tableLinks = await page.$$eval('.summary-table-box a', (els) => els.map((e) => e.getAttribute('href')));
    check(
      'Hub: comparison table links to all 3 calculators',
      expectedCards.every((c) => tableLinks.includes(c.href)),
      JSON.stringify(tableLinks)
    );
    await page.close();
  }

  // ---------- Comparison table links resolve ----------
  for (const target of [
    '/3d-printing/roi-calculator.html',
    '/3d-printing/print-farm-roi-calculator.html',
    '/3d-printing/service-pricing-calculator.html'
  ]) {
    const page = await browser.newPage();
    const resp = await page.goto(cb(`${BASE}${target}`), { waitUntil: 'load' });
    check(`Link integrity: ${target} resolves with valid content`, resp && resp.ok(), resp && resp.status());
    await page.close();
  }

  // ---------- Link topology: hub -> 3 calculators (already verified above); calculators -> hub ----------
  {
    const page = await browser.newPage();
    await page.goto(cb(`${BASE}/3d-printing/roi-calculator.html`), { waitUntil: 'load' });
    const links = await page.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href')));
    check('Topology: Business ROI links back to hub', links.includes('/3d-printing/'));
    check('Topology: Business ROI links forward to Print Farm ROI', links.includes('/3d-printing/print-farm-roi-calculator.html'));
    check('Topology: Business ROI links forward to Service Pricing', links.includes('/3d-printing/service-pricing-calculator.html'));
    await page.close();
  }
  {
    const page = await browser.newPage();
    await page.goto(cb(`${BASE}/3d-printing/print-farm-roi-calculator.html`), { waitUntil: 'load' });
    const links = await page.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href')));
    check('Topology: Print Farm ROI links back to hub', links.includes('/3d-printing/'));
    await page.close();
  }
  {
    const page = await browser.newPage();
    await page.goto(cb(`${BASE}/3d-printing/service-pricing-calculator.html`), { waitUntil: 'load' });
    const links = await page.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href')));
    check('Topology: Service Pricing links back to hub', links.includes('/3d-printing/'));
    await page.close();
  }

  // ---------- Hub FAQ schema (if present) matches visible ----------
  {
    const page = await browser.newPage();
    await page.goto(cb(`${BASE}${HUB_PATH}`), { waitUntil: 'load' });
    const visibleFaq = await page.$$eval('.faq-list .faq-item h3', (els) => els.map((e) => e.textContent.trim()));
    const content = await page.content();
    const ldBlocks = [...content.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
    let webPageOk = false;
    let faqOk = false;
    let faqMatchesVisible = false;
    for (const block of ldBlocks) {
      const parsed = JSON.parse(block);
      if (parsed['@type'] === 'WebPage') webPageOk = true;
      if (parsed['@type'] === 'FAQPage') {
        faqOk = true;
        const schemaQuestions = (parsed.mainEntity || []).map((q) => q.name);
        faqMatchesVisible = visibleFaq.length === schemaQuestions.length && schemaQuestions.every((q) => visibleFaq.includes(q));
      }
    }
    check('Hub: WebPage JSON-LD exists', webPageOk);
    check('Hub: if FAQPage schema exists, it exactly matches visible FAQ', !faqOk || faqMatchesVisible, `faqOk=${faqOk} visible=${JSON.stringify(visibleFaq)}`);
    check('Hub: visible FAQ is genuinely hub-specific (not generic)', visibleFaq.every((q) => !/what is roi|what is 3d printing|is this calculator free|how is roi calculated/i.test(q)), JSON.stringify(visibleFaq));
    await page.close();
  }

  // ---------- Responsive ----------
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
      await page.goto(cb(`${BASE}${HUB_PATH}`), { waitUntil: 'load' });
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      check(`Responsive: hub no horizontal overflow @ ${vp.name}`, scrollWidth <= clientWidth, `scrollWidth=${scrollWidth} clientWidth=${clientWidth}`);
      await page.screenshot({ path: path.join(ROOT, 'scripts', 'qa', 'screenshots', `hub-${vp.name}.png`), fullPage: true });
      await page.close();
    }
    for (const target of ['/3d-printing/roi-calculator.html', '/3d-printing/print-farm-roi-calculator.html', '/3d-printing/service-pricing-calculator.html']) {
      for (const vp of [{ name: '1440x900', width: 1440, height: 900 }, { name: '390x844', width: 390, height: 844 }]) {
        const page = await browser.newPage();
        await page.setViewportSize(vp);
        await page.goto(cb(`${BASE}${target}`), { waitUntil: 'load' });
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
        check(`Responsive: ${target} no horizontal overflow @ ${vp.name} (after link changes)`, scrollWidth <= clientWidth, `scrollWidth=${scrollWidth} clientWidth=${clientWidth}`);
        await page.close();
      }
    }
  }

  // ---------- Cluster calculator regression ----------
  {
    const page = await browser.newPage();
    await page.goto(cb(`${BASE}/`), { waitUntil: 'load' });
    await page.fill('#initial-investment', '10000');
    await page.fill('#final-value', '15000');
    await page.click('#roi-form button[type="submit"]');
    await page.waitForTimeout(200);
    check('Regression: homepage calculator works', (await page.textContent('#result-roi')).trim().startsWith('50'));
    await page.close();
  }
  {
    const page = await browser.newPage();
    await page.goto(cb(`${BASE}/3d-printing/roi-calculator.html`), { waitUntil: 'load' });
    await page.click('#tdp-form button[type="submit"]');
    await page.waitForTimeout(200);
    check('Regression: Business ROI default = 1311.4%', (await page.textContent('#tdp-res-roi24')).trim() === '1311.4%');
    await page.close();
  }
  {
    const page = await browser.newPage();
    await page.goto(cb(`${BASE}/3d-printing/print-farm-roi-calculator.html`), { waitUntil: 'load' });
    await page.click('#pf-form button[type="submit"]');
    await page.waitForTimeout(200);
    check('Regression: Print Farm ROI default = 1022.0%', (await page.textContent('#pf-res-roi24')).trim() === '1022.0%');
    await page.close();
  }
  {
    const page = await browser.newPage();
    await page.goto(cb(`${BASE}/3d-printing/service-pricing-calculator.html`), { waitUntil: 'load' });
    await page.click('#sp-form button[type="submit"]');
    await page.waitForTimeout(200);
    check('Regression: Service Pricing default = $55.51', (await page.textContent('#sp-res-price')).trim() === '$55.51');
    await page.close();
  }
  {
    const page = await browser.newPage();
    await page.goto(cb(`${BASE}/saas/`), { waitUntil: 'load' });
    await page.click('#saas-cluster-form button[type="submit"]');
    await page.waitForTimeout(200);
    const roi = await page.textContent('#saas-res-roi');
    check('Regression: SaaS calculator works', roi.trim() !== '—' && roi.trim() !== '', roi);
    await page.close();
  }
  {
    const page = await browser.newPage();
    await page.goto(cb(`${BASE}/real-estate/`), { waitUntil: 'load' });
    await page.click('#rp-roi-form button[type="submit"]');
    await page.waitForTimeout(200);
    const roi = await page.textContent('#rp-result-roi');
    check('Regression: Real Estate calculator works', roi.trim() !== '—' && roi.trim() !== '', roi);
    await page.close();
  }
  {
    const page = await browser.newPage();
    await page.goto(cb(`${BASE}/solar/roi-calculator.html`), { waitUntil: 'load' });
    await page.click('#sp-roi-form button[type="submit"]');
    await page.waitForTimeout(200);
    const payback = await page.textContent('#sp-result-payback');
    check('Regression: Solar calculator works', payback.trim() !== '—' && payback.trim() !== '', payback);
    await page.close();
  }

  // ---------- Navigation regression ----------
  {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(cb(`${BASE}/3d-printing/`), { waitUntil: 'load' });
    await page.locator('.nav-dropdown-toggle').click();
    check('Nav: desktop Calculators dropdown works on hub page', await page.locator('#calculators-menu').isVisible());
    check('Nav: hub is NOT in the Calculators dropdown yet (out of scope)', !(await page.locator('#calculators-menu a[href*="3d-printing"]').count()));
    await page.close();
  }
  {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(cb(`${BASE}/3d-printing/`), { waitUntil: 'load' });
    await page.locator('.nav-mobile-toggle').click();
    check('Nav: mobile navigation opens on hub page', await page.locator('#site-nav-links').isVisible());
    await page.locator('.nav-dropdown-toggle').click();
    check('Nav: nested Calculators disclosure works on hub page', await page.locator('#calculators-menu').isVisible());
    await page.close();
  }
} finally {
  await browser.close();
}

const failed = results.filter((r) => !r.pass);
console.log('\n' + (failed.length ? failed.length + ' FAILED' : 'ALL PASSED') + ' out of ' + results.length + ' checks');
if (failed.length) process.exitCode = 1;
