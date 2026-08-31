# Phase 8F — 3D Printing Cluster: Resin Calculator Demand + Distinct-Math Research

**Mode:** RESEARCH ONLY — no production files modified to produce this report.
**Repository HEAD at start:** `2b707826dc832fad0f5e0903864ca24a1ddc3558` (Phase 8E)
**Working tree at start:** clean

---

## 1. Executive Verdict

**FINAL DECISION: DEFER**

**FACT:** A real, active market of resin-specific 3D-printing cost/pricing calculators exists (9 live tools directly inspected in this research), and Etsy/hobbyist-seller pricing content for resin prints is abundant.

**INFERENCE:** Demand is concentrated almost entirely on one job — *"what does this resin print really cost, and what should I charge for it"* — which is structurally a cost-plus, forward-solve-for-price problem. That is the same economic question this site's existing **Service Pricing** calculator already answers for filament prints. The genuinely resin-specific variables uncovered in this research (resin density/mL→weight conversion, FEP film wear, IPA wash consumable, UV curing energy, support/waste allowance) are real, but they are additive line items inside that same cost-plus architecture — not evidence of a structurally different economic model, in the way Print Farm ROI's fleet-capacity ceiling is structurally different from Business ROI.

**INFERENCE:** The one job that would be genuinely non-duplicative — a resin-specific printer ROI/payback tool — is not covered by any of the 9 competitors inspected (a real gap), but the demand evidence for that specific job (as opposed to cost/pricing) is weak: search and community results for "resin printer ROI/payback" returned almost nothing resin-specific, while "resin print cost/pricing" returned a dense, mature competitive field.

**RECOMMENDATION:** Do not build now. The opportunity is plausible but not yet strong enough on the one axis (job-distinctness) that matters most, and depends on a product decision (which job to build for, and whether to differentiate via the ROI angle despite its weaker evidenced demand) that this research phase is not authorized to make. See §16 for the full decision walkthrough.

---

## 2. Starting State

**FACT (verified this session):**
- `git status --short` → clean, no output.
- `git rev-parse HEAD` → `2b707826dc832fad0f5e0903864ca24a1ddc3558`, matching `git rev-parse origin/main`.
- This matches the expected post-Phase-8E state.

**FACT:** The cluster currently contains exactly four files, confirmed via direct directory listing:
- `3d-printing/index.html` (hub)
- `3d-printing/roi-calculator.html` (Business ROI)
- `3d-printing/print-farm-roi-calculator.html` (Print Farm ROI)
- `3d-printing/service-pricing-calculator.html` (Service Pricing)

**FACT:** `find . -iname "*resin*"` (excluding `.git`) returns zero matches. `grep -ril "resin" . --include="*.html"` (excluding `node_modules`) returns zero matches. **No resin content or calculator exists anywhere on the site today.**

**FACT:** Prior review documents (`PHASE-3D-PRINTING-05-CLUSTER-REVIEW.md`, `PHASE-3D-PRINTING-08-CLUSTER-SEO-CONTENT-UX-REVIEW.md`) were re-read in full for this phase. Both independently classify a resin calculator as the only Calculator #4 candidate not outright rejected, and both explicitly **DEFER** it pending dedicated demand/formula research — this phase is that research.

**FACT — current cluster calculator inventory, verified by direct source inspection this session (not from memory):**

| Calculator | Inputs (verified element IDs) | Dominant output | Key outputs |
|---|---|---|---|
| **Business ROI** (`roi-calculator.html`) | printer cost, setup cost, useful life, residual value, price, units/month, filament price, material grams, print time, wattage, electricity rate, failure rate, labor minutes, labor rate, platform fee %, payment fee %, shipping, fixed costs | 24-month ROI (%) | payback, monthly operating profit, profit/print, break-even units/month, cost per success, total cost/print, 12/36-mo ROI, margin, markup |
| **Print Farm ROI** (`print-farm-roi-calculator.html`) | all of the above + printer count, utilization %, orders/month | 24-month ROI (%) | + monthly successful prints, capacity, capacity utilization %, revenue, cash profit |
| **Service Pricing** (`service-pricing-calculator.html`) | printer price, printer life, printer power, print time, material price, material grams, electricity rate, failure rate, labor rate, setup hours, overhead, platform fee %, target margin % | Recommended price ($) | min viable price, profit, margin, hourly earnings, price/hour, price/part, full cost breakdown |

All three use **filament grams** as the material unit and generic **platform fee % / payment fee %** as the only "selling" cost line. None mention resin, mL, density, FEP, IPA, or curing anywhere in source.

No unexpected production changes were found. Nothing was "cleaned up." This phase's only repository change is this report.

---

## 3. Competitive Research

**Method:** Live web search plus direct fetch/inspection of each tool's page content. 9 resin-specific (or resin+FDM dual) calculators were directly inspected; one (PrintCal.co) returned HTTP 403 on fetch and is listed from search-result metadata only, clearly marked as unverified.

### 3.1 PrintPal — Resin Print Cost Calculator
- **URL:** https://printpal.io/tools/resin-print-cost-calculator
- **Status:** Live.
- **Primary user:** Resin printing hobbyists and professionals.
- **Primary job:** Estimate true cost of an SLA/MSLA/DLP print.
- **Inputs:** resin bottle price + volume, print volume/resin used, print time, printer power, electricity rate, FEP film cost + replacement frequency, IPA cost + lifespan, failure rate.
- **Outputs:** total cost per print, itemized breakdown (resin, electricity, consumables, failure markup).
- **Formula:** Formula not publicly established from inspected source.
- **Variable coverage:** resin volume ✅, resin price/L ✅ (via bottle price/volume), density ❌, print time ✅, electricity ✅, printer depreciation ❌, FEP ✅, IPA ✅, curing ❌, gloves/filters ❌, labor ❌, failure rate ✅, support/waste ❌, packaging ❌, platform fees ❌, target margin ❌, markup ❌.
- **STL/slicer:** No. **Selling price:** No. **Profitability:** No. **ROI/payback:** No. **SLA/MSLA/DLP distinction:** Yes (explicit). **Free/paid:** Free. **Differentiator:** none beyond being a clean, dedicated resin-only tool.

### 3.2 LayerMath — Resin 3D Printing Cost Calculator
- **URL:** https://layermath.com/calculator/resin
- **Status:** Live.
- **Primary user:** "Resin sellers" pricing Etsy listings.
- **Primary job:** True per-print cost + suggested selling price via markup.
- **Inputs:** resin volume used, resin price/L, FEP sheet cost + prints/sheet, IPA used per wash + price/L, print time, printer power, electricity rate, UV curer power + cure time, failure rate, markup %.
- **Outputs:** per-print cost breakdown (material, consumables, total), suggested selling price.
- **Formula:** Formula not publicly established from inspected source (line items described qualitatively, not shown as an explicit equation).
- **Variable coverage:** resin volume ✅, price/L ✅, density ❌, print time ✅, electricity ✅ (including **UV curing energy specifically** — the only tool inspected that separately meters curing electricity), depreciation ❌, FEP ✅, IPA ✅, curing ✅ (energy only, not consumable), gloves/filters ❌, labor ❌, failure rate ✅, support/waste ❌, packaging ❌, platform fees ❌, target margin ❌ (uses markup instead), markup ✅.
- **STL/slicer:** No. **Selling price:** Yes (via markup). **Profitability:** No explicit profit/margin output shown. **ROI/payback:** No. **SLA/MSLA/DLP:** Not explicit. **Free/paid:** Free, with a Pro tier. **Differentiator:** explicit UV-curing electricity metering (unique among inspected tools); resin price reference table (£18–150/L); companion blog content ("How to Price Resin 3D Prints") stating resin true cost is often 3–4× higher than the raw resin price alone.

