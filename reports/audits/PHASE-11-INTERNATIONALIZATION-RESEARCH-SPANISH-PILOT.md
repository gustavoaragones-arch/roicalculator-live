# PHASE 11 — INTERNATIONALIZATION RESEARCH & SPANISH PILOT ARCHITECTURE

**Phase type:** Research / Architecture only  
**Production changes:** None  
**Report date:** 2026-09-02  
**Baseline HEAD:** `3e1a457e0b3fd00c503bd0ed291dfe981db179dc`  
**Phase 10 implementation:** `c6a79a334a1ff124641f4a460ecf3208544b3105`  
**Phase 10 report:** `3e1a457`

Evidence classes used throughout:

- **A — Verified fact** (repository inspection, official docs, fetched competitor pages)
- **B — Observed competitor evidence** (live Spanish-language pages / SERP presence)
- **C — Reasonable inference** (pattern-based, not quantified)
- **D — Strategic recommendation** (judgment based on A–C)

**No search-volume numbers are claimed.** Where keyword demand cannot be quantified from available tools, this report states **data unavailable** and treats SERP/competitor presence as **directional evidence only**.

---

## 1. Executive Summary

**Director recommendation: AUTHORIZE a controlled Spanish pilot (proposed Phase 12) — do not authorize bulk translation of the English site.**

| Question | Verdict |
|----------|---------|
| Is Spanish expansion technically feasible? | **Yes** — static/Cloudflare Pages architecture can support `/es/` shells sharing English calculation engines. (A) |
| Is it SEO-coherent? | **Yes, if** distinct crawlable URLs, reciprocal `hreflang`, self-canonicals, and human-reviewed localization are used. (A) |
| Is it AdSense-compatible? | **Yes** — Spanish (European) and Spanish (Latin American) are supported AdSense languages. (A) |
| Is Spanish “underserved”? | **No for generic ROI** — many Spanish calculators exist. (B) |
| Is there still an opportunity? | **Yes for a coherent multi-vertical Spanish calculator platform** — specialized coverage is fragmented; few peers match ROIcalculator.live’s cluster depth across Real Estate + SaaS + Solar + 3D printing. (B/C) |
| Is the “Tier 2 / Tier 3 countries have fewer calculators” hypothesis supported? | **No** — unsupported as framed; replace with a language + fragmentation + specialization model. (D) |
| First architecture | **`/es/` + `hreflang="es"`** (language-wide Spanish). Do **not** use `es-419` as an hreflang code — Google documents it as unsupported. (A) |
| First pilot size | **1 hub + 4 calculators** (generic ROI + Real Estate rental + SaaS CAC/LTV + 3D service pricing). (D) |

**What Spanish is not:** an empty market waiting for the first ROI calculator.  
**What Spanish can be:** a defensible second language surface for a platform that already has specialized, trustworthy, multi-vertical calculator UX — if quality-controlled and small.

---

## 2. Baseline Repository State

| Check | Result |
|-------|--------|
| `git rev-parse HEAD` | `3e1a457e0b3fd00c503bd0ed291dfe981db179dc` |
| `git rev-parse origin/main` | `3e1a457e0b3fd00c503bd0ed291dfe981db179dc` |
| HEAD == origin/main | **Yes** |
| Working tree before Phase 11 | **Clean** |
| Phase 10 complete | **Yes** (`c6a79a3` migration + `3e1a457` report) |

**Phase 11 permitted artifact:** this report under `reports/audits/` only. No production HTML/CSS/JS/schema/sitemap/robots/redirect/navigation changes.

---

## 3. Current ROIcalculator.live Internationalization Readiness

### 3.1 Inventory (A)

| Metric | Count / pattern |
|--------|-----------------|
| Interactive calculators | **29** |
| Published HTML pages (excl. templates/partials) | **~71** |
| Sitemap URLs | **68** (`sitemap.xml`) |
| Shared CSS | **1** — `assets/css/styles.css` (Phase 9/10 design system classes already present) |
| Shared JS modules | **16** under `assets/js/` |
| Factory calculators | **10** via `data/calculators.json` + `scripts/generate-calculators.mjs` |
| `lang` | Universal `lang="en"` |
| `hreflang` | **0** |
| Schema `inLanguage` | **0** |
| `WebApplication` / `SoftwareApplication` | **0** in static HTML |
| Primary schema types | `WebPage`, `FAQPage`, `BreadcrumbList`, some `CollectionPage` / `Article` / `Organization`; Dataset injected client-side by engine |

### 3.2 Verticals (A)

| Vertical | Status |
|----------|--------|
| Generic ROI | Homepage calculator |
| Real Estate | Hub + cap rate + cash-on-cash + flip |
| SaaS | Hub + CAC/LTV + subscription growth + time-to-value |
| Solar / energy | Solar ROI + EV charger + heat pump |
| Marketing | Hub + ROAS + lead-gen + factory marketing tools |
| HVAC / HR | Standalone calculators |
| 3D printing | Hub + Business ROI + Print Farm ROI + Service Pricing |
| Factory ops/finance | Equipment, working capital, warehouse, AI tool, training, logistics |

### 3.3 URL / chrome / canonical (A)

- Mixed pattern: directory hubs (`/saas/`, `/real-estate/`, `/3d-printing/`) and `.html` tools.
- Canonical origin: `https://roicalculator.live` (`scripts/site-config.mjs`).
- Global chrome: `scripts/site-chrome.mjs` (English labels).
- Redirects: `_redirects` (apex HTTPS + consolidations). No locale prefixes today.

### 3.4 Currency / numbers / units (A)

