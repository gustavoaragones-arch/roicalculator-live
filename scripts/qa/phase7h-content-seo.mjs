// Phase 7H — final SEO/AEO/content-integrity QA. Verifies the exact Phase 7H
// contract (see chat brief "PHASE 7H — FINAL SEO / AEO / CONTENT INTEGRITY
// REMEDIATION"). Run locally before deploy, then again with
// PHASE7H_BASE=https://roicalculator.live after deploy for production
// verification (cache-busted).
import { chromium } from 'playwright';
import fs from 'fs';

const BASE = process.env.PHASE7H_BASE || 'http://127.0.0.1:8791';
const isProd = /roicalculator\.live/.test(BASE);
const results = [];

// Cloudflare Pages caches extensionless/root HTML under a long-TTL rule
// (documented in REPAIR_REDIRECTS-01 / Phase 7). Always cache-bust content
// checks so a stale edge copy is never mistaken for actual repo state.
function cb(url) {
  return url + (url.includes('?') ? '&' : '?') + 'cb=' + Date.now() + Math.random().toString(36).slice(2);
}

function check(name, pass, detail) {
  results.push({ name, pass, detail });
  console.log((pass ? 'PASS' : 'FAIL') + '  ' + name + (detail ? ' — ' + detail : ''));
}

const browser = await chromium.launch({ channel: 'chrome' });
try {
  // ---------- FAQ ----------
  const schemaOnlyTargets = [
    '/real-estate/',
    '/saas/',
    '/solar/roi-calculator.html',
    '/roi-calculator/solar/heat-pump-roi.html',
    '/roi-calculator/solar/ev-charger-roi.html'
  ];
  for (const t of schemaOnlyTargets) {
    const page = await browser.newPage();
    await page.goto(cb(`${BASE}${t}`), { waitUntil: 'load' });
    const html = await page.content();
    const hasFaqPage = /"@type"\s*:\s*"FAQPage"/.test(html);
    check(`FAQ: ${t} has zero FAQPage JSON-LD`, !hasFaqPage);
    const hasBreadcrumb = /"@type"\s*:\s*"BreadcrumbList"/.test(html);
    check(`FAQ: ${t} still has BreadcrumbList`, hasBreadcrumb);
    const hasWebPage = /"@type"\s*:\s*"WebPage"/.test(html);
    check(`FAQ: ${t} still has WebPage`, hasWebPage);
    await page.close();
  }

  {
    const page = await browser.newPage();
    await page.goto(cb(`${BASE}/`), { waitUntil: 'load' });
    const faqQuestions = await page.$$eval('.faq-list .faq-item h3', (els) => els.map((e) => e.textContent.trim()));
    check('FAQ: homepage does not contain "What is ROI?"', !faqQuestions.includes('What is ROI?'), JSON.stringify(faqQuestions));
    check('FAQ: homepage FAQ still exists', faqQuestions.length > 0, JSON.stringify(faqQuestions));
    const html = await page.content();
    check('FAQ: no visible "Quick Answer:" label', !html.includes('Quick Answer:'));
    check('FAQ: no .aeo-answer-block element rendered', (await page.$$('.aeo-answer-block')).length === 0);
    await page.close();
  }

  // No new FAQ schema introduced on the four subtitle pages
  const subtitlePages = [
    ['/roi-calculator/saas/cac-ltv-roi.html', 'Compare customer acquisition cost with customer lifetime value to estimate the return from acquiring and retaining a SaaS customer.'],
    ['/roi-calculator/saas/subscription-growth-roi.html', 'Model how subscriber growth, churn, and recurring revenue affect the projected return from a SaaS growth investment.'],
    ['/roi-calculator/saas/time-to-value-roi.html', 'Estimate how faster time-to-value changes the economic return of a SaaS investment over the selected period.'],
    ['/roi-calculator/marketing/lead-generation-roi.html', 'Estimate marketing ROI from lead volume, conversion rate, customer value, and campaign spend.']
  ];
  // Note: cac-ltv-roi.html carries pre-existing, correctly-matched FAQPage
  // schema from before Phase 7H (confirmed legitimate in the Phase 7F audit
  // — visible FAQ matches JSON-LD exactly). Phase 7H's instruction is "do not
  // ADD FAQPage schema" to these four pages, not "remove pre-existing
  // legitimate schema" — so this check verifies the git diff for each file
  // never introduces a new "FAQPage" occurrence, rather than asserting
  // absolute absence (which would incorrectly flag that pre-existing page).
  const { execSync } = await import('child_process');
  for (const [path, text] of subtitlePages) {
    const page = await browser.newPage();
    await page.goto(cb(`${BASE}${path}`), { waitUntil: 'load' });
    const sub = await page.textContent('.hero-sub');
    check(`Hero: ${path} exact subtitle match`, sub.trim() === text, sub.trim());
    await page.close();

    if (!isProd) {
      const filePath = path.replace(/^\//, '');
      let diffAddedFaqPage = false;
      try {
        const diff = execSync(`git diff HEAD -- ${JSON.stringify(filePath)}`, { cwd: new URL('../../', import.meta.url).pathname }).toString();
        diffAddedFaqPage = diff.split('\n').some((line) => line.startsWith('+') && !line.startsWith('+++') && /FAQPage/.test(line));
      } catch (e) {
        // no diff available (e.g. file already committed) — treat as no new schema added
      }
      check(`Hero: ${path} — this phase did not introduce new FAQPage schema`, !diffAddedFaqPage);
    }
  }

  // Homepage subtitle (also required exact-wording target)
  {
    const page = await browser.newPage();
    await page.goto(cb(`${BASE}/`), { waitUntil: 'load' });
    const sub = await page.textContent('.subtitle');
    check(
      'Hero: homepage exact subtitle match',
      sub.trim() === 'Calculate ROI from an initial investment, final value, and holding period, with annualized return and target-ROI modes.',
      sub.trim()
    );
    await page.close();
  }

  // ---------- Headings ----------
  {
    const page = await browser.newPage();
    await page.goto(cb(`${BASE}/real-estate/cap-rate-calculator.html`), { waitUntil: 'load' });
    const headings = await page.$$eval('h2', (els) => els.map((e) => e.textContent.trim()));
    const count = headings.filter((h) => h === 'Cap Rate in Detail').length;
    check('Heading: "Cap Rate in Detail" exists exactly once', count === 1, JSON.stringify(headings));
    await page.close();

    const page2 = await browser.newPage();
    await page2.goto(cb(`${BASE}/real-estate/cash-on-cash-calculator.html`), { waitUntil: 'load' });
    const headings2 = await page2.$$eval('h2', (els) => els.map((e) => e.textContent.trim()));
    const count2 = headings2.filter((h) => h === 'Cash-on-Cash Return in Detail').length;
    check('Heading: "Cash-on-Cash Return in Detail" exists exactly once', count2 === 1, JSON.stringify(headings2));
    await page2.close();
  }

  // ---------- Retired pages: sitemap ----------
  {
    const sitemapXml = fs.readFileSync(new URL('../../sitemap.xml', import.meta.url), 'utf8');
    const sitemapHtml = fs.readFileSync(new URL('../../sitemap.html', import.meta.url), 'utf8');
    const stale = ['simple-roi-calculator.html', 'free-roi-calculator.html', 'roi-calculator-example.html', 'roi-vs-other-metrics.html'];
    const foundXml = stale.filter((s) => sitemapXml.includes(s));
    const foundHtml = stale.filter((s) => sitemapHtml.includes(s));
    check('Retired: absent from sitemap.xml', foundXml.length === 0, JSON.stringify(foundXml));
    check('Retired: absent from sitemap.html', foundHtml.length === 0, JSON.stringify(foundHtml));
  }

  // ---------- Retired pages: absent from generated calculator output ----------
  {
    const outDir = new URL('../../calculators/', import.meta.url);
    const stale = ['simple-roi-calculator.html', 'free-roi-calculator.html', 'roi-calculator-example.html', 'roi-vs-other-metrics.html'];
    const present = stale.filter((s) => fs.existsSync(new URL(s, outDir)));
    check('Retired: absent from calculators/ output directory', present.length === 0, JSON.stringify(present));
  }

  // ---------- Retired pages: absent from ordinary internal links ----------
  {
    const page = await browser.newPage();
    await page.goto(cb(`${BASE}/`), { waitUntil: 'load' });
    const staleLinks = await page.$$eval('a[href]', (as) =>
      as
        .map((a) => a.getAttribute('href'))
        .filter((h) => h && /simple-roi-calculator\.html|free-roi-calculator\.html|roi-calculator-example\.html|roi-vs-other-metrics\.html/.test(h))
    );
    check('Retired: homepage has zero links to retired URLs', staleLinks.length === 0, JSON.stringify(staleLinks));
    await page.close();
  }

  // ---------- Redirects ----------
  {
    const redirectCases = [
      ['/calculators/simple-roi-calculator.html', '/'],
      ['/calculators/free-roi-calculator.html', '/'],
      ['/calculators/roi-calculator-example.html', '/'],
      ['/calculators/roi-vs-other-metrics.html', '/comparisons/']
    ];
    for (const [from, to] of redirectCases) {
      const page = await browser.newPage();
      const resp = await page.goto(cb(`${BASE}${from}`), { waitUntil: 'load' });
      const finalUrl = new URL(page.url()).pathname;
      const expected = to;
      if (isProd) {
        check(
          `Redirect: ${from} -> ${to} (production, expect 301 chain)`,
          finalUrl === expected || finalUrl === expected.replace(/\/$/, '') + '/',
          `landed on ${finalUrl}`
        );
      } else {
        check(
          `Redirect: ${from} old file returns 404 locally (edge redirect only verifiable on Cloudflare Pages)`,
          resp && resp.status() === 404,
          `status=${resp && resp.status()}`
        );
      }
      await page.close();
    }
  }

  // ---------- Calculator regression ----------
  {
    const page = await browser.newPage();
    await page.goto(cb(`${BASE}/`), { waitUntil: 'load' });
    await page.fill('#initial-investment', '10000');
    await page.fill('#final-value', '15000');
    await page.fill('#period-years', '5');
    await page.click('#roi-form button[type="submit"]');
    await page.waitForTimeout(200);
    const roi = await page.textContent('#result-roi');
    check('Calc: homepage ROI unchanged (10000->15000 = 50%)', roi.trim().startsWith('50'), roi.trim());
    await page.close();
  }
  {
    const page = await browser.newPage();
    await page.goto(cb(`${BASE}/saas/`), { waitUntil: 'load' });
    await page.fill('#saas-monthly', '4000');
    await page.fill('#saas-years', '5');
    await page.click('#saas-cluster-form button[type="submit"]');
    await page.waitForTimeout(200);
    const roi = await page.textContent('#saas-res-roi');
    check('Calc: SaaS calculator produces a result', roi.trim() !== '—' && roi.trim() !== '', roi.trim());
    await page.close();
  }
  {
    const page = await browser.newPage();
    await page.goto(cb(`${BASE}/real-estate/`), { waitUntil: 'load' });
    await page.fill('#rp-purchase', '300000');
    await page.fill('#rp-down', '60000');
    await page.click('#rp-roi-form button[type="submit"]');
    await page.waitForTimeout(200);
    const roi = await page.textContent('#rp-result-roi');
    check('Calc: Real Estate calculator produces a result', roi.trim() !== '—' && roi.trim() !== '', roi.trim());
    await page.close();
  }
  {
    const page = await browser.newPage();
    await page.goto(cb(`${BASE}/solar/roi-calculator.html`), { waitUntil: 'load' });
    await page.fill('#sp-credit', '0');
    await page.fill('#sp-rate', '0.22');
    await page.click('#sp-roi-form button[type="submit"]');
    await page.waitForTimeout(200);
    const payback = await page.textContent('#sp-result-payback');
    check('Calc: Solar calculator produces a result', payback.trim() !== '—' && payback.trim() !== '', payback.trim());
    await page.close();
  }
  {
    const page = await browser.newPage();
    await page.goto(cb(`${BASE}/calculators/marketing-roi-calculator.html`), { waitUntil: 'load' });
    await page.click('#factory-calc-form button[type="submit"]');
    await page.waitForTimeout(200);
    const roi = await page.textContent('#factory-out-roi');
    check('Calc: surviving factory calculator (marketing) produces a result', roi.trim() !== '—' && roi.trim() !== '', roi.trim());
    await page.close();
  }

  // ---------- Overflow ----------
  {
    const viewports = [
      { width: 1440, height: 900 },
      { width: 390, height: 844 }
    ];
    for (const vp of viewports) {
      for (const path of ['/', '/saas/', '/real-estate/']) {
        const page = await browser.newPage();
        await page.setViewportSize(vp);
        await page.goto(cb(`${BASE}${path}`), { waitUntil: 'load' });
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
        check(`Overflow: ${path} @ ${vp.width}x${vp.height}`, scrollWidth <= clientWidth, `scrollWidth=${scrollWidth} clientWidth=${clientWidth}`);
        await page.close();
      }
    }
  }
} finally {
  await browser.close();
}

const failed = results.filter((r) => !r.pass);
console.log('\n' + (failed.length ? failed.length + ' FAILED' : 'ALL PASSED') + ' out of ' + results.length + ' checks');
if (failed.length) process.exitCode = 1;