### 3.3 GrandpaCAD — Resin Print Cost Calculator
- **URL:** https://grandpacad.com/en/tools/resin-print-cost-calculator
- **Status:** Live. (Same operator as the site's own previously-identified competitor for the combined business/farm/pricing ecosystem, per Phase 8's competitive review.)
- **Primary user:** Makers estimating resin printing expenses.
- **Primary job:** Convert slicer-reported volume into a per-print cost.
- **Inputs:** resin bottle price + bottle size (grams) + **resin density (g/mL)**, model volume, print time, printer power, electricity rate, consumables cost (single lump sum), failure markup %.
- **Outputs:** estimated cost per print, itemized (resin, electricity, consumables, failure markup), resin unit cost, prints per bottle.
- **Formula:** Partially stated — density used explicitly to convert slicer volume (mL) to resin weight/cost; consumables (IPA ~$0.50/print, gloves ~$0.30/pair, FEP ~$0.06/print) given as reference constants rather than a derived formula.
- **Variable coverage:** resin volume ✅, price/L (via bottle price/size) ✅, **density ✅ (explicit input)**, print time ✅, electricity ✅, depreciation ❌, FEP ✅ (reference constant), IPA ✅ (reference constant), curing ❌, gloves ✅ (reference constant), labor ❌, failure rate ✅, support/waste ❌, packaging ❌, platform fees ❌, target margin ❌, markup ❌.
- **STL/slicer:** No file upload, but explicitly designed around a user pasting the *slicer's* reported volume. **Selling price:** No. **Profitability:** No. **ROI/payback:** No. **SLA/MSLA/DLP:** Yes. **Free/paid:** Free. **Differentiator:** the only inspected tool that models density as a first-class input rather than assuming a fixed g/mL constant.

### 3.4 ResinCalc — 3D Print Cost Calculator (Resin & Filament)
- **URL:** https://resincalc.com/
- **Status:** Live.
- **Primary user:** People who print in both resin and filament and want one tool; professionals selling prints (Pro tier).
- **Primary job:** "Price every job in seconds."
- **Inputs (resin mode):** printer model, power, resin name/cost/bottle size, print volume, print time, electricity rate. Pro adds failure %, labor/post-processing, markup → client price.
- **Outputs:** total cost, per-gram/per-cm³ cost, breakdown (material, electricity, depreciation), PDF receipt.
- **Formula:** Explicitly shown: `volume/weight × price per unit` (material); `print time × printer power × electricity rate` (electricity); depreciation spreads printer cost over expected lifespan (formula shape not published beyond that description).
- **Variable coverage:** resin volume ✅, price/L (via bottle) ✅, density ❌ (not mentioned), print time ✅, electricity ✅, **printer depreciation ✅ (standard tier)**, FEP ❌, IPA ❌, curing ❌, gloves/filters ❌, **labor ✅ (Pro)**, failure rate ✅ (Pro), support/waste ❌, packaging ❌, **platform fees not explicit**, **target margin/markup ✅ (Pro, "client price")**.
- **STL/slicer:** No. **Selling price:** Yes (Pro). **Profitability:** implied via markup, not an explicit margin output. **ROI/payback:** No. **SLA/MSLA/DLP:** Not distinguished as such (generic "resin"). **Free/paid:** Free + $59/yr Pro. **Differentiator:** dual resin/filament mode in one tool, visible formulas, PDF export, paid tier with depreciation+labor+markup bundled — the most "complete" cost-plus tool inspected, but explicitly **omits every resin-specific consumable** (FEP, IPA, curing) that the resin-only competitors treat as core.

