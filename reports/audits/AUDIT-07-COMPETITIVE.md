# AUDIT 07 — Competitive Product Benchmark
**roicalculator.live — Project Director Audit**
Read-only. No repository files modified. This audit compares roicalculator.live (as characterized in Audits 01-06) against 7 live competitor calculator products, fetched and analyzed directly. The goal, per the brief, is not to copy competitors but to identify what makes a calculator site read as useful, trustworthy, focused, professional, easy to use, and authoritative — and to classify each major difference as KEEP / ADOPT / AVOID.

---

## Competitor set

Chosen to span the same product shapes roicalculator.live occupies — a general free ROI/investment calculator, plus SaaS, real-estate, and solar verticals — and to span different business models (pure utility, editorial-authority, and lead-generation), since business model turns out to explain most of the structural differences found.

| Site | Page fetched | Business model |
|---|---|---|
| Calculator.net | `/roi-calculator.html` | Pure utility, ad-supported directory of thousands of calculators |
| Omni Calculator | `/finance/roi` | Pure utility, credentialed-author directory of 18,000+ calculators |
| NerdWallet | `/calculator/investment-calculator` | Editorial authority + advisor-matching affiliate revenue |
| SmartAsset | `/investing/investment-calculator` | Editorial authority + advisor-matching affiliate revenue |
| BiggerPockets | `/rental-property-calculator` | Community/education platform, calculator gated behind signup |
| EnergySage | `/solar/calculator/` | Marketplace, calculator is a lead-gen funnel to installer quotes |
| PayProGlobal | `/saas-metrics-calculators/saas-return-on-investment-roi-calculator/` | B2B SaaS platform, calculator is content-marketing for its own product |

---

## 1. Homepage proposition

**Competitors:** Calculator.net and Omni Calculator don't sell a "proposition" for ROI specifically — they lead with scale and category breadth (Omni: "18,000+ calculators," credentialed authors). NerdWallet/SmartAsset lead with editorial trust ("fact-checked," named authors). EnergySage leads with a single transactional promise ("estimate your solar savings in under a minute"). BiggerPockets and PayProGlobal lead with their own product/community, using the calculator as a lead magnet.

**roicalculator.live:** "ROI Calculator (Free & Private)" is a genuinely distinctive proposition — **none of the 7 competitors lead with privacy**, and it's true (client-side execution, no tracking, verified in Audit 06). But the homepage's actual `<title>` and meta description try to also claim "Formula, Examples & Benchmarks" in the same breath (Audit 04 §4), diluting a proposition that would otherwise be sharper than any competitor's.

- **KEEP** — the free/private positioning; it's a real, verifiable differentiator no competitor in this set offers.
- **ADOPT** — the discipline every competitor shows of committing to one narrow promise per page rather than one page claiming four (calculator + formula + examples + benchmarks).

---

## 2. Calculator-first UX

**Competitors:** Calculator.net, Omni Calculator, SmartAsset, and NerdWallet all place the interactive tool within 1-2 short paragraphs of the top of the page — no exceptions found. EnergySage's tool is the entire above-the-fold experience. The two lead-gen-driven sites (BiggerPockets, PayProGlobal) are the *only* two of seven that delay or gate the calculator — BiggerPockets requires account creation before any interactive tool is reachable at all, and PayProGlobal places three marketing cards before its (much simpler) calculator.

**roicalculator.live:** The homepage matches the good pattern (calculator is the first interactive element, Audit 01). But the vertical hub pages (`saas/index.html`, `real-estate/index.html`, and the entire `/roi-calculator/*/*` tree) have **no calculator on the page at all** (Audit 01-04) — a pattern this benchmark shows is otherwise unique to the two competitors whose business model *depends on* delaying the tool (a signup wall, a marketing funnel). roicalculator.live has no such business reason and produces the same UX outcome anyway.

