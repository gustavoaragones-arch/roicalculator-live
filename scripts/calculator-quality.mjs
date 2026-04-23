/**
 * Phase 17.2 — Config quality rules for data/calculators.json
 * Import from generate-calculators.mjs; run standalone: node scripts/calculator-quality.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DATA_PATH = path.join(ROOT, 'data', 'calculators.json');

export const STATIC_ANGLES = ['benchmarks', 'limitations', 'comparisons', 'use_cases', 'methodology'];

function normQ(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/\?+$/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function fingerprintFormulas(f) {
  return JSON.stringify(f || {});
}

function fingerprintInputNames(calc) {
  return (calc.inputs || [])
    .map(function (i) {
      return i.name;
    })
    .join(',');
}

/**
 * @param {object[]} calculators
 * @returns {{ errors: string[], warnings: string[] }}
 */
export function validateConfigs(calculators) {
  var errors = [];
  var warnings = [];
  var slugs = new Set();
  var titles = new Set();
  var formulaFingerprints = new Map();
  var inputFingerprints = new Map();
  var allFaqNorm = [];

  if (!Array.isArray(calculators) || calculators.length === 0) {
    errors.push('calculators must be a non-empty array');
    return { errors: errors, warnings: warnings };
  }

  calculators.forEach(function (calc, idx) {
    var prefix = '[' + (calc.slug || '#' + idx) + '] ';

    if (!calc.slug || typeof calc.slug !== 'string') {
      errors.push(prefix + 'missing slug');
      return;
    }
    if (slugs.has(calc.slug)) {
      errors.push('Duplicate slug: ' + calc.slug);
    }
    slugs.add(calc.slug);

    if (/(-2|-copy|_copy|duplicate)$/i.test(calc.slug)) {
      warnings.push(prefix + 'slug looks like a duplicate variant; prefer a distinct intent (e.g. ppc-roi-calculator).');
    }

    if (!calc.title || typeof calc.title !== 'string') {
      errors.push(prefix + 'missing title');
    } else {
      var tnorm = calc.title.trim().toLowerCase();
      if (titles.has(tnorm)) {
        errors.push('Duplicate title: ' + calc.title);
      }
      titles.add(tnorm);
      if (/\b( calculator)?\s*2\s*$/i.test(calc.title) || /\b\(2\)\s*$/i.test(calc.title)) {
        warnings.push(prefix + 'title looks like a numbered clone; use a specific intent in the title.');
      }
    }

    if (calc.isArticlePage === true) {
      if (!calc.metaDescription || !String(calc.metaDescription).trim()) {
        errors.push(prefix + 'article page: metaDescription is required');
      }
    } else {
      if (!calc.formulas || typeof calc.formulas !== 'object') {
        errors.push(prefix + 'missing formulas object');
      } else {
        var fp0 = fingerprintFormulas(calc.formulas);
        if (formulaFingerprints.has(fp0)) {
          warnings.push(
            prefix +
              'formulas identical to "' +
              formulaFingerprints.get(fp0) +
              '"; Phase 17.2 requires different variables or formula structure per calculator.'
          );
        } else {
          formulaFingerprints.set(fp0, calc.slug);
        }
      }

      if (!calc.inputs || !Array.isArray(calc.inputs) || calc.inputs.length < 2) {
        warnings.push(prefix + 'inputs: prefer at least two distinct drivers (or three for funnel-style models).');
      } else {
        var ifp0 = fingerprintInputNames(calc);
        if (inputFingerprints.has(ifp0)) {
          warnings.push(
            prefix + 'input names match "' + inputFingerprints.get(ifp0) + '"; consider distinct variable names for intent.'
          );
        } else {
          inputFingerprints.set(ifp0, calc.slug);
        }
      }
    }

    if (!calc.faq || !Array.isArray(calc.faq) || calc.faq.length < 3) {
      errors.push(prefix + 'faq: need at least 3 questions');
    } else {
      calc.faq.forEach(function (item, fi) {
        if (!item.q || !String(item.q).trim()) {
          errors.push(prefix + 'faq[' + fi + ']: empty question');
          return;
        }
        var n = normQ(item.q);
        if (n === 'what is roi' || n === 'what is return on investment') {
          warnings.push(prefix + 'faq: avoid generic "What is ROI?" — use a calculator-specific question.');
        }
        if (allFaqNorm.indexOf(n) !== -1) {
          warnings.push(prefix + 'faq: question may duplicate another calculator: "' + item.q + '"');
        }
        allFaqNorm.push(n);
      });
    }

    if (!calc.staticBlocks || !Array.isArray(calc.staticBlocks) || calc.staticBlocks.length !== 2) {
      errors.push(prefix + 'staticBlocks: need exactly 2 blocks (Phase 17.2)');
    } else {
      var angles = [];
      calc.staticBlocks.forEach(function (b, bi) {
        if (!b.angle || STATIC_ANGLES.indexOf(b.angle) === -1) {
          errors.push(
            prefix + 'staticBlocks[' + bi + ']: set angle to one of: ' + STATIC_ANGLES.join(', ')
          );
        } else {
          angles.push(b.angle);
        }
        if (!b.heading || !String(b.heading).trim()) {
          errors.push(prefix + 'staticBlocks[' + bi + ']: missing heading');
        }
      });
      if (angles.length === 2 && angles[0] === angles[1]) {
        errors.push(prefix + 'staticBlocks: the two angles must differ (e.g. benchmarks vs limitations).');
      }
    }
  });

  return { errors: errors, warnings: warnings };
}

function main() {
  var raw = fs.readFileSync(DATA_PATH, 'utf8');
  var calculators = JSON.parse(raw);
  var res = validateConfigs(calculators);
  res.warnings.forEach(function (w) {
    console.warn('WARN', w);
  });
  if (res.errors.length) {
    res.errors.forEach(function (e) {
      console.error('ERR ', e);
    });
    process.exit(1);
  }
  console.log('calculator-quality: OK (' + calculators.length + ' configs)');
}

var __filename = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  main();
}