- Currency display: hardcoded `$` prefix in engines (`calculator-engine.js` and vertical JS). Word “USD” rarely used; dollar symbol implies US framing.
- Numbers: `toLocaleString(undefined, …)` — **browser locale**, not forced `en-US`.
- Units: domain-specific (kWh, grams, hours, SEER-style efficiency, months). US/energy framing in solar/HVAC content.
- PDF: `assets/js/pdf-export.js` — English contract (`Download PDF`, English section headings via `getCalculatorPdfData()`). ~16 pages wired.

### 3.5 Language assumptions (A)

- Entire product assumes English editorial, English nav, English result interpretations, English FAQ.
- Generator hardcodes `lang="en"`.
- **No i18n framework, dictionaries, or locale routers exist.**

### 3.6 Readiness verdict (D)

Internationalization is **feasible without a framework migration**, but **not plug-and-play**. Localization requires separating labels/copy/PDF/schema from calculation logic, adding `/es/` URL trees, and introducing reciprocal `hreflang` + localized chrome — all in a future implementation phase.

---

## 4. Spanish Search Landscape

### 4.1 Method limits (A)

This phase used web search + direct page fetches. **No third-party keyword-volume tool was available.** Therefore:

- No CPC / monthly search volume claims.
- SERP competitor presence = **directional evidence only**.
- External keyword-tool validation (e.g., Google Keyword Planner, Search Console after pilot) is required before scaling beyond Phase 12.

### 4.2 Query families investigated (directional) (B)

| Family | Example queries | Directional finding |
|--------|-----------------|---------------------|
| Generic ROI | `calculadora ROI`, `calculadora de retorno de inversión`, `ROI calculadora`, `retorno de inversión` | Crowded: education sites, agencies, OmniCalculator, tool sites |
| Business / SaaS | `CAC`, `LTV`, `periodo de recuperación`, SaaS | Strong educational content (Stripe ES/MX); fewer polished Spanish interactive multi-metric calculators |
| Real estate | `ROI inmobiliario`, `rentabilidad inmobiliaria`, `rentabilidad alquiler` | Strong Spain + LatAm content; bank/blog calculators and listing-adjacent tools |
| Solar | `rentabilidad paneles solares`, `periodo de recuperación solar`, `amortización fotovoltaica` | Dense Spain-focused tools (autoconsumo, subsidies, RD framing) |
| 3D printing | `calculadora impresión 3D`, `coste impresión 3D`, `ROI impresora 3D`, `granja impresión 3D` | Niche but real Spanish tools exist (pricing + some ROI) |
| Marketing | `ROAS`, `retorno de la inversión publicitaria` | Acronym ROAS widely retained; Spanish explainers + some calculators |

### 4.3 Landscape summary (C/D)

Spanish search is **not empty**. It is **split** across:

1. Global calculator platforms with Spanish locales (e.g., OmniCalculator).
2. Local education / academy sites with simple ROI widgets.
3. Vertical specialists (banks for housing; solar installers/tools for PV; print-farm SaaS for 3D).
4. English SaaS metrics content partially localized.

**Fragmentation ≠ absence.** Opportunity is platform coherence + specialized trust, not “first mover on calculadora ROI.”

---

## 5. Spanish Generic ROI Competition

| Competitor | URL | Notes | Quality (observed) |
|------------|-----|-------|--------------------|
| INEAF | https://www.ineaf.es/calculadoras-financieras/calculadora-roi | Spain education brand; interactive ROI; EUR examples; lead-gen framing | Medium — clear copy, simple tool |
| BusinessGo | https://businessgo.es/calculadora-roi/ | Agency ROI/ROMI/ROAS explainer + calculator | Medium — marketing-oriented |
| OmniCalculator (ES) | https://www.omnicalculator.com/es/finanzas/roi | Full Spanish article + calculator; global platform | High depth; some bilingual UI residue observed |
| CalculatorLib | https://calculatorlib.com/es/return-on-investment-calculator | Spanish ROI tool page | Medium |
| haz.tools | https://haz.tools/h/calculadora-roi | Spanish ROI + annualized discussion | Medium |
| Online Zebra | https://onlinezebra.com/calcular-roi/ | Marketing ROI calculator | Thin–medium |
| HubSpot ES | https://www.hubspot.es/roi-calculator/marketing | Product ROI for HubSpot, not generic | Commercial / gated |

**Verdict (B/D):** Generic Spanish ROI is **competitive**, not underserved. A Spanish homepage calculator is still useful as a **cluster entry / hub tool**, but it is a weak sole differentiation bet.

---

## 6. Spanish Specialized Calculator Competition

### 6.1 Real estate (B)

| Competitor | URL | Type |
|------------|-----|------|
| Bankinter blog calculator | https://www.bankinter.com/blog/finanzas-personales/calculadora-rentabilidad-alquiler | Interactive rental yield (bruta/neta/ROE) — Spain/EUR |
| Bankinter buy-vs-rent simulator | https://www.bankinter.com/banca/recursos-financieros/sobre-hipotecas/simulador-comprar-alquilar-vivienda | Decision simulator |
| AH Bienes Raíces Mx | https://ahbienesraices.mx/calculadora/roi | MX rental ROI widget |
| InBest | https://inbest.app/ | Idealista Chrome extension for yield |
| Class.com.mx / Prinex articles | class.com.mx, prinex.com | Educational formulas; not full platforms |

**Gap vs ROIcalculator.live:** Spanish RE tools are strong as **single-purpose** bank/blog widgets. Fewer independent platforms combine rental ROI + cap rate + cash-on-cash + flip in one private, ad-light, methodology-backed cluster.

