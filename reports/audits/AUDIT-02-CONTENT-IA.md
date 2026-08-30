# AUDIT 02 — Content Redundancy + Information Architecture
**roicalculator.live — Project Director Audit**
Read-only. No files modified. All counts below are from direct repository greps (commands quoted where useful) so they can be re-run and verified.

---

## 1. Inventory

87 HTML pages, classified by function and mapped to the search/user intent each was evidently built to serve.

### A. Calculators (a working input→output tool is the page's job)
| Page | Intent served |
|---|---|
| `index.html` | Generic "ROI calculator" head-term query |
| `calculators/simple-roi-calculator.html` | "simple ROI calculator" |
| `calculators/free-roi-calculator.html` | "free ROI calculator" |
| `calculators/roi-calculator-example.html` | "ROI calculator example" / step-by-step intent |
| `calculators/marketing-roi-calculator.html` | "marketing ROI calculator" |
| `calculators/email-marketing-roi-calculator.html` | "email marketing ROI calculator" |
| `calculators/content-marketing-roi-calculator.html` | "content marketing ROI calculator" |
| `calculators/influencer-roi-calculator.html` | "influencer ROI calculator" |
| `calculators/ai-tool-roi-calculator.html` | "AI tool ROI calculator" |
| `calculators/equipment-roi-calculator.html` | "equipment ROI calculator" |
| `calculators/working-capital-roi-calculator.html` | "working capital ROI calculator" |
| `calculators/employee-training-roi-calculator.html` | "employee training ROI calculator" |
| `calculators/logistics-efficiency-roi-calculator.html` | "logistics efficiency ROI" |
| `calculators/warehouse-automation-roi-calculator.html` | "warehouse automation ROI" |
| `saas/roi-calculator.html` | "SaaS ROI calculator" (buyer/time-savings model) |
| `real-estate/roi-calculator.html` | "rental property ROI calculator" |
| `real-estate/cap-rate-calculator.html` | "cap rate calculator" |
| `real-estate/cash-on-cash-calculator.html` | "cash-on-cash return calculator" |
| `real-estate/flip-roi-calculator.html` | "fix and flip ROI calculator" |
| `solar/roi-calculator.html` | "solar ROI calculator" |
| `hvac/roi-calculator.html` | "HVAC ROI calculator" |
| `hr/roi-calculator.html` | "employee retention ROI calculator" |
| `roi-calculator/marketing/roas-calculator.html` | "ROAS calculator" |
| `roi-calculator/marketing/email-marketing-roi.html` | "email marketing ROI calculator" **(dupes `calculators/email-marketing-roi-calculator.html` intent)** |
| `roi-calculator/marketing/lead-generation-roi.html` | "lead generation ROI calculator" |
| `roi-calculator/real-estate/rental-property-roi.html` | "rental property ROI calculator" **(dupes `real-estate/roi-calculator.html` intent)** |
| `roi-calculator/real-estate/cash-on-cash-return.html` | "cash-on-cash return calculator" **(dupes `real-estate/cash-on-cash-calculator.html` intent)** |
| `roi-calculator/real-estate/fix-and-flip-roi.html` | "fix and flip ROI calculator" **(dupes `real-estate/flip-roi-calculator.html` intent)** |
| `roi-calculator/saas/cac-ltv-roi.html` | "CAC LTV ROI calculator" |
| `roi-calculator/saas/subscription-growth-roi.html` | "subscription growth ROI" |
| `roi-calculator/saas/time-to-value-roi.html` | "time to value ROI" |
| `roi-calculator/solar/solar-panel-roi.html` | "solar panel ROI calculator" **(overlaps `solar/roi-calculator.html` intent)** |
| `roi-calculator/solar/heat-pump-roi.html` | "heat pump ROI calculator" |
| `roi-calculator/solar/ev-charger-roi.html` | "EV charger ROI calculator" |

### B. Hubs (guide + links to calculators; no calculator of its own, or a thin list)
`saas/index.html`, `real-estate/index.html`, `marketing/index.html`, `solar/index.html`, `finance/index.html`, `operations/index.html`, `roi-calculator/marketing/index.html`, `roi-calculator/real-estate/index.html`, `roi-calculator/saas/index.html`, `roi-calculator/solar/index.html`, `benchmarks/index.html`, `comparisons/index.html`, `glossary/index.html`

