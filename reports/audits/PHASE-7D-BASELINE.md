# Phase 7D — Factory Calculator Forensic Baseline

**Date:** 2026-08-30  
**Scope:** Read-only inspection before Phase 7D implementation  
**Configs:** 14 entries in `data/calculators.json` (13 interactive calculators + 1 article page)

---

## 1. Source-of-truth chain

| Layer | File | Role |
|-------|------|------|
| Data | `data/calculators.json` | Inputs, formulas, outputs, `aeoEntry`, `staticBlocks`, `faq` |
| Template (calc) | `templates/calculator-template.html` | DOM skeleton for 13 calculators |
| Template (article) | `templates/article-template.html` | DOM for `roi-vs-other-metrics` (`isArticlePage: true`) |
| Generator | `scripts/generate-calculators.mjs` | `generateCalculatorPage()`, `buildOutputs()`, `buildStaticBlocks()` |
| Runtime | `assets/js/calculator-engine.js` | Formula eval, `bind()`, formatting |
| Binder | `assets/js/calculator-factory-page.js` | Wires `#factory-page-config` → engine |
| Output | `calculators/*.html` | 14 generated pages (do not hand-edit) |

**Hub pages** (`marketing/`, `finance/`, `operations/`) use `generateHubPage()` — separate from calculator template. Changing `calculator-template.html` does **not** affect hubs.

---

## 2. BEFORE DOM order (`calculator-template.html`)

```
__HEADER__                          [shared site-chrome]
<main>
  <nav class="breadcrumb">          [visible — deep nav OK]
  <article class="content-section">
    <h1>__TITLE__</h1>              [page title — not in hero]
    <section class="ai-answer-block"> [PRE-CALCULATOR "Quick answer"]
    <form id="factory-calc-form">   [calculator — buried under H1 + quick answer]
    <div id="factory-results-panel"> [flat results-grid — NO dominant result]
    __STATIC_BLOCKS__               [post-calc supporting — correct position]
    <section class="semantic-links"> [generic explore links]
    <section class="faq-block">       [calculator-specific FAQ]
  </article>
  <section class="related-calculators"> [tertiary lateral links]
</main>
__FOOTER__
#factory-page-config + engine scripts
```

### BEFORE architecture diagram

```
HEADER
  ↓
BREADCRUMB
  ↓
H1 (in article.content-section)
  ↓
QUICK ANSWER (ai-answer-block)  ← pre-calculator noise
  ↓
FORM (factory-calc-form)
  ↓
RESULTS (results-grid, equal-weight cards)
  ↓
STATIC BLOCKS (methodology/supporting)
  ↓
EXPLORE FURTHER (generic semantic-links)
  ↓
FAQ
  ↓
RELATED CALCULATORS
  ↓
FOOTER
```

---

## 3. Template chrome inventory

| Element | Present in factory template? |
|---------|------------------------------|
| Breadcrumb (visible) | Yes — appropriate for deep calculator pages |
| Ad placeholders | No |
| Privacy badge | No (header from `site-chrome.mjs`) |
| calculator-strip | No |
| sticky CTA | No |
| ai-answer-block | Yes — **pre-calculator** |
| ai-answer-dominance | No |
| entity-definition | No |
| Generic use-case/limitations stubs | No (per-calculator `staticBlocks` only) |
| "What is ROI?" generic | No in template (semantic-links link only) |

---

## 4. Block classification

| Block | Type | Pre/Post calc |
|-------|------|---------------|
| `__HEADER__` | Generated chrome | — |
| Breadcrumb | Template + JSON-LD | Pre |
| `<h1>` | Data title | Pre |
| `ai-answer-block` + `__AEO_ENTRY__` | Data-driven (`aeoEntry`) | **Pre** |
| Form + inputs | Data-driven | Pre (tool) |
| Results panel | Generator `buildOutputs()` | Post-interaction |
| `staticBlocks` | Calculator-specific | Post |
| `semantic-links` | Generic template | Post |
| `faq` | Calculator-specific | Post |
| `related-calculators` | Generator lateral links | Post |
| JSON-LD (Breadcrumb, WebPage, FAQ) | Generated | Head only |

---

## 5. Result hierarchy (BEFORE)

- `buildOutputs()` renders **equal-weight** `.result-item.result-card` grid.
- **No** `.result-dominant`, **no** `.result-interpretation`.
- Phase 2 dominant-result model exists in CSS but is **unused** on factory pages.
- `calculator-engine.js` does not need changes for display — only template/generator/binder.

---

## 6. Quick answer (`aeoEntry`) — per-calculator audit

| Decision | Rationale |
|----------|-----------|
| **MOVE** | All 13 `aeoEntry` strings are calculator-specific but appear **before** the tool; they duplicate intent already in meta/hero and delay interaction |
| **REWRITE** | Drop `"Quick answer:"` label; render as `.hero-sub` under `.hero` h1 (approved 7B grammar) |

`roi-vs-other-metrics` (article template): same MOVE/REWRITE to hero-sub; no calculator.

---

## 7. Generator blast radius

| Output | Affected by `calculator-template.html` change? |
|--------|-----------------------------------------------|
| `calculators/*.html` (13 calc pages) | Yes |
| `calculators/roi-vs-other-metrics.html` | No — uses `article-template.html` |
| `marketing|finance|operations/index.html` | No — `generateHubPage()` |
| Sitemap/redirects | Only if generator re-run (unchanged structure) |

---

## 8. Target architecture (Phase 7D)

```
HEADER
  ↓
BREADCRUMB (retain — deep content)
  ↓
HERO (h1 + hero-sub from aeoEntry)
  ↓
CALCULATOR SECTION (calculator-card wrapper)
  ↓ FORM
  ↓ DOMINANT RESULT + interpretation
  ↓ supporting metrics grid
  ↓
METHODOLOGY / SUPPORTING (staticBlocks)
  ↓
FAQ
  ↓
EXPLORE FURTHER (tertiary)
  ↓
RELATED CALCULATORS (tertiary)
  ↓
FOOTER
```

---

## 9. KEEP / MOVE / REMOVE / REWRITE summary

| Block | Action |
|-------|--------|
| Breadcrumb | KEEP |
| H1 | MOVE → `.hero h1` |
| ai-answer-block (pre-calc) | REMOVE (content MOVE to hero-sub) |
| Calculator form | KEEP (reposition in calculator-section) |
| Results grid | REWRITE → dominant + secondary |
| staticBlocks | KEEP (post-calculator) |
| semantic-links | KEEP (tertiary) |
| FAQ | KEEP |
| related-calculators | KEEP |