### 6.2 Solar / energy (B)

| Competitor | URL | Orientation |
|------------|-----|-------------|
| SolarCalculatorHQ ES | https://solarcalculatorhq.com/es/calculators/solar-panel-payback-calculator/ | Spain payback / IBI / RD 244/2019 |
| Calculy | https://calculy.org/es/calculadora-solar/ | Spain autoconsumo, VAN/TIR |
| CalculaBien | https://www.calculabien.es/calculadoras/gastos-y-consumos/amortizacion-paneles-solares/ | Spain amortization |
| CalcKit | https://calc-kit.com/es/calculadora-solar | Generic ES solar ROI |

**Gap:** Solar Spanish search is **Spain-regulatory dense**. A global-Spanish solar page that ignores autoconsumo/excedentes risks looking under-localized for ES users while remaining too Spain-specific for MX/CO/AR. **High localization complexity → weak Phase 12 pilot candidate.**

### 6.3 SaaS / business metrics (B)

| Competitor | URL | Notes |
|------------|-----|-------|
| Stripe MX/ES resources | https://stripe.com/mx/resources/more/cac-in-saas | Strong education; not a multi-tool ROI site |
| Simúlalo | https://simulalo.app/es/simulador/saas/cac-vs-ltv | Spanish CAC/LTV simulator (apps/SaaS) |
| DashThis ES KPI pages | https://es.dashthis.com/kpi-examples/ltv-cac/ | Educational |
| FounderPath / Wall Street Prep | English-first tools | Appear in bilingual SERPs |

**Gap:** Interactive Spanish SaaS unit-economics tools exist but are **sparse**. English acronyms (CAC, LTV) remain standard. Good fit for ROIcalculator.live’s existing CAC/LTV tool with Spanish shell.

### 6.4 3D printing (B)

| Competitor | URL | Notes |
|------------|-----|-------|
| PrintCal.co ES | https://printcal.co/es/calculadora-3d/ | Cost / price / margin + farm ops product |
| JJLMoya | https://www.jjlmoya.es/utilidades/calculadora-roi-granja-impresion-3d/ | Dedicated print-farm ROI simulator (ES) |
| PEA3D | https://pea3d.com/es/calculadora-amortizacion-impresora-3d-roi/ | Printer amortization / ROI |

**Gap:** Niche Spanish tools exist, especially pricing and farm ROI. ROIcalculator.live’s **three-tool cluster** (business / farm / service pricing) remains a coherent differentiation angle if localized carefully — not “no competitors.”

### 6.5 Marketing (B)

ROAS retained as acronym; Spanish pages explain “retorno de la inversión publicitaria.” Agency calculators exist (e.g., Vicente Ferrer ROAS page). Competitive but shallow vs a full marketing cluster.

---

## 7. Spain vs Latin America

### 7.1 Markets considered (A/C)

Spain, Mexico, Argentina, Colombia, Chile, Peru, US Spanish audience, plus broader LatAm usage.

### 7.2 Findings

| Topic | Finding | Class |
|-------|---------|-------|
| Shared terms | `ROI`, `retorno de la inversión`, `rentabilidad`, `calculadora`, `margen`, `CAC`, `LTV`, `ROAS` travel well | B |
| Spain-leaning | `amortización` (payback), `IBI`, `autoconsumo`, `excedentes`, EUR framing, `vosotros` in informal copy | B |
| LatAm-leaning | `pesos`, country tax/notary concepts, `ustedes`, MX decimal point convention | B/C |
| US Spanish | Often USD + US business assumptions; may prefer English metric names | C |
| Currency dependencies | High for solar incentives & RE taxes; **low for pure ROI/CAC math** | A/C |
| Single `/es/` cluster viable? | **Yes for pilot** if currency-neutral math + neutral terminology + no country tax engines | D |
| Country folders now? | **No** — insufficient evidence to justify `/es-mx/`, `/es-es/` trees at launch | D |

### 7.3 Recommendation (D)

Target **Spanish as a language market**, not “Tier-2 countries,” and not Spain-only geotargeting, for Phase 12. Country forks only after Search Console + terminology evidence show persistent mismatch.

---

## 8. Spanish Terminology Findings

Natural terms observed on Spanish pages (B):

| English concept | Natural Spanish (preferred) | Notes |
|-----------------|-----------------------------|-------|
| ROI calculator | **Calculadora de ROI** / **calculadora de retorno de la inversión** | “ROI” acronym widely kept |
| Return on investment | **retorno de la inversión** / **retorno sobre la inversión** | Both appear |
| Profitability | **rentabilidad** | Dominant in RE |
| Real estate ROI | **ROI inmobiliario** / **rentabilidad inmobiliaria** | Both |
| Rental yield | **rentabilidad del alquiler** (bruta/neta) | Spain bank language |
| Cap rate | **tasa de capitalización** | Less everyday than “rentabilidad bruta” |
| Cash-on-cash | **rentabilidad sobre el capital aportado** / **ROE** (in Bankinter sense) / **retorno sobre efectivo** | Needs careful localization — do not blindly say “cash-on-cash” |
| Payback | **periodo de recuperación** / **periodo de amortización** | Spain often “amortización” |
| Markup / margin | **margen** / **margen de beneficio** | |
| Solar payback | **amortización** / **periodo de retorno** | Spain-heavy |
| 3D print cost | **coste** (ES) / **costo** (LatAm) | Dual form issue |
| 3D farm | **granja de impresión 3D** | Attested |
| Ad spend return | **ROAS** / **retorno de la inversión publicitaria** | Acronym retained |

