# Phase 8 — 3D Printing Cluster-Level SEO / Content / UX Review

**Date:** 2026-08-31  
**Mode:** REVIEW ONLY — no production files modified  
**Repository HEAD:** `c4e4873578c95603e4a6ee5a7c0122f28eb70e88`  
**Working tree at review start:** clean  
**Prior cluster reviews:** `PHASE-3D-PRINTING-05-CLUSTER-REVIEW.md` (architecture), Phases 2–4 (build), Phase 6 (hub), Phase 7 (global nav)

---

## 1. Executive verdict

**FACT:** The 3D-printing cluster is a coherent, three-tool vertical with genuinely distinct economic models (single-printer ROI, fleet-capacity ROI, job-level forward pricing). Phase 6 hub + Phase 7 global navigation materially improved discoverability versus the pre-hub state documented in Phase 5.

**INFERENCE:** The cluster is **sufficiently complete to justify NO fourth calculator** at this time. Resin-specific tooling remains **DEFERRED** pending dedicated demand research.

**RECOMMENDATION (hard):** **B — FIX EXISTING CLUSTER FIRST.** Address asymmetric internal linking, contextual discoverability beyond the nav dropdown, and minor metadata/consistency gaps before any expansion.

**Gate:** Cluster is production-ready for users and indexation; improvements are incremental, not architectural.

---

## 2. Current cluster architecture

### 2.1 Baseline inventory

| Item | Value |
|------|-------|
| **HEAD** | `c4e4873578c95603e4a6ee5a7c0122f28eb70e88` |
| **Cluster files** | `3d-printing/index.html`, `3d-printing/roi-calculator.html`, `3d-printing/print-farm-roi-calculator.html`, `3d-printing/service-pricing-calculator.html` |
| **Runtime JS** | `assets/js/3d-printing-roi-calculator.js`, `assets/js/3d-printing-print-farm-roi-calculator.js`, `assets/js/3d-printing-service-pricing-calculator.js` |
| **Stylesheet** | `/assets/css/styles.css?v=7b02` (all four pages) |
| **Generator** | Not factory-generated; hand-authored cluster |
| **Sitemap** | All four URLs in `sitemap.xml` (hub + three calculators) |
| **Robots** | `robots.txt` allows all; no cluster-specific disallow |
| **Global nav** | `scripts/site-chrome.mjs` → Calculators dropdown → `3D Printing Calculators` → `/3d-printing/` (Phase 7, commit `c4e4873`) |

### 2.2 URLs

| URL | Role | Canonical (in HTML) |
|-----|------|-------------------|
| `/3d-printing/` | Hub | `https://roicalculator.live/3d-printing/` |
| `/3d-printing/roi-calculator.html` | Business ROI | `…/roi-calculator.html` |
| `/3d-printing/print-farm-roi-calculator.html` | Print Farm ROI | `…/print-farm-roi-calculator.html` |
| `/3d-printing/service-pricing-calculator.html` | Service Pricing | `…/service-pricing-calculator.html` |

**FACT (production):** Extensionless paths (`/3d-printing/roi-calculator`) return HTTP 200. `.html` paths return HTTP 308 → extensionless. Canonical tags remain `.html` (consistent with site-wide pattern).

### 2.3 Intentional phase history

| Phase | Commit | Decision |
|-------|--------|----------|
| 2 | `0dbe3f4` | Business ROI calculator |
| 3 | `5d1cb55` | Print Farm ROI calculator |
| 4 | `f61c000` | Service Pricing calculator |
| 5 review | — | Rejected Printer Payback, Profit Margin; deferred Resin |
| 6 | `b875f7c` | Hub at `/3d-printing/` |
| 7 | `c4e4873` | Global nav entry |

### 2.4 Schema per page

| Page | WebPage JSON-LD | FAQPage JSON-LD | BreadcrumbList |
|------|-----------------|-----------------|----------------|
| Hub | Yes | Yes (1 Q) | No |
| Business ROI | Yes | Yes (4 Q) | No |
| Print Farm ROI | Yes | Yes (4 Q) | No |
| Service Pricing | Yes | Yes (4 Q) | No |

No `SoftwareApplication` / `WebApplication` schema on cluster pages (OBSERVATION — not a defect; site pattern is WebPage + FAQPage where applicable).

