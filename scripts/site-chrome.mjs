/**
 * Phase 18.4 — Shared homepage/footer links and BreadcrumbList JSON-LD helpers.
 *
 * Phase 1 remediation (see reports/audits/AUDIT-05-ARCHITECTURE.md and
 * reports/audits/MASTER-DIAGNOSTIC.md): this module is now also the single
 * authoritative source for the site header/nav and site footer markup.
 * Previously this HTML existed as four independently-maintained copies
 * (partials/header.html, generate-calculators.mjs's own string constant,
 * the now-retired patch-phase176.mjs's own string constant, and the baked
 * HTML on every page). Every one of those consumers must now import
 * SITE_HEADER_HTML / SITE_FOOTER_HTML from here instead of hardcoding its
 * own copy. See scripts/sync-site-chrome.mjs for how already-published pages
 * are kept in sync with this source.
 */
import { CANONICAL_ORIGIN, canonicalUrl } from './site-config.mjs';

/**
 * Accessible "Calculators" disclosure control: a real <button> (focusable,
 * activatable with Enter/Space natively) with aria-expanded reflecting open
 * state and aria-controls pointing at the menu it discloses. Fixes the P0
 * keyboard-accessibility defect documented in AUDIT-06-A11Y-PERFORMANCE.md
 * P0-1: the previous <span> trigger had no tabindex/role/aria-expanded and
 * could not be reached or operated from the keyboard. See assets/js/navigation.js
 * for the interaction logic (click/Enter/Space to toggle, Escape to close and
 * return focus, outside-click to close) and assets/css/styles.css for the
 * button-reset styling that keeps this visually identical to the old <span>.
 */
export const SITE_HEADER_HTML =
  '<header class="site-header">\n' +
  '    <nav class="nav-main" aria-label="Main navigation">\n' +
  '      <a href="/" class="logo">roicalculator.live</a>\n' +
  '      <ul class="nav-links">\n' +
  '        <li><a href="/">Home</a></li>\n' +
  '        <li><a href="/real-estate/index.html">Real Estate</a></li>\n' +
  '        <li><a href="/solar/roi-calculator.html">Solar</a></li>\n' +
  '        <li><a href="/saas/index.html">SaaS</a></li>\n' +
  '        <li class="nav-dropdown">\n' +
  '          <button type="button" class="nav-dropdown-toggle" aria-expanded="false" aria-controls="calculators-menu">Calculators</button>\n' +
  '          <div class="nav-dropdown-menu" id="calculators-menu" role="navigation" aria-label="Calculator tools">\n' +
  '            <a href="/marketing/index.html">Marketing ROI</a>\n' +
  '            <a href="/real-estate/index.html">Real Estate ROI</a>\n' +
  '            <a href="/saas/index.html">SaaS ROI</a>\n' +
  '            <a href="/solar/roi-calculator.html">Solar ROI</a>\n' +
  '            <a href="/hvac/roi-calculator.html">HVAC ROI</a>\n' +
  '            <a href="/hr/roi-calculator.html">Employee ROI</a>\n' +
  '          </div>\n' +
  '        </li>\n' +
  '        <li><a href="/learn/what-is-roi.html">Learn</a></li>\n' +
  '        <li><a href="/glossary/">Glossary</a></li>\n' +
  '        <li><a href="/methodology/">Methodology</a></li>\n' +
  '        <li><a href="/about.html">About</a></li>\n' +
  '      </ul>\n' +
  '      <span class="badge-privacy" aria-label="Privacy statement">🔒 No cookies. No tracking.</span>\n' +
  '    </nav>\n' +
  '  </header>';

export const TRENDING_TOOLS_SECTION_HTML =
  '      <section class="explore-industry trending-tools">\n' +
  '        <h3>Trending ROI Tools</h3>\n' +
  '        <ul class="industry-list">\n' +
  '          <li><a href="/calculators/simple-roi-calculator.html">Simple ROI Calculator</a></li>\n' +
  '          <li><a href="/calculators/free-roi-calculator.html">Free ROI Calculator</a></li>\n' +
  '          <li><a href="/calculators/roi-calculator-example.html">ROI Calculator Example</a></li>\n' +
  '          <li><a href="/real-estate/index.html">Real Estate ROI</a></li>\n' +
  '          <li><a href="/solar/roi-calculator.html">Solar ROI</a></li>\n' +
  '          <li><a href="/saas/index.html">SaaS ROI</a></li>\n' +
  '        </ul>\n' +
  '      </section>\n';