### C. Guides (`/learn/`)
`learn/what-is-roi.html`, `learn/roi-formula.html`, `learn/how-to-calculate-roi.html`, `learn/roi-limitations.html`, `learn/roi-vs-irr.html`

### D. Benchmarks (detail pages)
`benchmarks/average-roi-by-industry.html`, `marketing-roi-benchmarks.html`, `real-estate-roi-benchmarks.html`, `saas-roi-benchmarks.html`, `solar-roi-benchmarks.html`, `small-business-roi-benchmarks.html`

### E. Comparisons (detail pages)
`comparisons/best-roi-calculator.html`, `roi-vs-irr.html`, `roi-vs-npv.html`, `roi-vs-payback-period.html`, `roas-vs-roi.html`, `cap-rate-vs-roi.html`, `cash-on-cash-vs-roi.html`, plus `calculators/roi-vs-other-metrics.html` (a thin aggregator pointing into the same set)

### F. Glossary (definitions)
`glossary/index.html` + 9 terms: `annualized-return`, `cac`, `cap-rate`, `churn-rate`, `ebitda`, `gross-margin`, `ltv`, `net-profit`, `payback-period`

### G. Methodology / meta
`methodology/index.html`, `site-structure.html`, `sitemap.html`/`sitemap.xml`

### H. Static / legal
`about.html`, `contact.html`, `privacy.html`, `terms.html`, `404.html`

### I. Homepage sections (intent per section, `index.html`)
Hero (head-term intent) → AEO anchor sentence → calculator (transactional intent) → 2× AEO static-answer blocks (informational) → hero-quick-answer (informational) → 3× AI-answer Q&A blocks (informational, AEO snippet-bait) → home-aeo 4-block stack (informational, AEO) → full article: takeaways/formula/example/annualized/misleading/vs-IRR/benchmarks-table/mistakes/FAQ (informational, long-form SEO) → 4 link-list modules (navigational).

---

## 2. Content Responsibility — Canonical Concept Ownership

