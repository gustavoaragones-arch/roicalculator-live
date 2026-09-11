# Phase 14 — GSC Indexing Hygiene Remediation

**Status:** PASS — PHASE 14 REMEDIATION COMPLETE  
**Baseline SHA:** `2db8305c5c12471040129ee02e50c9b57ea71f6a` (Phase 13 audit)  
**Implementation commit:** `89f49eb`  
**Implementation date:** 2026-09-11  
**Authorized scope:** Phase 13 recommendations R2, R3, R4 only (R1 explicitly excluded)

---

## 1. Baseline

| Check | Result |
|-------|--------|
| Branch | `main` |
| Baseline HEAD | `2db8305` |
| HEAD == origin/main | Yes |
| Working tree | Clean at start |
| Phase 13 report | Present and pushed |

---

## 2. Authorized Scope

| Recommendation | Action | Status |
|----------------|--------|--------|
| **R1** — Sitemap extensionless migration | **NOT implemented** (Director decision) | Deferred |
| **R2** — Remove noindex pages from sitemap | Implemented | Done |
| **R3** — Internal link canonicalization | Implemented | Done |
| **R4** — Three extensionless legacy 301 redirects | Implemented | Done |

No canonical tags, hreflang, Spanish content, calculator math, or Cloudflare `.html`→extensionless architecture were modified.

---

## 3. R2 — Sitemap / Noindex Cleanup

### Removed sitemap entries (5)

1. `https://roicalculator.live/methodology/`
2. `https://roicalculator.live/about.html`
3. `https://roicalculator.live/contact.html`
4. `https://roicalculator.live/privacy.html`
5. `https://roicalculator.live/terms.html`

### Preserved

- `noindex, follow` meta directives on all five pages (unchanged)
- All other sitemap URLs unchanged
- All five Spanish pilot URLs unchanged in sitemap

### Sitemap count

| | Count |
|---|------:|
| Before | 73 |
| After | **68** |
| Removed | 5 |

Sitemap XML validated locally (`xml.etree.ElementTree` parse success).

---

## 4. R3 — Internal Link Canonicalization

### Replacements applied

| Legacy target | Canonical replacement | Scope |
|---------------|----------------------|-------|
| `/solar/roi-calculator.html` | `/solar/roi-calculator` | Site chrome + all HTML body links |
| `/benchmarks/index.html` | `/benchmarks/` | Site chrome + all HTML body links |
| `/real-estate/roi-calculator.html` | `/real-estate/` | Editorial pages |
| `/roi-calculator/real-estate/` | `/real-estate/` | Editorial pages |
| `/roi-calculator/saas/` | `/saas/` | Editorial pages (hub only; child calculators untouched) |
| `/roi-calculator/marketing/` | `/marketing/` | Editorial pages |
| `/roi-calculator/solar/` | `/solar/roi-calculator` | Editorial pages (hub only; heat-pump/ev-charger untouched) |

### Source of truth

- `scripts/site-chrome.mjs` — `SITE_HEADER_HTML`, `SITE_FOOTER_HTML`, `POPULAR_TOOLS_FOOTER_HTML`
- `partials/header.html`, `partials/footer.html` — reference copies updated
- `node scripts/sync-site-chrome.mjs` — propagated header/footer to **71** HTML pages

### Editorial pages with body-link fixes (beyond chrome sync)

- `index.html`
- `benchmarks/index.html`, `average-roi-by-industry.html`, `saas-roi-benchmarks.html`, `small-business-roi-benchmarks.html`, `solar-roi-benchmarks.html`
- `comparisons/index.html`, `best-roi-calculator.html`, `roi-vs-irr.html`, `roi-vs-npv.html`, `roi-vs-payback-period.html`
- `roi-calculator/saas/cac-ltv-roi.html`, `subscription-growth-roi.html`, `time-to-value-roi.html`
- `roi-calculator/solar/heat-pump-roi.html`, `ev-charger-roi.html`
- `hvac/roi-calculator.html`
- `sitemap.html`

### Link correction count

**428** internal `href` attributes updated (git diff count of removed legacy href lines).

### Post-validation search

Zero remaining internal `href` links to authorized legacy targets in `*.html` (excluding `es/`).  
`site-structure.html` retains legacy path names in `<code>` documentation prose only (non-link).

---

## 5. R4 — Extensionless Legacy Redirects

Added to `scripts/site-config.mjs` (synced to `_redirects` and `public/_redirects`):

```
/roi-calculator/solar/solar-panel-roi /solar/roi-calculator 301
/roi-calculator/real-estate/cash-on-cash-return /real-estate/cash-on-cash-calculator 301
/calculators/simple-roi-calculator / 301
```

### Expected behavior (post-deploy)

| Source | Chain | Final |
|--------|-------|-------|
| `/roi-calculator/solar/solar-panel-roi` | 301 → `/solar/roi-calculator` | 200 |
| `/roi-calculator/real-estate/cash-on-cash-return` | 301 → `/real-estate/cash-on-cash-calculator` | 200 (may 308 from `.html` canonical path if followed differently) |
| `/calculators/simple-roi-calculator` | 301 → `/` | 200 |