---

## 3. Page-by-page audit (repository + live production)

Review method: full HTML/JS read of repository at HEAD; production verified via `curl` (status, title, canonical) and Playwright + system Chrome against local server (layout, interaction, overflow). Production content matches repository (no drift observed).

### 3.1 Hub — `/3d-printing/`

| Criterion | Observation |
|-----------|-------------|
| A. First impression | Clear category landing: three linked cards + comparison table |
| B. Visual hierarchy | H1 → subtitle → selection cards → table → differentiation prose → FAQ |
| C. H1 | `3D Printing Calculators` — clear |
| D. Hero/subtitle | `.hero` + `.hero-sub` inside `.hero-content`; states three use cases |
| E. Calculator prominence | N/A — hub is selector, not a tool page (appropriate) |
| F–H | No calculator inputs/results |
| I. Methodology | None (appropriate for hub) |
| J. Supporting | “How these calculators differ” paragraph — useful, non-duplicative of calculator bodies |
| K. FAQ | Single hub-level threshold question (two-printer case) |
| L. Related | Cards + table link to all three calculators |
| M. Spacing | No overflow at 320–1440px (Playwright) |
| N–O. Mobile/desktop | Nav dropdown works; cards stack via `.results-box` responsive grid |
| P. Cognitive load | Low — focused selection task |
| Q. Repetition | Comparison table partially echoes card copy (OBSERVATION — acceptable for selection aid) |
| R. Phase 7 consistency | Matches secondary hub pattern (hero, no breadcrumb, `content-section`) |
| S. Accessibility | Semantic headings; hub cards are `<a>` with inner `<h3>` |
| T. Overflow | None |
| U. Dead space | None problematic |
| V. Cardification | Hub cards reuse `.result-item.result-card` — intentional (page-scoped `.hub-card` CSS in `<style>`) |
| W. Visual noise | Low |

### 3.2 Business ROI — `/3d-printing/roi-calculator.html`

| Criterion | Observation |
|-----------|-------------|
| A. First impression | Dense but organized input form; calculator-first after compact hero |
| B. Hierarchy | Hero → calculator → methodology → decision guidance → FAQ → explore further |
| C. H1 | `3D Printing Business ROI Calculator` |
| D. Hero/subtitle | States monthly profit, payback, ROI scope |
| E. Calculator prominence | High — immediately below hero |
| F. Input grouping | Five `form-row` groups (printer, sales, material, power, fees) — logical |
| G. Result hierarchy | Dominant `24-Month ROI` + `.result-interpretation` + primary grid + “Additional context” grid |
| H. Interpretation | JS-generated plain prose in `#tdp-res-interpretation` (no Quick Answer label) |
| I. Methodology | Post-calculator `.methodology-section` with formula note |
| J. Supporting | “How to use…” + limitations list — calculator-specific |
| K. FAQ | Four model-specific questions (depreciation/payback, failure rate, margin vs markup, investment exclusion) |
| L. Related | Links hub + both siblings + site ROI/methodology |
| M. Spacing | Hero/calc column aligned (Δ0px); large vertical span inside results panel before methodology (many result cards) |
| N–O. Responsive | No overflow 320–1440; inputs stack on narrow viewports |
| P. Cognitive load | **Elevated** — 15 inputs + 8 result metrics across two grids |
| Q. Repetition | No “What is ROI?” boilerplate |
| R. Phase 7 | Matches reference vertical grammar (hero, `.calculator-section`, dominant result, methodology after tool) |
| S. Keyboard | Standard form submit; no console errors on default Calculate (Playwright) |
| T. Overflow | None |
| V. Cardification | Result cards appropriate; no green AEO boxes |

### 3.3 Print Farm ROI — `/3d-printing/print-farm-roi-calculator.html`

Same structural pattern as Business ROI with fleet-specific inputs (`printer-count`, `utilization`, `orders`) and outputs (`capacity utilization`, `theoretical capacity`, demand/capacity interpretation in JS).

**Distinctive FACT:** `buildInterpretation()` appends `constraintText` when demand vs capacity is limiting — fleet-specific AEO value.

**Gap (P1):** “Explore further” links hub + Business ROI only — **missing Service Pricing sibling link** (Business ROI links all three).