| Concept | Pages that explain it | Status |
|---|---|---|
| **What is ROI?** | `learn/what-is-roi.html` (dedicated), `index.html` (full restatement), `comparisons/index.html`, `benchmarks/index.html`, all 16 `roi-calculator/*/*` pages, `methodology/index.html`, `site-structure.html`, `404.html`, `privacy.html`, `terms.html`, `sitemap.html` (all via the `entity-definition` stub) | **Excessive duplicate explanations.** One dedicated page exists (`learn/what-is-roi.html`), but a one-sentence definition of ROI is injected into 42 files including the 404 page, privacy policy, and terms of use (see §3.1). |
| **ROI formula** | `learn/roi-formula.html` (dedicated, most complete), `index.html` (full restatement with its own example), `learn/what-is-roi.html`, `learn/how-to-calculate-roi.html`, `comparisons/roi-vs-irr.html`, `comparisons/roi-vs-npv.html`, `methodology/index.html`, `glossary/annualized-return.html`, `glossary/net-profit.html` | **Several appropriate contextual restatements (formula recap is reasonable in a comparison article) + one excessive full duplicate** — the homepage's "The ROI Formula" + worked example (`index.html:309-323`) duplicates `learn/roi-formula.html` almost entirely rather than summarizing and linking. |
| **How to calculate ROI** | `learn/how-to-calculate-roi.html` (dedicated, step-by-step), `index.html` ("How to Calculate ROI" 5-step list, near-identical structure) | **Duplicate canonical claim.** Two pages independently claim the "how to calculate ROI, step by step" job. |
| **Annualized ROI** | `glossary/annualized-return.html` (dedicated glossary definition), `learn/roi-formula.html` ("Annualized ROI Formula"), `learn/how-to-calculate-roi.html` ("Calculating Annualized ROI"), `index.html` (full explanation + worked example), `benchmarks/index.html` (passing reference) | **Fragmented across 4 pages with no single one deferred to** — no page says "see X for the full treatment"; each restates the formula independently. |
| **IRR** | `learn/roi-vs-irr.html` **and** `comparisons/roi-vs-irr.html` — two full, independently-canonicalized articles with the same title ("ROI vs IRR") and ~70% overlapping section structure (What Is ROI, IRR definition/formula, when to use which, examples, FAQ); `calculators/roi-vs-other-metrics.html` also restates the core "what's the difference" FAQ answer | **Conflicting duplication.** No canonical relationship between the two full articles — neither `rel=canonical` nor any "this is the primary version" signal; each links to the other as if it were supplementary. |
| **NPV** | `comparisons/roi-vs-npv.html` (dedicated, sole full treatment) | **Clean single canonical home.** No issue found. |
| **Payback period** | `glossary/payback-period.html` (definition/formula), `comparisons/roi-vs-payback-period.html` (comparison + decision guide), `calculators/roi-vs-other-metrics.html` (pointer) | **Appropriate contextual split** — glossary gives the term, comparisons gives the decision framework. This is the pattern the rest of the site should follow. |
| **ROI benchmarks (general)** | `benchmarks/index.html` (hub + its own summary table), `benchmarks/average-roi-by-industry.html` (detailed cross-industry table), `index.html` (its own 4-row benchmark table) | **Mostly appropriate** (hub summary vs. detail page is reasonable), but the homepage's independent 4-row table (`index.html:337-367`) is a third, smaller version of the same comparison with different numbers framing, unnecessary given the dedicated page exists. |
| **SaaS ROI** | `saas/index.html` (guide) + `saas/roi-calculator.html` (calculator) + `roi-calculator/saas/index.html` (second guide, CAC/LTV framing) + its 3 sub-calculators | **Excessive / conflicting.** Two independently-canonicalized "hub" guides for the same vertical (see Audit 01 §1, restated here as a content-ownership problem: neither page defers to the other as canonical). |
| **Real estate ROI** | `real-estate/index.html` (guide) + 4 calculators + `roi-calculator/real-estate/index.html` (second guide) + 3 near-duplicate sub-calculators | **Excessive / conflicting** — see §3.4, the most severe case on the site: three calculator pairs share near-identical titles. |
| **Solar ROI** | `solar/index.html` + `solar/roi-calculator.html` + `roi-calculator/solar/index.html` + 3 sub-calculators | **Excessive / conflicting**, same pattern, one degree less severe (titles differ more: "Solar ROI Calculator" vs "Solar Panel ROI Calculator"). |
| **Marketing ROI** | `marketing/index.html` (thin factory list) + `roi-calculator/marketing/index.html` (full guide) + `calculators/marketing-roi-calculator.html` (calculator) + 3 sub-calculators, one of which (`email-marketing-roi`) exists in **both** `/calculators/` and `/roi-calculator/marketing/` | **Excessive / conflicting**, same pattern as SaaS/Real Estate. |

---

## 3. Duplication Analysis (quantified)

Counts below are exact `grep -rl` hits across the repository (87 HTML files) at the time of this audit.

### 3.1 The "entity-definition" stub — 42 files
Exact sentence: *"Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost."*
Present verbatim in **42 of 87 pages**, including `404.html`, `privacy.html`, `terms.html`, and `sitemap.html` — none of which are about calculating ROI. Confirmed by direct inspection (each wraps it in an identical `<section class="entity-definition"><h2>What Is ROI (Return on Investment)?</h2>...` block).
**Classification: B (template duplication) shading into E (conflicting/inappropriate duplication)** on the legal/meta pages specifically — a definitional SEO block has no business on a 404 page or a Terms of Use page; its presence there is not reuse, it's evidence the injection script had no page-type exclusion list.

### 3.2 The "use-case-block" — 31 files
Exact bullets: *"Evaluating investment profitability / Comparing multiple opportunities / Estimating return over time"* under heading "When to Use This Calculation."
Present verbatim in 31 pages spanning `learn/*`, `comparisons/*`, `benchmarks/*`, all 16 `roi-calculator/*/*` pages, and `index.html` — describing topics as different as "SaaS CAC/LTV," "industry benchmarks," and "ROI vs payback period" with the exact same three generic bullets.
**Classification: C (unnecessary repetition).** The heading correctly varies contextual relevance is expected, but the content genuinely never varies — it is not "contextual reuse," it is unfilled boilerplate.