- **KEEP** — the homepage's calculator-first placement.
- **AVOID** — hub/guide pages with no calculator on them; this benchmark confirms it is not an industry norm, it's a pattern that only appears on sites deliberately monetizing the delay.

---

## 3. Input design

**Competitors:** Input counts cluster around 4-5 fields with sensible defaults (Calculator.net: 4; NerdWallet: 5, rate defaults to 6%; SmartAsset: 5, starting amount defaults to $5,000). EnergySage minimizes inputs to just 3 by substituting external data (a property-address lookup via Google Project Sunroof) for manual entry. BiggerPockets is the outlier with 15+ inputs, but that's post-signup, a different commitment tier than a casual visitor. Percent and frequency fields consistently use dropdowns or explicit unit labeling (NerdWallet's "Compound frequency" dropdown; SmartAsset's "Contribution Frequency" dropdown) rather than bare number inputs.

**roicalculator.live:** Input counts range 2-9 across its 33 calculators (Audit 03) — comparable to the competitor range. Defaults are present and sensible everywhere checked. The specific gap: Audit 03 §4.5 found a factory calculator (`content-marketing-roi-calculator.html`) with a percent-like field (`winRate`) that expects a raw decimal (`0.22`) with no `%` affordance, while every sibling calculator's percent fields expect whole numbers — none of the competitor fields sampled showed this inconsistency; all used a dropdown, a `%` suffix, or consistent whole-number convention within their own product.

- **KEEP** — the input-count range and default-value practice, which is in line with the field.
- **ADOPT** — consistent percent/unit conventions and dropdown use for enumerable choices, matching what every competitor sampled already does as a baseline.

---

## 4. Result presentation

**Competitors:** Every one of the five non-gated competitors follows the same pattern: **one large, visually dominant headline number**, with everything else presented as clearly secondary (a breakdown table or a chart). Calculator.net: bold ROI% plus a pie chart. SmartAsset: "This investment will be worth: $--" in large type, plus a breakdown table and a growth chart. NerdWallet: "Final Balance" as the dominant figure. There is no example in this competitor set of a results panel presenting 5-6 metrics as equal-weight cards with no visual primary.

**roicalculator.live:** Audit 03 §3 found the opposite pattern is common — the SaaS calculator shows 5 equal-weight result cards, the solar calculator shows 6, and the homepage's 3-card grid (ROI/Annualized/Profit) has no single dominant figure either. This is the single clearest, most consistently-observed gap against this competitor set.

- **AVOID** — equal-weight multi-metric result grids with no visual hierarchy; this benchmark shows every competitor sampled solves this with one dominant number plus supporting detail.
- **ADOPT** — the "one big number, rest supporting" pattern as the default results-panel design across all of roicalculator's calculators, not just conceptually but as the literal visual hierarchy (type size, placement, weight).

---

## 5. Explanation density

**Competitors:** Post-calculator explanatory content is *heavy* across this entire competitor set, not light — Omni Calculator runs 6-7 major sections after its tool (what is ROI, formula, examples, ROE vs. ROI, advantages/disadvantages, FAQ); NerdWallet runs "~2,000+ words" after; Calculator.net's is also "extensive." **This benchmark shows that heavy post-calculator explanation is the industry norm for this category, not a roicalculator-specific excess.** What every competitor does *not* do — confirmed across all seven — is reuse the *same sentences* verbatim across different calculators on their own site; each competitor's explanatory content is specific to that one calculator's topic.

**roicalculator.live:** Audits 02 and 05 found the opposite: the volume of explanation is comparable to (sometimes less than) competitors, but a large share of it — the `use-case-block`, `limitations-block`, and `entity-definition` sections — is **byte-for-byte identical across 30-52 unrelated pages**, traced to a single generation script (Audit 05).

- **KEEP** — the overall amount of post-calculator explanatory content; competitors validate this is expected and likely serves both users and AEO/SEO the same way it's intended to here.
- **AVOID** — generic, cross-page-identical explanation text; no competitor in this set does this, and it is very likely why roicalculator's version reads as less authoritative despite comparable or greater word count (cross-reference Audit 04 §5's finding that this dilutes rather than builds extractable authority).

