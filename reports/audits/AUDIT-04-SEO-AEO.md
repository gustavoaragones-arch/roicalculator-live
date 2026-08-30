# AUDIT 04 — SEO / AEO / Search Intent Diagnostic
**roicalculator.live — Project Director Audit**
Read-only. No SEO content added, no code modified. Findings are drawn from the repository (titles, meta descriptions, canonicals, `sitemap.xml`, `robots.txt`) and cross-referenced against the GSC data supplied in the brief.

**Verdict up front:** the current SEO architecture is actively hurting the product for its highest-value query cluster (SaaS ROI). This is not a ranking-strength or authority problem primarily — it is a **self-competition problem**: for the two queries with the most impressions in the supplied GSC data ("saas roi calculator" / "roi calculator saas," 154 combined impressions, ~0 clicks), the repository contains **three independently-canonicalized, sitemap-submitted pages**, two of which use the literal phrase "SaaS ROI Calculator" in their `<title>`. Google has no signal telling it which of the three is authoritative, and the evidence (near-zero clicks despite real impressions) is consistent with exactly that failure mode. The same pattern repeats, with varying severity, across nearly every query in the supplied list.

---

## 1. Search Intent Mapping

| Intent category | Pages serving it | Notes |
|---|---|---|
| **Calculator intent** ("X roi calculator," transactional) | `index.html`, 14 `/calculators/*`, `saas/roi-calculator.html`, 4 `/real-estate/*.html`, `solar/roi-calculator.html`, `hvac/`, `hr/`, 12 `/roi-calculator/*/*` sub-pages | Most crowded category — 33 pages, several targeting the same exact phrase (§3) |
| **Formula intent** ("roi formula," "roi equation," "roi calculation") | `learn/roi-formula.html` (dedicated), `index.html` (full restatement), `learn/how-to-calculate-roi.html` (overlaps) | No page targets "roi equation" at all (§2); "roi calculation" is scattered across 5 pages with no single owner |
| **Informational intent** ("what is roi," "how to calculate roi") | `learn/what-is-roi.html`, `learn/how-to-calculate-roi.html`, `index.html` (restates both) | Homepage directly competes with both dedicated guide pages |
| **Comparison intent** ("roi vs irr," "roas vs roi," etc.) | `comparisons/*` (7 pages) **and** `learn/roi-vs-irr.html` (duplicate of one of the seven) | Clean category except for the one duplicate (§3) |
| **Benchmark intent** ("roi benchmarks," "average roi by industry") | `benchmarks/*` (6 pages) | Cleanest category on the site — no material overlap found |
| **Industry intent** ("saas roi," "real estate roi," "solar roi," "marketing roi") | 2-3 competing hub trees per vertical (Audits 01-02) | Most severe overlap category — see §3 |
| **Commercial investigation intent** ("best roi calculator," "top roi calculators for saas sales") | `comparisons/best-roi-calculator.html` (generic, not vertical-specific) | **No page serves the vertical-specific version of this intent** — "top roi calculators for saas sales" has no matching page anywhere in the repository (confirmed by direct search, §2) |

**Overlap finding:** Calculator intent and Industry intent overlap almost completely for SaaS, real estate, and solar — the same query ("saas roi calculator") can plausibly be satisfied by a Calculator-intent page (`saas/roi-calculator.html`) or an Industry-intent hub (`saas/index.html`, `roi-calculator/saas/index.html`), and the site has built pages for both interpretations without ever declaring which one should win.

---

## 2. GSC Signal Interpretation

Supplied data (impressions, clicks ≈ 0):

