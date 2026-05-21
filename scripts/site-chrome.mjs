/**
 * Phase 18.4 — Shared homepage/footer links and BreadcrumbList JSON-LD helpers.
 */
import { CANONICAL_ORIGIN, canonicalUrl } from './site-config.mjs';

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