**Pilot editorial rule (D):** Prefer internationally intelligible Latin American–neutral Spanish (`ustedes`, `costo` with parenthetical tolerance, keep finance acronyms), avoid Spain-only legal terms unless page is Spain-specific.

---

## 9. Generic ROI Opportunity

| Dimension | Assessment | Class |
|-----------|------------|-------|
| Demand signal | Directional — many Spanish tools ranking for calculadora ROI | B |
| Competition | **High** | B |
| Differentiation | Weak if only a two-input widget | C |
| Hub value | **High** — natural Spanish entry + internal link apex | D |
| Should it be first page? | **Yes as pilot entry**, not as sole product | D |

**Conclusion:** Build Spanish generic ROI **because of architecture**, not because the SERP is empty.

---

## 10. Vertical Opportunity Analysis

| Vertical | Intent fit | Competition | Localization complexity | Platform fit | Pilot priority |
|----------|------------|-------------|-------------------------|--------------|----------------|
| Real Estate | High | Medium–high (banks) | Medium (terminology) | Strong existing cluster | **High** |
| SaaS | High for startups | Medium–low interactive ES | Low (acronyms travel) | Strong | **High** |
| 3D Printing | Niche commercial | Medium niche | Medium (`coste/costo`) | Strong unique cluster | **High** |
| Marketing / ROAS | High | Medium | Low | Good | Medium (Phase 12b+) |
| Solar | High in ES | High + regulatory | **High** | Strong EN, weak portable ES | **Defer** |
| HVAC / HR | Unclear ES demand | Unknown | Medium | Secondary | Defer |

**Recommended strategy (D):** **C — generic + one specialized vertical in the same pilot wave**, actually **generic + three specialized tools from two/three verticals** that already exist in English and share low regulatory risk: Real Estate rental, SaaS CAC/LTV, 3D service pricing.

Not A (generic-only). Not B (specialized-only without hub). Not solar-first.

---

## 11. Demand / Search Intent Model

| Intent | Example | Value to ROIcalculator.live | Notes |
|--------|---------|-----------------------------|-------|
| 1. Informational | `qué es ROI` | Medium | Needs unique methodology depth; avoid thin glossary clones |
| 2. Direct calculator | `calculadora ROI` | High | Entry point; crowded |
| 3. Specialized calculator | `calculadora rentabilidad alquiler`, `calculadora ROI impresión 3D` | **Highest** | Best product-market fit |
| 4. Business decision | `calcular rentabilidad inversión` | High | Aligns with interpretation/results UX |
| 5. Commercial/service | `precio impresión 3D rentable` | High for 3D pricing tool | Monetization via ads/trust, not lead-gen spam |

**Do not treat informational traffic as equal to calculator intent** for gating success (D).

---

## 12. Competitor Comparison

### Platform-level contrast (C/D)

| Attribute | Typical Spanish competitor | ROIcalculator.live (EN today) | Spanish opportunity |
|-----------|----------------------------|-------------------------------|---------------------|
| Multi-vertical depth | Rare | Strong | Differentiate |
| Private / local calc | Mixed | Strong privacy posture | Preserve |
| Methodology / FAQ | Uneven | Strong on mature tools | Localize, don’t strip |
| Design system | Uneven | Phase 9/10 system | Reuse |
| PDF export | Rare | Native print PDF | Localize later |
| Country regulation baked in | Common in solar/RE banks | Currency-agnostic formulas | Prefer formula-portable tools first |

**No competitor is labeled “dominant” without market-share data** — unavailable here. Observed pattern: **many adequate single tools, few coherent Spanish ROI platforms.**

---

## 13. Translation vs Localization Strategy

### Options

| Option | Verdict |
|--------|---------|
| A. Raw machine-translate 29+ pages | **REJECT** — scaled-content / low-value risk (A: Google spam policies list automated translating among scaled-content examples when little value is added) |
| B. Professional translation only | Acceptable quality, but insufficient if examples/currency/units stay US-English |
| C. Spanish-native shells on shared engines | **Preferred core** |
| D. Hybrid | **Recommended:** MT draft → human editorial localization → shared JS engines |

### Google policy (A)

From Google Search spam policies (Scaled content abuse): generating many pages via automated transformations **including translating**, where little value is provided, is an example of abuse. AI/MT is not automatically spam, but **low-value bulk translation is a risk**.

From multilingual docs: use different URLs per language; mark alternates; make language obvious; avoid auto-redirect by perceived language.

### What “localized” means here (D)

Must localize: title, subtitle, labels, explanatory copy, examples, FAQ, result interpretation, metadata, schema text, PDF strings, disclaimers, `lang`, visible currency symbol policy, internal links.

Must **not** casually change: formulas, default numeric scenarios without QA parity checks, AdSense config, English URLs.

**Reject:** “translate 100 pages and publish.”

---

## 14. Currency Strategy

| Option | Pilot fit |
|--------|-----------|
| A. Currency-neutral inputs (no FX) | **Yes — baseline** |
| B. Force USD | Confusing on `/es/` |
| C. Default EUR | Acceptable for Spain-leaning UX; alienates MX/CO if exclusive |
| D. Default MXN | Same problem inverted |
| E. Currency selection (symbol only) | **Best MV** if cheap to implement |
| F. Geo default | Avoid (Google warns against IP-based adaptation for crawlability) |

**Minimum viable Spanish currency strategy (D):**

1. Formulas remain **currency-independent** (no live FX).
2. Display amounts with a **user-selectable symbol** (`€`, `$`, `MXN`, `ARS`, etc.) **or** a clearly labeled neutral prefix.
3. Copy states: figures are in “la moneda que indiques”; no conversion.
4. Do **not** invent country tax modules in Phase 12.

