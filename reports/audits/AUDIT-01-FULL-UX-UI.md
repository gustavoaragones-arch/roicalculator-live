# AUDIT 01 — Full UX / UI / Information-Hierarchy Audit
**roicalculator.live — Project Director Audit**
Read-only. No files modified, no fixes implemented, no content rewritten, no pages deleted or created.

Method: static analysis of the repository (source of truth) — 87 HTML files, `assets/css/styles.css` (1,006 lines), `templates/*`, `partials/*`, `data/calculators.json`, `scripts/*`, and the generated calculator/hub/article output — cross-checked against the live structure at roicalculator.live. Findings are anchored to exact files/lines.

---

## 0. Executive Summary

The site is not badly designed at the pixel level — the dark theme, spacing tokens, and card styling are coherent and above-average for an indie utility site. **The problem is architectural, not cosmetic.** A single SEO/AEO content-generation pattern (a fixed stack of boilerplate blocks: `ai-answer-block` → `ai-citation` → `use-case-block` → `limitations-block` → `entity-definition` → `key-takeaways` → FAQ → `related-topics`) has been stamped onto **every page in the site regardless of topic**, including pages where it makes no sense at all (see §5, `methodology/`, `site-structure.html`). Combined with a calculator-factory system that has produced **multiple pages performing the identical one-formula calculation** under different names, and **three separate, mutually competing "SaaS ROI" pages**, the product reads as a content farm wearing a fintech-tool skin, not as a coherent product with an SEO layer underneath.

This is fixable without a rebuild. The design system (CSS, calculator card, results panel) is worth keeping. What needs to change is content architecture: consolidate duplicate calculators, cut the boilerplate stack down to one instance per page, and restore a single unambiguous "the calculator" per vertical.

---

## 1. Audit Scope — Page Inventory & Classification

87 HTML files total. Classified by actual function (not by URL folder, which is inconsistent):

| Class | Examples | Count (approx) |
|---|---|---|
| **Product pages** (a working calculator is the primary artifact) | `index.html`, `saas/roi-calculator.html`, `real-estate/roi-calculator.html`, `real-estate/cap-rate-calculator.html`, `solar/roi-calculator.html`, `hvac/roi-calculator.html`, `hr/roi-calculator.html`, 11 files under `calculators/*`, 12 files under `roi-calculator/*/*` | ~28 |
| **Hub / category pages** (guide + links to calculators, no calculator of their own) | `saas/index.html`, `real-estate/index.html`, `marketing/index.html`, `solar/index.html`, `finance/index.html`, `operations/index.html`, `roi-calculator/{saas,real-estate,marketing,solar}/index.html`, `benchmarks/index.html`, `comparisons/index.html` | ~12 |
| **Educational / reference pages** | `learn/*` (5), `glossary/*` (10), `methodology/index.html`, benchmark detail pages (6), comparison detail pages (6) | ~27 |
| **SEO-only landing pages** (no unique product, thin reframing of an existing calculator for a keyword variant) | `calculators/simple-roi-calculator.html`, `calculators/free-roi-calculator.html`, `calculators/roi-calculator-example.html`, `comparisons/best-roi-calculator.html` | 4+ |
| **Site/meta pages** | `about.html`, `contact.html`, `privacy.html`, `terms.html`, `site-structure.html`, `sitemap.html`, `404.html` | 7 |

**Finding 1.1 — The URL taxonomy has two competing hub systems for the same three verticals.**
- SaaS: `/saas/` (guide) + `/saas/roi-calculator.html` (calculator) **and** `/roi-calculator/saas/` (a second "hub" with its own guide and its own three sub-calculators: `cac-ltv-roi.html`, `subscription-growth-roi.html`, `time-to-value-roi.html`).
- Real estate: `/real-estate/` (guide + 4 calculators) **and** `/roi-calculator/real-estate/` (a second hub, explicitly called "Legacy real estate tools" from within `/real-estate/index.html:129`, with its own 3 sub-calculators).
- Solar: `/solar/roi-calculator.html` + `/solar/` **and** `/roi-calculator/solar/` (again with its own 3 sub-calculators).
- Marketing: `/marketing/index.html` **and** `/roi-calculator/marketing/` (3 more sub-calculators).

This is not hub-and-spoke information architecture; it is two parallel site structures that were never merged. `/real-estate/index.html` even admits it in its own copy by labeling the other one "legacy" — but both are live, both are in the sitemap, and neither `robots.txt`/canonical structure fully resolves which one Google (or a user) should treat as authoritative for "real estate ROI calculator."

