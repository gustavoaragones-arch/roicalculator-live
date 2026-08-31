/**
 * Phase 7C — page classification and visible-chrome policy.
 * JSON-LD breadcrumbs are managed separately (preserved by default).
 */

const PRIMARY_VERTICAL = new Set([
  'index.html',
  'saas/index.html',
  'real-estate/index.html',
  'solar/roi-calculator.html',
  'marketing/index.html'
]);

const PROGRAMMATIC_HUBS = new Set([
  'finance/index.html',
  'operations/index.html',
  'marketing/index.html'
]);

const SECONDARY_LANDING = new Set([
  'glossary/index.html',
  'benchmarks/index.html',
  'comparisons/index.html',
  'about.html',
  'contact.html',
  'methodology/index.html',
  'site-structure.html',
  'sitemap.html',
  'privacy.html',
  'terms.html',
  '404.html'
]);

/** @param {string} relPath repo-relative path using / */
export function classifyPage(relPath) {
  const p = relPath.replace(/\\/g, '/');
  if (p === 'index.html') return 'A';
  if (PRIMARY_VERTICAL.has(p)) return 'B';
  if (p.startsWith('calculators/')) return 'C';
  if (p.startsWith('roi-calculator/')) return 'D';
  if (p.startsWith('real-estate/') && p !== 'real-estate/index.html') return 'D';
  if (p === 'hvac/roi-calculator.html' || p === 'hr/roi-calculator.html') return 'D';
  if (PROGRAMMATIC_HUBS.has(p)) return 'E';
  if (p.startsWith('learn/')) return 'F';
  if (p === 'glossary/index.html') return 'G';
  if (p.startsWith('glossary/')) return 'H';
  if (SECONDARY_LANDING.has(p)) return 'I';
  if (p === 'benchmarks/index.html') return 'J';
  if (p.startsWith('benchmarks/')) return 'K';
  if (p === 'comparisons/index.html') return 'L';
  if (p.startsWith('comparisons/')) return 'M';
  if (p === 'privacy.html' || p === 'terms.html' || p === '404.html') return 'N';
  return 'O';
}

/** Visible breadcrumb nav — not JSON-LD. */
export function shouldShowVisibleBreadcrumb(relPath) {
  const cat = classifyPage(relPath);
  if (cat === 'A' || cat === 'B' || cat === 'E' || cat === 'G' || cat === 'I' || cat === 'J' || cat === 'L' || cat === 'N') {
    return false;
  }
  return true;
}

/** Empty ad-slot placeholders (no live ad integration). */
export function shouldStripEmptyAdSlots(relPath) {
  const cat = classifyPage(relPath);
  if (cat === 'A' || cat === 'B') return false;
  return true;
}

/** Generic sitewide stub blocks on section landing pages only. */
export function shouldStripGenericLandingStubs(relPath) {
  return relPath === 'glossary/index.html';
}
