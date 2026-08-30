// Phase 7B-01 — homepage visual reset verification (local + optional production).
import { chromium } from 'playwright';

const LOCAL = process.env.QA_BASE || 'http://127.0.0.1:8791';
const PROD = 'https://roicalculator.live';
const CACHE_BUST = process.env.CACHE_BUST || String(Date.now());

const viewports = [
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1024x768', width: 1024, height: 768 },
  { name: '390x844', width: 390, height: 844 },
  { name: '320x700', width: 320, height: 700 }
];

async function auditPage(page, label, url) {
  await page.goto(url, { waitUntil: 'load' });
  const metrics = await page.evaluate(() => {
    const h1 = document.querySelector('.hero h1');
    const calcCard = document.querySelector('.calculator-card');
    const firstInput = document.getElementById('initial-investment');
    const header = document.querySelector('.site-header');
    const h1Rect = h1 ? h1.getBoundingClientRect() : null;
    const calcRect = calcCard ? calcCard.getBoundingClientRect() : null;
    const inputRect = firstInput ? firstInput.getBoundingClientRect() : null;
    const headerRect = header ? header.getBoundingClientRect() : null;
    const roiBlocks = Array.from(document.querySelectorAll('h2, h3')).filter((el) =>
      /what is roi/i.test(el.textContent || '')
    );
    return {
      headerHeight: headerRect ? Math.round(headerRect.height) : null,
      h1Left: h1Rect ? Math.round(h1Rect.left) : null,
      calcLeft: calcRect ? Math.round(calcRect.left) : null,
      alignDelta: h1Rect && calcRect ? Math.round(h1Rect.left - calcRect.left) : null,
      firstInputY: inputRect ? Math.round(inputRect.top) : null,
      docHeight: document.documentElement.scrollHeight,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      hasBadge: !!document.querySelector('.badge-privacy'),
      hasCalculatorStrip: !!document.querySelector('.calculator-strip'),
      adSlotCount: document.querySelectorAll('.ad-slot').length,
      hasBreadcrumb: !!document.querySelector('.breadcrumb'),
      hasStickyBar: !!document.querySelector('.sticky-calc-bar'),
      whatIsRoiHeadingCount: roiBlocks.length,
      hasAeoContext: !!document.querySelector('.aeo-context-anchor'),
      hasAiAnswerDominance: !!document.querySelector('.ai-answer-dominance')
    };
  });

  console.log(`\n=== ${label} ===`);
  console.log(JSON.stringify(metrics, null, 2));

  const failures = [];
  if (metrics.hasBadge) failures.push('badge-privacy present');
  if (metrics.hasCalculatorStrip) failures.push('calculator-strip present');
  if (metrics.adSlotCount > 0) failures.push(`ad-slot count ${metrics.adSlotCount}`);
  if (metrics.hasBreadcrumb) failures.push('breadcrumb present');
  if (metrics.hasStickyBar) failures.push('sticky-calc-bar present');
  if (metrics.hasAeoContext) failures.push('aeo-context-anchor present');
  if (metrics.hasAiAnswerDominance) failures.push('ai-answer-dominance present');
    if (metrics.whatIsRoiHeadingCount > 2) failures.push(`what-is-roi headings: ${metrics.whatIsRoiHeadingCount}`);
  if (metrics.alignDelta !== null && Math.abs(metrics.alignDelta) > 2) failures.push(`hero/calc align delta ${metrics.alignDelta}px`);
  if (metrics.scrollWidth > metrics.clientWidth + 1) failures.push('horizontal overflow');

  if (failures.length) {
    console.log('FAIL:', failures.join('; '));
  } else {
    console.log('PASS');
  }

  return { metrics, failures };
}

const browser = await chromium.launch({ channel: 'chrome' });
try {
  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: vp.width, height: vp.height });
    const url = `${LOCAL}/?cb=${CACHE_BUST}`;
    await page.goto(url, { waitUntil: 'load' });
    await page.screenshot({
      path: `scripts/qa/screenshots/phase7b-home-${vp.name}.png`,
      fullPage: true
    });
    await auditPage(page, `local ${vp.name}`, url);
    await page.close();
  }

  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${LOCAL}/?cb=${CACHE_BUST}`, { waitUntil: 'load' });
  await page.locator('#roi-form button[type="submit"]').click();
  const roi = await page.locator('#result-roi').textContent();
  const panelHidden = await page.locator('#results-panel').isHidden();
  console.log('\n=== calculator interaction ===');
  console.log('results hidden after calculate:', panelHidden);
  console.log('ROI:', JSON.stringify(roi));
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  await page.close();

  if (process.env.QA_PROD === '1') {
    const prodPage = await browser.newPage();
    await prodPage.setViewportSize({ width: 1440, height: 900 });
    const prodUrl = `${PROD}/?cb=${CACHE_BUST}`;
    await prodPage.screenshot({
      path: 'scripts/qa/screenshots/phase7b-home-PROD-1440x900.png',
      fullPage: true
    });
    await auditPage(prodPage, 'production 1440x900', prodUrl);
    await prodPage.close();
  }
} finally {
  await browser.close();
}
