// Phase 7C — breadcrumb, hero, and calculator/article share the same content column.
import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:8791';
const pages = [
  { name: 'home', url: `${BASE}/`, expectBreadcrumb: false },
  { name: 'solar', url: `${BASE}/solar/roi-calculator.html`, expectBreadcrumb: true },
  { name: 'learn', url: `${BASE}/learn/what-is-roi.html`, expectBreadcrumb: true },
  { name: 'factory', url: `${BASE}/calculators/simple-roi-calculator.html`, expectBreadcrumb: true },
  { name: 'saas', url: `${BASE}/saas/index.html`, expectBreadcrumb: true },
  { name: 'hub', url: `${BASE}/marketing/index.html`, expectBreadcrumb: true }
];

function leftEdge(el) {
  if (!el) return null;
  return el.getBoundingClientRect().left;
}

const browser = await chromium.launch({ channel: 'chrome' });
let failed = false;

try {
  for (const p of pages) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(p.url, { waitUntil: 'load' });

    const result = await page.evaluate(({ expectBreadcrumb }) => {
      const breadcrumb = document.querySelector('.breadcrumb');
      const hero = document.querySelector('.hero');
      const column =
        document.querySelector('.calculator-section-inner') ||
        document.querySelector('article.content-section');
      const badge = document.querySelector('.badge-privacy');

      return {
        hasPageHomeClass: document.body.classList.contains('page-home'),
        hasBreadcrumb: Boolean(breadcrumb),
        hasBadge: Boolean(badge),
        breadcrumbLeft: breadcrumb ? breadcrumb.getBoundingClientRect().left : null,
        heroLeft: hero ? hero.getBoundingClientRect().left : null,
        columnLeft: column ? column.getBoundingClientRect().left : null,
        columnWidth: column ? column.getBoundingClientRect().width : null,
        expectBreadcrumb
      };
    }, { expectBreadcrumb: p.expectBreadcrumb });

    const issues = [];
    if (p.name !== 'home' && result.hasPageHomeClass) {
      issues.push('page-home class should only be on index.html');
    }
    if (result.hasBreadcrumb !== p.expectBreadcrumb) {
      issues.push(`breadcrumb expected=${p.expectBreadcrumb} actual=${result.hasBreadcrumb}`);
    }
    if (result.hasBadge) issues.push('badge-privacy should be removed');
    if (result.columnWidth && Math.abs(result.columnWidth - 760) > 2) {
      issues.push(`column width ${result.columnWidth}px (expected 760)`);
    }
    if (p.expectBreadcrumb && result.breadcrumbLeft != null && result.columnLeft != null) {
      if (Math.abs(result.breadcrumbLeft - result.columnLeft) > 1) {
        issues.push(`breadcrumb misaligned (Δ${Math.abs(result.breadcrumbLeft - result.columnLeft).toFixed(1)}px)`);
      }
    }
    if (result.heroLeft != null && result.columnLeft != null) {
      if (Math.abs(result.heroLeft - result.columnLeft) > 1) {
        issues.push(`hero misaligned (Δ${Math.abs(result.heroLeft - result.columnLeft).toFixed(1)}px)`);
      }
    }

    const status = issues.length ? 'FAIL' : 'PASS';
    if (issues.length) failed = true;
    console.log(`${status} ${p.name}: ${issues.length ? issues.join('; ') : 'aligned'}`);
    await page.close();
  }
} finally {
  await browser.close();
}

if (failed) process.exitCode = 1;
