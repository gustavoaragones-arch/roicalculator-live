# Phase 7E — Forensic Baseline (Pre-Edit)

**Date:** 2026-08-30  
**Scope:** Quick Answer / AEO UI inventory before Phase 7E implementation

---

## 1. Visible "Quick Answer" label sources

| File | Mechanism | Selector/class | Generated? | Blast radius |
|------|-----------|----------------|------------|--------------|
| `components/ai/CalculationAnswerBlock.js` | JS injects `<strong>Quick Answer: </strong>` in `fillQuickAnswerParagraph()` | `.aeo-answer-block`, `.aeo-calculation-answer` | Hand-authored component | **Homepage only** (`index.html` → `#aeo-answer`) |
| `glossary/*.html` (9 files) | Static `<p><strong>Quick Answer:</strong>` inside `.ai-answer-block` | `.ai-answer-block` | Hand-authored | Per glossary page |
| `methodology/index.html`, `privacy.html`, `terms.html`, `404.html`, `sitemap.html`, `site-structure.html` | Same static pattern | `.ai-answer-block` | Hand-authored | Single page each |
| `roi-calculator/saas/*.html` (3 files) | Same static pattern | `.ai-answer-block` | Hand-authored | Per legacy SaaS calc page |

**Factory calculators (Phase 7D):** No visible "Quick Answer" label. `aeoEntry` renders as `.hero-sub` prose only.

---

## 2. Green SEO callout styling (calculator results)

| File | Rule | Effect |
|------|------|--------|
| `assets/css/styles.css` | `.aeo-answer-block` | Green left border, green tint background, padding — makes interpretation look like SEO widget |
| `assets/css/styles.css` | `.aeo-calculation-answer` | Wraps question + answer block |

Used only when `CalculationAnswerBlock.renderCalculationAnswer()` runs (homepage).

---

## 3. Result-area spacing defect (screenshot)

| Page | DOM order | Issue |
|------|-----------|-------|
| `index.html` | Results h3 → cards → `#aeo-answer` (question + green box) → h3 "5-Year Projection" → chart | `.aeo-calculation-answer { margin-top: 4px }`, `.aeo-answer-block { margin-top: 20px }`, projection h3 has only default `h3 { margin: 0 0 var(--space-md) }` — **collision** |
| `saas/index.html` | dominant → interpretation → cards → projection h3 → chart | No `.calc-projection-block` separator; interpretation-to-projection gap insufficient |
| `real-estate/index.html` | Same pattern as SaaS | Same |
| Factory calculators | dominant → interpretation → secondary grid | No projection; spacing between interpretation and supporting content handled in Phase 7D |

---

## 4. Cardified informational blocks

| Class | Files | Purpose |
|-------|-------|---------|
| `.ai-answer-block` | learn/*, comparisons/*, benchmarks/*, glossary, utility pages | Bordered box around Q&A or Quick Answer |
| `.definition-block` | glossary terms | Legitimate definition emphasis — **keep** |
| `.static-answer-block` | factory calculators (generated) | Post-calc supporting — **keep** |

---

## 5. AEO / structured data (unchanged this phase)

| Type | Source | Notes |
|------|--------|-------|
| FAQPage JSON-LD | Per-page `<script type="application/ld+json">` | Homepage, factory calcs, some articles |
| WebPage / Article | Head JSON-LD | Sitewide |
| schema.org microdata | `ai-answer-block[itemscope Question]` on learn/comparisons | Visible FAQ-style content — keep semantics, reduce box styling |
| Calculator dataset JSON-LD | `calculator-engine.js` inject after interaction | Unchanged |

---

## 6. Target fixes (Phase 7E)

1. Remove "Quick Answer:" from `CalculationAnswerBlock.js`; render plain interpretation with heading.
2. Add `.results-panel` vertical rhythm + `.calc-projection-block` spacing system in shared CSS.
3. Update `index.html`, `saas/index.html`, `real-estate/index.html` projection markup.
4. Remove redundant Quick Answer sections from glossary/utility/legacy SaaS pages.
5. Flatten `.ai-answer-block` on content pages (remove box, keep semantic structure).