### 3.3 The "limitations-block" — 30 files (heading count: 52)
Exact bullets: *"Does not account for time value of money / Depends on assumptions / May not reflect risk"* — present in 30 files verbatim; the heading "Limitations of This Metric" appears in **52** files total (some pages, e.g. `glossary/payback-period.html`, `site-structure.html`, reword the bullets but keep the identical heading and structural role).
**Classification: B/C.** Structural template (B) where the heading recurs everywhere; the specific bullet text is unnecessary repetition (C) wherever it wasn't customized for the page's actual subject.

### 3.4 Near-duplicate calculator pairs (title-level collision) — highest severity
Directly confirmed pairs, each with independent `<title>`, independent `canonical`, and independently-built input forms (not redirects, not shared markup):

| Pair A | Pair B | Inputs A / B | Verdict |
|---|---|---|---|
| `real-estate/roi-calculator.html` — "Rental Property ROI Calculator \| Cash Flow & Return" | `roi-calculator/real-estate/rental-property-roi.html` — "Rental Property ROI Calculator \| Real Estate" | 9 inputs / 6 inputs | **E — conflicting duplication.** Same product name, two different calculation models, two canonical URLs. |
| `real-estate/cash-on-cash-calculator.html` — "Cash-on-Cash Return Calculator \| Real Estate ROI" | `roi-calculator/real-estate/cash-on-cash-return.html` — "Cash-on-Cash Return Calculator \| Real Estate" | 2 / 2 | **E — conflicting duplication.** Near-identical title, separate pages. |
| `real-estate/flip-roi-calculator.html` — "Fix & Flip ROI Calculator \| Real Estate ROI" | `roi-calculator/real-estate/fix-and-flip-roi.html` — "Fix-and-Flip ROI Calculator \| Real Estate" | 4 / 5 | **E — conflicting duplication.** |
| `calculators/email-marketing-roi-calculator.html` — "Email Marketing ROI Calculator" | `roi-calculator/marketing/email-marketing-roi.html` — "Email Marketing ROI Calculator" | 3 / 6 | **E — conflicting duplication** (identical title, string match). |

The entire `/roi-calculator/real-estate/` subtree is, page-for-page, a title-level shadow of `/real-estate/`'s calculator set (3 of 3 sub-calculators collide). This is the single clearest, most mechanically verifiable content-ownership failure in the repository — it is not a matter of interpretation; two independently-canonicalized pages are actively competing for the same exact-match query with different underlying math.

### 3.5 "ROI vs IRR" — 3 URLs targeting one query
`learn/roi-vs-irr.html` (full article, 203 lines) and `comparisons/roi-vs-irr.html` (full article, 281 lines) are both self-canonicalized, cross-link to each other as if the other were a supplementary resource, and cover ~70% the same ground (ROI recap, IRR definition/formula, when-to-use-which, worked example, FAQ). `calculators/roi-vs-other-metrics.html` additionally restates the core FAQ answer a third time while linking out to both.
**Classification: E — conflicting duplication.** This is the same failure pattern as §3.4 applied to an educational article rather than a calculator.

### 3.6 FAQ repetition on a single page
On `index.html` alone, "What is ROI? / How do you calculate ROI? / What is a good ROI?" is answered **four times** in four different wrappers: JSON-LD `FAQPage` schema (lines 38-79), an `ai-answer-dominance` visible Q&A block (234-256), the in-article `<h3>` FAQ list (379-401), and paraphrased again in the hero/quick-answer copy (140-147, 232).
**Classification: D (SEO/AEO-driven duplication)** — the underlying intent (schema + visible answer for snippet capture) is legitimate, but the execution renders it 4× where 2× (one schema instance, one visible instance) would achieve the same goal.

