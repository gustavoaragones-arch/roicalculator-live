# MASTER DIAGNOSTIC
**roicalculator.live — Project Director Synthesis**
Read-only. No repository files modified. This document reconciles Audits 01-07 into one diagnosis. Every claim below is traceable to a specific audit and section, cited inline as (A0#§#).

---

## 1. What is fundamentally wrong with the current site?

The site is not badly designed and its math is not, for the most part, wrong. The dark theme and component system are coherent (A01§0), the calculation engines are mostly correct (A03§4.6), and three of its seven content trees (comparisons, benchmarks, glossary) are clean, well-organized, and free of the defects found everywhere else (A02§6G).

**What is fundamentally wrong is that two separate content-generation efforts were run on this site, years apart, and were never reconciled into one architecture** (A02§4, A05§6). An earlier hand-authored/scripted build produced `learn/`, `comparisons/`, `benchmarks/`, `glossary/`, `methodology/`, and a full `/roi-calculator/{saas,real-estate,solar,marketing}/*` vertical tree, then a Python script (`aeo_phase11.py`) swept across nearly all of it and stamped four generic boilerplate blocks onto 30-52 pages regardless of topic — including the 404 page, the privacy policy, and the terms of use (A02§3.1, A05 headline finding). A later, better-engineered factory pipeline (`data/calculators.json` → `generate-calculators.mjs` → `calculator-quality.mjs`) then built a *second*, parallel vertical tree (`/calculators/*`, `/saas/`, `/real-estate/`, `/solar/`, `/marketing/`) without ever being told the first one existed, without redirecting it, and without any tool checking whether the new pages duplicated the old ones (A05§4, A05§6-Problem-3).

Nothing in the toolchain has ever asked "does a page for this concept already exist?" The result is what every downstream audit independently rediscovered from a different angle: three competing "SaaS ROI" pages (A01§1, A02§2, A04§3), three near-duplicate real-estate calculator pairs with different math under the same name (A02§3.4), two full "ROI vs IRR" articles (A02§3.5, A04§3), four pages computing the identical basic ROI formula (A01§5.7), and — because SEO signal follows content structure — real, measurable search cannibalization on the site's highest-value query cluster (A04§2). Layered on top of that architectural failure are two genuinely separate, parallel defects that the generation-architecture problem does **not** explain: a keyboard-accessibility failure in the hand-written header markup (A06 P0-1) and a near-total absence of the trust/authorship signals every competitor in the category relies on (A07§9). The site's core failure is architectural and generational; its accessibility and trust gaps are independent engineering and product-strategy omissions layered on top.

---

## 2. Which problems are symptoms?

- Near-zero clicks despite real GSC impressions on "saas roi calculator" / "roi calculator saas" / "saas roi" (A04§2) — a symptom of duplicate pages competing for one query, not of weak content or weak authority.
- Four pages computing the identical `(return−cost)/cost×100` formula under different names (A01§5.7, A02§3.4) — a symptom of the factory pipeline being used for keyword coverage without a duplicate-check gate.
- The generic "What Is ROI" / "When to Use This Calculation" / "Limitations of This Metric" text appearing on the 404 page, Terms of Use, and Privacy Policy (A02§3.1) — a symptom of one script's unconditional, unscoped injection logic.
- "Content page with a calculator embedded" feel on the 12 `/roi-calculator/*/*` pages (A03§2, A03§5) — a symptom of the same script placing its boilerplate stack before, not after, the calculator markup it found on each page.
- Cognitive overload from six overlapping "more links" modules per page (A01§2, A01§5.6) — a symptom of the same link-recommendation feature being independently reimplemented rather than consolidated across the two content eras.
- SaaS/real-estate/solar/marketing dual-hub confusion (A01§1, A02§4) — a symptom of the unreconciled dual-tree problem, vertical by vertical.
- Homepage title trying to own four intents (calculator/formula/examples/benchmarks) at once (A04§4) — a symptom of the homepage absorbing scope that the (also-existing) dedicated `learn/*` pages should own exclusively.

## 3. Which problems are root causes?

1. **Two unreconciled content-generation eras, both left live, neither told to defer to the other** (A02§4, A05§1) — the structural cause of nearly every duplicate-page and cannibalization finding in Audits 01, 02, and 04.
2. **`scripts/aeo_phase11.py`'s unconditional, page-type-blind boilerplate injection**, with an idempotency check ("does the marker exist") that will silently *reintroduce* the boilerplate on any page where it is manually removed, the next time the script runs for any reason (A05§5.1) — the cause of nearly every finding in Audit 02's duplication count and Audit 03's "boilerplate before the calculator" finding.
3. **No validation anywhere in the toolchain checks for duplicate content, duplicate titles, or duplicate URL-intent across the whole site** — `calculator-quality.mjs` only compares entries within `data/calculators.json`; `audit-canonical.mjs` only checks canonical-URL hygiene, not content uniqueness (A05§6-Problem-6). This is why the SaaS trio, the real-estate near-duplicate pairs, and the two ROI-vs-IRR articles were all able to ship and stay live.
4. **No single source of truth for site chrome** — header/nav markup is independently duplicated in four places (`partials/header.html`, two Node scripts' string constants, and every page's baked HTML), acknowledged in the codebase's own comments as a manual-sync burden (A05§2, A05§6-Problem-1).
5. **A keyboard-accessibility defect in the shared header markup itself** (the "Calculators" dropdown trigger is a bare `<span>` with no `tabindex`/`role`/`aria-expanded`, and its menu is unreachable by keyboard by construction) — independent of root causes 1-4; this is a component-engineering gap, not a generation-architecture symptom (A06 P0-1).
6. **No product decision was ever made to establish authorship, review, or citation signals** — the site's only trust disclosure is a corporate-entity name on a deindexed page (A01§7, A07§9). This is a content-strategy omission from the start, not a bug introduced by any script.

---

## 4. Which problems are caused by the generation architecture?

- The 30-52-page boilerplate duplication and its silent-reintroduction risk (A05§5.1, root cause 2 above).
- The header/footer/nav four-way duplication and the risk that any future run of `patch-phase176.mjs` blindly overwrites a manually-customized header (A05§5.2).
- `patch-site-chrome.mjs`'s auto-chained re-addition of the "Popular Tools" footer block and breadcrumbs to any page missing them, including pages where that block was *deliberately* removed (A05§5.3).
- The unscoped, repo-wide reach of five independent mutator scripts with no documented run order or obsolescence marker, meaning a future contributor (human or AI) cannot tell which scripts are safe to run without re-deriving this entire audit (A05§1, A05§5.5).
- The absence of any cross-page duplicate-content check, which is *why* the factory pipeline's genuinely good per-file validation (`calculator-quality.mjs`) never caught that its own output duplicated the older tree (A05§2, A05§6-Problem-3/6).

## 5. Which problems are caused by content strategy?

- The decision to build three separate "SaaS ROI" surfaces, two real-estate hub trees, two solar hub trees, and two marketing hub trees rather than one hub per vertical (A01§1, A02§2).
- The decision to answer "What is ROI? / How do you calculate ROI? / What is a good ROI?" four different ways on the homepage instead of once (A01§5.4, A02§3.6).
- The homepage's decision to fully restate the ROI formula, the annualized-ROI formula, and the how-to-calculate steps in full, in competition with the dedicated `learn/*` pages that already own that content (A02§2, A04§3).
- Building `calculators/roi-vs-other-metrics.html` and `learn/roi-vs-irr.html` as content pieces that substantially restate `comparisons/*` content rather than pointing to it (A02§3.5).
- Never establishing any authorship, review, or citation strategy — a strategic omission, not an accident (A07§9).
- Generic-boilerplate content being treated as an acceptable substitute for calculator-specific explanation, most visibly on `methodology/index.html`, the one page where a finance-adjacent tool most needs to look authored and precise (A01§7, A02§5).

## 6. Which problems are caused by UX/UI?

- The keyboard-unreachable "Calculators" dropdown, present on every page (A06 P0-1).
- No mobile navigation breakpoint anywhere in the stylesheet (A01§8, A06 P1-1).
- Six visually-identical box styles used for six semantically different content types, collapsing the visual hierarchy a reader needs to parse content roles (A01§3, A01 P1-2).
- Equal-weight, no-primary-metric result grids (5 cards on the SaaS calculator, 6 on the solar calculator) where every competitor sampled uses one dominant number plus supporting detail (A03§3, A07§4).
- Missing interpretation/"what should I do next" sentences on most calculators outside the homepage and the three inline marketing calculators (A03§3, A03§5).
- The disorienting sticky bottom bar that prompts "Try ROI Calculator" only after the user has already scrolled past it (A01§2.3, A01 P2-2).
- Contrast failures on the primary "Calculate" button and the footer copyright line, computed directly from the theme's own tokens (A06 P0-2, P0-3).
- A focus indicator that exists only on form inputs, nowhere else (A06 P2-1).

## 7. Which problems are caused by SEO strategy?

- The three-page SaaS cannibalization directly mapped onto the largest cluster of impressions-with-zero-clicks in the supplied GSC data (A04§2-3).
- The homepage's multi-intent title diluting its claim on "roi formula" and "how to calculate roi" — the #1 and #2 queries by impression volume supplied (A04§4).
- Building `learn/roi-vs-irr.html` as a second, independently-canonicalized article rather than a redirect or a section of `comparisons/roi-vs-irr.html` (A04§3).
- Complete intent-match gaps for "roi equation," "top roi calculators for saas sales," and "saas marketing roi" — queries with real impressions and no page built to answer them at all (A04§2).
- Sitemap submission of every duplicate URL (all three SaaS pages, both real-estate hub trees, both ROI-vs-IRR articles), which actively tells Google each one is a distinct, important page rather than allowing consolidation signals to concentrate (A04§3, confirmed via `sitemap.xml`).

## 8. Which problems are caused by excessive page/template reuse?

This is distinct from content strategy: it is the specific failure of reusing one template or one component across contexts it does not fit.

- The `/roi-calculator/*/*` legacy template's fixed three-section preamble ("When to Use This Calculation" / "Limitations of This Metric" / "What Is ROI?") reused identically across benchmark, SaaS, real-estate, and site-navigation pages regardless of topic (A01§5, A02§3.2-3.3, A03§5).
- The factory calculator template reused to spin up three additional basic-ROI-formula pages (`simple-`, `free-`, `roi-calculator-example`) with no functional differentiation from the homepage or each other (A01§5.7, A02§5).
- The "Popular Tools" footer / "Trending ROI Tools" / `explore-industry` link-list pattern reused six different ways on the same page, including a page linking to itself in its own footer (A01§5.6, A05§3).
- The single `.ai-answer-block`/`.definition-block`/`.ai-citation`/`.example-block`/`.key-takeaways` visual treatment reused across six semantically distinct content roles with no differentiation (A01§3, A05§3).
- The `entity-definition` "What Is ROI?" block reused on pages (404, Terms, Privacy, site-structure) that have no topical relationship to ROI calculation at all (A02§3.1, A05§2).

---

## 9. Which current pages are valuable?

- **`index.html`** — the correct, best-executed calculator on the site (live recalc, chart, interpretation sentence, reverse-mode) once its content duplication is trimmed (A03§7, A02§6).
- **`comparisons/*`** (7 pages) — the cleanest, least-duplicated tree on the site; genuinely distinct comparisons with no material overlap among themselves (A02§6G, A04§6).
- **`benchmarks/*`** (6 pages) — equally clean; no cannibalization found anywhere in this tree (A02§6G, A04§6).
- **`glossary/*`** (10 pages) — genuinely distinct atomic definitions (A02§6G).
- **The 4 `real-estate/*.html` calculators** — correct amortization math, appropriately scoped inputs (A02§6G, A03§4.6, A03§7).
- **`saas/roi-calculator.html`, `solar/roi-calculator.html`, `hvac/roi-calculator.html`** — correct math, focused layout; solar is the most sophisticated calculator on the site (A03§7).
- **The three inline marketing calculators** (ROAS, email marketing, lead generation) — the best "what should I do next" interpretation layer on the entire site (A03§3, A07§4).
- **`learn/*`** (5 guides) — each has a genuine, distinct job once the homepage stops restating them in full (A02§2, A04§6).

## 10. Which current pages should be consolidated?

- The SaaS trio: `saas/index.html` + `saas/roi-calculator.html` + `roi-calculator/saas/index.html` (+3 sub-calculators) → one hub (A01§10, A02§6, A04§6 — highest priority across three separate audits).
- The real-estate dual tree: `roi-calculator/real-estate/index.html` and its 3 near-duplicate sub-calculators → merged into `/real-estate/` (A02§3.4, the single most mechanically-provable duplication on the site).
- The solar dual tree: `roi-calculator/solar/index.html` (+3 sub-calculators) → merged into `/solar/` (A01§1, A02§6).
- The marketing dual tree: `roi-calculator/marketing/index.html` + `marketing/index.html` → one hub; `roi-calculator/marketing/email-marketing-roi.html` → merged into/redirected to `calculators/email-marketing-roi-calculator.html` (A02§3.4, A02§6).
- `learn/roi-vs-irr.html` → merged into `comparisons/roi-vs-irr.html` (A02§3.5, A04§3, A04§6).
- `calculators/roi-vs-other-metrics.html` → folded into `comparisons/index.html` as a link (A02§6).
- Three of the four basic-ROI calculators (`simple-`, `free-`, `roi-calculator-example`) → one canonical page (A01§5.7, A02§6, A03§7).

## 11. Which current pages should be retained?

Structurally as-is (content trimming per §12 aside): `index.html`; all of `comparisons/*`; all of `benchmarks/*`; all of `glossary/*`; the 4 `real-estate/*.html` calculators; `saas/roi-calculator.html`, `solar/roi-calculator.html`, `hvac/roi-calculator.html`; the 3 inline marketing calculators; `learn/*` (5 pages); the factory calculators that are *not* near-duplicates of anything else — `equipment-`, `working-capital-`, `warehouse-automation-`, `employee-training-`, `logistics-efficiency-`, `ai-tool-`, `influencer-`, `content-marketing-roi-calculator.html` (8 of the 14 factory pages); `about.html`, `contact.html`, `privacy.html`, `terms.html`, `404.html` (once stripped of unrelated boilerplate, per A02§6).

## 12. Which current content should be removed?

- The generic `entity-definition` / `use-case-block` / `limitations-block` / `ai-citation` text wherever it is not page-specific — 42, 31, 30, and 51 pages respectively (A02§3.1-3.3, A02§3, confirmed as caused by A05's `aeo_phase11.py`).
- The homepage's 4x-repeated core FAQ triad — down to one schema instance and one visible instance (A01 P1-4, A02§3.6).
- The homepage's full in-article restatement of the ROI formula, annualized-ROI formula, and how-to-calculate steps — replace with a short summary and a link to the pages that already own this content (A02§6 SHORTEN).
- The "legacy" guide prose inside the four `/roi-calculator/*/*` hub pages, once their unique content (if any, e.g. the SaaS CAC/LTV framing) is merged into the consolidated hub and their sub-calculators retained as children (A01§10, A02§6 MERGE).
- Two of the four basic-ROI calculator pages, once one is chosen as canonical (A02§6 REMOVE).
- Five of the six related-link modules per page, down to one consolidated "Related" section (A01 P2-1, A02§3.7).
- Dead CSS classes (`.hero-grid`, `.dropdown-menu`/`.dropdown-group`, `.site-footer--minimal`, `.footer-links--compact`) confirmed unused anywhere in the 87 sampled pages (A01 P2-3, A06 P2-6).

## 13. Which current components should be retained?

- The dark theme design tokens and typography (`:root` variables, IBM Plex pairing) (A01§10).
- `.calculator-card` / `.calculator-module` / `.results-panel` / `.result-card` — the actual interactive product surface (A01§10, A03§7).
- `CalculatorEngine.bind()`'s declarative JSON-formula system, for genuinely simple single-formula calculators (A03§1, A05§3 — correctly scoped, not over-applied).
- The three bespoke "ecosystem" JS files (SaaS/solar/rental) as the pattern for calculators complex enough to need real code rather than a formula string — identified as the best template on the site (A03§7).
- `components/ai/CalculationAnswerBlock.js` — a well-built, generic, schema.org-aware interpretation-sentence component, currently used on exactly one page despite being generic enough for all of them (A05§1 — an under-reuse finding, meaning this component should be *kept and used more*, not changed).
- `generate-calculators.mjs` + `calculator-quality.mjs` — the one generation pipeline in the repository with genuine safety properties (fenced output regions, hard-failing validation) (A05§5.6).
- `site-chrome.mjs`'s centralized-constant pattern for the footer's "Popular Tools" block — the right instinct, currently applied to only one piece of chrome (A05§4).
- The privacy/no-tracking badge and claim — the single trust asset that outperforms every competitor sampled (A01§10, A07§9).
- The breadcrumb pattern and JSON-LD schema discipline (A01§10).

## 14. Which components should be redesigned?

- The header navigation — needs real keyboard accessibility (a focusable, `aria-expanded`-carrying trigger) and a mobile breakpoint; currently the single most severe defect in the audit series (A06 P0-1, A01 P0-3).
- The six-box "highlighted panel" visual system — needs 2-3 differentiated treatments so definition/example/citation/takeaway read as distinct content roles (A01 P1-2).
- The results-panel layout — needs a one-dominant-number-plus-supporting-detail hierarchy, replacing the current equal-weight grid pattern, informed directly by the competitive benchmark (A03§3, A07§4).
- The related-links system — needs consolidation from six modules to one (A01 P2-1, A05§4).
- The "Download PDF" feature — needs either a relabel to reflect its actual print-dialog behavior or a genuine export implementation (A03§6, A06 P0-4 context).
- Focus-indicator styling — needs a visible treatment on links and buttons, not just form inputs (A06 P2-1).
- The button/footer color tokens — need contrast correction on `.btn-primary` text and `.footer-copy` (A06 P0-2, P0-3).
- The site-chrome generation mechanism itself — needs one source of truth instead of four independently-maintained copies (A05§6 target architecture #1).

## 15. Which content blocks should cease being globally injected?

- The generic `use-case-block` bullets ("Evaluating investment profitability / Comparing multiple opportunities / Estimating return over time") — stop unconditional injection; write page-specific bullets or omit (A02§3.2, A05§2).
- The generic `limitations-block` bullets ("Does not account for time value of money / Depends on assumptions / May not reflect risk") — same treatment (A02§3.3, A05§2).
- The generic `entity-definition` "What Is ROI?" paragraph — stop injecting onto any page that is not itself about calculating or explaining ROI (legal pages, site-structure, methodology's opening) (A02§3.1, A05§2 — the clearest single item on this list, given it currently sits on the 404 page and Terms of Use).
- The generic `ai-citation` sentence template ("This page provides a structured explanation of [topic]...") — stop the fixed-template injection; the topic-specific value it could carry is currently undermined by the fixed surrounding sentence (A02§3, A05§2).
- The "Popular Tools" footer block's *unconditional* re-insertion behavior specifically (not the block itself, which is fine) — `patch-site-chrome.mjs` must stop treating "not present" as "needs to be added," since that is indistinguishable from "was deliberately removed" (A05§5.3, A05§6 target architecture #3).
- The header's blind structural overwrite behavior in `patch-phase176.mjs` — must stop replacing any page's header wholesale without checking whether the existing header was intentionally customized (A05§5.2).

---

## SaaS vs. Site-Wide Decision

**Choice: C — redesign the shared architecture and use SaaS ROI Calculator as the first reference implementation.**

**Why not A (SaaS only):** The root causes are sitewide infrastructure, not SaaS-specific content problems. `aeo_phase11.py` remains armed to silently reintroduce boilerplate on any page, including a freshly-cleaned SaaS page, the moment it is run again for any unrelated reason (A05§5.1). There is still no duplicate-content validation anywhere in the toolchain (A05§6-Problem-6), so nothing would stop the real-estate, solar, or marketing verticals from reproducing the exact SaaS problem independently. Fixing SaaS content alone, without touching the architecture that produced the mess, is fixing a symptom while leaving the mechanism that generated it fully operational.

**Why not B (redesign the entire site immediately):** The evidence does not support treating the whole site as broken. The component/CSS foundation is coherent (A01§0), the calculation math is correct in the large majority of cases (A03§4.6), and three entire content trees — comparisons, benchmarks, glossary — have no material defects found across four separate audits (A02§6G, A04§6). A full immediate redesign would discard validated, working parts of the product for no evidenced gain, and — more importantly — would repeat the exact planning failure that created the current state: building broadly across many verticals in parallel without first validating one pattern (which is precisely how the unreconciled dual-tree problem occurred in the first place, A02§4).

**Why C is correct:** Three independent audits, approaching from three different angles, converged on the same answer without being asked to agree with each other. Audit 01 (UX/IA) recommended SaaS as the first implementation target because it is simultaneously the worst-fragmented vertical and the one with the cleanest existing layout to build from (A01§10 Q6-7). Audit 03 (calculator product/logic) independently identified `saas/roi-calculator.html` as the best redesign-prototype candidate because it has correct-enough math (one fixable formula issue) and the cleanest calculator-first structure sampled (A03§7). Audit 04 (SEO) independently identified the SaaS trio as the single highest-priority consolidation given it maps directly onto the largest cluster of impressions-with-zero-clicks in the supplied search data (A04§6). Audit 05 (architecture) establishes *why* fixing shared infrastructure first is necessary before any page-level fix can be trusted to hold (A05§6 target architecture). Strategy C is the only one of the four options that (1) fixes the actual root cause — shared architecture, not one page's content — (2) validates every fix (chrome source of truth, boilerplate retirement, duplicate-content check, result-hierarchy redesign, trust-signal pattern, keyboard/contrast correction) on a single, real, currently-broken vertical before it is trusted anywhere else, and (3) produces a mechanically repeatable pattern for real estate, solar, and marketing rather than four separate one-off efforts.

---

## Target Product

**What roicalculator.live should become:** a small number of genuinely distinct, correctly-calculating, calculator-first tools, each with exactly one URL, sitting inside a shared architecture that makes it structurally impossible to accidentally build a second page for a concept that already has an owner — with a visible, honest trust layer (privacy stance plus real methodology disclosure) taking the place of the editorial-authority signals the site does not have and does not need to fake.

**Ideal relationships between the eight content categories:**

- **Homepage = the Core ROI Calculator.** These are not two things to relate — they are already the same page (`index.html`) and should stay that way. Its only job is the generic calculator, a short frame, one interpretation sentence, and outbound links to everything else. It should never again fully restate content that a Guide, a Benchmark, or a Comparison page already owns — it summarizes and links, in both directions: users arriving with informational intent should be able to reach the right Guide from the homepage in one click, and users arriving on a Guide should be able to reach the homepage's calculator in one click.
- **Industry Calculators are peers of the Core Calculator, not subordinates of a Guide.** Each vertical (SaaS, real estate, solar, marketing, HVAC, HR, and any future one) resolves to exactly one hub URL that has a working calculator on it immediately, with any sub-calculators (CAC/LTV, flip ROI, EV charger, etc.) as clearly-labeled children of that one hub — never a second, parallel hub tree. Each Industry Calculator links back to the Core Calculator only as a "see the general version" cross-reference, and out to the specific Guides/Benchmarks/Comparisons relevant to that vertical — it does not restate them.
- **Guides own concepts; nothing else restates them.** `learn/roi-formula.html` is the only page that fully explains the ROI formula; `learn/how-to-calculate-roi.html` is the only page that fully walks through the calculation steps. The Core Calculator, Industry Calculators, and Comparisons all link to a Guide instead of re-deriving its content. This is the single organizing principle that would have prevented most of Audit 02's findings.
- **Benchmarks are cited, not duplicated.** The Core Calculator and Industry Calculators reference a benchmark figure with a link to the relevant Benchmark page rather than embedding their own copy of the comparison table.
- **Comparisons own "X vs Y" decisions exclusively**, including the ROI-vs-IRR content currently split across two pages — this becomes the only place that question is answered, linked to from Guides and Industry Calculators wherever the comparison is relevant to that context, never re-argued locally.
- **Glossary owns atomic terms.** Any page that uses CAC, LTV, cap rate, churn, or any other defined term links to its Glossary entry on first use rather than re-explaining it inline.
- **Methodology is the site's trust anchor, not a boilerplate dumping ground.** Given Audit 07's finding that trust signals are the site's single largest competitive gap, Methodology should carry the most specific, most carefully-written content on the site — real calculation assumptions, real data sourcing for any benchmark figures, and whatever the site's honest equivalent of "reviewed by" can be (even if that is a transparent statement of how the calculators were built and verified, rather than a fabricated named-expert byline it cannot honestly claim) — not the generic "What Is ROI" paragraph currently found there.

**The organizing rule underneath all eight relationships:** every piece of content has exactly one canonical home. Every other page that touches the same concept links to that home instead of restating it. This single rule, mechanically enforced rather than hoped for, is what the current architecture lacks and what caused nearly every finding in this diagnostic.

---

## Final

```
ROOT CAUSES
├── Two unreconciled content-generation eras, never merged, both left live (A02§4, A05§1)
├── aeo_phase11.py's unconditional, page-type-blind boilerplate injection with
│   shallow "marker exists" idempotency (A05§5.1)
├── No cross-page duplicate-content/duplicate-intent validation anywhere in the
│   toolchain (A05§6-Problem-6)
├── No single source of truth for site chrome — four independently-maintained
│   copies of the header/nav/footer (A05§2, A05§6-Problem-1)
├── Keyboard-inaccessible header dropdown — an independent component-engineering
│   defect, not downstream of the generation problem (A06 P0-1)
└── No authorship/review/citation trust-signal strategy was ever established
    (A01§7, A07§9)
        ↓
SECONDARY PROBLEMS
├── 3 competing SaaS pages, 3 near-duplicate real-estate calculator pairs,
│   2 ROI-vs-IRR articles, 4 identical basic-ROI calculators (A01, A02)
├── Generic boilerplate on 30-52 pages including the 404 page, Privacy Policy,
│   and Terms of Use (A02§3.1-3.3)
├── SEO cannibalization: near-zero clicks on the site's highest-impression
│   query cluster despite real search visibility (A04§2-3)
├── "Content page with a calculator embedded" feel on 12 legacy pages — three
│   generic sections before any input field (A03§2, A03§5)
├── No visual result-hierarchy — 5-6 equal-weight metric cards with no dominant
│   number, unlike every competitor sampled (A03§3, A07§4)
├── Missing interpretation/"what to do next" layer on most calculators (A03§3)
├── Contrast failures on the primary CTA button and footer text; no mobile nav
│   breakpoint anywhere (A06 P0-2, P0-3, P1-1)
└── Weakest trust-signal profile of any product compared, competitive or not
    (A07§9)
        ↓
TARGET PRODUCT PRINCIPLES
├── One canonical URL per concept; every other page links to it, never restates it
├── Homepage and Core ROI Calculator are one page with one narrow promise
├── Every Industry Calculator hub has its calculator on the page immediately,
│   with sub-calculators as labeled children, never a parallel hub tree
├── Guides, Benchmarks, Comparisons, and Glossary each own their content
│   exclusively; nothing else in the site restates them
├── Methodology carries the site's real, specific trust content — not generic
│   boilerplate — since trust signals are the largest competitive gap found
├── Shared chrome (header/nav/footer) has exactly one source of truth
├── No generator may inject content into a page without a way to distinguish
│   "never added" from "deliberately removed"
└── One result hierarchy standard (one dominant number + supporting detail +
    one interpretation sentence) applied to every calculator, not just some
        ↓
RECOMMENDED REMEDIATION ORDER
1. Fix the shared architecture first, on paper and in the toolchain, before
   touching page content: establish one chrome source of truth; retire or
   re-scope aeo_phase11.py so it cannot re-inject removed content or reach
   templates/; add a duplicate-content/duplicate-title check to the validation
   surface (A05§6).
2. Fix the header/nav component itself (keyboard accessibility, mobile
   breakpoint, contrast tokens) as shared infrastructure, once — this is a
   component fix, not a per-page one, and every subsequent page benefits
   immediately (A06 P0-1, P0-2, P0-3, P1-1).
3. Apply the fixed architecture and component set to the SaaS vertical as the
   reference implementation: consolidate the 3 SaaS pages into one hub with
   the calculator on-page, fix the payback-formula issue, redesign its results
   panel to the one-dominant-number standard, add an interpretation sentence,
   strip its boilerplate to page-specific content, and validate the whole
   pattern here (A01§10, A03§7, A04§6).
4. Mechanically repeat the validated SaaS pattern for real estate, solar, and
   marketing — each already has less severe versions of the same defects, so
   this step is replication, not new discovery (A02§6, A04§6).
5. Consolidate the remaining site-wide duplicates that don't block on a
   vertical redesign: the ROI-vs-IRR pair, the basic-ROI calculator trio, the
   homepage's restated formula/how-to content, the six-module related-links
   system (A02§6, A01 P2-1).
6. Address the trust-signal gap deliberately: rewrite Methodology as real,
   specific content; decide what the site's honest equivalent of an
   authorship/review signal can be, given it cannot fabricate named experts
   it doesn't have (A07§9).
7. Clean up remaining polish-tier items — dead CSS, unused assets, obsolete
   migration scripts, SRI hashes, chart caption specificity — once the
   structural and trust work above is complete (A01 P2-3/P3, A06 P2/P3).
```

---

*End of Master Diagnostic. No files were modified in the preparation of this report.*
