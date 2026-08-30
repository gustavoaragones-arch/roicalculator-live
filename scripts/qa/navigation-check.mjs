import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:8791';

const browser = await chromium.launch({ channel: 'chrome' });
try {
  // ---- Mouse/click interaction ----
  {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE}/`, { waitUntil: 'load' });

    const trigger = page.locator('.nav-dropdown-toggle');
    const menu = page.locator('#calculators-menu');

    console.log('trigger visible:', await trigger.isVisible());
    console.log('aria-expanded before click:', await trigger.getAttribute('aria-expanded'));
    console.log('menu visible before click:', await menu.isVisible());

    await trigger.click();
    console.log('aria-expanded after click:', await trigger.getAttribute('aria-expanded'));
    console.log('menu visible after click:', await menu.isVisible());

    const destLink = menu.locator('a[href="/real-estate/index.html"]');
    await destLink.click();
    await page.waitForLoadState('load');
    console.log('url after clicking Real Estate ROI menu item:', page.url());
    await page.close();
  }

  // ---- Keyboard interaction ----
  {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE}/`, { waitUntil: 'load' });

    // Tab through header until the Calculators trigger is focused
    let focused = '';
    let tabs = 0;
    const maxTabs = 20;
    while (tabs < maxTabs) {
      await page.keyboard.press('Tab');
      tabs++;
      focused = await page.evaluate(() => {
        const el = document.activeElement;
        return el ? (el.className || el.tagName) : null;
      });
      if (focused && focused.includes('nav-dropdown-toggle')) break;
    }
    console.log('tabs to reach trigger:', tabs, 'focused element class:', focused);

    const triggerFocused = await page.evaluate(
      () => document.activeElement === document.querySelector('.nav-dropdown-toggle')
    );
    console.log('trigger is the focused element:', triggerFocused);

    // Activate via keyboard (Enter)
    await page.keyboard.press('Enter');
    const expandedAfterEnter = await page.locator('.nav-dropdown-toggle').getAttribute('aria-expanded');
    console.log('aria-expanded after keyboard Enter:', expandedAfterEnter);
    console.log('menu visible after keyboard activation:', await page.locator('#calculators-menu').isVisible());

    // Tab into the menu
    await page.keyboard.press('Tab');
    const focusedAfterTabIntoMenu = await page.evaluate(() => {
      const el = document.activeElement;
      return el ? el.getAttribute('href') : null;
    });
    console.log('first menu item focused href:', focusedAfterTabIntoMenu);

    // Visible focus outline check (computed outline style)
    const outlineStyle = await page.evaluate(() => {
      const el = document.activeElement;
      const cs = window.getComputedStyle(el);
      return { outline: cs.outline, outlineWidth: cs.outlineWidth, boxShadow: cs.boxShadow };
    });
    console.log('computed focus style on active menu item:', JSON.stringify(outlineStyle));

    await page.close();
  }
} finally {
  await browser.close();
}