---

## 2. User Journeys

### Journey A — "I want to calculate ROI immediately" (generic)
Lands on `/`. Sees: sticky header (10 links + dropdown) → horizontal calculator-strip (6 more links) → ad slot → hero → an AEO sentence → **the calculator** (`index.html:150-208`). The calculator itself is reachable but is the **5th distinct navigational/content element** on the page before any interaction is possible. Hierarchy is intact (calculator is visually the first "card"), but it is preceded by two full rows of competing links (nav + calculator-strip) that all say some variant of "go to a different page," which contradicts the fact the user is already where they want to be.

### Journey C/D/E — "I want a SaaS / real-estate / solar ROI calculation"
This is the worst-served journey on the site. A user searching "SaaS ROI calculator" and landing on `/saas/` gets a **guide with no calculator on the page** — the only calculator access is one CTA button (`saas/index.html:64`) to a *different URL*. If they instead land on `/roi-calculator/saas/`, there is **still no calculator on the page** — just three more links to sub-calculators plus a link back to `/saas/roi-calculator.html`. A user has to make **two navigations minimum** and pick correctly between two hubs to reach a working form. This directly fails Journey C's core intent ("I want a SaaS ROI calculation," not "I want to read about SaaS ROI methodology").

### Journey F — Informational Google query (e.g., "what is a good ROI")
Served reasonably well content-wise, but the answer is **duplicated 3–4 times on the same page** they land on (see §5) — JSON-LD FAQ, `ai-answer-dominance` block, `home-aeo` definition block, and the in-article FAQ list all restate "What is a good ROI?" with near-identical wording (`index.html:66-71`, `index.html:250-255`, `index.html:393-396`). A human reader scrolling past the calculator hits the same question answered four different ways before reaching anything new.

### Journey G — Direct calculator query (e.g., "simple ROI calculator")
Google can plausibly rank any of: homepage, `calculators/simple-roi-calculator.html`, `calculators/free-roi-calculator.html`, or `calculators/roi-calculator-example.html` — **all four compute the exact same formula** `(return − cost) / cost × 100` with only the input labels changed (confirmed byte-for-byte in `data/calculators.json`-driven configs at the bottom of each file, e.g. `calculators/simple-roi-calculator.html:203` vs `calculators/free-roi-calculator.html:205`). The user cannot tell, and functionally it does not matter, which one they land on — which means the site has built four products to serve one.

### Where uncertainty/cognitive overload occurs (cross-journey)
1. **Nav dropdown vs top-level nav duplicate the same six links** (`partials/header.html:5-18` — Real Estate/Solar/SaaS appear both as top-level items and inside "Calculators ▾"). Six of ten possible destinations are reachable two ways from the header alone.
2. **Every hub/guide page ends in 3–5 stacked "explore further" link lists** (`related-topics`, `related-calculators`, `explore-industry` ×3, footer `footer-popular`, footer `footer-links`) that substantially overlap in destination — e.g. the homepage alone links to `/saas/index.html` **four separate times** in the footer + body (`index.html:107,125,411,421,483,496`).
3. **Sticky calculator bar** (`index.html:517-536`) appears after 320px of scroll on the homepage promising "Try ROI Calculator," even though the user has already scrolled *past* the calculator to trigger it — the CTA target (`#main-roi-calculator`) is now above the user, not below, which is a disorienting scroll-anchor pattern.

---

## 3. Visual Hierarchy

**What the CSS actually establishes as PRIMARY:** the calculator card (`.calculator-card`, `styles.css:357-370` — glass blur, shadow, hover lift) and its `h1`. This part works — it is the most visually distinct element on every product page.

**What reads as SECONDARY:** results panel, AEO quick-answer strip (green left-border accent, `styles.css:379-388`), key-takeaways box.

**What should be TERTIARY but is not visually distinguished from SECONDARY:** this is the actual failure. `.ai-answer-block`, `.definition-block`, `.ai-citation`, `.example-block`, `.key-takeaways`, and `.quick-answer` **all use the same visual grammar** — a `--color-bg-alt` panel with a left accent border in `--color-accent` green (`styles.css:381,606-614,705-710,730-736,776-782`). There are **six semantically different content types** (a direct AI-answer, a formal definition, a citation note, a worked example, a takeaway summary, and a quick-answer teaser) rendered as **the same box** with only heading text distinguishing them. A user scrolling a hub page like `benchmarks/index.html` encounters five near-identical green-bordered boxes in a row (lines 81-124) with no visual signal that they differ in purpose. This is the single biggest visual-hierarchy defect on the site: it isn't that hierarchy is "weak," it's that **one style is being reused for six distinct information types**, collapsing the hierarchy Claude/Google/the user needs to parse content roles.