No wildcard rules. No changes to existing redirect rules except the three additions.

---

## 6. Canonical Architecture

**R1 was intentionally NOT implemented.**

- Canonical `<link>` tags remain on `.html` form (unchanged)
- Cloudflare `.html` → extensionless 308 behavior remains (unchanged)
- Sitemap URLs remain on `.html` form for indexable pages (unchanged)
- Spanish calculator sitemap entries remain `.html` (unchanged)

A future dedicated canonical architecture phase may evaluate extensionless canonicals and sitemap alignment.

---

## 7. Spanish Pilot Regression

**Local QA:** `PHASE12_BASE=http://127.0.0.1:8791 node scripts/qa/phase12-spanish-pilot-check.mjs`

**Result: 131 passed, 0 failed**

| URL | Status |
|-----|--------|
| `/es/` | PASS — 200, indexable, self-canonical, in sitemap |
| `/es/calculadora-roi.html` | PASS — hreflang reciprocal |
| `/es/inmobiliario/calculadora-rentabilidad-alquiler.html` | PASS |
| `/es/saas/calculadora-cac-ltv.html` | PASS |
| `/es/impresion-3d/calculadora-precio-servicio.html` | PASS |

Spanish files under `es/` were not modified.

---

## 8. Calculator Regression

**Local QA:** `PHASE6_BASE=http://127.0.0.1:8791 node scripts/qa/phase6-regression-check.mjs`

| Calculator | Result |
|------------|--------|
| CAC vs LTV ROI | PASS (35.00%) |
| Subscription Growth ROI | FAIL (dominant "—") — **pre-existing on baseline `2db8305`; not introduced by Phase 14** |
| Time-to-Value ROI | PASS (20.00%) |

**Navigation check:** PASS (`navigation-check.mjs`)

Phase 14 changed only `href` attributes in SaaS calculator pages; no JS, inputs, or formulas were modified. Subscription Growth failure reproduces on pre-Phase-14 baseline.

---

## 9. Production Verification

**Deploy commit:** `89f49eb`  
**Verified:** 2026-09-11 (post-deploy, ~90s after push)

### Sitemap (live)

| Check | Result |
|-------|--------|
| URL count | **68** (was 73) |
| `/methodology/` removed | Yes |
| `/about.html`, `/contact.html`, `/privacy.html`, `/terms.html` removed | Yes |
| Spanish URLs preserved | Yes (`/es/` + 4 calculators) |

### R4 redirects (live, cache-busted)

Cloudflare had cached prior **404** responses (`cache-control: max-age=2678400`). Uncached requests (e.g. `?qa=<timestamp>`) confirm rules are live:

| Source | Chain | Final |
|--------|-------|-------|
| `/roi-calculator/solar/solar-panel-roi` | 301 → `/solar/roi-calculator` | **200** |
| `/roi-calculator/real-estate/cash-on-cash-return` | 301 → `/real-estate/cash-on-cash-calculator` | **200** |
| `/calculators/simple-roi-calculator` | 301 → `/` | **200** |

No redirect loops observed.

### Architecture regression (live)

| URL | Result |
|-----|--------|
| `/solar/roi-calculator.html` | 308 → `/solar/roi-calculator` → 200 |
| `/benchmarks/small-business-roi-benchmarks.html` | 308 → extensionless → 200 |
| `/real-estate/cash-on-cash-calculator.html` | 308 → extensionless → 200 |

### Noindex (live)

`/methodology/`, `/contact`, `/about`, `/privacy`, `/terms` — all remain `noindex, follow`.

### Spanish (production QA)

`PHASE12_BASE=https://roicalculator.live node scripts/qa/phase12-spanish-pilot-check.mjs`  
**131 passed, 0 failed**

---

## 10. Files Changed

| Category | Files |
|----------|-------|
| Sitemap | `sitemap.xml` |
| Redirects source | `scripts/site-config.mjs` |
| Redirects output | `_redirects`, `public/_redirects` |
| Chrome source | `scripts/site-chrome.mjs`, `partials/header.html`, `partials/footer.html` |
| Chrome sync output | 71 HTML pages (header/footer) |
| Editorial body links | 19 HTML pages (additional body `href` fixes) |
| Report | `reports/audits/PHASE-14-GSC-INDEXING-HYGIENE-REMEDIATION.md` |

**Total modified tracked files:** 78 (excluding this report until commit)

---

## 11. Deferred Work

- **R1** — Sitewide sitemap extensionless migration
- Canonical tag architecture decision (extensionless vs `.html`)
- Broader redirect cleanup beyond the three extensionless 404s
- GSC re-crawl monitoring for indexing bucket changes
- Pre-existing Subscription Growth ROI QA failure (unrelated to Phase 14)

---

## 12. Final Gate

**PASS — PHASE 14 REMEDIATION COMPLETE**
