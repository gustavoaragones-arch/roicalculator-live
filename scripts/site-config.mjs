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
`;