### 3.4 Service Pricing — `/3d-printing/service-pricing-calculator.html`

| Criterion | Observation |
|-----------|-------------|
| Dominant result | `Recommended price` ($) — correct inverse problem |
| Input grouping | Four labeled subsections (Print job, Machine cost, Labor & overhead, Fees & pricing) — strongest UX of cluster |
| Results | Supporting metrics + cost breakdown table — high utility |
| Methodology | Bullet list under “How the 3D Print Price Is Calculated” |
| Supporting gaps | **No** “How to use for a quoting decision” article block; **no** explicit limitations section (siblings have both) — MISSING vs peer pages |
| Related | Hub + Business ROI only — **missing Print Farm link** |
| Title | `3D Print Service Pricing Calculator | Calculate Your Print Price` — **lacks** `\| roicalculator.live` suffix used on other cluster calculators (P2 metadata consistency) |

---

## 4. Calculator differentiation matrix

| Calculator | Primary user | Primary question | Key inputs | Dominant output | Supporting outputs | Distinctive model | Overlap |
|------------|--------------|------------------|------------|-----------------|-------------------|-------------------|---------|
| **Business ROI** | Single-printer / side-business owner | Is this printer profitable; when does it pay back? | Printer cost, units/month, per-print economics, fees | 24-Month ROI (%) | Payback, monthly profit, profit/print, break-even units, 12/36mo ROI, margin, markup | Unconstrained monthly volume; single-machine investment | **Partial** with Print Farm (shared cost primitives + ROI family) |
| **Print Farm ROI** | Multi-printer operator | Can my fleet support my sales at this utilization? | Printer count, utilization %, orders/month + shared unit economics | 24-Month ROI (%) | Capacity metrics, demand/capacity interpretation, revenue, same ROI family | Fleet capacity ceiling + `MIN(capacity, orders)` | **Partial** with Business ROI; **Distinct** from Pricing |
| **Service Pricing** | Job quoter / service seller | What should I charge this job? | Job material/time, target margin %, overhead, failure allowance | Recommended price ($) | Min viable price, margin, hourly earnings, cost breakdown table | Forward-solves price from margin (inverse of ROI tools) | **Distinct** from both ROI tools |

### Pairwise summary

| Pair | Verdict | Where overlap lives |
|------|---------|---------------------|
| Business ↔ Farm | **Partial overlap** | Material/electricity/depreciation/labor/failure/fee primitives; ROI/payback output family. **Distinct:** fleet capacity + utilization + demand constraint only on Farm |
| Business ↔ Pricing | **Distinct** | ROI tools solve return over time; Pricing solves price for one job. Shared primitives only |
| Farm ↔ Pricing | **Distinct** | Fleet/time-horizon vs single-job quotation |

**INFERENCE:** A reasonable user with **one printer** should not confuse Business ROI and Pricing (different decisions). A user with **2–5 printers** may hesitate between Business and Farm — **hub FAQ addresses this** (appropriate).

---

## 5. Content KEEP / MOVE / CONDENSE / REMOVE / MISSING matrix

| Section | Hub | Business ROI | Print Farm | Pricing | Classification |
|---------|-----|--------------|------------|---------|----------------|
| Hero + subtitle | KEEP | KEEP | KEEP | KEEP | — |
| Calculator form | — | KEEP | KEEP | KEEP | — |
| Dominant result + interpretation | — | KEEP | KEEP | KEEP | — |
| Primary result grid | — | KEEP | KEEP | KEEP | — |
| “Additional context” second grid | — | CONDENSE | CONDENSE | — | P2 — high card count; consider collapsible or single grid in future phase |
| Cost breakdown table | — | — | — | KEEP | Pricing-specific strength |
| Methodology block | — | KEEP | KEEP | KEEP | — |
| “How to use…” article | — | KEEP | KEEP | **MISSING** | P2 — add in future phase |
| Limitations list | — | KEEP | KEEP | **MISSING** | P2 — add in future phase |
| FAQ | KEEP (1 Q) | KEEP | KEEP | KEEP | All calculator-specific; no generic finance FAQ |
| “Explore further” / related | — | KEEP | MOVE | MOVE | P1 — Farm/Pricing should link all siblings symmetrically |
| Hub comparison table | KEEP | — | — | — | — |
| “How calculators differ” | KEEP | — | — | — | — |
| Generic “What is ROI?” | — | Absent | Absent | Absent | — |
| Quick Answer / green AEO | Absent | Absent | Absent | Absent | Phase 7E compliant |

