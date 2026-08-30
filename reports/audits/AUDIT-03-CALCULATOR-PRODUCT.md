# AUDIT 03 — Calculator Product UX + Logic Integrity
**roicalculator.live — Project Director Audit**
Read-only. No code modified. Formulas below are traced directly from `assets/js/*.js`, inline `&lt;script&gt;` blocks, and `data/calculators.json`, then verified with hand-computed test cases (shown in full so they can be independently re-checked).

**Primary question, answered up front:** Roughly half the calculators on this site are genuinely good calculators (correct math, sensible defaults, a real results panel). The other half — mainly the 12 hand-coded pages under `/roi-calculator/*/*` and several of the 14 factory-generated pages under `/calculators/` — are **content pages with a calculator embedded partway down**: the user must scroll past 1-4 sections of generic boilerplate before reaching an input field, and the "result" is frequently a single bare percentage with no interpretation layer. Three calculators additionally have **actual logic defects**, not just UX problems (§4). This is a mixed product, not a uniformly excellent or uniformly bad one — the ranking in §7 reflects that spread.

---

## 1. Calculator Inventory

33 working calculators identified (pages with a live input→output form). Homepage generic calculator counted once.

| # | URL | Name | Template | Generator / JS | Inputs | Outputs | Chart | PDF/Print | Explanation sections (H2/H3) | CTA |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `/` | ROI Calculator (generic) | hand-authored | `calculator.js` + `calculator-engine.js` + `chart-config.js` | 4 (3 fields + reverse toggle) | 3 (ROI, Annualized ROI, Profit) | ✅ | ✅ (print-based) | 30 | Calculate + Download PDF |
| 2 | `calculators/simple-roi-calculator.html` | Simple ROI Calculator | factory (`article-template.html`) | `calculator-engine.js` (JSON formulas) | 2 | 1 (ROI %) | ❌ | ❌ | 9 | Calculate |
| 3 | `calculators/free-roi-calculator.html` | Free ROI Calculator | factory | same | 2 | 1 | ❌ | ❌ | 9 | Calculate |
| 4 | `calculators/roi-calculator-example.html` | ROI Calculator w/ Example | factory | same | 2 | 1 | ❌ | ❌ | 9 | Calculate |
| 5 | `calculators/marketing-roi-calculator.html` | Marketing ROI Calculator | factory | same | 2 | 2 (ROI, Profit) | ❌ | ❌ | 9 | Calculate |
| 6 | `calculators/email-marketing-roi-calculator.html` | Email Marketing ROI Calculator | factory | same | 3 | 2 | ❌ | ❌ | 9 | Calculate |
| 7 | `calculators/content-marketing-roi-calculator.html` | Content Marketing ROI Calculator | factory | same | 4 | 2 | ❌ | ❌ | 9 | Calculate |
| 8 | `calculators/influencer-roi-calculator.html` | Influencer ROI Calculator | factory | same | 3 | 2 | ❌ | ❌ | 9 | Calculate |
| 9 | `calculators/ai-tool-roi-calculator.html` | AI Tool ROI Calculator | factory | same | 3 | 2 | ❌ | ❌ | 9 | Calculate |
| 10 | `calculators/equipment-roi-calculator.html` | Equipment ROI Calculator | factory | same | 3 | 2 | ❌ | ❌ | 9 | Calculate |
| 11 | `calculators/working-capital-roi-calculator.html` | Working Capital ROI Calculator | factory | same | 3 | 2 | ❌ | ❌ | 9 | Calculate |
| 12 | `calculators/warehouse-automation-roi-calculator.html` | Warehouse Automation ROI | factory | same | 4 | 2 | ❌ | ❌ | 9 | Calculate |
| 13 | `calculators/employee-training-roi-calculator.html` | Employee Training ROI | factory | same | 3 | 2 | ❌ | ❌ | 9 | Calculate |
| 14 | `calculators/logistics-efficiency-roi-calculator.html` | Logistics Efficiency ROI | factory | same | 3 | 2 | ❌ | ❌ | 9 | Calculate |
| 15 | `saas/roi-calculator.html` | SaaS ROI Calculator | hand-authored | `saas-ecosystem-calculator.js` | 8 (incl. mode toggle) | 5 | ✅ | ❌ | 7 | Calculate |
| 16 | `real-estate/roi-calculator.html` | Rental Property ROI Calculator | hand-authored | `rental-ecosystem-calculator.js` | 9 | 4 | ✅ | ❌ | 8 | Calculate |
| 17 | `real-estate/cap-rate-calculator.html` | Cap Rate Calculator | hand-authored | `calculator-bindings.js` | 3 | 2 | ❌ | ❌ | 6 | Calculate |
| 18 | `real-estate/cash-on-cash-calculator.html` | Cash-on-Cash Calculator | hand-authored | `real-estate-cluster-calculators.js` | 2 | 1 | ❌ | ❌ | 6 | Calculate |
| 19 | `real-estate/flip-roi-calculator.html` | Fix & Flip ROI Calculator | hand-authored | `real-estate-cluster-calculators.js` | 4 | 3 | ❌ | ❌ | 6 | Calculate |
| 20 | `solar/roi-calculator.html` | Solar ROI Calculator | hand-authored | `solar-ecosystem-calculator.js` | 6 | 6 | ❌ | ❌ | 5 | Calculate |
| 21 | `hvac/roi-calculator.html` | HVAC ROI Calculator | hand-authored | `vertical-roi-calculators.js` | 4 | 3 | ❌ | ❌ | 5 | Calculate |
| 22 | `hr/roi-calculator.html` | Employee Retention "ROI" Calculator | hand-authored | `vertical-roi-calculators.js` | 5 | 3 | ❌ | ❌ | 5 | Calculate |
| 23 | `roi-calculator/marketing/roas-calculator.html` | ROAS Calculator | legacy hand-authored | inline `<script>` + `marketing-calculators.js` (helpers only) | 6 (incl. advanced toggle) | 3 + interpretation sentence | ✅ | ❌ | 16 | Calculate |
| 24 | `roi-calculator/marketing/email-marketing-roi.html` | Email Marketing ROI (v2) | legacy hand-authored | inline `<script>` | 6 | 3 + interpretation | ❌ | ❌ | 12 | Calculate |
| 25 | `roi-calculator/marketing/lead-generation-roi.html` | Lead Generation ROI | legacy hand-authored | inline `<script>` | 4 | 4 + interpretation | ❌ | ❌ | 11 | Calculate |
| 26 | `roi-calculator/real-estate/rental-property-roi.html` | Rental Property ROI (v2) | legacy hand-authored | inline `<script>` | 6 | 4 | ✅ | ❌ | 18 | Calculate |
| 27 | `roi-calculator/real-estate/cash-on-cash-return.html` | Cash-on-Cash (v2) | legacy hand-authored | inline `<script>` | 2 | 1 | ❌ | ❌ | 12 | Calculate |
| 28 | `roi-calculator/real-estate/fix-and-flip-roi.html` | Fix-and-Flip ROI (v2) | legacy hand-authored | inline `<script>` | 5 | 4 | ✅ | ❌ | 18 | Calculate |
| 29 | `roi-calculator/saas/cac-ltv-roi.html` | CAC vs LTV ROI | legacy hand-authored | inline `<script>` | 4 | 4 | ✅ | ❌ | 17 | Calculate |
| 30 | `roi-calculator/saas/subscription-growth-roi.html` | Subscription Growth ROI | legacy hand-authored | inline `<script>` | 7 | 4 | ✅ | ❌ | 11 | Calculate |
| 31 | `roi-calculator/saas/time-to-value-roi.html` | Time-to-Value ROI | legacy hand-authored | inline `<script>` | 4 | 4 | ❌ | ❌ | 10 | Calculate |
| 32 | `roi-calculator/solar/solar-panel-roi.html` | Solar Panel ROI (v2) | legacy hand-authored | inline `<script>` | 5 | 4 | ✅ | ❌ | 17 | Calculate |
| 33 | `roi-calculator/solar/heat-pump-roi.html` / `ev-charger-roi.html` | Heat Pump / EV Charger ROI | legacy hand-authored | inline `<script>` | 5 each | 4 each | ❌ | ❌ | 10 each | Calculate |

