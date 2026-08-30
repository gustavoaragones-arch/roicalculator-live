/**
 * Phase 18.1 — Single canonical origin for all generated URLs.
 * Never use https://www.roicalculator.live in canonicals, sitemaps, or JSON-LD.
 */
export const CANONICAL_ORIGIN = 'https://roicalculator.live';

/** @param {string} pathname Path starting with / (e.g. /calculators/foo.html or /finance/) */
export function canonicalUrl(pathname) {
  const p = pathname.startsWith('/') ? pathname : '/' + pathname;
  return CANONICAL_ORIGIN + p;
}

/** Phase 18.2 — single public URL for methodology (trailing slash). */
export const METHODOLOGY_PATH = '/methodology/';

/** Netlify / Cloudflare Pages www + HTTPS apex redirects (Phase 18.1). */
export const REDIRECTS_CONTENT = `http://www.roicalculator.live/* https://roicalculator.live/:splat 301
https://www.roicalculator.live/* https://roicalculator.live/:splat 301
http://roicalculator.live/* https://roicalculator.live/:splat 301
/methodology.html /methodology/ 301

# Phase 2 — SaaS reference implementation consolidation.
# /saas/ is now the single canonical SaaS ROI hub with the calculator
# on-page; these two legacy URLs are consolidated into it. See
# reports/audits/MASTER-DIAGNOSTIC.md and AUDIT-04-SEO-AEO.md (SaaS trio
# cannibalization). Force flag (!) ensures the redirect fires even though
# no file remains at these paths — belt and suspenders, matches Netlify's
# documented precedence rule for redirects vs. static files.
/saas/roi-calculator.html /saas/ 301!
/roi-calculator/saas/ /saas/ 301!
/roi-calculator/saas/index.html /saas/ 301!
`;
