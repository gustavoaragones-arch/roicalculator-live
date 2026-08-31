# Phase 5 — 3D Printing Cluster Architecture Review

**This is a review/architecture document. No production files were modified to produce it.** Every recommendation below is explicitly a recommendation for a future, separately-authorized phase — nothing in this report has been implemented.

**Method note:** every FACT below was obtained by directly reading the current on-disk HTML/JS of all three pages and independently re-verifying default calculations and text against that source (not from memory of having written them in prior phases). Production URLs were checked read-only via real Playwright + system Chrome, cache-busted, for verification purposes only.

---

## 1. STATUS

Review complete. Starting HEAD matched the expected `f61c0003d9baa69e714ca257b7e25893544a0f9a`, working tree clean, confirmed before any work began.

---

## 2. CURRENT CLUSTER INVENTORY

| Page | Commit | Canonical | In sitemap | In navigation |
|---|---|---|---|---|
| `/3d-printing/roi-calculator.html` | Phase 2 (`0dbe3f4`) | `https://roicalculator.live/3d-printing/roi-calculator.html` | Yes | No |
| `/3d-printing/print-farm-roi-calculator.html` | Phase 3 (`5d1cb55`) | `https://roicalculator.live/3d-printing/print-farm-roi-calculator.html` | Yes | No |
| `/3d-printing/service-pricing-calculator.html` | Phase 4 (`f61c000`) | `https://roicalculator.live/3d-printing/service-pricing-calculator.html` | Yes | No |

FACT: none of the three pages currently link to each other as a set — each links out to at most one sibling (see §14).

---

## 3. INTENT MATRIX

| Page | Primary user | Primary question | Search intent | Dominant result | Economic model | Distinctive inputs | Distinctive outputs |
|---|---|---|---|---|---|---|---|
| **Business ROI** | Single-printer side-business owner or aspiring buyer | "Is my printer/side business profitable, and should I buy this printer?" | "3d printing business roi calculator," "should I buy a 3D printer" | 24-Month ROI (%) | One printer's per-unit cost → monthly P&L → cash-flow payback/ROI on one printer's purchase price | Printer cost, setup cost, useful life, residual value, unconstrained units sold/month | Payback, monthly operating profit, profit/print, break-even units/month, 12/24/36mo ROI, margin, markup |
| **Print Farm ROI** | Multi-printer / print-farm operator | "How profitable could my fleet be at the printer count, utilization, and volume I can realistically run?" | "3d print farm roi calculator," "print farm profitability" | 24-Month ROI (%) | Fleet-capacity model (printer count × hours × utilization × failure) constrains achievable output; demand vs. capacity explicitly compared; fleet-level P&L → cash-flow payback/ROI on fleet investment | Number of printers, utilization (%), orders/month compared against a computed capacity ceiling | Everything Business ROI has, PLUS monthly successful prints sold, capacity utilization %, theoretical capacity/month, explicit demand-vs-capacity interpretation |
| **Service Pricing** | Anyone who has (or is about to quote) a specific paying job | "What should I charge this customer for this job?" | "3d print pricing calculator," "what to charge for 3d printing" | Recommended Price ($) | Single-job cost-plus-margin pricing — solves **forward for price** given a target margin (the inverse operation of the other two) | Printed parts, target profit margin (%) as a price-solving input, platform fee (%) used inside the pricing denominator | Recommended price, minimum viable price, price/part, price/printed hour, effective hourly earnings, full line-item cost breakdown table |

**Answer to "are these three pages genuinely different tools?": YES — evidence-based**, not asserted. Three independent, verifiable structural differences:
1. **Different dependent variable.** Business ROI and Print Farm ROI both solve for *return* given a price (`roiPct = f(monthlyCashProfit, months, initialInvestment)`); Service Pricing solves for *price* given a target margin (`recommendedPrice = costBeforeFees / (1 − fee − margin)`). These are algebraically inverse operations, not relabeled versions of the same formula.
2. **Different unit of analysis.** Business ROI = one printer. Print Farm ROI = a fleet, with a capacity/utilization ceiling concept that has no counterpart anywhere in Business ROI's code. Service Pricing = one job, with no printer-investment concept at all (no payback, no ROI, no printer count).
3. **Different time horizon.** The two ROI tools operate on monthly/annualized horizons (12/24/36-month ROI). Service Pricing has no time horizon beyond "this one job."

