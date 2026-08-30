/**
 * Phase 1 remediation — page-type / generation-boundary model.
 *
 * See reports/audits/AUDIT-02-CONTENT-IA.md, reports/audits/AUDIT-05-ARCHITECTURE.md,
 * and reports/audits/MASTER-DIAGNOSTIC.md. The audited failure was that generic
 * ROI boilerplate (a "What Is ROI?" entity-definition, a fixed "When to Use
 * This Calculation" bullet list, a fixed "Limitations of This Metric" bullet
 * list, and a fixed "This page provides a structured explanation of..."
 * citation sentence) was treated as a universal site component and stamped
 * onto every page regardless of type — including 404.html, privacy.html,
 * terms.html, and sitemap.html.
 *
 * This module is the single, inspectable place that answers "what generated
 * explanatory content may this page type receive?" Any future generator
 * MUST consult isModuleAllowed()/classifyPage() before emitting one of the
 * GENERIC_MODULES below, rather than emitting it unconditionally.
 *
 * This is deliberately NOT a per-page exclusion list — it is a small,
 * declarative table keyed by page TYPE (8 categories), so a new page is safe
 * by default: an unrecognized path classifies as UNKNOWN, which allows none
 * of the generic modules until someone explicitly maps it to a real type.
 */

/** The eight page types the Phase 1 remediation brief asked to distinguish, at minimum. */
export const PAGE_TYPES = Object.freeze({
  CALCULATOR: 'CALCULATOR',
  LEARNING_ARTICLE: 'LEARNING_ARTICLE',
  METHODOLOGY_TRUST: 'METHODOLOGY_TRUST',
  GLOSSARY_REFERENCE: 'GLOSSARY_REFERENCE',
  BENCHMARK_COMPARISON: 'BENCHMARK_COMPARISON',
  LEGAL_UTILITY: 'LEGAL_UTILITY',
  ERROR: 'ERROR',
  SITE_STRUCTURE_INDEX: 'SITE_STRUCTURE_INDEX',
  /** Fail-safe default for any path not matched below. Allows nothing. */
  UNKNOWN: 'UNKNOWN'
});

/**
 * Ordered path-pattern rules, most specific first. `test` receives a
 * repo-relative path using forward slashes (e.g. "benchmarks/index.html").
 * The first matching rule wins.
 */
const RULES = [
  { type: PAGE_TYPES.ERROR, test: (p) => p === '404.html' },
  { type: PAGE_TYPES.LEGAL_UTILITY, test: (p) => /^(privacy|terms|contact|about)\.html$/.test(p) },
  { type: PAGE_TYPES.SITE_STRUCTURE_INDEX, test: (p) => /^(site-structure|sitemap)\.html$/.test(p) },
  { type: PAGE_TYPES.METHODOLOGY_TRUST, test: (p) => p.startsWith('methodology/') },
  { type: PAGE_TYPES.GLOSSARY_REFERENCE, test: (p) => p.startsWith('glossary/') },
  { type: PAGE_TYPES.BENCHMARK_COMPARISON, test: (p) => p.startsWith('benchmarks/') || p.startsWith('comparisons/') },
  { type: PAGE_TYPES.LEARNING_ARTICLE, test: (p) => p.startsWith('learn/') },
  /**
   * Everything else that currently exists in the repository is a calculator
   * or a calculator-vertical hub page (a hub with no calculator on it today
   * is still product/CALCULATOR-tier content, not an article/reference page
   * — see MASTER-DIAGNOSTIC.md's target-architecture note that every hub
   * should eventually carry a working calculator). This is a deliberate
   * simplification of the 8 requested categories rather than a 9th type;
   * it is documented here rather than silently assumed.
   */
  {
    type: PAGE_TYPES.CALCULATOR,
    test: (p) =>
      p === 'index.html' ||
      p.startsWith('calculators/') ||
      p.startsWith('saas/') ||
      p.startsWith('real-estate/') ||
      p.startsWith('solar/') ||
      p.startsWith('marketing/') ||
      p.startsWith('finance/') ||
      p.startsWith('operations/') ||
      p.startsWith('hvac/') ||
      p.startsWith('hr/') ||
      p.startsWith('roi-calculator/')
  }
];