### 3.7 Related-link module proliferation
Per page, up to **six** distinct "more links" modules coexist with heavy destination overlap: `related-topics`, `related-calculators`, `explore-industry` (as many as 3 variants on one page — "Trending Tools," "Explore by Industry," "Industry Benchmarks"), plus footer `footer-links` and `footer-popular`. On `index.html`, 5 of 6 links in the body's "Trending ROI Tools" list (line 406-412) are repeated verbatim in the footer's "Popular Tools" list (line 491-496).
**Classification: C (unnecessary repetition) / B (template duplication)** — one link-recommendation feature implemented six separate times per page rather than once.

### 3.8 Summary count table

| Duplication type | Instance count found | Classification |
|---|---|---|
| `entity-definition` ROI stub | 42 pages | B → E on legal/meta pages |
| `use-case-block` generic bullets | 31 pages | C |
| `limitations-block` heading | 52 pages (30 with identical bullet text) | B/C |
| `ai-citation` boilerplate sentence | 51 pages | B |
| Near-duplicate title calculator pairs | 4 confirmed pairs (3 in real estate alone) | E |
| Full-article topic collision (ROI vs IRR) | 2 full articles + 1 pointer page | E |
| On-page FAQ answer repeated in multiple formats | 4× on homepage for the core FAQ triad | D |
| Related-link module types per page | up to 6 | C/B |

---

## 4. Information Architecture

**Intended hierarchy (per the audit brief):**
```
ROI Core
├── Calculator
├── Methodology
├── Formula
├── Examples
├── Annualized ROI
├── Comparisons
├── Benchmarks
└── Industry calculators
```

**Actual hierarchy, reconstructed from links and canonicals:**
```
ROI Core (ambiguous — split across index.html AND learn/* with no cross-deferral)
├── Calculator → index.html (also duplicated in intent by 4 calculators/* pages)
├── Methodology → methodology/index.html (thin, noindex) + duplicated inline on index.html + learn/roi-formula.html
├── Formula → learn/roi-formula.html (dedicated) + fully restated on index.html
├── Examples → learn/how-to-calculate-roi.html + fully restated on index.html + learn/roi-formula.html
├── Annualized ROI → fragmented across glossary/annualized-return.html, learn/roi-formula.html,
│                     learn/how-to-calculate-roi.html, index.html (4 independent explanations, no single owner)
├── Comparisons → TWO competing trees:
│     comparisons/ (7 pages, canonical-looking)  ⟷  learn/roi-vs-irr.html (orphaned duplicate of comparisons/roi-vs-irr.html)
│                                                 ⟷  calculators/roi-vs-other-metrics.html (third pointer page)
├── Benchmarks → benchmarks/ (6 pages, canonical-looking) — this branch is the cleanest in the site
└── Industry calculators → FOUR parallel vertical trees per industry instead of one:
      SaaS:        /saas/  +  /saas/roi-calculator.html  +  /roi-calculator/saas/ (+3 sub-calcs)
      Real Estate: /real-estate/ (+4 calcs)  +  /roi-calculator/real-estate/ (+3 near-duplicate calcs)
      Solar:       /solar/  +  /solar/roi-calculator.html  +  /roi-calculator/solar/ (+3 sub-calcs)
      Marketing:   /marketing/ (thin)  +  /roi-calculator/marketing/ (+3 sub-calcs, 1 duplicated in /calculators/)
      ...plus a FIFTH, flat, non-vertical bucket: /calculators/ (11 pages spanning marketing/finance/operations
         categories per data/calculators.json, overlapping the four vertical trees above) and /finance/,
         /operations/ thin category hubs pointing back into /calculators/.
```

**Core structural defect:** the tree has two eras of content grafted together without a merge step — an older hand-authored/scripted tree (`learn/`, `comparisons/`, `benchmarks/`, `roi-calculator/*/*`, `methodology/`, `site-structure.html`) carrying the heavy AEO boilerplate stack (§3), and a newer factory-generated tree (`calculators/*`, `finance/`, `operations/`, `marketing/index.html`, the vertical hub pages `saas/`, `real-estate/`, `solar/`) built off `templates/calculator-template.html` / `templates/article-template.html` and `data/calculators.json`, which is leaner but was never reconciled against the older tree's overlapping URLs. Both trees are live, both are linked from navigation/footers, and neither has been told to defer to the other via canonical/redirect.