---

## 15. Number / Unit / Date Localization

| Topic | Finding | Pilot rule |
|-------|---------|------------|
| Decimal / thousands | Spain often `1.234,56`; Mexico often `1,234.56`; Fundéu notes both decimal comma and point are acknowledged; recommends space for thousands | Use `Intl.NumberFormat` with an **explicit** locale choice documented in QA; prefer one pilot default (`es-ES` **or** neutral space+comma) and state the convention on-page |
| Percents | `12,5 %` vs `12.5%` | Match chosen number locale |
| Currency display | Symbol placement varies | Follow `Intl` currency style for selected code |
| Dates in PDF | Month names must be Spanish | `toLocaleDateString('es', …)` |
| Units | Metric common in ES/LatAm; US Spanish may still use mixed business units | Keep calculator units as in English math; translate labels only; no imperial conversion layer in pilot |
| US Spanish | May still think in USD | Covered by currency symbol choice |

**Controlled approach (D):** one Spanish formatting policy for pilot + short help note; no country microsites for separators.

---

## 16. Google SEO / hreflang Requirements

### Authoritative rules (A)

Sources: [Localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions), [Managing multi-regional and multilingual sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites).

Requirements for a future Spanish page that is an alternate of an English page:

1. **Distinct URL** (e.g., `/es/...`) — not cookie-only language.
2. **Self-canonical** to its own Spanish URL.
3. **Reciprocal `hreflang`** on EN ↔ ES (each lists self + alternate).
4. **`hreflang="es"`** for language-wide Spanish; add `es-ES` / `es-MX` only if truly region-specific pages exist.
5. **`x-default`** → English homepage or language-neutral entry (English site today is the practical default).
6. Fully-qualified HTTPS URLs in annotations.
7. Do **not** auto-redirect users by guessed language.
8. Provide visible language switch links.
9. **Critical:** Google documents that codes like **`es-419` are not supported** for hreflang. Do not use `hreflang="es-419"`.

### Architecture choice (D)

| Option | Path | hreflang | Verdict |
|--------|------|----------|---------|
| A | `/es/` | `es` | **Recommended** |
| B | `/es-419/` | would want `es-419` | **Reject for hreflang**; folder alone doesn’t fix invalid code |
| C | `/es-es/` | `es-ES` | Premature geotarget; maintenance↑ |
| D | Other | — | Subdomain `es.` possible but unnecessary on Cloudflare Pages static site |

### Sitemap (D)

Phase 12: either extend `sitemap.xml` with xhtml `hreflang` annotations **or** keep HTML link tags as source of truth (Google treats methods as equivalent; pick one primary). Add Spanish URLs to sitemap only when indexable.

### Schema (D)

Localize `name`/`description`/`FAQ` text; set `inLanguage: "es"` where used; keep types aligned with English counterparts (`WebPage`, `FAQPage`, `BreadcrumbList`). No new speculative types.

---

## 17. AdSense / Monetization Considerations

### Verified (A)

- AdSense supported languages include **Spanish (European)** and **Spanish (Latin American)**.  
  Source: https://support.google.com/adsense/answer/9727
- Publisher policies require primary content in a supported language.  
  Source: https://support.google.com/adsense/answer/10502938
- Multilingual sites can receive ads in the appropriate language when approved.

### Site context (A)

Current QA scripts assert **no AdSense scripts** on several 3D-printing pages; AdSense configuration must not be changed in Phase 11. Monetization readiness is **policy-compatible**, not a revenue forecast.

### Qualitative monetization view (C/D)

- Spanish pages can participate in AdSense if content is substantial and supported-language.
- No evidence that Spanish RPM is inherently better/worse than English for this niche.
- Thin translated pages risk both Search quality **and** ad quality perceptions.
- Calculator pages with real explanatory depth + FAQ remain the monetization-compatible pattern.

**No revenue projections claimed.**

---

## 18. Scaled-Content / Quality Risk

### Risk of translating everything at once (D)

Publishing `/es/` + ~29 calculators + hubs + learn/comparisons simultaneously would create:

- Thin localized pages (HIGH risk)
- Near-duplicate EN/ES pairs without unique value (HIGH)
- Index bloat (MEDIUM)
- Maintenance burden (HIGH)
- hreflang error surface (HIGH)

### Controlled methodology (D)

1. Pilot 4 calculators + 1 hub.
2. Human editorial pass mandatory.
3. Shared engines; no formula forks.
4. Index, measure, then expand by vertical.
5. Never ship unreviewed MT dumps.

---

## 19. Proposed Spanish URL Architecture

**Minimum viable — no empty category folders.**

```
/es/                                    → Spanish hub (lists only live Spanish tools)
/es/calculadora-roi.html                → Generic ROI (alternate of /)
/es/inmobiliario/                       → Only if ≥2 RE tools live; else skip
/es/inmobiliario/calculadora-rentabilidad-alquiler.html
/es/saas/calculadora-cac-ltv.html       → Flat under /es/saas/ only when needed
/es/impresion-3d/calculadora-precio-servicio.html
```

**Phase 12 concrete map (recommended):**

| Spanish URL | English alternate | Notes |
|-------------|-------------------|-------|
| `/es/` | (new hub; EN hub analogue is site home + vertical hubs) | Spanish-only hub OK without EN duplicate |
| `/es/calculadora-roi.html` | `/` (homepage calculator) | Entry |
| `/es/inmobiliario/calculadora-rentabilidad-alquiler.html` | `/real-estate/` (rental calculator) | Or `/real-estate/index.html` |
| `/es/saas/calculadora-cac-ltv.html` | `/roi-calculator/saas/cac-ltv-roi.html` | |
| `/es/impresion-3d/calculadora-precio-servicio.html` | `/3d-printing/service-pricing-calculator.html` | |