**Heading hierarchy:** Structurally sound (h1→h2→h3 nesting is respected everywhere sampled), but semantically flat — most hub pages repeat the identical h2 text ("When to Use This Calculation," "Limitations of This Metric," "What Is ROI (Return on Investment)?") verbatim across unrelated pages (see §5), so heading text is no longer a reliable differentiator of what section a reader is in.

**Card usage:** Only one true "card" pattern exists (`.calculator-card`) and it is used correctly and sparingly. The `.ai-answer-block` / `.definition-block` / etc. are visually card-like but styled as flat bordered `<section>`s, creating an inconsistent "is this a card or not" reading between the one interactive card and the dozen decorative panels around it.

**Navigation density:** header nav = 9 top-level targets + 1 dropdown (6 more) + privacy badge, all in a single `flex-wrap` row (`styles.css:96-104`) with **no hamburger/collapse breakpoint** — see §8.

---

## 4. Content Density (representative pages)

| Page | Major `<section>`s | H2/H3 count | Nav/link blocks | Content before calculator | Content after calculator | CTA-style elements |
|---|---|---|---|---|---|---|
| `index.html` (home) | 14 | 19 | 5 (header, dropdown, calc-strip, footer×3) | 3 blocks (hero, AEO anchor) | **11 blocks** (2 AEO answers, quick-answer, 3 Q&A, 4 AEO sub-sections, full article with table+FAQ+4 link lists) | 2 buttons + 1 sticky bar + ~40 inline text links |
| `saas/roi-calculator.html` | 6 | 9 | 4 | 1 (hero) | 3 (who-should-use, 3-Q&A block, link line) | 1 button |
| `roi-calculator/saas/index.html` | 13 | 19 | 3 | n/a (no calculator on page) | entire page | 0 calculator CTAs, 1 hub link, ~25 text links |
| `benchmarks/index.html` | 12 | 15 | 3 | n/a | entire page | ~20 text links, 0 calculator |
| `comparisons/index.html` | 11 | 12 | 3 | n/a | entire page | ~24 text links, 0 calculator |

**Content-to-purpose ratio is worst on:** `roi-calculator/saas/index.html`, `benchmarks/index.html`, `comparisons/index.html`, `glossary/index.html`, `site-structure.html`, `methodology/index.html` — pages whose stated purpose (a hub, a glossary index, a methodology note) is a single paragraph's worth of information, padded with the full 6-block AEO stack plus a benchmarks table plus a 6-13 item FAQ plus 3 link lists. `glossary/index.html`, for instance, needs to say "here are 9 terms" and instead runs ~100 lines of boilerplate before the 9-item list appears at line 101.

---

## 5. Repetition (the central finding of this audit)

Every one of the following is **verbatim or near-verbatim duplicated**, not just conceptually repeated:

1. **`use-case-block` bullets** — "Evaluating investment profitability / Comparing multiple opportunities / Estimating return over time" appears **word-for-word identical** on `index.html:269-273`, `roi-calculator/saas/index.html:108-113`, `benchmarks/index.html:103-109`, `comparisons/index.html:99-105` — on pages about ROI, SaaS unit economics, industry benchmarks, and metric comparisons respectively. The bullets describe none of those topics specifically.
2. **`limitations-block` bullets** — "Does not account for time value of money / Depends on assumptions / May not reflect risk" — identical across the same four pages, plus reworded-but-structurally-identical variants on `glossary/index.html:89-93`, `site-structure.html` ("Describes structure, not personalized advice..."), `methodology/index.html`. On `site-structure.html` — a page about internal link architecture — this block is nonsensical in context.
3. **`entity-definition` block** — "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost." — copy-pasted verbatim on `roi-calculator/saas/index.html:127`, `benchmarks/index.html:123`, `comparisons/index.html:119`, `site-structure.html`, regardless of whether the page is about SaaS, benchmarks, comparisons, or site navigation.
4. **"What is ROI? / How do you calculate ROI? / What is a good ROI?"** — this exact FAQ triad appears independently as: JSON-LD FAQPage schema (`index.html:38-79`), an `ai-answer-dominance` block (`index.html:234-256`), a plain-text FAQ list further down the same page (`index.html:379-401`), and again inside the homepage's own hero copy. That's **four renderings of the same three answers on one page.**
5. **The ROI formula and annualized-ROI formula** are restated in full on the homepage, `learn/roi-formula.html`, `learn/what-is-roi.html`, and inline again on `roi-calculator/saas/index.html`, `benchmarks/index.html` methodology asides — each with its own worked example using different numbers.
6. **Related-link modules** — `related-topics`, `related-calculators`, `explore-industry` (×3 variants: trending, by-industry, benchmarks, comparisons), footer `footer-links`, footer `footer-popular` — six distinct "here are more links" modules per page, heavily overlapping in destination (the homepage links to its own footer's "Popular Tools" list a second time in the body's "Trending ROI Tools" section with 5 of 6 links identical: `index.html:406-412` vs `index.html:491-496`).
7. **Four functionally identical basic-ROI calculators**: homepage's generic calculator, `calculators/simple-roi-calculator.html`, `calculators/free-roi-calculator.html`, `calculators/roi-calculator-example.html` all compute `(return − cost) / cost × 100` from two inputs. Confirmed via the embedded `factory-page-config` JSON in each (identical `formulas` shape, cosmetic field-name differences only).

