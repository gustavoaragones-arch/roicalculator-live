# AUDIT 05 — Template / Component / Generation Architecture
**roicalculator.live — Project Director Audit**
Read-only. No code modified. Every claim below is traced to a specific script, template, or generated-file pattern in the repository.

**Headline finding:** this audit found the literal, named source of Audit 02's central discovery. `scripts/aeo_phase11.py` is a Python script whose `DEFAULT_USE`/`DEFAULT_LIM` constants and a `SPECIAL` dictionary hard-code the exact "Evaluating investment profitability..." / "Does not account for time value of money..." / "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost" text found duplicated across 30–52 pages in Audit 02. The script also has a fallback (`default_tuple_for`) that injects the **same generic ROI-definition text onto any page not explicitly listed**, and its only idempotency guard is "does this page already contain `ai-answer-block`" — not "was this content deliberately removed." This means the single largest content-duplication problem identified in this audit series is not an accumulation of independent editorial decisions; it is the output of one script, still present and executable in the repository today, that will reproduce the exact same duplication on any page where the boilerplate is manually removed, the moment it is run again. This is the most important fact in this report and shapes every recommendation in §6.

---

## 1. Template Map

### Templates (parameterized HTML shells)
- `templates/calculator-template.html` — placeholder-based (`__TITLE__`, `__INPUTS_HTML__`, etc.), used by `generate-calculators.mjs` for interactive factory calculators.
- `templates/article-template.html` — same placeholder system, no `__INPUTS_HTML__`/`__OUTPUTS_HTML__`, used for `isArticlePage: true` entries in `data/calculators.json` (non-interactive factory pages).

### Partials (reference copies, NOT server-side includes — this is a fully static site with no include mechanism at request time)
- `partials/header.html`, `partials/footer.html` — canonical-looking reference copies of the site chrome. **Critically, these are not included by any build step for the 70+ hand-authored pages** — they appear to exist as a documentation/reference copy that the various patch scripts (below) attempt to keep in sync with by re-implementing the same markup as string literals in JS/Python.

### Generators (produce or mutate HTML from data or rules)
| Script | Role | Scope of write access |
|---|---|---|
| `generate-calculators.mjs` | Reads `data/calculators.json` → writes 14 `/calculators/*.html` pages, 3 category hub pages (`marketing/`, `finance/`, `operations/`), patches `sitemap.xml` and `sitemap.html`, calls `sync-redirects.mjs` and `patch-site-chrome.mjs` in sequence | `calculators/`, `marketing/`, `finance/`, `operations/`, `sitemap.xml`, `sitemap.html`, `public/_redirects`, `_redirects`, then whole repo (via chained call) |
| `patch-site-chrome.mjs` | Walks **entire repo** (except `templates/`, `partials/`), inserts `POPULAR_TOOLS_FOOTER_HTML` and a `BreadcrumbList` JSON-LD block into any page that doesn't already have them | Every `.html` file in the repo |
| `patch-phase176.mjs` | Walks **entire repo**, regex-replaces any `<header class="site-header">...</header>` block with a hardcoded `STANDARD_HEADER` string, and does an exact-string swap of one specific old footer for the current one | Every `.html` file in the repo |
| `inject-navigation.mjs` | Walks **entire repo**, appends `<script src="/assets/js/navigation.js">` before `</body>` on any file missing it | Every `.html` file in the repo |
| `aeo_phase11.py` | Walks **entire repo** (except `partials/` — note: `templates/` is *not* excluded), injects an Organization JSON-LD block into every `<head>`, and injects the full "Quick Answer + citation + use-case + limitations + entity-definition" boilerplate stack into every page lacking an `.ai-answer-block` | Every `.html` file in the repo, **templates/ included** |
| `patch_albor_footer.py`, `patch_footer_simplify.py` | Two earlier, now-superseded footer-migration scripts, each doing exact-string find/replace of a specific historical footer markup | Every `.html` file in the repo (exact-match, so effectively inert today — see §5) |
| `calculator-quality.mjs` | Validates `data/calculators.json` only (duplicate slugs/titles/formulas/inputs/FAQ questions, requires 2 differentiated `staticBlocks`) — does not touch HTML | N/A (validator, not a generator) |
| `audit-canonical.mjs` | Validates every page's `<link rel="canonical">` / `og:url` use the correct origin (no `www`, no `http`) — does not touch HTML | N/A (validator) |
| `sync-redirects.mjs` | Writes a static, hardcoded 4-line `_redirects` file (www/apex/methodology redirects only) to `public/` and repo root | `public/_redirects`, `_redirects` |
| `site-config.mjs` | Pure constants module (`CANONICAL_ORIGIN`, `METHODOLOGY_PATH`, `REDIRECTS_CONTENT`) — imported by several of the above | N/A (config) |
| `site-chrome.mjs` | Exports shared HTML string constants (`TRENDING_TOOLS_SECTION_HTML`, `POPULAR_TOOLS_FOOTER_HTML`) and breadcrumb JSON-LD builder functions — imported by `generate-calculators.mjs` and `patch-site-chrome.mjs` | N/A (library module) |