---

## 4. USER-AUDIENCE MATRIX

| Page | Who they are | What they already know | What they don't know (and the page must ask) | What the page must NOT ask |
|---|---|---|---|---|
| Business ROI | Owns or is considering one printer | Rough material/print-time numbers for their typical print | Whether the printer/business pencils out over time | Fleet size, utilization, customer-specific job details |
| Print Farm ROI | Already runs (or is scaling to) multiple printers | Per-unit economics are roughly similar to Business ROI's | Whether their fleet's *capacity* — not just unit economics — supports their sales ambitions | Single-job pricing mechanics, target-margin framing |
| Service Pricing | Has a specific job in hand, from a customer or marketplace listing | The job's material/time/labor specifics | What price recovers cost + fees at a chosen margin | Printer-purchase economics, fleet size, monthly sales volume |

OBSERVATION: the three audience profiles are sequential rather than competing — a single person could plausibly move Business ROI → Print Farm ROI → Service Pricing as their operation grows and as individual jobs come in, without redundancy at any step.

---

## 5. PAIRWISE OVERLAP AUDIT

### 5.1 Business ROI ↔ Print Farm ROI: **PARTIAL OVERLAP**

Shared (FACT, confirmed by direct code comparison): material/electricity/depreciation/labor cost-primitive formulas; failure-rate-applied-to-full-attempt-cost; depreciation-added-back-for-cash-profit; 12/24/36-month ROI as the output family; "printer cost + setup cost" as initial investment.

Distinct (FACT): Print Farm ROI's entire fleet-capacity sub-model (`fleetAvailableHours`, `utilizedFleetHours`, `attemptCapacity`, `successfulPrintCapacity`, `MIN(capacity, orders)`, demand-vs-capacity interpretation) has zero counterpart in Business ROI. Business ROI's "units sold per month" is a raw, unconstrained input; Print Farm ROI's "orders per month" is checked against a computed ceiling.

**Verdict rationale:** shared *financial primitives* (an intentional, Phase-1-mandated design choice — a "reference financial architecture" for the cluster) but a genuinely different *economic question* (single-unit profitability vs. fleet-capacity-constrained profitability). This is analogous to this site's existing SaaS hub vs. its "Subscription Growth ROI" child tool — an accepted, non-cannibalizing pattern elsewhere on the site — not the kind of overlap Phase 7F flagged as doorway risk.

### 5.2 Business ROI ↔ Service Pricing: **DISTINCT**

