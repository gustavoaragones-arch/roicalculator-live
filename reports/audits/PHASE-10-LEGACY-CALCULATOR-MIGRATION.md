# PHASE 10 — LEGACY CALCULATOR DESIGN-SYSTEM MIGRATION

## 1. Starting commit

`dd26faf82c816e780a61dad0ea2f46c4aee370ff` (Phase 9 fix). Working tree clean, HEAD == origin/main confirmed before any file was touched.

## 2. Final commit

`c6a79a334a1ff124641f4a460ecf3208544b3105` ("Phase 10: migrate legacy calculators to design system"), plus this report as a follow-up commit.

## 3. Five migrated calculators

**Naming discrepancy, disclosed:** the Phase 10 brief named five files that do not exist in the repository (`roi-calculator/saas/roi-calculator.html`, `payback-period-calculator.html`, `customer-acquisition-cost-calculator.html`, `roi-calculator/solar/solar-roi-calculator.html`, `solar-payback-calculator.html`). No on-disk Phase 9 report exists to cross-reference (Phase 9 was reported in chat only). The actual files in `roi-calculator/saas/` and `roi-calculator/solar/` — matching the brief's own stated counts (SaaS: 3, Solar: 2) and every other structural detail — are:

- `roi-calculator/saas/cac-ltv-roi.html` — CAC vs LTV ROI Calculator
- `roi-calculator/saas/subscription-growth-roi.html` — Subscription Growth ROI Calculator
- `roi-calculator/saas/time-to-value-roi.html` — Time-to-Value ROI Calculator
- `roi-calculator/solar/ev-charger-roi.html` — EV Charger ROI Calculator
- `roi-calculator/solar/heat-pump-roi.html` — Heat Pump ROI Calculator

These are the five files migrated in this phase, on the judgment that the brief's filenames were a transcription error rather than a request to create five new pages (which would have violated the brief's own "do not create new programmatic URLs" instruction and left the actual legacy pages un-migrated).

## 4. Exact files changed

- `roi-calculator/saas/cac-ltv-roi.html`
- `roi-calculator/saas/subscription-growth-roi.html`
- `roi-calculator/saas/time-to-value-roi.html`
- `roi-calculator/solar/ev-charger-roi.html`
- `roi-calculator/solar/heat-pump-roi.html`
- `scripts/qa/phase10-legacy-migration-check.mjs` (new)

No other file was modified. No CSS file was touched (all styling reuses existing shared classes: `.hero`, `.hero-content`, `.hero-sub`, `.calculator-section`, `.calculator-section-inner`, `.calculator-card`, `.calculator-module`, `.calculator-box`, `.result-dominant`, `.result-dominant-label`, `.result-dominant-value`, `.result-interpretation`, `.results-grid`, `.results-box`, `.result-item`, `.result-card`, `.btn`, `.btn-primary`, `.btn-secondary`).

## 5. Legacy structural problems found

