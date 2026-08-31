// Phase 7 — global navigation integration QA for the 3D Printing cluster.
// Verifies the exact contract in the chat brief "PHASE 7 — GLOBAL NAVIGATION
// INTEGRATION". Run locally before deploy, then again with
// PHASE3DNAV_BASE=https://roicalculator.live after deploy (cache-busted).
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', '..');
const BASE = process.env.PHASE3DNAV_BASE || 'http://127.0.0.1:8791';

const results = [];
function check(name, pass, detail) {
  results.push({ name, pass, detail });
  console.log((pass ? 'PASS' : 'FAIL') + '  ' + name + (detail ? ' — ' + detail : ''));
}
function cb(url) {
  return url + (url.includes('?') ? '&' : '?') + 'cb=' + Date.now() + Math.random().toString(36).slice(2);
}

const EXISTING_SIX = [
  ['/marketing/index.html', 'Marketing ROI'],
  ['/real-estate/index.html', 'Real Estate ROI'],
  ['/saas/index.html', 'SaaS ROI'],
  ['/solar/roi-calculator.html', 'Solar ROI'],
  ['/hvac/roi-calculator.html', 'HVAC ROI'],
  ['/hr/roi-calculator.html', 'Employee ROI']
];
const NEW_ENTRY = ['/3d-printing/', '3D Printing Calculators'];

// ---------- A. SOURCE CHECKS ----------
const chromeSrc = fs.readFileSync(path.join(ROOT, 'scripts', 'site-chrome.mjs'), 'utf8');
const navBlockMatch = chromeSrc.match(/<div class="nav-dropdown-menu"[\s\S]*?<\/div>/);
const navBlock = navBlockMatch ? navBlockMatch[0] : '';

const newEntryCount = (navBlock.match(/3D Printing Calculators/g) || []).length;
check('A1: exactly one "3D Printing Calculators" entry in nav-chrome source', newEntryCount === 1, `${newEntryCount} occurrence(s)`);
check('A1: href is exactly /3d-printing/', navBlock.includes('href="/3d-printing/">3D Printing Calculators</a>'));

check(
  'A2: all six existing entries present unchanged',
  EXISTING_SIX.every(([href, label]) => navBlock.includes(`href="${href.replace('/index.html', '/index.html')}">${label}</a>`)),
  EXISTING_SIX.map(([, l]) => l).join(', ')
);

check('A3: no duplicate "3D Printing Calculators" entry', newEntryCount === 1);

const topLevelNavMatch = chromeSrc.match(/<ul class="nav-links"[\s\S]*?<\/ul>/);
const topLevelNav = topLevelNavMatch ? topLevelNavMatch[0] : '';
const topLevelOccurrencesOutsideDropdown = (topLevelNav.replace(navBlock, '').match(/3D Printing/g) || []).length;
check('A4: no separate top-level 3D Printing nav item', topLevelOccurrencesOutsideDropdown === 0, `${topLevelOccurrencesOutsideDropdown} occurrence(s) outside dropdown`);

const calculatorsJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'calculators.json'), 'utf8'));
check('A5: no 3D Printing calculator added to data/calculators.json', !calculatorsJson.some((c) => /3d.?print/i.test(c.slug || '') || /3d.?print/i.test(c.title || '')));

// Git-diff based checks (only meaningful when run from a checkout with git history for this change; skip gracefully if not available)
import { execSync } from 'child_process';
function gitDiffNameOnly() {
  try {
    return execSync('git diff --name-only', { cwd: ROOT }).toString().trim().split('\n').filter(Boolean);
  } catch (e) {
    return null;
  }
}
const changedFiles = gitDiffNameOnly();
if (changedFiles !== null) {
  check('A6: sitemap.xml not changed by this phase', !changedFiles.includes('sitemap.xml'), JSON.stringify(changedFiles.filter((f) => f === 'sitemap.xml')));
  check('A7: no calculator JS files changed', !changedFiles.some((f) => f.startsWith('assets/js/') && f.endsWith('.js')), JSON.stringify(changedFiles.filter((f) => f.startsWith('assets/js/'))));
  check('A8: no CSS files changed', !changedFiles.some((f) => f.endsWith('.css')), JSON.stringify(changedFiles.filter((f) => f.endsWith('.css'))));
} else {
  check('A6-A8: git diff unavailable in this environment (skipped, not a failure)', true);
}

