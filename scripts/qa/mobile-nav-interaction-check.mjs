import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:8791';

const browser = await chromium.launch({ channel: 'chrome' });
try {
  const page = await browser.newPage();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE}/`, { waitUntil: 'load' });

  const toggle = page.locator('.nav-mobile-toggle');
  const navLinks = page.locator('#site-nav-links');

  console.log('toggle visible at 390px:', await toggle.isVisible());
  console.log('nav-links visible before tap:', await navLinks.isVisible());
  console.log('aria-expanded before tap:', await toggle.getAttribute('aria-expanded'));

  await toggle.click();
  console.log('nav-links visible after tap:', await navLinks.isVisible());
  console.log('aria-expanded after tap:', await toggle.getAttribute('aria-expanded'));

  const scrollWidthAfterOpen = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidthAfterOpen = await page.evaluate(() => document.documentElement.clientWidth);
  console.log('scrollWidth with menu OPEN:', scrollWidthAfterOpen, '| clientWidth:', clientWidthAfterOpen, '| overflow:', scrollWidthAfterOpen > clientWidthAfterOpen);

  await page.screenshot({ path: 'scripts/qa/screenshots/mobile-nav-open.png', fullPage: true });

  // Calculators disclosure still works when nested inside the open mobile menu
  const calcTrigger = page.locator('.nav-dropdown-toggle');
  const calcMenu = page.locator('#calculators-menu');
  console.log('Calculators trigger visible inside open mobile menu:', await calcTrigger.isVisible());
  await calcTrigger.click();
  console.log('Calculators submenu visible after click:', await calcMenu.isVisible());
  console.log('Calculators aria-expanded after click:', await calcTrigger.getAttribute('aria-expanded'));

  // Close mobile menu
  await toggle.click();
  console.log('nav-links visible after second tap (close):', await navLinks.isVisible());
  console.log('aria-expanded after close:', await toggle.getAttribute('aria-expanded'));

  await page.close();
} finally {
  await browser.close();
}
