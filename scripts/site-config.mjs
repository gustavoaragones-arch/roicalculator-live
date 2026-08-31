/**
 * Phase 18.1 — Single canonical origin for all generated URLs.
 * Never use https://www.roicalculator.live in canonicals, sitemaps, or JSON-LD.
 */
export const CANONICAL_ORIGIN = 'https://roicalculator.live';

/** Bust CDN/browser cache when shared CSS changes (Phase 7B-02). */
export const STYLESHEET_HREF = '/assets/css/styles.css?v=7b02';

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
# cannibalization).
#
# REPAIR_REDIRECTS-01: the trailing "!" force flag on every rule below was
# Netlify-specific syntax and is NOT part of Cloudflare Pages' documented
# _redirects grammar (only bare 301/302/303/307/308 are valid — see
# https://developers.cloudflare.com/pages/configuration/redirects/). Cloudflare
# Pages silently dropped every rule using "301!", which is why all Phase 2-5
# legacy-URL consolidation redirects returned 404 in production despite the
# current repository being deployed. The force flag was already unnecessary
# "belt and suspenders" (verified: no static file remains at any source path
# below), so removing it is a pure syntax fix with no behavior change beyond
# making these rules actually take effect.
/saas/roi-calculator.html /saas/ 301
/roi-calculator/saas/ /saas/ 301
/roi-calculator/saas/index.html /saas/ 301

# Phase 3 — Real Estate reference implementation consolidation.
# /real-estate/ is now the single canonical Real Estate ROI hub with the
# rental property ROI calculator on-page; the standalone calculator page and
# the entire legacy /roi-calculator/real-estate/ subtree (hub + 3 duplicate
# child calculators) are consolidated into /real-estate/ and its 3 retained,
# genuinely distinct child tools. See reports/audits/MASTER-DIAGNOSTIC.md and
# AUDIT-02-CONTENT-IA.md §3.4 (Real Estate near-duplicate pairs).
/real-estate/roi-calculator.html /real-estate/ 301
/roi-calculator/real-estate/ /real-estate/ 301
/roi-calculator/real-estate/index.html /real-estate/ 301
/roi-calculator/real-estate/rental-property-roi.html /real-estate/ 301
/roi-calculator/real-estate/cash-on-cash-return.html /real-estate/cash-on-cash-calculator.html 301
/roi-calculator/real-estate/fix-and-flip-roi.html /real-estate/flip-roi-calculator.html 301

# Phase 4 — Solar reference implementation consolidation.
# /solar/roi-calculator.html is the single canonical Solar ROI page (already
# the deeply-linked destination from site-wide nav/footer/homepage). The
# links-only guide hub at /solar/, the legacy /roi-calculator/solar/ hub, and
# its duplicate solar-panel-roi.html calculator are consolidated into it.
# heat-pump-roi.html and ev-charger-roi.html remain distinct child tools at
# their existing /roi-calculator/solar/ paths (genuinely different equipment
# and inputs). See reports/audits/MASTER-DIAGNOSTIC.md.
/solar/ /solar/roi-calculator.html 301
/solar/index.html /solar/roi-calculator.html 301
/roi-calculator/solar/ /solar/roi-calculator.html 301
/roi-calculator/solar/index.html /solar/roi-calculator.html 301
/roi-calculator/solar/solar-panel-roi.html /solar/roi-calculator.html 301

# Phase 5 — Marketing reference implementation consolidation.
# /marketing/ (generator-controlled category hub) plus the 4 factory
# calculators under /calculators/ are already the canonical Marketing
# architecture — this phase did not create a new hub. The legacy
# /roi-calculator/marketing/ hub duplicates /marketing/'s intent, and its
# email-marketing-roi.html duplicates the factory's
# email-marketing-roi-calculator.html; both are consolidated. roas-calculator.html
# and lead-generation-roi.html remain distinct child tools at their existing
# /roi-calculator/marketing/ paths (genuinely different metrics/spend
# categories, no factory equivalent). See reports/audits/MASTER-DIAGNOSTIC.md.
/roi-calculator/marketing/ /marketing/ 301
/roi-calculator/marketing/index.html /marketing/ 301
/roi-calculator/marketing/email-marketing-roi.html /calculators/email-marketing-roi-calculator.html 301

# Phase 7G — generic-ROI content consolidation per
# reports/audits/PHASE-7F-CONTENT-SEO-AEO-AUDIT.md. simple-roi-calculator.html,
# free-roi-calculator.html, and roi-calculator-example.html were a thin,
# mathematically-duplicate (identical formula shape to the homepage and to
# each other, confirmed by validate-generation-safety.mjs Check D),
# doorway-page-shaped cluster targeting keyword variants of the same head
# term. Director decision: consolidate into the homepage, the canonical
# generic ROI Calculator destination. roi-vs-other-metrics.html was the
# weakest member of the ROI-vs-IRR/NPV content cluster (262 words, generic
# FAQ) versus the two deep, canonical comparison articles; consolidated into
# the comparisons hub rather than duplicating either article.
/calculators/simple-roi-calculator.html / 301
/calculators/free-roi-calculator.html / 301
/calculators/roi-calculator-example.html / 301
/calculators/roi-vs-other-metrics.html /comparisons/ 301
`;