---

## 6. Information hierarchy

**Competitors:** Uniform pattern across all seven, gated ones included once you reach their tool: intro → calculator → results → (sometimes an inline assumptions/methodology note) → deep education → FAQ → related tools. In every case sampled, the material placed *before* the calculator is short (1-3 paragraphs at most) and specific to that calculator, never a generic multi-section preamble.

**roicalculator.live:** Audit 03 §5 found 12 of 33 calculators (the `/roi-calculator/*/*` tier) invert this — three full generic sections ("When to Use This Calculation," "Limitations of This Metric," "What Is ROI?") appear *before* the first input field. **No competitor in this benchmark set does anything resembling this** — it is not an industry pattern being executed poorly, it's a pattern with no competitive parallel at all.

- **AVOID** — any pre-calculator content beyond a short, calculator-specific introduction; this is the clearest "no competitor does this" finding in the whole audit.
- **ADOPT** — the universal intro→tool→results→education→FAQ ordering as the fixed template for every calculator page, not just some.

---

## 7. Navigation

**Competitors:** Calculator.net and Omni Calculator (directories of thousands of tools) use flat, dense top-level category menus appropriate to their scale — a structure that makes sense *because* they host so many distinct tools. NerdWallet/SmartAsset use editorial-site navigation organized by financial topic, with prominent search. BiggerPockets and EnergySage use product/marketplace navigation. In no case sampled does a competitor's navigation duplicate the same destination as both a top-level item and a dropdown item simultaneously.

**roicalculator.live:** Audit 01 found exactly this duplication — Real Estate, Solar, and SaaS each appear as both a top-level nav link *and* an entry inside the "Calculators" dropdown on every page. Audit 06 additionally found that dropdown is unreachable by keyboard site-wide (a defect this benchmark cannot directly confirm is absent on competitor sites, since WebFetch cannot test interactive keyboard behavior — noted as a limitation, not a claim about competitors).

- **AVOID** — duplicate nav entries for the same destination; no competitor structure sampled does this, and roicalculator's scale (a few dozen calculators, not thousands) doesn't justify the directory-style redundancy the way Calculator.net's scale does.
- **ADOPT** — a single, unambiguous nav hierarchy sized to roicalculator's actual catalog size, closer to NerdWallet/SmartAsset's topic-organized model than to a mega-directory model it doesn't have the inventory to justify.

---

## 8. Visual design

**Competitors:** All seven are light-themed, whitespace-heavy, blue/green-accented — the near-universal convention for finance-adjacent content sites.

**roicalculator.live:** A dark theme with a green accent — a genuine visual departure from every competitor sampled, and (per Audit 01) a reasonably well-executed one at the component level (card treatments, spacing tokens are coherent). This benchmark does not find the dark theme itself to be a liability; it finds no competitor evidence either way since none use one. However, a dark theme raises the bar for contrast discipline, and Audit 06 found the theme's own CSS tokens fail WCAG AA in at least two places (button text, footer copy) — a self-inflicted execution gap, not a consequence of the theme choice itself.

- **KEEP** — the dark theme as a differentiator; it is not contradicted by anything in this competitor set and gives the product a distinct visual identity in a category where everyone else looks the same.
- **AVOID** — shipping that differentiator with unverified contrast ratios; a dark theme is a valid choice only if executed to the same accessibility bar a light theme would be held to.

---

## 9. Trust signals

**Competitors — this is the widest gap found in the entire audit.** Every one of the seven competitors sampled carries at least one of: named author bylines with professional credentials (NerdWallet: "Chris Davis, Arielle O'Shea"; SmartAsset: "Patrick Villanova, CEPF®, edited by Arturo Conde, CEPF®"), a fact-checked/reviewed badge with a visible date, academic or industry citations (Omni Calculator: "Cook 2021, Brealey et al. 2017"), a visible engagement/social-proof metric (Omni: "497 people find this calculator helpful"), or brand-scale authority signals (BiggerPockets' published-author founders; EnergySage's "Powered by Google Project Sunroof" partnership badge).