**Structural observation:** there are **four separate calculator implementations living side by side** with no shared code between them:
1. `CalculatorEngine.bind()` — a declarative JSON-formula engine (`calculator-engine.js`) used by the homepage, the 14 factory `/calculators/*` pages, and the real-estate cap-rate calculator.
2. Three bespoke "ecosystem" files (`saas-ecosystem-calculator.js`, `solar-ecosystem-calculator.js`, `rental-ecosystem-calculator.js`) — hand-written, more sophisticated (charts, amortization, escalation), used by exactly one page each.
3. `real-estate-cluster-calculators.js` / `vertical-roi-calculators.js` — small hand-written per-form bindings for cap-rate/cash-on-cash/flip/HVAC/HR.
4. **12 independent inline `&lt;script defer&gt;` blocks**, one per `/roi-calculator/*/*` sub-page, each duplicating its own `parseNum`/`formatMoney`/`formatPct` helpers (only nominally sharing `marketing-calculators.js`, which contains no calculation logic at all — just formatters) and its own from-scratch formula set.

**Only one PDF/download option exists site-wide** (#1, the homepage), and it is not a true PDF: `pdf-export.js` opens a new browser tab via `window.open()`, writes plain HTML into it, and calls `window.print()` — the user must manually choose "Save as PDF" in their OS print dialog. No chart, no styling, no logo is included in the output. Every other calculator (32 of 33) has no export/print/share function of any kind.

**Only 8 of 33 calculators have a chart** (#1, 15, 16, 23, 26, 28, 29, 30, 32 — roughly the newer "ecosystem" calculators and a handful of the legacy ones); the 14 factory calculators and most single-metric real-estate/legacy calculators have none.

---

## 2. User Flow

### Flow: `/` (homepage generic calculator)
Landing → 2 rows of nav chrome → hero → AEO sentence → **Inputs** (3 number fields + 1 checkbox, all pre-filled with sensible defaults 10000/15000/5) → Calculate → **Results** (3 cards + chart, updates live on every keystroke, not just on submit — confirmed via `input`/`change` listeners in `calculator.js:257-267`) → Interpretation (a single auto-generated sentence via `CalculationAnswerBlock`, e.g. "This is a strong return") → Next action (2 inline links to IRR/cap-rate, or Download PDF).
**Evaluation:** This is the most complete flow on the site — live recalculation, an actual interpretation sentence with a qualitative verdict (weak/moderate/strong/very high), a chart, and an export option. The reverse-mode toggle ("Target ROI: calculate required final value") is a genuinely useful, non-obvious feature that most competitor ROI calculators lack.
**Weaknesses:** the "Download PDF" button's actual behavior (opens a print dialog) is not disclosed by its label — see §6. No unit label ambiguity issues found here.

### Flow: `saas/roi-calculator.html`
Landing → hero → **Inputs** (revenue-mode toggle + 3-6 fields depending on mode) → Calculate → **Results** (5 metrics + chart) → "Who should use this?" list → 3 static Q&A blocks → link line.
**Evaluation:** Clean, single calculator-first layout (best-structured page in the inventory per Audit 01 §3). One confusing field: **"Payback (on implementation)"** is labeled ambiguously — a user reading "payback" expects "time until this pays for itself," but the formula only recovers the one-time implementation cost against gross value created, never netting out the ongoing monthly subscription fee that is also being paid during that window (see §4.1 for the numeric proof this understates true payback by ~60%). The label's parenthetical "(on implementation)" is technically accurate but too subtle to prevent the likely misreading.

### Flow: `real-estate/roi-calculator.html`
Landing → hero → a static "Example Rental ROI Calculation" block with its own numbers → **Inputs** (9 fields across 3 rows: price/down/rent, expenses/vacancy/appreciation, years/rate/term) → Calculate → **Results** (4 metrics + chart).
**Evaluation:** 9 inputs is on the high end but each is legitimately needed for a levered rental model (this is not padding). **Confusing/weak element:** the "Example Rental ROI Calculation" block sits *before* the calculator and uses different numbers than the calculator's own defaults ($300k/$2,000 rent/$800 expenses vs. the form's $350k/$2,800/$650) and never mentions financing — see §4.2, this example cannot be reproduced by entering its own numbers into the calculator below it, which actively undermines trust in the tool a user is about to use.
**Unclear terminology:** "Equity gained (at sale)" and "Total profit" are both shown as separate result cards with no indication that they overlap (Equity gained is a subset of Total profit, see §4.2) — a user has no way to know from the UI alone that these numbers are related, not additive.

### Flow: `hr/roi-calculator.html` ("Employee Retention ROI Calculator")
Landing → hero → **Inputs** (headcount, salary, turnover %, hiring cost, weeks vacant) → Calculate → **Results**: "Annual cost of turnover," "Number of exits," "Cost per exit."
**Evaluation — this flow fails its own premise.** The page is titled and marketed as an "ROI Calculator," but there is no investment input anywhere in the form (no "program cost," no "retention initiative budget") and no ROI output. The three results are all *cost* metrics, not a *return*. A user arriving to answer "if I spend $X on a retention program, what's my ROI?" gets no answer — the page can only tell them what turnover currently costs, which is an input to that question, not the answer. See §4.3 and §7.

### Flow: any `/roi-calculator/*/*` sub-page (representative: `cac-ltv-roi.html`)
Landing → H1 → **"When to Use This Calculation" (generic boilerplate, §Audit-02)** → **"Limitations of This Metric" (generic boilerplate)** → **"What Is ROI (Return on Investment)?" (generic boilerplate)** → *only now* the calculator (`cac-ltv-roi.html:117`) → Results + chart → 5 more H2 sections of explanation (LTV Formula, Margin-Adjusted LTV, Why 3:1 Is a Benchmark, Example, Risk of Churn, Interpretation Guidance) → FAQ (4 items) → Related links.
**Evaluation:** This is the clearest "content page with a calculator embedded inside it" pattern on the site, confirmed structurally (not just by impression): **three full boilerplate sections must be scrolled past before the first input field appears**, and this is not a one-off — the same three-heading preamble (`h2` "When to Use This Calculation" / "Limitations of This Metric" / "What Is ROI") precedes the calculator on all 12 `/roi-calculator/*/*` sub-pages that carry it (confirmed in Audit 02 §3.2-3.3, 31 and 30 pages respectively). Excessive explanation clearly occurs **before** calculation here, not after.

### Cross-cutting flow findings
- **Unnecessary/weak default:** `calculators/roi-calculator-example.html` defaults to `initial=10000, final=15000` — identical to the homepage's default scenario — reinforcing Audit 01/02's finding that this page has no distinct identity even in its example data.
- **Unclear units:** several factory calculators mix implicit units without stating them in the label — e.g. `content-marketing-roi-calculator.html`'s `winRate` field defaults to `0.22` (a decimal, i.e. 22%) but the input has no `%` affordance or helper text distinguishing it from the other percentage-like fields on the same page that *are* entered as whole numbers (e.g., `roas-calculator.html`'s margin field is entered as `50` meaning 50%). This inconsistency (some percent fields expect `0-100`, one expects `0-1`) is a real source of user error risk across the calculator set, not just a labeling nitpick — entering "22" instead of "0.22" in that field would silently produce a result 100x too high with no validation catching it (see §4.4).
- **Excessive explanation after calculation:** the homepage (11 content blocks after the calculator, per Audit 01 §4) is the worst offender for post-calculation bloat; most vertical calculators are more disciplined here (1-3 blocks after results).

