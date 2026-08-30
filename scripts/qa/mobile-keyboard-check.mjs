import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:8791';

const browser = await chromium.launch({ channel: 'chrome' });
try {
  const page = await browser.newPage();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE}/`, { waitUntil: 'load' });

  let focused = '';
  let tabs = 0;
  while (tabs < 20) {
    await page.keyboard.press('Tab');
    tabs++;
    focused = await page.evaluate(() => {
      const el = document.activeElement;
      return el ? (el.className || el.tagName) : null;
    });
    if (focused && focused.includes('nav-mobile-toggle')) break;
  }
  console.log('tabs to reach mobile toggle:', tabs, 'focused:', focused);

  const isToggleFocused = await page.evaluate(
    () => document.activeElement === document.querySelector('.nav-mobile-toggle')
  );
  console.log('mobile toggle is focused element:', isToggleFocused);

  const outlineStyle = await page.evaluate(() => {
    const el = document.activeElement;
    const cs = window.getComputedStyle(el);
    return { outline: cs.outline, outlineWidth: cs.outlineWidth };
  });
  console.log('mobile toggle focus outline:', JSON.stringify(outlineStyle));

  // Activate with keyboard
  await page.keyboard.press('Enter');
  const navLinksVisible = await page.locator('#site-nav-links').isVisible();
  const ariaExpanded = await page.locator('.nav-mobile-toggle').getAttribute('aria-expanded');
  console.log('nav-links visible after keyboard Enter on toggle:', navLinksVisible);
  console.log('aria-expanded after keyboard Enter:', ariaExpanded);

  // Continue tabbing into the now-open menu
  await page.keyboard.press('Tab');
  const nextFocused = await page.evaluate(() => {
    const el = document.activeElement;
    return el ? el.getAttribute('href') || el.className : null;
  });
  console.log('next focused element after opening mobile menu:', nextFocused);

  await page.close();
} finally {
  await browser.close();
}