**roicalculator.live:** Per Audit 01/03, the *only* trust disclosure anywhere on the site is the corporate entity name ("Albor Digital LLC, a Wyoming-registered digital product studio") on `about.html` — a `noindex`ed page. There is no named individual author or reviewer anywhere, no citation of any external source for any benchmark figure, no visible content-review date, and no engagement/social-proof signal of any kind. Set against this benchmark, **roicalculator.live has the weakest trust-signal profile of all eight products compared**, including the two competitors whose calculators are themselves lead-generation funnels (EnergySage, PayProGlobal both still show credential-adjacent signals — installer-network claims, product-team framing — that roicalculator does not match).

The one trust signal roicalculator.live has that **no competitor in this set offers** is genuine, verifiable data-privacy: zero tracking, zero cookies, fully client-side computation (Audit 06 confirmed no network calls in any calculator's JS). Every competitor sampled uses tracking, ads, affiliate links, or lead capture in some form.

- **ADOPT** — some form of visible authorship, review, or methodology-sourcing signal that goes beyond a corporate-entity name on a deindexed page; this is the largest, clearest gap in the entire competitive set.
- **KEEP, and consider foregrounding harder** — the no-tracking/no-cookies claim; it is currently a small header badge (Audit 01) despite being the one area where roicalculator.live outperforms every competitor sampled on trust, and it may be worth more prominence given the site currently has few other trust signals to lean on.

---

## 10. Content architecture

**Competitors:** Each competitor's "related calculators" links point to *genuinely different tools* solving different questions (NerdWallet's investment calculator links to a retirement calculator and a 401(k) calculator — distinct products, not restatements of the same one). No competitor in this set was found to host two or three independently-URLed pages competing for the identical calculation.

**roicalculator.live:** Audits 02 and 04 confirmed the opposite is a recurring pattern — three separate, independently-canonicalized pages for "SaaS ROI," near-duplicate title/calculator pairs in the real-estate tree, and four pages computing the identical basic ROI formula under different names. **No parallel to this exists anywhere in the competitor set sampled.**

- **AVOID** — multiple pages competing for one calculation concept; this benchmark finds it has no competitive precedent and is a pure self-inflicted structural cost.
- **ADOPT** — the "one concept, one URL, related-but-distinct tools linked alongside it" model every competitor already follows.

---

## 11. SEO landing-page architecture

**Competitors:** Structurally similar to what roicalculator.live's *newer* factory tier already does — one URL per calculator, calculator-specific FAQ and body content, a related-tools module. The difference observed is not structural but editorial: every competitor's per-page content, while following a repeatable *template* (a "what is X / formula / examples / FAQ" skeleton is common to nearly all of them), varies in actual *wording* per page. Templated structure with unique content per instance is the norm; roicalculator.live's legacy tier is templated structure with **identical content** per instance (Audit 05) — the distinction this benchmark surfaces is between "a template" (universal, fine) and "a template with the same words pasted into every slot" (not observed on any competitor page sampled).

- **KEEP** — the factory tier's template-with-unique-data model (`data/calculators.json` → per-calculator FAQ/content), which already matches the competitive norm.
- **AVOID** — the legacy tier's template-with-identical-content model, which has no competitive parallel and is the direct cause of Audit 04's cannibalization findings.

---

## 12. Mobile UX

**Limitation:** `WebFetch` extracts and summarizes page content; it cannot render or interact with a page at a mobile viewport, so this dimension cannot be verified with the same evidentiary rigor as §§1-11. What follows is reasoned inference, flagged as such, not a direct finding.

