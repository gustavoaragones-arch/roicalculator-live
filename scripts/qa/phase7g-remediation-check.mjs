// Phase 7G — focused QA verifying every acceptance criterion in Part 20 of
// the Phase 7G brief. Run against the LOCAL server before deploy, and again
// (URL-adjusted) against production after deploy.
import { chromium } from 'playwright';
import fs from 'fs';

const BASE = process.env.PHASE7G_BASE || 'http://127.0.0.1:8791';
const results = [];

// Cloudflare Pages' `_headers` rules cache extensionless/root HTML under a
// broad long-TTL rule (documented in REPAIR_REDIRECTS-01 / Phase 7). A plain
// request right after deploy can therefore return a stale cached copy even
// though the deploy itself succeeded. Append a unique query string to every
// production content check so we always read the live edge copy.
function cb(url) {
  return url + (url.includes('?') ? '&' : '?') + 'cb=' + Date.now() + Math.random().toString(36).slice(2);
}

function check(name, pass, detail) {
  results.push({ name, pass, detail });
  console.log((pass ? 'PASS' : 'FAIL') + '  ' + name + (detail ? ' — ' + detail : ''));
}

const browser = await chromium.launch({ channel: 'chrome' });
try {
  // 1-3: homepage FAQ + subtitle
  {
    const page = await browser.newPage();
    await page.goto(cb(`${BASE}/`), { waitUntil: 'load' });
    const faqQuestions = await page.$$eval('.faq-list .faq-item h3', (els) => els.map((e) => e.textContent.trim()));
    check('1. homepage has no FAQ question "What is ROI?"', !faqQuestions.includes('What is ROI?'), JSON.stringify(faqQuestions));
    const expectedRemaining = [
      'How do you calculate annualized ROI?',
      'When can ROI be misleading?',
      'What is a good ROI?',
      'What is the difference between ROI and IRR?'
    ];
    check(
      '2. homepage retains the other legitimate FAQ questions',
      expectedRemaining.every((q) => faqQuestions.includes(q)) && faqQuestions.length === 4,
      JSON.stringify(faqQuestions)
    );
    const subtitle = await page.textContent('.subtitle');
    check(
      '3. homepage subtitle exactly matches approved wording',
      subtitle.trim() === 'Calculate ROI from an initial investment, final value, and holding period, with annualized return and target-ROI modes.',
      subtitle.trim()
    );

    // ROI calculation regression (Part 20.14/20.15)
    await page.fill('#initial-investment', '10000');
    await page.fill('#final-value', '15000');
    await page.fill('#period-years', '5');
    await page.click('#roi-form button[type="submit"]');
    await page.waitForTimeout(200);
    const roi = await page.textContent('#result-roi');
    check('14a. homepage ROI formula unchanged (10000->15000 = 50%)', roi.trim().startsWith('50'), roi.trim());

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    check('16a. no horizontal overflow on homepage', scrollWidth <= clientWidth, `scrollWidth=${scrollWidth} clientWidth=${clientWidth}`);
    await page.close();
  }

  // 4: five schema-only FAQPage blocks gone
  {
    const targets = [
      '/real-estate/',
      '/saas/',
      '/solar/roi-calculator.html',
      '/roi-calculator/solar/heat-pump-roi.html',
      '/roi-calculator/solar/ev-charger-roi.html'
    ];
    for (const t of targets) {
      const page = await browser.newPage();
      await page.goto(cb(`${BASE}${t}`), { waitUntil: 'load' });
      const html = await page.content();
      const hasFaqPage = html.includes('"FAQPage"') || html.includes('"@type": "FAQPage"') || html.includes('"@type":"FAQPage"');
      check(`4. ${t} has no FAQPage JSON-LD`, !hasFaqPage);
      await page.close();
    }
  }

  // 5-8: redirects. The static "_redirects" file is a Cloudflare Pages edge
  // mechanism — a plain `python3 -m http.server` (used for all other local
  // checks in this repo, per REPAIR_REDIRECTS-01) does not honor it, so a
  // 301 hop can only be observed against a real Cloudflare Pages deploy.
  // Locally we instead assert the pre-condition that makes the redirect
  // meaningful: the old file no longer exists to be served (404), so the
  // only way to reach the URL is via the edge redirect rule already written
  // to _redirects/public/_redirects (verified separately in this phase).
  {
    const isProd = /roicalculator\.live/.test(BASE);
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
      const expected = to === '/' ? '/' : to;
      if (isProd) {
        check(
          `5-8. ${from} redirects to ${to}`,
          finalUrl === expected || finalUrl === expected.replace(/\/$/, '') + '/',
          `landed on ${finalUrl}, status chain ok=${resp && resp.ok()}`
        );
      } else {
        check(
          `5-8. ${from} old file returns 404 locally (redirect only verifiable on Cloudflare Pages — see production check)`,
          resp && resp.status() === 404,
          `status=${resp && resp.status()}`
        );
      }
      await page.close();
    }
  }

  // 9: sitemap
  {
    const sitemapXml = fs.readFileSync(new URL('../../sitemap.xml', import.meta.url), 'utf8');
    const stale = ['simple-roi-calculator.html', 'free-roi-calculator.html', 'roi-calculator-example.html', 'roi-vs-other-metrics.html'];
    const found = stale.filter((s) => sitemapXml.includes(s));
    check('9. all four redirected URLs absent from sitemap.xml', found.length === 0, JSON.stringify(found));
  }

  // 10: no internal production navigation intentionally links to redirected URLs
  {
    const page = await browser.newPage();
    await page.goto(cb(`${BASE}/`), { waitUntil: 'load' });
    const staleLinks = await page.$$eval('a[href]', (as) =>
      as
        .map((a) => a.getAttribute('href'))
        .filter((h) => h && /simple-roi-calculator\.html|free-roi-calculator\.html|roi-calculator-example\.html|roi-vs-other-metrics\.html/.test(h))
    );
    check('10. homepage has no intentional links to redirected URLs', staleLinks.length === 0, JSON.stringify(staleLinks));
    await page.close();
  }

  // 11-12: real estate headings
  {
    const page = await browser.newPage();
    await page.goto(cb(`${BASE}/real-estate/cap-rate-calculator.html`), { waitUntil: 'load' });
    const heading = await page.textContent('[itemprop="name"]');
    check('11. cap-rate second heading is "Cap Rate in Detail"', heading.trim() === 'Cap Rate in Detail', heading.trim());
    await page.close();

    const page2 = await browser.newPage();
    await page2.goto(cb(`${BASE}/real-estate/cash-on-cash-calculator.html`), { waitUntil: 'load' });
    const heading2 = await page2.textContent('[itemprop="name"]');
    check('12. cash-on-cash second heading is "Cash-on-Cash Return in Detail"', heading2.trim() === 'Cash-on-Cash Return in Detail', heading2.trim());
    await page2.close();
  }

  // 13: four hero subtitles
  {
    const expected = [
      ['/roi-calculator/saas/subscription-growth-roi.html', 'Model the return from subscription growth by comparing added recurring revenue with acquisition, retention, and operating costs.'],
      ['/roi-calculator/saas/time-to-value-roi.html', 'Estimate how quickly a new tool or process pays back its cost by comparing adoption value with implementation and ongoing expense.'],
      ['/roi-calculator/saas/cac-ltv-roi.html', 'Compare customer acquisition cost with lifetime value to estimate unit-economics efficiency and the payback relationship between acquisition spend and customer value.'],
      ['/roi-calculator/marketing/lead-generation-roi.html', 'Estimate marketing ROI from lead volume, conversion rate, customer value, and campaign cost to evaluate the economics of lead generation.']
    ];
    for (const [path, text] of expected) {
      const page = await browser.newPage();
      await page.goto(cb(`${BASE}${path}`), { waitUntil: 'load' });
      const sub = await page.textContent('.hero-sub');
      check(`13. ${path} hero-sub exact match`, sub.trim() === text, sub.trim());
      await page.close();
    }
  }

  // 17: mobile nav functional (reuse existing pattern, saas page as representative)
  {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(cb(`${BASE}/saas/`), { waitUntil: 'load' });
    const toggle = page.locator('.nav-mobile-toggle');
    const navLinks = page.locator('#site-nav-links');
    await toggle.click();
    const visible = await navLinks.isVisible();
    check('17. mobile navigation remains functional (saas page)', visible);
    await page.close();
  }

  // 19-20: no ad slots / no AdSense scripts introduced
  {
    const page = await browser.newPage();
    await page.goto(cb(`${BASE}/`), { waitUntil: 'load' });
    const html = await page.content();
    check('19. no ad slots introduced (homepage)', !html.includes('class="ad-slot'));
    check('20. no AdSense scripts introduced (homepage)', !html.includes('pagead2.googlesyndication') && !html.includes('adsbygoogle'));
    await page.close();
  }
} finally {
  await browser.close();
}

const failed = results.filter((r) => !r.pass);
console.log('\n' + (failed.length ? failed.length + ' FAILED' : 'ALL PASSED') + ' out of ' + results.length + ' checks');
if (failed.length) process.exitCode = 1;