---

## 3. Results — "What did I get / What does it mean / What should I do next?"

| Calculator | What did I get? | What does it mean? | What should I do next? | Secondary metrics competing with primary? |
|---|---|---|---|---|
| Homepage | ✅ ROI/Annualized/Profit cards | ✅ auto-generated verdict sentence (weak/moderate/strong/very high) | ✅ 2 contextual links (IRR, cap rate) | No — ROI is visually primary, annualized and profit are clearly secondary in the grid |
| SaaS calculator | ✅ 5 metrics | ⚠️ no verdict sentence; user must interpret 127% ROI themselves | ⚠️ only generic "who should use this" list, no scenario-specific next step | **Yes** — ROI %, Annual value, Total cost, Net profit, and Payback are shown as 5 equal-weight cards with no visual hierarchy distinguishing the headline metric (ROI) from supporting ones |
| Rental property calculator | ✅ 4 metrics | ❌ no interpretation text at all | ❌ only a generic link line | **Yes** — ROI, Annual cash flow, Total profit, Equity gained shown as 4 equal cards; as noted in §2, two of these (Total profit, Equity gained) are mathematically overlapping quantities presented as if independent |
| Solar calculator | ✅ 6 metrics (payback, ROI-20yr, ROI-lifetime, savings-20yr, savings-lifetime, annual savings) | ⚠️ a methodology note explains the 20-yr/lifetime split, but no verdict on whether the result is *good* | ❌ no next-step link | **Yes, most severe case on the site** — 6 result values with no visual primary; a first-time user cannot tell at a glance whether "Payback: 8.2 yr" or "ROI (lifetime): 340%" is the number they should anchor on |
| HVAC calculator | ✅ 3 metrics (payback, annual savings, % saved) | ❌ no verdict | ❌ none | No — 3 metrics is a manageable set with payback clearly first |
| HR "retention ROI" | ✅ 3 metrics, but see §2 — none of them is actually an ROI | ❌ none | ❌ none | N/A — the deeper problem here is the metric set doesn't answer the page's own promised question |
| ROAS / Email / Lead-gen (legacy inline calculators) | ✅ 3-4 metrics | ✅ **best interpretation layer on the site** — a plain-English verdict sentence ("Campaign is profitable... consider A/B tests on subject lines and creative to improve open and conversion rates") | ✅ the verdict sentence itself contains the next action | No — revenue/ROI/profit shown together but the interpretation sentence anchors attention correctly |
| Factory `/calculators/*` pages (14 pages) | ✅ but often only 1 output (ROI %) | ❌ none — no interpretation text anywhere in `templates/article-template.html`'s results panel | ❌ none | No (too few metrics to compete), but the flip side is these results are *under*-explained — a bare "ROI: 30%" with no verdict, no benchmark comparison, nothing |