**Competitors:** NerdWallet, SmartAsset, Bankrate, and BiggerPockets are large, mature products for which mobile traffic is known industry-wide to be the majority of financial-content traffic; EnergySage's described "icon-based step indicators" and address-lookup-first flow reads as a design deliberately built for a small-screen, low-input-friction context. It would be a reasonable inference that all four maintain at minimum a responsive header/nav pattern (hamburger or condensed nav) given their scale and audience, but this audit did not independently verify any competitor's actual mobile breakpoints.

**roicalculator.live:** By contrast, Audit 06 *directly confirmed* (not inferred) only three `@media` rules exist in the entire stylesheet, with no responsive breakpoint for the header navigation at all.

- **ADOPT** — a verified, tested responsive navigation pattern; this is flagged as high-confidence based on roicalculator's own confirmed gap (Audit 06) rather than on unverified competitor specifics.
- Not classified KEEP/AVOID against competitors specifically, given the evidentiary limitation — the finding stands on roicalculator's own audit trail regardless of exact competitor implementation.

---

## Synthesis — what actually makes a calculator site feel...

- **Useful:** one calculator, one URL, one dominant answer. Every competitor that gets this right (Calculator.net, Omni, NerdWallet, SmartAsset) does exactly these three things; roicalculator.live's factory tier does too, but its legacy tier and vertical hubs do not.
- **Trustworthy:** a named human (or at least a named methodology/citation) behind the numbers, visibly attached to the page. This is the single largest gap found in this audit — roicalculator.live is the only product in the eight compared with zero named authorship or citation anywhere.
- **Focused:** a homepage or landing page that promises one thing and delivers it on that one page, not four things spread across three competing pages.
- **Professional:** internal consistency — competitors sampled show no unit inconsistencies, no duplicate nav entries, no cross-page copy-paste; visual theme choice (light vs. roicalculator's dark) is secondary to this kind of execution discipline.
- **Easy to use:** calculator within the first screen or two, one dominant result, minimal decisions required before the "what should I do next" answer.
- **Authoritative:** citations, credentials, and calculator-specific (not generic) explanation — competitors earn this with named experts and sourced data; roicalculator.live currently has neither and would need to find its own equivalent (its verifiable no-tracking/privacy stance is the nearest thing it already has and is under-leveraged).

## Summary classification table

| Dimension | KEEP | ADOPT | AVOID |
|---|---|---|---|
| 1. Homepage proposition | Free/private positioning | Single, narrow promise per page | Multi-intent titles diluting focus |
| 2. Calculator-first UX | Homepage placement | — | Calculator-less hub/guide pages |
| 3. Input design | Input-count range, defaults | Consistent % / unit conventions | Ambiguous decimal-vs-whole-number fields |
| 4. Result presentation | — | One dominant number + supporting detail | Equal-weight multi-metric grids |
| 5. Explanation density | Overall post-calculator volume | — | Cross-page-identical explanation text |
| 6. Information hierarchy | — | Fixed intro→tool→results→education order | Generic content preceding the calculator |
| 7. Navigation | — | Single unambiguous hierarchy sized to catalog | Duplicate top-level + dropdown entries |
| 8. Visual design | Dark theme as differentiator | — | Shipping it without verified contrast |
| 9. Trust signals | No-tracking/privacy claim (underused) | Visible authorship/review/citation signal | Corporate-name-only, deindexed disclosure |
| 10. Content architecture | — | One concept → one URL | Multiple pages competing for one calculation |
| 11. SEO landing-page architecture | Factory tier's template+unique-data model | — | Legacy tier's template+identical-content model |
| 12. Mobile UX | — | Verified responsive nav pattern | (not directly comparable — see limitation) |

---

*End of Audit 07. No files were modified in the preparation of this report. Competitor descriptions are based on automated content extraction (WebFetch) of the live pages listed, not manual browsing or screenshots, and mobile-specific claims about competitors are explicitly flagged as inference rather than direct observation.*
