# Phase 13 — GSC Indexing & Canonical Hygiene Audit

**Audit date:** 2026-09-11  
**Auditor role:** Forensic indexing / canonical hygiene (audit-only; no production changes)  
**Baseline SHA:** `d9bd3b9ea6842ad5983006b6d15ff38f3e77b3ab`  
**Phase 12 implementation commits:** `78246ad` (Spanish pilot), `d9bd3b9` (production QA cache-bust + report)  
**Production inspected:** `https://roicalculator.live` (live HTTP fetch, 2026-09-11)

---

## 1. Executive Summary

Google Search Console reports three indexing buckets — 4× 404, 15× noindex, 59× redirect — with last-crawl dates roughly **2026-08-03 through 2026-09-04**, overlapping but largely **predating Phase 12** (deployed 2026-09-03, commit `78246ad`).

**Verdict:** None of the GSC buckets represent a Phase 12 regression. The Spanish pilot URLs are healthy: HTTP 200, indexable, self-canonical, reciprocal `en`/`es`/`x-default` hreflang on paired calculators, and all five URLs are present in `sitemap.xml`.

The GSC findings break down as:

| Category | Assessment |
|----------|------------|
| **404 examples** | 3 are **extensionless legacy paths** where only the `.html` variant has a 301 redirect; extensionless paths correctly 404 with zero internal references. 1 is **Cloudflare email-protection** (not site content). |
| **Noindex examples** | **Intentional** on legal/utility pages (`contact`, `privacy`, `about`, `terms`, `methodology/`, `site-structure`, `sitemap`, `404`). Extensionless and `.html` variants both resolve and carry `noindex, follow`. |
| **Redirect examples** | Predominantly **expected canonicalization**: HTTP→HTTPS, `.html`→extensionless (308), and legacy migration 301s defined in `_redirects`. GSC “Page with redirect” is largely historical crawl of non-canonical URL forms. |
| **Sitemap hygiene** | 73 URLs total; **61 of 73** sitemap entries 308-redirect to extensionless canonicals before serving 200. **5 noindex pages** are included in the sitemap (methodology + legal pages) — a policy inconsistency, not a Phase 12 defect. Four Spanish calculator sitemap entries use `.html` slugs that 308 to extensionless. |
| **Internal linking** | Site-wide footer/header still links to `.html` paths (`/solar/roi-calculator.html`, `/benchmarks/index.html`) that 308-redirect. A few editorial pages still link to retired hub paths (`/roi-calculator/real-estate/`, `/real-estate/roi-calculator.html`). No internal links point to the GSC 404 extensionless paths. |

**Phase 12 regression:** **NO** — evidence predates or is unrelated to Phase 12.

**Phase gate:** **PASS — AUDIT COMPLETE; REMEDIATION REQUIRED** (optional future hygiene; no urgent indexing defect from Phase 12).

---

## 2. Baseline and Phase 12 Timing

| Check | Result |
|-------|--------|
| Branch | `main` |
| HEAD | `d9bd3b9ea6842ad5983006b6d15ff38f3e77b3ab` |
| `origin/main` | `d9bd3b9` (HEAD == origin/main) |
| Working tree at audit start | Clean |
| Phase 12 report | Present at `reports/audits/PHASE-12-SPANISH-PILOT-IMPLEMENTATION.md` |
| Phase 12 deploy commit | `78246ad` — 2026-09-03 |
| Phase 12 QA follow-up | `d9bd3b9` — production cache-bust QA |

GSC screenshot crawl dates (Aug 3 – Sep 4, 2026) overlap the Phase 12 deploy window but reflect URLs and behaviors that **predate** the Spanish pilot (legacy redirects, legal noindex pages, extensionless architecture). Phase 12 added five `/es/*` URLs and reciprocal hreflang on four English pages only.

---

## 3. GSC Evidence Reviewed

### A) NOT FOUND (404) — 4 examples reported

| GSC URL | Notes |
|---------|-------|
| `/roi-calculator/solar/solar-panel-roi` | Extensionless legacy path; `.html` variant has 301 |
| `/roi-calculator/real-estate/cash-on-cash-return` | Extensionless legacy path; `.html` variant has 301 |
| `/calculators/simple-roi-calculator` | Extensionless legacy path; `.html` variant has 301 to `/` |
| `/cdn-cgi/l/email-protection` | Cloudflare Email Protection endpoint |

