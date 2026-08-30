# AUDIT 06 — Accessibility / Performance / Responsive Quality
**roicalculator.live — Project Director Audit**
Read-only. No code modified. Findings below are drawn from direct inspection of `assets/css/styles.css`, `assets/js/*.js`, `partials/header.html`, and the six representative pages (`index.html`, the SaaS calculator `saas/roi-calculator.html`, the SaaS hub `saas/index.html`, `benchmarks/index.html`, `comparisons/index.html`; the "generic calculator" is `index.html` itself, which carries the site's only global ROI calculator). Contrast ratios were computed directly from the CSS custom-property hex values using the WCAG relative-luminance formula, not estimated.

---

## Executive summary

The site's biggest accessibility problem is not subtle: **the entire "Calculators" mega-menu — the primary calculator-discovery mechanism in the header of all 87 pages — is unreachable by keyboard alone.** Its trigger is a bare `<span>`, not a link or button, and the menu itself is `display:none` until `:hover` or `:focus-within`, but nothing inside it can receive focus before it is shown and nothing about the trigger can receive focus at all. This is a single, sitewide P0. Two more P0-caliber contrast failures were computed directly from the theme's own color tokens: the primary "Calculate" button (white text on the accent green) measures 2.54:1, and the footer copyright line measures 2.53:1 — both roughly half the WCAG AA minimum. Performance-wise the site is lightweight in absolute terms (no images, small first-party JS, uncompressed CSS under 25KB), but has a render-blocking `@import` font chain with no `preconnect` hint, zero `<noscript>` fallback for a site whose entire product is JavaScript-dependent, and only three `@media` rules for responsive behavior across the whole codebase.

---

## P0 — Severe failures

### P0-1. The "Calculators" dropdown menu is 100% unreachable by keyboard
**Where:** `partials/header.html` (and identically on all 87 pages, plus `generate-calculators.mjs`'s and `patch-phase176.mjs`'s hardcoded header copies) — every page in the site.
```html
<li class="nav-dropdown">
  <span>Calculators</span>
  <div class="nav-dropdown-menu" role="navigation" aria-label="Calculator tools">
    <a href="/marketing/index.html">Marketing ROI</a> ...
```
```css
.nav-dropdown-menu { display: none; ... }
.nav-dropdown:hover .nav-dropdown-menu,
.nav-dropdown:focus-within .nav-dropdown-menu,
.nav-dropdown.open .nav-dropdown-menu { display: block; }
```
**Problem:** the trigger is a `<span>` — not a link, not a button, no `tabindex`, no `role="button"`, no `aria-expanded` (confirmed zero occurrences of `aria-expanded` and zero occurrences of `tabindex` anywhere in the repository). It cannot receive keyboard focus. The `:focus-within` rule that would reveal the menu requires a *descendant* to already be focused — but the six `<a>` links inside `.nav-dropdown-menu` are themselves `display:none` until revealed, which removes them from the tab order entirely (a `display:none` element cannot be focused). This is a closed loop: nothing can be focused to trigger the reveal, and nothing inside can be reached until something is revealed. `navigation.js`'s click-to-toggle handler (`dropdown.classList.toggle('open')`) only fires on a mouse/touch `click` event on the span — it has no `keydown` handler for Enter/Space, so even a script-based workaround doesn't help keyboard users.
**Impact:** a keyboard-only user (and many screen-reader users navigating linearly) tabbing through the header goes from the "SaaS" link directly to "Learn," silently skipping Marketing ROI, Real Estate ROI, SaaS ROI, Solar ROI, HVAC ROI, and Employee ROI — six of the site's primary navigation destinations, on every single page, with no indication anything was skipped.
**WCAG:** 2.1.1 Keyboard (Level A) — a hard failure, not a partial one.

### P0-2. Primary "Calculate" button fails contrast by roughly half the required ratio
**Where:** `assets/css/styles.css:467-471`, applied to every `.btn-primary` sitewide (the "Calculate" button on all 33 calculators, "Open Calculator" CTAs, the sticky-bar CTA, etc.)
```css
.btn-primary { background: var(--color-accent); color: white; }  /* #10b981 background, #ffffff text */
```
**Measured contrast:** white (#ffffff) on `--color-accent` (#10b981) = **2.54:1**. WCAG AA requires 4.5:1 for normal-size text (button labels are ~1rem/16px, not "large text"). The `:hover` state (`--color-accent-hover`, #059669) is not materially better: **3.77:1**, still under the 4.5:1 threshold.
**Impact:** the single most important interactive element on every calculator page in the site — the button that actually runs the calculation — has text that a meaningful share of low-vision users cannot read against its background.
**WCAG:** 1.4.3 Contrast (Minimum), Level AA — fails in both default and hover states.

### P0-3. Footer copyright line fails contrast outright
**Where:** `assets/css/styles.css:968-973`, present in the footer of all 87 pages
```css
.footer-copy { color: #555; ... font-size: 12px; }
```
**Measured contrast:** #555555 on the page background (#111114) = **2.53:1** — also roughly half the 4.5:1 AA minimum, and the text is small (12px), which rules out any "large text" exception. The adjacent `.footer-disclaimer` (color `#777`, also 12px) measures **4.21:1** — closer, but still fails AA for its actual (non-large) size.
**Impact:** lower severity than P0-1/P0-2 in terms of task-blocking (it's not interactive), but it is a hard, measurable WCAG failure repeated on every page of the site, and it sits directly below the site's E-E-A-T-relevant trust signals (operator name, "Not financial advice" disclaimer) — the exact text most likely to matter to a careful or skeptical visitor is the hardest to read.
**WCAG:** 1.4.3 Contrast (Minimum), Level AA.

### P0-4. Zero fallback for JavaScript failure — the entire product is a blank form with no explanation
**Where:** sitewide — confirmed zero `<noscript>` elements anywhere in the repository, across all 87 pages.
**Problem:** every calculator on the site (all 33 identified in Audit 03) is 100% dependent on client-side JavaScript executing successfully. If JavaScript is disabled, blocked by an extension, or fails to load (including a failure of the third-party `cdn.jsdelivr.net` dependency carrying Chart.js — see P1-3), the user is left with a plain HTML form that does nothing when submitted, with **no message anywhere on any page explaining why**, and no static/server-computed fallback result.
**Impact:** for a site whose entire value proposition is "the calculator," this is a full, silent product failure for an unmeasured but non-trivial share of visitors (corporate JS-blocking policies, ad-blocker interactions with third-party CDN scripts, and script errors all apply). This compounds directly with Audit 03's finding that `pdf-export.js`'s "Download PDF" also silently no-ops if pop-ups are blocked, with only that one feature having any user-facing error message (`alert('Please allow pop-ups...')`) — the core calculator itself has none.

---

## P1 — Major problems

### P1-1. No responsive breakpoint for the header navigation
**Where:** `assets/css/styles.css:96-123` (`.nav-main`, `.nav-links`), present on all 87 pages.
The header is a single `flex-wrap` row: logo + 9 top-level nav items + the (keyboard-unreachable, P0-1) dropdown trigger + the privacy badge, with **no media query collapsing this into a mobile menu pattern** anywhere in the stylesheet. `navigation.js` only toggles the dropdown's `.open` class; it implements no hamburger/off-canvas pattern. On a ~375px viewport this content set will wrap across multiple lines before any page content appears, and — combined with `position: sticky` on `.site-header` — will persistently consume a disproportionate share of the viewport while scrolling on every page in the site.

### P1-2. Only three `@media` rules exist in the entire 1,006-line stylesheet
**Where:** `assets/css/styles.css` — confirmed via full-file review (Audit 01 cross-reference): `max-width: 900px` (collapses `.hero-grid`, which is not used by any of the sampled pages — effectively dead code), `max-width: 520px` (stacks `.results-box` to one column), and `@media print`. There is no breakpoint anywhere for:
- Multi-column `.form-row` grids (`grid-template-columns: repeat(auto-fit, minmax(180px, 1fr))`) — a 3-field row (common on vertical calculators, e.g. `real-estate/roi-calculator.html`'s 9-input, 3-row form) has no mobile-specific column reduction beyond what `auto-fit`/`minmax` produces incidentally.
- Plain `<table>` elements in article bodies (e.g. the benchmark tables on `index.html` and `benchmarks/*.html`) — only `.summary-table-box` gets `overflow-x: auto`; ordinary `<table>` markup outside that wrapper has no horizontal-scroll containment and will force page-level horizontal scroll or illegibly compressed columns on narrow viewports.
- The `.calculator-strip` (homepage-only horizontal scroll row) and sticky header stacking together on small screens.

### P1-3. Render-blocking font loading with no `preconnect`
**Where:** `assets/css/styles.css:2`
```css
@import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap");
```
**Problem:** `@import` inside a stylesheet is a well-documented performance anti-pattern relative to a `<link rel="stylesheet">` in the HTML head — the browser must fetch and begin parsing `styles.css` before it even discovers the font stylesheet needs fetching, then fetch *that* stylesheet before it can discover the actual font file URLs, serializing what could be parallelized requests. **No page in the sample has a `preconnect` or `dns-prefetch` hint for `fonts.googleapis.com` or `fonts.gstatic.com`** — the only `preconnect` present anywhere (`index.html`, `real-estate/roi-calculator.html`, and the Chart.js-loading pages) targets `cdn.jsdelivr.net`, a `defer`-loaded, non-render-path resource, while the actual render-relevant font origin gets no early-connection hint at all. `&display=swap` is correctly present (mitigating invisible-text-on-load), but the connection-setup cost itself is unmitigated.
**Files affected:** every page on the site (all load the same global stylesheet).

### P1-4. Unbundled JavaScript — 7-8 separate first-party/CDN requests for one calculator
**Where:** `index.html:538-545` — 8 separate `<script>` requests to render one calculator: `chart.umd.min.js` (CDN), `chart-config.js`, `calculator-engine.js`, `calculator-bindings.js`, `CalculationAnswerBlock.js`, `calculator.js`, `pdf-export.js`, `navigation.js`. All are `defer` (correctly non-render-blocking for initial paint), but none are bundled or concatenated, meaning 7 separate first-party HTTP requests plus one third-party CDN request execute in sequence relative to each other before the calculator is interactive. `saas/roi-calculator.html` is leaner (3 script requests) but the pattern — no build/bundle step anywhere in the repository (confirmed: no `package.json`, no bundler config) — means every page pays this cost independently rather than sharing one cached bundle.

### P1-5. Single global stylesheet ships every page's CSS to every page
**Where:** `assets/css/styles.css` (24.3KB uncompressed), linked identically on all 87 pages including `benchmarks/index.html`, `comparisons/index.html`, `glossary/*` — none of which use `.calculator-card`, `.results-box`, `.toggle-row`, `.chart-container`, `.form-group input`, or any of the calculator-specific rules that make up a substantial fraction of the file. There is no per-page-type CSS splitting, and the file additionally carries confirmed dead rules (`.hero-grid`, `.dropdown-menu`/`.dropdown-group`, `.site-footer--minimal`, `.footer-links--compact` — cross-referenced from Audit 01 §9 P2-3) that ship to every page regardless of whether anything on the site still uses them.

### P1-6. Third-party Chart.js dependency with no Subresource Integrity and no self-hosted fallback
**Where:** every chart-bearing page (9 of 33 calculators, per Audit 03 §1), e.g. `index.html:538`:
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js" defer></script>
```
No `integrity="sha384-..."` attribute is present, and there is no local/vendored fallback if the CDN is unreachable — on those 9 pages, a CDN outage silently removes the chart (the `if (canvas && typeof window.Chart !== 'undefined')` guards in each ecosystem script mean the rest of the calculator still functions, which is a reasonable degradation, but the chart itself simply never appears with no error surfaced to the user).

---

## P2 — Meaningful improvements

### P2-1. Focus indicator is scoped only to form inputs, not links or buttons
**Where:** `assets/css/styles.css:447-451` is the *only* custom `:focus` style in the entire stylesheet (the other three `:focus`-related rules, lines 140/167/186, are `:focus-within` used purely as a hover-adjacent state trigger for the dropdown, not a visible focus style). Confirmed no global `outline: none` reset exists — buttons, nav links, breadcrumb links, and footer links all retain the browser's native default focus outline, which is a mitigating factor. However, the one custom style that does exist is subtle: `box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1)` — a **10%-opacity** glow — paired with a border-color change from a dark border to `--color-accent`. This may not provide a sufficiently perceptible, high-contrast focus indicator against the dark card backgrounds it's meant to stand out on.

### P2-2. Chart accessibility is present but static
**Where:** all 9 chart-bearing pages correctly implement `role="img" aria-label="..."` on their `<canvas>` elements (e.g. `index.html:202`, `saas/roi-calculator.html:169`) — this is good baseline practice and was verified present on every chart found in the repository, not just a sample. However, the `aria-label` text is a fixed, generic description (e.g. "Cumulative value versus cumulative cost by year") that does not update after calculation — a screen-reader user gets the same static label whether they've entered the default values or their own scenario. The adjacent numeric results panel does contain the actual computed figures in accessible text, so the underlying data isn't wholly inaccessible, but the chart's specific visual comparison (the shape/crossover point of the two lines) has no textual equivalent.

### P2-3. Live recalculation on every keystroke, unthrottled
**Where:** `assets/js/calculator.js:257-267` (homepage) attaches both `input` and `change` listeners to every field, each triggering a full `runCalculation()` — including a chart `update()` call — on every keystroke. For fast typists or rapid up/down-arrow adjustment on a number input, this fires significantly more often than necessary (no debounce/throttle), which is a minor jank/battery-cost risk on low-end mobile devices, though not severe given the calculation itself is cheap arithmetic.

### P2-4. Sticky bottom bar and sticky header both reserve permanent viewport space
**Where:** `.site-header { position: sticky }` (styles.css:87) and `.sticky-calc-bar` (styles.css:216-253, homepage only) — the bar correctly adds `body.has-sticky-calc-bar { padding-bottom: 56px }` when visible, so it does not technically overlap content (a genuine positive — no content is hidden behind it). The combined effect on a short mobile viewport (e.g., landscape orientation, or an older device) of a sticky top header plus, once scrolled, a sticky bottom bar, is nonetheless a meaningfully reduced usable content area for the calculator itself.

### P2-5. No `prefers-reduced-motion` or `prefers-color-scheme` support
**Where:** confirmed zero occurrences of either media feature anywhere in `styles.css`. The site is single-theme (dark only) by design, which is a legitimate product choice, not a bug — but `html { scroll-behavior: smooth }` (styles.css:30) applies smooth-scrolling sitewide (including the sticky-bar's `#main-roi-calculator` jump) with no `prefers-reduced-motion: reduce` override, which is a minor vestibular-motion consideration for users who have that OS-level preference set.

### P2-6. Unused/dead CSS shipped on every page
Cross-referenced from Audit 01 §9 (P2-3): `.hero-grid`/`.hero-calculator`/`.hero-info` (styles.css:296-317), the second `.dropdown-menu`/`.dropdown-group` system (171-213, distinct from and seemingly superseded by `.nav-dropdown-menu`), `.site-footer--minimal`/`.footer-edu`/`.footer-links--compact` (974-989) — none of these classes were found in use on any of the 87 HTML files sampled across this audit series, meaning this is dead weight in every page's CSS payload.

---

## P3 — Polish

- **No SRI hash on the Chart.js CDN script** (also listed under P1-6's performance angle; the security/defense-in-depth angle alone is lower severity and listed here for completeness).
- **`assets/logo.png` (569 bytes) is never referenced by an `<img>` tag anywhere** — the site uses a text-only logo (`<a class="logo">roicalculator.live</a>`); the PNG asset is unused dead weight in the repository, though at 569 bytes its performance impact is negligible.
- **`aria-describedby` on the reverse-mode checkbox points at its own `<label>` element** (`index.html:171-172`: `aria-describedby="reverse-desc"` where `id="reverse-desc"` is the `<label for="reverse-mode">` itself) — redundant (the label already provides the accessible name via `for`/`id` association) rather than harmful, but not the conventional use of `aria-describedby` (typically a separate help-text element).
- **Google Fonts request pulls 6 font files** (IBM Plex Sans at 400/500/600/700 weights + IBM Plex Mono at 400/500) on every page load with no visible subsetting parameter — likely the single heaviest asset class on the site page-for-page, exceeding the combined weight of all first-party JS and CSS, though this was not independently measured against actual served byte sizes (Google's font CDN serves woff2 subsets dynamically; exact weight depends on browser/charset negotiation not observable from the repository alone).
- **Single H1 per page, correct landmark usage (`<header>`, `<main>`, `<footer>`, `<nav>`), and consistent viewport meta tags were all verified correct** across the six representative pages — noted here as confirmed non-findings so this audit's scope is documented as complete rather than silent on these checks.

---

## Representative-page notes

| Page | Distinguishing observations |
|---|---|
| `index.html` (homepage / generic calculator) | Heaviest page tested (29.4KB HTML, 8 script requests); has the only PDF/print export on the site (Audit 03); inherits every sitewide finding above (P0-1 through P1-5 all apply here directly). |
| `saas/roi-calculator.html` | Lightest script footprint of the calculators sampled (3 requests: Chart.js CDN, `saas-ecosystem-calculator.js`, `navigation.js`); still inherits the sitewide header/contrast/font findings. |
| `saas/index.html` (SaaS hub) | No calculator on page (Audit 01/02 cross-reference), so P2-3's live-recalculation concern doesn't apply here, but every chrome-level finding (P0-1, P0-3, P1-1 through P1-3, P1-5) still does — it loads the identical global header, footer, and stylesheet as every calculator page despite having no calculator-specific content to justify that CSS weight. |
| `benchmarks/index.html` | Contains a plain `<table>` (the summary-table-box variant, correctly wrapped) but also inherits the sitewide un-wrapped-table risk (P1-2) via its cross-links to pages like the homepage that do have unwrapped tables. |
| `comparisons/index.html` | Same profile as the benchmarks hub — no calculator, full chrome/CSS/font payload regardless. |

---

*End of Audit 06. No files were modified in the preparation of this report.*