---

## 5. Page Purpose Audit

Pages where the honest answer to "what job does this do that another page doesn't" is **unclear**, flagged below with the most likely actual purpose:

| Page | Stated purpose | Actual distinct job | Flag |
|---|---|---|---|
| `learn/roi-vs-irr.html` | Explain ROI vs IRR | None beyond `comparisons/roi-vs-irr.html`, which covers the same ground more thoroughly (has FAQ schema, comparison table, examples) | **Ranking for a keyword variant** — no unique job |
| `roi-calculator/real-estate/index.html` + its 3 sub-calculators | Real estate ROI hub | None beyond `/real-estate/` + its 4 calculators, which are newer and better cross-linked | **Repeating existing calculators/explanations, filling a template** |
| `roi-calculator/saas/index.html` | SaaS ROI hub (CAC/LTV framing) | Genuinely has a unique angle (vendor/unit-economics vs. buyer/time-savings) — **but this differentiation is never stated to the user**, so it reads as a duplicate rather than a deliberate second lens | **Ambiguous** — could be legitimate if clearly labeled as "vendor economics" vs. buyer ROI |
| `roi-calculator/marketing/email-marketing-roi.html` | Email marketing ROI calculator | None beyond `calculators/email-marketing-roi-calculator.html`, which is the newer, factory-consistent version | **Ranking for a keyword variant** |
| `site-structure.html` | Internal crawl map | Legitimate distinct job (human-readable sitemap) — **but should not carry the ROI entity-definition/use-case/limitations boilerplate** (§3.1), which serves no reader of this page | **Filling a content template inappropriately** |
| `methodology/index.html` | Explain calculation methodology | Legitimate distinct job — undermined by opening with the same generic boilerplate seen everywhere else rather than site-specific methodology detail up front | **Template filler diluting a page that should be highest-trust content** |
| `calculators/roi-calculator-example.html` | "ROI calculator with example, step-by-step" | None beyond `learn/how-to-calculate-roi.html` (step-by-step guide) and the homepage's own step-by-step example — same formula as `calculators/simple-roi-calculator.html` | **Ranking for a keyword variant, filling a template** |
| `marketing/index.html` | Marketing ROI hub | Extremely thin (h1 + one link list) — does not attempt to be a guide the way `roi-calculator/marketing/index.html` is; unclear why a user would land here rather than the richer page | **Adding internal links / filling a template** |
| `comparisons/best-roi-calculator.html` | "Which ROI method should you use" | Legitimate distinct decision-tree angle, but heavily overlaps `comparisons/index.html`'s own "When to Use Which Method" section and `real-estate/index.html`'s "when to use each metric" — three pages independently answer "which metric should I use" | **Partially distinct, partially repeating existing explanations** |
| `404.html`, `privacy.html`, `terms.html`, `sitemap.html` | Legal/utility/navigation | Fully legitimate distinct jobs — **flagged only for the inappropriate ROI-definition boilerplate injected into them** (§3.1), not for their core purpose | **Filling a content template where none was needed** |

---

## 6. Content Consolidation Recommendations

Structural decisions only — no rewriting performed or proposed in detail.

### KEEP as-is (clear, non-duplicated job)
- `index.html` (as the primary calculator + pillar page, once its internal duplication in §3.6 is trimmed — a content edit, not a removal)
- `comparisons/index.html` + its 7 detail pages (cleanest branch on the site; keep as the canonical comparisons tree)
- `benchmarks/index.html` + its 6 detail pages (second-cleanest branch)
- `glossary/index.html` + 9 term pages
- All 4 `real-estate/*.html` calculators (treat as the canonical real-estate calculator set)
- `saas/roi-calculator.html`, `solar/roi-calculator.html`, `hvac/roi-calculator.html`, `hr/roi-calculator.html`
- `about.html`, `contact.html`, `privacy.html`, `terms.html`, `404.html` (structurally — see SHORTEN for their boilerplate)