**Finding:** the three inline marketing calculators (ROAS, email marketing, lead generation) under `/roi-calculator/marketing/` have the single best "interpretation" implementation on the entire site — a real, scenario-aware verdict sentence — despite living on the pages Audit 02 identified as carrying the heaviest generic-boilerplate load. The "best content page" and "best calculator interpretation" do not currently live on the same pages; fixing the boilerplate-preamble problem without losing this interpretation layer is the correct target state (see §7's redesign-prototype recommendation).

---

## 4. Mathematical Audit (traced formulas + controlled test cases)

### 4.1 SaaS calculator — payback formula does not net out the ongoing subscription cost (defect)
File: `assets/js/saas-ecosystem-calculator.js:89-91`
```
var monthlyValue = annualValue / 12;
var paybackMonths = implementation > 0 && monthlyValue > 0 ? implementation / monthlyValue : ...
```
**Test case (page defaults):** employees=25, wage=$42, hours/week=1.5, monthly cost=$2,500, implementation=$18,000, years=3.
- `annualValue` = 25 × 42 × 1.5 × 52 = **$81,900**
- `monthlyValue` = 81,900 / 12 = **$6,825**
- Reported payback = 18,000 / 6,825 = **2.64 months**

But the business is *also* paying $2,500/month in subscription fees during that window. The actual time to recover the $18,000 implementation cost from *net* monthly gain (value created minus the recurring cost required to keep creating it) is:
- Net monthly gain = 6,825 − 2,500 = **$4,325**
- True payback = 18,000 / 4,325 = **4.16 months**

The displayed figure (2.64 months) understates true payback by **~37%** in this scenario, and the gap widens as `monthly` grows relative to `annualValue`. The on-page methodology note (`saas/roi-calculator.html:97`) does state "Payback = implementation ÷ (annual value ÷ 12)," so the *formula* matches its own documentation — but the documented formula itself is the defect: "payback" conventionally means time to recover total cost, and a reader is highly likely to interpret "Payback (on implementation)" as "how soon does this pay for itself," which this number does not answer.
**Classification: mathematical inconsistency (formula legitimately computes something other than what "payback" implies).**

### 4.2 Rental property calculator — worked example is disconnected from the calculator's own mechanics
File: `real-estate/roi-calculator.html:80-85` (example block) vs. `assets/js/rental-ecosystem-calculator.js` (actual engine).
The page's static example reads: *"A $300,000 property generating $2,000/month in rent with $800 monthly expenses produces $14,400 annual cash flow. Over 5 years, including appreciation, ROI can exceed 50%..."*
$14,400/year = ($2,000 − $800) × 12 — this arithmetic implicitly assumes **no mortgage payment at all** (an all-cash purchase). But run the same $300k/$2,000/$800 scenario through the actual calculator with its own default down payment ($70,000, i.e. a $230,000 loan) and default 6.5%/30yr financing:
- Monthly P&I on $230,000 at 6.5%/30yr ≈ **$1,454**
- Effective rent after default 5% vacancy = 2,000 × 0.95 = **$1,900**
- Monthly cash flow = 1,900 − 800 − 1,454 = **−$354/month** (negative)
This is the opposite sign of the example's claimed "$14,400 annual" positive cash flow, and nowhere near "ROI can exceed 50%." A user who tries to verify the homepage-adjacent example by entering its numbers into the actual tool will get a materially different, negative result.
**Classification: misleading illustrative content — not a code bug, but a factual inconsistency between marketing copy and the calculator's real behavior, which is a direct trust issue (§6).**

Separately, confirmed by tracing the formulas: **rent and operating expenses are held flat for the entire holding period** (`annualCF` is computed once and multiplied by `years` in `rental-ecosystem-calculator.js:78`) while **property value compounds at the appreciation rate every year** (`Math.pow(1+app, years)`). No rent-growth input exists on the page. This is an internally inconsistent economic assumption (real rents and real property values are correlated over multi-year holds) that is never disclosed in the page's own methodology note (`rp-calc-note`, `real-estate/roi-calculator.html:92`) — it states the formulas but not this assumption. For long hold periods (7-10yr+) this will understate cash-flow-driven ROI in a way the user cannot detect from the UI.

### 4.3 HR "Employee Retention ROI Calculator" — does not compute an ROI
File: `assets/js/vertical-roi-calculators.js:57-89`
Formulas traced: `exits = turnoverRate × headcount`; `vacancyCostPerExit = (weeksVacant/52) × salary`; `annualAddressable = exits × (hiringCost + vacancyCostPerExit)`.
**Test case:** headcount=200, salary=$65,000, turnover=18%, hiring cost=$4,800, weeks vacant=6.
- exits = 0.18 × 200 = **36**
- vacancyCostPerExit = (6/52) × 65,000 = **$7,500**
- annualAddressable = 36 × (4,800 + 7,500) = **$442,800**
All three outputs (`hr-result-saved`, `hr-result-exits`, `hr-result-per`) are variations on "cost of turnover." There is no field for the cost of a proposed retention program and no ROI formula anywhere in this function. **This is not a math error (the turnover-cost arithmetic is correct) — it is a product/naming defect:** the page is titled and marketed sitewide as "Employee Retention ROI Calculator" (nav, footer, `hr/roi-calculator.html` title tag) but functions as a "Cost of Turnover Calculator." A user cannot get an ROI answer from this page under any inputs.
**Classification: E-level conflicting duplication between page name/promise and actual function — the single clearest case on the site of "content page/calculator mismatch" named in this audit's primary question.**

### 4.4 Equipment ROI calculator (factory) — missing the one output the inputs were built for
File: `data/calculators.json`, slug `equipment-roi-calculator`.
Formulas: `netAnnualBenefit = annualGrossBenefit − annualOperatingCost`; `roi = capex > 0 ? (netAnnualBenefit / capex) × 100 : 0`.
**Test case (defaults):** capex=$120,000, annual gross benefit=$42,000, annual operating cost=$6,000.
- netAnnualBenefit = 42,000 − 6,000 = **$36,000**
- roi = 36,000 / 120,000 × 100 = **30%** (labeled "Annual return on cost (%)")
Both correct as computed. But `capex` and `netAnnualBenefit` are exactly the two numbers needed to compute **payback period** (120,000 / 36,000 = 3.3 years) — the single most natural question for a capex/equipment decision — and it is never calculated or shown. The calculator also has no lifespan input, so the 30% figure is presented as *the* ROI with no indication of whether it is a one-year snapshot or compounds; for equipment with, say, a 10-year life, cumulative undiscounted return would be closer to 300%, a figure never surfaced, leaving "30% ROI" open to misreading as the total return rather than an annual rate.
**Classification: incomplete calculation relative to its own inputs, not an arithmetic error.**

### 4.5 Percent-field unit inconsistency (cross-calculator)
`content-marketing-roi-calculator.html`'s `winRate` input defaults to and expects **`0.22`** (a fraction) — confirmed in `data/calculators.json`: `"winRate": 0.22` and formula `qualifiedLeads * avgDealValue * winRate` (no `/100` division, unlike every other percent-like field on the site, e.g. `roas-calculator.html`'s margin field which does `m/100` in `marketing-calculators.js`-adjacent inline code). There is no `%` symbol, helper text, or `min`/`max`/`step` hinting at the 0-1 range on the input itself.
**Test case:** if a user, trained by every other calculator on the site to enter percentages as whole numbers, types `22` instead of `0.22`:
- Intended: 95 × 12,000 × 0.22 = $250,800 expected revenue
- Actual with `22` entered: 95 × 12,000 × 22 = **$25,080,000** — a 100x inflated result with no validation to catch it (no `max` attribute constrains this field; confirmed no upper bound is set for `winRate` in the JSON input spec).
**Classification: genuine input-validation/labeling defect with a concrete, reproducible failure mode**, not a hypothetical.