### B) EXCLUDED BY 'NOINDEX' TAG — 15 URLs reported

10 visible in screenshots; **14 conclusively recoverable** from production + repository (see §5). Two additional recoverable variants (`/methodology.html`, `/sitemap`) bring the audited set to **14 of 15**. The remaining 1 GSC URL could not be identified from available evidence.

### C) PAGE WITH REDIRECT — 59 URLs reported

10 visible examples audited in full (see §6). Live sitemap probe confirms **61 of 73** sitemap URLs themselves 308-redirect (`.html` → extensionless), explaining a large share of the GSC redirect count. This is established Cloudflare Pages behavior, not a new defect.

---

## 4. 404 Audit

| URL | GSC Crawl Date | Current Status | Internal References | Sitemap | Successor | Classification |
|-----|----------------|---------------:|---------------------|---------|-----------|----------------|
| `https://roicalculator.live/roi-calculator/solar/solar-panel-roi` | ~Aug–Sep 2026 (GSC) | **404** (no redirect) | **0** repo references | No | `/solar/roi-calculator` (via `/roi-calculator/solar/solar-panel-roi.html` → 301 → 308) | **404 — HISTORICAL / OBSOLETE** |
| `https://roicalculator.live/roi-calculator/real-estate/cash-on-cash-return` | ~Aug–Sep 2026 (GSC) | **404** (no redirect) | **0** repo references | No | `/real-estate/cash-on-cash-calculator` (via `.html` → 301 → 308) | **404 — HISTORICAL / OBSOLETE** |
| `https://roicalculator.live/calculators/simple-roi-calculator` | ~Aug–Sep 2026 (GSC) | **404** (no redirect) | **0** repo references (Phase 7G removed all HTML links) | No | `/` (via `/calculators/simple-roi-calculator.html` → 301) | **404 — HISTORICAL / OBSOLETE** |
| `https://roicalculator.live/cdn-cgi/l/email-protection` | ~Aug–Sep 2026 (GSC) | **404** | **0** (generated by Cloudflare when obfuscating `mailto:` links) | No | N/A (not a content URL) | **404 — INTENTIONAL / ACCEPTABLE** |

### Evidence detail

**Legacy extensionless 404 pattern:** `_redirects` defines 301 rules only for `.html` suffixed legacy URLs (e.g. `/roi-calculator/solar/solar-panel-roi.html` → `/solar/roi-calculator.html`). Cloudflare Pages then 308s `.html` to extensionless. The **extensionless legacy paths without `.html`** were never redirected and correctly return 404. They are not linked internally and are not in the sitemap.

**`/cdn-cgi/l/email-protection`:** Cloudflare injects this when Email Address Obfuscation is enabled. Google may crawl it from `mailto:` obfuscation scripts. It is not a site page, has no internal `href`, and 404 is expected/acceptable.

---

## 5. Noindex Audit

**Recoverable URL count:** 14 of 15 GSC-reported URLs. **1 URL unidentified** (full GSC export not available).