| Query | Impressions | Pages that would plausibly compete for it (found in repo) | Diagnosis |
|---|---|---|---|
| "how to calculate roi" | 123 | `learn/how-to-calculate-roi.html` (exact-match title), `index.html` ("How to Calculate ROI" H3 + 5-step list, near-identical structure) | **Intent match exists (dedicated page), but internal competition from the homepage's own restatement of the identical steps.** Likely cause: weak differentiation, not weak rankings — Google may be alternating which URL it surfaces. |
| "roi formula" | 104 | `learn/roi-formula.html` (exact-match title), `index.html` (full "The ROI Formula" section + worked example) | Same pattern as above — a dedicated page exists but competes with the homepage's full restatement rather than a summary-and-link. |
| "saas roi calculator" | 81 | `saas/roi-calculator.html` **and** `roi-calculator/saas/index.html` (title contains "SaaS ROI Calculator") **and** `saas/index.html` ("SaaS ROI Guide & Calculator") | **Direct cannibalization — 3 self-canonicalized pages, 2 with the exact phrase in the title tag.** This is the highest-impression query in the set and the clearest cannibalization case on the site. |
| "roi calculator saas" | 73 | Same 3 pages (word-order variant of the query above; Google generally treats these as near-identical intent) | Same diagnosis as above — combined with the row above, **154 impressions across 3 competing URLs, ~0 clicks.** |
| "roi equation" | 49 | **No page uses this phrase anywhere in the repository** (confirmed: zero hits for "roi equation" site-wide) | **Pure intent-match failure** — the site is being shown for this query on semantic proximity to "roi formula" content alone, with no page actually addressing the "equation" framing (which often signals a slightly more technical/academic searcher). No title, H1, or snippet says "equation," so even a shown impression has a weak CTR hook. |
| "roi calculation" | 49 | 5 pages contain the phrase incidentally (`learn/how-to-calculate-roi.html`, `real-estate/roi-calculator.html`, `calculators/simple-roi-calculator.html`, `calculators/roi-calculator-example.html`, `glossary/index.html`) but **none targets it as a primary keyword** | Scattered incidental relevance, no canonical owner — same failure mode as "roi equation," one level less severe. |
| "saas roi" | 46 | Same SaaS trio as above, plus `benchmarks/saas-roi-benchmarks.html` tangentially | Same cannibalization diagnosis as "saas roi calculator." |
| "top roi calculators for saas sales" | 40 | **No page addresses this at all** — confirmed no "top," "best," or listicle-style SaaS-specific comparison page exists; `comparisons/best-roi-calculator.html` is generic, not SaaS- or sales-specific | **Complete intent-match failure.** This is commercial-investigation intent (a buyer comparing options) and the site has nothing shaped like an answer to it. 40 impressions with no relevant page is the strongest "poor intent match" signal in the dataset. |
| "saas marketing roi" | 38 | **No page addresses this cross-vertical query at all** (confirmed no hits for "saas marketing roi") | Same failure mode — an orphaned cross-vertical query with no dedicated or even adjacent page; nearest neighbors (`saas/index.html`, `roi-calculator/marketing/index.html`) don't cross the two verticals. |

### Assessment against the candidate causes listed in the brief

