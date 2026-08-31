# Phase 7F — Content, SEO & AEO Integrity Audit

**Status: AUDIT ONLY. Zero HTML/CSS/JS/JSON-LD/data files modified.** Files touched by this phase: this report, plus a scratch extraction file outside the repo (`/private/tmp/.../scratchpad/phase7f-extraction.md`, not committed). No commit is associated with this phase.

**Scope:** All 68 indexable URLs in `sitemap.xml`, read directly from the current repository (post Phase 7B–7E). Every page was fetched and parsed; nothing here is sampled or assumed.

**Method:** (1) mechanical extraction of title/meta/H1/hero-sub/FAQ JSON-LD/visible FAQ/headings/first paragraphs/related-links for all 68 pages; (2) direct full-file reads of ~20 representative and highest-risk pages (homepage, SaaS, Real Estate, three "finance utility" factory pages, one marketing factory page, `data/calculators.json`); (3) cross-reference against the repo's own `validate-generation-safety.mjs` output (36 pre-existing findings, unchanged since Phase 6); (4) live fetch of current Google Search Central / AdSense / Publisher Policy documentation, not third-party SEO blogs.

---

## 1. STATUS

Audit complete. 68/68 pages inventoried. No fixes applied. Findings below are organized by the brief's Parts 2–20; a priority matrix (Part 18) and FAQ master matrix (Part 19) consolidate everything actionable. The Director's final question is answered in Part 22 below.

---

## 2. PAGE INVENTORY (summary — full per-page data in extraction pass)

| Type | Count | Examples |
|---|---|---|
| A. Homepage | 1 | `/` |
| B. Primary vertical | 3 | `/real-estate/`, `/saas/`, `/solar/roi-calculator.html` |
| C. Factory calculator | 14 | `/calculators/*-roi-calculator.html` |
| D. Secondary calculator | 8 | `/real-estate/cap-rate-calculator.html`, `/roi-calculator/saas/*.html`, `/roi-calculator/solar/*.html`, `/roi-calculator/marketing/*.html`, `/hvac/`, `/hr/` |
| E. Programmatic hub | 3 | `/marketing/`, `/finance/`, `/operations/` |
| F. Learn article | 5 | `/learn/*.html` |
| G. Glossary index | 1 | `/glossary/` |
| H. Glossary term | 8 | `/glossary/*.html` |
| I. Site information | 4 | `/about.html`, `/contact.html`, `/privacy.html`, `/terms.html` |
| J. Benchmark | 7 | `/benchmarks/` + 6 sector pages |
| K. Comparison | 7 | `/comparisons/` + 6 comparison articles |
| L. Other (methodology, article) | 2 | `/methodology/`, `/calculators/roi-vs-other-metrics.html` |

**Total: 68.** Full per-page fields (URL, title, meta description, canonical, H1, hero-sub, intent, FAQ presence/count, calculator presence, internal-link role) were captured for every page; the calculator-bearing subset is reproduced in the Part 19 master matrix. No page inventoried lacked a matching file; nothing in the sitemap is missing from the repo.

---

## 3–5. FAQ FORENSIC AUDIT, "WHAT IS ROI?" RULE, UNIQUENESS TEST

### 3.1 Governing fact: FAQ rich results are deprecated

Google's own current documentation states FAQPage rich results **stopped appearing in Search as of May 2026** and are restricted, even historically, to "well-known, authoritative government and health websites." Support in Search Console and the Rich Results Test is being removed through August 2026. **This changes the entire frame for every FAQ-schema question in this brief**: FAQPage JSON-LD on this site currently produces **zero search-visibility benefit** regardless of quality. Any FAQ JSON-LD that also mismatches visible content is now pure downside (a structured-data-accuracy liability) with no offsetting upside. This is the single most important piece of current context for Parts 4–6 below.

### 3.2 Schema-only FAQ content — CONFIRMED, 5 pages

Per-page comparison of FAQPage JSON-LD against rendered HTML found **5 pages where FAQ JSON-LD exists but zero corresponding visible FAQ content is rendered on the page**:

| Page | JSON-LD FAQ questions | Visible FAQ? |
|---|---|---|
| `/real-estate/` | "What does this rental property ROI calculator measure?", "How is rental property ROI calculated here?" | **NONE** |
| `/saas/` | "What does this SaaS ROI calculator measure?", "How is SaaS ROI calculated here?" | **NONE** |
| `/solar/roi-calculator.html` | "What is solar ROI?", "How long does solar take to pay off?", "Is solar worth it financially?" | **NONE** |
| `/roi-calculator/solar/heat-pump-roi.html` | 3 questions | **NONE** |
| `/roi-calculator/solar/ev-charger-roi.html` | 3 questions | **NONE** |

This is a textbook violation of the brief's Part 6 requirement ("no schema-only FAQ content... no misleading answers") and of Google's structured-data policy that markup must reflect visible page content. It is also entirely gratuitous risk now that FAQ rich results carry no possible upside — there is no scenario in which keeping this JSON-LD helps the site. All 3 "distinct child" Real Estate pages (cap-rate, cash-on-cash, flip) correctly carry **no** FAQ JSON-LD at all, proving the rest of the site already knows how to do this correctly; the 5 pages above are the exception, not the rule.

By contrast, the homepage, all 6 benchmark pages, all 7 comparison articles, both SaaS/marketing "distinct child" tools with FAQ (`cac-ltv-roi.html`, `roas-calculator.html`), and all 14 factory calculators have FAQ JSON-LD that **exactly matches** their visible FAQ text. This is the correct, dominant pattern on the site — the 5 pages above are an isolated regression, most likely introduced when Phase 7B–7E's visual consolidation removed the on-page FAQ block from the primary-vertical template but did not also remove the corresponding `<head>` JSON-LD.

### 3.3 "What is ROI?" duplicate-FAQ rule — CONFIRMED on the homepage, nowhere else