1. **Missing hero/calculator-section scaffolding.** All five pages had their `<h1>` and calculator form dropped directly inside `<article class="content-section">`, with no `.hero`/`.calculator-section`/`.calculator-card` wrapper — the site's oldest surviving markup tier (predating even the Gen-2 real-estate/HVAC/HR pages migrated in Phase 9).
2. **No dominant-result treatment.** All five used a flat `.results-grid` with plain `.result-item` (no `-box`/`-card` modifiers), giving every output equal visual weight.
3. **Missing `hidden` attribute on all five results panels** (not just one, and not specifically Solar — see §8).
4. **Two files had a mismatched closing tag**: `subscription-growth-roi.html` and `time-to-value-roi.html` each opened `<section class="related-topics">` but closed it with `</nav>` instead of `</section>` — invalid HTML nesting, present since original authoring.
5. **No PDF export** on any of the five pages (Phase 9's contract had not yet been extended here).

## 6. Design-system changes applied

For each page: wrapped the existing `<h1>` + subtitle in `<section class="hero"><div class="hero-content">...</div></section>`; wrapped the existing calculator `<form>` in `<section class="calculator-section"><div class="calculator-section-inner"><div class="calculator-card">...</div></div></section>` (adding the `calculator-box` class to the existing `.calculator-module`); wrapped each page's own most representative existing metric in `.result-dominant` (same element ID preserved, only re-parented); added a new `.result-interpretation` paragraph, populated by one new line of JS per page that reads only already-computed values; converted the remaining `.result-item` outputs to `.result-item.result-card` inside `.results-grid.results-box`; added the `hidden` attribute to each results panel and one line (`panel.hidden = false`) inside each `run()` function so the pre-existing "auto-calculate defaults on load" behavior is pixel-for-pixel preserved; fixed the two mismatched closing tags.

**Dominant-metric selection per page** (documented reasoning, since none was prescribed):
- `cac-ltv-roi.html` → **ROI** (id `roi`) — matches the page's own title and its sibling pages' convention; always computed given required fields.
- `subscription-growth-roi.html` → **Projected subscribers** (id `sub-projected`) — chosen over ROI because ROI is explicitly optional (`"Total growth spend ($, optional)"`, default `0`) and renders as `—` by default; subscriber projection is the page's only always-meaningful output. ROI remains a supporting metric, unchanged.
- `time-to-value-roi.html` → **ROI % (12 months)** (id `ttv-roi`) — always computed given required fields.
- `ev-charger-roi.html` → **ROI** (id `ev-roi`) — always computed given required fields.
- `heat-pump-roi.html` → **ROI** (id `hp-roi`) — always computed given required fields.

## 7. Formula-preservation verification

Zero calculation lines were altered on any of the five pages — every existing formula, variable, and rendering line is byte-identical to pre-migration. Verified by direct diff review and by confirming each page's default output against its pre-migration value:

| Page | Default dominant output |
|---|---|
| cac-ltv-roi.html | ROI 35.00% (LTV $2,700, ratio 1.35:1, payback 26.7 mo) |
| subscription-growth-roi.html | 2,033 projected subscribers (rev growth 103.30%, MRR $101,650) |
| time-to-value-roi.html | ROI 20.00% (12 mo) |
| ev-charger-roi.html | ROI 433.33% |
| heat-pump-roi.html | ROI 67.39% |

All five confirmed identical in local and production runs, both on initial page load (auto-run) and after clicking Calculate again (no drift).

## 8. Solar `hidden` attribute correction

The brief's premise — that exactly one Solar file was missing a `hidden` attribute — did not match what was found: **all five** legacy files (both Solar files and all three SaaS files) lacked `hidden` on their results panel, a defect present since original authoring, not isolated to Solar. Confirmed intended behavior via each page's JS: every `run()` function is called unconditionally once at load and again on submit, populating real values either way — so the missing `hidden` never caused a visible placeholder-dash state, but it was structurally inconsistent with every other calculator on the site. Restored `hidden` on all five results-panel `<div>`s and added `panel.hidden = false` inside each `run()`, preserving the exact pre-existing visible behavior (results shown immediately on load) while making the markup consistent with the rest of the site.

## 9. PDF export status

None of the five pages had PDF export before this phase. Implemented the exact Phase 9 contract (`window.getCalculatorPdfData()` returning `{title, sections:[{heading, rows:[{label,value}]}], disclaimer}`) on all five, reusing `assets/js/pdf-export.js` unchanged (no library, no new dependency) and the established `.btn.btn-secondary` button styling, `disabled` until first calculation. Verified via real Playwright: PDF button enabled after calculate, popup opens with correct branding/values/disclaimer, clicking it does not alter the on-page result.

## 10. SEO/schema preservation results

All five pages' canonical URLs, titles, meta descriptions, and existing JSON-LD (`BreadcrumbList`, `WebPage`, and `FAQPage` on `cac-ltv-roi.html` only) verified byte-identical to pre-migration. No new FAQPage schema was introduced on the four pages that didn't already have one. No sitemap or redirect changes. No URL changes.

## 11. Accessibility results

All form inputs retain their pre-existing `<label for="...">` associations (no IDs changed, so no labels were broken). PDF button is keyboard-focusable and uses `type="button"` (never submits the form). Fixed the two invalid `<section>...</nav>` nesting defects. No other accessibility regressions introduced.

## 12. Responsive results

Zero horizontal overflow on all five pages at 1440×900, 1024×768, 390×844, and 320×700 — verified both locally and in production.

## 13. Production verification results

Full 217-check QA script (`scripts/qa/phase10-legacy-migration-check.mjs`) run against `https://roicalculator.live` with cache-busting after deployment — **217/217 pass** on the first production run (no stale-JS cache issue this time, since all five pages' calculation logic lives in page-inline `<script>` blocks, not separately-cached external files needing version-busting; only the shared `pdf-export.js?v=10` reference needed — and already had — a version string).

## 14. Regression results

Re-tested homepage, Real Estate (flip-roi), 3D Printing (Business ROI), SaaS reference, Solar reference, and HVAC (Gen-2) — all default values unchanged, zero console errors, zero navigation regression, zero schema regression, zero PDF regression (homepage's own PDF untouched by this phase).

## 15. Deferred findings

None discovered requiring deferral. The two structural defects found (mismatched closing tags, missing `hidden`) were both corrected in-scope, since they were directly inside the exact markup this phase was already restructuring.

## 16. Final PASS / FAIL decision

**PASS.**

All required checks passed: mathematically neutral (zero formula changes, verified via unchanged default outputs), URL-neutral, SEO-neutral, schema-safe, navigation-safe, responsive, accessible, and production-verified via real Playwright with cache-busting.

Per the explicit stop instruction, no further phase begins after this one.