- **Weak rankings** — plausible as a *symptom*, not a root cause; the near-zero-click pattern is consistent with pages ranking in a volatile, low position because of cannibalization (see below), not because the content itself is unranked.
- **Weak snippets** — likely, but secondary. Meta descriptions are present and reasonably written (see §4); the deeper problem is *which* description gets shown is unpredictable when 2-3 URLs compete.
- **Poor intent match** — **confirmed as a direct, primary cause** for "roi equation," "roi calculation," "top roi calculators for saas sales," and "saas marketing roi" — four of the nine supplied queries have no page built to match them at all (as opposed to having a page but competing with duplicates).
- **Excessive page competition** — **confirmed as a direct, primary cause** for "saas roi calculator," "roi calculator saas," "saas roi," "how to calculate roi," and "roi formula" — five of the nine queries have 2-3 self-canonicalized, sitemap-submitted pages competing for the same terms.
- **Poor page quality** — a contributing factor, not the primary one: Audit 02/03 found the actual calculator and guide content on the SaaS pages to be substantively reasonable; the *generic boilerplate stamped around it* (Audit 02 §3) is more likely to depress quality signals than the core content itself.
- **Confusing information hierarchy** — contributing; Audit 01/03 already established that several of these pages bury their calculator or answer below repeated boilerplate, which can reduce dwell time and increase pogo-sticking even when a click does occur (though clicks are the metric currently at zero, so this affects the *next* stage of the funnel once cannibalization is fixed).
- **Lack of differentiated value** — **confirmed**: the SaaS trio's meta descriptions, read side by side, imply three different products (a general guide, a time-savings buyer calculator, a CAC/LTV vendor-economics guide) — but nothing on any of the three pages, or in navigation, tells a *user or Google* that this is intentional segmentation rather than accidental duplication. Undifferentiated-looking pages get treated as duplicates regardless of the author's intent.
- **Duplicate/overlapping pages** — **confirmed as the dominant explanatory factor**, detailed fully in §3.
- **Weak authority** — cannot be ruled out from repository inspection alone (this requires backlink/domain data outside this audit's scope), but is not needed as an explanation here: cannibalization alone is sufficient to produce "real impressions, near-zero clicks" without invoking authority at all.
- **New-domain effects** — plausible background factor (cannot be confirmed or denied from the repository), but the brief is correct to note this is a diagnostic signal, not proof of a single cause — this audit's finding is that duplicate-page competition is present and sufficient to explain the pattern **regardless of** whatever authority/domain-age effects are also in play.

---

## 3. Cannibalization — Intent Ownership Matrix

| Concept | Competing pages (all indexable, sitemap-submitted, self-canonicalized) | Verdict |
|---|---|---|
| **ROI** (head term) | `index.html` (title: "ROI Calculator (Free & Private) \| Formula, Examples & Benchmarks") | Single owner. No cannibalization — but the title itself tries to own 4 sub-intents (calculator/formula/examples/benchmarks) at once, diluting topical focus for each individually (see §4). |
| **ROI calculator** | `index.html` + partial overlap from all 33 calculator pages by association | Acceptable — head-term calculator intent reasonably belongs to the homepage; vertical pages differentiate by industry modifier in their own titles. No fix needed here specifically. |
| **ROI formula** | `learn/roi-formula.html` (dedicated) vs. `index.html` (full restatement, not just a link) | **Soft cannibalization** — one page should own this; the other should summarize + link, not restate in full (Audit 02 §2 flagged this from the content side; this audit confirms it is also a live SEO risk given "roi formula" is the #2 query by impressions in the supplied data). |
| **How to calculate ROI** | `learn/how-to-calculate-roi.html` (dedicated) vs. `index.html` (full 5-step restatement) | **Soft cannibalization**, same pattern, and this is the **#1 query by impressions** in the supplied data — the highest-value fix available in this audit. |
| **SaaS ROI** | `saas/index.html`, `saas/roi-calculator.html`, `roi-calculator/saas/index.html` (+ 3 sub-calculators) | **Hard cannibalization — the most severe case on the site**, and it maps directly onto the three highest-impression SaaS-related queries in the supplied GSC data (154+46 = 200 impressions across the "saas roi calculator" / "roi calculator saas" / "saas roi" cluster). |
| **SaaS ROI calculator** | `saas/roi-calculator.html` (title: "SaaS ROI Calculator...") vs. `roi-calculator/saas/index.html` (title: "SaaS ROI Calculator & Subscription Business Return Guide") | **Direct title-string collision** — both titles open with the identical four words "SaaS ROI Calculator." This is the single clearest, most mechanically fixable cannibalization instance in the entire audit. |
| **ROI benchmarks** | `benchmarks/index.html` + 6 detail pages | No cannibalization found — clean hub/spoke structure, each page owns a distinct sub-topic. |
| **Annualized ROI** | `glossary/annualized-return.html` (dedicated definition) vs. `learn/roi-formula.html` and `learn/how-to-calculate-roi.html` (each independently restate the annualized formula) vs. `index.html` (restates a third time) | **Soft cannibalization across 4 pages** — no page defers to another; each computes and explains the same compounding formula independently. Not currently reflected in the supplied GSC list, but structurally identical to the "roi formula" problem and likely to produce the same symptom if/when this term gains search volume. |
| **ROI vs IRR** | `learn/roi-vs-irr.html` **and** `comparisons/roi-vs-irr.html` — both self-canonicalized, both titled "ROI vs IRR," both cross-link to each other as if the other were supplementary, and their "quick answer" paragraphs are structural paraphrases of each other (verified side by side: "ROI states/reports [X] percentage return... IRR is the rate/discount rate that makes [cash flows/NPV] zero, so timing matters" — same sentence, different words) | **Hard cannibalization, textbook case.** Not in the supplied GSC list, but this is the exact same failure pattern as the SaaS cluster applied to educational content, and should be treated with the same priority once the SaaS fix is validated. |

---

## 4. Title / H1 / Snippet Audit

Spot-checked against the supplied query list and the concepts in §3. **Not rewritten — mismatches only.**

| Page | Title | H1 | Meta description | Mismatch found |
|---|---|---|---|---|
| `index.html` | "ROI Calculator (Free & Private) \| Formula, Examples & Benchmarks" | "ROI Calculator (Free & Private)" | "...Learn the formula, annualized ROI, and industry benchmarks." | Title/meta both claim ownership of formula, examples, *and* benchmarks in addition to the calculator — four intents compressed into one title tag, none of which is the dedicated page for that sub-intent. This is the most likely reason "roi formula" (104 impressions) and "how to calculate roi" (123 impressions) show impressions without clicks: **the homepage is a plausible search-result candidate for queries that have a more specific, better-matched page elsewhere on the same site**, splitting the click potential between two same-site results instead of concentrating it on one. |
| `saas/roi-calculator.html` | "SaaS ROI Calculator (Software Return on Investment)" | same | "SaaS ROI calculator to estimate software return based on time savings and cost reduction..." | Title/H1/meta are internally consistent and well-matched to calculator intent — **this page in isolation is fine**; the mismatch is external (§3, it collides with two other pages, not with itself). |
| `roi-calculator/saas/index.html` | "SaaS ROI Calculator & Subscription Business Return Guide" | same | "Calculate SaaS ROI: CAC, LTV, churn, payback period. Subscription business metrics and benchmarks. B2B financial modeling." | **Title says "Calculator" but the page has no calculator on it** (confirmed in Audits 01-03 — it only links out to 3 child calculators). This is a direct title/content mismatch: a searcher clicking on "SaaS ROI Calculator & Subscription Business Return Guide" expecting a calculator (as the title's first three words promise) lands on a guide with no input form, which is a plausible direct cause of near-zero clicks *converting to engagement* even in the rare case a click does happen — and a real risk of driving pogo-sticking that further depresses rankings for this exact page. |
| `saas/index.html` | "SaaS ROI Guide & Calculator" | same | "SaaS ROI: definition, how to justify software purchases, mistakes, ROI vs savings vs revenue. Links to calculator and benchmarks." | Same defect as above, slightly softer — title says "& Calculator" but the calculator is one click away, not on-page. Meta description is at least honest ("Links to calculator"), which is a small mitigating factor versus the page above. |
| `learn/roi-vs-irr.html` | "ROI vs IRR: Key Differences, Formula & When to Use Each" | "ROI vs IRR" | — | Near-identical to `comparisons/roi-vs-irr.html`'s title ("...Key Differences, Formula, Examples & When to Use Each") — a two-word difference ("Examples" added). This level of title similarity between two different URLs is itself a signal to Google that the pages may be duplicates, independent of the body-content overlap already noted in §3. |
| `comparisons/best-roi-calculator.html` | "Best ROI Calculator: Which Method Should You Use?" | same | "Compare simple ROI, annualized ROI, IRR, cap rate, and cash-on-cash. Pick the right ROI calculator method..." | No mismatch on its own terms, but note for §6: this page's intent ("which *method*") is adjacent to but does not satisfy "top roi calculators for saas sales" (a "which *tool/vendor*" commercial-investigation query) — a searcher landing here from that query would find a methodology comparison, not the vertical-specific listicle-style answer the query implies. |
| `hr/roi-calculator.html` | "Employee Retention ROI Calculator \| Turnover Cost" | "Employee Retention ROI Calculator" | — | Per Audit 03 §4.3, the page computes a turnover *cost*, not a return on any investment — the title's own subtitle ("Turnover Cost") is the more accurate description of what the page delivers, while the primary title phrase ("ROI Calculator") is the part that overpromises. This is a title/content mismatch that a searcher would discover only after clicking, which is consistent with — though not directly evidenced by — the near-zero-click pattern in the supplied data (this exact query isn't in the supplied list, but the mechanism is the same one degrading the SaaS cluster). |

---

## 5. AEO Evaluation

Per-page checklist (direct answer / calculation method / assumptions / authoritative context / concise definitions / entity relationships), assessed against representative pages from each tier identified in Audits 01-03:

| Page tier | Direct answer | Calc. method | Assumptions stated | Authoritative context | Concise definitions | Entity relationships |
|---|---|---|---|---|---|---|
| Homepage | ✅ (multiple, arguably too many — §Audit-02 found the core FAQ triad answered 4 separate times) | ✅ formula shown, worked example given | ⚠️ generic limitations list only, not scenario-specific | ✅ Organization schema, author disclosed | ✅ but repeated 3-4x on one page | ✅ links to IRR/NPV/cap-rate with reasoning |
| `learn/*` guides | ✅ one direct answer per page (schema `itemprop="name"/"acceptedAnswer"`) | ✅ | ⚠️ same generic limitations block as every other page (Audit 02 §3.3) | ⚠️ diluted by the same boilerplate appearing on 30+ unrelated pages — repetition of "authoritative-sounding" text across many pages reads as templated rather than authoritative to both users and (increasingly) AI crawlers evaluating originality | ✅ | ✅ |
| `roi-calculator/*/*` legacy pages | ✅ (3 stacked Q&A blocks per page in several cases) | ✅ | Same generic block | Same dilution issue, compounded by the pages themselves being near-duplicates of newer pages | ✅ | ✅ but frequently pointing back into the very pages these compete with (self-referential cannibalization loop) |
| Factory `/calculators/*` pages | ⚠️ one-line "Quick answer" only | ✅ minimal (formula shown implicitly via inputs, not stated in prose) | ❌ no limitations/assumptions section on most | ❌ thinnest authority signal of any tier — no schema beyond basic WebPage/FAQ | ✅ short and clean | ⚠️ minimal — mostly links to the same 3-4 generic hub pages |
| `methodology/index.html`, `site-structure.html`, legal pages | ❌ carries the generic "What Is ROI" entity-definition even though it isn't the topic of the page (Audit 02 §3.1, §5) | N/A for these pages | N/A | ❌ actively counterproductive — a methodology page or a Terms of Use page carrying unrelated ROI-definition boilerplate reads as templated/synthetic to exactly the kind of careful reader (or AI evaluator) that page should be building trust with | N/A | N/A |

**Direct answer to the section's core question — does the abundance of explanatory text improve answer extraction, or create noise?**

**It creates noise, and the evidence is internal to the repository, not just inferred.** Three independent lines of evidence converge:
1. **Volume without differentiation**: the same three generic blocks ("When to Use This Calculation," "Limitations of This Metric," "What Is ROI") appear on 30-52 pages verbatim (Audit 02 §3.2-3.3). An AEO/answer-extraction system (or a human skimming) encountering the identical boilerplate on a benchmarks page, a SaaS CAC/LTV page, and a Terms of Use page has no signal to prefer any one of them as the authoritative source — high textual volume with near-zero marginal information per additional page.
2. **Repetition within a single page**: the homepage answers "What is ROI? / How do you calculate ROI? / What is a good ROI?" in four different formats on one page (schema, visible Q&A block, in-article FAQ, hero copy). This does not improve extractability — a single clean instance of each answer, positioned once, is at least as extractable and removes the risk of an extraction system picking the *weakest* of the four near-duplicate renderings.
3. **The pages with the least explanatory bulk have the clearest answers**: the three inline marketing calculators (ROAS, email marketing, lead generation — Audit 03 §3) produce a single, scenario-specific, plain-English verdict sentence and are the best-performing pages in this audit's "does it actually answer the question" test, despite (or arguably *because of*) having far less surrounding boilerplate than the `/roi-calculator/*/*` pages they share a URL tree with.

**Conclusion:** the site does not have a shortage of explanatory text; if anything it has a surplus that is poorly targeted. The AEO problem is not "add more content to improve extraction" — it is "reduce the ratio of generic-to-specific content per page" so that what remains is more clearly the authoritative, extractable answer.

---

## 6. Final Verdict

**What SEO architecture should remain:**
- `benchmarks/*` (hub + 6 detail pages) — the cleanest, least-cannibalized structure on the site; no changes needed to its architecture.
- `comparisons/*` (hub + 7 detail pages), **once `learn/roi-vs-irr.html` is folded into `comparisons/roi-vs-irr.html`** (per Audit 02 §6) — this tree should become the site's single home for all "X vs Y" queries.
- The homepage as the head-term ("ROI calculator") owner — its role as *the* calculator is correct and should remain; only its title's attempt to also own formula/examples/benchmarks needs to be narrowed (a content decision already flagged in Audit 02, reconfirmed here as an SEO risk against two of the highest-impression queries supplied).
- The glossary tree (`glossary/*`) as the canonical home for term-level definitions (CAC, LTV, annualized return, etc.) — no cannibalization found here.

**What should be consolidated:**
- The SaaS trio (`saas/index.html`, `saas/roi-calculator.html`, `roi-calculator/saas/index.html`) — highest priority given it maps directly onto the largest cluster of impressions-with-zero-clicks in the supplied data. Per Audit 02 §6, one URL should stand as the SaaS hub with the buyer calculator on-page and the CAC/LTV content merged in as a labeled second section.
- `learn/roi-vs-irr.html` into `comparisons/roi-vs-irr.html` — same mechanism as the SaaS case, not yet visible in the supplied GSC data only because it wasn't in the sampled query list, not because the underlying architecture problem is any different.
- The real estate and solar dual-hub trees, and the `roi-calculator/marketing/email-marketing-roi.html` / `calculators/email-marketing-roi-calculator.html` pair — same pattern, lower observed urgency only because they weren't in the supplied query sample.
- The homepage's full restatements of the ROI formula and how-to-calculate steps — narrow to a summary + link to `learn/roi-formula.html` / `learn/how-to-calculate-roi.html` respectively, directly addressing the #1 and #2 queries by impression volume in the supplied data.

**What should be de-emphasized:**
- The generic three-block boilerplate stack ("When to Use This Calculation" / "Limitations of This Metric" / "What Is ROI") wherever it doesn't reflect the specific page's topic — per §5, this is actively diluting authority signal rather than building it. De-emphasize means reduce its footprint (shorter, or page-specific, or removed on pages where it doesn't belong — `methodology/`, `site-structure.html`, legal pages), not delete the underlying educational intent.
- The homepage's 4x-repeated core FAQ triad (schema + 3 visible renderings) — one schema instance + one visible instance carries the same AEO value with less internal noise.

**What should NOT be expanded:**
- **Do not add a dedicated page for "roi equation" or "roi calculation."** Per §2, these are intent-match gaps, but the correct response is not more pages competing with `learn/roi-formula.html` — it is ensuring that page's own title/H1/intro is broad enough to be the single answer for all three phrasings (formula / equation / calculation) rather than spawning siblings that would recreate the exact cannibalization problem this audit exists to diagnose. **This audit explicitly recommends against new page creation as the response to any finding in this report.**
- **Do not add a "top ROI calculators for SaaS" or "SaaS marketing ROI" page as new content** without first resolving the SaaS trio consolidation (§3) — building a fourth SaaS-adjacent page onto an already-cannibalized cluster would compound the diagnosed problem rather than fix it. If this intent is worth serving, it should be served by *repurposing* one of the three existing SaaS pages post-consolidation, not by adding a fourth.
- **Do not expand the `/calculators/*` factory tree with more single-formula variants** — Audit 01-03 already found 3-4 of the existing 14 to be near-duplicates of each other and of the homepage; more factory pages would extend the same pattern that is suppressing clicks on the SaaS cluster to additional query clusters.

**Pages that deserve authority (should be the sole target of internal links, nav entries, and future backlink/promotion effort for their concept):**
- `index.html` — ROI (head term), ROI calculator (head term)
- `learn/roi-formula.html` — ROI formula / equation / calculation (all three phrasings)
- `learn/how-to-calculate-roi.html` — how to calculate ROI
- `learn/what-is-roi.html` — what is ROI
- `comparisons/roi-vs-irr.html` — ROI vs IRR (once merged)
- `benchmarks/index.html` + its 6 children — all benchmark queries
- One consolidated SaaS hub (post-merge, replacing the current three) — SaaS ROI, SaaS ROI calculator

**Pages that should be treated as supporting pages only** (no independent SEO push, exist to serve users already on-site or to feed the canonical page above via internal links, not to rank independently for head terms):
- The 3 SaaS sub-calculators (`cac-ltv-roi.html`, `subscription-growth-roi.html`, `time-to-value-roi.html`) and their real-estate/solar/marketing equivalents — legitimate as child tools once the parent hub is consolidated, not as independent ranking targets for vertical head terms.
- `glossary/*` term pages — support definitional long-tail queries but should link up to `learn/*` and `comparisons/*` rather than compete with them.
- 3 of the 4 basic `/calculators/*` pages (`simple-`, `free-`, `roi-calculator-example`) — per Audit 01-03, these are the same calculator; at most one should carry any SEO weight, the others should be pure internal-link/redirect targets.
- `finance/index.html`, `operations/index.html`, `marketing/index.html` (thin factory hubs) — useful as internal directory pages, not positioned to compete for any head or mid-tail term in their category.

---

*End of Audit 04. No files were modified and no SEO content was added in the preparation of this report.*