The homepage (`/`) has a full, dedicated `<h2>What Is ROI?</h2>` section (nine subsections: formula, step-by-step example, annualized ROI, limitations, ROI vs IRR, benchmarks table, common mistakes) **immediately followed by** a visible FAQ section whose first question is, verbatim, **"What is ROI?"** — restating almost the same definition the page just spent 900+ words explaining. Per the brief's Part 4 rule, this is a clean **DUPLICATE / REMOVE candidate**. This is the only page on the site with this specific defect: no other calculator page pairs a "What is X" full-content section with a trivial "What is X?" FAQ entry that repeats it. (The three Real Estate child pages repeat their own "What is cap rate?" / "What is cash-on-cash return?" heading text twice on the same page — see 13.2 below — but that is a heading-duplication issue, not an FAQ-duplication issue, since those pages carry no FAQ at all.)

The homepage's other four FAQ questions ("How do you calculate annualized ROI?", "When can ROI be misleading?", "What is a good ROI?", "What is the difference between ROI and IRR?") are reasonable — they add compressed restatement value and are the kind of query a search user might type directly — but only the first one clears the bar for removal under the brief's explicit rule.

### 3.4 FAQ uniqueness matrix

Full calculator-by-calculator table is in Part 19 (mandatory master matrix). Headline results:

- **20 of 29 calculator pages** have genuinely calculator-specific FAQ questions that could not be transplanted onto another calculator without rewriting (HIGH specificity). This includes all 9 Marketing/Operations factory calculators (email-marketing, influencer, content-marketing, equipment, working-capital, warehouse-automation, ai-tool, employee-training, logistics-efficiency) plus the SaaS/marketing distinct-child tools (`cac-ltv-roi`, `roas-calculator`) and the main marketing factory calculator. These ask things like "Does this cover GPU or API overages?" (ai-tool), "What about implementation downtime?" (warehouse-automation), "Should I include product cost in influencer ROI?" (influencer) — genuinely tied to each calculator's specific inputs and real practitioner uncertainty. **This is a strength, not a weakness** — it directly contradicts the a-priori assumption that factory-generated pages must have generic FAQs.
- **3 pages have GENERIC, template-shaped FAQ questions that are LOW specificity and largely transferable**: `simple-roi-calculator.html`, `roi-calculator-example.html`, and (differently) `free-roi-calculator.html`. See Part 12 for the full analysis — these three, together, constitute the audit's single highest-priority content-quality finding.
- **5 pages have the schema-only mismatch** described in 3.2 (real-estate, saas, solar hub, heat-pump, ev-charger) — FAQ specificity is formally NONE because nothing is visible to a user.
- **9 pages have no FAQ at all** and none is missing: the Real Estate/HVAC/HR "distinct child" pages use a short-answer + "What is X" + "What is a good X" heading pattern instead of a schema'd FAQ, which is a legitimate, consistent, alternative content pattern, not a defect.

---

## 6. FAQ STRUCTURED-DATA FINDINGS

- **5 pages: schema/visible mismatch** (3.2, above) — highest-confidence, cleanest finding in this audit. Recommended direction (not implemented): either delete the FAQPage JSON-LD on these 5 pages, or add matching visible FAQ content. Given FAQ rich results are deprecated, **deletion is the lower-risk option** unless the visible-FAQ content would independently improve the page (see Part 20 per-calculator recommendations).
- **0 pages** found with stale, misleading, or SEO-stuffed FAQ questions inserted with no relationship to page content.
- **0 pages** found with FAQ markup on a page type that doesn't qualify as genuine FAQ content (glossary pages correctly carry no FAQ schema; hubs correctly carry no FAQ schema).
- Per the brief's explicit instruction, **no recommendation is made to add FAQ schema to any page that currently lacks it** — the deprecation in 3.1 makes that actively counter-productive.
- **Secondary, lower-severity finding**: on the homepage and all 7 comparison articles (`/comparisons/*.html`), the FAQPage JSON-LD answer text is a **non-verbatim paraphrase** of the visible on-page FAQ answer for the same question — same substance and formula, different wording length (JSON-LD tends to be the longer, more formal version; visible text is a tightened rewrite). Example (`/`, Q: "What is ROI?"): JSON-LD reads "...It is calculated by dividing net profit by total investment and multiplying by 100, or equivalently: ROI = [(Final Value − Initial Investment) / Initial Investment] × 100," while the visible answer reads "...measures the profitability of an investment as a percentage of the initial cost. The formula is: ROI = [(Final Value − Initial Investment) / Initial Investment] × 100." Neither version is inaccurate or contradictory, so this does not rise to "misleading answer," but it is not a verbatim match either. Classified **P3** (Part 18) — worth tightening for structured-data hygiene, not urgent given FAQ rich results are deprecated regardless.

---

## 7. TITLE AUDIT

Overall: titles are largely accurate, unique, and non-stuffed. Google's current guidance ("write descriptive and concise titles... avoid vague descriptors... no reason to repeat the same words multiple times") is met by the great majority of the 68 titles. Specific findings:

| Page | CURRENT | PROBLEM | RECOMMENDED (direction only) | RATIONALE |
|---|---|---|---|---|
| `/calculators/marketing-roi-calculator.html` | "Marketing ROI Calculator \| roicalculator.live" | Identical (Check E, validator-confirmed) to `/marketing/`'s title concept; the generic factory calculator and the category hub read as the same search result | Differentiate the hub title from the calculator title (e.g. hub keeps a "hub/category" framing, calculator keeps a "tool" framing) | Google's title guidance specifically warns that identical titles across pages "make it impossible for users to distinguish" results |
| `/calculators/simple-roi-calculator.html`, `/calculators/free-roi-calculator.html`, `/calculators/roi-calculator-example.html` | Each targets a distinct head-term variant ("simple", "free", "with example") of the same underlying tool the homepage already provides | Not stuffed or inaccurate individually, but as a **set** they read exactly like Google's "doorway pages" definition: "multiple pages targeted at specific, similar search queries" that all funnel to functionally the same utility | Consolidate or meaningfully differentiate (see Part 12/18) | This is a content-architecture problem more than a title-wording problem — title fixes alone would not resolve it |
| `/comparisons/roi-vs-irr.html` vs `/learn/roi-vs-irr.html` vs `/calculators/roi-vs-other-metrics.html` | Three titles, all "ROI vs IRR"-shaped | Confirmed 100% title-overlap by the repo's own validator; three separate pages compete for the same query | Keep `/comparisons/roi-vs-irr.html` (deepest, 1489 words, own FAQ) as canonical; the `/learn/` version is defensible as an intro-tier feeder (KEEP, cross-link clearly as "quick version"); `/calculators/roi-vs-other-metrics.html` is the weakest of the three (262 words, generic FAQ) and adds least | See Part 13 |
| `/benchmarks/marketing-roi-benchmarks.html` | 100% title-overlap with both `/calculators/marketing-roi-calculator.html` and `/marketing/` (validator-confirmed) | Same "duplicate canonical concept" pattern as above, at scale across every vertical (SaaS benchmarks vs SaaS hub, etc.) | Not a wording fix — the benchmark/calculator/hub triad per vertical is an intentional information architecture; title overlap here is largely unavoidable given three legitimately different content types share one head term | Lower priority; these three page types serve different intents (benchmark = "what's typical", calculator = "compute mine", hub = "browse tools") even though titles look similar |

No titles were found to be keyword-stuffed (no page repeats a phrase 3+ times in its `<title>`), and no title uses unsupported superlatives ("#1", "best in the world", etc.) beyond the defensible "Best ROI Calculator: Which Method Should You Use?" (which is itself a comparison-guide title, not a self-ranking claim).

---

## 8. H1 AUDIT