| URL | Current Status | noindex Source | Canonical | Sitemap | Internal Links | Classification |
|-----|---------------:|----------------|-----------|---------|----------------|----------------|
| `/contact` | 200 | `<meta robots="noindex, follow">` | `https://roicalculator.live/contact.html` | No | 0 (extensionless not linked; footer uses `.html`) | **NOINDEX — INTENTIONAL** |
| `/contact.html` | 308→200 | meta `noindex, follow` | self `.html` | **Yes** | ~154 pages (footer) | **NOINDEX — INTENTIONAL** |
| `/privacy` | 200 | meta `noindex, follow` | `https://roicalculator.live/privacy.html` | No | 0 | **NOINDEX — INTENTIONAL** |
| `/privacy.html` | 308→200 | meta `noindex, follow` | self `.html` | **Yes** | ~154 pages | **NOINDEX — INTENTIONAL** |
| `/about` | 200 | meta `noindex, follow` | `https://roicalculator.live/about.html` | No | 0 | **NOINDEX — INTENTIONAL** |
| `/about.html` | 308→200 | meta `noindex, follow` | self `.html` | **Yes** | ~156 pages | **NOINDEX — INTENTIONAL** |
| `/terms` | 200 | meta `noindex, follow` | `https://roicalculator.live/terms.html` | No | 0 | **NOINDEX — INTENTIONAL** |
| `/terms.html` | 308→200 | meta `noindex, follow` | self `.html` | **Yes** | ~154 pages | **NOINDEX — INTENTIONAL** |
| `/methodology/` | 200 | meta `noindex, follow` | self | **Yes** | ~312 pages | **NOINDEX — INTENTIONAL** |
| `/methodology.html` | 301→`/methodology/` | inherits target noindex | `/methodology/` | No | 0 direct links | **NOINDEX — INTENTIONAL** |
| `/site-structure` | 200 | meta `noindex, follow` | `https://roicalculator.live/site-structure.html` | No | 0 | **NOINDEX — INTENTIONAL** |
| `/site-structure.html` | 308→200 | meta `noindex, follow` | self `.html` | No | 2 (`sitemap.html`, self) | **NOINDEX — INTENTIONAL** |
| `/sitemap` | 200 | meta `noindex, follow` | `https://roicalculator.live/sitemap.html` | No | 0 | **NOINDEX — INTENTIONAL** |
| `/sitemap.html` | 308→200 | meta `noindex, follow` | self `.html` | No | ~10 pages | **NOINDEX — INTENTIONAL** |
| `/404.html` | 308→200 | meta `noindex, follow` | self `.html` | No | 0 | **NOINDEX — INTENTIONAL** |

### Notes

- All eight HTML source files with `noindex` are explicit in repository: `contact.html`, `privacy.html`, `about.html`, `terms.html`, `methodology/index.html`, `site-structure.html`, `sitemap.html`, `404.html`.
- Legal/utility pages are **deliberately** noindexed while remaining crawlable (`follow`) for user navigation from footers.
- **Policy tension (not a defect):** `methodology/`, `about.html`, `contact.html`, `privacy.html`, `terms.html` are in `sitemap.xml` **and** carry `noindex`. Google will respect `noindex` over sitemap inclusion. This is a sitemap policy inconsistency worth reviewing in a future remediation phase — it is **not** accidental noindex on indexable content.
- Extensionless variants (`/contact`, `/about`, etc.) serve 200 directly (no 308) while `.html` variants 308 to extensionless — both carry noindex.

---

## 6. Redirect Audit

### Fully audited visible GSC examples (14 URLs)

| Source URL | Status | Redirect Target | Final Status | Chain? | Sitemap? | Internal Links? | Classification |
|------------|-------:|-----------------|-------------:|:------:|:--------:|:---------------:|----------------|
| `http://roicalculator.live/` | 301 | `https://roicalculator.live/` | 200 | No | No | No | **HTTP→HTTPS — expected** |
| `/solar/roi-calculator.html` | 308 | `/solar/roi-calculator` | 200 | No | **Yes** (.html entry) | **Yes** (~146 pages, footer/header) | **.html→extensionless — expected** |
| `/comparisons/cap-rate-vs-roi.html` | 308 | `/comparisons/cap-rate-vs-roi` | 200 | No | Yes | Yes (~18) | **.html→extensionless — expected** |
| `/benchmarks/index.html` | 308 | `/benchmarks/` | 200 | No | No (sitemap uses `/benchmarks/`) | **Yes** (~144, footer) | **.html→extensionless — expected** |
| `/real-estate/index.html` | 308 | `/real-estate/` | 200 | No | No (sitemap uses `/real-estate/`) | **Yes** (~146) | **.html→extensionless — expected** |
| `/benchmarks/small-business-roi-benchmarks.html` | 308 | extensionless | 200 | No | Yes | Yes (~10) | **.html→extensionless — expected** |
| `/roi-calculator/solar/solar-panel-roi.html` | 301→308 | `/solar/roi-calculator` | 200 | **Yes** (2 hops) | No | No | **Legacy migration — expected** |
| `/real-estate/cash-on-cash-calculator.html` | 308 | extensionless | 200 | No | Yes | Yes (~14) | **.html→extensionless — expected** |
| `/roi-calculator/real-estate/cash-on-cash-return.html` | 301→308 | `/real-estate/cash-on-cash-calculator` | 200 | **Yes** (2 hops) | No | No | **Legacy migration — expected** |
| `/comparisons/roi-vs-payback-period.html` | 308 | extensionless | 200 | No | Yes | Yes (~32) | **.html→extensionless — expected** |
| `/calculators/simple-roi-calculator.html` | 301 | `/` | 200 | No | No | No | **Legacy consolidation (Phase 7G) — expected** |
| `/methodology.html` | 301 | `/methodology/` | 200 | No | No | No | **Legacy migration — expected** |
| `/solar/` | 301→308 | `/solar/roi-calculator` | 200 | **Yes** (2 hops) | No | No | **Legacy hub consolidation (Phase 4) — expected** |
| `/real-estate/roi-calculator.html` | 301 | `/real-estate/` | 200 | No | No | **Yes** (4 pages) | **Legacy consolidation (Phase 3) — expected** |