### 3.5 Octet3D — Resin 3D Printing Cost Calculator
- **URL:** https://www.octet3d.com/en/resin-calculator
- **Status:** Live.
- **Primary user:** Makers and small print-service businesses.
- **Primary job:** True production cost + suggested selling price.
- **Inputs:** resin volume + price/L, print duration, printer power + electricity rate, IPA volume + price/L, FEP cost + lifespan (prints), **printer purchase price + operational lifespan (hours)**, **labor rate + processing minutes**, failure rate %, desired markup %.
- **Outputs:** suggested selling price, full cost breakdown (resin, alcohol, energy, FEP wear, machine depreciation, labor, failure reserve), profit amount, margin %, PDF quote.
- **Formula:** Not published as an equation, but the described line-item set is the most complete of any inspected tool.
- **Variable coverage:** resin volume ✅, price/L ✅, density ❌ (not mentioned), print time ✅, electricity ✅, **depreciation ✅**, FEP ✅, IPA ✅, curing — mentioned as a consideration in copy but **not incorporated into the calculation**, gloves — mentioned in copy, **not calculated**, **labor ✅**, failure rate ✅ (default 10%), support/waste — not modeled, packaging ❌, platform fees ❌, **target margin/markup ✅ (both, explicitly distinguished)**.
- **STL/slicer:** **Yes — accepts STL/3MF/OBJ/PLY/G-code, parsed client-side with no server upload.** This is the single most important competitive data point found for §8 below.
- **Selling price:** Yes. **Profitability:** Yes (profit $ + margin %). **ROI/payback:** No. **SLA/MSLA/DLP:** Not explicit. **Free/paid:** Free. **Differentiator:** most complete resin cost-plus-pricing model found, explicit margin-vs-markup distinction ("markup is profit over cost, margin is profit over final price" — a nuance already correctly implemented on this site's own Service Pricing calculator), and genuine client-side file parsing.

### 3.6 Pea3D — 3D Resin Printing Cost Calculator
- **URL:** https://pea3d.com/en/3d-resin-printing-cost-calculator/
- **Status:** Live.
- **Primary user:** Print-farm/service-business operators wanting granular per-unit cost.
- **Primary job:** Per-unit cost analysis for quotation.
- **Inputs:** resin price ($/kg), print weight (grams), IPA price ($/L), FEP cost + FEP life (prints), consumables lump sum (gloves/filters).
- **Outputs:** raw resin expense, IPA cost, FEP amortization, total unit cost.
- **Formula:** Explicit density constant stated: **"Calculated at ~1.1g/ml"**; states supports typically add 15–35% to material weight.
- **Variable coverage:** resin volume — works from weight, not volume, price/L — via $/kg + assumed density, **density ✅ (explicit, fixed constant)**, print time ❌ (not used — cost model is weight-based only, no time/electricity component at all), electricity ❌, depreciation ❌, FEP ✅, IPA ✅, curing ❌, gloves ✅ (lump sum), labor ❌, failure rate ❌ (only a static support/waste % of weight, not a stochastic failure allowance), support/waste ✅ (explicit 15–35% material addition), packaging ❌, platform fees ❌, target margin/markup ❌.
- **STL/slicer:** No. **Selling price:** No. **Profitability:** No. **ROI/payback:** No. **SLA/MSLA/DLP:** Not distinguished. **Free/paid:** Free. **Differentiator:** the only inspected tool with **zero electricity/time component** — a materials-and-consumables-only model, and the clearest example of "support/waste" modeled as a percentage-of-weight addition rather than a stochastic failure rate.

### 3.7 SANIX3D — Resin 3D Print Cost Calculator
- **URL:** https://sanix3d.com/resin-3d-print-cost-calculator/
- **Status:** Live.
- **Primary user:** "Makers who sell resin prints, run a small print farm, or want to know what a miniature or statue really costs."
- **Primary job:** Real (not just resin) cost per model, including batch economics.
- **Inputs:** volume/model (from slicer), **support allowance tiers (None/Light +10%/Medium +20%/Heavy +35%)**, bottle price + volume, **consumables tiers (None/Light +5%/Medium +10%/Heavy +18%)**, printer model presets (Elegoo Mars, Anycubic Photon, Elegoo Saturn, etc.) or custom watts, region-based or custom electricity price, **batch print time**, **number of models in batch**, failure rate %, optional printer price + lifespan for depreciation.
- **Outputs:** per-model cost (itemized: resin, consumables, electricity, printer wear, failure buffer), batch total.
- **Formula:** Formula not publicly established from inspected source (tiered percentage-adders rather than a published equation), with an explicit accuracy caveat: "≈ Approximate result. Real cost varies with resin brand, wash/cure routine, printer used and your local prices."
- **Variable coverage:** resin volume ✅ (from slicer), price/L ✅, density ❌, print time ✅ (batch-level), electricity ✅, **depreciation ✅ (optional)**, FEP — referenced as a failure cause in copy, not a direct cost line, IPA ✅ (via consumables tier), curing ❌, gloves ✅ (via consumables tier), labor ❌, **failure rate ✅**, **support/waste ✅ (explicit tiered %)**, packaging ❌, platform fees ❌, target margin/markup ❌.
- **STL/slicer:** No upload, but explicitly slicer-volume-driven. **Selling price:** No. **Profitability:** No. **ROI/payback:** No. **SLA/MSLA/DLP:** Implicit (LCD/MSLA printer presets named). **Free/paid:** Free. **Differentiator:** **batch-of-N economics** (unique among inspected tools) and named consumer-printer presets (Elegoo/Anycubic) for one-click wattage.

### 3.8 KingSTL — Resin Print Cost Calculator & Material Estimator
- **URL:** https://kingstl.com/resin-print-cost-calculator/
- **Status:** Live.
- **Primary user:** Makers pricing physical resin prints for sale.
- **Primary job:** Total project cost + suggested minimum selling price.
- **Inputs:** resin volume or weight, bottle volume/price or price/kg, **waste allowance %**, print duration, printer power, electricity rate, failure allowance %, batch quantity, cleaning fluid, gloves/towels, FEP wear allowance, other consumables, labor hours + rate, target profit margin %.
- **Outputs:** total project cost, itemized breakdown, cost per model, suggested minimum selling price.
- **Formula:** Explicitly stated: **`Selling price = cost ÷ (1 − margin)`** — the identical inverse-margin formula this site's own Service Pricing calculator already uses (`recommendedPrice = costBeforeFees / (1 − fee − margin)`).
- **Variable coverage:** resin volume/weight ✅, price/L or /kg ✅, density — implicit in weight/volume conversion, not a stated input, print time ✅, electricity ✅, depreciation ❌, FEP ✅ (allowance), IPA ✅ ("cleaning fluid"), curing ❌, gloves ✅, **labor ✅**, failure rate ✅ ("failure allowance"), **support/waste ✅ ("waste allowance")**, packaging ❌, platform fees ❌, **target margin ✅**, markup — distinguished explicitly in copy from margin.
- **STL/slicer:** No. **Selling price:** Yes. **Profitability:** Implicit via margin. **ROI/payback:** No. **SLA/MSLA/DLP:** Not explicit. **Free/paid:** Free. **Differentiator:** explicit margin-vs-markup education; notes that owning an STL file does not grant commercial print-and-sell rights (a licensing-awareness angle no other inspected tool raises).

### 3.9 3dprintingcosts.com — FDM & Resin Cost Calculator (dual-material, not resin-only)
- **URL:** https://3dprintingcosts.com/
- **Status:** Live.
- **Primary user:** Any 3D-printing hobbyist/seller, FDM or resin.
- **Primary job:** General print cost estimate, resin treated as one material option among others.
- **Inputs:** **STL file upload for automatic volume estimation** (or manual filament/resin quantity), extra parts (hardware/magnets/inserts), labor rates (modeling/prep/finishing), printer power + electricity price, profit margin, shipping, VAT/tax, wear + failed-print allowance.
- **Outputs:** total estimated cost (EUR), breakdown across direct material / production / business & fees.
- **Formula:** Formula not publicly established from inspected source.
- **Variable coverage:** resin volume ✅ (generic material quantity, not resin-specific), price ✅, density ❌, print time — implicit, electricity ✅, depreciation ❌, FEP ❌, IPA ❌, curing ❌, gloves ❌, labor ✅, failure rate ✅ ("wear and failed-print allowance"), support/waste ❌ explicit, packaging — via shipping, platform fees — via VAT/tax only, not marketplace fees, target margin ✅, markup — not distinguished from margin.
- **STL/slicer:** **Yes — STL upload with local, in-browser parsing, explicitly "no server uploads."** Second confirmed proof point (with Octet3D) that client-side STL volume parsing is a real, shipped pattern, not a theoretical one.
- **Selling price:** implicit via margin. **Profitability:** No explicit output. **ROI/payback:** No. **SLA/MSLA/DLP distinction:** No — treats resin as a generic material, with **none of the resin-specific consumables (FEP/IPA/curing) that dedicated resin tools treat as essential.** **Free/paid:** Free. **Differentiator:** genuinely general-purpose (any material) with real client-side file parsing, but shallow on resin-specific economics — evidence that a "generic material calculator with resin support" is not the same product as a "resin-specific calculator," and that genuine resin depth requires the consumable-specific line items dedicated tools carry.

### 3.10 PrintCal.co — Resin 3D Printing Cost Calculator (unverified — fetch blocked)
- **URL:** https://printcal.co/en/resin-calculator/
- **Status:** Live per search-result presence; **direct inspection blocked (HTTP 403 on fetch)**.
- Per search-result snippet only: "estimates resin volume, supports, losses, FEP/LCD wear, washing, curing and margin for SLA/MSLA printing" and positioned as "a quick starting point... before turning the job into a full quote."
- **Formula not publicly established from inspected source** (page could not be directly read). Listed for completeness; not used as load-bearing evidence anywhere in this report's conclusions.

### 3.11 Summary table

| Tool | Depreciation | FEP | IPA | Curing energy | Density | Support/waste | Labor | Margin/Markup | STL upload | ROI/Payback |
|---|---|---|---|---|---|---|---|---|---|---|
| PrintPal | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| LayerMath | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅(markup) | ❌ | ❌ |
| GrandpaCAD | ❌ | ✅(ref) | ✅(ref) | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| ResinCalc | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅(Pro) | ✅(Pro) | ❌ | ❌ |
| Octet3D | ✅ | ✅ | ✅ | ~(copy only) | ❌ | ❌ | ✅ | ✅(both) | ✅ | ❌ |
| Pea3D | ❌ | ✅ | ✅ | ❌ | ✅(fixed) | ✅ | ❌ | ❌ | ❌ | ❌ |
| SANIX3D | ✅(opt) | ~(ref) | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| KingSTL | ❌ | ✅ | ✅ | ❌ | ~(implicit) | ✅ | ✅ | ✅(both) | ❌ | ❌ |
| 3dprintingcosts.com | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ |

**FACT:** Zero of the 9 directly-inspected tools offer ROI or payback-period output. **FACT:** Zero offer a fleet/multi-printer capacity model analogous to this site's Print Farm ROI. **FACT:** Zero explicitly distinguish SLA vs. MSLA vs. DLP as separate calculation paths (several *mention* the terms, none branch logic on them). **FACT:** No competitor combines depreciation + FEP + IPA + curing-energy + density + support-waste + labor + margin/markup in one model — coverage is consistently partial, 3–6 of these ~9 dimensions per tool.

Sources:
- [PrintPal — Resin Print Cost Calculator](https://printpal.io/tools/resin-print-cost-calculator)
- [LayerMath — Resin 3D Printing Cost Calculator](https://layermath.com/calculator/resin)
- [LayerMath — How to Price Resin 3D Prints](https://layermath.com/blog/how-to-price-resin-prints)
- [GrandpaCAD — Resin Print Cost Calculator](https://grandpacad.com/en/tools/resin-print-cost-calculator)
- [ResinCalc](https://resincalc.com/)
- [Octet3D — Resin Calculator](https://www.octet3d.com/en/resin-calculator)
- [Pea3D — 3D Resin Printing Cost Calculator](https://pea3d.com/en/3d-resin-printing-cost-calculator/)
- [SANIX3D — Resin 3D Print Cost Calculator](https://sanix3d.com/resin-3d-print-cost-calculator/)
- [KingSTL — Resin Print Cost Calculator](https://kingstl.com/resin-print-cost-calculator/)
- [3dprintingcosts.com](https://3dprintingcosts.com/)
- [PrintCal.co — Resin Calculator](https://printcal.co/en/resin-calculator/) (unverified, fetch blocked)

---

## 4. Search-Demand Evidence

**Method:** Live web search only. No search-volume tool was used or fabricated; the evidence below is presence/density of competing pages, recurring query language, and community discussion content, per the brief's explicit instruction not to fabricate search volumes.

**FACT:** Searching "resin 3D printing cost calculator" returns **9 distinct dedicated calculator tools** on the first page of results (not blog posts) — a materially denser field of dedicated tools than most niche calculator categories, indicating active commercial interest in building for this query.

**FACT:** Searching "resin 3D print pricing calculator profit" surfaces explicit pricing-formula content: *"For B2B 3D printing services: (Material Cost + Consumables) × 3 + Machine Hourly Rate"* and *"For Etsy sellers, a minimum of 3× total cost, 4× once you factor in platform fees, packaging, and occasional refunds."* This is recurring, consistent guidance across independent sources (LayerMath blog, CraftsTrack, others), which is itself evidence of a stable, repeated query intent rather than a one-off.

**FACT:** Searching "how much does a resin print cost Etsy seller pricing" surfaces dedicated Etsy-specific resources: a paid Etsy-listing "Resin Pricing Calculator: Cost & Profit Tracker" spreadsheet product, CraftsTrack's "How to Price 3D Prints" and "How to Price Resin Art" guides, and community discussion in the Etsy seller forum. Etsy fee structure is cited consistently (≈10–11% combined fees).

**FACT — important disambiguation:** the term "resin" is heavily overloaded. Several results returned for resin-pricing queries (ArtResin's "How to Price Your Art," "Resin Craft Pricing Calculator: Cost, Margins & Etsy Fees") are about **epoxy/craft resin** (resin art, jewelry, coasters, river tables) — a completely different material, workflow, and audience from 3D-printing photopolymer resin (SLA/MSLA printers). **INFERENCE:** any future page must use precise terminology ("resin 3D print," "SLA," "MSLA") throughout title, H1, and copy, never just "resin," to avoid keyword conflation with the larger and unrelated epoxy-crafts vertical. This is a genuine SEO risk specific to this niche that does not exist for the filament-based cluster.

**FACT:** Searching "resin print farm profitability reddit" surfaces community discussion (r/3Dprintentrepreneur, r/3DPrintFarms per search-result summarization) emphasizing niche product selection, hidden costs (electricity, maintenance), and failure/downtime minimization as the drivers of profitability — consistent with, not contradictory to, this site's existing Print Farm ROI model's emphasis on utilization and failure rate.

**FACT:** Searching `"resin printer" ROI payback reddit` returned **no resin-specific ROI/payback community discussion** — results were dominated by unrelated printer deal listings (Slickdeals, eBay) and industrial/dental ROI calculators (SprintRay, foundry casting) that are not comparable consumer/small-business tools. **INFERENCE:** this is the clearest single piece of evidence in this research that "resin printer ROI/payback" is not an evidenced query cluster, in contrast to "resin print cost/pricing," which is.

**FACT:** Institutional/makerspace resin pricing (Formlabs blog, university makerspace price sheets) uses flat per-gram or per-mL service pricing ($0.10–035/g or $0.15/mL), a simpler model than any consumer calculator inspected — evidence that "true resin cost" modeling is a hobbyist/small-seller concern, not an institutional one.

**Dominant search intent classification (per the brief's A–H list):**

| Intent | Evidence found | Classification |
|---|---|---|
| A. Raw material cost | Present but always a sub-component, never the whole tool | Minor |
| B. True cost per print | **Dominant** — every one of the 9 tools leads with this | **Dominant** |
| C. Selling-price calculation | **Dominant, tightly coupled to B** — 6 of 9 tools output a price | **Dominant** |
| D. Profitability | Present as a secondary output on ~3 of 9 tools | Secondary |
| E. Printer ROI/payback | **Not evidenced** — zero of 9 tools, zero community discussion found | **Absent** |
| F. Resin-vs-FDM comparison | Present only as blog-guide content (e.g., LayerMath's "3–4× higher than FDM"), never as a calculator feature | Content-only, not a calculator intent |
| G. Print-time estimation | Not a standalone intent — always an input, never an output, in every tool inspected | Not an independent intent |
| H. STL/slicer-derived costing | Present in 2 of 9 tools (Octet3D, 3dprintingcosts.com) as a feature, not the primary intent | Minority feature |

**RECOMMENDATION:** Treat the evidenced dominant intent as **B+C combined ("true cost → selling price")**, i.e., a cost-plus job-pricing tool — which is precisely this site's existing Service Pricing calculator's job, applied to a different material. Intent E (ROI/payback), the one angle that would be genuinely non-duplicative against the existing cluster, has the weakest demand evidence of any candidate examined.

---

## 5. Existing Cluster Overlap

| Dimension | Resin candidate (as evidenced) | Business ROI | Print Farm ROI | Service Pricing |
|---|---|---|---|---|
| Primary user | Resin hobbyist/Etsy seller pricing a job | Single-printer side-business owner | Multi-printer operator | Anyone quoting a specific job |
| Primary question | "What should I charge for this resin print?" | "Is my printer/business profitable?" | "Can my fleet support my sales?" | "What should I charge this job?" |
| Inputs | resin mL/price/density, FEP, IPA, curing, print time, electricity, failure, (optionally) depreciation, labor, margin | filament grams, printer cost, useful life, units/month, fees | + printer count, utilization, orders/month | filament grams, printer price, target margin, overhead |
| Dominant output | Selling price ($) or true cost ($) | 24-mo ROI (%) | 24-mo ROI (%) | Recommended price ($) |
| Economic model | Cost-plus, forward-solve for price (as evidenced by 6/9 competitors) | Return-on-investment over time | Fleet-capacity-constrained ROI | Cost-plus, forward-solve for price |
| Time horizon | None (single job) — as evidenced | 12/24/36-month | 12/24/36-month | None (single job) |
| Cost model | Material (density-adjusted) + electricity + resin consumables + optional depreciation/labor | Material + electricity + depreciation + labor | Same, at fleet scale | Material + electricity + depreciation + labor + overhead |
| Failure model | Simple % markup on attempt cost, OR a support/waste % addition (evidenced split across competitors) | % applied to full attempt cost | Same shape | % applied to full attempt cost, plus per-job overhead |
| Pricing model | Solve for price from cost + margin (as evidenced) | N/A — price is an input, ROI is solved | N/A — price is an input, ROI is solved | Solve for price from cost + margin |
| Capacity model | Not evidenced in any competitor | Not modeled | **Modeled (unique to this page)** | Not modeled |
| Investment model | Not evidenced as the dominant job (see §4) | Modeled (printer + setup cost, payback, ROI) | Modeled (fleet-scale) | Not modeled |
| Post-processing model | Curing (energy, some tools) + wash (IPA) — genuinely new categories | Not modeled | Not modeled | Generic "overhead" input only |
| Consumables | **FEP, IPA — genuinely new categories with no analog anywhere in the current cluster** | None | None | None |
| Material units | **Resin mL/density → weight — a genuinely new unit family (see §6)** | Filament grams | Filament grams | Filament grams |
| Distinctive calculations | Density-based volume→weight conversion; FEP-wear-per-print amortization; IPA-per-wash consumable | Payback/ROI over time on one printer | Fleet capacity ceiling, `MIN(capacity, demand)` | Inverse-solve: `price = cost / (1 − fee − margin)` |

**Classification:**

- **Resin candidate (as dominantly evidenced: cost-plus job pricing) ↔ Service Pricing: PARTIAL OVERLAP, trending toward DUPLICATIVE.** Same dependent variable (solve for price from cost + margin), same time horizon (none), same "single job" unit of analysis. The only differences are line-item composition (resin consumables vs. generic overhead) and material-unit conversion (density-adjusted mL vs. grams). Per the brief's own explicit warning, swapping "filament grams" for "resin millilitres" is *not* sufficient differentiation — and the dominant evidenced job here does not go meaningfully further than that swap plus 2–3 new consumable line items.
- **Resin candidate ↔ Business ROI: PARTIAL OVERLAP.** If built around the (weakly-evidenced) ROI/payback angle instead, it would share Business ROI's entire time-horizon/payback/ROI architecture, differing only in material-cost composition (density/FEP/IPA vs. filament grams) — the same "unit swap plus consumables" pattern, one level up the cluster.
- **Resin candidate ↔ Print Farm ROI: DISTINCT if and only if a fleet/capacity dimension were added** — but no competitor evidence supports a "resin print farm capacity" job as distinct from the general print-farm capacity job Print Farm ROI already models generically. Absent new evidence, this would be **PARTIAL OVERLAP** at best.

**INFERENCE:** Under either framing (cost-plus pricing or ROI/payback), a resin calculator's overlap with an existing cluster member is real and non-trivial. The genuinely new material (§6) is real but is currently additive rather than structurally transformative — it changes *what feeds into* an existing formula shape, not the shape itself.

---

## 6. Distinct-Math Analysis

| # | Variable | Classification | Why |
|---|---|---|---|
| 1 | Resin volume in mL (not filament grams) | **REQUIRED** | Slicers report resin jobs in mL; every competitor uses volume, not weight, as the primary material input. Genuinely different from the existing cluster's gram-based model. |
| 2 | Resin price per litre/bottle | **REQUIRED** | Universal market convention (every competitor); direct analog of the existing calculators' price-per-kg, but the source unit differs. |
| 3 | Resin density | **OPTIONAL** | Only 2 of 9 competitors (GrandpaCAD, Pea3D) model density explicitly; most treat "price per bottle" and "volume used" as sufficient without ever converting to weight. Necessary only if the output needs a weight-based figure (e.g., shipping weight) that volume alone can't provide — not necessary for a pure cost calculation. |
| 4 | Support structures' effect on volume | **REQUIRED, but as a % adjustment, not a distinct sub-model** | 3 of 9 competitors (Pea3D, SANIX3D, KingSTL) model this, all as a simple percentage addition (15–35%) to volume/weight — not a structurally separate calculation. |
| 5 | Hollowing/drain-hole implications | **TOO UNRELIABLE TO MODEL** | Zero competitors model this explicitly; it is a slicer-side/design decision that changes the *input* volume the user provides, not a separate calculator variable. Modeling it directly would require geometry awareness the calculator does not have. |
| 6 | Vat residual/resin waste | **TOO UNRELIABLE TO MODEL** | Zero competitors isolate this from general "waste %"; it is highly workflow- and printer-dependent (how a user pours resin back) with no standard industry constant. |
| 7 | Failed-print waste | **REQUIRED** | Already modeled by every existing calculator on this site as a failure-rate-applied-to-attempt-cost pattern; directly reusable, not a new concept. |
| 8 | FEP/release-film consumption | **REQUIRED** | 6 of 9 competitors model this; it has no analog anywhere in the current filament-based cluster (FDM has no consumable film) — the single clearest genuinely-new cost category. |
| 9 | IPA/wash consumable | **REQUIRED** | 6 of 9 competitors model this; same reasoning as FEP — genuinely new, no FDM analog. |
| 10 | UV curing energy/time | **OPTIONAL** | Only 1 of 9 competitors (LayerMath) meters this separately from print-time electricity; most fold it into a flat consumables allowance or ignore it. Real but small in magnitude (curing typically minutes, at similar wattage to the print itself) — optional precision, not foundational. |
| 11 | Gloves, filters, other consumables | **OPTIONAL** | Modeled by roughly half of competitors, always as a small lump-sum "other consumables" catch-all, never broken out further. Reasonable as a single input field, not a reason for a separate model. |
| 12 | Printer/LCD depreciation | **REQUIRED, but not resin-specific** | Modeled by 4 of 9 competitors using the exact same straight-line depreciation shape already implemented in Business ROI and Print Farm ROI (`(price − residual)/life × time`). Reusable formula, not new math. |
| 13 | Build-plate/batch economics | **OPTIONAL** | Only SANIX3D models batch-of-N explicitly. A real differentiator if pursued, but not evidenced as a widely-demanded feature — most competitors are single-print calculators. |
| 14 | Labor/post-processing time | **REQUIRED, but not resin-specific** | Modeled by 4 of 9 competitors, using the same hours×rate shape Business ROI/Service Pricing already use. Curing/washing time could be added to an existing labor-minutes field rather than requiring new math. |
| 15 | Resin-specific failure economics vs. FDM | **REDUNDANT as a distinct model** | The *shape* of failure economics (attemptCost / (1 − failureRate)) is identical to what the existing cluster already implements; only the *typical rate* differs (community discussion suggests resin failure rates are often perceived as higher/more variable than FDM, but this is a default-value/copy question, not a formula question). |
| 16 | Resin consumables burden not modeled elsewhere | **REQUIRED (this is the actual differentiator)** | FEP + IPA together are the one genuinely new cost category with zero counterpart anywhere in the current cluster (see #8, #9). This is real and defensible. |
| 17 | Whether slicer-reported volume already includes supports | **TOO UNRELIABLE TO MODEL as a formula; REQUIRED as an FAQ/instructional clarification** | This varies by slicer (Lychee, Chitubox, PrusaSlicer resin mode, etc.) and cannot be reliably auto-detected from a manually-entered number. Best handled as user guidance (§13 FAQ), not a formula branch. |
| 18 | Double-counting risk: generic "waste %" plus support/failure inputs together | **Genuine design risk, not a variable** | If a future model included both a generic "waste allowance %" AND a separate support-volume adjustment AND a failure rate, without clear definitional boundaries, it would double- or triple-count the same physical loss under three different names — several competitors (Pea3D, SANIX3D) blur exactly this line already. Any future formula spec must define these as mutually exclusive, not stack them by default. |

**INFERENCE — the actual distinct-math verdict:** There is a mathematically defensible, non-trivial variable set (FEP + IPA + density-adjusted mL, req'd; support-%, curing-energy, batch-N, optional) that goes meaningfully beyond a pure unit conversion. **However**, once assembled, that variable set plugs into the *same* cost-aggregation → (failure-adjusted cost) → (cost-plus price, OR investment payback/ROI) architecture the existing three calculators already use. The math is **incrementally distinct** (new inputs, same output architecture), not **structurally distinct** in the way Print Farm ROI's capacity-constraint model is structurally distinct from Business ROI's unconstrained model. This is the central finding driving the DEFER decision in §16.

---

## 7. Candidate Formula Architectures

None of these are to be implemented in this phase. Each is evaluated against the evidence gathered above, not assumed correct in advance.

### MODEL A — Resin True Cost (parallels Business ROI's cost engine, without ROI/payback)

- **Inputs:** resin bottle price, bottle volume (mL), model volume (mL, user-entered from slicer), print time, printer wattage, electricity rate, FEP cost + prints-per-sheet, IPA cost per wash, failure rate %.
- **Outputs:** cost per successful print (itemized: resin, electricity, FEP, IPA, failure allowance), resin cost per mL.
- **Formulas (candidate, not final):**
  - `resinCostPerPrint = (bottlePrice / bottleVolumeML) × modelVolumeML`
  - `fepCostPerPrint = fepSheetCost / printsPerSheet`
  - `ipaCostPerPrint = ipaCostPerWash` (flat, or scaled by a wash-volume input)
  - `electricityCostPerPrint = (wattage/1000) × printTimeHours × electricityRate`
  - `attemptCost = resinCostPerPrint + fepCostPerPrint + ipaCostPerPrint + electricityCostPerPrint`
  - `costPerSuccess = attemptCost / (1 − failureRate)`
- **Units:** mL for resin/IPA, $ for all costs, hours for time.
- **Edge cases:** `bottleVolumeML = 0` (divide-by-zero guard, same pattern as existing calculators); `failureRate ≥ 1` (same "no successful prints" branch already implemented on all 3 current pages).
- **What makes it distinct:** FEP + IPA line items have zero analog in the current cluster.
- **Overlap with existing cluster:** structurally identical in shape to the *cost-computation half* of Business ROI (before payback/ROI is layered on) — i.e., this model alone is closer to "Business ROI's engine minus the investment/payback/ROI half" than to a new tool.
- **Recommendation score: 5/10** — real new inputs, but as a standalone tool it would output only a cost figure, which is thinner than any existing cluster page (all three currently produce a dominant %, or $ price, not a bare cost).

### MODEL B — Resin Service Pricing (parallels Service Pricing exactly)

- **Inputs:** Model A's inputs, plus labor rate + post-processing minutes, platform fee %, target margin %.
- **Outputs:** recommended selling price, minimum viable price, margin %, cost breakdown table.
- **Formulas (candidate):**
  - `costBeforeFees = costPerSuccess (from Model A) + laborCost`
  - `recommendedPrice = costBeforeFees / (1 − platformFeeRate − targetMarginRate)` — **identical in shape to Service Pricing's existing formula** (`recommendedPrice = costBeforeFees/(1-platformFeeRate-targetMarginRate)`).
- **What makes it distinct:** only the FEP/IPA line items feeding into `costBeforeFees`; the pricing algebra itself is unchanged from Service Pricing.
- **Overlap with existing cluster:** **High — this is Service Pricing with two new cost-input rows.** This is the model that best matches the dominantly-evidenced competitor job (§3, §4), and is also the one with the weakest differentiation case.
- **Recommendation score: 3/10** — closest fit to evidenced demand, but the highest duplication risk of the three models; would likely read to a careful reviewer (or to Google) as "Service Pricing again, with different inputs," the exact pattern this program's own Phase 5/7F/7H work has been careful to avoid elsewhere on the site.

### MODEL C — Resin Print Profitability / ROI (parallels Business ROI or Print Farm ROI)

- **Inputs:** Model A's inputs, plus printer purchase price, useful life, residual value, monthly print volume, selling price, monthly fixed costs.
- **Outputs:** monthly operating profit, payback period, 12/24/36-month ROI, break-even prints/month.
- **Formulas (candidate):** same payback/ROI algebra already implemented in Business ROI (`monthlyCashProfit = operatingProfit + depreciation×units`; `roiPct(months) = ((cashProfit×months − investment)/investment)×100`), with `attemptCost` sourced from Model A's resin-specific line items instead of filament grams.
- **What makes it distinct:** the ROI/payback framing itself is not offered by any of the 9 competitors inspected — genuinely novel relative to the competitive field.
- **Overlap with existing cluster:** **Very high — this is Business ROI's exact payback/ROI engine with Model A's cost inputs substituted in.** The novelty is competitive (nobody else does this), not architectural (this site already does this, for a different material).
- **Recommendation score: 4/10** — most competitively novel, but weakest demand evidence (§4) and the least original relative to this site's own existing architecture.

**BEST FUTURE MODEL: NO DISTINCT MODEL.**

**INFERENCE:** All three candidates are the existing cluster's own formula shapes (cost aggregation → failure adjustment → either cost-plus pricing or investment ROI) with resin-specific line items substituted for filament-specific ones. None represents a new economic *question* the way Print Farm ROI's capacity constraint did relative to Business ROI. This is the most important single finding of §6–7 and is the primary driver of the DEFER decision.

---

## 8. STL / Slicer Integration

**FACT:** 2 of 9 inspected competitors (Octet3D, 3dprintingcosts.com) ship client-side STL (and in one case 3MF/OBJ/PLY/G-code) volume parsing today, explicitly advertised as "no server upload" / "runs in your browser."

**FACT (general web research):** Browser-only STL volume calculation is a well-established, solved technique — parsing the STL triangle mesh and summing signed tetrahedron volumes — implemented in numerous open-source examples. It does not strictly require Three.js for volume-only extraction (Three.js is used by inspected examples primarily for optional 3D *rendering/preview*, not for the volume-sum math itself), but a hand-rolled parser is still real, non-trivial client-side code — parsing binary and ASCII STL formats correctly, handling malformed files, and validating mesh closure (an open/non-manifold mesh produces a meaningless volume sum) — of a kind this site has never shipped anywhere in its current architecture (every existing calculator, across all verticals, is a plain numeric form with zero file I/O).

Evaluation against the brief's checklist:

- **Can resin volume be obtained from slicer output without file upload?** Yes — this is what most competitors above actually do: the user reads a number off their own slicer's UI and types it in. This fully satisfies the accuracy need without any file-parsing engineering.
- **Could browser-only STL volume calculation be done safely?** Yes, technically — no server round-trip is required, so no privacy/upload risk in principle.
- **Would STL upload materially improve search/user value?** Marginally. It removes one manual step (reading a number off a slicer) but does not change the *economic* output at all — the calculator's math is identical whether the mL figure arrives by typing or by parsing. It also would not capture supports/hollowing correctly unless the *uploaded* file is already the sliced/support-added model (most users export pre-support STLs from CAD, then slice separately) — so it risks giving a falsely precise-looking number that's actually missing the exact support volume the slicer would add.
- **Would it create unnecessary technical complexity?** Yes, relative to every other calculator this site has ever shipped — new file-input UI, mesh validation, error handling for malformed/non-manifold files, and unit-handling (STL files carry no inherent unit — mm vs. inch ambiguity is a known, unsolved-by-convention problem in the STL format itself) that no existing calculator on this site has ever needed to handle.
- **Would it require a new dependency such as Three.js?** Not strictly for volume-only math, but very likely in practice for acceptable UX (drag-and-drop, error feedback, and — if ever wanted — a visual preview), which would be the first external JS dependency of any kind on this static, dependency-free site.
- **Would it create accessibility/performance concerns?** Yes — large STL files (multi-MB, common for detailed miniatures) parsed synchronously in-browser can visibly block or slow low-end devices; would need explicit async/worker handling this site's architecture has never required before.
- **Would it create security/privacy concerns?** Low, if kept genuinely client-side (consistent with this site's existing "no account, no server calculation" privacy positioning) — but the *appearance* of file upload can itself create user hesitation even when processing is local, unless clearly labeled.
- **Would it materially differentiate the calculator?** Only weakly — it's a UX convenience matching 2 of 9 competitors, not a new economic capability; the resin-specific *cost model* (§6–7) is where the real differentiation opportunity lies, independent of how the mL number reaches the form.

**RECOMMENDATION: DO NOT IMPLEMENT.** A manually-entered resin-volume field (matching 7 of 9 competitors, including the most complete ones like Octet3D and LayerMath, which offer STL/manual entry side by side or manual-only) fully serves the evidenced job at a fraction of the engineering and dependency cost, and avoids introducing this site's first external JS dependency and first client-side file-parsing surface for a benefit that is convenience-level, not economic-model-level.

---

## 9. User / Job-to-be-Done

Candidates evaluated against fit with roicalculator.live, the existing cluster, calculation intent, SEO/AEO opportunity, AdSense-safe utility, and technical feasibility:

| Candidate persona | Fit assessment |
|---|---|
| Resin miniature seller / Etsy resin seller | **Strongest fit.** Directly matches the dominant evidenced competitor job (§3–4) and the Etsy-specific pricing content found in demand research. Calculation-intent-heavy (wants a number, not a guide), matching this site's existing calculator-first pattern. |
| Hobbyist (no selling intent) | Weak fit for a *calculator* — a hobbyist tracking pure material cost has no pricing/margin question, which is most of what makes this cluster's calculators non-trivial; better served by existing general cost content, not a new tool. |
| Miniature painter / tabletop gaming maker | Overlaps heavily with the Etsy-seller persona when they sell their prints; as a pure painting-only persona (not printing), out of scope for a *3D-printing* cost calculator entirely. |
| Jewelry/model maker | Niche subset of the Etsy-seller persona; no distinct economics found in research beyond what a general resin-seller model would cover. |
| Dental/professional user | Poor fit — professional/dental resin workflows (per the SprintRay/foundry ROI tools surfaced in §4) operate at a cost and precision scale (multi-thousand-dollar printers, regulatory/clinical constraints) misaligned with this site's consumer/small-business calculator positioning; also raises liability concerns (dental cost modeling adjacent to medical claims) this site should not take on. |
| Resin print service (quoting jobs) | Strong fit for Model B specifically, but as shown in §5–7, this is the framing with the highest overlap risk against the existing Service Pricing calculator. |
| Resin print farm | Weak additional evidence beyond what Print Farm ROI's generic model already covers (§5); no resin-specific fleet/capacity economics were found in any competitor. |
| Maker comparing resin vs. FDM | Real content interest exists (LayerMath's "3–4× higher than FDM" claim, community discussion) but this is an **editorial/comparison-page job**, not a calculator job — it does not require new formula math, only comparative content (potentially a `/comparisons/` page, out of scope for this cluster). |

**RECOMMENDED PRIMARY PERSONA:** Resin miniature/model seller pricing their own work (the Etsy-seller archetype) — the persona with the strongest, most directly evidenced job-to-be-done and the best fit with this site's existing "give me a number" calculator pattern.

**RECOMMENDED SECONDARY PERSONA:** A small resin print-service operator quoting one-off customer jobs — functionally the same persona as Service Pricing's existing audience, applied to resin instead of filament, which is precisely why this persona pairing reinforces (rather than resolves) the overlap risk identified in §5 and §7 (Model B).

---

## 10. Differentiation

**Method note:** all claims below are grounded in the direct competitor inspection in §3, not asserted in the abstract.

**TOP 3 REALISTIC DIFFERENTIATORS:**

1. **A genuinely complete consumables model in one tool.** No single inspected competitor combines depreciation + FEP + IPA + curing-energy + support/waste + labor + margin/markup (§3.11 table — every tool covers 3–6 of these 9 dimensions, none covers all). A future tool that assembled all of them (learning from which specific line items each competitor got right) would be more complete than any single existing tool, without needing new math beyond what §6–7 already lays out.
2. **Explicit, correct margin-vs-markup distinction, paired with the site's existing methodology transparency.** Only 2 of 9 competitors (Octet3D, KingSTL) explicitly teach this distinction — this site's Service Pricing calculator already does, correctly, and a resin tool could inherit that same clear, honest framing plus a visible formula (most competitors hide their formula; only ResinCalc and KingSTL show one explicitly).
3. **No-account, fully client-side calculation with transparent methodology, integrated into an existing, credible 3-tool cluster** — rather than a single standalone tool competing purely on being "free" (which nearly every competitor already is). Being the 4th tool in a coherent, well-linked cluster (hub + symmetric sibling links, per Phases 6/8A/8E) is a structural advantage no standalone competitor tool has.

**TOP 3 THINGS WE SHOULD NOT TRY TO COMPETE ON:**

1. **STL/file-upload parsing.** Per §8, only 2 of 9 competitors have it, it is not evidenced as demand-driving, and it would be this site's first external dependency and first file-parsing surface — a poor trade for a convenience-level feature.
2. **Batch-of-N / printer-preset conveniences (SANIX3D's specialty).** Real but narrow; replicating it adds UI complexity without addressing the core differentiation question (§6–7's finding that the underlying math is not yet distinct enough to justify a new page at all).
3. **Being "the most free" or fastest.** Nearly every competitor is already free, ad-supported or not; this is not a defensible or evidenced axis of differentiation and should not drive any future positioning or copy.

---

## 11. SEO / AEO Architecture (if GO — informational only, not authorized)

Not authorized in this phase; presented only because the brief requests it be worked through as part of the research, in case the decision maker in a future phase revisits GO. **This section does not authorize or recommend building now** — see §16.

**Candidate URL comparison:**

| URL | Search intent match | Cluster semantics | Title uniqueness risk | Doorway risk |
|---|---|---|---|---|
| `/3d-printing/resin-cost-calculator.html` | Matches dominant intent (B, "true cost") | Fits sibling naming (`roi-calculator.html`, `service-pricing-calculator.html` pattern uses job-name, not material-name) | Low | Moderate — "cost calculator" alone is the single most crowded phrase in §3 |
| `/3d-printing/resin-print-pricing-calculator.html` | Matches combined B+C intent (cost → price) | Best matches the *combined* dominant intent found in §4 | Low | Moderate — closest to Service Pricing's own naming pattern, reinforcing §5's overlap finding at the URL level too |
| `/3d-printing/resin-roi-calculator.html` | Matches the weakly-evidenced ROI intent (§4, §7 Model C) | Matches Business/Farm ROI naming pattern exactly | Low | Lower doorway risk (less crowded competitive phrase) but weakest demand match |

**RECOMMENDATION (conditional, not authorized):** *If* a future phase pursues this, `resin-print-pricing-calculator.html` most honestly matches the evidenced dominant intent — but doing so directly inherits this report's central overlap concern (§5, §7 Model B) and should not proceed without first resolving that overlap question at the product level, which is exactly what this DEFER is withholding a decision on.

No title/H1/meta/keyword set is being finalized here, consistent with "no GO decision" in §16.

---

## 12. Future Content Architecture

Not authorized; provided at the structural level only, per the brief's request, to inform a possible future phase.

Following the site's established post-Phase-7E architecture (HEADER → HERO → CALCULATOR → DOMINANT RESULT → INTERPRETATION → METHODOLOGY → SUPPORTING CONTENT → LIMITATIONS → FAQ → RELATED TOOLS):

- **HERO:** must state the specific job (pricing a resin print, or resin printer payback — whichever model a future phase actually selects) — not a generic "resin 3D printing" framing, consistent with §4's disambiguation risk.
- **CALCULATOR:** grouped inputs mirroring the existing cluster's `form-row` pattern (resin/consumables, machine/electricity, labor/fees) — no new input-grouping paradigm needed.
- **DOMINANT RESULT:** whichever single output matches the model chosen in §7 (price, cost, or ROI %) — must not attempt to show all three as equally dominant, per this site's existing single-dominant-result discipline (Phase 8D).
- **INTERPRETATION:** plain-prose sentence, no evaluative language, matching the existing three calculators' `buildInterpretation()` pattern exactly.
- **METHODOLOGY:** must explicitly explain the resin-specific line items (FEP amortization, IPA-per-wash, density conversion if used) since these are genuinely unfamiliar to a reader who has only used the filament-based siblings.
- **SUPPORTING CONTENT / LIMITATIONS:** must disclose the exact same category of caveat every competitor in §3 disclosed informally ("real cost varies by resin brand, wash/cure routine, printer" — SANIX3D's own words) as a formal Limitations section, matching this site's existing Business ROI/Print Farm ROI pattern.
- **FAQ:** see §13.
- **RELATED TOOLS:** must link back to the hub and, per this cluster's now-established symmetric-linking discipline (Phase 8A), forward to whichever existing calculator shares the closest job (Service Pricing if Model B, Business ROI if Model C).

**Must NOT include** (per brief, and consistent with this site's sitewide AEO discipline verified clean across the whole cluster in Phases 5, 7E–7H, 8):
- No "What is ROI?" unless the selected model is genuinely ROI-primary (Model C only).
- No generic "What is 3D printing?" or "What is resin?" — not evidenced as necessary by any FAQ research in §13.
- No generic resin-industry essay.
- No generic/boilerplate FAQ.
- No Quick Answer / AI Answer box, no hidden SEO text — matching the zero instances of these found anywhere in the current cluster (Phase 5 §16, Phase 8 review §7).
- No redundant restatement of the calculator's own visible methodology inside the FAQ.

---

## 13. FAQ Research

Derived from genuine calculator uncertainty surfaced repeatedly across the competitor research in §3 and the distinct-math analysis in §6 — not invented.

**Recommended 4 FAQ questions (if a future phase proceeds with GO):**

1. **"Does my slicer's reported resin volume already include supports?"** — directly answers the ambiguity identified in §6, item 17 (varies by slicer, cannot be auto-detected, genuinely confuses users moving between slicers).
2. **"Why do FEP film and IPA wash count as separate costs from the resin itself?"** — addresses the single most-repeated theme across competitor research (§3: 6 of 9 tools model these; §4: multiple sources state resin's *true* cost is 3–4× the raw resin price) — genuinely necessary because this is the site's one calculator with consumables the reader has not seen justified anywhere else in the cluster.
3. **"How does resin failure/waste affect the cost per successful print?"** — mirrors the existing cluster's own established FAQ pattern (identical question already answered, for filament, on both Business ROI and Print Farm ROI) — necessary for consistency and because §6 item 18 shows this is a genuine, easy-to-double-count area.
4. **"How is resin printing's cost structure different from the filament-based calculators on this site?"** — a genuinely necessary orientation question *unique to this cluster* (no sibling calculator has ever needed to explain itself relative to a same-cluster sibling before), directly serving a reader arriving from the hub or from one of the filament calculators.

**Explicitly rejected (per brief's instruction, and confirmed unnecessary by research):** "What is ROI?", "What is 3D printing?", "What is resin?" — none of the competitor FAQs, blog guides, or community discussion surfaced in this research treat these as live points of confusion for this audience; the audience researched here already knows what resin printing is (they are already doing it) and needs cost-model clarity, not category definitions.

---

## 14. AdSense / Content-Quality Test

**Risk assessment:**

| Risk | Assessment | Basis |
|---|---|---|
| Thin calculator page | **Moderate risk if Model A alone (bare cost, no price/ROI) were shipped** — a cost-only output is thinner than every existing cluster page, each of which produces a dominant %, or $ price, plus 4+ supporting metrics | §7 |
| Doorway page | **Real risk under Model B** (near-duplicate of Service Pricing) | §5, §7 |
| Duplicate content | Would need entirely fresh methodology/FAQ copy (not templated from existing pages) to avoid this — feasible but not yet done | §12–13 |
| Generic generated copy | Not a risk from this program's own generator (`generate-calculators.mjs`) — this cluster is explicitly hand-authored, outside the generator, per repeated prior-phase instruction | Prior-phase context |
| Affiliate/commercial bias | **Real external pattern to avoid:** GrandpaCAD and Pea3D-style competitors carry affiliate links to equipment suppliers (§3.6) — this site's zero-ads, zero-affiliate policy (confirmed sitewide in Phase 7F) must be explicitly preserved if this is ever built |
| Exaggerated profitability claims | Low risk if the existing cluster's plain-prose, non-evaluative interpretation pattern (`buildInterpretation()`) is reused verbatim in style |
| Misleading defaults | Would need dedicated default-value research (resin price/L, typical print time, typical failure rate) — not performed in this phase; would be required before any implementation |
| Unsupported industry benchmarks | SANIX3D's own explicit disclaimer ("real cost varies... approximate result") is worth adopting verbatim in spirit — several competitors present fixed density/consumables constants as if universal when they are brand/workflow-dependent |

**RECOMMENDATION (safeguards, if ever pursued):** (1) do not ship a cost-only dominant result — pair it with either price or ROI, per whichever model is chosen; (2) write fully original methodology/FAQ copy, not adapted from any competitor's language; (3) explicitly disclose that resin brand/settings materially change real-world results, matching the existing cluster's "not financial or investment advice" and methodology-transparency discipline; (4) no affiliate links, ever, matching sitewide policy. **AdSense itself: not evaluated for enablement in this phase, consistent with the brief — this program does not recommend enabling AdSense in any calculator phase without separate, explicit product authorization.**

---

## 15. Competitive Gap Scorecard

| Candidate capability | Existing competitors | Existing cluster | Opportunity |
|---|---|---|---|
| Resin material cost | HIGH coverage (9/9) | NONE | LOW — saturated externally, zero internal presence |
| True resin production cost (all-in) | MEDIUM coverage (no single tool is complete, §3.11) | NONE | MEDIUM — completeness gap exists but is incremental, not structural |
| Failure economics | HIGH coverage (7/9) | Present, but filament-only | LOW — same formula shape as existing cluster |
| Consumables (FEP/IPA) | HIGH coverage (6/9 for both) | NONE | MEDIUM — genuinely new to this site, well-covered externally |
| FEP/release film specifically | HIGH (6/9) | NONE | LOW-MEDIUM — externally saturated |
| Wash/cure | MEDIUM (IPA: 6/9; curing energy: 1/9) | NONE | MEDIUM — curing-energy specifically is under-modeled even externally |
| Labor | MEDIUM (4/9) | Present, filament-only | LOW — same shape as existing cluster |
| Depreciation | MEDIUM (4/9) | Present, filament-only | LOW — same shape as existing cluster |
| Pricing (cost-plus) | HIGH (6/9) | Present (Service Pricing) | LOW — direct overlap, per §5 |
| Margin | MEDIUM (explicit distinction: 2/9) | Present (Service Pricing) | LOW — direct overlap |
| Batch economics | LOW (1/9 — SANIX3D) | NONE | MEDIUM — genuine external gap, but narrow/optional (§6 item 13) |
| ROI/payback | **NONE (0/9)** | Present (Business ROI, Print Farm ROI) | **HIGH externally, but LOW internally** — the one clear external gap, undermined by weak demand evidence (§4) and high internal overlap with existing tools (§5, §7 Model C) |
| STL parsing | LOW (2/9) | NONE | LOW — not evidenced as demand-driving (§8) |
| Slicer-derived volume (manual entry) | HIGH (dominant pattern, 7/9) | NONE | MEDIUM — this is the actual, low-complexity way to bring resin material handling into the cluster, if pursued |
| Resin-vs-FDM comparison | LOW (content-only, no calculator) | NONE | LOW — an editorial/comparison-page opportunity, not a calculator opportunity (§9) |

---

## 16. GO / DEFER / REJECT Decision

Applying the brief's exact decision framework:

**Demand:** Real and demonstrated for the *general resin cost/pricing* job (9 live competitor tools, dense recurring query language, active Etsy-seller content ecosystem) — but concentrated on a job (cost-plus job pricing) that already exists on this site in a different material, and weak-to-absent for the one job (ROI/payback) that would not overlap with an existing tool.

**Distinct job:** Not established. The dominantly-evidenced job (§4: intents B+C) maps onto Service Pricing's existing job with a different material. The one non-overlapping job (ROI/payback) is not the evidenced demand.

**Distinct math:** Real but incremental, not structural (§6–7). New required variables exist (resin mL/density, FEP, IPA) but they plug into the *same* cost-aggregation-then-price-or-ROI architecture already implemented three times on this site. No candidate model in §7 introduces a new economic question the way Print Farm ROI's capacity constraint did.

**Doorway/thin-content risk:** Real and specific — Model B (the best demand fit) is the highest-overlap candidate against Service Pricing; Model A alone would be thinner than any existing cluster page; Model C (least overlap) has the weakest demand support.

**Architecture fit:** Good, provided STL upload is avoided (§8) — a manually-entered resin-volume field fits the existing static, dependency-free, client-side calculator pattern with no new engineering pattern required.

**Differentiation:** Credible only at the level of "more complete than any single competitor" (§10) — real, but not yet validated as strong enough to overcome the overlap risk identified above.

Per the brief's framework: this is not a REJECT (demand is not weak in absolute terms, and the FEP/IPA/density variable set is a genuine, evidenced, non-trivial addition — not "basically a unit conversion" on its own). It is also not a GO (the dominantly-evidenced job would duplicate Service Pricing's architecture closely enough to recreate the exact low-differentiation pattern this program has worked to eliminate elsewhere on the site in Phases 7F–7H, and the one job that would clearly avoid that has the weakest demand evidence found in this entire research).

This matches DEFER exactly: **"demand exists but evidence is insufficient [for the specific, non-overlapping job]; the math is promising but requires more research [to resolve the Model A/B/C product choice]; the opportunity is plausible but not yet strong enough."**

### FINAL DECISION: DEFER

---

## 17. Recommended Next Phase

Not applicable — the decision is DEFER, not GO. Per the brief, Phase 9 (resin calculator implementation) is explicitly **not** being defined in this report.

**Why implementation should not begin:** the central open question this research could not resolve on its own — *which job the calculator should serve* — is a product decision, not a research question, and the evidence here shows the two realistic answers pull in opposite directions: the best-evidenced job (cost-plus pricing) has the highest duplication risk against Service Pricing, while the least-duplicative job (ROI/payback) has the weakest evidenced demand. Proceeding to implementation without resolving that tension first would risk recreating a doorway/thin-differentiation pattern this program has explicitly worked to eliminate elsewhere (Phases 7F–7H). A future phase could responsibly revisit GO only if either (a) new evidence more clearly establishes real user demand specifically for resin printer ROI/payback (not just resin cost/pricing), strengthening Model C's case despite its architectural overlap, or (b) a genuinely novel angle for Model B is identified that goes beyond "Service Pricing with resin inputs" — neither of which this research phase can manufacture on its own.

---

## 18. Risks and Unknowns

- **Keyword ambiguity (§4):** "resin" collides with the unrelated epoxy/craft-resin vertical in search results; any future implementation must use precise SLA/MSLA/"resin 3D print" terminology throughout, or risk attracting the wrong audience/intent entirely.
- **Default-value risk:** no dedicated research was performed in this phase on realistic default resin price/L, print time, or failure-rate values (out of scope for a demand/architecture research phase) — this would be required before any implementation phase, following this site's existing discipline of evidence-based, non-misleading calculator defaults.
- **PrintCal.co unverified:** one of the 10 named competitors could not be directly inspected (HTTP 403); this report does not rely on it for any conclusion, but a future phase should attempt re-inspection if it becomes decision-relevant.
- **Demand-evidence method limits:** per the brief's explicit instruction, no search-volume tool was used; the demand conclusions in §4 rest on competitor density and query-language recurrence, which is directionally reliable but not a quantified traffic estimate. A future phase with access to real keyword-volume data could sharpen (or overturn) the DEFER call.
- **Community-research limits:** general web search does not reliably surface individual Reddit thread content; the Reddit-specific findings in §4 are summarized from search-result metadata, not direct thread reads, and should be treated as directional rather than exhaustive.

---

## 19. Repository Safety Audit

- **Only file created/changed by this phase:** `reports/audits/PHASE-3D-PRINTING-08F-RESIN-DEMAND-RESEARCH.md`.
- No HTML changed. No JS changed. No CSS changed. No sitemap changed. No navigation changed. No redirects changed. No schema changed. No package/dependency file changed. No template or generator file changed.
- No new production URL was created. No resin calculator was built. The 3D-printing hub was not modified. Global navigation was not modified. AdSense was not enabled.
- `git status --short` immediately before commit (see final report below) will show exactly one new, untracked file.

**IMPLEMENTATION NOT AUTHORIZED IN THIS PHASE.**