No REMOVE or REWRITE recommended for existing prose in this review phase.

---

## 6. SEO audit

| Page | Title (chars) | Meta description | H1 vs title | Intent clarity | Doorway risk |
|------|---------------|------------------|-------------|----------------|--------------|
| Hub | 68 | Clear selector intent | Aligned | Category / tool selection | Low — substantive hub |
| Business ROI | 52 + brand | Feature-rich, accurate | Aligned | “3d printing business roi calculator” | Low |
| Print Farm ROI | 48 + brand | Feature-rich | Aligned | “print farm roi calculator” | Low |
| Service Pricing | 58, **no brand suffix** | Clear pricing intent | Aligned | “3d print pricing calculator” | Low |

**FACT:** No near-duplicate titles within cluster.  
**FACT:** Hub title includes “ROI, Print Farm & Pricing” — accurate umbrella.  
**OBSERVATION:** No dedicated `/3d-printing/index.html` in sitemap (only `/3d-printing/`) — correct.  
**OBSERVATION:** Keyword density is natural; no stuffing detected.  
**INFERENCE:** Search intent → useful tool → supporting explanation pattern is satisfied on all calculator pages.

---

## 7. AEO audit (no artificial answer widgets)

| Signal | Hub | Business | Farm | Pricing |
|--------|-----|----------|------|---------|
| Clear page purpose (H1 + hero) | Yes | Yes | Yes | Yes |
| What it calculates | Yes (cards) | Yes | Yes | Yes |
| Who it is for | Yes (table) | Yes | Yes | Yes |
| Inputs explained | N/A | Labels + FAQ | Labels + FAQ | Labels + subsection headings + FAQ |
| Main result meaning | N/A | Interpretation sentence | Interpretation + capacity text | Interpretation + breakdown |
| Assumptions / limitations | Brief in FAQ | Methodology + limitations | Methodology + limitations | Methodology only (gap) |
| FAQ justified | Yes (1) | Yes (4) | Yes (4) | Yes (4) |
| Structured data | WebPage + FAQPage | WebPage + FAQPage | WebPage + FAQPage | WebPage + FAQPage |

**FACT:** No “Quick Answer”, `ai-answer-block`, or green callout boxes on cluster pages.  
**FACT:** No hidden SEO text detected in HTML.

Preferred architecture **HEADER → HERO → CALCULATOR → RESULT INTERPRETATION → METHODOLOGY → SUPPORTING → FAQ → RELATED** is met on calculator pages (Pricing lacks supporting limitations block).

---

## 8. FAQ forensic audit

| Question | Page | Calc-specific? | Supported? | Dup cluster? | Dup heading? | “What is ROI?” | Generic finance? | Useful? |
|----------|------|----------------|------------|--------------|--------------|----------------|------------------|---------|
| Which calculator if I have two printers? | Hub | Yes (selection) | Yes | No | No | No | No | Yes |
| Payback + depreciation add-back? | Business | Yes | Yes | No | No | No | No | Yes |
| Failure rate on cost per print? | Business | Yes | Yes | No | No | No | No | Yes |
| Margin vs markup? | Business | Yes | Yes | No | No | No | No | Yes |
| Printer investment excluded from monthly profit? | Business | Yes | Yes | No | No | No | No | Yes |
| Utilization affect farm ROI? | Farm | Yes | Yes | No | No | No | No | Yes |
| Demand vs capacity limiting? | Farm | Yes | Yes | No | No | No | No | Yes |
| Failure rate > material? | Farm | Yes | Yes | **Near** Business FAQ #2 (same concept, farm wording) | No | No | No | Yes |
| Depreciation add-back (farm payback)? | Farm | Yes | Yes | **Near** Business FAQ #1 | No | No | No | Yes |
| Costs to include when pricing? | Pricing | Yes | Yes | No | No | No | No | Yes |
| Failed print affect price? | Pricing | Yes | Yes | No | No | No | No | Yes |
| Labor/post-processing? | Pricing | Yes | Yes | No | No | No | No | Yes |
| Min viable vs recommended price? | Pricing | Yes | Yes | No | No | No | No | Yes |