/** @param {string} relPath repo-relative path, forward-slashed, no leading "./" */
export function classifyPage(relPath) {
  var p = String(relPath || '').replace(/^\.\//, '').replace(/\\/g, '/');
  for (var i = 0; i < RULES.length; i++) {
    if (RULES[i].test(p)) return RULES[i].type;
  }
  return PAGE_TYPES.UNKNOWN;
}

/**
 * The four generated-explanatory-content modules the retired aeo_phase11.py
 * used to inject unconditionally. Kept as named constants (not the literal
 * boilerplate text — that lives only, inertly, in scripts/_retired/) so
 * validators and future generators can refer to them by name.
 */
export const GENERIC_MODULES = Object.freeze({
  ENTITY_DEFINITION: 'ENTITY_DEFINITION', // "What Is ROI (Return on Investment)?" stub
  USE_CASE_BLOCK: 'USE_CASE_BLOCK', // "When to Use This Calculation" bullets
  LIMITATIONS_BLOCK: 'LIMITATIONS_BLOCK', // "Limitations of This Metric" bullets
  AI_CITATION: 'AI_CITATION' // "This page provides a structured explanation of..." sentence
});

/**
 * Policy: which page types may carry a PAGE-SPECIFIC (i.e. hand-written,
 * calculator/topic-specific — never the literal generic boilerplate string)
 * version of each module. 'forbidden' means the module must not appear on
 * that page type at all, generic or otherwise.
 *
 * The master rule this table exists to enforce: GENERIC ROI boilerplate is
 * NOT a universal site component. A page must opt in to a specific content
 * module based on its actual type — this table is the opt-in surface.
 */
const ALLOWED = 'allowed-if-page-specific';
const FORBIDDEN = 'forbidden';

export const CONTENT_MODULE_POLICY = Object.freeze({
  [PAGE_TYPES.CALCULATOR]: {
    [GENERIC_MODULES.ENTITY_DEFINITION]: FORBIDDEN,
    [GENERIC_MODULES.USE_CASE_BLOCK]: ALLOWED,
    [GENERIC_MODULES.LIMITATIONS_BLOCK]: ALLOWED,
    [GENERIC_MODULES.AI_CITATION]: FORBIDDEN
  },
  [PAGE_TYPES.LEARNING_ARTICLE]: {
    [GENERIC_MODULES.ENTITY_DEFINITION]: ALLOWED,
    [GENERIC_MODULES.USE_CASE_BLOCK]: ALLOWED,
    [GENERIC_MODULES.LIMITATIONS_BLOCK]: ALLOWED,
    [GENERIC_MODULES.AI_CITATION]: ALLOWED
  },
  [PAGE_TYPES.METHODOLOGY_TRUST]: {
    // Methodology is the site's trust anchor (MASTER-DIAGNOSTIC.md "Target
    // Product"): it needs real, specific assumptions/limitations content,
    // never a generic "What is ROI" stub or a generic citation sentence.
    [GENERIC_MODULES.ENTITY_DEFINITION]: FORBIDDEN,
    [GENERIC_MODULES.USE_CASE_BLOCK]: FORBIDDEN,
    [GENERIC_MODULES.LIMITATIONS_BLOCK]: ALLOWED,
    [GENERIC_MODULES.AI_CITATION]: FORBIDDEN
  },
  [PAGE_TYPES.GLOSSARY_REFERENCE]: {
    // Each term page may define ITS OWN term ("What is CAC?"), never the
    // generic ROI entity-definition.
    [GENERIC_MODULES.ENTITY_DEFINITION]: FORBIDDEN,
    [GENERIC_MODULES.USE_CASE_BLOCK]: FORBIDDEN,
    [GENERIC_MODULES.LIMITATIONS_BLOCK]: ALLOWED,
    [GENERIC_MODULES.AI_CITATION]: FORBIDDEN
  },
  [PAGE_TYPES.BENCHMARK_COMPARISON]: {
    [GENERIC_MODULES.ENTITY_DEFINITION]: FORBIDDEN,
    [GENERIC_MODULES.USE_CASE_BLOCK]: ALLOWED,
    [GENERIC_MODULES.LIMITATIONS_BLOCK]: ALLOWED,
    [GENERIC_MODULES.AI_CITATION]: FORBIDDEN
  },
  [PAGE_TYPES.LEGAL_UTILITY]: {
    [GENERIC_MODULES.ENTITY_DEFINITION]: FORBIDDEN,
    [GENERIC_MODULES.USE_CASE_BLOCK]: FORBIDDEN,
    [GENERIC_MODULES.LIMITATIONS_BLOCK]: FORBIDDEN,
    [GENERIC_MODULES.AI_CITATION]: FORBIDDEN
  },
  [PAGE_TYPES.ERROR]: {
    [GENERIC_MODULES.ENTITY_DEFINITION]: FORBIDDEN,
    [GENERIC_MODULES.USE_CASE_BLOCK]: FORBIDDEN,
    [GENERIC_MODULES.LIMITATIONS_BLOCK]: FORBIDDEN,
    [GENERIC_MODULES.AI_CITATION]: FORBIDDEN
  },
  [PAGE_TYPES.SITE_STRUCTURE_INDEX]: {
    [GENERIC_MODULES.ENTITY_DEFINITION]: FORBIDDEN,
    [GENERIC_MODULES.USE_CASE_BLOCK]: FORBIDDEN,
    [GENERIC_MODULES.LIMITATIONS_BLOCK]: FORBIDDEN,
    [GENERIC_MODULES.AI_CITATION]: FORBIDDEN
  },
  [PAGE_TYPES.UNKNOWN]: {
    // Fail-safe default: nothing is allowed on an unclassified page.
    [GENERIC_MODULES.ENTITY_DEFINITION]: FORBIDDEN,
    [GENERIC_MODULES.USE_CASE_BLOCK]: FORBIDDEN,
    [GENERIC_MODULES.LIMITATIONS_BLOCK]: FORBIDDEN,
    [GENERIC_MODULES.AI_CITATION]: FORBIDDEN
  }
});

/**
 * @param {string} pageType one of PAGE_TYPES
 * @param {string} moduleName one of GENERIC_MODULES
 * @returns {boolean} true only if this page type may carry a page-specific
 *   version of this module. Never true for the literal generic boilerplate
 *   string — that check is a separate, stricter one (see
 *   validate-generation-safety.mjs Check A), because even an "allowed-if-
 *   page-specific" module is a violation if its content is the unmodified
 *   generic template text.
 */
export function isModuleAllowed(pageType, moduleName) {
  var policy = CONTENT_MODULE_POLICY[pageType] || CONTENT_MODULE_POLICY[PAGE_TYPES.UNKNOWN];
  return policy[moduleName] === ALLOWED;
}

/**
 * Structural signatures for each GENERIC_MODULES entry — detect that a
 * module of this TYPE is present on a page via its wrapper class, regardless
 * of whether its content is the literal retired generic boilerplate or a
 * genuine page-specific version. This is what lets validate-generation-safety.mjs's
 * Check F enforce "a page-specific module is allowed only where
 * CONTENT_MODULE_POLICY permits it" (a FORBIDDEN page type must reject the
 * module even in page-specific form) as distinct from "the literal generic
 * text is never allowed even where the module category is otherwise
 * permitted" (an ALLOWED-IF-PAGE-SPECIFIC page type still must not carry the
 * unmodified generic template text).
 */
export const MODULE_STRUCTURAL_SIGNATURES = Object.freeze({
  [GENERIC_MODULES.ENTITY_DEFINITION]: /class="entity-definition"/,
  [GENERIC_MODULES.USE_CASE_BLOCK]: /class="use-case-block"/,
  [GENERIC_MODULES.LIMITATIONS_BLOCK]: /class="limitations-block"/,
  [GENERIC_MODULES.AI_CITATION]: /class="ai-citation"/
});

/** Calculator-shaped markup signatures — used to detect a calculator module
 * landing on a page type that should never have one (Check B). */
export const CALCULATOR_MODULE_SIGNATURES = Object.freeze([
  /class="calculator-module"/,
  /id="factory-calc-form"/,
  /class="calculator-form/,
  /<form[^>]*id="[a-z-]*roi-form"/,
  /<form[^>]*id="[a-z-]*-calc-form"/
]);

export const FORBIDDEN_CALCULATOR_PAGE_TYPES = Object.freeze([
  PAGE_TYPES.LEGAL_UTILITY,
  PAGE_TYPES.ERROR,
  PAGE_TYPES.SITE_STRUCTURE_INDEX,
  PAGE_TYPES.GLOSSARY_REFERENCE
]);