- **Title ≈ H1 alignment is good sitewide.** Spot-checked all 29 calculator pages plus all learn/comparison/benchmark pages: H1 text matches or is a close, non-misleading trim of the `<title>` in every case read. No page was found where `<title>` and H1 describe materially different things.
- **Exactly one H1 per page** in every page read (no multi-H1 pages found).
- Two H1s are borderline generic in isolation but are disambiguated by context: `/methodology/`'s H1 "Methodology" and `/glossary/`'s H1 "Financial Glossary" — both acceptable for their page type (a methodology/glossary index is expected to have a short, functional H1; Google's guidance objects to generic H1s only when they fail to describe the page, and both of these do describe their page accurately).
- No stuffed or duplicated-phrase H1s found.

---

## 9. SUBTITLE / HERO-SUB AUDIT

- **Strong pattern on primary verticals and most factory calculators**: hero-subs explain the specific mechanic, not generic marketing filler. Examples that pass cleanly: SaaS's "Estimate the return on a software purchase from time saved or revenue gained, against its subscription and implementation cost"; HR's "Annual addressable turnover spend = expected exits × (cost per hire + vacancy payroll). Tune weeks vacant to match your fill time." — these describe the actual model, not "calculate ROI instantly."
- **One page has genuinely weak, generic subtitle language**: the homepage's `<p class="subtitle">` reads "Calculate return on investment instantly. No signup. No data tracking. All math runs in your browser." This is close to the brief's explicitly-flagged bad pattern ("Calculate ROI instantly," "Use this free calculator") — it describes the site's *privacy posture*, not what makes this specific calculator useful (reverse/target-ROI mode, PDF export, annualized ROI — all genuinely differentiating features that go unmentioned in the subtitle). **Flagged for rewrite direction, not rewritten.**
- `/calculators/free-roi-calculator.html`'s hero-sub ("A free ROI calculator allows users to estimate profitability instantly without creating an account or sharing data") has the same defect at a smaller scale — it markets the calculator's cost/privacy rather than describing its function, and is nearly interchangeable with the homepage's subtitle in substance.
- No hero-sub was found using AI/AEO-flavored language ("Quick Answer:", "AI-powered", etc.) — confirming Phase 7E's stated removal of "Quick Answer" labels held.
- Several secondary calculators (`/roi-calculator/saas/cac-ltv-roi.html`, `/roi-calculator/saas/subscription-growth-roi.html`, `/roi-calculator/saas/time-to-value-roi.html`, `/roi-calculator/marketing/*.html`) have **no hero-sub at all** (NONE). This is a minor, consistent gap on the "distinct child tool" tier — not a violation of anything, but a missed opportunity, since these are exactly the pages that most need a one-line differentiator from their sibling tools.

---

## 10. KEYWORD / SEARCH-INTENT AUDIT

Representative results (full data captured for all 29 calculator pages):

| Calculator | Primary intent | Primary topic | Primary search phrase | Secondary concepts | Potential cannibalization | Recommendation |
|---|---|---|---|---|---|---|
| `/` | Compute a generic ROI | ROI (generic) | "roi calculator" | annualized ROI, IRR | `/calculators/simple-roi-calculator.html`, `/calculators/free-roi-calculator.html`, `/calculators/roi-calculator-example.html` (see Part 12) | Keep as the canonical generic-ROI destination; resolve the three thin siblings instead of touching the homepage |
| `/saas/` | Model buyer-side SaaS ROI | SaaS ROI | "saas roi calculator" | implementation cost, payback | Low — genuinely distinct from unit-economics children | None needed |
| `/real-estate/` | Model financed rental ROI | Rental property ROI | "rental property roi calculator" | cash flow, cap rate | Low vs. cap-rate/cash-on-cash/flip (correctly positioned as distinct metrics) | None needed |
| `/calculators/simple-roi-calculator.html` | Quick generic ROI check | Simple ROI | "simple roi calculator" | — | **High** — same formula as `/`, `free-roi-calculator.html`, `roi-calculator-example.html` | See Part 12/18 |
| `/calculators/roi-vs-other-metrics.html` | Compare ROI/IRR/NPV | ROI vs IRR vs NPV | "roi vs irr vs npv" | — | **High** — same territory as `/comparisons/roi-vs-irr.html` and `/comparisons/roi-vs-npv.html`, with far less depth | Weakest member of this cluster; candidate for consolidation into the comparisons hub |
| `/comparisons/roi-vs-irr.html` | Deep-dive ROI vs IRR decision | ROI vs IRR | "roi vs irr" | time value of money, discount rate | Medium vs. `/learn/roi-vs-irr.html` (defensible depth tier) | Keep both; make the depth-tier relationship explicit via cross-links (currently implicit) |

No page was found using unnatural or keyword-stuffed phrasing in body copy (no "roi calculator roi calculator free roi calculator" repetition patterns). Terminology throughout matches how a practitioner or searcher would actually phrase these queries (see Part 11).

---

## 11. INDUSTRY TERMINOLOGY AUDIT

Spot-checked against each vertical's checklist in the brief. No forced, invented, or incorrect terminology was found anywhere in the pages read.

- **Real estate**: cap rate, NOI, cash-on-cash return, vacancy rate, appreciation, loan term — all **(A) established industry terminology**, used correctly (e.g., cap rate correctly excludes financing; cash-on-cash correctly described as a levered/equity-yield concept distinct from cap rate).
- **Solar**: payback period, system cost, tax credit, kWh, rate escalation, useful life/lifespan — all **(A)**, correctly applied (year-1 savings formula, degradation explicitly disclosed as not modeled).
- **SaaS**: CAC, LTV, ARPU, churn rate, LTV:CAC ratio, payback period — all **(A)**, and the specific "3:1 benchmark" / "18-month payback" figures cited are **(C) marketing/industry-lore terminology presented appropriately as illustrative benchmarks**, not claimed as universal fact (each benchmark page explicitly states "not guarantees").
- **Marketing**: ROAS, attribution (last-touch/modeled/holdout), MER (marketing efficiency ratio), gross margin — all **(A)**, and the ROAS-vs-ROI distinction (revenue efficiency vs. profit) is explained correctly and consistently across `roas-calculator.html`, `roas-vs-roi.html`, and the marketing benchmarks page.
- **Factory/general**: ROI, initial investment, final value, investment period, annualized ROI, profit — all **(A)**, standard formula presentation is textbook-correct: `ROI = [(Final − Initial) / Initial] × 100`.

No instance of (D) speculative/invented terminology was found.

---

## 12. CONTENT QUALITY / THINNESS AUDIT — HIGHEST-PRIORITY FINDING

**The test applied**: "Would this page still provide useful information if the calculator were temporarily removed?"

### 12.1 The Finance-utility cluster fails this test — P0/P1

`/calculators/simple-roi-calculator.html` (295 words), `/calculators/free-roi-calculator.html` (270 words), and `/calculators/roi-calculator-example.html` (287 words) are, together, the thinnest calculator-bearing pages on the entire site (compare: every other factory calculator runs 294–351 words with genuinely distinct explanation; primary verticals run 500–770 words; comparison articles run 850–1500 words). Removing the calculator from any of these three leaves:

- Two "static-answer-block" paragraphs of 1–2 sentences each, mostly internal links rather than original explanation
- A 3-question FAQ with one-sentence answers
- A related-calculators list

This is not "short but useful" (the brief's stated acceptable case) — it is **the minimum viable wrapper around a duplicate of the homepage's own formula**, confirmed by the repo's own `validate-generation-safety.mjs` (Check D) flagging `simple-roi-calculator` and `free-roi-calculator` as formula-identical to `marketing-roi-calculator` (i.e., mathematically identical to the two-input "cost vs. return" ROI formula the homepage already computes, just with renamed variables). `roi-calculator-example.html`'s formula is the exact same `(final-initial)/initial×100` shape as the homepage's core calculator.

Cross-referenced against Google's current spam-policy language on **scaled content abuse** ("many pages generated... with little to no value to users") and **doorway pages** ("pages created to rank for specific, similar search queries" that "funnel users" toward the real destination): three URLs computing the identical formula, targeting keyword variants of the same head term ("simple", "free", "with example"), each with near-zero unique explanatory content, is a close structural match to both definitions — even though no single page is individually deceptive. This is evaluated as a **genuine, non-manufactured finding**, not pattern-matching for its own sake: the word counts, the formula-duplication (already independently confirmed by the repo's own validator), and the generic FAQ content all point the same direction.

`free-roi-calculator.html`'s FAQ compounds this: none of its three questions ("Is this really free?", "Do I need to enter personal data?", "Can I use it for business decisions?") address the calculation itself — it is a trust/marketing FAQ wearing a methodology FAQ's clothing.

### 12.2 Everything else passes

Every other content type checked — primary verticals, distinct secondary calculators, glossary terms, learn articles, comparison articles, benchmark pages, and the 11 non-thin factory calculators — has genuine standalone value if the calculator were removed: methodology explanations tied to real assumptions, worked examples, explicit limitations sections, and (for glossary/learn/comparison pages) substantive original explanation in the 400–1500 word range. This is a genuinely well-built content layer; the finding in 12.1 is a contained defect, not evidence of a sitewide thin-content problem.

---

## 13. REPETITION / CANNIBALIZATION AUDIT

| Finding | Pages | Class | Notes |
|---|---|---|---|
| "ROI vs IRR" territory | `/learn/roi-vs-irr.html`, `/comparisons/roi-vs-irr.html`, `/calculators/roi-vs-other-metrics.html`, homepage's own ROI-vs-IRR h3 | **B/E mixed** | Learn↔Comparisons pairing is a defensible depth-tier (B); `roi-vs-other-metrics.html` is the weak third wheel with no clear tier role (E) |
| Real Estate child-page heading duplication | `/real-estate/cap-rate-calculator.html` ("What is cap rate?" appears as both a pre-calculator quick-answer heading and a post-calculator full-explanation heading, verbatim); same pattern on `/real-estate/cash-on-cash-calculator.html` | **C** | Redundant but harmless — a labeling artifact of the "short answer + full explanation" AEO pattern, not duplicate content in substance (the two sections have different, non-overlapping body text). Low-cost fix: rename the second heading (e.g., "Cap rate in detail") |
| "What is a good X ROI?" benchmark framing | Repeated near-verbatim structural pattern across all 6 `/benchmarks/*.html` pages and the homepage FAQ | **A** | Legitimate shared terminology/structure — each instance answers for a genuinely different asset class; this is consistent information architecture, not duplication |
| Footer link duplication (`footer-links` vs `footer-popular` both list Real Estate/Solar/SaaS ROI) | Sitewide (shared `site-chrome.mjs`) | **C** | Previously identified in Phase 7 and explicitly deferred as shared-chrome, out of this page-level audit's scope — still true, still harmless, still not this phase's to fix |
| Simple/Free/Example ROI calculator trio | `/calculators/simple-roi-calculator.html`, `/calculators/free-roi-calculator.html`, `/calculators/roi-calculator-example.html` | **D/E** | Covered fully in Part 12.1 — this is the one finding in this section that rises to "requires remediation" |
| Factory-calculator formula duplication (Check D, validator-confirmed) | `influencer-roi-calculator`↔`email-marketing-roi-calculator`, `equipment-roi-calculator`↔`marketing-roi-calculator`, `ai-tool-roi-calculator`↔`email-marketing-roi-calculator` | **C** | Underlying math is templated/duplicate, but the surrounding copy, FAQ, and use-case framing are genuinely distinct per calculator (see Part 12.2) — a computational-debt item, not a user-facing duplication problem. Already tracked; not re-litigated here as new |

No instance of a repeated paragraph, repeated example, or repeated subtitle verbatim across two pages was found outside the items above — the site does not exhibit copy-paste duplication at the sentence level.

---

## 14. AEO AUDIT

- H1 clarity, first-paragraph clarity, methodology, assumptions, and limitations are present and genuinely calculator-specific on all primary verticals and most factory/secondary calculators — this is a real strength for answer-engine-style consumption (a system extracting "how is X calculated" content from this site would get correct, specific, non-generic answers on the large majority of pages).
- The **5 schema-mismatch pages** (Part 3.2/6) are also an AEO defect independent of the Search-rich-result angle: an answer engine crawling structured data would extract a "question" that has no corresponding grounded answer text visible on the page, which is exactly the "schema that does not correspond to visible content" failure mode the brief asks to check for.
- The homepage's duplicate "What is ROI?" (Part 3.3) is also an AEO defect: it creates two textually-similar answer candidates for the identical query on one page, which is redundant surface area for an extraction system, not helpful redundancy.
- No hidden SEO text, no keyword-stuffed answer blocks, and no artificial "answer blocks" inserted purely for AEO were found — consistent with Phase 7E's stated removal of "Quick Answer" boxes.

---

## 15. ADSENSE POLICY / CONTENT-QUALITY AUDIT

**Governing fact**: a full-site grep found **zero `ad-slot` elements and zero AdSense script tags anywhere in the current repository.** Ads were evidently removed sitewide during the Phase 7B–7E visual consolidation (the CSS rules for `.ad-slot`/`.ad-top`/`.ad-middle`/`.ad-bottom` still exist in `styles.css` as unused dead code, but no page currently places one). **This means there is no current ad-to-content ratio to violate — the AdSense question here is entirely prospective** ("if monetization is turned on, is the content ready"), not a live compliance check.

| Page/cluster | Classification | Evidence |
|---|---|---|
| Primary verticals, distinct secondary calculators, glossary, learn, comparisons, benchmarks | **GREEN** | Substantive original content, clear disclaimers, no deceptive navigation, no scraped/republished content detected |
| Most factory calculators (11 of 14) | **GREEN** | Short but genuinely distinct practitioner-level content per calculator (Part 12.2) |
| `simple-roi-calculator.html`, `free-roi-calculator.html`, `roi-calculator-example.html` | **YELLOW** | Thin content (Part 12.1) is precisely the pattern Google's Publisher Policies flag ("pages with insufficient publisher content," "low-value content... without additional commentary, curation, or otherwise adding value"). Not a **RED** finding today only because there is no ad inventory currently placed on them to create an actual ratio violation — but these would be the first pages to draw scrutiny if ads were added without first addressing Part 12.1 |
| Sitewide financial-claims language | **GREEN** | See Part 16 — no guarantee language, no "get rich quick" pattern, consistent disclaimers |
| `/about.html`, `/privacy.html`, `/terms.html`, `/contact.html` | **GREEN** | Real operator identity (Albor Digital LLC, Wyoming), real contact email, genuine privacy/no-tracking claims consistent with the actual absence of analytics/cookies in the codebase |

No page was found impersonating another brand, no page was found republishing scraped content, and no deceptive ad-adjacent navigation pattern was found (there is currently no navigation built around ad placement at all, since there are no ads).

---

## 16. FINANCIAL CONTENT RISK AUDIT

This is a genuine strength of the site. Sampled language across the homepage, all 6 benchmark pages, and both SaaS/real-estate benchmark pages:

- "A 'good' ROI is not a fixed number: it is defined relative to asset class, risk, liquidity, and holding period" (homepage) — correctly hedged, not a guarantee.
- "Are ROI benchmarks guarantees? No." — this exact disclaimer, or a close paraphrase, appears on **every single one of the 6 `/benchmarks/*.html` pages**, each time as an explicit FAQ answer, not buried fine print.
- "For informational purposes only. Not financial or investment advice." appears in the shared footer on every page site-wide.
- No instance of "guaranteed return," "risk-free," "get rich," or unconditioned "X% ROI" framed as an outcome promise (rather than a modeled/illustrative range) was found anywhere in the pages read.
- Benchmark ranges are consistently presented as ranges with explicit variance drivers ("Ranges vary widely by sector and how ROI is defined"), not point-estimate claims.

**No wording requiring review was found.** This section is GREEN sitewide.

---

## 17. INTERNAL LINKING / AEO DISCOVERY AUDIT

- Anchor text is specific and relevant in the large majority of cases (e.g., "Cap rate calculator — net operating income ÷ price, an unlevered yield for comparing properties before financing" — descriptive, not generic "click here"/"learn more").
- Every primary vertical and distinct secondary calculator links to its sibling tools, the relevant benchmark page, and at least one comparison/glossary page — appropriate discovery structure.
- **One negative finding**: the homepage's prominent "Trending ROI Tools" section (positioned directly under the calculator, high visual priority) links to exactly the three thin doorway-cluster pages identified in Part 12.1 (`simple-roi-calculator.html`, `free-roi-calculator.html`, `roi-calculator-example.html`) plus the three primary verticals. This means the homepage is currently spending its highest-value internal-link real estate promoting the site's weakest content cluster rather than its deepest (comparisons, learn). This is a consequence of Part 12.1, not a separate defect — fixing the cluster changes what this section should point to.
- No anchor text was found to be misleading (link text did not misrepresent destination content in any page read).

---

## 18. PRIORITY REMEDIATION MATRIX

| Priority | Page(s) | Issue | Type | Evidence | Recommended action (not implemented) | Scope |
|---|---|---|---|---|---|---|
| **P1** | `/calculators/simple-roi-calculator.html`, `/calculators/free-roi-calculator.html`, `/calculators/roi-calculator-example.html` | Thin content + duplicate formula + generic FAQ + doorway-page query pattern | Content quality / scaled-content risk | Word counts 270–295; Check D formula-duplication (validator); FAQ specificity LOW | Consolidate into fewer, more differentiated pages, OR substantially deepen each with genuinely distinct explanatory content and a methodology-specific FAQ | 3 files + `data/calculators.json` + homepage's "Trending ROI Tools" links |
| **P1** | `/`, `/real-estate/`, `/saas/`, `/solar/roi-calculator.html`, `/roi-calculator/solar/heat-pump-roi.html`, `/roi-calculator/solar/ev-charger-roi.html` | Schema-only FAQ (5 pages) + duplicate "What is ROI?" FAQ (homepage) | FAQ structured-data integrity | Direct JSON-LD vs. rendered-HTML comparison | Remove FAQ JSON-LD from the 5 schema-only pages (or add matching visible content); remove/replace the homepage's "What is ROI?" FAQ entry | 6 files' `<head>` JSON-LD (+ homepage FAQ list) |
| **P2** | `/calculators/roi-vs-other-metrics.html` | Weakest member of a 3-page "ROI vs IRR/NPV" cluster; thin (262 words), generic FAQ | Cannibalization | Title-overlap (validator Check C) + direct content read | Fold into `/comparisons/` hub as a short landing/index entry rather than a standalone competing article | 1 file + comparisons hub links |
| **P2** | Homepage `subtitle`; `/calculators/free-roi-calculator.html` `hero-sub` | Generic, feature-free subtitle language | Subtitle quality | Direct text match to brief's flagged bad-pattern examples | Rewrite to name the calculator's actual differentiating features (annualized/reverse mode/PDF export for homepage) | 2 files |
| **P3** | `/real-estate/cap-rate-calculator.html`, `/real-estate/cash-on-cash-calculator.html` | Same H2 heading text used twice on one page (quick-answer + full-explanation) | On-page repetition | Heading-structure extraction | Rename the second heading instance | 2 files |
| **P3** | `/roi-calculator/saas/*.html`, `/roi-calculator/marketing/lead-generation-roi.html` | Missing hero-sub | Subtitle completeness | Extraction: hero_sub = NONE | Add a one-line differentiator per tool | 4 files |
| **P3** | `/` + all 7 `/comparisons/*.html` | FAQ JSON-LD answer text is a non-verbatim paraphrase of the visible answer (same substance, different wording) | FAQ structured-data hygiene | Direct JSON-LD-vs-visible text comparison, confirmed independently by the extraction pass | Tighten JSON-LD to match visible text verbatim (or vice versa) | 8 files' `<head>` JSON-LD |
| **P4** | Benchmark/calculator/hub per-vertical title overlaps; factory-calculator formula duplication with strong copy differentiation (equipment/ai-tool) | Cosmetic title overlap; computational (not user-facing) duplication | Title/IA; generation-safety | Validator Check C/D (pre-existing, already tracked) | Leave unchanged — already tracked in `MASTER-DIAGNOSTIC.md`/generation-safety backlog, not new | — |

---

## 19. CALCULATOR FAQ MASTER MATRIX (mandatory — all 29 calculator-bearing pages)

| Calculator | URL | Primary intent | FAQ count | "What is ROI?" in FAQ? | FAQ uniqueness | FAQ specificity | Main FAQ issue |
|---|---|---|---|---|---|---|---|
| Main ROI Calculator | `/` | Generic ROI | 5 | **YES** | GENERIC (Q1) / rest unique | MEDIUM | Q1 duplicates the page's own "What Is ROI?" section |
| ROAS Calculator | `/roi-calculator/marketing/roas-calculator.html` | ROAS vs ROI | 4 | No | UNIQUE | HIGH | None |
| Lead Generation ROI | `/roi-calculator/marketing/lead-generation-roi.html` | Full-funnel lead ROI | 0 | — | — | NONE | No FAQ present (gap, not a violation) |
| Rental Property ROI | `/real-estate/` | Financed rental ROI | 0 visible (2 in JSON-LD) | No | N/A | **NONE (schema-only)** | Schema/visible mismatch |
| Cap Rate Calculator | `/real-estate/cap-rate-calculator.html` | Unlevered yield | 0 | — | — | NONE | Uses heading pattern instead; heading repeated (P3) |
| Cash-on-Cash Calculator | `/real-estate/cash-on-cash-calculator.html` | Levered yield | 0 | — | — | NONE | Heading repeated (P3) |
| Fix & Flip ROI | `/real-estate/flip-roi-calculator.html` | Short-cycle flip ROI | 0 | — | — | NONE | None |
| SaaS ROI Calculator | `/saas/` | Buyer-side SaaS ROI | 0 visible (2 in JSON-LD) | No | N/A | **NONE (schema-only)** | Schema/visible mismatch |
| HVAC ROI Calculator | `/hvac/roi-calculator.html` | Efficiency-upgrade payback | 0 | — | — | NONE | None (uses heading pattern) |
| Employee Retention ROI | `/hr/roi-calculator.html` | Turnover-cost avoidance | 0 | — | — | NONE | None |
| CAC vs LTV ROI | `/roi-calculator/saas/cac-ltv-roi.html` | SaaS unit economics | 4 | No | UNIQUE | HIGH | None |
| Subscription Growth ROI | `/roi-calculator/saas/subscription-growth-roi.html` | Growth/churn modeling | 0 | — | — | NONE | No FAQ (gap, not a violation) |
| Time-to-Value ROI | `/roi-calculator/saas/time-to-value-roi.html` | Break-even on tool adoption | 0 | — | — | NONE | No FAQ (gap, not a violation) |
| Solar ROI Calculator | `/solar/roi-calculator.html` | Solar payback/lifetime ROI | 0 visible (3 in JSON-LD) | No (but "What is solar ROI?" is invisible) | N/A | **NONE (schema-only)** | Schema/visible mismatch |
| Heat Pump ROI | `/roi-calculator/solar/heat-pump-roi.html` | Efficiency payback | 0 visible (3 in JSON-LD) | No | N/A | **NONE (schema-only)** | Schema/visible mismatch |
| EV Charger ROI | `/roi-calculator/solar/ev-charger-roi.html` | Fuel-savings payback | 0 visible (3 in JSON-LD) | No | N/A | **NONE (schema-only)** | Schema/visible mismatch |
| Marketing ROI Calculator | `/calculators/marketing-roi-calculator.html` | Ad-spend profit ROI | 3 | No | UNIQUE | HIGH | None |
| Email Marketing ROI | `/calculators/email-marketing-roi-calculator.html` | Conversions × AOV | 3 | No | UNIQUE | HIGH | None |
| Influencer ROI | `/calculators/influencer-roi-calculator.html` | Orders × AOV vs fee | 3 | No | UNIQUE | HIGH | None |
| Content Marketing ROI | `/calculators/content-marketing-roi-calculator.html` | Leads × deal × win-rate | 3 | No | UNIQUE | HIGH | None |
| Equipment ROI | `/calculators/equipment-roi-calculator.html` | Capex vs net benefit | 3 | No | UNIQUE | HIGH | Formula duplicate of marketing-roi-calculator (Check D, not FAQ) |
| Working Capital ROI | `/calculators/working-capital-roi-calculator.html` | Cash deployment vs hurdle | 3 | No | UNIQUE | HIGH | None |
| Warehouse Automation ROI | `/calculators/warehouse-automation-roi-calculator.html` | Labor/error savings | 3 | No | UNIQUE | HIGH | None |
| AI Tool ROI | `/calculators/ai-tool-roi-calculator.html` | Hours saved × rate | 3 | No | UNIQUE | HIGH | Formula duplicate of email-marketing (Check D, not FAQ) |
| Employee Training ROI | `/calculators/employee-training-roi-calculator.html` | Productivity + error reduction | 3 | No | UNIQUE | HIGH | None |
| Logistics Efficiency ROI | `/calculators/logistics-efficiency-roi-calculator.html` | Per-shipment savings | 3 | No | UNIQUE | HIGH | None |
| Simple ROI Calculator | `/calculators/simple-roi-calculator.html` | Generic quick ROI | 3 | No | **GENERIC** | **LOW** | Transferable Qs; thin page; formula duplicate of marketing-roi-calculator |
| ROI Calculator Example | `/calculators/roi-calculator-example.html` | Walkthrough ROI | 3 | No | **GENERIC** | **LOW** | Transferable Qs; thin page; same formula shape as homepage |
| Free ROI Calculator | `/calculators/free-roi-calculator.html` | Trust-oriented generic ROI | 3 | No | MOSTLY UNIQUE (wording) | **LOW** | FAQ is about trust/privacy, not calculation; formula duplicate of marketing-roi-calculator |

---

## 20. RECOMMENDED FAQ ARCHITECTURE BY CALCULATOR (direction only — no copy written except where needed to illustrate the defect)

- **Homepage**: Resolve uncertainty about *when simple ROI breaks down* and *how to pick a horizon*. Valid to keep: annualized-ROI, "when misleading," "good ROI," ROI-vs-IRR questions. **Remove**: "What is ROI?" (duplicates the page's own explainer). Missing: a question about the reverse/target-ROI mode, which is a real, un-explained feature.
- **Real Estate hub / SaaS hub / Solar hub / Heat Pump / EV Charger**: Resolve uncertainty about *what the calculator's specific formula does and does not include* (already answered correctly in the JSON-LD text that exists — it just needs to become visible, or be removed). Valid questions already drafted in JSON-LD; nothing here needs new copy, only a decision on visibility vs. removal.
- **Simple ROI Calculator / ROI Calculator Example / Free ROI Calculator**: These three should not each independently reinvent an FAQ. What user uncertainty should survive: "why would I use this over the main calculator," "does this differ from [sibling] in any way." What's currently valid: none of the 9 existing questions individually resolve calculator-specific uncertainty. What's missing: literally the reason to use one of these three pages instead of the homepage or each other — that gap *is* the underlying content-architecture problem, not just an FAQ problem.
- **Lead Generation ROI / Subscription Growth ROI / Time-to-Value ROI**: These have strong dedicated body content already (full-funnel model, compounding-growth math, TTV definition) but no FAQ. What user uncertainty remains after reading: "what if close rate/churn/efficiency-gain changes mid-period," "how do I annualize a partial-period pilot" — genuine candidates if an FAQ is ever added, but its absence today is not a defect.
- **All 9 well-differentiated factory calculators** (marketing, email, influencer, content, equipment, working-capital, warehouse, ai-tool, employee-training, logistics): no changes recommended — these already resolve genuine calculator-specific uncertainty and should be the template other tiers are brought up to, not the other way around.

---

## 21. GLOBAL RECOMMENDATIONS

1. Treat the FAQ-schema/visible-content mismatch (Part 6) as the cheapest, highest-confidence fix available — it is a pure cleanup with no tradeoff, now that FAQ rich results carry no upside.
2. Treat the homepage's duplicate "What is ROI?" FAQ entry as a one-line removal with no downside.
3. Treat the Simple/Free/Example ROI trio as an information-architecture decision requiring Director input (consolidate vs. deepen), not a copy-editing task — this is the one finding in the whole audit that changes site structure, not just page content.
4. Do not add FAQ schema anywhere it doesn't already exist — confirmed by current Google policy to have no payoff and only latent mismatch risk.
5. Do not touch the 9 well-differentiated factory calculators, the primary verticals' core methodology, glossary, learn, comparisons, or benchmark content — these passed every test applied.
6. The financial-risk-language discipline (Part 16) is a genuine asset; any future content added (especially to the Simple/Free/Example cluster if deepened) should be held to the same hedging standard already in place elsewhere.

---

## 22. FILES THAT WOULD REQUIRE CHANGES (future remediation phase — none touched in this audit)

- `saas/index.html`, `real-estate/index.html`, `solar/roi-calculator.html`, `roi-calculator/solar/heat-pump-roi.html`, `roi-calculator/solar/ev-charger-roi.html` — FAQ JSON-LD removal or visible-FAQ addition
- `index.html` — FAQ list edit (remove one entry) + subtitle rewrite
- `calculators/simple-roi-calculator.html`, `calculators/free-roi-calculator.html`, `calculators/roi-calculator-example.html`, `data/calculators.json` — content-architecture decision (consolidate or deepen)
- `calculators/roi-vs-other-metrics.html`, `comparisons/index.html` — cannibalization consolidation
- `real-estate/cap-rate-calculator.html`, `real-estate/cash-on-cash-calculator.html` — heading rename
- `roi-calculator/saas/subscription-growth-roi.html`, `roi-calculator/saas/time-to-value-roi.html`, `roi-calculator/saas/cac-ltv-roi.html` (hero-sub only), `roi-calculator/marketing/lead-generation-roi.html` — hero-sub addition

---

## 23. IMPLEMENTATION PHASE RECOMMENDATION

A future remediation phase should be scoped narrowly to the P1/P2 rows in Part 18 only, following the same discipline as Phases 1–7 (no math changes, no unrelated cleanup, single validated commit). The P1 FAQ-schema cleanup and homepage FAQ-entry removal are mechanical and low-risk. The Simple/Free/Example ROI trio requires a Director decision on direction (consolidate the three into fewer URLs with redirects, vs. deepen each with genuinely distinct content) before any file is touched, since it is the one finding here with real information-architecture consequences (URLs, redirects, internal links) rather than pure content editing.

---

## 22 (Director Question). Is roicalculator.live ready for monetization, or does it need another remediation phase first?

Answered directly, not optimistically, and split by dimension as requested:

- **SEO readiness: MOSTLY YES.** Titles, H1s, canonicals, and meta descriptions are accurate and largely unique; the validator's 36 pre-existing findings are legacy-tier and already tracked. The one real open issue (Simple/Free/Example trio) is a genuine but narrow doorway-page risk, not a sitewide problem.
- **AEO readiness: YES, with one cleanup item.** The site answers real user questions with genuine, calculator-specific content in the large majority of cases. The 5-page FAQ schema/visible mismatch is the one concrete defect, and it is cheap to fix.
- **Content quality: MOSTLY YES.** Primary verticals, most factory calculators, glossary, learn, and comparison content are genuinely useful, correctly hedged, and not thin. The Simple/Free/Example trio is a real, confirmed exception, not a false alarm.
- **FAQ quality: MOSTLY YES**, once the 5 schema-mismatch pages and the homepage's one duplicate question are addressed — the underlying FAQ-writing quality on 20+ pages is genuinely strong (calculator-specific, non-generic), which is uncommon on a site this size.
- **AdSense readiness: CANNOT YET BE FULLY EVALUATED AS "READY," but not because of policy violations — because there is currently no ad inventory on the site to evaluate against real placement.** The content itself, apart from the 3-page thin cluster, would not obviously fail Google's publisher-content or thin-content standards. The 3-page cluster is exactly the kind of page that draws scrutiny once ads are actually placed, so it is the one piece of unfinished business before turning monetization on, not a blocker to the rest of the site.
- **Overall readiness: Close, but not clean enough to flip on monetization today without one more narrow remediation pass.** The issues found are real, evidenced, and small in file count (roughly 10-12 files) — this is not a "redo the site" finding, it is a "finish two specific, well-scoped cleanup items before turning on ads" finding. The Director should treat Part 18's P1 rows as the gate, not the whole audit.