### GSC “59 redirects” interpretation

The site's canonical architecture uses **extensionless URLs**. Sitemap and on-page canonical `<link>` tags predominantly reference `.html` paths, which Cloudflare Pages **308-redirects** to extensionless equivalents. When Google crawls sitemap or internal `.html` links, GSC records “Page with redirect.” This is **by design**, not a crawl error.

Of 73 sitemap URLs probed live:
- **61** return 308 before 200 (`.html` → extensionless)
- **12** return 200 directly (hubs with trailing slash, homepage, glossary index, `/es/`)
- **0** return 404
- **5** final pages carry intentional `noindex` (see §5)

No redirect chain exceeded 2 hops in audited samples. No incorrect redirect target was found.

---

## 7. Sitemap Hygiene

| Metric | Finding |
|--------|---------|
| **Total URLs** | **73** |
| **All return 200 after redirects** | Yes (0× 404, 0× unresolved 3xx loop) |
| **URLs that 308-redirect from sitemap entry** | **61** (`.html` entries → extensionless) |
| **URLs with `noindex` on final page** | **5** (`/methodology/`, `/about.html`, `/contact.html`, `/privacy.html`, `/terms.html`) |
| **Canonical mismatch (sitemap loc vs final canonical)** | **0** blocking issues; canonicals consistently point to `.html` while Cloudflare serves extensionless (site-wide pattern) |
| **Obsolete `.html` URLs in sitemap** | **61** `.html` slugs (architectural; extensionless is served URL) |
| **Phase 12 Spanish URLs present** | **All 5 present** |
| **Spanish URLs redirect** | 4 calculator entries 308 `.html`→extensionless; `/es/` serves 200 directly |
| **Spanish URLs noindex** | **None** |
| **Spanish canonical/hreflang** | Self-canonical `.html` in markup; reciprocal `en`/`es`/`x-default` correct on 4 paired calculators |

### Sitemap generation

`sitemap.xml` is hand-maintained (no generator script in `scripts/`). Phase 12 added five `/es/*` entries at commit `78246ad`.

### Key hygiene observations (not Phase 12 defects)

1. **Sitemap lists `.html` URLs** that 308 to extensionless — Google discovers redirecting URLs from the sitemap itself.
2. **Five noindex pages are in the sitemap** — contradictory signals (sitemap says “index me”; page says noindex). Google honors noindex; GSC reports them as excluded.
3. **Spanish calculator sitemap entries use `.html`** but production serves extensionless (308). Canonical tags in HTML still reference `.html`.

---

## 8. Phase 12 Spanish Pilot Regression Check

### Spanish URLs (all PASS)

| URL | HTTP | Indexable | noindex | Canonical | lang | hreflang | Sitemap | Redirected | Discoverable |
|-----|------|-----------|---------|-----------|------|----------|---------|------------|--------------|
| `/es/` | 200 | Yes | None | Self (`/es/`) | `es` | None (no EN pair — correct) | Yes | No | Yes (EN switches + internal) |
| `/es/calculadora-roi.html` | 308→200 | Yes | None | Self `.html` | `es` | en/es/x-default ✓ | Yes | 308 to extensionless | Yes |
| `/es/inmobiliario/calculadora-rentabilidad-alquiler.html` | 308→200 | Yes | None | Self `.html` | `es` | en/es/x-default ✓ | Yes | 308 to extensionless | Yes |
| `/es/saas/calculadora-cac-ltv.html` | 308→200 | Yes | None | Self `.html` | `es` | en/es/x-default ✓ | Yes | 308 to extensionless | Yes |
| `/es/impresion-3d/calculadora-precio-servicio.html` | 308→200 | Yes | None | Self `.html` | `es` | en/es/x-default ✓ | Yes | 308 to extensionless | Yes |