### MERGE
- `roi-calculator/real-estate/index.html` + its 3 sub-calculators → into `/real-estate/` (the sub-calculators duplicate existing calculators 1:1 per §3.4; if any input field or explanation from the "legacy" versions is more complete, fold that detail into the surviving page, then redirect)
- `roi-calculator/saas/index.html` → merge its CAC/LTV/unit-economics content into `/saas/` as a clearly labeled second section ("Vendor economics" vs. "Buyer ROI"), keep its 3 sub-calculators as child tools of the single merged hub
- `roi-calculator/solar/index.html` → same pattern into `/solar/`
- `roi-calculator/marketing/index.html` + `marketing/index.html` → merge into one marketing hub (the richer guide content plus the factory hub's calculator list)
- `roi-calculator/marketing/email-marketing-roi.html` → merge into / redirect to `calculators/email-marketing-roi-calculator.html`
- `learn/roi-vs-irr.html` → merge into `comparisons/roi-vs-irr.html` (comparisons version is more complete: has FAQ schema, comparison table); redirect the learn URL
- `calculators/roi-vs-other-metrics.html` → fold into `comparisons/index.html` as a link, or keep as a thin aggregator only if its FAQ content is removed (it currently restates content rather than only pointing to it)

### SHORTEN
- All 42 pages carrying the `entity-definition` ROI stub (§3.1) — cut it entirely from `404.html`, `privacy.html`, `terms.html`, `sitemap.html`, `site-structure.html`, `methodology/index.html`; on the remaining pages (`learn/*`, `comparisons/*`, `benchmarks/*`, surviving `roi-calculator/*` hubs) reduce to a single line or remove in favor of a link to `learn/what-is-roi.html`
- All 31 pages carrying the generic `use-case-block` (§3.2) — either write page-specific bullets or remove the section
- All 30+ pages carrying the generic `limitations-block` bullets (§3.3) — same treatment
- `index.html`'s in-article ROI formula + annualized ROI + how-to-calculate sections (lines 288-334) — shorten to a summary paragraph with links to `learn/roi-formula.html` and `learn/how-to-calculate-roi.html`, which already own this content in full
- The 6-module related-links stack per page (§3.7) — shorten to one consolidated "Related" module + the footer

### MOVE
- Sub-calculators worth keeping from the `roi-calculator/*/*` "legacy" trees (any with a genuinely different input model worth preserving, e.g. if `rental-property-roi.html`'s 6-input simplified model serves a "quick" use case the 9-input `real-estate/roi-calculator.html` doesn't) → move as a clearly-labeled "quick version" link from the canonical page, not a separate SEO-targeted page
- `finance/index.html` and `operations/index.html` category listings → consider moving under a single `/calculators/` index rather than three separate thin category hubs, if a unified calculator directory is wanted

### REMOVE
- Three of the four functionally-identical basic calculators (`calculators/simple-roi-calculator.html`, `calculators/free-roi-calculator.html`, `calculators/roi-calculator-example.html`) once one is chosen as canonical (redirect the other two/three to it) — carried over from Audit 01, restated here as a content-ownership issue: none of the three has a distinct job (§5)
- Duplicate homepage FAQ renderings (§3.6) — remove 2 of the 4 renderings, keep one schema instance + one visible instance

### REWRITE LATER (flagged, not actioned here)
- `methodology/index.html` — should become genuinely distinct, detailed, site-specific methodology content once the generic boilerplate is stripped (per audit brief, no rewriting performed in this pass)
- `roi-calculator/saas/index.html`'s surviving CAC/LTV section (if merged rather than removed) — needs framing copy explaining it's a distinct "vendor economics" lens, not a restatement of `/saas/`

---

## 7. Final Output

### A. Content Inventory
See §1 (full 87-page classification by function and target intent).

### B. Redundancy Matrix
See §3.8 summary table — 8 duplication types, ranging from 4 confirmed near-duplicate calculator pairs to a 52-page shared heading.

### C. Canonical Concept Ownership Map
See §2. Clean single-owner concepts: **NPV** (`comparisons/roi-vs-npv.html`), **Payback period** (glossary + comparison split is a model to replicate). Fragmented concepts needing a designated owner: **What is ROI**, **ROI formula**, **How to calculate ROI**, **Annualized ROI**. Conflicting-duplicate concepts needing consolidation: **IRR** (2 full articles), **SaaS/Real-Estate/Solar/Marketing ROI** (2-3 hubs each).

### D. Recommended Information Architecture
```
ROI Core (single home: index.html for calculator + pillar summary)
├── Calculator .......... index.html (canonical; simple/free/example variants redirect here)
├── Methodology ......... methodology/index.html (stripped of generic boilerplate, site-specific only)
├── Formula ............. learn/roi-formula.html (canonical; index.html links, doesn't restate)
├── Examples ............ learn/how-to-calculate-roi.html (canonical)
├── Annualized ROI ...... glossary/annualized-return.html (canonical definition) — learn/roi-formula.html
│                          links to it instead of restating the formula independently
├── Comparisons ......... comparisons/ (canonical tree; learn/roi-vs-irr.html merged in)
├── Benchmarks .......... benchmarks/ (already canonical; no change needed)
└── Industry calculators . ONE hub per vertical, each containing its own calculator + sub-calculators:
      /saas/  (merged)   /real-estate/ (merged)   /solar/ (merged)   /marketing/ (merged)
      /calculators/ retained only for verticals with no dedicated hub (equipment, working-capital,
      logistics, warehouse-automation, employee-training, AI-tool, influencer, content-marketing)
```

### E. Pages That Should Be Merged
`roi-calculator/real-estate/index.html` (+3 sub-calcs) → `/real-estate/`
`roi-calculator/saas/index.html` → `/saas/`
`roi-calculator/solar/index.html` → `/solar/`
`roi-calculator/marketing/index.html` + `marketing/index.html` → one marketing hub
`roi-calculator/marketing/email-marketing-roi.html` → `calculators/email-marketing-roi-calculator.html`
`learn/roi-vs-irr.html` → `comparisons/roi-vs-irr.html`
`calculators/roi-vs-other-metrics.html` → `comparisons/index.html` (as a link, not a restated article)

### F. Pages That Should Be Reduced
All 42 pages carrying the `entity-definition` ROI stub; all 31 pages carrying the generic `use-case-block`; all 30+ pages carrying the generic `limitations-block` text; `index.html`'s duplicated formula/annualized/how-to sections; the 6-module related-links stack site-wide; the homepage's 4x-repeated core FAQ.

### G. Pages That Should Remain Independent
`comparisons/*` (7 pages) — genuinely distinct comparisons, no overlap among themselves.
`benchmarks/*` (6 pages) — genuinely distinct industries, cleanest branch on the site.
`glossary/*` (9 terms) — genuinely distinct definitions.
The 4 `real-estate/*.html` calculators, `saas/roi-calculator.html`, `solar/roi-calculator.html`, `hvac/roi-calculator.html`, `hr/roi-calculator.html` — each serves a distinct calculation.
`about.html`, `contact.html`, `privacy.html`, `terms.html`, `404.html` — distinct legal/utility jobs (once boilerplate is stripped, per §6 SHORTEN).

### H. Highest-Risk Content Problems
1. **Three near-identical real-estate calculator pairs with independent canonicals** (§3.4) — the single most concrete, mechanically-provable duplication on the site; highest SEO cannibalization risk because Google must arbitrarily choose between two same-topic, differently-answered pages.
2. **A definitional ROI paragraph injected into the 404 page, Privacy Policy, and Terms of Use** (§3.1) — the strongest available evidence that content was applied by an indiscriminate script rather than an editorial process; highest credibility/trust risk if noticed by a user, reviewer, or AI evaluator.
3. **Two full "ROI vs IRR" articles with no canonical relationship** (§3.5) — same cannibalization risk as #1, applied to educational content.
4. **Four independent vertical-hub trees (SaaS, real estate, solar, marketing) each split across 2-3 competing URLs** — the structural root cause underlying #1 and much of the rest of this audit; every other finding in this report is a symptom of this and Audit 01's central finding: two content-generation eras were never reconciled into one architecture.

---

*End of Audit 02. No files were modified in the preparation of this report.*
