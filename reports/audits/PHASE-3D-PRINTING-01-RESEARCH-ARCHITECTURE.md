# Phase 1 — 3D Printing Calculator Cluster: Research + Architecture

**STATUS: RESEARCH + ARCHITECTURE ONLY. No production files were created or modified. The repository is functionally unchanged.**

This report is the sole deliverable of this phase. It defines the reference financial architecture for the first calculator in the approved 3D Printing Calculator Cluster and the boundaries for the four calculators that follow it. It contains fixed, final proposed copy for Phase 2's implementation.

---

## 1. Executive Recommendation

Build **"3D Printing Business ROI Calculator"** at `/3d-printing/roi-calculator.html` as a new primary vertical (mirroring the site's proven Solar pattern), hand-authored (not factory-generated), targeting a **single-printer or very-small (1–2 printer) marketplace seller** who already owns a printer and needs to know two things: *is this actually profitable, and when does the printer pay for itself*. The dominant result is **24-month ROI**, with payback period, monthly operating profit, profit per successful print, and break-even units/month as four supporting metrics. The core differentiation is financial rigor competitors lack: failure rate correctly inflates the *full* per-attempt cost (not just material), and payback/ROI are computed on a cash-flow basis that never double-counts the printer purchase. This report supplies exact formulas, exact defaults with an independently verified manual calculation, exact page copy, and an explicit boundary map for the four future cluster calculators so Phase 1's design does not foreclose them.

**A note on the competitor list supplied in the brief:** CalcCorp, MakerGauge, "Mesh Minter," Creative3DP Tools (as named), SpoolCost, and "3D Print Calcs" were checked against current search results. Only **Creative3DP Tools** resolves to a real, current product (`tools.creative3dp.com`); the other four names returned no matching current product in search. Per the brief's own instruction not to assume the suggested list is current, this report substitutes verified, currently-live competitors found through research (Section 2).

---

## 2. Competitive Landscape (current, verified research — August/2026 web state)

Nine tools were inspected in enough depth to extract inputs/outputs/cost treatment; all others found in search are long-tail variants of the same two archetypes described below.

| Tool | URL | Archetype | Target user | ROI/Payback? | Key gap or strength |
|---|---|---|---|---|---|
| PrintPal | printpal.io/tools/3d-print-cost-calculator | Per-print material-cost tool | Hobbyist, casual seller | No | Failure rate applied as a flat % markup on *total* cost (close to correct); no labor, no fees |
| Prusa Price Calculator | blog.prusa3d.com | Per-job pricing tool from a major printer OEM | On-demand print service providers | No | g-code upload auto-fills time/weight; electricity is optional (a real weakness — undervalues a genuine cost); repair-budget % substitutes for a failure-rate model; markup-only (no margin shown) |
| GrandpaCAD 3D Printing Business Calculator | grandpacad.com/en/tools/3d-printing-business-calculator | Full business-economics model | Small print-farm operators, serious side-hustlers | Yes — break-even month, 24-month cumulative cash, 24-month ROI% | Most sophisticated competitor found. Treats printer purchase as a pure day-one sunk cash cost with **no depreciation schedule at all** — simpler, but loses a true fully-loaded per-print cost. 18+ input fields with no progressive disclosure; no sensitivity/scenario comparison |
| LayerMath | layermath.com | Print-farm cost/profitability platform | 1–10 printer farm operators | Not confirmed in available content | Depreciation = cost ÷ lifespan hours (hour-based, clean); explicit overhead-per-hour allocation section; batch-labor economics (cost per unit falls 60–80% in batches) |
| Chart Atlas Print Profit Calculator | chartatlas.com/calculators/print-profit | General profit/pricing tool | 3D-printing entrepreneurs and hobbyists | Yes — payback period, break-even units | Depreciation, energy, labor, platform fees, and reject allowance all present; page loads calculator dynamically with no visible fallback content (an SEO/accessibility weakness); no stated benchmark context |
| UseACalculator "Is 3D Printing Profitable" | useacalculator.com/side-hustles/is-3d-printing-profitable | Side-hustle profitability + tax | Side-hustle sellers evaluating a second printer or a price change | No formal ROI/payback; scenario comparison instead | Best **content architecture** found: calculator → "What this does" methodology → "When should you use this" → narrative example → FAQ → related tools. Includes self-employment tax (adds real value for this audience but real jurisdiction complexity). Failure rate modeled as a flat multiplier on material cost only (same limitation as PrintPal) |
| Creative3DP Tools | tools.creative3dp.com | Free multi-tool suite incl. print-time estimator | Makers, "no login, no upsells" positioning | No | STL-upload print-time/weight estimator *without full slicing* — a genuinely differentiated file-based feature; no business/ROI framing at all |
| Ultimate Finance Calculator — "3D Print Service Pricing Calculator" | ultimatefinancecalculator.com/calculators/3d-print-service-pricing-calculator | Per-job pricing tool | Print-for-hire service providers | No | **Direct name collision** with the cluster's planned calculator #3 — must be differentiated on substance, not just avoided by name |
| Omnicalculator 3D Printing Cost | omnicalculator.com/other/3d-printing | Generic material+labor cost split | General public | No | High-authority domain, thin/generic — a good example of the "doorway-shaped" pattern to avoid replicating |

**Researched fact vs. convention vs. assumption, made explicit:**
- **Researched fact:** US national average residential electricity rate was **18.44¢/kWh** as of August 2026 (U.S. Energy Information Administration, via aggregated current reporting). Source: EIA data as reported in current electricity-rate tracking sites, cross-checked across three independent aggregators citing the same EIA series (chooseenergy.com, electricityrateperkwh.com, and others), all converging on the 17.9–18.8¢ range for mid-to-late 2026.
- **Researched fact:** Etsy's published seller transaction fee is 6.5% of the order total (cited consistently across siraya.tech and multiple calculator defaults); payment processing is typically an additional ~3% (industry-standard card-processing convention, not Etsy-specific).
- **Industry convention (multiple independent sources, not a single authority):** failure/reprint rate for desktop FDM commonly modeled in the 5–15% range; single-printer side-business payback commonly cited at 6–18 months; gross margin per job commonly cited at 30–60%.
- **Modeling assumption (this report's own choice, not researched or competitor-standard):** treating all labor as "per-attempt" rather than splitting per-attempt vs. per-success labor; treating failed prints as having zero recoverable material value; using a single combined labor-time field rather than Prusa's two-field (prep/post-processing) split.

---

## 3. Primary Audience

**Selected: (C) Single-printer (or 1–2 printer) marketplace/Etsy-style seller who already owns a printer and is actively selling.**

Rejected alternatives and why: (A) a pre-purchase hobbyist's job is "should I buy a printer at all," which is calculator #5's job, not #1's; (B)/(D) a full small business or print farm's job centers on fleet/scaling decisions, which is calculator #2's job; (E)/(G)/(H) service bureaus, architectural studios, and prototyping businesses have B2B quoting jobs closer to calculator #3; (F) model/diorama makers are typically non-commercial and outside this cluster's monetization framing entirely.

- **Why commercially useful:** every sophisticated competitor found (GrandpaCAD, LayerMath, Chart Atlas, UseACalculator, siraya.tech's own article) targets exactly this population — a large, active, currently-underserved-by-rigor segment (most tools serving it are either too simple, per Section 2, or too complex).
- **Decision they are trying to make:** "Is my 3D-printing side income actually profitable once every cost is counted, and when does my printer pay for itself?"
- **What they realistically know:** printer purchase price, roughly what they charge per item, roughly how many items they sell per month, their marketplace's published fee %, roughly how long a print takes.
- **What they are unlikely to know precisely:** true electricity cost per print (must be derived from wattage × rate, not looked up), true failure/reprint rate (must be estimated, not measured), fully-loaded labor cost per print (routinely uncounted), and the correct depreciation treatment of their printer.
- **What the calculator must ask:** printer price, useful life, average selling price, monthly units sold, material cost inputs, print time, printer wattage, electricity rate, failure rate, labor time + rate, platform fee %, payment-processing fee %, shipping/packaging cost, optional monthly fixed costs.
- **What it must NOT ask:** fleet/printer-count configuration (calculator #2's job), STL/G-code upload (a Section 16 future-integration item, not obtainable today without a major architecture change), income/self-employment tax (real jurisdiction complexity that would need its own careful phase — UseACalculator includes it, we deliberately do not, see Section 15 limitations), multi-product catalog input (calculator #4's job).

---

## 4. Primary Job-to-Be-Done

**Selected: "Will my 3D-printing operation be profitable, and when does my printer investment pay back?"** — a combined monthly-profitability + payback + ROI job, expressed as a single dominant ROI figure per this site's established sitewide pattern (every existing vertical's dominant result is a single % or time figure with a plain-language interpretation sentence).

"How much does each print cost" and "how much should I charge" are correctly answered as **secondary/supporting outputs** (profit per successful print; the selling-price input itself, with margin/markup shown as derived context) — not separate primary questions, per the brief's explicit instruction not to stuff five calculators into one form.

---

## 5. Calculator Scope (what Phase 1's single calculator does and does not do)

**In scope:** single "average item" unit economics (one representative print, not a multi-product catalog); single-printer or informally-shared 1–2 printer ownership; monthly steady-state volume as a direct input (not fleet-hour-derived capacity); US-dollar-denominated defaults with fully editable, internationally-usable inputs.

**Explicitly out of scope (deferred to specific future cluster calculators, see Section 15):** multi-printer fleet/utilization-ramp modeling (#2), single-job price-quoting from a specific job's specs (#3), multi-product catalog margin comparison (#4), pre-purchase printer comparison shopping (#5), income/self-employment tax, STL/G-code file upload.

---

## 6. Input Specification

| Input | Label (proposed) | Units | Default | Source of default |
|---|---|---|---|---|
| Printer purchase price | Printer cost ($) | USD | 400 | Mid-range prosumer FDM printer, consistent with the $200–$1,000 hobby-grade range cited by siraya.tech and GrandpaCAD's $600 example |
| Setup cost | Setup cost ($) | USD | 50 | Small, optional allowance for initial tools/spool buffer |
| Useful life | Useful life (hours) | hours | 2,500 | Convention range used by PrintPal/LayerMath (2,000–3,000 hrs) |
| Residual value | Residual value ($) | USD | 0 | Conservative; heavily-used desktop FDM printers have negligible resale value |
| Average selling price | Average selling price ($/print) | USD | 28 | Representative small marketplace item |
| Monthly units sold | Units sold per month | count | 20 | Modest, believable side-business volume (~1 print sold every 1–2 days) |
| Filament price | Filament price ($/kg) | USD/kg | 22 | Standard PLA/PETG range |
| Material per print | Material used (g) | grams | 35 | Small-to-medium item |
| Print time | Print time (hours) | hours | 3 | Representative single-item print |
| Printer wattage | Printer power draw (W) | watts | 150 | Typical desktop FDM, per PrintPal's own guidance |
| Electricity rate | Electricity rate ($/kWh) | USD/kWh | 0.18 | EIA US national residential average, Aug 2026 (Section 2) — **editable, with an inline note that this varies by region/country** |
| Failure rate | Failure/reprint rate (%) | % | 8 | Within the 5–15% convention range |
| Labor time | Hands-on labor per print (min) | minutes | 15 | Single combined field: setup + removal + basic packaging |
| Labor rate | Labor value ($/hour) | USD/hour | 18 | Self-value/opportunity-cost rate, not minimum wage or professional rate |
| Platform fee | Marketplace fee (%) | % | 6.5 | Etsy's published transaction fee (Section 2), used only to inform the default — field itself is generic |
| Payment processing fee | Payment processing fee (%) | % | 3 | Standard card-processing convention |
| Shipping & packaging | Shipping & packaging ($/order) | USD | 4.50 | Representative small-parcel cost |
| Monthly fixed costs | Other monthly costs ($, optional) | USD | 35 | Software/storage/misc small buffer |

All numeric inputs use HTML5 `min="0"` (and `max="99"` on failure rate), matching the sitewide convention already established on every existing calculator on this site.

---

## 7. Output Specification

**Dominant result: 24-Month ROI** (see Section 11 for the horizon justification).

**Four supporting metrics:**
1. Payback Period
2. Monthly Operating Profit
3. Profit per Successful Print
4. Break-Even Units/Month

**Secondary/contextual figures shown near the dominant result, not competing with it:** 12-Month ROI, 36-Month ROI, Gross Margin %, Markup %.

---

## 8. Financial Formulas (exact, with units, edge cases, and standard/assumption labeling)

### 8.1 Per-attempt base cost (before failure correction)
```
materialCost   = (filamentPricePerKg / 1000) × materialGrams          [USD]
electricityCost = (printerWattage / 1000) × printTimeHours × electricityRate   [USD]  — INDUSTRY-STANDARD formula (watts→kW × hours × rate)
depreciationCost = ((printerPrice + setupCost − residualValue) / usefulLifeHours) × printTimeHours   [USD]  — MODELING CONVENTION (straight-line, hours-based; matches LayerMath/PrintPal)
laborCost = (laborMinutes / 60) × laborRate                            [USD]

attemptCost = materialCost + electricityCost + depreciationCost + laborCost
```
**Assumption, explicitly disclosed:** all four cost components are treated as "per-attempt" (i.e., all inflate under failure — Section 9). This is a deliberate simplification; the more granular alternative (splitting labor into per-attempt setup/monitoring vs. per-success packaging) was considered and rejected for Phase 1 to keep the input form to a single labor field, per the brief's explicit instruction against enterprise-level time accounting.

### 8.2 Failure-corrected cost per successful print
```
costPerSuccess = attemptCost / (1 − failureRate)      [USD]     — where failureRate is a fraction (0.08, not 8)
```
**Edge case:** if `failureRate >= 1` (100%+), this formula divides by zero or a negative number. Guarded explicitly (Section 12) — never allowed to reach the DOM as `Infinity`.

**Manual verification at defaults** (failureRate = 0.08):
```
materialCost     = (22/1000) × 35 = $0.770
electricityCost  = (150/1000) × 3 × 0.18 = $0.081
depreciationCost = ((400+50−0)/2500) × 3 = (450/2500) × 3 = $0.540
laborCost        = (15/60) × 18 = $4.500
attemptCost      = 0.770+0.081+0.540+4.500 = $5.891
costPerSuccess   = 5.891 / (1 − 0.08) = 5.891 / 0.92 = $6.403
```

### 8.3 Total cost per successful, sold print (adds per-order costs)
```
feeCost = sellingPrice × (platformFeePct + paymentFeePct)      [USD]
totalCostPerPrint = costPerSuccess + shippingPackaging + feeCost
```
Manual verification: `feeCost = 28 × (0.065+0.03) = 28 × 0.095 = $2.660`
`totalCostPerPrint = 6.403 + 4.50 + 2.660 = $13.563`

### 8.4 Profit, margin, markup (Section 10)
```
profitPerPrint = sellingPrice − totalCostPerPrint
grossMarginPct = (profitPerPrint / sellingPrice) × 100      — STANDARD DEFINITION
markupPct      = (profitPerPrint / totalCostPerPrint) × 100  — STANDARD DEFINITION
```
Manual verification: `profitPerPrint = 28 − 13.563 = $14.437`
`grossMarginPct = 14.437/28×100 = 51.6%`
`markupPct = 14.437/13.563×100 = 106.4%`
(Confirms the required distinction: a 106% markup here corresponds to only a 51.6% margin — never the same number.)

### 8.5 Monthly economics
```
monthlyRevenue        = sellingPrice × unitsPerMonth
monthlyVariableCost   = totalCostPerPrint × unitsPerMonth
monthlyOperatingProfit = monthlyRevenue − monthlyVariableCost − monthlyFixedCosts
monthlyDepreciationTotal = depreciationCost × unitsPerMonth      (used only in 8.6, not subtracted twice)
```
Manual verification: `monthlyRevenue = 28×20 = $560`
`monthlyVariableCost = 13.563×20 = $271.26`
`monthlyOperatingProfit = 560 − 271.26 − 35 = $253.74`
`monthlyDepreciationTotal = 0.540×20 = $10.80`

### 8.6 Payback and ROI — cash-flow basis (Section 9 explains why)
```
initialInvestment = printerPrice + setupCost
monthlyCashProfit = monthlyOperatingProfit + monthlyDepreciationTotal     ["add back" non-cash depreciation]
paybackMonths = initialInvestment / monthlyCashProfit         [undefined/— if monthlyCashProfit <= 0]
roiPct(months) = ((monthlyCashProfit × months) − initialInvestment) / initialInvestment × 100
```
Manual verification: `initialInvestment = 400+50 = $450`
`monthlyCashProfit = 253.74+10.80 = $264.54`
`paybackMonths = 450/264.54 = 1.70 months`
`roi12 = (264.54×12 − 450)/450×100 = (3174.48−450)/450×100 = 605.4%`
`roi24 = (264.54×24 − 450)/450×100 = (6348.96−450)/450×100 = 1310.9%`
`roi36 = (264.54×36 − 450)/450×100 = (9523.44−450)/450×100 = 2016.3%`

### 8.7 Break-even
```
breakEvenUnitsPerMonth = monthlyFixedCosts / profitPerPrint      [undefined/— if profitPerPrint <= 0]
```
Manual verification: `breakEvenUnitsPerMonth = 35/14.437 = 2.42 → displayed as "3 prints/month"`

**A note on the resulting ROI magnitude:** 605–2016% ROI over 12–36 months looks large, but this is consistent with — not more generous than — the competitive landscape: GrandpaCAD's own published example shows a **9,575%** 24-month ROI on its own defaults. High percentage ROI is an inherent, honest property of low-capex/high-margin small-batch manufacturing tools evaluated over a multi-year horizon, not a sign of inflated defaults. This is disclosed explicitly in the page's limitations copy (Section 20) rather than suppressed by artificially degrading the inputs.

---

## 9. Machine/Depreciation Model — Explicit Double-Counting Resolution (Section 6 of the brief)

Two candidate treatments were evaluated:
- **Straight-line depreciation** `(price − residual) / usefulLifeHours` — used for **per-print cost** and **monthly operating profit**, because these views answer "is each sale, and the business's steady-state economics, actually profitable" — a question that must include the printer wearing out over time.
- **Capital-recovery/payback treatment** — used for **payback period** and **ROI**, because these views answer "when do I get my cash back and what did I actually earn on it" — a cash question, not an accounting-profit question.

**The double-counting risk and its resolution:** if payback/ROI used `monthlyOperatingProfit` (which already subtracts depreciation) *and* separately treated the printer price as the investment being recovered, the printer's cost would effectively be subtracted twice — once as a monthly depreciation charge, once as the investment itself. This model resolves it the standard capital-budgeting way: depreciation is a non-cash allocation, so it is **added back** to get `monthlyCashProfit`, which is what actually pays back the `initialInvestment`. This is not a novel technique — it is standard practice whenever payback/ROI is computed from accounting profit rather than raw cash flow — but no competitor found in Section 2 was observed to state or apply this distinction explicitly (GrandpaCAD avoids the issue entirely by never depreciating; everyone else either has no payback/ROI at all, or does not disclose the mechanics). This is the single most technically defensible differentiator in this architecture.

---

## 10. Margin vs. Markup Model

**Primary input:** average selling price (a number every user already knows or can decide, per Section 3).
**Both markup % and gross margin % are derived, secondary, clearly-labeled outputs** — not forced into the input form as an abstract percentage the user must set. This differs from Prusa (markup-only input) and GrandpaCAD (a "material markup multiplier" that conflates markup with a pricing rule-of-thumb). Exact equations are given in Section 8.4; both are always shown side-by-side with the FAQ's Q3 answer (Section 20) explaining the difference in one sentence, so the page itself corrects the single most common financial-literacy error in this space rather than silently reinforcing it.

---

## 11. Electricity Model

`electricityCost = (wattage/1000) × printTimeHours × electricityRate` — standard unit-conversion formula, not a modeling choice. Watts (not kW) and hours (not minutes) were chosen as input units because they match what a printer's spec plate and a slicer's time estimate already show the user, avoiding a mental conversion step. Electricity is a **required**, not optional, input — a deliberate departure from Prusa's treatment, which Section 2's research flagged as undervaluing a real cost. Default rate ($0.18/kWh) is a **researched, sourced, editable default**, not a hard-coded assumption; the input is accompanied by an inline note that the rate varies by region and utility. No geographic presets are recommended — a single sourced numeric default with a clear disclaimer is consistent with how every other calculator on this site handles similarly variable inputs (e.g., mortgage rates, tax rates), and presets would add UI complexity and an ongoing maintenance burden for a single-field input.

---

## 12. Labor Model

**Minimum viable model, per the brief's explicit instruction against enterprise time-accounting:** one combined "hands-on labor time per print" field (setup + removal + basic packaging) × one "labor rate" field. Prusa's two-field split (prep vs. post-processing) was considered and rejected for Phase 1 — it adds a second time-estimation burden on a user who, per Section 3, is unlikely to track this precisely at all; a single combined estimate is materially easier to give honestly and moves the model's accuracy far more than splitting an already-approximate number in two.

---

## 13. Fee Model

Three fields: marketplace fee % (generic, Etsy-informed default), payment-processing fee % (kept separate from the marketplace fee, matching GrandpaCAD's correct separation of these two genuinely distinct charges), and shipping & packaging cost per order (a flat dollar amount, not modeled as a %, since packaging cost does not scale with price). No platform-specific presets/toggles (no "Etsy mode") — per the brief's explicit preference for generic configurable fees, justified here because Etsy is demonstrably central to this exact audience (cited by multiple independent competitors) but the field remains equally usable for any marketplace or direct-to-customer sales with a 0% fee entry.

---

## 14. Failure Rate Model (Section 5 of the brief)

**Formula adopted:** `costPerSuccess = attemptCost / (1 − failureRate)`, applied to the **entire** per-attempt cost (material + electricity + depreciation + labor), not material alone.

This is a deliberate, evidence-based departure from PrintPal and UseACalculator, both of which apply failure rate as a markup on material cost only (Section 2) — understating the true cost of a failed print, which also consumes machine-hours (electricity + depreciation) and, in most workflows, some hands-on labor before the failure is caught. At low failure rates the difference is small (8% material-only markup vs. the mathematically correct 8.7% full-cost markup at f=0.08); at higher, realistic failure rates for difficult prints or new operators, the gap widens meaningfully (at f=0.30, material-only gives +30% while the correct multiplicative treatment gives +42.9%).

**Explicit distinctions requested by the brief:**
- *Material wasted by failures:* captured, via the full-attempt-cost multiplier.
- *Machine time lost to failures:* captured — this is the primary gap vs. competitors described above.
- *Labor lost to failures:* captured under the Phase 1 simplification that treats all labor as per-attempt (Section 8.1); the more granular alternative (splitting per-attempt monitoring labor from per-success packaging labor) is documented as a real, deliberately-deferred refinement, not an oversight.
- *Recoverable material value from failed prints:* modeled as **zero**. Small-operator FDM failures are not economically recyclable in practice for this audience; this is stated as an explicit, disclosed model limitation (Section 20), not silently assumed.
- *Effect on cost vs. achievable monthly volume:* Phase 1 treats monthly volume as a **demand-side input** (units the seller actually sells), not a capacity-side output — failure rate affects cost per successful print but does not reduce the modeled monthly volume, because this calculator's job is "is my current sales level profitable," not "how many units can my printer physically produce." The capacity-vs-demand question (fleet-hours available vs. failure-adjusted throughput) is explicitly the correct central question for the future **Print Farm calculator (#2)**, not this one — see Section 15.

---

## 15. Future Cluster Architecture (preventing Phase 1 from foreclosing calculators #2–5)

| # | Calculator | Distinct search intent | Distinct user | Distinct primary job | Distinct inputs | Distinct outputs | Overlap with #1 | Shared engine? |
|---|---|---|---|---|---|---|---|---|
| 1 | Business ROI Calculator (this phase) | "3d printing business roi calculator" | Single/1–2 printer seller | Is my operation profitable & when does it pay back | See Section 6 | 24-mo ROI, payback, monthly profit | — | Reference engine |
| 2 | Print Farm Profit & ROI Calculator | "3d print farm roi calculator" | 3–10+ printer fleet operator | Should I scale the fleet / is current utilization profitable | Printer **count**, utilization %/ramp-up curve, shared overhead allocation | Fleet monthly profit, cost-per-hour, utilization-adjusted break-even | Reuses #1's per-print cost formula (Section 8.1–8.3) as the per-unit layer under a fleet multiplier | Yes — same cost engine, new fleet layer |
| 3 | Print Service Pricing Calculator | "3d print service pricing calculator" (note: direct name collision with a live competitor, Section 2 — must differentiate on substance) | Print-for-hire service provider | What should I charge for *this specific job* | Single job's grams/time/complexity, target margin | Recommended price at target margin (solves the same formula for price, not profit) | Reuses #1's cost engine, solves an inverted equation | Yes |
| 4 | Business Profit Margin Calculator | "3d printing profit margin calculator" | Seller with a multi-item catalog | Which of my products are actually worth making | Multiple line items (repeatable instances of #1's per-item inputs) | Per-item and blended margin comparison table | Reuses #1's per-item formula, aggregated across a list | Yes |
| 5 | Printer Payback Calculator | "3d printer payback calculator" | Pre-purchase hobbyist/buyer (audience A, explicitly not #1's audience) | Should I buy *this* printer | Candidate printer price/specs vs. an assumed usage plan (1–2 printer comparison) | Payback timeline only, no full monthly P&L | Uses #1's depreciation/payback math (Section 8.6) as a lightweight subset, omits monthly operating view entirely | Yes — subset |

**Structural decision that enables this without cannibalization:** the per-print cost formula (Section 8.1–8.3) and the cash-flow payback/ROI treatment (Section 8.6) are documented here as a **reusable modeling pattern** with consistent variable names, so each future calculator's own dedicated script can reuse or reference this pattern rather than re-deriving inconsistent math. None of the five calculators duplicate another's *primary job* (Section 4 discipline extended across the cluster), which is what prevents the "five URLs wrapping the same formula" doorway pattern this site's own Phase 7F/7G/7H work just spent three phases cleaning up on the generic-ROI cluster (Section 21).

---

## 16. Scale/Modeling Integration Roadmap

- **Phase 1 (this calculator):** none. No STL/scale/dimension inputs — the site cannot currently obtain this data client-side without a major architecture change, and the brief explicitly forbids inventing fake inputs for data the site can't get.
- **Later cluster phase (calculator #3, Service Pricing, naturally job/file-specific):** a lightweight, no-upload *estimator* — basic dimensions (L×W×H) + an infill-percentage heuristic → estimated grams/print time — is plausible without any new infrastructure, since it's pure arithmetic, not slicing.
- **Future advanced integration (explicitly not scoped to any current phase):** true STL/G-code upload with slicing-engine-based auto-fill (as Prusa and Creative3DP both already do) requires either server-side processing or a client-side WASM slicer. **This is flagged as a real architectural constraint**: the site's current model is 100% client-side, no-backend, privacy-first (no cookies, no tracking, no server processing of user files) — a genuine file-upload/slicing feature would either require introducing server infrastructure (a material change to the site's privacy positioning) or a substantial WASM-slicer integration effort. This should be evaluated as its own architecture decision when the cluster reaches that point, not assumed to be a simple bolt-on.

---

## 17. SEO Keyword Strategy

Primary search intent: **"3d printing business roi calculator" / "3d printing roi calculator"** — a framing most competitors do not use (they say "cost calculator" or "profit calculator"; only this site's existing sitewide "[Vertical] ROI Calculator" brand convention makes "ROI calculator" the natural head term here, and it is measurably less crowded than "cost calculator" per Section 2's landscape). Secondary intents: "3d printing profit calculator," "3d printer payback calculator," "is 3d printing profitable," "3d printing break-even calculator." No keyword stuffing — the title/H1 describe the actual tool once, cleanly, matching the sitewide pattern audited as strong in Phase 7F.

---

## 18. Exact Title / H1 / Hero Subtitle

- **Page title:** `3D Printing Business ROI Calculator | roicalculator.live`
- **H1:** `3D Printing Business ROI Calculator`
- **Hero subtitle (exact):** `Calculate monthly profit, payback period, and ROI for a 3D printing side business from printer cost, per-print economics, and sales volume.`
- **Meta description (exact):** `Free 3D printing business ROI calculator: printer cost, material, electricity, labor, failure rate, and marketplace fees. Get monthly profit, payback period, and ROI.`
- **Recommended URL slug:** `/3d-printing/roi-calculator.html` (justified in Section 21)

---

## 19. AEO / Content Architecture

Per the site's Phase 7E/7F/7G/7H precedent, carried forward exactly: **no** Quick Answer box, no "AI Answer," no green answer card, no redundant "At a Glance" box, no repeated definition blocks. The page's required hierarchy (Header → Hero → Calculator → Dominant Result → Interpretation → Supporting Metrics → Methodology → Supporting Content → Related Tools → Footer) matches exactly what this site's own reference-page work (Phase 7) established for SaaS/Real Estate/Solar — reused here without modification, not reinvented.

**Dominant-result interpretation sentence (exact, templated):**
> "At the assumptions entered, this printer is modeled to return {roi24}% over 24 months, with the {initialInvestment} investment recovered in an estimated {paybackMonths}. Monthly operating profit is estimated at {monthlyOperatingProfit} on {unitsPerMonth} prints sold."

**Methodology heading (exact):** `Methodology`
**Methodology summary (exact, single paragraph, matching the site's dense-formula style used on SaaS/Real Estate):**
> "Cost per successful print = (material + electricity + depreciation + labor) ÷ (1 − failure rate), plus platform fees, payment processing, and shipping/packaging on each sold print. Depreciation = (printer cost + setup cost − residual value) ÷ useful-life hours × print time. Monthly operating profit = (selling price − cost per successful print) × units sold, minus fixed monthly costs. Payback and ROI use cash flow — depreciation is added back, since the printer's cost is already counted once as the initial investment — which avoids counting the printer price twice. ROI = (cumulative cash profit over the period − initial investment) ÷ initial investment × 100."

**Supporting-content headings (exact):** `How to use this for a purchase or scaling decision`, `Limitations of this model` (see Section 20 for the disclosure text).

---

## 20. FAQ Specification (calculator-specific — the explicit "no repeated What is ROI?" rule applied)

This page does **not** carry a "What is ROI?" or "What is X?" question anywhere, visible or in schema — the methodology section (Section 19) already explains the model, and per this site's own established Phase 7F/7G rule, repeating that as an FAQ question would violate the exact defect this site just spent two phases removing elsewhere. All four questions below address genuine post-methodology uncertainty and are not transplantable to another calculator without rewriting the answer.

1. **Q: Why does the payback period add depreciation back instead of just using monthly profit?**
   A: "Depreciation spreads the printer's purchase price across its useful life as an accounting cost, but you already paid that cost once, up front. Adding it back gives the actual cash coming in each month, which is what pays back your initial investment — using monthly accounting profit instead would effectively subtract the printer's cost twice."

2. **Q: How does the failure rate affect my cost per print?**
   A: "Failure rate is applied to the full cost of an attempt — material, electricity, depreciation, and labor — not just the wasted material, because a failed print also consumes machine time and hands-on time. At a 10% failure rate, for example, cost per successful print rises by about 11%, not a flat 10%, since on average you need slightly more than one attempt to get one success."

3. **Q: What's the difference between the margin and markup shown in the results?**
   A: "Markup is profit as a percentage of cost; margin is profit as a percentage of price. A 100% markup on a $10 cost sets a $20 price, which is only a 50% margin — the two numbers describe the same profit in different ways, and this calculator shows both so pricing decisions use whichever framing you're used to."

4. **Q: Why is my printer investment excluded from monthly operating profit?**
   A: "Monthly operating profit reflects ongoing running costs, including a depreciation charge for the printer, so it already accounts for the printer wearing out over time. The upfront purchase price itself is tracked separately, in payback and ROI, so it is not subtracted a second time from monthly profit."

**Disclaimer/assumptions wording (exact, to appear in Limitations):**
> "This model assumes steady, consistent monthly sales at the volume entered — it does not model the ramp-up time typically needed to build a customer base, seasonality, or one-time promotional pricing. Failed prints are assumed to have no recoverable material value. Results are estimates for planning purposes only, not financial or investment advice."

---

## 21. AdSense / Content-Quality Considerations

No ads, no ad containers, no placeholders are added in this phase (none exist on the site currently, per Phase 7F). Forward-looking guidance for whenever monetization is authorized: the calculator, its methodology, and its limitations disclosure constitute substantive, unique content (not a thin wrapper); any future ad placement must sit clearly outside the calculator-input/results area and never be styled to resemble a result card, consistent with Google's Publisher Policy language (already researched and cited in Phase 7F) against ads that are "indistinguishable from content" or interfere with navigation. The single greatest risk to future AdSense-readiness for this *cluster* is not this page — it is calculators #2–5 being built as thin variants once #1 exists; Section 15's job-to-be-done discipline is the safeguard against that.

---

## 22. Content Quality / Google Search Risk Assessment

Applying Phase 7F's already-researched, still-current Google policy findings (scaled content abuse, doorway pages, helpful-content self-assessment) directly to this cluster: the risk is not calculator #1 in isolation — it is the temptation, once the cluster is authorized, to ship #2–5 as near-duplicates of #1 with renamed variables (exactly the pattern this site's own Phase 7F audit found and Phase 7G/7H just retired on the generic-ROI cluster). Section 15's per-calculator distinct-job requirement is the explicit safeguard. No generic FAQ, no keyword-stuffed headings, and no AI-filler pattern is proposed anywhere in this specification.

---

## 23. URL / Site Architecture Recommendation

**Recommended: `/3d-printing/roi-calculator.html`**, treating 3D Printing as a **new primary vertical** (mirroring `/solar/roi-calculator.html` exactly), not `/calculators/3d-printing-roi-calculator.html`.

Reasoning: the `/calculators/` directory is the generator-controlled Marketing/Finance/Operations factory tier — a different architectural tier that Phase 5 explicitly decided must not be casually extended or restructured. A five-calculator cluster with genuine hub/child relationships deserves its own vertical directory the way Solar, SaaS, and Real Estate each have one. Future children are recommended at flat `/3d-printing/{slug}.html` paths (e.g., `/3d-printing/print-farm-calculator.html`) rather than the older nested `/roi-calculator/{vertical}/{slug}.html` legacy pattern, since 3D Printing has no legacy content to be consistent with — a clean new pattern is lower-risk than replicating an older one. A dedicated `/3d-printing/` index hub page (distinct from the canonical calculator, the way `/real-estate/` and `/saas/` are hubs) is a reasonable future addition once child calculators actually exist, but is explicitly **not** part of this phase's recommendation and must not be built now.

---

## 24. Engine Architecture Recommendation

**Recommended: hand-authored**, matching the Real Estate/Solar/SaaS pattern (each has its own dedicated JS calculator file), **not** a `data/calculators.json` entry in the generic factory.

Reasoning: the factory engine's config format is one flat formula-string per output — adequate for the Marketing/Finance/Operations calculators' simpler math, but incapable of expressing the failure-rate-correction and depreciation-add-back logic (Sections 8–9) without either flattening away the exact rigor that is this calculator's core differentiator, or extending the shared factory engine specifically for one page — the latter being exactly the kind of unauthorized sitewide generator change Phase 5 forbade. For the future cluster (#2–5), a shared, hand-authored JS module containing the reusable per-print-cost functions (Section 15) — imported by each calculator's own page-specific script, the same way `calculator-engine.js` provides shared plumbing beneath each vertical's dedicated script today — is recommended over either forcing the cluster into the factory or duplicating the formula five times.

---

## 25. Edge Cases and Required Display Behavior

| Condition | Required display (never NaN/Infinity) |
|---|---|
| 0 monthly sales / 0 print volume | Monthly profit = −fixed costs (shown, real negative number); payback/ROI = "—" |
| 0 selling price | Profit per print negative (shown); dominant ROI deeply negative (shown, not suppressed) |
| 0 printer cost (setup > 0) | Normal math; investment = setup cost only |
| 0 printer cost AND 0 setup cost | Payback displayed as "0 mo (no investment entered)," not raw "0.0" |
| 100% failure rate (or ≥100%) | Cost-per-success guarded in JS before division; display "—" / "No successful prints modeled at 100% failure" |
| Failure rate > 100% entered | Prevented at input level via `max="99"`; treat any bypass as invalid → "—" |
| Negative values | Prevented via HTML5 `min="0"` on all cost/price/volume fields, matching sitewide convention |
| 0 labor / 0 electricity cost | Valid; no special handling, correct math flows through |
| Extremely high electricity cost | No special handling required; correctly dominates cost calculation |
| Payback never reached (monthlyCashProfit ≤ 0) | "—" with interpretation "Not reached at these assumptions" |
| Negative monthly profit / negative ROI | Shown as genuine negative numbers/percentages — never hidden, this is the job-to-be-done's core signal |
| Break-even never reached (profitPerPrint ≤ 0) | "—" with interpretation "Not achievable — each print currently loses money" |

---

## 26. Risks and Unresolved Questions

1. **International usability of USD-denominated defaults.** The electricity-rate and material-cost defaults are US-sourced; the calculator's formulas are currency-agnostic, but no currency-selector exists sitewide (none of the site's other calculators have one either) — consistent, not a new gap, but worth flagging if internationalization is ever prioritized.
2. **File-upload/slicing integration conflicts with the site's no-backend, privacy-first architecture** (Section 16) — a real, non-trivial future decision, not a simple bolt-on.
3. **Calculator #3's planned name ("3D Print Service Pricing Calculator") directly collides with a live competitor's product name** (Ultimate Finance Calculator, Section 2) — differentiation must be substantive (methodology, rigor) since the name itself will not be unique.
4. **High percentage ROI outputs (600–2000%+ at realistic defaults) may read as implausible to a skeptical user** despite being mathematically correct and consistent with the competitive landscape (GrandpaCAD's own 9,575% example) — mitigated by the explicit steady-state/no-ramp-up disclosure in Limitations, but this is a genuine communication risk worth the Director's awareness before implementation.
5. **Labor-value input ($18/hr default) is a judgment call**, not a researched figure — sellers may undervalue or overvalue their own time in ways a single field cannot capture; flagged as an assumption, not hidden as a fact.

---

## 27. Exact Implementation Requirements for Phase 2

When implementation is authorized, Phase 2 must:
- Build `/3d-printing/roi-calculator.html` using the site's existing header/footer chrome (`SITE_HEADER_HTML`/`SITE_FOOTER_HTML`) unmodified, and the existing shared `assets/css/styles.css` classes (`.hero`, `.calculator-card`, `.result-dominant`, `.results-grid`, `.methodology-section`, `.content-section`) unmodified — no new CSS.
- Create a new, hand-authored `assets/js/3d-printing-roi-calculator.js` implementing exactly the formulas in Section 8, with the edge-case guards in Section 25.
- Use the exact copy in Sections 18–20, verbatim, unless the Director changes it.
- Add the page to `sitemap.xml` by hand (this vertical is not generator-controlled, consistent with Solar/SaaS/Real Estate's own hand-maintained sitemap entries).
- Add a nav-dropdown entry and footer link only if and when the Director authorizes sitewide navigation changes — not assumed as part of this architecture.
- Run the full existing QA suite (calculator-quality is N/A since this isn't a factory calculator; navigation-check, mobile-nav-interaction-check, viewport-overflow-check) against the new page before any commit.

## 28. Explicit Non-Implementation Declaration

**PHASE 1 — RESEARCH + ARCHITECTURE COMPLETE. IMPLEMENTATION NOT AUTHORIZED IN THIS PHASE.**

No HTML, JavaScript, CSS, sitemap, redirect, navigation, or `data/calculators.json` changes were made. The repository is functionally unchanged from before this phase began. The Director will review this architecture before authorizing implementation as a separate phase.