**Classification of the repetition, per the audit brief's taxonomy:**
- Items 1–3 (identical boilerplate blocks): **Template-generated duplication (#3) + structural duplication (#5)** — not editorial choices, but an unconditional content-stamping step (see `scripts/patch-site-chrome.mjs`, `scripts/aeo_phase11.py`, `scripts/patch_footer_simplify.py` — script names strongly indicate a scripted retrofit pass) applied without a per-page-type conditional.
- Item 4 (FAQ answers repeated in 4 formats on one page): **SEO/AEO-driven repetition (#4)**, plausible intent (schema + visible answer + snippet-bait), but the *execution* duplicates it 4×, which is redundant beyond what AEO requires (1 schema instance + 1 visible instance would achieve the same optimization goal).
- Item 5 (formula restated per page): **Useful contextual repetition (#1)** — this one is legitimate; a reader on a SaaS page shouldn't have to leave to find the ROI formula. Keep this type.
- Item 6 (link modules): **Unnecessary repetition (#2)** compounding into **structural duplication (#5)** — six overlapping "more links" patterns is not six different features, it's one feature (related links) implemented six times without consolidation.
- Item 7 (four identical calculators): **SEO-driven repetition (#4)**, but crossing into a genuine product defect — it is not just repeated content, it is a repeated *product surface*, which actively confuses the "which one is real" question for users and fragments backlink/ranking signal for Google across four URLs instead of consolidating on one.

---

## 6. Information Hierarchy: Intended vs. Actual

**Intended (implicit from the design system):**
```
Calculator → Result → Interpretation → Methodology → Comparison → Optional deeper education
```

**Actual, on the homepage and every vertical calculator page sampled:**
```
Nav (10 links) → Calc-strip (6 links) → Ad → Hero → AEO anchor sentence
→ Calculator → SEO answer block #1 → SEO answer block #2 → Quick-answer teaser
→ 3× AI-answer Q&A blocks → 4× AEO sub-sections (definition/citation/use-case/limitations)
→ Ad → Full article (takeaways, formula, example, formula again, misleading-uses,
   vs-IRR, benchmark table, mistakes, 5-item FAQ) → 4× link-list modules → Ad → Footer (4 nav blocks)
```

**On hub pages (`saas/index.html`-style, `benchmarks/`, `comparisons/`):**
```
Nav → Ad → Hero/H1 → 2-3× AI-answer Q&A → definition-block → ai-citation → use-case-block
→ limitations-block → entity-definition → summary-table → body article → key-takeaways
→ TOC → H2 sections → sub-pages list → FAQ → related-topics → Ad → Footer
```

This is precisely the failure pattern named in the audit brief: **SEO content → SEO content → SEO content → (sometimes) calculator → SEO content → SEO links → more SEO content.** On roughly half the "hub" pages there is no calculator at all in this stack — it is SEO content end to end, with the calculator delegated one click away.

---

## 7. Professionalism

**What supports credibility:** the "no cookies, no tracking" badge is genuine (calculators run client-side), the dark theme and monospace numerals give it a legitimate fintech-utility look, and `about.html` discloses a real (if thin) operating entity (Albor Digital LLC, Wyoming).

**What undermines it, specifically:**
- **Identical boilerplate paragraphs across unrelated pages** (§5) are exactly the pattern a sophisticated user — or an AI system doing AEO evaluation, which this site is explicitly optimizing for — recognizes as programrmatic/AI-generated filler, not authored guidance. This is the single largest credibility risk on the site, more damaging than any visual issue.
- **Two hubs per vertical, one self-labeled "legacy"** (§1) reads as an unfinished migration left live, not an intentional product structure.
- **Four calculators with one formula** (§5.7) reads as programmatic SEO scaling rather than a considered product suite.
- **`site-structure.html` and `methodology/index.html` carrying the exact same "What Is ROI" / "Limitations of This Metric" filler as a benchmark page** (§5.3) — a methodology page is precisely where a finance-adjacent tool most needs to look authored and precise, and instead it looks templated.
- Minor: `about.html` and `methodology/index.html` are marked `noindex, follow`, meaning the site's own trust-establishing pages are deliberately hidden from search, which is a defensible SEO call but works against the "we are a real, professional operator" impression for anyone who does find them via the footer.

---

## 8. Mobile UX (from responsive CSS inspection)

`assets/css/styles.css` contains **exactly three** `@media` rules in 1,006 lines: `max-width: 900px` (collapses `.hero-grid` to one column — but `.hero-grid` isn't used by the sampled pages, it appears to be dead/legacy CSS), `max-width: 520px` (stacks `.results-box` to one column), and `@media print`. **There is no breakpoint for the header navigation, the calculator-strip, the multi-column form-rows, tables, or the sticky bar.**

Concretely, on a ~375px viewport:
- **Header nav** (`partials/header.html:2-27`) is a `flex-wrap` row with logo + 9 links + dropdown trigger + privacy badge and no hamburger pattern (`navigation.js` only toggles the *dropdown*, not a mobile menu) — this will wrap into a multi-line, visually cluttered header on every single page, competing with the content below it since `.site-header` is `position: sticky` (`styles.css:87-95`) and permanently consumes vertical space while scrolling.
- **`.calculator-strip`** (`styles.css:555-573`) is explicitly built as a horizontal-scroll row for small screens — a reasonable pattern, but it sits directly under the already-wrapped header, so mobile users face two full rows of navigation chrome before any hero content.
- **`.form-row`** uses `grid-template-columns: repeat(auto-fit, minmax(180px, 1fr))` (`styles.css:427-430`) with no reduced minmax for mobile — a 180px minimum column on a 375px screen (minus padding) allows at most one, awkwardly, sometimes two cramped columns depending on gap math; three-input rows (e.g. `real-estate/roi-calculator.html`'s 9-input, 3-row form) stack unevenly rather than cleanly to one column.
- **`.sticky-calc-bar`** (`styles.css:216-253`) adds a fixed 56px bottom bar once the user scrolls past 320px, permanently reducing usable viewport (`body.has-sticky-calc-bar { padding-bottom: 56px }`) on top of the sticky header — on a phone in landscape or a shorter device this is a meaningful chunk of the viewport lost to two persistent chrome bars sandwiching the content.
- **Tables** (`benchmarks table`, `summary-table`, comparison tables) have no horizontal-scroll wrapper except `.summary-table-box { overflow-x: auto }` — plain `<table>` elements in article bodies (e.g. `index.html:337-367`'s benchmark table) have no such wrapper and will force page-level horizontal scroll or aggressive font-shrinking on narrow screens.
- **Chart container** is a fixed `height: 280px` (`styles.css:575-579`) regardless of viewport width, which is fine for height but doesn't address canvas redraw/label crowding on narrow widths — lower priority than the above.

---

## 9. Prioritized Findings

### P0 — Severe UX failures

**P0-1. Three competing "SaaS ROI" surfaces with no calculator on two of them.**
- Page/template: `saas/index.html`, `saas/roi-calculator.html`, `roi-calculator/saas/index.html`
- Location: entire pages; cross-links at `saas/index.html:78`, `roi-calculator/saas/index.html:84`
- Problem: A user seeking "SaaS ROI calculator" has a 1-in-3 chance of landing on a page with no calculator, and even on the calculator page must guess whether `/saas/` or `/roi-calculator/saas/` is the "real" hub.
- Why it matters: Directly fails Journey C. Fragments SEO authority across 3 URLs for overlapping queries.
- Root cause: Two site-generation passes (an earlier vertical build + a later "hub" migration) were never merged; the older one was renamed "legacy" in prose but not removed or redirected.
- Recommended direction: Pick one canonical SaaS hub URL, 301-redirect or fold the other's unique content (CAC/LTV education) into it as a section, keep sub-calculators as clearly-labeled child tools.
- Scope: Medium (content merge + redirects, no new design work).

**P0-2. Four calculators computing the identical formula, marketed as different products.**
- Page/template: `calculators/simple-roi-calculator.html`, `calculators/free-roi-calculator.html`, `calculators/roi-calculator-example.html`, homepage generic calculator
- Location: `factory-page-config` blocks at the bottom of each file
- Problem: No functional differentiation; only copy/labels differ.
- Why it matters: Actively erodes trust once a user (or reviewer) notices; splits ranking signal for near-identical queries; adds zero product value for 3 of the 4 pages' worth of maintenance.
- Root cause: Programmatic calculator factory (`scripts/generate-calculators.mjs`, `data/calculators.json`) used to scale keyword coverage rather than genuine feature variety.
- Recommended direction: Consolidate to one canonical basic-ROI calculator page; repoint the SEO variants as redirects or fold them into a single page with keyword-relevant headings via canonical tag, not duplicate pages.
- Scope: Medium.

**P0-3. No mobile navigation collapse.**
- Page/template: `partials/header.html`, `assets/css/styles.css:96-123`, `assets/js/navigation.js`
- Location: `.nav-main`, `.nav-links`
- Problem: 9 top-level links + dropdown + privacy badge in a wrapping flex row with zero mobile-specific breakpoint or hamburger pattern.
- Why it matters: This is the single most-seen element on the site (every page, every viewport) and is unaddressed for the majority-mobile traffic a calculator/finance site typically receives.
- Root cause: Nav grew from ~5 to ~10 destinations over time without a corresponding mobile pattern being added (`navigation.js` only handles the desktop-style dropdown toggle).
- Recommended direction: Add a proper mobile nav breakpoint (hamburger/off-canvas or condensed icon nav) below ~640px.
- Scope: Medium.

### P1 — Major UX problems

**P1-1. Identical AEO/SEO boilerplate blocks stamped on every page regardless of topic.**
- Page/template: `roi-calculator/saas/index.html:107-128`, `benchmarks/index.html:103-124`, `comparisons/index.html:99-120`, `glossary/index.html:78-99`, `site-structure.html`, `methodology/index.html`
- Location: `.use-case-block`, `.limitations-block`, `.entity-definition` sections
- Problem: Verbatim-repeated generic text ("Evaluating investment profitability / Comparing multiple opportunities / Estimating return over time"; "Does not account for time value of money...") on pages about benchmarks, comparisons, SaaS metrics, and site navigation alike.
- Why it matters: This is the strongest single signal of "machine-generated, not authored" that a critical user or AI evaluator will notice; directly damages perceived authority (§7).
- Root cause: A scripted content-injection pass (evidenced by `scripts/aeo_phase11.py`, `scripts/patch-site-chrome.mjs`) applied a fixed block set to all pages without per-page-type customization or an exclusion list for non-calculation pages.
- Recommended direction: Either (a) write page-specific variants of these three blocks per page type, or (b) remove the block entirely from pages where it doesn't apply (glossary index, site-structure, methodology, hub pages that aren't "a calculation").
- Scope: Large (content-writing effort across ~20+ pages), but mechanically simple to identify (grep for the shared strings).

**P1-2. Six visually-identical box styles used for six semantically different content types.**
- Page/template: `assets/css/styles.css:379-388, 606-614, 705-711, 730-736, 776-782`
- Location: `.quick-answer`, `.aeo-answer-block`, `.definition-block`, `.example-block`, `.key-takeaways`, `.ai-answer-block`
- Problem: Same green-left-border-on-dark-panel treatment for direct-answer, definition, citation, example, and takeaway content.
- Why it matters: Collapses visual hierarchy exactly where the audit brief asks it to be evaluated (§3) — a reader cannot distinguish "this is a definition" from "this is a worked example" from "this is a citation note" without reading the heading text.
- Root cause: All six were likely added incrementally by the same AEO-optimization passes, each reusing the nearest existing "highlighted box" style rather than establishing a small differentiated system (e.g., different accent colors or icons per content role).
- Recommended direction: Define 2-3 visually distinct treatments (e.g., definition vs. example vs. takeaway) and remap the six classes onto them.
- Scope: Small–medium (CSS only).

**P1-3. Duplicate/competing hub structure for real estate and solar (same pattern as SaaS, P0-1) but lower urgency since each still has one clear calculator entry point.**
- Page/template: `real-estate/index.html` vs `roi-calculator/real-estate/`; `solar/roi-calculator.html`/`solar/` vs `roi-calculator/solar/`
- Location: cross-links at `real-estate/index.html:129`
- Problem: Same dual-hub issue as P0-1, but real estate's primary calculator is reachable in one click from `/real-estate/`, softening the impact.
- Why it matters: SEO fragmentation and user confusion, lower severity than SaaS since a working path exists.
- Root cause: Same migration-not-completed issue as P0-1.
- Recommended direction: Same as P0-1, lower urgency.
- Scope: Medium.

**P1-4. FAQ/definition answers repeated up to 4× on a single page.**
- Page/template: `index.html` (worst offender) — JSON-LD (lines 38-79), `ai-answer-dominance` (234-256), body FAQ (379-401), hero/AEO copy (140-147, 232)
- Problem: Same 3-4 questions answered in structurally different wrappers back-to-back down the page.
- Why it matters: Inflates scroll length without adding information; a returning or careful reader notices the repetition immediately.
- Root cause: AEO best-practice ("answer in schema + answer visibly") was applied multiple times instead of once.
- Recommended direction: Keep one schema instance + one visible instance; delete the redundant renderings.
- Scope: Small.

**P1-5. No overflow handling on plain in-article `<table>` elements.**
- Page/template: `index.html:337-367` (Industry Benchmarks table) and similar tables in comparison/benchmark article bodies
- Problem: Tables outside `.summary-table-box` have no `overflow-x: auto` wrapper.
- Why it matters: Mobile horizontal scroll or unreadable compressed columns (§8).
- Root cause: `.summary-table-box` wrapper pattern exists but wasn't applied consistently to every table.
- Recommended direction: Wrap all article tables in the existing `.summary-table-box` pattern.
- Scope: Small.

### P2 — Meaningful improvements

**P2-1. Link-list redundancy (related-topics / related-calculators / explore-industry ×3 / footer-links / footer-popular).**
- Location: bottom third of nearly every page, e.g. `index.html:403-467`
- Problem: Six distinct "more links" modules per page with heavy destination overlap.
- Recommended direction: Consolidate to one "Related" module + the footer; drop the mid-article duplicate lists.
- Scope: Medium (touches every template).

**P2-2. Sticky calculator bar targets a now-passed anchor.**
- Location: `index.html:517-536`
- Problem: Appears after the user scrolls past the calculator, but its CTA scrolls back up to it — a confusing "go back" pattern disguised as "try now."
- Recommended direction: On pages where the calculator is above the fold, either suppress the bar or repoint its CTA/copy to reflect "back to calculator."
- Scope: Small.

**P2-3. Dead/unused CSS (`.hero-grid`, `.dropdown-menu`/`.dropdown-group`, `.site-footer--minimal`, `.footer-links--compact`) inflating the stylesheet and signaling unmanaged technical debt.**
- Location: `styles.css:171-213, 296-306, 974-989`
- Recommended direction: Audit for actual usage and remove; not user-visible but affects maintainability and is a professionalism signal for anyone who inspects source (a known behavior of AI crawlers/AEO evaluators).
- Scope: Small.

**P2-4. Breadcrumb taxonomy mismatch.**
- Location: `calculators/simple-roi-calculator.html:104`, `calculators/free-roi-calculator.html:104` breadcrumb to "Finance" while `finance/index.html` doesn't list `roi-calculator-example.html` or other calculators/ pages consistently against what the breadcrumb implies.
- Recommended direction: Reconcile the `/finance/`, `/calculators/`, and vertical-hub taxonomies into one consistent tree (ties into P0-1/P1-3's broader IA cleanup).
- Scope: Medium.

### P3 — Polish

**P3-1.** Ad slot placeholders (`ad-top`/`ad-middle`/`ad-bottom`) reserve visible empty space (`min-height: 90-250px`) on every page even though no ad content is described as active in the sampled files — worth confirming these are intentionally reserved and not simply dead visual gaps.
**P3-2.** Inconsistent use of `<h2>` vs `<h3>` for FAQ items across templates (`templates/article-template.html` factory FAQ uses none of the visible-heading pattern seen on hand-built pages like `index.html`'s `.faq-item h3`) — minor semantic drift between hand-authored and generated pages.
**P3-3.** Two dropdown-menu CSS systems (`.nav-dropdown-menu` and `.dropdown-menu`/`.dropdown-group`) coexist; only the former appears used in sampled markup — confirm the latter is fully dead before any nav rework (relevant to P0-3).

---

## 10. Final Product Verdict

**1. Is the current design salvageable without a structural redesign?**
Yes, on the visual/CSS level — the calculator card, dark theme, and form/results components are solid and should not be thrown out. **No**, on the information-architecture level — the dual-hub structure (P0-1/P1-3) and the four-calculators-one-formula problem (P0-2) are structural content problems, not visual ones, and need to be resolved before any visual polish will matter. This is a content/IA consolidation project wearing the clothes of a "redesign" request.

**2. Which components should be preserved?**
- The dark theme design tokens and typography (`:root` variables, IBM Plex pairing).
- `.calculator-card` / `.calculator-module` / `.results-panel` / `.result-card` — the actual interactive product surface.
- The privacy badge and "no cookies/tracking" positioning — genuine differentiator, keep and consider making more prominent.
- The breadcrumb pattern and JSON-LD schema discipline (structurally correct, just over-applied in content terms).

**3. Which components should be redesigned?**
- The six-box "highlighted panel" system (§3, P1-2) — needs a differentiated visual language per content role.
- Header navigation for mobile (P0-3) — needs an actual responsive pattern, not just a dropdown toggle.
- The link-module system (P2-1) — needs to shrink from six overlapping modules to one or two.

**4. Which sections should probably be removed entirely?**
- The duplicate FAQ/definition renderings on the homepage (P1-4) — cut to one schema + one visible instance.
- The "legacy" `/roi-calculator/{saas,real-estate,solar,marketing}/` hub *guide content* specifically (the sub-calculators inside them may be worth keeping as child tools of a single consolidated hub) — see P0-1.
- Three of the four basic-ROI calculator pages (P0-2) — keep one, redirect the rest.
- The generic `use-case-block`/`limitations-block`/`entity-definition` triplet wherever it's been pasted onto a page that isn't itself a calculation (glossary index, site-structure, methodology) — P1-1.

**5. Which content should be consolidated?**
- SaaS: merge `/saas/` guide content + `/roi-calculator/saas/` CAC/LTV content into one hub page, with `saas/roi-calculator.html` and the three CAC/LTV/growth/time-to-value tools as clearly labeled child calculators under it.
- Real estate and solar: same pattern, lower urgency.
- The four basic-ROI calculators into one.
- The six link-list modules into one "Related" section per page.

**6. Which page should become the design reference page?**
`saas/roi-calculator.html` is the best candidate for a **visual/layout** reference — it has the cleanest single-calculator-first structure sampled (hero → calculator → one "who should use this" block → one Q&A block → one link line), closest to the intended hierarchy in §6. It should not be copied as-is, though, until its SaaS-specific IA problem (P0-1) is resolved — otherwise the reference page inherits the site's worst structural issue.

**7. Should SaaS ROI Calculator become the first implementation target?**
Yes, and for a specific reason beyond "it's a good page": it is also the site's **worst-fragmented vertical** (three competing surfaces, P0-1). Fixing SaaS first forces the IA consolidation pattern (merge guide + calculator + sub-tools into one hub, apply the trimmed boilerplate stack, apply the mobile nav fix) to be worked out once, on the vertical that most needs it — and that pattern can then be mechanically repeated for real estate, solar, and marketing.

**8. What should the site's ideal information hierarchy be?**
```
Header (collapsed on mobile) — one unambiguous nav, no duplicate top-level/dropdown entries
  ↓
Calculator (always on-page for any "X ROI calculator" URL — never delegated to a second click)
  ↓
Result
  ↓
One short interpretation/quick-answer (single instance, not 3-4 restatements)
  ↓
Methodology note (formula + assumptions, contextual to this calculator only)
  ↓
One comparison callout (e.g., "see also cap rate" / "see also IRR") — single link, not a full section
  ↓
One consolidated "Related" module (calculators + benchmarks + comparisons + glossary, merged)
  ↓
FAQ (3-5 items, once)
  ↓
Footer
```
Every vertical hub (SaaS, real estate, solar, marketing) should resolve to exactly one URL that contains a working calculator on first load, with sub-calculators (CAC/LTV, flip ROI, EV charger, etc.) as clearly labeled children of that one hub — not parallel hub trees.

---

*End of Audit 01. No files were modified in the preparation of this report.*