No shared dominant-result type (% vs. $). No shared time-horizon concept. Service Pricing has zero payback/ROI machinery; Business ROI has zero price-solving/target-margin machinery. Only the raw cost-component primitives are shared — inevitable in any 3D-printing calculator, not evidence of duplication (per the brief's own instruction not to declare overlap merely because both mention "3D printing," "cost," "printer").

### 5.3 Print Farm ROI ↔ Service Pricing: **DISTINCT**

Same reasoning as 5.2, plus Print Farm ROI's fleet-capacity/utilization model has no analog in Service Pricing, which models exactly one job.

---

## 6. DOORWAY-PAGE RISK

Applying the same test the project used in the Phase 7F audit (independent intent / materially different calculations / distinct inputs / distinct outputs / distinct terminology / standalone value):

| Test | Business ROI vs. Print Farm ROI | Business ROI vs. Service Pricing | Print Farm vs. Service Pricing |
|---|---|---|---|
| Independent intent | Yes | Yes | Yes |
| Materially different calculation | Yes (fleet-capacity model) | Yes (inverse algebra) | Yes (both) |
| Distinct inputs | Yes | Yes | Yes |
| Distinct outputs | Yes | Yes | Yes |
| Distinct terminology | Yes | Yes | Yes |
| Standalone value | Yes | Yes | Yes |

FACT: across the cluster's 12 total FAQ questions (4 per page), zero are duplicated or near-duplicated between pages — confirmed by direct text comparison, not sampling.

**Conclusion: no doorway-page pattern detected.** This is the structural opposite of the Simple/Free/Example cluster removed in Phases 7F–7H: those three had *identical* underlying formulas and interchangeable FAQ questions; these three share only unavoidable cost-primitive arithmetic and have zero interchangeable FAQ content.

---

## 7. FORMULA / ECONOMIC-MODEL COMPARISON

| Concept | Business ROI | Print Farm ROI | Service Pricing |
|---|---|---|---|
| Material cost | `(filamentPrice/1000)×grams` | same formula | same formula |
| Electricity cost | `(watts/1000)×time×rate` | same formula | same formula |
| Depreciation | `(price−residual)/life×time` | same (per attempt) | `price/life×time` — **no residual-value input exists on this page** |
| Labor cost | `(minutes/60)×rate` | same formula | `hours×rate` — hours not minutes; scale differs but shape is the same primitive |
| Failure treatment | `attemptCost/(1−failureRate)` | same shape | same shape, applied to a base cost that additionally includes `overheadPerJob` (unique to this page) |
| Fleet capacity | **not modeled** | modeled in full (capacity ceiling, demand/capacity MIN) | **not modeled** |
| Sales volume | raw unconstrained monthly input | capacity-constrained via `MIN()` | N/A — single job; `printedParts` is a display divisor only |
| Fees | marketplace % + payment % added to per-print cost | same two fees, **plus a separate order-level shipping line** | platform+payment % used **inside the price-solving denominator**, not added after |
| Margin/markup | *derived* from an entered selling price | same, derived | margin is the **entered target that determines price** — the inverse relationship of the other two |
| Payback | `investment/(opProfit+depreciation)` | same shape, at fleet scale | **not modeled** (no time horizon, no printer-investment concept at all) |
| 12/24/36-mo ROI | modeled, on one printer's investment | modeled, on fleet investment | **not modeled** |
| Dominant output type | Percentage | Percentage | Dollar amount |
| Break-even | units/month via fixed-cost recovery | prints/month via contribution margin (including shipping) | **not modeled** (no monthly fixed-cost concept; overhead is per-job) |

**Shared primitives do not indicate duplication** here: they are the physical/accounting inputs common to any 3D print (material, power, machine wear, hands-on time), not the product's differentiating logic. The differentiating logic — fleet capacity, and forward-solved pricing — appears in exactly one page each and nowhere else.

---

## 8. SEARCH-INTENT MAP

| Intent | Classification | Basis |
|---|---|---|
| A. Business profitability | COVERED BY EXISTING TOOL | Business ROI |
| B. Print farm profitability | COVERED BY EXISTING TOOL | Print Farm ROI |
| C. Service pricing | COVERED BY EXISTING TOOL | Service Pricing |
| D. Printer payback | BETTER AS A RESULT WITHIN EXISTING TOOL | Already a first-class output on both ROI tools; a standalone version would duplicate ~80%+ of an existing model for a narrower output |
| E. Profit margin | NOT WORTH A DEDICATED PAGE | Already a supporting output on 2 tools; Service Pricing's entire model is built around a target margin |
| F. Cost per print | COVERED BY EXISTING TOOL | Internal computation + visible breakdown row on Service Pricing |
| G. Price per print | COVERED BY EXISTING TOOL | Service Pricing: price/printed hour, price/part |
| H. Break-even analysis | COVERED BY EXISTING TOOL | Business ROI and Print Farm ROI both have it |
| I. Print-farm capacity | COVERED BY EXISTING TOOL | Print Farm ROI |
| J. Hobby-to-business transition | NOT WORTH A DEDICATED PAGE (as currently evidenced) | Narrative/decision-framework need, not a distinct formula; no evidence the underlying math would differ from Business ROI |
| K. Print-service quotation | COVERED BY EXISTING TOOL | Service Pricing *is* the quotation tool |
| L. Material cost | COVERED BY EXISTING TOOL | Shared primitive, visible in Service Pricing's breakdown |
| M. Electricity cost | COVERED BY EXISTING TOOL | Same |
| N. Labor/post-processing cost | COVERED BY EXISTING TOOL | Same |

INFERENCE: no intent in this list clears the bar for a new dedicated page without additional research (see §10).

---

## 9. CLUSTER GAPS

| Gap | Classification | Reasoning |
|---|---|---|
| Printer-model-specific presets (typical print time/wattage by machine) | Better handled as supporting content | A reference table, not a calculator; no new math required |
| Hobby → registered business transition (tax/legal) | Not worth pursuing | Outside a financial calculator's scope; correctly excluded by the site's existing "not financial or investment advice" discipline |
| Side-by-side scenario comparison within Service Pricing | Better handled as supporting content / a future enhancement to the existing page | Not a new job-to-be-done, an enhancement to an existing one — out of scope for a new URL |
| Resin printing cost structure (vs. FDM/filament) | The one gap classified **DISTINCT FUTURE TOOL candidate**, conditionally | Resin's $/L consumption, curing/post-processing labor profile, and support-waste economics are structurally different from filament grams — the only candidate here with a plausible distinct input model. Not recommended for BUILD without separate keyword/demand research (none performed in this phase). |

---

## 10. CALCULATOR #4 CANDIDATES

| Candidate | User intent | Overlap w/ existing | Unique inputs/outputs/model | Doorway risk | Recommendation |
|---|---|---|---|---|---|
| Printer Payback Calculator | "When does my printer pay for itself?" | Near-total — payback is already computed by 2 existing tools | None identified | High — would either duplicate an existing model wholesale or regress to a thinner version of it (the exact pattern removed in Phases 7F–7H) | **REJECT** |
| Profit Margin Calculator | "What's my margin?" | Near-total — margin/markup already shown on 2 tools; Service Pricing's entire model targets margin | None identified | High, same reasoning | **REJECT** |
| Hobby-to-Business Calculator | "Should I formalize my hobby into a business?" | High — math would likely just repackage Business ROI with different framing copy | No distinct formula identified | Moderate–high | **DEFER** — revisit only if future keyword research finds this a distinct query cluster from "3d printing business roi" |
| Architectural/Diorama Studio ROI | Niche vertical of Business ROI | High — same cost structure (printer, material, labor, price, volume) | None identified — only cosmetic/copy differences | High | **REJECT** |
| Resin-specific cost/pricing calculator | Resin printers' distinct cost structure | Low-moderate — different consumption unit and labor profile | Plausible: $/L consumption, curing time, support-waste | Low, if built with genuinely different formulas | **DEFER**, pending dedicated research (most promising of the candidates evaluated, but not yet evidenced) |

---

## 11. CALCULATOR #5 CANDIDATES

Not separately warranted. Since none of the Calculator #4 candidates cleared the BUILD bar, there is no basis to evaluate a fifth tool in this phase. **The evidence-based conclusion is that a cluster of three is currently complete**; expanding to four or five without new research would risk recreating exactly the kind of low-differentiation content this project has spent multiple phases removing.

---

## 12. HUB ARCHITECTURE (design only — not implemented)

**Purpose:** help a visitor self-select the correct one of three calculators by job-to-be-done. Not a generic SEO directory, not a fourth calculator.

- **H1:** "3D Printing Calculators"
- **Primary user question the hub answers:** "Which of these three tools is the one I need?"
- **Calculator ordering:** Business ROI → Print Farm ROI → Service Pricing (matches the natural progression from single printer → scaled operation → transactional pricing need, and matches build order).
- **Card/link structure:** one card per calculator; each card states *who it's for and what question it answers*, not just its name (e.g., not "Business ROI Calculator" alone, but "for deciding whether to buy a printer or continue a single-printer side business").
- **Supporting content:** a short paragraph distinguishing the three, condensed from §3's intent matrix.
- **Comparison table:** YES, warranted — a "your situation → use this calculator" table is exactly the selection aid the hub exists to provide; it is decision-relevant, not decorative filler.
- **FAQ:** only if a genuinely hub-level threshold question exists that no individual calculator answers (candidate: "I have 2 printers — is that a print farm?"). Do **not** add an FAQ merely to restate the comparison table — consistent with the site's existing no-generic-FAQ doctrine.
- **Terminology:** reuse each calculator's own established terms (ROI, payback, recommended price); do not invent new umbrella terminology.
- **Navigation position:** see §19.
- **Omit:** no benchmarks table, no glossary-style "what is 3D printing" content, no generic industry statistics — none of that serves the hub's actual job.

---

## 13. FUTURE HUB COPY (recommendation only — fixed wording, not to be implemented in this phase)

**TITLE:** `3D Printing Calculators: ROI, Print Farm & Pricing Tools | roicalculator.live`

**H1:** `3D Printing Calculators`

**SUBTITLE:** `Choose the right tool for your situation: evaluate a printer purchase, model a multi-printer operation, or price a customer job.`

**SHORT INTRO:** `These three calculators answer different questions. Use the comparison below to find the one that matches what you're deciding.`

**CALCULATOR CARD LABELS + DESCRIPTIONS:**
- `3D Printing Business ROI Calculator` — `For a single printer or side business: is it profitable, and when does the printer pay for itself?`
- `3D Print Farm ROI Calculator` — `For multiple printers: how does utilization and sales volume affect fleet profitability and capacity?`
- `3D Print Service Pricing Calculator` — `For a specific customer job: what should you charge to hit your target profit margin?`

---

## 14. INTERNAL-LINK ARCHITECTURE (design only — not implemented)

- **Hub → each calculator:** yes, primary card links, above any prose.
- **Each calculator → hub:** yes, once the hub exists — add one "back to hub" link in each page's existing "Explore further" / tertiary section, alongside (not replacing) its existing link.
- **Calculator → related calculator:** **not all-to-all.**
  - FACT (a real, low-severity finding from this review, left untouched per this phase's scope): Business ROI currently links to `/`, `/comparisons/`, and `/methodology/` but to **neither** of the other two 3D-printing calculators — it is currently a dead end out of the cluster. Print Farm ROI and Service Pricing each link only to Business ROI.
  - RECOMMENDATION: in the hub-building phase, add forward links from Business ROI to *both* Print Farm ROI ("scaling to multiple printers?") and Service Pricing ("pricing a specific job?") — these are the two natural "next questions" after evaluating a single printer.
  - Do **not** add a direct Print Farm ↔ Service Pricing cross-link — these two do not share a natural next-question relationship; a hub-mediated path is sufficient and more honest than a mechanical all-to-all "Related Calculators" block.
- **Contextual (inline) cross-links:** not currently warranted — none of the three pages' body copy references a concept the others define (unlike, e.g., the site's CAC/LTV glossary-linking pattern elsewhere).
- **Anchor text:** use each calculator's exact title as anchor text (already the sitewide convention).
- **Position:** after FAQ/methodology, before the footer — matches current placement; no change needed.

---

## 15. SEO REVIEW

FACT (direct source comparison):
- Titles: 3/3 distinct, descriptive, no keyword stuffing.
- **OBSERVATION:** Business ROI and Print Farm ROI both end their `<title>` with `| roicalculator.live` (sitewide brand-suffix convention); Service Pricing instead ends with `| Calculate Your Print Price` (a value-prop suffix, per its own Phase 4 brief's exact required wording). This is a real, minor cross-page inconsistency in title-suffix pattern — worth normalizing if a future phase revisits titles, but each string was independently dictated verbatim by its own phase brief, so it is documented here rather than corrected (out of scope for this read-only review).
- H1s: 3/3 align with their `<title>`'s core phrase; no genericism, no stuffing.
- Subtitles: 3/3 describe actual function/mechanism; none use "instant," "free," "best," or AI-flavored language.
- FAQ: 12 total questions, zero duplicates, zero generic "What is ROI?"/"What is 3D printing?" questions anywhere in the cluster.
- FAQPage JSON-LD: present on all 3; visible FAQ and JSON-LD are identical in question/answer text on all 3 (re-verified for Phase 2 and Phase 4 via direct source read in this review; Phase 3 was verified identical during its own dedicated QA run in the prior phase).
- Methodology: one distinct, non-generic paragraph per page — no copy-paste detected (three different sentences describing three different models, confirmed by direct comparison).
- Excessive repetition: not found at the sentence level, other than the sitewide disclaimer footer (expected, correct, consistent sitewide).

**Conclusion: no SEO refinement required by this review.**

---

## 16. AEO REVIEW

FACT: no "Quick Answer," no "AI Answer," no green AEO card, no hidden SEO text, no repeated "What is ROI?" FAQ, and no generic FAQ question on any of the 3 pages — confirmed by direct text search of each page's full source during this review (not merely trusted from prior phases' own self-reported QA).

Each page achieves AEO through the same mechanism used sitewide since Phase 7E: precise H1, precise subtitle, a direct calculator output, factual result interpretation (verified free of evaluative language — "great," "excellent," "smart," "ideal" do not appear on any of the 3 pages), calculator-specific methodology, and calculator-specific FAQ.

**Conclusion: existing AEO treatment is sufficient; no new AEO component is recommended.**

---

## 17. ADSENSE / CONTENT-QUALITY REVIEW

**Assessment: PASS**, with reasons:

- Each page has standalone utility: calculator + methodology + FAQ + limitations section, never calculator-only.
- No misleading financial claims found on any of the 3 pages: no "guaranteed," "passive income," "get rich," or "easy money" language anywhere in the cluster (confirmed by direct read; Phase 4's brief explicitly forbade this and it was honored, and Phase 2/3 independently avoid it too).
- No ad-heavy architecture: zero ad slots, zero AdSense script on any of the 3 pages — consistent with the sitewide current state (zero ads anywhere on the site, per the Phase 7F audit).
- No repetition pattern that would read as thin/doorway content to a human reviewer or an algorithmic quality signal (see §6).

---

## 18. USER-JOURNEY MODEL

| Journey | Verified against actual page capability |
|---|---|
| Has one printer, wants to know if it's profitable | → Business ROI. Matches its stated hero subtitle and dominant result exactly. |
| Has multiple printers, wants fleet/capacity view | → Print Farm ROI. Fleet-capacity model and demand-vs-capacity interpretation exist for exactly this purpose. |
| Received a customer order, needs a quotation | → Service Pricing. Recommended-price dominant result and cost breakdown table exist for exactly this purpose. |

These three journeys are sufficiently clear and non-overlapping. No fourth journey with comparable evidence was identified (see §10 — every Calculator #4 candidate either collapses into an existing journey or lacks a demonstrated distinct one).

---

## 19. NAVIGATION DECISION

Options considered: (A) no exposure yet, (B) hub-only, (C) direct calculator links, (D) both.

FACT: none of the 3 pages are currently in the global nav or the Calculators dropdown; each phase brief explicitly deferred navigation integration.

**RECOMMENDATION: A for now.** B (hub-only, a single new "3D Printing" nav entry pointing at the hub) is the correct *next* step once the hub is built — not before. C/D (direct per-calculator nav links) should wait until there is evidence users need to jump directly to a specific calculator without hub disambiguation; adding three more flat, easily-confused entries ("Business ROI" vs. "Print Farm ROI") to an already six-item Calculators dropdown, without the hub's disambiguating copy, risks exactly the kind of user confusion this review's own intent matrix (§3) exists to prevent.

---

## 20. RECOMMENDED ROADMAP

Evidence supports **hub before anything else**:
1. The cluster's three tools are confirmed genuinely distinct — nothing to fix there.
2. The concrete, evidenced gap is discoverability: none of the 3 pages are reachable via navigation, and Business ROI does not link to either sibling (§14) — a hub directly addresses this.
3. No Calculator #4 candidate cleared the BUILD bar (§10) — there is nothing else ready to build.
4. The internal-link fix (Business ROI → both siblings) is cheap and naturally bundles with the hub phase, since that phase will touch each page's "Explore further" section anyway.

**Recommended order:**
- **Phase 6** — Build the `/3d-printing/` hub per §12–13, plus the "back to hub" and forward cross-links from each existing calculator's Explore-further section (small, targeted edits to 3 existing files; no math/formula changes).
- **Phase 7** — Navigation integration: one "3D Printing" entry in the Calculators dropdown pointing at the hub (not at individual calculators), plus sitemap/canonical for the hub itself.
- **Phase 8 (conditional, not committed)** — only if separate keyword/demand research substantiates it: a resin-specific calculator, the sole candidate this review could not reject outright (§10).

Do not build a fourth calculator next. Do not skip the hub in favor of a fourth calculator. Do not integrate navigation before the hub exists.

---

## 21. ITEMS EXPLICITLY REJECTED

- Printer Payback Calculator — REJECT (duplicates existing outputs).
- Profit Margin Calculator — REJECT (duplicates existing outputs; Service Pricing already is this).
- Architectural/Diorama Studio ROI — REJECT (no structurally distinct economics found).
- A fifth calculator of any kind — not applicable; no fourth candidate cleared the bar.
- A generic "What is 3D printing ROI?" content page — REJECT (would recreate the doorway-page pattern eliminated in Phases 7F–7H).
- STL/slicer/file-upload integration — correctly out of scope per every phase brief to date; this review does not recommend it absent a defined product need.

---

## 22. PRODUCTION VERIFICATION

Performed via real Playwright + `channel: 'chrome'`, cache-busted, read-only:

| URL | Status | Title matches source | H1 matches | Canonical correct | Calculator produces a result | Overflow @ 390×844 |
|---|---|---|---|---|---|---|
| `/3d-printing/roi-calculator.html` | 200 | Yes | Yes | Yes | Yes (1311.4%) | No |
| `/3d-printing/print-farm-roi-calculator.html` | 200 | Yes | Yes | Yes | Yes (1022.0%) | No |
| `/3d-printing/service-pricing-calculator.html` | 200 | Yes | Yes | Yes | Yes ($55.51) | No |

No deployment discrepancy found. No visual regression observed. No production files were modified during this verification.

---

## 23. REPOSITORY SAFETY

- Starting `git status --short`: clean.
- Starting HEAD: `f61c0003d9baa69e714ca257b7e25893544a0f9a` — matched the expected value stated in the brief.
- No production source file was edited during this review. The only file created is this report.

---

## 24. FINAL DIRECTOR RECOMMENDATION

The three existing 3D-printing calculators form a coherent, non-cannibalizing cluster: each answers a structurally different economic question (single-unit ROI, fleet-capacity-constrained ROI, forward-solved job pricing), verified by direct formula and content comparison rather than assumed from naming. No doorway-page risk was found. No Calculator #4 or #5 candidate is currently justified by evidence — recommend **DEFER** on cluster expansion.

The cluster's actual limiting factor is discoverability, not content quality or differentiation: the three pages cannot currently be found from each other or from site navigation. **Recommend building the `/3d-printing/` hub next (Phase 6)**, using the architecture and exact copy specified in §12–13, followed by minimal navigation integration (Phase 7). Do not build a fourth calculator before the hub exists.