Avoid creating `/es/solar/` until a portable (non-RD-244-specific) solar page is justified.

Slug language: **Spanish slugs recommended** for clarity to users; keep stable and documented in redirects if EN-style slugs preferred operationally.

---

## 20. Proposed Internal Linking Architecture

```
/es/ ──► each Spanish calculator
Spanish calculator ──► /es/ + Spanish siblings in same vertical
Spanish calculator ──► Spanish “cómo se calcula” section on same page (not thin separate posts at first)
EN ↔ ES ──► reciprocal hreflang + visible “English / Español” switch in header/footer for paired pages
Cross-language body links ──► sparingly; prefer switcher + hub
EN nav ──► unchanged in Phase 12 except optional language switcher on paired pages
ES nav ──► Spanish labels; links only to live `/es/` URLs (no orphan nav items)
```

Do not weave Spanish into English Learn/Benchmarks in Phase 12 unless a dedicated content task is scoped.

---

## 21. Proposed Schema Architecture

| Type | Future Spanish rule |
|------|---------------------|
| `WebPage` | Required; Spanish `name`/`description`; `inLanguage: "es"` |
| `FAQPage` | Only if visible Spanish FAQ matches JSON-LD exactly (existing EN discipline) |
| `BreadcrumbList` | Spanish names; URLs under `/es/` |
| `CollectionPage` | Spanish hub only |
| `WebApplication` | Do not introduce unless EN also adopts it |
| Canonical | Self-canonical Spanish URL |
| Relationship to EN | `hreflang` handles alternates; do not cross-canonicalize EN↔ES |

---

## 22. Proposed Technical i18n Architecture

### Options

| Approach | Fit |
|----------|-----|
| A. Duplicated static HTML | Works short-term; formula drift risk if JS copied |
| B. Shared engine + localized HTML shells | **Recommended** |
| C. Content data + dictionaries | Good mid-term evolution of B |
| D. Build-time localization framework | Unnecessary for first language |
| E. Full app framework migration | **Reject** for Spanish alone |

### Recommended boundary (D)

```
[Shared JS engines]  ← formulas, validation, URL state
        ↑
[Locale presentation adapters]  ← formatMoney, formatPercent(locale), PDF strings
        ↑
[Localized HTML shells / JSON copy packs]  ← titles, labels, FAQ, interpretations
```

- Factory path (`generate-calculators.mjs`) should gain a locale parameter **later**; Phase 12 may hand-author 4 shells to match 3D-printing hand-authored quality.
- Chrome: extend `site-chrome.mjs` with Spanish variant **or** page-local Spanish header for `/es/*` only.
- Preserve Cloudflare Pages static hosting.

### Scale to FR/PT later (C)

Dictionary packs + shell generation can add languages without rewriting math — **if** Phase 12 establishes the boundary cleanly.

---

## 23. PDF Localization Requirements

When Spanish PDF is enabled (may trail HTML launch):

- Localized document title
- Localized section headings (`Entradas`, `Resultados`, etc.)
- Localized labels matching on-page fields
- Localized disclaimer (informational, not advice)
- Number/currency formatting per Spanish pilot policy
- Keep browser `print()` mechanism (`pdf-export.js`); pass Spanish strings via `getCalculatorPdfData()`

Do not implement in Phase 11.

---

## 24. Recommended First Spanish Pilot

**Authorize Phase 12: Spanish Pilot Implementation** with:

1. `/es/` hub  
2. `/es/calculadora-roi.html`  
3. `/es/inmobiliario/calculadora-rentabilidad-alquiler.html`  
4. `/es/saas/calculadora-cac-ltv.html`  
5. `/es/impresion-3d/calculadora-precio-servicio.html`  

**Out of pilot:** solar, full RE cluster (cap rate/CoC/flip), marketing factory set, learn/benchmarks mass translation, country folders, FX API, AdSense changes.

---

## 25. Pilot Calculator Scoring

Scoring: 1–5 per criterion. Higher = better pilot choice. **Directional**, not volume-based.

| Candidate | ES intent | Fragmentation | Usefulness | Diff vs ES SERP | L10n complexity (invert) | Math stability | Existing quality | Linking | Monetization fit | **Total** |
|-----------|-----------|---------------|------------|-----------------|--------------------------|----------------|------------------|---------|------------------|-----------|
| Generic ROI | 5 | 2 | 4 | 2 | 5 | 5 | 5 | 5 | 4 | **37** |
| RE rental profitability | 5 | 3 | 5 | 3 | 3 | 5 | 5 | 4 | 4 | **37** |
| SaaS CAC/LTV | 4 | 4 | 5 | 4 | 5 | 5 | 5 | 3 | 4 | **39** |
| 3D service pricing | 4 | 4 | 5 | 4 | 3 | 5 | 5 | 4 | 3 | **37** |
| 3D business ROI | 3 | 4 | 4 | 4 | 3 | 5 | 5 | 4 | 3 | **35** |
| 3D print farm | 3 | 3 | 4 | 3 | 3 | 5 | 5 | 4 | 3 | **33** |
| Marketing ROAS | 4 | 3 | 4 | 3 | 5 | 5 | 4 | 3 | 4 | **35** |
| Solar ROI | 4 | 2 | 5 | 2 | **1** | 4 | 5 | 3 | 4 | **30** |
| Cap rate | 3 | 3 | 4 | 3 | 2 | 5 | 5 | 3 | 3 | **31** |