**FAQPage JSON-LD ↔ visible FAQ:** 1:1 match on all four pages (verified by text comparison).

**OBSERVATION:** Farm and Business share conceptual FAQ overlap on depreciation and failure-rate — wording differs; not duplicate schema entries.

---

## 9. Internal-link topology

```
GLOBAL NAV (sitewide Calculators ▼)
    └── "3D Printing Calculators" → /3d-printing/
            │
            ├── HUB (/3d-printing/)
            │     ├── → Business ROI
            │     ├── → Print Farm ROI
            │     └── → Service Pricing
            │
            ├── BUSINESS ROI
            │     ├── → Hub
            │     ├── → Print Farm
            │     ├── → Service Pricing
            │     └── → /, /comparisons/, /methodology/
            │
            ├── PRINT FARM ROI
            │     ├── → Hub
            │     ├── → Business ROI
            │     └── → /  (missing Service Pricing)
            │
            └── SERVICE PRICING
                  ├── → Hub
                  ├── → Business ROI
                  └── (missing Print Farm)
```

**Inbound to cluster (contextual body links):** None found in learn/benchmarks/comparisons article bodies — only sitewide header nav chrome (`grep` across site).

**FACT:** Footer `footer-links` / `footer-popular` on cluster pages do **not** link to `/3d-printing/` (same as other verticals link only major hubs).

**OBSERVATION:** `calculators/equipment-roi-calculator.html` is thematically adjacent (equipment ROI) but has no contextual link to 3D cluster in body — optional future cross-link, not required.

**P1:** Asymmetric sibling linking on Farm and Pricing pages.  
**P2:** No editorial inbound links beyond nav (discoverability relies heavily on nav + sitemap + search).

---

## 10. Hub audit

| Hub job | Pass? | Evidence |
|---------|-------|----------|
| 1. States what cluster is | Yes | H1 + subtitle |
| 2. Distinguishes three calculators | Yes | Cards + table |
| 3. Helps choose correct tool | Yes | “Which calculator should I use?” table |
| 4. Links every calculator | Yes | 3 cards + 3 table rows |
| 5. Explains relationships | Yes | “How these calculators differ” |
| 6. Avoids generic 3DP filler | Yes | No industry essay |
| 7. Avoids duplicating calculator content | Yes | No formulas duplicated |
| 8. Semantic context | Yes | Comparison dimensions are decision-relevant |
| 9. Legitimate category hub | Yes | Substantive selection UX — not a thin doorway |

**Hub FAQ:** Single question is useful and hub-appropriate (two-printer threshold). **KEEP.**

---

## 11. UX / visual consistency (Phase 7 reference)

| Element | Hub | Calculators | Reference (e.g. `/saas/`) |
|---------|-----|-------------|---------------------------|
| Header / nav | Shared chrome | Same | Same |
| Breadcrumb | Absent | Absent | Absent on reference landing |
| Hero alignment | `.hero` + `.hero-content` | Same | Similar |
| Calculator column width | N/A | `.calculator-section-inner` max-width | Aligned (Δ0px hero→calc) |
| Dominant result | N/A | `.result-dominant` + `.result-interpretation` | Same pattern |
| Methodology placement | N/A | Post-calculator `.methodology-section` | Same |
| FAQ placement | Post-content | Post-calculator | Same |
| Stylesheet | `?v=7b02` | `?v=7b02` | Same |
| Quick Answer pattern | Absent | Absent | Absent (post–Phase 7E) |

**Playwright measurements (local, default Calculate on calculators):**

| Page | Viewport | Overflow | Hero↔calc Δ |
|------|----------|----------|-------------|
| Hub | 320–1440 | No | N/A |
| Business ROI | 320–1440 | No | 0px |
| Print Farm | 320–1440 | No | 0px |
| Service Pricing | 320–1440 | No | 0px |

**OBSERVATION:** Results panels are tall (two metric grids on ROI pages) creating long scroll before methodology — not overflow, but elevated cognitive load (P2).

**Mechanism:** `.results-panel` contains two `.results-grid.results-box` sections separated by `<h3>Additional context</h3>` in `3d-printing/roi-calculator.html` and `print-farm-roi-calculator.html`.