### Shared components
- `components/ai/CalculationAnswerBlock.js` — a genuinely well-built, reusable, generic "render a Question/Answer AEO block with schema.org microdata" component. **Used by exactly one page (`index.html`, via `calculator.js`'s `renderAeoAnswer`)** despite being written generically enough to serve any calculator's results panel — the inverse problem of §3 (a good component that is *under*-reused, not over-reused).
- `assets/js/calculator-engine.js` — the declarative `CalculatorEngine.bind()` system (JSON formula strings → live results). Used by the homepage, the 14 factory calculators, and the real-estate cap-rate calculator.
- Three bespoke, single-use "ecosystem" scripts (`saas-ecosystem-calculator.js`, `solar-ecosystem-calculator.js`, `rental-ecosystem-calculator.js`) — not shared with anything, each hand-written for one page.
- 12 independent inline `<script>` blocks in `/roi-calculator/*/*` pages — not generated, not shared, each a one-off (Audit 03 §1).

### Dependency graph (generation-time)
```
data/calculators.json ──▶ calculator-quality.mjs (validate)
                     └──▶ generate-calculators.mjs ──▶ templates/calculator-template.html
                                                  ├──▶ templates/article-template.html
                                                  ├──▶ site-chrome.mjs (footer/breadcrumb HTML)
                                                  ├──▶ site-config.mjs (canonical origin)
                                                  ├──▶ sync-redirects.mjs (chained call)
                                                  └──▶ patch-site-chrome.mjs (chained call, repo-wide)

aeo_phase11.py ──▶ (independent, repo-wide, not chained to anything else, includes templates/)
patch-phase176.mjs ──▶ (independent, repo-wide, exact-string + regex based)
inject-navigation.mjs ──▶ (independent, repo-wide)
patch_albor_footer.py / patch_footer_simplify.py ──▶ (independent, repo-wide, now-obsolete exact-string targets)
audit-canonical.mjs ──▶ (independent, read-only check)
```
**Structural observation:** only `generate-calculators.mjs` has any explicit call chain to another script (`sync-redirects.mjs`, then `patch-site-chrome.mjs`). Every other repo-wide mutator (`aeo_phase11.py`, `patch-phase176.mjs`, `inject-navigation.mjs`, the two footer-migration scripts) is a standalone entry point with no documented run order, no `package.json` script registry, and no record in the repository of which have already been run against the current file state versus which are stale/historical. There is no manifest anywhere indicating "these five scripts are obsolete, run only these two going forward."

---

## 2. Content Generation — Origin of Each Repeated Section

| Repeated section (from Audit 02) | Source file | Mechanism | Data source | Pages affected |
|---|---|---|---|---|
| "Evaluating investment profitability / Comparing multiple opportunities / Estimating return over time" | `scripts/aeo_phase11.py`, lines 20-24 (`DEFAULT_USE` constant) | `build_rest()` renders this list into a `.use-case-block` whenever a page's `SPECIAL` entry passes `None` for `use_cases` (the overwhelming majority of entries do) | Hardcoded Python list literal, not a per-page-authored value | 31 pages (Audit 02 §3.2) |
| "Does not account for time value of money / Depends on assumptions / May not reflect risk" | Same file, lines 25-29 (`DEFAULT_LIM` constant) | Same mechanism, `.limitations-block` | Hardcoded Python list literal | 30 pages (Audit 02 §3.3) |
| "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost." | Same file — appears as the fourth tuple element in **every single entry** of the `SPECIAL` dict (≈50 entries, lines 86–522) and again in `default_tuple_for()` (line 539, the fallback for pages not in the dict) | `build_rest()` renders this into an `.entity-definition` block | Hardcoded string, copy-pasted (not generated) into every tuple in the source file itself | 42 pages (Audit 02 §3.1), including `404.html`, `privacy.html`, `terms.html`, `sitemap.html` — this is why the definition appears on pages that have nothing to do with calculating ROI: **the script's author hardcoded the same sentence into the `404.html` and `privacy.html` entries of the `SPECIAL` dict individually** (lines 94-133), it was not an accident of a generic fallback applying too broadly — the site-specific entries for these exact pages were deliberately given ROI-definition text. |
| "This page provides a structured explanation of [topic], including formulas, examples, limitations, and comparisons with related financial metrics." | Same file, `build_rest()`'s `cite` variable (lines 45-49) | Templated string with only the `citation_topic` slot varying per page | `citation_topic` is the second tuple element, authored per-page in `SPECIAL`, but the surrounding sentence template is fixed | 51 pages (Audit 02 §3, `ai-citation` block) |
| Header/nav markup (10 links + dropdown) | Exists as string literals in **four separate places**: `partials/header.html`, `generate-calculators.mjs`'s `HTML_SITE_HEADER` (lines 34-61), `patch-phase176.mjs`'s `STANDARD_HEADER` (lines 12-38), and baked into the static markup of all 87 already-generated HTML files | No single source of truth; each generator that touches the header re-implements it from a private copy | Hand-maintained in parallel across 4 locations | All 87 pages carry a baked copy; 3 scripts carry independent source copies that must be manually kept in sync (the code comment on `HTML_SITE_HEADER` literally says "keep in sync with partials/ and patch-phase176") |
| Footer "Popular Tools" block | `scripts/site-chrome.mjs`'s `POPULAR_TOOLS_FOOTER_HTML` constant | Consumed by both `generate-calculators.mjs` (for new pages) and `patch-site-chrome.mjs` (inserted into any existing page lacking it) | Hardcoded string constant, single source (better than the header case above) | Present in the footer of effectively every page site-wide |
| `data/calculators.json` formula/title/input near-duplicates (Audit 01/02's "4 identical basic calculators," etc.) | `data/calculators.json` itself (hand-authored JSON, not generated) | `generate-calculators.mjs` faithfully renders whatever is in the JSON; `calculator-quality.mjs` *does* warn on exact formula/input-name duplicates (see §4) | Manually authored config entries | The factory tier's duplication is a **data-authoring** problem, not a **generator** problem — the tooling to catch it already exists (see §4) and appears to have been bypassed or its warnings ignored for `simple-roi-calculator` / `free-roi-calculator` / `roi-calculator-example`. |

**Conclusion for §2:** the single script `aeo_phase11.py` is the origin of the large majority of Audit 02's quantified duplication (the three heaviest-hitting patterns: 42, 31, and 30/51 pages respectively). This is a one-script root cause, not a diffuse editorial pattern.

---

## 3. Component Over-Reuse

Components that are *technically* reusable — they work correctly wherever they're placed — but are **UX-inappropriate when repeated across the specific page-type boundaries** they've been placed across:

| Component | Technically valid on | UX-inappropriate on | Why |
|---|---|---|---|
| `.entity-definition` ("What Is ROI?") | Any ROI-calculation page | `404.html`, `privacy.html`, `terms.html`, `sitemap.html`, `site-structure.html`, `methodology/index.html` | These pages are not about calculating ROI; the block reads as filler injected by automation rather than editorial judgment (Audit 02 §3.1, §5) |
| `.use-case-block` / `.limitations-block` (generic 3-bullet versions) | A calculator page with genuine, calculator-specific limitations | Benchmark hubs, comparison hubs, glossary index, SaaS CAC/LTV guide — anywhere the generic bullets don't reflect the page's actual content | Reused past the point of relevance — Audit 02 §3.2-3.3 |
| `.footer-popular` ("Popular Tools": Simple/Free/Example ROI Calculator + 3 verticals) | Any page, as a footer convenience | Every page, unconditionally, including pages that are themselves one of the 6 linked "Popular Tools" (a page links to itself in its own footer) | Correct component, wrong application rule — it should exclude self-links and probably shouldn't be identical on 87 pages with no variation by page context |
| `.ai-answer-block` / `.definition-block` / `.ai-citation` / `.example-block` / `.key-takeaways` (visual styling, cross-referenced from Audit 01 §3) | Any single instance, on any page | Stacked 3-6 deep on the same page (homepage, SaaS hub pages) with no visual differentiation between them | The component itself is fine in isolation; the problem is quantity and lack of visual distinction when several appear together (Audit 01 finding, restated here as a component-reuse-frequency issue) |
| `CalculatorEngine.bind()`'s declarative JSON-formula pattern | Simple, single-formula calculators | N/A — this one is **under**-applied, not over-applied; more complex calculators (SaaS, solar, rental) correctly graduated to bespoke JS rather than forcing complex logic into `safeEval` strings, which is the right call | Listed here only to note the pattern-selection judgment was sound in this one case, unlike most of the rest of this table |

---

## 4. Template Responsibility — Architectural Coupling

Assessing how much each template/generator "knows about" concerns that arguably belong elsewhere:

| Concern | Where it lives | Coupling assessment |
|---|---|---|
| **Navigation** | Hardcoded in 4 places (§2) | **Tightly and redundantly coupled.** No template treats navigation as an injectable dependency; it's copy-pasted markup everywhere it appears, including inside two different Node scripts as JS string literals. |
| **SEO (canonical, meta, JSON-LD)** | `templates/*.html` (placeholders), `site-config.mjs` (origin constant), `site-chrome.mjs` (breadcrumb builders), `generate-calculators.mjs` (assembles WebPage/FAQ/Breadcrumb JSON-LD inline) | **Reasonably well-factored** for the factory tier — canonical URL construction is centralized in one function (`canonicalUrl`), which is good practice and is why `audit-canonical.mjs` can validate it cheaply. This discipline does not extend to the hand-authored tier, where canonicals are typed directly into each page. |
| **Related links** | `generate-calculators.mjs`'s `buildRelatedLinksHtml()` (seeded pseudo-random peer selection within the same category) + `site-chrome.mjs`'s `TRENDING_TOOLS_SECTION_HTML`/`POPULAR_TOOLS_FOOTER_HTML` (fixed lists) | **Mixed coupling** — the factory tier's related-links logic is template-owned and data-driven (reasonable); the sitewide "Popular Tools"/"Trending" lists are hardcoded content masquerading as chrome, which is why they were never revisited even as the pages they link to (Audit 01/02's near-duplicate calculators) were identified as problematic — the template has no way to know its hardcoded link list now points at content the rest of the site considers redundant. |
| **FAQs** | `generate-calculators.mjs`'s `buildFaqHtml()`/`buildFaqJsonLd()` (factory tier, data-driven from `calculators.json`) vs. `aeo_phase11.py` (hand-authored per-page tuples for the legacy tier) | **Split across two unrelated systems with no shared validation.** The factory tier has `calculator-quality.mjs` checking for duplicate/generic FAQ questions (and it explicitly flags "avoid generic What is ROI?" — see below); the legacy tier's FAQs, injected by the Python script, have no equivalent check and are exactly the tier where Audit 02 found FAQ repetition. |
| **Benchmarks** | Entirely hand-authored content in `benchmarks/*.html`; no generator or template owns this section | **Appropriately decoupled** — this is also the cleanest, least-duplicated content tier in Audits 01-02, which is consistent with it never having been run through a bulk-injection script. |
| **Educational content** (learn/, glossary/) | Hand-authored, but `aeo_phase11.py` still injects the boilerplate stack (§2) on top of hand-written content | **Inappropriately coupled** — a script meant to add machine-readable answer structure ended up also injecting undifferentiated filler into pages whose primary value is their hand-written explanation, diluting exactly the content that should be most distinctive. |
| **Calculators (interactive logic)** | Fully decoupled from every template/generator discussed above — logic lives in `assets/js/*.js` or inline `<script>` blocks (Audit 03 §1) | **Correctly decoupled** in principle (calculator logic isn't baked into the HTML-generation scripts), but this decoupling produced its own problem: with no shared calculator-authoring system for the hand-authored tier, 12 pages each reinvented `parseNum`/`formatMoney` from scratch (Audit 03 §1) — decoupling without a shared library is just fragmentation. |

**Overall assessment:** the newer factory pipeline (`data/calculators.json` → `generate-calculators.mjs` → `calculator-quality.mjs`) shows real separation of concerns and even proactive duplicate-detection. The older pipeline (`aeo_phase11.py` plus the various one-off patch scripts) has the opposite problem: one script is simultaneously responsible for AEO schema, entity definitions, use-case framing, limitations, and citation text, applied identically regardless of page type, with no validator checking its output for the cross-page duplication it mechanically guarantees.

---

## 5. Generation Safety

This is the section with the most direct forward-looking risk. For each generator, the question is: **if run again today, against the current (possibly manually-edited-per-Audit-01/02/03/04) file state, what would it do?**

### 5.1 `aeo_phase11.py` — HIGH RISK: will silently reintroduce removed content
The only gate on whether a page gets the boilerplate stack injected is:
```python
if "ai-answer-block" in html:
    return html
```
This means: **if a future editor implements Audit 02's SHORTEN recommendation and manually deletes the `.entity-definition`/`.use-case-block`/`.limitations-block`/`.ai-citation` stack (which is nested inside/alongside the `.ai-answer-block` on most pages) from, say, `methodology/index.html`, and this script is subsequently run for any reason** (e.g., a future contributor adds one new page to the `SPECIAL` dict and reruns the whole script to pick it up, since `main()` iterates `ROOT.rglob("*.html")` — the entire repository, not just new files) **— every page where the boilerplate was manually removed will have it silently reinjected**, identical to before, with no warning, diff review, or confirmation prompt. This is a direct, mechanically-demonstrated instance of the exact failure mode the audit brief asks about ("reintroduce removed content").
Additionally: **`templates/` is not in this script's skip list** (only `partials/` is excluded, line 599 `if rel.startswith("partials/"): continue`). Both `templates/calculator-template.html` and `templates/article-template.html` contain `<h1>__TITLE__</h1>`, which matches the script's insertion regex (`r"(</h1>)"`). If this script is ever run again, it would inject the boilerplate stack **directly into the templates themselves**, which would then bake the same generic content into every future factory-generated calculator page permanently — silently converting the currently-clean factory tier into a second instance of the legacy tier's duplication problem.

### 5.2 `patch-phase176.mjs` — MEDIUM-HIGH RISK: blind structural overwrite of the header
```js
var h = out.replace(/<header class="site-header">[\s\S]*?<\/header>/, STANDARD_HEADER);
```
This regex matches on structure alone (any content between the opening and closing `<header class="site-header">` tags), not on whether the existing header differs from `STANDARD_HEADER` in a way that was intentional. **Any manually-curated header change on any page — a page-specific nav highlight, a temporary banner, a fix applied directly to one page — would be silently reverted to the hardcoded default the next time this script runs.** There is no diffing, no confirmation, and the script's own output (`nH` count) would report this as a successful "update," not flag it as a potential content loss.

### 5.3 `patch-site-chrome.mjs` — MEDIUM RISK: will re-add removed footer links and breadcrumbs
```js
function insertPopularFooter(html) {
  if (html.includes('footer-popular') || !html.includes(FOOTER_MARKER)) return html;
  return html.replace(FOOTER_MARKER, POPULAR_TOOLS_FOOTER_HTML + FOOTER_MARKER);
}
```
Same pattern as §5.1: the only check is "is the block already present." If Audit 01/02's recommendation to consolidate the 6-module related-links stack results in the "Popular Tools" footer block being removed from specific pages, **re-running this script (which walks the entire repo) will silently re-add it everywhere it's missing.** This script is currently chained to the end of `generate-calculators.mjs`, meaning it runs automatically every time the factory pipeline is used for an unrelated reason (e.g., adding one new `/calculators/*` entry to the JSON) — it does not need to be invoked deliberately to cause this effect.

### 5.4 `inject-navigation.mjs` — LOW-MEDIUM RISK, unscoped
Walks the entire repo and adds a script tag to any `.html` file with a `</body>` and without an existing `navigation.js` reference. Low risk of reintroducing *removed* content (nothing here is content, just a script tag), but it is **unscoped** — it would just as readily inject into a stray HTML file added anywhere in the repo (e.g., a snapshot, a test fixture, an exported report) with no allowlist restricting it to actual site pages.

### 5.5 `patch_albor_footer.py` / `patch_footer_simplify.py` — LOW RISK today, HIGH confusion risk
Both scripts match on **exact historical footer strings** (`OLD_LONG`, `OLD_PARTIAL`, `OLD_404`, etc.) that no longer exist anywhere in the current codebase (the site has moved through at least two more footer generations since, per `patch-phase176.mjs`'s `OLD_FOOTER`/`NEW_FOOTER`). Running either script today would find zero matches and no-op safely. The risk is not technical — it's process risk: **these scripts remain in `scripts/` with no marker indicating they are obsolete**, no README, no deprecation comment beyond their own docstring describing what they once did. A future contributor (human or AI) triaging "which script updates the footer" has no way to know these two are dead ends without reading and manually tracing each one, as this audit just did.

### 5.6 `generate-calculators.mjs` — LOWEST RISK, best-behaved generator
This is the one generator in the repository with genuine safety properties: it fully regenerates its own output files from a single data source (`data/calculators.json`) rather than pattern-matching against existing HTML, it calls a validator (`calculator-quality.mjs`) that hard-fails the build on structural errors, and its sitemap patching uses explicit `<!-- GENERATED:...:BEGIN/END -->` markers to scope its writes to a fenced region rather than the whole file. **This is the correct pattern; none of the other generators in the repository follow it.**

### Summary table

| Generator | Re-run today would... | Severity |
|---|---|---|
| `aeo_phase11.py` | Reintroduce any manually-removed boilerplate stack; risk of injecting into `templates/` itself | **High** |
| `patch-phase176.mjs` | Silently overwrite any manually-customized header | **Medium-High** |
| `patch-site-chrome.mjs` | Reintroduce any manually-removed footer link block or breadcrumb | **Medium** (auto-chained from the factory pipeline) |
| `inject-navigation.mjs` | Unscoped script-tag injection into any stray `.html` file | **Low-Medium** |
| `patch_albor_footer.py` / `patch_footer_simplify.py` | No-op (targets no longer exist) | **Low** (but zero documentation of obsolescence) |
| `generate-calculators.mjs` | Regenerate its own fenced output correctly; safe by construction | **Low — this is the model to follow** |

---

## 6. Final — Recommended Future Architecture

**Do not implement — recommendation only, per the audit brief.**

### CURRENT ARCHITECTURE
```
Hand-authored HTML (≈70 pages: home, learn/, comparisons/, benchmarks/, glossary/,
  legacy roi-calculator/*/*, vertical hubs, legal/static pages)
        │
        ├── mutated in place by 5 independent, unchained, repo-wide,
        │   pattern-matching scripts (aeo_phase11.py, patch-phase176.mjs,
        │   patch-site-chrome.mjs, inject-navigation.mjs, + 2 obsolete
        │   footer scripts) — no shared "already applied" ledger beyond
        │   each script's own ad hoc substring check
        │
        └── header/footer markup independently duplicated in partials/,
            two Node scripts' string constants, and every page's baked HTML

Factory-generated HTML (14 calculator pages + 3 category hubs)
        │
        └── data/calculators.json → generate-calculators.mjs
              → calculator-quality.mjs (validates, can hard-fail)
              → templates/calculator-template.html | article-template.html
              → chains to sync-redirects.mjs, patch-site-chrome.mjs
```

### → PROBLEMS
1. **No single source of truth for site chrome** (header/footer/nav) — four independent copies that must be manually kept in sync, with a code comment acknowledging this ("keep in sync with partials/ and patch-phase176") rather than a mechanism enforcing it.
2. **One script (`aeo_phase11.py`) is responsible for the majority of Audit 02's quantified duplication**, and remains armed to reproduce it on any future run, including into the templates that currently feed the cleaner factory pipeline.
3. **Two unrelated content-generation regimes with different quality bars**: the factory pipeline has real validation (`calculator-quality.mjs`) and cannot currently produce the kind of duplicate-title/duplicate-formula pages found elsewhere in the site; the legacy/hand-authored tier has no equivalent check and is where nearly all of Audits 01-04's findings concentrate.
4. **No manifest of script obsolescence or run order** — five repo-wide mutators with no documentation of which are current, which are historical, or what order they must run in relative to each other.
5. **Idempotency checks throughout are "does the marker exist," not "was this intentional"** — every repo-wide script uses a shallow presence check as its only safety mechanism, which is precisely why manual content removal (the natural next step after any of Audits 01-04's recommendations) is not durable against a future script run.
6. **Validation exists but checks the wrong layer for this problem**: `audit-canonical.mjs` verifies canonical/og:url *hygiene* (no www, no http) but cannot and does not check for duplicate *intent* across distinct, validly-canonicalized URLs — which is exactly the failure mode Audit 04 identified as the dominant SEO problem. A page can pass every current automated check in this repository while being a content-duplicate of another passing page.

### → TARGET ARCHITECTURE
1. **One source of truth for site chrome.** Whether implemented as a real templating layer (a static-site generator with includes) or, at minimum, a single JS/Python module that every generator imports (extending the `site-chrome.mjs` pattern already used correctly for the footer's "Popular Tools" block to *also* cover the header, nav, and full footer) — no chrome markup should exist as an independently-maintained copy in more than one place.
2. **Retire or re-scope `aeo_phase11.py` before it is ever run again.** At minimum: (a) remove the hardcoded generic entity-definition/use-case/limitations text from its `SPECIAL` entries for pages it should never apply to (legal/utility pages), (b) change `default_tuple_for()` to refuse to inject on unrecognized pages rather than falling back to generic ROI text, and (c) add `templates/` to its skip list alongside `partials/`. Until this is done, this script should be treated as unsafe to run under any circumstance.
3. **Replace "does the marker exist" idempotency with a real generated/curated distinction.** Every repo-wide mutator should either (a) only ever touch files it fully owns and regenerates (as `generate-calculators.mjs` already does for its own output, using explicit BEGIN/END fences), or (b) record what it inserted (e.g., a marker comment identifying the script and version that added a block) so a future run can tell the difference between "never added" and "deliberately removed" — currently both states look identical to every script in this repository.
4. **Bring the legacy/hand-authored tier under the same validation discipline as the factory tier**, or explicitly retire it in favor of the factory pattern per Audits 01-02's consolidation recommendations. `calculator-quality.mjs`'s duplicate-slug/title/formula/FAQ checks are a genuinely good model — extending an equivalent check across the full site (not just `data/calculators.json`) would have caught the SaaS trio, the real-estate near-duplicate pairs, and the `learn/roi-vs-irr.html` / `comparisons/roi-vs-irr.html` collision identified in Audits 02-04 before they shipped.
5. **Add a cross-page duplicate-content/duplicate-intent check to the validation surface** — extending `audit-canonical.mjs`'s pass/fail model (which already hard-fails a build on a hygiene violation) to also flag near-identical `<title>` strings or near-identical opening-paragraph text across distinct URLs would directly catch the cannibalization pattern Audit 04 identified as the dominant SEO problem, at the point of authoring rather than after the fact.
6. **Document script status.** At minimum, a short manifest (even a comment block at the top of `scripts/`, or a single `scripts/README`) stating which scripts are current/safe-to-run, which are historical/obsolete, and the required run order for the ones still in use — this alone would have made §5's findings discoverable in minutes rather than requiring a full audit pass to reconstruct.

---

*End of Audit 05. No files were modified in the preparation of this report.*
