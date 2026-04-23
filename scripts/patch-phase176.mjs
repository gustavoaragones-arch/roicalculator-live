#!/usr/bin/env node
/**
 * Phase 17.6 — replace site-header and site-footer blocks sitewide (static HTML).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const STANDARD_HEADER = `<header class="site-header">
    <nav class="nav-main" aria-label="Main navigation">
      <a href="/" class="logo">roicalculator.live</a>
      <ul class="nav-links">
        <li><a href="/">Home</a></li>
        <li><a href="/real-estate/index.html">Real Estate</a></li>
        <li><a href="/solar/roi-calculator.html">Solar</a></li>
        <li><a href="/saas/index.html">SaaS</a></li>
        <li class="nav-dropdown">
          <span>Calculators</span>
          <div class="nav-dropdown-menu" role="navigation" aria-label="Calculator tools">
            <a href="/marketing/index.html">Marketing ROI</a>
            <a href="/real-estate/index.html">Real Estate ROI</a>
            <a href="/saas/index.html">SaaS ROI</a>
            <a href="/solar/roi-calculator.html">Solar ROI</a>
            <a href="/hvac/roi-calculator.html">HVAC ROI</a>
            <a href="/hr/roi-calculator.html">Employee ROI</a>
          </div>
        </li>
        <li><a href="/learn/what-is-roi.html">Learn</a></li>
        <li><a href="/glossary/">Glossary</a></li>
        <li><a href="/methodology.html">Methodology</a></li>
        <li><a href="/about.html">About</a></li>
      </ul>
      <span class="badge-privacy" aria-label="Privacy statement">🔒 No cookies. No tracking.</span>
    </nav>
  </header>`;

const OLD_FOOTER = `<footer class="site-footer site-footer--minimal">
    <p class="footer-copyright">© 2026 Albor Digital LLC</p>
    <p class="footer-edu">Educational use only</p>
    <nav class="footer-links footer-links--compact" aria-label="Footer">
      <a href="/privacy.html">Privacy</a>
      <a href="/terms.html">Terms</a>
      <a href="/contact.html">Contact</a>
      <a href="/sitemap.html">Sitemap</a>
    </nav>
  </footer>`;

const NEW_FOOTER = `<footer class="site-footer">

  <p class="footer-mini">
    Private ROI calculators for financial and operational analysis.
  </p>

  <nav class="footer-links">
    <a href="/marketing/index.html">Marketing ROI</a>
    <a href="/real-estate/index.html">Real Estate ROI</a>
    <a href="/saas/index.html">SaaS ROI</a>
    <a href="/solar/roi-calculator.html">Solar ROI</a>
    <a href="/benchmarks/index.html">Benchmarks</a>
    <a href="/comparisons/index.html">Comparisons</a>
  </nav>

  <nav class="footer-secondary">
    <a href="/methodology.html">Methodology</a>
    <a href="/about.html">About</a>
    <a href="/privacy.html">Privacy</a>
    <a href="/terms.html">Terms</a>
    <a href="/contact.html">Contact</a>
  </nav>

  <p class="footer-disclaimer">
    For informational purposes only. Not financial or investment advice.
  </p>

  <p class="footer-copy">
    © 2026 Albor Digital LLC
  </p>

</footer>`;

function walkHtml(dir, out) {
  var list = fs.readdirSync(dir, { withFileTypes: true });
  for (var i = 0; i < list.length; i++) {
    var ent = list[i];
    var full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === 'node_modules' || ent.name === '.git') continue;
      walkHtml(full, out);
    } else if (ent.name.endsWith('.html')) {
      out.push(full);
    }
  }
}

function main() {
  var files = [];
  walkHtml(ROOT, files);
  var nH = 0;
  var nF = 0;
  files.forEach(function (file) {
    var s = fs.readFileSync(file, 'utf8');
    var out = s;
    if (out.includes('<header class="site-header">')) {
      var h = out.replace(/<header class="site-header">[\s\S]*?<\/header>/, STANDARD_HEADER);
      if (h !== out) {
        nH++;
        out = h;
      }
    }
    if (out.includes(OLD_FOOTER)) {
      var f = out.split(OLD_FOOTER).join(NEW_FOOTER);
      if (f !== out) {
        nF++;
        out = f;
      }
    }
    if (out !== s) {
      fs.writeFileSync(file, out, 'utf8');
    }
  });
  console.log('Phase 17.6 patch: headers updated in', nH, 'files, footers in', nF, 'files (of', files.length, 'html).');
}

main();
