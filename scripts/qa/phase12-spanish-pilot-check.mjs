/**
 * Phase 12 — Spanish pilot QA + EN/ES mathematical parity.
 * Usage: PHASE12_BASE=http://127.0.0.1:8791 node scripts/qa/phase12-spanish-pilot-check.mjs
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '../..');
const BASE = process.env.PHASE12_BASE || 'http://127.0.0.1:8791';
const BUST = process.env.PHASE12_BUST || (BASE.includes('roicalculator.live') ? String(Date.now()) : '');

function url(path) {
  if (!BUST) return BASE + path;
  const sep = path.includes('?') ? '&' : '?';
  return BASE + path + sep + 'qa=' + BUST;
}

const ES_PAGES = [
  { path: '/es/', name: 'hub' },
  { path: '/es/calculadora-roi.html', name: 'roi', pairEn: '/', form: '#roi-form', dominant: '#result-roi' },
  {
    path: '/es/inmobiliario/calculadora-rentabilidad-alquiler.html',
    name: 'rental',
    pairEn: '/real-estate/',
    form: '#rp-roi-form',
    dominant: '#rp-result-roi'
  },
  {
    path: '/es/saas/calculadora-cac-ltv.html',
    name: 'cac',
    pairEn: '/roi-calculator/saas/cac-ltv-roi.html',
    form: '#cac-ltv-form',
    dominant: '#roi'
  },
  {
    path: '/es/impresion-3d/calculadora-precio-servicio.html',
    name: 'pricing',
    pairEn: '/3d-printing/service-pricing-calculator.html',
    form: '#sp-form',
    dominant: '#sp-res-price'
  }
];

const VIEWPORTS = [
  [1440, 900],
  [1024, 768],
  [390, 844],
  [320, 700]
];

let passed = 0;
let failed = 0;
const failures = [];

function check(label, ok, detail) {
  if (ok) {
    passed++;
    console.log('PASS  ' + label + (detail ? ' — ' + detail : ''));
  } else {
    failed++;
    failures.push(label + (detail ? ' — ' + detail : ''));
    console.log('FAIL  ' + label + (detail ? ' — ' + detail : ''));
  }
}

function parseNumeric(text) {
  if (!text) return NaN;
  var t = String(text).replace(/\s/g, '').replace('%', '').replace(/[€$]/g, '');
  // Spanish: 1.234,56 or 1234,56 → normalize
  if (/,/.test(t) && /\./.test(t)) {
    t = t.replace(/\./g, '').replace(',', '.');
  } else if (/,/.test(t)) {
    t = t.replace(',', '.');
  }
  t = t.replace(/[^0-9.-]/g, '');
  return parseFloat(t);
}

// ---------- Source checks ----------
for (const p of ES_PAGES) {
  const file =
    p.path === '/es/'
      ? path.join(ROOT, 'es/index.html')
      : path.join(ROOT, p.path.replace(/^\//, ''));
  check('Source exists: ' + p.path, fs.existsSync(file));
  if (fs.existsSync(file)) {
    const html = fs.readFileSync(file, 'utf8');
    check(p.name + ' lang=es', /<html[^>]*lang="es"/.test(html));
    check(p.name + ' self-canonical', html.includes('rel="canonical"') && html.includes('https://roicalculator.live' + (p.path === '/es/' ? '/es/' : p.path)));
    check(p.name + ' no es-419', !html.includes('es-419'));
    check(p.name + ' title present', /<title>[^<]+<\/title>/.test(html));
    check(p.name + ' meta description', /name="description" content="[^"]+"/.test(html));
  }
}

const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
for (const p of ES_PAGES) {
  const loc = 'https://roicalculator.live' + (p.path === '/es/' ? '/es/' : p.path);
  check('Sitemap includes ' + p.path, sitemap.includes('<loc>' + loc + '</loc>'));
}

check('calc-i18n.js exists', fs.existsSync(path.join(ROOT, 'assets/js/calc-i18n.js')));
check('cac-ltv shared js exists', fs.existsSync(path.join(ROOT, 'assets/js/cac-ltv-roi-calculator.js')));
check('sync-site-chrome skips es', fs.readFileSync(path.join(ROOT, 'scripts/sync-site-chrome.mjs'), 'utf8').includes("'es'"));

const browser = await chromium.launch({ channel: 'chrome' });
try {
  for (const p of ES_PAGES) {
    const page = await browser.newPage();
    const resp = await page.goto(url(p.path), { waitUntil: 'load', timeout: 30000 });
    check(p.name + ' HTTP 200', resp && resp.status() === 200, String(resp && resp.status()));
    const lang = await page.locator('html').getAttribute('lang');
    check(p.name + ' live lang=es', lang === 'es');
    const canon = await page.locator('link[rel="canonical"]').getAttribute('href');
    check(p.name + ' live canonical', canon && canon.includes('/es/'));

    if (p.pairEn) {
      const alts = await page.evaluate(() =>
        [...document.querySelectorAll('link[rel="alternate"][hreflang]')].map((a) => ({
          h: a.getAttribute('hreflang'),
          href: a.getAttribute('href')
        }))
      );
      const by = Object.fromEntries(alts.map((a) => [a.h, a.href]));
      check(p.name + ' hreflang en/es/x-default', by.en && by.es && by['x-default']);
      check(p.name + ' hreflang codes only en/es/x-default', alts.every((a) => ['en', 'es', 'x-default'].includes(a.h)));
      check(p.name + ' hreflang absolute', alts.every((a) => /^https:\/\//.test(a.href)));
      check(p.name + ' hreflang es self', by.es && by.es.includes(p.path));
      check(p.name + ' x-default is EN', by['x-default'] && !by['x-default'].includes('/es/'));
      const switchEn = page.locator('a.lang-switch[href]');
      check(p.name + ' language switch to EN', (await switchEn.count()) >= 1);

      // Reciprocal on EN
      const enPage = await browser.newPage();
      await enPage.goto(url(p.pairEn), { waitUntil: 'load' });
      const enAlts = await enPage.evaluate(() =>
        [...document.querySelectorAll('link[rel="alternate"][hreflang]')].map((a) => ({
          h: a.getAttribute('hreflang'),
          href: a.getAttribute('href')
        }))
      );
      const enBy = Object.fromEntries(enAlts.map((a) => [a.h, a.href]));
      check(p.name + ' EN reciprocal es', enBy.es && enBy.es.includes(p.path));
      check(p.name + ' EN has Español switch', (await enPage.locator('a.lang-switch').count()) >= 1);
      await enPage.close();
    }

    if (p.name === 'hub') {
      for (const href of [
        '/es/calculadora-roi.html',
        '/es/inmobiliario/calculadora-rentabilidad-alquiler.html',
        '/es/saas/calculadora-cac-ltv.html',
        '/es/impresion-3d/calculadora-precio-servicio.html'
      ]) {
        check('hub links ' + href, (await page.locator('main a[href="' + href + '"]').count()) >= 1);
      }
    }

    if (p.form) {
      const errors = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text());
      });
      await page.locator(p.form + ' button[type="submit"]').click();
      await page.waitForTimeout(400);
      const visible = await page.locator(p.dominant).isVisible();
      check(p.name + ' calculator produces output', visible, await page.locator(p.dominant).textContent());
      check(p.name + ' no console errors', errors.length === 0, JSON.stringify(errors));
      if (p.name !== 'rental' || (await page.locator('#btn-pdf').count())) {
        check(p.name + ' PDF button present', (await page.locator('#btn-pdf').count()) === 1);
      }
      // Spanish markers
      const bodyText = await page.locator('main').innerText();
      check(p.name + ' Spanish UI markers', /Calcular|Descargar|Inversión|Rentabilidad|Precio|CAC|ROI/.test(bodyText));
    }

    for (const [w, h] of VIEWPORTS) {
      await page.setViewportSize({ width: w, height: h });
      await page.waitForTimeout(100);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
      );
      check(p.name + ' no overflow @' + w + 'x' + h, !overflow);
    }
    await page.close();
  }

  // Mathematical parity EN vs ES
  async function calcValue(pathName, formSel, resultSel) {
    const page = await browser.newPage();
    await page.goto(url(pathName), { waitUntil: 'load' });
    // Force $ on ES for comparable display parsing if select exists
    const sym = page.locator('#currency-symbol');
    if ((await sym.count()) && pathName.includes('/es/')) {
      await sym.selectOption('$');
    }
    await page.locator(formSel + ' button[type="submit"]').click();
    await page.waitForTimeout(500);
    const text = (await page.locator(resultSel).textContent()).trim();
    await page.close();
    return text;
  }

  const pairs = [
    { name: 'ROI', en: '/', es: '/es/calculadora-roi.html', form: '#roi-form', res: '#result-roi' },
    {
      name: 'Rental',
      en: '/real-estate/',
      es: '/es/inmobiliario/calculadora-rentabilidad-alquiler.html',
      form: '#rp-roi-form',
      res: '#rp-result-roi'
    },
    {
      name: 'CAC',
      en: '/roi-calculator/saas/cac-ltv-roi.html',
      es: '/es/saas/calculadora-cac-ltv.html',
      form: '#cac-ltv-form',
      res: '#roi'
    },
    {
      name: 'Pricing',
      en: '/3d-printing/service-pricing-calculator.html',
      es: '/es/impresion-3d/calculadora-precio-servicio.html',
      form: '#sp-form',
      res: '#sp-res-price'
    }
  ];

  for (const pair of pairs) {
    const enText = await calcValue(pair.en, pair.form, pair.res);
    const esText = await calcValue(pair.es, pair.form, pair.res);
    const enN = parseNumeric(enText);
    const esN = parseNumeric(esText);
    const close = isFinite(enN) && isFinite(esN) && Math.abs(enN - esN) < 0.05;
    check('Parity ' + pair.name + ' defaults', close, 'EN=' + enText + ' ES=' + esText + ' (' + enN + ' vs ' + esN + ')');
  }

  // English regression smoke
  const home = await browser.newPage();
  await home.goto(url('/'), { waitUntil: 'load' });
  await home.locator('#roi-form button[type="submit"]').click();
  await home.waitForTimeout(300);
  const homeRoi = (await home.locator('#result-roi').textContent()).trim();
  check('EN homepage ROI still 50.00%', homeRoi.includes('50.00'));
  await home.close();

  const solar = await browser.newPage();
  await solar.goto(url('/solar/roi-calculator.html'), { waitUntil: 'load' });
  check('Unrelated EN solar loads', (await solar.title()).length > 0);
  await solar.close();
} finally {
  await browser.close();
}

console.log('\n' + passed + ' passed, ' + failed + ' failed out of ' + (passed + failed));
if (failures.length) {
  console.log('Failures:');
  failures.forEach((f) => console.log(' - ' + f));
}
process.exitCode = failed ? 1 : 0;