const browser = await chromium.launch({ channel: 'chrome' });
try {
  // ---------- B. DESKTOP NAVIGATION ----------
  {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(cb(`${BASE}/3d-printing/`), { waitUntil: 'load' });
    await page.locator('.nav-dropdown-toggle').click();
    check('B1: Calculators dropdown becomes visible', await page.locator('#calculators-menu').isVisible());

    const links = await page.$$eval('#calculators-menu a', (as) => as.map((a) => ({ href: a.getAttribute('href'), text: a.textContent.trim() })));
    const matches = links.filter((l) => l.text === '3D Printing Calculators');
    check('B2: "3D Printing Calculators" exists exactly once', matches.length === 1, JSON.stringify(matches));
    check('B3: its href is exactly /3d-printing/', matches[0] && matches[0].href === '/3d-printing/', matches[0] && matches[0].href);
    check(
      'B4: all six existing entries remain in the rendered dropdown',
      EXISTING_SIX.every(([href, label]) => links.some((l) => l.text === label && l.href === href)),
      JSON.stringify(links)
    );
    check('B5: no second 3D Printing nav item', links.filter((l) => /3D Printing/.test(l.text)).length === 1);

    await page.locator('#calculators-menu a[href="/3d-printing/"]').click();
    await page.waitForLoadState('load');
    check('B6: clicking the new link resolves to the hub', new URL(page.url()).pathname === '/3d-printing/', page.url());
    await page.close();
  }

  // ---------- C. MOBILE NAVIGATION ----------
  {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(cb(`${BASE}/3d-printing/`), { waitUntil: 'load' });
    await page.locator('.nav-mobile-toggle').click();
    const navOpen = await page.locator('#site-nav-links').isVisible();
    check('C1: mobile navigation opens', navOpen);

    await page.locator('.nav-dropdown-toggle').click();
    check('C2: Calculators disclosure works', await page.locator('#calculators-menu').isVisible());

    const links = await page.$$eval('#calculators-menu a', (as) => as.map((a) => ({ href: a.getAttribute('href'), text: a.textContent.trim() })));
    const matches = links.filter((l) => l.text === '3D Printing Calculators');
    check('C3: "3D Printing Calculators" exists exactly once (mobile)', matches.length === 1, JSON.stringify(matches));
    check('C4: href is exactly /3d-printing/ (mobile)', matches[0] && matches[0].href === '/3d-printing/', matches[0] && matches[0].href);
    check('C5: no duplicate nav item (mobile)', links.filter((l) => /3D Printing/.test(l.text)).length === 1);

    await page.locator('#calculators-menu a[href="/3d-printing/"]').click();
    await page.waitForLoadState('load');
    check('C6: clicking the link reaches /3d-printing/ (mobile)', new URL(page.url()).pathname === '/3d-printing/', page.url());
    await page.close();
  }

  // ---------- D. SITEWIDE PROPAGATION (representative rendered check) ----------
  const representativePages = [
    '/',
    '/saas/',
    '/real-estate/',
    '/solar/roi-calculator.html',
    '/learn/what-is-roi.html',
    '/glossary/',
    '/methodology/',
    '/3d-printing/',
    '/3d-printing/roi-calculator.html',
    '/3d-printing/print-farm-roi-calculator.html',
    '/3d-printing/service-pricing-calculator.html'
  ];
  for (const p of representativePages) {
    const page = await browser.newPage();
    await page.goto(cb(`${BASE}${p}`), { waitUntil: 'load' });
    const dropdownExists = (await page.$('#calculators-menu')) !== null;
    const links = await page.$$eval('#calculators-menu a', (as) => as.map((a) => ({ href: a.getAttribute('href'), text: a.textContent.trim() })));
    const matches = links.filter((l) => l.text === '3D Printing Calculators' && l.href === '/3d-printing/');
    check(`D: ${p} — Calculators dropdown exists and has exactly one correct 3D Printing Calculators entry`, dropdownExists && matches.length === 1, JSON.stringify(matches));
    await page.close();
  }

  // ---------- D (repo-wide source sweep) ----------
  {
    function walkHtml(dir, out) {
      for (const name of fs.readdirSync(dir)) {
        if (['.git', 'node_modules', 'templates', 'partials', 'scripts'].includes(name)) continue;
        const full = path.join(dir, name);
        const st = fs.statSync(full);
        if (st.isDirectory()) walkHtml(full, out);
        else if (name.endsWith('.html')) out.push(full);
      }
    }
    const files = [];
    walkHtml(ROOT, files);
    const inconsistent = [];
    for (const f of files) {
      const html = fs.readFileSync(f, 'utf8');
      const menuMatch = html.match(/<div class="nav-dropdown-menu"[\s\S]*?<\/div>/);
      if (!menuMatch) continue; // pages without the dropdown at all are out of scope for this check
      const menuHtml = menuMatch[0];
      const count = (menuHtml.match(/3D Printing Calculators<\/a>/g) || []).length;
      const hrefOk = menuHtml.includes('href="/3d-printing/">3D Printing Calculators</a>');
      if (count !== 1 || !hrefOk) inconsistent.push({ file: path.relative(ROOT, f), count, hrefOk });
    }
    check('D: repo-wide source sweep — every page with the Calculators dropdown has exactly one correct entry', inconsistent.length === 0, JSON.stringify(inconsistent));
  }
} finally {
  await browser.close();
}

const failed = results.filter((r) => !r.pass);
console.log('\n' + (failed.length ? failed.length + ' FAILED' : 'ALL PASSED') + ' out of ' + results.length + ' checks');
if (failed.length) process.exitCode = 1;