### English paired sources (all PASS — reciprocal hreflang intact)

| URL | lang | Canonical | hreflang en | hreflang es | x-default |
|-----|------|-----------|-------------|-------------|-----------|
| `/` | `en` | Self | Self | `/es/calculadora-roi.html` | Self |
| `/real-estate/` | `en` | Self | Self | `/es/inmobiliario/calculadora-rentabilidad-alquiler.html` | Self |
| `/roi-calculator/saas/cac-ltv-roi.html` | `en` | Self | Self | `/es/saas/calculadora-cac-ltv.html` | Self |
| `/3d-printing/service-pricing-calculator.html` | `en` | Self | Self | `/es/impresion-3d/calculadora-precio-servicio.html` | Self |

**Phase 12 regression conclusion: NO.** Spanish pilot URLs are correctly indexable with clean hreflang. Phase 12 did not introduce any of the GSC 404, noindex, or redirect findings.

---

## 9. Internal Link Hygiene

### Currently discoverable links to affected / legacy URLs

| Source Page | Target URL | Target Status | Target Canonical | Indexability | Classification | Recommendation Status |
|-------------|------------|---------------|------------------|--------------|----------------|----------------------|
| `partials/footer.html` (synced site-wide) | `/solar/roi-calculator.html` | 308→200 | `.html` in meta | Indexable | **Non-canonical internal link** | Future: link to `/solar/roi-calculator` |
| `partials/footer.html` | `/benchmarks/index.html` | 308→200 | N/A | Indexable | **Non-canonical internal link** | Future: link to `/benchmarks/` |
| `partials/header.html` | `/solar/roi-calculator.html` | 308→200 | `.html` in meta | Indexable | **Non-canonical internal link** | Future: link to `/solar/roi-calculator` |
| `comparisons/index.html` | `/real-estate/roi-calculator.html` | 301→200 | `/real-estate/` | Indexable | **Legacy redirect target** | Future: link to `/real-estate/` |
| `comparisons/best-roi-calculator.html` | `/real-estate/roi-calculator.html` | 301→200 | `/real-estate/` | Indexable | **Legacy redirect target** | Future: link to `/real-estate/` |
| `benchmarks/average-roi-by-industry.html` | `/roi-calculator/real-estate/` | 301→200 | `/real-estate/` | Indexable | **Legacy hub redirect** | Future: link to `/real-estate/` |
| Multiple SaaS/comparison pages | `/roi-calculator/real-estate/` | 301→200 | `/real-estate/` | Indexable | **Legacy hub redirect** | Future: update editorial links |
| Multiple SaaS/comparison pages | `/roi-calculator/saas/`, `/roi-calculator/marketing/`, `/roi-calculator/solar/` | 301→200 | Canonical hubs | Indexable | **Legacy hub redirects** | Future: update to `/saas/`, `/marketing/`, `/solar/roi-calculator` |
| Site-wide footer (~154 pages) | `/contact.html`, `/privacy.html`, `/about.html`, `/terms.html` | 308→200 | `.html` | **noindex** | **Intentional noindex; discoverable** | No change required unless indexability policy changes |
| Site-wide footer (~312 pages) | `/methodology/` | 200 | self | **noindex** | **Intentional noindex; discoverable** | No change required unless indexability policy changes |
| `sitemap.html` | `/site-structure.html` | 308→200 | `.html` | **noindex** | **Intentional utility page** | No change required |

### NOT currently discoverable (historical GSC only)

| Target | Internal Links | Notes |
|--------|---------------:|-------|
| `/roi-calculator/solar/solar-panel-roi` (extensionless) | 0 | GSC historical crawl |
| `/roi-calculator/real-estate/cash-on-cash-return` (extensionless) | 0 | GSC historical crawl |
| `/calculators/simple-roi-calculator` (extensionless) | 0 | Phase 7G removed all links; `.html` redirects |
| `/cdn-cgi/l/email-protection` | 0 | Cloudflare-generated |

---

## 10. Canonical / Hreflang Integrity

### Site-wide canonical architecture

The site uses a **dual-URL pattern**:

1. **Served URL (Cloudflare):** extensionless (`/solar/roi-calculator`) — 200
2. **Canonical tag in HTML:** `.html` form (`/solar/roi-calculator.html`)
3. **Request to `.html`:** 308 → extensionless

