// Phase 7 — verify Phase 4A nav (desktop dropdown, mobile toggle, keyboard) is
// fully intact on the modified /saas/ page.
import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:8791';

const browser = await chromium.launch({ channel: 'chrome' });
try {
  // Desktop dropdown
  {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE}/saas/`, { waitUntil: 'load' });

    const trigger = page.locator('.nav-dropdown-toggle');
    const menu = page.locator('#calculators-menu');
    console.log('--- SaaS desktop dropdown ---');
    console.log('trigger visible:', await trigger.isVisible());
    console.log('menu visible before click:', await menu.isVisible());
    await trigger.click();
    console.log('aria-expanded after click:', await trigger.getAttribute('aria-expanded'));
    console.log('menu visible after click:', await menu.isVisible());
    await page.close();
  }

  // Keyboard access
  {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE}/saas/`, { waitUntil: 'load' });
    let focused = '';
    let tabs = 0;
    while (tabs < 20) {
      await page.keyboard.press('Tab');
      tabs++;
      focused = await page.evaluate(() => {
        const el = document.activeElement;
        return el ? (el.className || el.tagName) : null;
      });
      if (focused && focused.includes('nav-dropdown-toggle')) break;
    }
    console.log('--- SaaS keyboard access ---');
    console.log('tabs to reach trigger:', tabs, 'focused:', focused);
    await page.keyboard.press('Enter');
    console.log('aria-expanded after Enter:', await page.locator('.nav-dropdown-toggle').getAttribute('aria-expanded'));
    console.log('menu visible after keyboard activation:', await page.locator('#calculators-menu').isVisible());
    await page.close();
  }

  // Mobile toggle + nested Calculators disclosure
  {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE}/saas/`, { waitUntil: 'load' });

    const toggle = page.locator('.nav-mobile-toggle');
    const navLinks = page.locator('#site-nav-links');
    console.log('--- SaaS mobile nav (390px) ---');
    console.log('toggle visible:', await toggle.isVisible());
    console.log('nav-links visible before tap:', await navLinks.isVisible());
    await toggle.click();
    console.log('nav-links visible after tap:', await navLinks.isVisible());

    const calcTrigger = page.locator('.nav-dropdown-toggle');
    const calcMenu = page.locator('#calculators-menu');
    await calcTrigger.click();
    console.log('nested Calculators submenu visible after click:', await calcMenu.isVisible());

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    console.log('overflow with menu open:', scrollWidth > clientWidth);

    await toggle.click();
    console.log('nav-links visible after close tap:', await navLinks.isVisible());
    await page.close();
  }
} finally {
  await browser.close();
}
