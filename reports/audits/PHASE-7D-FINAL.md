# Phase 7D — Factory Calculator Architecture (Final Report)

**Date:** 2026-08-30  
**Status:** PASS (local QA + validators; production pending post-push verify)

---

## 1. Baseline architecture (BEFORE)

See `reports/audits/PHASE-7D-BASELINE.md`. Summary:

- Pre-calculator `ai-answer-block` buried the tool under generic quick-answer copy
- Flat `results-grid` with no dominant result or interpretation
- H1 outside hero; no `page-factory` scoping

---

## 2. Target architecture (AFTER)

```
HEADER → BREADCRUMB → HERO (h1 + hero-sub) → CALCULATOR SECTION
  → DOMINANT RESULT + interpretation → secondary metrics
  → factory-supporting (staticBlocks, FAQ, explore) → RELATED → FOOTER
```

---

## 3. KEEP / MOVE / REMOVE / REWRITE

| Block | Action | Reason |
|-------|--------|--------|
| Breadcrumb | KEEP | Deep-page navigation; JSON-LD preserved |
| H1 | MOVE → `.hero h1` | Aligns with Phase 7B grammar |
| `ai-answer-block` (pre-calc) | REMOVE | Redundant placement; content moved to hero-sub |
| `aeoEntry` | MOVE → `.hero-sub` | Calculator-specific intent without blocking tool |
| Calculator form | KEEP | Primary interaction |
| Results | REWRITE | Dominant + interpretation + secondary grid |
| staticBlocks | KEEP | Post-calculator methodology |
| FAQ | KEEP | Calculator-specific |
| semantic-links | KEEP | Tertiary |
| related-calculators | KEEP | Tertiary |

---

## 4. Source changes

| File | Category |
|------|----------|
| `templates/calculator-template.html` | Factory architecture source |
| `templates/article-template.html` | Article factory page |
| `scripts/generate-calculators.mjs` | Dominant result + hero-sub |
| `assets/js/calculator-factory-page.js` | Interpretation afterRun |
| `assets/css/styles.css` | Scoped `body.page-factory` |
| `calculators/*.html` (14) | Regenerated output |
| `scripts/qa/phase7d-factory-check.mjs` | QA tooling |
| `scripts/qa/phase7d-production-verify.mjs` | Production QA |
| `reports/audits/PHASE-7D-BASELINE.md` | Documentation |

**Not changed:** `calculator-engine.js`, hub pages (no diff), formulas, input IDs, canonicals.

---

## 5. Generator safety

- Regeneration touched only `calculators/*.html` (14 files)
- Hub/sitemap/redirect writes were idempotent (no git diff)
- No unrelated page drift

---

## 6. Result hierarchy

- Primary output (first in `outputs[]`) → `.result-dominant` / `#factory-out-{key}`
- `#factory-result-interpretation` populated by `calculator-factory-page.js` afterRun
- Secondary outputs remain in `.results-grid`

---

## 7. Playwright QA (local, Chrome)

- **14 × 4 viewports:** ALL PASS (layout, overflow, hierarchy)
- **13 calculator interactions (default click):** ALL PASS — no NaN/Infinity/console errors
- **Mobile nav + calculators disclosure:** PASS
- **Keyboard → Calculate:** PASS
- Screenshots: `scripts/qa/screenshots/phase7d-{slug}-{viewport}.png` (56 files, gitignored)

---

## 8. Reference regression

- `phase7b02-reference-pages.mjs`: ALL PASS (/, /saas/, /real-estate/, /solar/, /marketing/, factory calc)
- `phase7c-secondary-pages.mjs`: ALL PASS
- `layout-consistency-check.mjs`: PRE-EXISTING FAIL on saas/solar/hub breadcrumb expectations (reference pages intentionally lack breadcrumbs per 7B policy; not a 7D regression)

---

## 9. Validators

| Script | Result | Classification |
|--------|--------|----------------|
| `calculator-quality.mjs` | OK (14 configs) | — |
| `validate-generation-safety.mjs` | 36 findings | PRE-EXISTING (documented legacy tier) |

---

## 10. Calculator math preservation

All formulas, input names/IDs, and `factory-page-config` contracts unchanged.

---

## 11. Production verification

Run after push: `node scripts/qa/phase7d-production-verify.mjs`

---

## 12. Commit

`Phase 7D: factory calculator architecture`
