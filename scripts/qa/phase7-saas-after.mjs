// Phase 7 — after capture of /saas/ once scoped ref-page CSS is applied.
import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:8791';
const viewports = [
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1024x768', width: 1024, height: 768 },
  { name: '390x844', width: 390, height: 844 },
  { name: '320x700', width: 320, height: 700 }
];

const browser = await chromium.launch({ channel: 'chrome' });
try {
  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto(`${BASE}/saas/`, { waitUntil: 'load' });

    await page.screenshot({ path: `scripts/qa/screenshots/AFTER-saas-${vp.name}-full.png`, fullPage: true });
    await page.screenshot({ path: `scripts/qa/screenshots/AFTER-saas-${vp.name}-fold.png`, fullPage: false });

    const metrics = await page.evaluate((vh) => {
      const form = document.getElementById('saas-cluster-form');
      const heroEl = document.querySelector('.hero');
      const calcSection = document.querySelector('.calculator-section');
      const firstInput = document.getElementById('saas-employees');
      const calcButton = document.querySelector('#saas-cluster-form button[type="submit"]');
      const rectForm = form ? form.getBoundingClientRect() : null;
      const rectHero = heroEl ? heroEl.getBoundingClientRect() : null;
      const rectCalc = calcSection ? calcSection.getBoundingClientRect() : null;
      const rectInput = firstInput ? firstInput.getBoundingClientRect() : null;
      const rectButton = calcButton ? calcButton.getBoundingClientRect() : null;
      return {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        docHeight: document.documentElement.scrollHeight,
        viewportHeight: vh,
        heroTop: rectHero ? rectHero.top : null,
        heroBottom: rectHero ? rectHero.bottom : null,
        calcSectionTop: rectCalc ? rectCalc.top : null,
        formTop: rectForm ? rectForm.top : null,
        formVisibleInFold: rectForm ? rectForm.top < vh : null,
        inputTop: rectInput ? rectInput.top : null,
        inputVisibleInFold: rectInput ? rectInput.bottom < vh : null,
        buttonTop: rectButton ? rectButton.top : null,
        buttonVisibleInFold: rectButton ? rectButton.bottom < vh : null
      };
    }, vp.height);

    console.log(`${vp.name}: docHeight=${metrics.docHeight} heroTop=${Math.round(metrics.heroTop)} heroBottom=${Math.round(metrics.heroBottom)} calcSectionTop=${Math.round(metrics.calcSectionTop)} formTop=${Math.round(metrics.formTop)} formVisibleInFold=${metrics.formVisibleInFold} inputTop=${Math.round(metrics.inputTop)} inputVisibleInFold=${metrics.inputVisibleInFold} buttonTop=${Math.round(metrics.buttonTop)} buttonVisibleInFold=${metrics.buttonVisibleInFold} scrollWidth=${metrics.scrollWidth} clientWidth=${metrics.clientWidth}`);

    await page.close();
  }
} finally {
  await browser.close();
}