---

## 12. Technical SEO / indexation

| Check | Result |
|-------|--------|
| HTTP status (production) | Hub 200; calculators 200 via extensionless; `.html` → 308 |
| Canonicals | Present; `.html` form on calculator pages |
| Sitemap | All four URLs listed |
| Robots | Allow all |
| noindex | None on cluster pages |
| Broken cluster links | None detected in HTML |
| Retired URLs | QA scripts reference removed candidates (`printer-payback`, `profit-margin`) — not in repo |
| CSS delivery | `styles.css?v=7b02` on all pages (production verified) |
| Schema types | WebPage + FAQPage only (no unauthorized types) |
| BreadcrumbList | Absent (consistent with Phase 7C policy on these page classes) |

**OBSERVATION:** Production/repo aligned at time of review.

---

## 13. AdSense / content-quality readiness

| Check | Assessment |
|-------|------------|
| Thin content | **Pass** — calculators have substantial inputs, methodology, FAQ |
| Duplicate content | **Pass** — distinct tools; FAQ not duplicated across pages |
| Doorway pattern | **Pass** — see Phase 5 doorway tests; still valid post-hub/nav |
| Earnings promises | **Pass** — disclaimer present; no guaranteed income language |
| Misleading UI | **Pass** — results labeled; interpretation is plain prose |
| Ad placeholders | **Pass** — none on cluster pages |
| Privacy claims | **Pass** — client-side calc; site-wide privacy policy exists |
| Affiliate/commercial | **Pass** — no affiliate CTAs |

**INFERENCE:** Content-quality bar for future AdSense consideration is **reasonable**; enabling ads is **not** recommended in any implementation phase without separate product authorization.

---

## 14. Competitive / search-demand review

**Web research (2026):** Competitors include LayerMath (print farm + pricing ecosystem), GrandpaCAD (combined business/farm/pricing tool), 3DPrintCalcs (UK print farm calculator), and various blog-led pricing guides.

| Intent | Served by cluster? | Gap quality |
|--------|-------------------|-------------|
| 3D printing business ROI | Yes — Business ROI | Competitive; this site’s payback/depreciation FAQ is a differentiator |
| Print farm ROI / capacity | Yes — Print Farm ROI | Competitive; demand/capacity interpretation is distinctive |
| Service / job pricing | Yes — Service Pricing | Competitive; cost breakdown table is strong |
| Printer payback only | Partial — output on ROI tools | Standalone tool **not justified** |
| Profit margin only | Partial — outputs + Pricing model | Standalone **not justified** |
| Resin-specific pricing/ROI | No | Competitors focus on FDM/filament; resin uses different units — **DEFER** (insufficient demand evidence in this review) |
| Maintenance/rent/software overhead (farm) | Partial | Farm has fixed costs field; not full opex suite — **optional enhancement**, not new URL |

**INFERENCE:** Fourth calculator **not justified** unless resin (or another process) research shows distinct search demand + distinct math + low doorway risk.

---

## 15. Page scorecards (1–10)

| Dimension | Hub | Business ROI | Print Farm | Service Pricing |
|-----------|-----|--------------|------------|-----------------|
| Search intent clarity | 9 | 9 | 9 | 9 |
| Calculator usefulness | N/A | 9 | 9 | 9 |
| Differentiation | 9 | 8 | 8 | 9 |
| Content quality | 8 | 8 | 8 | 7 |
| SEO | 8 | 8 | 8 | 7 |
| AEO | 8 | 8 | 9 | 8 |
| UX | 8 | 7 | 7 | 8 |
| Visual hierarchy | 8 | 7 | 7 | 8 |
| Internal discoverability | 7 | 8 | 7 | 7 |
| AdSense readiness | 8 | 8 | 8 | 7 |

**Cluster overall:** **8.0 / 10** — coherent, differentiated, discoverable via nav; incremental linking and content parity improvements remain.

---

## 16. Findings by severity

### P0 — blocking
None.

### P1 — important