**Pilot selection:** Generic ROI + RE rental + SaaS CAC/LTV + 3D service pricing (top coherent set forming a mini-platform).

**Why service pricing over farm:** clearer commercial intent (“precio/costo”), slightly broader audience than farm ROI, pairs with PrintCal-like demand without cloning PrintCal’s ops suite.

---

## 26. Rollout / Gating Strategy

### Stage 1 — Pilot (Phase 12)

Ship 5 URLs. Manual QA + production verify.

### Stage 2 — Expand Spanish cluster

Add siblings only after gates (no invented numeric thresholds):

| Gate | Evidence source |
|------|-----------------|
| Indexation | Google Search Console coverage for `/es/` |
| Hreflang validity | GSC International targeting / URL inspection |
| Impressions & queries | GSC — presence of calculator-intent queries |
| Engagement | Analytics: calculate clicks, dwell, PDF use if enabled |
| Quality review | Human editorial checklist pass |
| Crawlability | Internal links from `/es/` reach all tools |
| AdSense (if enabled later) | Policy-safe primary language; no thin-ad pages |
| Defect rate | No formula regressions vs English defaults |

### Stage 3 — Next language evaluation

Only after Stage 2 shows durable calculator intent — apply §27 framework. Do not pre-commit to French/Portuguese/etc.

---

## 27. Future Language Selection Framework

Score candidate languages on:

1. Search market size (external data required)  
2. Calculator intent vs informational  
3. Competitive fragmentation  
4. Localization complexity (script, currency, regulation)  
5. AdSense language support  
6. Geographic spread vs single-country lock-in  
7. Fit to existing verticals  

**Spanish is first because** of large cross-border language market + observed specialized fragmentation + AdSense support — **not** because of a Tier-2 GDP narrative.

Next-language candidates should be re-scored with data; **no automatic queue**.

---

## 28. Tier 2 / Tier 3 Hypothesis — Verdict

**Verdict: NOT SUPPORTED as originally framed.**

Reasons (D grounded in B/A):

1. Spanish includes **Spain** (EU, high calculator sophistication) and large LatAm economies — “Tier 3 scarcity” is a poor proxy.  
2. Generic ROI calculators **already exist** widely in Spanish.  
3. Opportunity correlates better with **specialization gaps** and **platform coherence** than with country income tiers.  
4. Country GDP does not measure SERP competition or AdSense viability.

**Replacement model:** language market × intent × fragmentation × localization cost × monetization policy fit × maintenance cost.

---

## 29. Risk Register

| Risk | Severity | Mitigation |
|------|----------|------------|
| Bulk MT / scaled content | **HIGH** | Tiny pilot; human edit; no mass publish |
| Wrong terminology (coste/costo, amortización) | **HIGH** | Terminology table + native review |
| hreflang errors / missing returns | **HIGH** | Reciprocal tags QA script |
| Canonical mistakes (ES pointing to EN) | **HIGH** | Self-canonical only |
| Currency confusion | **MEDIUM** | Neutral math + symbol labeling |
| Country-specific assumptions (solar/tax) | **HIGH** if solar early | Defer solar |
| Index bloat | **MEDIUM** | Staged URLs |
| Maintenance duplication | **HIGH** | Shared engines |
| Inconsistent calculator behavior EN/ES | **HIGH** | Shared JS + parity QA |
| PDF English-only on ES pages | **MEDIUM** | Localize PDF strings before advertising PDF |
| Schema/FAQ mismatch | **MEDIUM** | Existing FAQ discipline |
| Weak Spanish internal links | **MEDIUM** | Hub-first IA |
| Insufficient content depth | **HIGH** | Full methodology/FAQ per pilot page |
| AdSense on thin pages | **MEDIUM** | Substantial copy required |
| `es-419` misuse | **HIGH** | Use `hreflang="es"` |

---

## 30. Recommended Phase 12

### Title

**PHASE 12 — Spanish Pilot Implementation**

### Scope

Implement **only** the five URLs in §24, plus:

- Reciprocal `hreflang` on the four English alternates + Spanish pages + `x-default` strategy  
- Spanish hub chrome/nav subset  
- Shared-engine wiring (no formula changes)  
- Currency symbol policy per §14  
- Number formatting policy per §15  
- Localized schema/FAQ for pilot pages  
- Sitemap entries for new URLs  
- QA parity: English default numeric results unchanged; Spanish pages produce equivalent math  
- Production verification with cache-busting  

### Exact localization rules

1. Human-reviewed Spanish (hybrid MTPE allowed for draft only).  
2. Neutral LatAm-intelligible Spanish; keep ROI/CAC/LTV/ROAS acronyms.  
3. No live FX.  
4. No country tax modules.  
5. No auto language redirect.  
6. Visible EN/ES switch on paired pages.  
7. Do not translate Learn/Benchmarks/Comparisons mass content.  
8. Do not alter AdSense configuration unless a separate monetization task authorizes it.

### Exact hreflang model

```
hreflang="en"       → English URL
hreflang="es"       → Spanish URL
hreflang="x-default"→ English URL (current default experience)
```

### Exact QA requirements (minimum)

- Source: only `/es/` pilot files + necessary EN head tags for hreflang + sitemap  
- Calculator parity vs English engines  
- Mobile nav on `/es/`  
- Overflow viewports 1440 / 1024 / 390 / 320  
- hreflang reciprocity validator  
- Canonical self-checks  
- No production changes outside scoped files  

### SEO requirements

- Unique Spanish titles/descriptions  
- `lang="es"`  
- Indexable 200s  
- Internal links from `/es/`  
- Substantial on-page explanations (not label-only shells)

