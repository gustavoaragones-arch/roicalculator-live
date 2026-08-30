// Phase 4A-SETUP-02 — empirical proof that Playwright can drive the
// already-installed system Google Chrome (channel: 'chrome') on this
// Mac (macOS 12.7.6 Monterey, Intel x86_64), instead of downloading
// Playwright's own bundled Chromium build (whose support matrix targets
// macOS 14+). This script is QA tooling only — it is not part of the
// production site and is not loaded by any production page.
import { chromium } from 'playwright';

const browser = await chromium.launch({ channel: 'chrome' });
try {
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('https://example.com', { waitUntil: 'load' });

  const title = await page.title();
  const viewport = page.viewportSize();

  console.log('title:', title);
  console.log('viewport:', JSON.stringify(viewport));

  await page.screenshot({ path: 'scripts/qa/screenshots/example-domain.png' });
  console.log('screenshot: scripts/qa/screenshots/example-domain.png');

  if (title !== 'Example Domain') {
    console.error('FAIL: unexpected title');
    process.exitCode = 1;
  } else {
    console.log('PASS');
  }
} finally {
  await browser.close();
}