This is consistent across English and Spanish calculators. Canonical tags do not point to 404s or incorrect successors. Hreflang URLs on Phase 12 paired pages use fully qualified HTTPS URLs and are reciprocal.

### Affected URL canonical assessment

| Pattern | Canonical behavior | Conflict? |
|---------|-------------------|-----------|
| Extensionless legacy 404s | N/A (404) | No canonical conflict — URLs are dead |
| Noindex legal pages | Self-canonical (`.html` or extensionless) | No — deliberate |
| Legacy `.html` with 301 in `_redirects` | Final page has its own canonical | No — redirect is correct consolidation |
| Spanish paired pages | Self-canonical `.html`; hreflang reciprocal | No Phase 12 defect |
| Sitemap `.html` entries | Page canonical matches sitemap loc | No mismatch; 308 is transport-layer canonicalization |

### Hreflang integrity (Phase 12 pairs)

All four EN↔ES pairs verified reciprocal with `en`, `es`, `x-default` (x-default → English). No `es-419` or country codes. `/es/` hub correctly omits fabricated hreflang pair.

---

## 11. Root Cause Classification

### A. No action required

- `/cdn-cgi/l/email-protection` 404 (Cloudflare email obfuscation artifact)
- Intentional `noindex` on legal/utility pages (`contact`, `privacy`, `about`, `terms`, `methodology/`, `site-structure`, `sitemap`, `404`)
- HTTP→HTTPS redirects (`http://` → `https://`)
- Legacy 301 consolidations in `_redirects` (Phases 2–7G) functioning correctly
- Phase 12 Spanish pilot indexing signals (all healthy)

### B. Historical / legacy

- Extensionless 404s: `/roi-calculator/solar/solar-panel-roi`, `/roi-calculator/real-estate/cash-on-cash-return`, `/calculators/simple-roi-calculator` (`.html` variants redirect; extensionless never did)
- GSC “Page with redirect” entries for URLs crawled before/during redirect rule fixes (REPAIR_REDIRECTS-01, `_redirects` `301!` → `301` syntax fix)
- Retired hub paths in GSC that now 301 correctly

### C. Internal discoverability cleanup needed

- Footer/header links to `/solar/roi-calculator.html` and `/benchmarks/index.html` (should use extensionless canonical paths)
- Editorial links to `/real-estate/roi-calculator.html` (2 pages)
- Editorial links to `/roi-calculator/real-estate/`, `/roi-calculator/saas/`, `/roi-calculator/marketing/`, `/roi-calculator/solar/` across comparison/benchmark/SaaS pages

### D. Redirect remediation needed

- **Optional:** Add 301 rules for extensionless legacy paths that currently 404 but have known successors (low priority — zero internal links, GSC-only discovery):
  - `/roi-calculator/solar/solar-panel-roi` → `/solar/roi-calculator`
  - `/roi-calculator/real-estate/cash-on-cash-return` → `/real-estate/cash-on-cash-calculator`
  - `/calculators/simple-roi-calculator` → `/`

### E. Noindex remediation needed

- **None.** All noindex is deliberate. Policy review only if legal pages should become indexable.

### F. Sitemap remediation needed

- Remove or retain noindex pages (`methodology/`, legal `.html` pages) based on indexability policy decision
- Consider migrating sitemap entries from `.html` to extensionless canonical URLs (61 entries) to stop submitting redirecting URLs
- Spanish calculator sitemap entries could use extensionless slugs for consistency

### G. Phase 12 regression

- **None identified.**

### H. Undetermined

- 1 of 15 GSC noindex URLs not recoverable from available evidence (full GSC export not provided)

---

## 12. Recommended Remediation Scope

*For a future authorized remediation phase only. No changes made in Phase 13.*

### R1 — Sitemap extensionless alignment (optional, medium priority)

| Item | Current | Desired | Reason | Change type |
|------|---------|---------|--------|-------------|
| 61 `.html` sitemap entries | Sitemap loc = `.html`; fetch 308→extensionless | Sitemap loc = extensionless canonical | Stops submitting URLs that immediately redirect | `sitemap.xml` |
| 4 Spanish calculator sitemap entries | `.html` in sitemap | extensionless (`/es/calculadora-roi`, etc.) | Consistency with served URL | `sitemap.xml` |

### R2 — Sitemap noindex policy (optional, low priority)