### 4.6 Formulas verified correct (spot-checked with test cases, no issues found)
- **Homepage** (`calculator.js`): ROI, annualized ROI (including the `finalValue ≤ 0 → -100%` floor and reverse-mode inversion) all check out arithmetically; chart (`chart-config.js`) recomputes the same annualized rate independently and produces a consistent curve.
- **Solar calculator** (`solar-ecosystem-calculator.js`): escalating-savings series, cumulative-through-year summation, and the fractional-year payback interpolation (`paybackYears`) were traced and re-derived by hand — correct standard methodology, correctly implemented, including edge cases (net cost ≤ 0 → 0-year payback; zero year-1 savings → "—" not a divide-by-zero).
- **Rental amortization** (`rental-ecosystem-calculator.js`): both the standard mortgage-payment formula and the remaining-balance formula match the textbook closed-form equations exactly; re-derivation with the page's own defaults (see §4.2) confirms correct implementation (the *defect* found there is a disclosure/consistency issue, not an arithmetic error in the amortization math itself).
- **HVAC calculator**: `annualSave = bill × (1 − eOld/eNew)` is the correct standard formula for bill savings when moving from one efficiency rating to another holding load constant; validated with oldPct=80/newPct=95/bill=$3,000 → $474/yr savings, consistent with expected magnitude.
- **CAC:LTV, cash-on-cash, flip ROI, cap rate, ROAS, email marketing, lead generation** (all inline/cluster calculators): each traced formula matches its standard textbook definition; no arithmetic defects found in any of these seven.
- **All 14 factory `/calculators/*` JSON formulas**: simple `(benefit − cost)/cost × 100` arithmetic, verified correct in every case (see §4.4's finding, which is about a *missing* output, not an incorrect one).

---

## 5. Information Hierarchy Inside Calculators

Ideal order per the audit brief: *What this calculates → Inputs → Calculate → Results → Interpretation → Method/assumptions → Optional deeper info.*

| Calculator group | Actual order | Deviation |
|---|---|---|
| Homepage | Hero → AEO sentence → **Inputs** → Calculate → Results → Interpretation sentence → (heavy deep-info afterward, Audit 01 §4) | Matches the ideal up through Interpretation; over-provides "optional deeper info" (11 blocks) |
| `saas/roi-calculator.html`, `real-estate/roi-calculator.html`, `solar/roi-calculator.html` | Hero (± one example/methodology block) → **Inputs** → Calculate → Results → (no interpretation) → light deep-info | Calculator reached quickly; **missing the Interpretation step entirely** — jumps straight from Results to deep-info/links |
| 14 factory `/calculators/*` pages | H1 → one-line quick-answer → **Inputs** → Calculate → Results → 2 short static blocks → FAQ → links | Matches structure well, but again **no interpretation step** between Results and the static blocks |
| **12 `/roi-calculator/*/*` legacy pages** | H1 → "When to Use This Calculation" → "Limitations of This Metric" → "What Is ROI?" → **only then Inputs** → Calculate → Results → 5-8 more explanation sections → FAQ | **Structural violation**: three full sections of generic content precede the calculator, reversing steps 1 and 7 of the ideal order (deep/generic info is placed *before* the calculator rather than as optional material after it) |
| ROAS/Email/Lead-gen legacy pages | Same violated preamble as above, **but** uniquely include a real Interpretation step after Results | Best "post-calculation" hierarchy on the site, worst "pre-calculation" hierarchy — the two halves of the same page pull in opposite directions |

**Summary flag:** 12 of 33 calculators (all of `/roi-calculator/*/*`) place three generic, non-calculator-specific sections between the page's H1 and its first input field. This is the most consistent, mechanically-verifiable violation of the requested information hierarchy in the entire inventory.

---

## 6. Trust

**Transparency of assumptions — inconsistent.** The solar and SaaS calculators both surface a genuine methodology note directly above/near the form (`sp-horizon-note`, `saas/roi-calculator.html:97`). The rental calculator has a methodology note but it omits the flat-rent assumption that materially affects results (§4.2). The factory `/calculators/*` pages and most `/roi-calculator/*/*` pages have no assumptions statement anywhere near the form itself (assumptions, if present at all, are buried in prose sections after the results).

**Formula visibility — good on the pages that try.** The homepage explicitly prints its ROI formula (`aeo-raw` hidden text + visible article section). Several legacy pages print "LTV Formula," "Payback Formula," etc. as their own H2 sections. This is a genuine strength where it's done.

**Privacy messaging — strong and consistent.** "No cookies, no tracking" appears in the header on every page and is accurate: all calculation happens client-side (`safeEval`/`new Function` runs in-browser; no network calls observed in any calculator JS). This is a real, verifiable trust asset.

**Limitations — present but generic.** Every page carrying the `.limitations-block` states the same three bullets regardless of calculator (Audit 02 §3.3); none of the calculator-specific limitations found in this audit (SaaS payback scope, rental flat-rent assumption, equipment's missing payback) are disclosed anywhere on their respective pages.

**Benchmark claims — mostly hedged appropriately** ("many businesses target payback under 18 months," "often cited," "illustrative ranges") — this audit did not find fabricated or falsely-precise benchmark numbers, only the previously-flagged misleading *worked example* on the rental calculator (§4.2), which is a bigger trust risk than the benchmark tables because it purports to demonstrate the tool's own output rather than cite external data.

**Unexplained defaults.** `content-marketing-roi-calculator.html`'s `winRate: 0.22` default (§4.5) is presented with no unit indicator, which is both a usability defect and a trust issue — a careful user has no way to confirm they're reading the field correctly.

**Potentially misleading statements, ranked by severity:**
1. **"Download PDF"** (homepage) — implies a file download; actually opens a browser print dialog with unstyled plain text and no chart. Not a lie, but the label overpromises the mechanism.
2. **Rental property worked example** (§4.2) — actively contradicts what the calculator itself computes for similar inputs.
3. **"Employee Retention ROI Calculator"** naming (§4.3) — the strongest case of a page's title promising an answer (a return on a retention investment) that the tool structurally cannot produce.
4. **"Payback (on implementation)"** on the SaaS calculator — technically correctly labeled, but the parenthetical is easy to miss and the resulting number reads as full payback to a skimming user (§4.1).

---

## 7. Final Ranking

**A — Excellent foundation**
- **Homepage generic calculator** (`/`) — correct math, live recalculation, reverse-mode, chart, interpretation sentence, (weak) export. The most complete UX/logic pairing on the site.
- **Solar ROI Calculator** (`solar/roi-calculator.html`) — the most mathematically sophisticated calculator on the site (escalating savings, tax credit, dual 20yr/lifetime horizons, correct fractional-year payback), let down only by having 6 competing result cards with no visual primary (§3) and no interpretation sentence.
- **ROAS / Email Marketing / Lead Generation calculators** (`roi-calculator/marketing/*.html`) — correct math *and* the best "what should I do next" interpretation layer on the site; held back only by the boilerplate preamble (§5) that isn't these files' own fault (it's templating, not calculator logic).

**B — Good but needs UX work**
- **SaaS ROI Calculator** (`saas/roi-calculator.html`) — correct architecture, clean page, but has the payback-formula scope issue (§4.1) and no interpretation sentence/visual hierarchy among its 5 results.
- **Rental Property ROI Calculator** (`real-estate/roi-calculator.html`) — solid amortization math, undermined by the disconnected worked example (§4.2) and undisclosed flat-rent assumption.
- **Cap rate / cash-on-cash / flip ROI** (`real-estate/*.html`) — correct, simple, appropriately scoped; would benefit from an interpretation sentence and cross-links to when to use each metric (already covered elsewhere per Audit 02, just not linked from the results panel itself).
- **HVAC calculator** — correct, appropriately simple, no interpretation but the 3-metric result set is small enough not to need one urgently.
- **CAC vs LTV, Subscription Growth, Time-to-Value calculators** (`roi-calculator/saas/*.html`) — correct math, good charts on 2 of 3, but buried behind the same 3-section boilerplate preamble as the rest of the legacy tree.

**C — Structural redesign needed**
- **All 14 factory `/calculators/*` pages** — not because the math is wrong (it isn't) but because each is a bare 2-input/1-output form with zero interpretation, zero chart, and — per Audit 01/02 — 3-4 of them are functionally identical to each other. The template itself (`templates/article-template.html`) needs an interpretation-sentence slot before these individually improve.
- **The 9 remaining `/roi-calculator/*/*` legacy pages not already listed under A/B** (`roi-calculator/real-estate/rental-property-roi.html`, `cash-on-cash-return.html`, `fix-and-flip-roi.html`; `roi-calculator/solar/solar-panel-roi.html`, `heat-pump-roi.html`, `ev-charger-roi.html`) — correct-enough math but structurally the worst information hierarchy on the site (§5: three boilerplate sections before any input), and per Audit 02 several are near-duplicates of calculators already ranked A/B above.

**D — Should be reconsidered**
- **`hr/roi-calculator.html` ("Employee Retention ROI Calculator")** — the only calculator in the inventory whose core promise (an ROI) is structurally unanswerable by its own inputs and formulas (§4.3). This needs either a genuine rework (add a retention-program-cost input and compute an actual ROI against reduced turnover) or a rename to what it actually is ("Cost of Employee Turnover Calculator").
- **`calculators/roi-calculator-example.html`** (and, tied for this slot, `simple-roi-calculator.html` / `free-roi-calculator.html`) — not because any one is broken, but because as a set of three they are the same calculator wearing three names (confirmed in Audits 01-02); no amount of individual UX polish resolves this without the consolidation already recommended.

### Direct answers to the closing questions
- **Best current calculator:** the **homepage generic ROI calculator** — it is the only one that combines correct math, live feedback, a chart, an interpretation sentence, *and* an export option in one place.
- **Worst current calculator:** **`hr/roi-calculator.html`** — the only calculator on the site that cannot answer the question its own name and marketing promise ask of it.
- **Best template:** the **`saas-ecosystem-calculator.js` / `solar-ecosystem-calculator.js` pattern** (bespoke hand-written JS bound to a single clean HTML structure, methodology note near the form, chart included) — this is the pattern to standardize on, not the JSON-declarative factory template and not the 12 independent inline-script pages.
- **Worst template:** the **`/roi-calculator/*/*` inline-script + 3-section-boilerplate-preamble pattern** — worst information hierarchy (§5), no shared/tested calculation code (12 independent hand-rolled scripts, §1), and per Audit 02 the pages most likely to be merged away entirely.
- **Best candidate for a redesign prototype:** **the SaaS vertical** (`saas/roi-calculator.html`), for the same reason Audit 01 recommended it as the first IA-consolidation target — it already has the cleanest layout and correct-enough math (one fixable formula issue, §4.1), so a redesign prototype here would need to (a) fix the payback formula, (b) add a visual-hierarchy pass distinguishing the headline ROI metric from its 4 supporting numbers, and (c) add an interpretation sentence modeled on the ROAS/email-marketing pattern already proven elsewhere on the site — all changes that are directly reusable as the template for real estate, solar, and marketing once validated.

---

*End of Audit 03. No files were modified in the preparation of this report.*
