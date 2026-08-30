#!/usr/bin/env node
/**
 * Phase 1 remediation — generation-safety validator.
 *
 * See reports/audits/AUDIT-05-ARCHITECTURE.md and reports/audits/MASTER-DIAGNOSTIC.md.
 * Extends the same validation philosophy the calculator factory already uses
 * (scripts/calculator-quality.mjs's duplicate-slug/title/formula/FAQ checks)
 * to the whole generation system, per the Phase 1 brief's five required
 * checks:
 *
 *   A. Global boilerplate contamination — the same generic explanatory block
 *      appearing across unrelated page types.
 *   B. Invalid page-type modules — a calculator-shaped module emitted onto a
 *      page type that must never have one (legal, error, sitemap, glossary).
 *   C. Duplicate canonical concepts — multiple independently-canonicalized
 *      pages whose titles are substantially the same idea.
 *   D. Duplicate calculator formulas — reuses calculator-quality.mjs's
 *      (now-normalized) formula fingerprinting rather than reimplementing it.
 *   E. Duplicate titles within a concept family — materially identical
 *      calculator titles on distinct URLs.
 *   F. Page-type module policy enforcement — Phase 1A. Check A only flags
 *      contamination once a generic block appears across >=2 page types,
 *      which means a single forbidden occurrence on one page type would pass
 *      undetected. Check F closes that gap by directly enforcing
 *      CONTENT_MODULE_POLICY (scripts/page-types.mjs) against every single
 *      page, individually, regardless of how many other pages share the
 *      violation. Check A is retained unchanged as a separate diagnostic —
 *      it reproduces the historical audit counts and is useful on its own
 *      terms; Check F is the actual enforcement layer.
 *
 * IMPORTANT — this script intentionally finds and reports PRE-EXISTING
 * violations. That is its job: prevent regression by making the current
 * state visible, not conceal it. It exits non-zero whenever it finds
 * anything, exactly as it should. It is NOT wired into generate-calculators.mjs's
 * automatic chain, because doing so would immediately and permanently break
 * that (currently legitimate, currently passing) pipeline over legacy-tier
 * content this phase is explicitly scoped not to fix — see the "Generator
 * safety" note in reports from this phase for the reasoning. Run it
 * explicitly:
 *
 *   node scripts/validate-generation-safety.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { validateConfigs } from './calculator-quality.mjs';
import {
  PAGE_TYPES,
  GENERIC_MODULES,
  classifyPage,
  isModuleAllowed,
  CONTENT_MODULE_POLICY,
  MODULE_STRUCTURAL_SIGNATURES,
  CALCULATOR_MODULE_SIGNATURES,
  FORBIDDEN_CALCULATOR_PAGE_TYPES
} from './page-types.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DATA_PATH = path.join(ROOT, 'data', 'calculators.json');
const SKIP_DIRS = new Set(['.git', 'node_modules', 'scripts', 'reports']);
/** Not real published pages — excluded from title/canonical-based checks (C, E). */
const NON_PAGE_DIRS = new Set(['templates', 'partials']);

function walkHtml(dir, out, relBase) {
  for (const name of fs.readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walkHtml(full, out, relBase);
    else if (name.endsWith('.html')) out.push(full);
  }
}