### Production verification

- Fetch live `/es/` URLs with cache-bust  
- Confirm hreflang present  
- Confirm calculators compute  
- Confirm no EN regression  

**Do not start Phase 12 in this phase.**

---

## 31. Final Director Recommendation

**GO — controlled Spanish pilot. NO-GO — bulk Spanish translation.**

Answers to mandatory questions:

1. **Technically feasible?** Yes.  
2. **SEO-coherent?** Yes with `/es/` + reciprocal hreflang + quality localization.  
3. **AdSense-compatible?** Yes (Spanish EU & LatAm supported); no revenue guarantee.  
4. **Underserved or fragmented?** **Fragmented; generic ROI is not underserved.** Opportunity = coherent specialized platform.  
5. **Tier 2/3 hypothesis?** **Unsupported.**  
6. **Global Spanish vs countries?** **Global `/es/` language pilot first.**  
7. **First URL?** **Spanish hub + generic ROI as entry; not specialized-only.**  
8. **Pilot calculators?** Generic ROI, RE rental profitability, SaaS CAC/LTV, 3D service pricing (+ hub).  
9. **URL architecture?** `/es/` + Spanish slugs; no `es-419` hreflang.  
10. **Localization strategy?** Hybrid native shells + shared engines; reject raw MT scale.  
11. **What NOT to translate?** Full catalog, solar-regulatory pages, thin glossary floods, country clones.  
12. **What to localize?** All user-facing copy, FAQ, schema text, labels, examples, PDF strings, formatting.  
13. **Technical changes eventually required?** Locale shells, format helpers, chrome variant, hreflang, sitemap, optional copy JSON.  
14. **SEO safeguards before publish?** Reciprocal hreflang, self-canonical, substantial content, no auto-redirect, quality review.  
15. **Expansion gates?** Indexation + query intent + engagement + quality + parity — then add siblings.

---

## 32. Sources

| Source | URL | Accessed | Supports |
|--------|-----|----------|----------|
| Google Search Central — Localized versions | https://developers.google.com/search/docs/specialty/international/localized-versions | 2026-09-02 | hreflang, x-default, reciprocity; **es-419 unsupported** |
| Google Search Central — Multi-regional / multilingual | https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites | 2026-09-02 | Separate URLs, no language auto-redirect, geotargeting signals |
| Google Search — Spam policies (scaled content) | https://developers.google.com/search/docs/essentials/spam-policies | 2026-09-02 | Automated translating as scaled-content example when low value |
| Google AdSense — Supported languages | https://support.google.com/adsense/answer/9727 | 2026-09-02 | Spanish (European) & Spanish (Latin American) supported |
| Google Publisher Policies | https://support.google.com/adsense/answer/10502938 | 2026-09-02 | Unsupported-language restriction |
| FundéuRAE — puntos y comas en cifras | https://www.fundeu.es/consulta/puntos-y-comas-en-cifras-739/ | 2026-09-02 | Thousands/decimal guidance for Spanish |
| INEAF ROI calculator | https://www.ineaf.es/calculadoras-financieras/calculadora-roi | 2026-09-02 | ES generic ROI competitor |
| BusinessGo ROI | https://businessgo.es/calculadora-roi/ | 2026-09-02 | ES marketing ROI competitor |
| OmniCalculator ES ROI | https://www.omnicalculator.com/es/finanzas/roi | 2026-09-02 | Global platform Spanish ROI |
| Bankinter rentabilidad alquiler | https://www.bankinter.com/blog/finanzas-personales/calculadora-rentabilidad-alquiler | 2026-09-02 | ES RE calculator competitor |
| AH Bienes Raíces Mx ROI | https://ahbienesraices.mx/calculadora/roi | 2026-09-02 | MX RE ROI widget |
| PrintCal ES 3D calculator | https://printcal.co/es/calculadora-3d/ | 2026-09-02 | ES 3D pricing competitor |
| JJLMoya print farm ROI | https://www.jjlmoya.es/utilidades/calculadora-roi-granja-impresion-3d/ | 2026-09-02 | ES 3D farm ROI competitor |
| PEA3D printer amortization | https://pea3d.com/es/calculadora-amortizacion-impresora-3d-roi/ | 2026-09-02 | ES 3D ROI competitor |
| SolarCalculatorHQ ES | https://solarcalculatorhq.com/es/calculators/solar-panel-payback-calculator/ | 2026-09-02 | Spain-specific solar competition |
| Stripe CAC SaaS (MX) | https://stripe.com/mx/resources/more/cac-in-saas | 2026-09-02 | ES business education; CAC/LTV norms |
| Repository baseline | local git at `3e1a457` | 2026-09-02 | Phase 10 complete; i18n readiness inventory |

**Industry blogs about Google MT policy** were consulted only as secondary context; policy claims above rely on Google documentation.

---

## Appendix — Explicit claim hygiene

| Claim type | Example in this report |
|------------|------------------------|
| A Verified | `es-419` unsupported in Google hreflang docs; AdSense lists Spanish; repo has 29 calculators |
| B Observed | INEAF/Omni/Bankinter/PrintCal pages exist and offer Spanish calculator UX |
| C Inference | Platform coherence is the main gap vs single-purpose tools |
| D Recommendation | `/es/` pilot of 5 URLs; reject bulk MT |

**Search volume:** data unavailable — requires external keyword tooling / post-launch GSC.

---

**PHASE 11 — INTERNATIONALIZATION RESEARCH & SPANISH PILOT ARCHITECTURE COMPLETE.**

STOP. Do not begin Phase 12.