| Item | Current | Desired | Reason | Change type |
|------|---------|---------|--------|-------------|
| `/methodology/`, `/about.html`, `/contact.html`, `/privacy.html`, `/terms.html` in sitemap | In sitemap + noindex on page | **Either** remove from sitemap **or** remove noindex (Director decision) | Contradictory signals; GSC reports as excluded | `sitemap.xml` and/or HTML meta |

### R3 — Internal link canonicalization (optional, medium priority)

| Item | Current | Desired | Reason | Change type |
|------|---------|---------|--------|-------------|
| `partials/footer.html`, `partials/header.html` | `/solar/roi-calculator.html`, `/benchmarks/index.html` | `/solar/roi-calculator`, `/benchmarks/` | Eliminate unnecessary 308 hops from every page | HTML partials + `sync-site-chrome` |
| `comparisons/index.html`, `comparisons/best-roi-calculator.html` | `/real-estate/roi-calculator.html` | `/real-estate/` | Legacy redirect link | HTML |
| ~10 editorial pages | `/roi-calculator/real-estate/` etc. | `/real-estate/`, `/saas/`, `/marketing/`, `/solar/roi-calculator` | Legacy hub redirects in body copy | HTML |

### R4 — Extensionless legacy 404 redirects (optional, low priority)

| URL | Current | Desired | Reason | Change type |
|-----|---------|---------|--------|-------------|
| `/roi-calculator/solar/solar-panel-roi` | 404 | 301 → `/solar/roi-calculator` | GSC 404 hygiene for historical URL | `_redirects` |
| `/roi-calculator/real-estate/cash-on-cash-return` | 404 | 301 → `/real-estate/cash-on-cash-calculator` | GSC 404 hygiene | `_redirects` |
| `/calculators/simple-roi-calculator` | 404 | 301 → `/` | Parity with `.html` rule | `_redirects` |

### R5 — No action

| Item | Reason |
|------|--------|
| `/cdn-cgi/l/email-protection` | Cloudflare infrastructure; not remediable as site content |
| Legal page noindex | Intentional; indexability is a business decision |
| `.html`→extensionless 308 architecture | Established Cloudflare Pages behavior; do not remove |
| Phase 12 Spanish URLs | Healthy; monitor GSC for new indexing over next 2–4 weeks |

---

## 13. Deferred Items

1. **1 of 15 GSC noindex URLs** — full URL list not available; cannot audit without GSC export.
2. **45 of 59 GSC redirect URLs** — not individually enumerated in screenshots; bulk pattern (`.html`→extensionless + legacy 301s) explains the count; full enumeration requires GSC export.
3. **GSC re-crawl timeline** — sitemap resubmitted per Director; new indexing data not yet available at audit time. Spanish URLs may not yet appear in GSC index coverage.
4. **Canonical tag vs served URL policy** — site-wide decision needed: should `<link rel="canonical">` migrate to extensionless to match Cloudflare served URL, or retain `.html` canonicals? Currently consistent but creates 308 on every `.html` crawl.

---

## 14. Phase Gate

**PASS — AUDIT COMPLETE; REMEDIATION REQUIRED**

Remediation is **optional hygiene** (sitemap alignment, internal link canonicalization, low-priority legacy 404 redirects). **No urgent indexing defect** was found. **Phase 12 introduced no regression.**

---

## Audit QA Checklist

| Check | Result |
|-------|--------|
| Report exists | Yes |
| Production source files unchanged | Yes |
| `sitemap.xml` unchanged | Yes |
| `_redirects` unchanged | Yes |
| `robots.txt` unchanged | Yes |
| Calculator formulas unchanged | Yes |
| HTML/JS/CSS unchanged | Yes |
| `git diff` (intended) | Only `reports/audits/PHASE-13-GSC-INDEXING-CANONICAL-AUDIT.md` |

---

## Summary Statistics

| Metric | Count |
|--------|------:|
| 404s audited | 4 |
| Noindex URLs conclusively audited | 14 (of 15 GSC-reported) |
| Redirects fully audited (visible examples) | 14 |
| Sitemap URLs live-probed | 73 |
| Sitemap redirecting entries | 61 |
| Sitemap noindex entries | 5 |
| Phase 12 regression | **NO** |
| Remediation items recommended | 4 groups (R1–R4); R5 = no action |