function relPath(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function isRealPage(rel) {
  var top = rel.split('/')[0];
  return !NON_PAGE_DIRS.has(top);
}

// ---------------------------------------------------------------------------
// Check A — global boilerplate contamination
// ---------------------------------------------------------------------------
const GENERIC_SIGNATURES = [
  {
    module: GENERIC_MODULES.ENTITY_DEFINITION,
    label: 'entity-definition "What Is ROI?" stub',
    test: function (html) {
      return html.indexOf(
        'Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost.'
      ) !== -1;
    }
  },
  {
    module: GENERIC_MODULES.USE_CASE_BLOCK,
    label: 'generic "When to Use This Calculation" bullets',
    test: function (html) {
      return (
        html.indexOf('Evaluating investment profitability') !== -1 &&
        html.indexOf('Comparing multiple opportunities') !== -1 &&
        html.indexOf('Estimating return over time') !== -1
      );
    }
  },
  {
    module: GENERIC_MODULES.LIMITATIONS_BLOCK,
    label: 'generic "Limitations of This Metric" bullets',
    test: function (html) {
      return (
        html.indexOf('Does not account for time value of money') !== -1 &&
        html.indexOf('Depends on assumptions') !== -1 &&
        html.indexOf('May not reflect risk') !== -1
      );
    }
  },
  {
    module: GENERIC_MODULES.AI_CITATION,
    label: 'generic "This page provides a structured explanation of..." citation',
    test: function (html) {
      return /This page provides a structured explanation of [^<]*, including formulas, examples, limitations, and comparisons with related financial metrics\./.test(
        html
      );
    }
  }
];

function runCheckA(files) {
  var findings = [];
  GENERIC_SIGNATURES.forEach(function (sig) {
    var byType = new Map();
    files.forEach(function (file) {
      var rel = relPath(file);
      var html = fs.readFileSync(file, 'utf8');
      if (!sig.test(html)) return;
      var type = classifyPage(rel);
      if (!byType.has(type)) byType.set(type, []);
      byType.get(type).push(rel);
    });
    var typesTouched = Array.from(byType.keys());
    if (typesTouched.length >= 2) {
      var totalFiles = 0;
      byType.forEach(function (arr) {
        totalFiles += arr.length;
      });
      findings.push({
        check: 'A',
        module: sig.module,
        message:
          'Global boilerplate contamination: ' +
          sig.label +
          ' appears across ' +
          typesTouched.length +
          ' unrelated page types (' +
          typesTouched.join(', ') +
          '), ' +
          totalFiles +
          ' file(s) total.',
        detail: Array.from(byType.entries()).map(function (entry) {
          return entry[0] + ': ' + entry[1].length + ' file(s), e.g. ' + entry[1].slice(0, 3).join(', ');
        })
      });
    }
  });
  return findings;
}

// ---------------------------------------------------------------------------
// Check B — invalid page-type modules
// ---------------------------------------------------------------------------
function runCheckB(files) {
  var findings = [];
  files.forEach(function (file) {
    var rel = relPath(file);
    var type = classifyPage(rel);
    if (FORBIDDEN_CALCULATOR_PAGE_TYPES.indexOf(type) === -1) return;
    var html = fs.readFileSync(file, 'utf8');
    CALCULATOR_MODULE_SIGNATURES.forEach(function (re) {
      if (re.test(html)) {
        findings.push({
          check: 'B',
          message:
            'Invalid page-type module: ' + rel + ' (page type ' + type + ') contains a calculator-shaped module matching ' + re + '.'
        });
      }
    });
  });
  return findings;
}

// ---------------------------------------------------------------------------
// Check F — page-type module policy enforcement (Phase 1A)
// ---------------------------------------------------------------------------
// Reuses GENERIC_SIGNATURES (no second copy of the literal boilerplate
// strings) purely to detect the GENERIC (never-page-specific) text of each
// module. Module *presence regardless of content* is detected separately via
// MODULE_STRUCTURAL_SIGNATURES, imported from page-types.mjs, so this check
// can also catch a page-specific module landing on a page type where the
// whole module category is forbidden — not just a generic one.
var GENERIC_TEST_BY_MODULE = {};
GENERIC_SIGNATURES.forEach(function (sig) {
  GENERIC_TEST_BY_MODULE[sig.module] = sig.test;
});

/**
 * Pure function — no filesystem access — so it can be exercised directly
 * against synthetic HTML in a test fixture, not just real repository files.
 * @param {string} rel repo-relative path
 * @param {string} html full page HTML
 * @returns {Array} findings for this single page
 */
export function evaluatePageModulePolicy(rel, html) {
  var findings = [];
  var type = classifyPage(rel);
  var policyForType = CONTENT_MODULE_POLICY[type] || CONTENT_MODULE_POLICY[PAGE_TYPES.UNKNOWN];

  Object.keys(GENERIC_MODULES).forEach(function (key) {
    var moduleName = GENERIC_MODULES[key];
    var allowed = isModuleAllowed(type, moduleName);
    var policyValue = policyForType[moduleName];

    var structuralRe = MODULE_STRUCTURAL_SIGNATURES[moduleName];
    var modulePresent = structuralRe ? structuralRe.test(html) : false;

    var genericTest = GENERIC_TEST_BY_MODULE[moduleName];
    var genericPresent = genericTest ? genericTest(html) : false;

    // Rule A / Rule C: the module (generic OR page-specific) is present on a
    // page type whose policy is 'forbidden'. Fires on a single page — does
    // not require any cross-page-type spread the way Check A does.
    if (!allowed && modulePresent) {
      findings.push({
        check: 'F',
        message:
          'Page-type policy violation: ' +
          rel +
          ' (page type ' +
          type +
          ') contains module ' +
          moduleName +
          ' (policy: ' +
          policyValue +
          ').'
      });
      return; // don't also double-report the same page/module via the generic-text rule below
    }

    // Rule B: even where the module category is 'allowed-if-page-specific',
    // the literal unmodified generic boilerplate text is never a valid
    // instance of "page-specific" and must still be rejected.
    if (allowed && genericPresent) {
      findings.push({
        check: 'F',
        message:
          'Page-type policy violation: ' +
          rel +
          ' (page type ' +
          type +
          ') carries the literal generic ' +
          moduleName +
          ' boilerplate text; this page type permits only a page-specific version (policy: ' +
          policyValue +
          '), never the unmodified generic template.'
      });
    }
  });

  return findings;
}

function runCheckF(files) {
  var findings = [];
  files.forEach(function (file) {
    var rel = relPath(file);
    var html = fs.readFileSync(file, 'utf8');
    findings = findings.concat(evaluatePageModulePolicy(rel, html));
  });
  return findings;
}

// ---------------------------------------------------------------------------
// Checks C & E — title-based duplicate-concept detection
// ---------------------------------------------------------------------------
const STOPWORDS = new Set([
  'the', 'a', 'an', 'of', 'and', 'for', 'with', 'to', 'in', 'on', 'or', 'by', 'vs', 'vs.', '&',
  'is', 'are', 'your', 'you', 'how', 'what', 'when', 'which', 'roicalculator.live',
  // Domain-generic words: on a site whose entire content is "ROI calculators,"
  // these carry ~no discriminating power (present in 60-80+ titles) and, left
  // in, produce false-positive "duplicate concept" matches between pages that
  // merely share the site's own title template (e.g. "[X] ROI Guide &
  // Calculator" for two different, legitimately distinct verticals).
  'roi', 'calculator', 'calculators', 'guide'
]);

function extractTitle(html) {
  var m = html.match(/<title>([^<]*)<\/title>/i);
  return m ? m[1].trim() : null;
}

function extractCanonical(html) {
  var m = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
  return m ? m[1].trim() : null;
}

function normalizeTitleTokens(title) {
  var withoutSiteSuffix = String(title || '').replace(/\|\s*roicalculator\.live\s*$/i, '');
  var cleaned = withoutSiteSuffix
    .toLowerCase()
    .replace(/&amp;/g, '&')
    .replace(/[^a-z0-9\s&]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned
    .split(' ')
    .filter(function (t) {
      return t && !STOPWORDS.has(t);
    });
}

function normalizeTitleExact(title) {
  return normalizeTitleTokens(title).sort().join(' ');
}

function collectPageMeta(files) {
  var pages = [];
  files.forEach(function (file) {
    var rel = relPath(file);
    if (!isRealPage(rel)) return;
    var html = fs.readFileSync(file, 'utf8');
    var title = extractTitle(html);
    var canonical = extractCanonical(html);
    if (!title || !canonical) return;
    pages.push({ rel: rel, title: title, canonical: canonical, type: classifyPage(rel), tokens: normalizeTitleTokens(title) });
  });
  return pages;
}

function overlapCoefficient(a, b) {
  var setA = new Set(a);
  var setB = new Set(b);
  var inter = 0;
  setA.forEach(function (t) {
    if (setB.has(t)) inter++;
  });
  var minSize = Math.min(setA.size, setB.size);
  return { intersectionSize: inter, overlap: minSize > 0 ? inter / minSize : 0 };
}

/** Check C: fuzzy title-concept overlap across ALL page types. */
function runCheckC(pages) {
  var findings = [];
  var seenPairs = new Set();
  for (var i = 0; i < pages.length; i++) {
    for (var j = i + 1; j < pages.length; j++) {
      var p1 = pages[i];
      var p2 = pages[j];
      if (p1.canonical === p2.canonical) continue;
      var pairKey = [p1.canonical, p2.canonical].sort().join(' :: ');
      if (seenPairs.has(pairKey)) continue;
      var result = overlapCoefficient(p1.tokens, p2.tokens);
      var minSize = Math.min(p1.tokens.length, p2.tokens.length);
      // Two rules: (a) for titles with enough significant tokens, require a
      // solid intersection (>=3) AND high overlap (>=60%) — avoids flagging
      // pages that merely share 2 generic words; (b) for very short titles
      // (<=2 significant tokens after stopwords), require full containment
      // — otherwise a genuinely short duplicate title (e.g. two pages both
      // titled just "ROI IRR") would never reach an intersection of 3.
      var isDuplicate =
        (result.intersectionSize >= 3 && result.overlap >= 0.6) ||
        (minSize > 0 && minSize <= 2 && result.intersectionSize === minSize);
      if (isDuplicate) {
        seenPairs.add(pairKey);
        findings.push({
          check: 'C',
          message:
            'Duplicate canonical concept (title overlap ' +
            Math.round(result.overlap * 100) +
            '%): "' +
            p1.title +
            '" (' +
            p1.canonical +
            ') vs. "' +
            p2.title +
            '" (' +
            p2.canonical +
            ').'
        });
      }
    }
  }
  return findings;
}

/** Check E: exact-duplicate titles among CALCULATOR-type pages specifically. */
function runCheckE(pages) {
  var findings = [];
  var byNormalized = new Map();
  pages
    .filter(function (p) {
      return p.type === PAGE_TYPES.CALCULATOR;
    })
    .forEach(function (p) {
      var key = normalizeTitleExact(p.title);
      if (!key) return;
      if (!byNormalized.has(key)) byNormalized.set(key, []);
      byNormalized.get(key).push(p);
    });
  byNormalized.forEach(function (group) {
    var distinctUrls = new Set(group.map((g) => g.canonical));
    if (distinctUrls.size >= 2) {
      findings.push({
        check: 'E',
        message:
          'Duplicate title within calculator concept family: ' +
          group.map(function (g) {
            return '"' + g.title + '" (' + g.canonical + ')';
          }).join(' == ')
      });
    }
  });
  return findings;
}

// ---------------------------------------------------------------------------
// Check D — duplicate calculator formulas (delegates to calculator-quality.mjs)
// ---------------------------------------------------------------------------
function runCheckD() {
  var findings = [];
  if (!fs.existsSync(DATA_PATH)) return findings;
  var calculators = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  var result = validateConfigs(calculators);
  result.warnings
    .filter(function (w) {
      return w.indexOf('formulas identical to') !== -1;
    })
    .forEach(function (w) {
      findings.push({ check: 'D', message: 'Duplicate calculator formula (data/calculators.json): ' + w });
    });
  result.errors.forEach(function (e) {
    findings.push({ check: 'D', message: 'data/calculators.json error: ' + e, severity: 'error' });
  });
  return findings;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
function main() {
  var files = [];
  walkHtml(ROOT, files);

  var findings = [];
  findings = findings.concat(runCheckA(files));
  findings = findings.concat(runCheckB(files));
  var pages = collectPageMeta(files);
  findings = findings.concat(runCheckC(pages));
  findings = findings.concat(runCheckE(pages));
  findings = findings.concat(runCheckD());
  findings = findings.concat(runCheckF(files));

  console.log('=== Generation Safety Validation (Phase 1) ===');
  console.log('Scanned ' + files.length + ' HTML file(s) + data/calculators.json.\n');

  if (findings.length === 0) {
    console.log('No violations found.');
    return;
  }

  ['A', 'B', 'C', 'D', 'E', 'F'].forEach(function (checkId) {
    var group = findings.filter(function (f) {
      return f.check === checkId;
    });
    if (!group.length) return;
    console.log('--- Check ' + checkId + ' (' + group.length + ' finding(s)) ---');
    group.forEach(function (f) {
      console.log((f.severity === 'error' ? 'ERROR ' : 'FLAG  ') + f.message);
      if (f.detail) f.detail.forEach((d) => console.log('        ' + d));
    });
    console.log('');
  });

  console.log(
    findings.length +
      ' total finding(s). This is expected pre-existing legacy-tier content flagged for future ' +
      'remediation (see reports/audits/MASTER-DIAGNOSTIC.md) — it is not a regression introduced by ' +
      'this validator, and this run is not gating any build.'
  );
  process.exitCode = 1;
}

main();