| ID | URL | Source | Mechanism | User impact | SEO/AEO | Action (future) | Risk |
|----|-----|--------|-----------|-------------|---------|-----------------|------|
| P1-1 | Print Farm, Service Pricing | `print-farm-roi-calculator.html` L289–295; `service-pricing-calculator.html` L279–285 | Asymmetric “Explore further” — missing sibling calculator link | User may not discover the third tool | Weak internal cluster mesh | Add symmetric sibling links | Low — cluster HTML only |
| P1-2 | Cluster-wide | Site IA | Contextual inbound links only via global nav; no learn/benchmark body links to hub | Discovery depends on nav/sitemap | Reduced internal PageRank to hub | Optional editorial links from relevant articles (future content phase) | Low |

### P2 — worthwhile

| ID | URL | Source | Mechanism | Action (future) |
|----|-----|--------|-----------|-----------------|
| P2-1 | Service Pricing | `<title>` L9 | Missing `\| roicalculator.live` brand suffix | Align title with siblings |
| P2-2 | Service Pricing | Content structure | No “How to use…” / limitations sections | Add parity with ROI pages |
| P2-3 | Business + Farm ROI | Results panel HTML | Two full result grids increase scroll/cognitive load | Condense secondary metrics or collapse “Additional context” |
| P2-4 | Hub | `index.html` inline `<style>` | Page-scoped hub-card CSS | Consider moving to scoped shared CSS in future UX phase (optional) |

### P3 — optional polish
- Hub comparison table echoes card copy (acceptable redundancy).
- Footer could list 3D Printing hub (site-wide footer policy decision).

### OBSERVATION
- Extensionless URLs served in production with `.html` canonicals (site-wide pattern).
- Default demo outputs show very high ROI % at defaults — not misleading (user-adjustable); interpretation text is conditional.
- Conceptual FAQ overlap (depreciation/failure) across Business and Farm — acceptable with distinct wording.

### DEFERRED
- Resin-specific calculator — requires dedicated demand/formula research (unchanged from Phase 5).
- Fourth calculator of any kind — **not authorized** by evidence in this review.

---

## 17. Expansion decision

### **B — FIX EXISTING CLUSTER FIRST**

**Rationale (evidence-based):**
1. Three tools cover distinct jobs with low doorway risk (Phase 5 analysis still valid post-hub/nav).
2. Primary weakness is **internal discoverability polish**, not missing calculators.
3. No fourth intent clears distinct-model + distinct-demand + low-risk bar.
4. Resin calculator: **DEFER** — no sufficient demand/formula evidence in this review.
5. Printer Payback / Profit Margin: **REJECT** (duplicative).

**Not recommended now:** C (Resin), D (any other fourth calculator), A (stop all work) — cluster merits targeted fixes, not expansion or abandonment.

---

## 18. Recommended future roadmap (recommendations only — not implemented)

| Phase | Scope | Addresses |
|-------|-------|-------------|
| **8A** | Cluster internal linking | P1-1 symmetric sibling links |
| **8B** | Service Pricing content parity | P2-2 limitations + “how to use” sections |
| **8C** | Metadata consistency | P2-1 title suffix |
| **8D** | ROI results UX | P2-3 condense secondary result grids |
| **8E** | Editorial discoverability (optional) | P1-2 contextual links from learn/comparisons if editorially appropriate |
| **8F** | Resin demand research (optional) | DEFERRED expansion gate — research only, no build |

---

## 19. Production vs repository

**FACT:** At review time, production HTML for all four URLs matched repository content at `c4e4873` (titles, canonicals, nav entry, hub structure). No discrepancy requiring escalation.

---

## 20. What was NOT changed

This review modified **only** this report file.

**Not changed:** HTML, CSS, JS, sitemap, redirects, navigation, templates, generator, calculator formulas, FAQ wording, schema, titles, internal links, QA scripts, or any production-facing asset.

---

## 21. Verification checklist

| Gate item | Status |
|-----------|--------|
| Only this audit report created/changed | Pending git verification after write |
| No production-facing file changed | Yes (by instruction) |
| Report complete | Yes |
| Expansion decision explicit | **B — FIX EXISTING CLUSTER FIRST** |
| Implementation not authorized | Yes |

---

**PHASE 8 — CLUSTER-LEVEL SEO / CONTENT / UX REVIEW COMPLETE. IMPLEMENTATION NOT AUTHORIZED IN THIS PHASE.**