export const POPULAR_TOOLS_FOOTER_HTML =
  '  <nav class="footer-popular" aria-label="Popular tools">\n' +
  '    <p class="footer-popular-label">Popular Tools</p>\n' +
  '    <a href="/calculators/simple-roi-calculator.html">Simple ROI Calculator</a>\n' +
  '    <a href="/calculators/free-roi-calculator.html">Free ROI Calculator</a>\n' +
  '    <a href="/calculators/roi-calculator-example.html">ROI Calculator Example</a>\n' +
  '    <a href="/real-estate/index.html">Real Estate ROI</a>\n' +
  '    <a href="/solar/roi-calculator.html">Solar ROI</a>\n' +
  '    <a href="/saas/index.html">SaaS ROI</a>\n' +
  '  </nav>\n\n';

export const SITE_FOOTER_HTML =
  '<footer class="site-footer">\n' +
  '\n' +
  '  <p class="footer-mini">\n' +
  '    Private ROI calculators for financial and operational analysis.\n' +
  '  </p>\n' +
  '\n' +
  '  <nav class="footer-links">\n' +
  '    <a href="/marketing/index.html">Marketing ROI</a>\n' +
  '    <a href="/real-estate/index.html">Real Estate ROI</a>\n' +
  '    <a href="/saas/index.html">SaaS ROI</a>\n' +
  '    <a href="/solar/roi-calculator.html">Solar ROI</a>\n' +
  '    <a href="/benchmarks/index.html">Benchmarks</a>\n' +
  '    <a href="/comparisons/index.html">Comparisons</a>\n' +
  '  </nav>\n' +
  '\n' +
  POPULAR_TOOLS_FOOTER_HTML +
  '  <nav class="footer-secondary">\n' +
  '    <a href="/methodology/">Methodology</a>\n' +
  '    <a href="/about.html">About</a>\n' +
  '    <a href="/privacy.html">Privacy</a>\n' +
  '    <a href="/terms.html">Terms</a>\n' +
  '    <a href="/contact.html">Contact</a>\n' +
  '  </nav>\n' +
  '\n' +
  '  <p class="footer-disclaimer">\n' +
  '    For informational purposes only. Not financial or investment advice.\n' +
  '  </p>\n' +
  '\n' +
  '  <p class="footer-copy">\n' +
  '    © 2026 Albor Digital LLC\n' +
  '  </p>\n' +
  '\n' +
  '</footer>';

/** @param {{ name: string, url?: string }[]} items */
export function breadcrumbListJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(function (entry, index) {
      var node = {
        '@type': 'ListItem',
        position: index + 1,
        name: entry.name
      };
      if (entry.url) node.item = entry.url;
      return node;
    })
  };
}

export function breadcrumbJsonLdString(items) {
  return JSON.stringify(breadcrumbListJsonLd(items));
}

/** Home → category hub → calculator page */
export function calculatorBreadcrumbJsonLd(calc, categoryMeta) {
  var hubPath = '/' + (calc.category || 'marketing') + '/';
  var cat = categoryMeta || { label: 'Calculators' };
  return breadcrumbJsonLdString([
    { name: 'Home', url: CANONICAL_ORIGIN + '/' },
    { name: cat.label, url: canonicalUrl(hubPath) },
    { name: calc.title, url: canonicalUrl('/calculators/' + calc.slug + '.html') }
  ]);
}

/** Home → category hub (collection page) */
export function hubBreadcrumbJsonLd(categoryKey, categoryMeta) {
  var hubPath = '/' + categoryKey + '/';
  var cat = categoryMeta;
  return breadcrumbJsonLdString([
    { name: 'Home', url: CANONICAL_ORIGIN + '/' },
    { name: cat.label, url: canonicalUrl(hubPath) },
    { name: cat.hubTitle, url: canonicalUrl(hubPath) }
  ]);
}

/** Static pages: Home → section → page */
export function staticPageBreadcrumbJsonLd(sectionName, sectionUrl, pageName, pageUrl) {
  return breadcrumbJsonLdString([
    { name: 'Home', url: CANONICAL_ORIGIN + '/' },
    { name: sectionName, url: sectionUrl || undefined },
    { name: pageName, url: pageUrl || undefined }
  ]);
}
