#!/usr/bin/env node
/**
 * Phase 17 — Programmatic Calculator Factory
 * Reads data/calculators.json, emits /calculators/{slug}.html, category hubs, updates sitemaps.
 */
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import { validateConfigs } from './calculator-quality.mjs';
import { CANONICAL_ORIGIN, canonicalUrl, STYLESHEET_HREF } from './site-config.mjs';
import { syncRedirects } from './sync-redirects.mjs';
import {
  SITE_HEADER_HTML,
  SITE_FOOTER_HTML,
  calculatorBreadcrumbJsonLd,
  hubBreadcrumbJsonLd
} from './site-chrome.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DATA_PATH = path.join(ROOT, 'data', 'calculators.json');
const TEMPLATE_PATH = path.join(ROOT, 'templates', 'calculator-template.html');
const ARTICLE_TEMPLATE_PATH = path.join(ROOT, 'templates', 'article-template.html');
const OUT_DIR = path.join(ROOT, 'calculators');
const SITEMAP_XML = path.join(ROOT, 'sitemap.xml');
const SITEMAP_HTML = path.join(ROOT, 'sitemap.html');

/** Phase 18.1 — apex HTTPS only; never www in generated URLs */
const SITE = CANONICAL_ORIGIN;
const LASTMOD = '2026-04-08';
const LASTMOD_HTTP = 'Wed, 08 Apr 2026 12:00:00 GMT';

/**
 * Phase 1 remediation: header/footer markup is no longer duplicated here.
 * It is sourced from scripts/site-chrome.mjs, the single authoritative
 * chrome source (see reports/audits/AUDIT-05-ARCHITECTURE.md and
 * reports/audits/MASTER-DIAGNOSTIC.md). The local names are kept (with the
 * same leading-indent/trailing-newline shape the rest of this file already
 * expects) purely so the string-concatenation code below doesn't need to
 * change.
 */
const HTML_SITE_HEADER = '  ' + SITE_HEADER_HTML + '\n';
const HTML_SITE_FOOTER = '  ' + SITE_FOOTER_HTML + '\n';

const CATEGORY = {
  marketing: {
    label: 'Marketing',
    hubTitle: 'Marketing ROI calculators',
    hubDescription:
      'Programmatic marketing ROI calculators—consistent methodology, privacy-first, client-side math. Use the hub to jump to email, influencer, content, and general marketing ROI tools.'
  },
  finance: {
    label: 'Finance',
    hubTitle: 'Finance & capital calculators',
    hubDescription:
      'Finance-focused ROI views for equipment and working-capital style deployments. Pair with comparisons and benchmarks when you present to stakeholders.'
  },
  operations: {
    label: 'Operations',
    hubTitle: 'Operations calculators',
    hubDescription:
      'Operations ROI for automation, AI tooling, training, and logistics—estimate annual returns against implementation or program cost.'
  }
};

function escapeHtml(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function stripTags(s) {
  return String(s || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function jsonLdStringify(obj) {
  return JSON.stringify(obj, null, 2);
}

function buildInputs(inputs) {
  return (inputs || [])
    .map(function (inp) {
      var name = inp.name;
      var id = 'factory-inp-' + name;
      var def = inp.default != null ? inp.default : 0;
      var min = inp.min != null ? inp.min : 0;
      var step = inp.step != null ? inp.step : 1;
      return (
        '<div class="form-group">' +
        '<label for="' +
        escapeHtml(id) +
        '">' +
        escapeHtml(inp.label || name) +
        '</label>' +
        '<input type="number" id="' +
        escapeHtml(id) +
        '" name="' +
        escapeHtml(name) +
        '" value="' +
        escapeHtml(String(def)) +
        '" min="' +
        escapeHtml(String(min)) +
        '"' +
        (inp.max != null ? ' max="' + escapeHtml(String(inp.max)) + '"' : '') +
        ' step="' +
        escapeHtml(String(step)) +
        '">' +
        '</div>'
      );
    })
    .join('\n');
}

function buildOutputs(outputs) {
  var list = outputs || [];
  if (!list.length) return '';

  var primary = list[0];
  var secondary = list.slice(1);

  var dominant =
    '<div class="result-dominant">' +
    '<span class="result-dominant-label">' +
    escapeHtml(primary.label || primary.key) +
    '</span>' +
    '<span class="result-dominant-value" id="factory-out-' +
    escapeHtml(primary.key) +
    '">—</span>' +
    '</div>' +
    '<p class="result-interpretation" id="factory-result-interpretation" aria-live="polite"></p>';

  var gridInner = secondary
    .map(function (o) {
      return (
        '<div class="result-item result-card">' +
        '<span class="label">' +
        escapeHtml(o.label || o.key) +
        '</span>' +
        '<span id="factory-out-' +
        escapeHtml(o.key) +
        '" class="value">—</span>' +
        '</div>'
      );
    })
    .join('\n');

  var grid = secondary.length ? '<div class="results-grid results-box">' + gridInner + '</div>' : '';
  return dominant + grid;
}

function buildStaticBlocks(blocks) {
  return (blocks || [])
    .map(function (b) {
      return (
        '<section class="static-answer-block">' +
        '<h2>' +
        escapeHtml(b.heading || '') +
        '</h2>' +
        '<div class="static-block-body">' +
        (b.html || '') +
        '</div>' +
        '</section>'
      );
    })
    .join('\n');
}

function buildFaqHtml(faq) {
  return (faq || [])
    .map(function (item) {
      return (
        '<div class="faq-item">' +
        '<h3>' +
        escapeHtml(item.q) +
        '</h3>' +
        '<div class="faq-answer">' +
        (item.a || '') +
        '</div>' +
        '</div>'
      );
    })
    .join('\n');
}

function buildFaqJsonLd(faq) {
  var mainEntity = (faq || []).map(function (item) {
    return {
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: stripTags(item.a)
      }
    };
  });
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: mainEntity
  };
}

function shortTitle(title) {
  return String(title || '').replace(/\s+Calculator\s*$/i, '');
}

function embedConfig(calc) {
  var minimal = {
    title: calc.title,
    metaDescription: calc.metaDescription,
    formulas: calc.formulas,
    outputs: calc.outputs
  };
  return JSON.stringify(minimal).replace(/</g, '\\u003c');
}

function replaceAll(str, map) {
  var out = str;
  Object.keys(map).forEach(function (k) {
    out = out.split(k).join(map[k]);
  });
  return out;
}

function hubPathForCategory(key) {
  return '/' + String(key || 'marketing') + '/';
}

/** Phase 17.3 — seeded pseudo-random for reproducible builds */
function hashSlug(str) {
  var h = 5381;
  var s = String(str || '');
  for (var i = 0; i < s.length; i++) {
    h = (h << 5) + h + s.charCodeAt(i);
    h = h | 0;
  }
  return Math.abs(h);
}

/** Phase 17.7 — list items only for __RELATED_LINKS__ in template. */
function buildRelatedLinksHtml(calc, allCalculators) {
  var cat = CATEGORY[calc.category] || CATEGORY.marketing;
  var hub = hubPathForCategory(calc.category);
  var peers = allCalculators.filter(function (c) {
    return c.category === calc.category && c.slug !== calc.slug;
  });
  if (peers.length === 0) {
    return (
      '<li><a href="' +
      hub +
      '">More ' +
      escapeHtml(cat.label) +
      ' ROI calculators</a></li>'
    );
  }

  var h = hashSlug(calc.slug);
  var want = 3 + (h % 3);
  var count = Math.min(want, peers.length);

  var arr = peers.slice();
  var seed = h;
  function rand() {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  }
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(rand() * (i + 1));
    var t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }

  var picked = arr.slice(0, count);
  return picked
    .map(function (p) {
      return (
        '<li><a href="/calculators/' +
        encodeURIComponent(p.slug) +
        '.html">' +
        escapeHtml(p.title) +
        '</a></li>'
      );
    })
    .join('\n');
}

function generateCalculatorPage(template, calc, allCalculators) {
  var cat = CATEGORY[calc.category] || CATEGORY.marketing;
  var canonical = canonicalUrl('/calculators/' + calc.slug + '.html');
  var webpageLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: calc.title,
    description: calc.metaDescription,
    url: canonical,
    isPartOf: {
      '@type': 'WebSite',
      name: 'roicalculator.live',
      url: SITE + '/'
    }
  };

  var map = {
    __LASTMOD__: LASTMOD,
    __LASTMOD_HTTP__: LASTMOD_HTTP,
    __TITLE__: escapeHtml(calc.title),
    __META_DESC__: escapeHtml(calc.metaDescription),
    __CANONICAL__: canonical,
    __STYLESHEET_HREF__: STYLESHEET_HREF,
    __HUB_PATH__: hubPathForCategory(calc.category),
    __CATEGORY_LABEL__: escapeHtml(cat.label),
    __SHORT_TITLE__: escapeHtml(shortTitle(calc.title)),
    __HERO_SUB__: calc.aeoEntry || escapeHtml(calc.metaDescription || ''),
    __AEO_ENTRY__: calc.aeoEntry || '',
    __INPUTS_HTML__: buildInputs(calc.inputs),
    __OUTPUTS_HTML__: buildOutputs(calc.outputs),
    __STATIC_BLOCKS__: buildStaticBlocks(calc.staticBlocks),
    __FAQ_HTML__: buildFaqHtml(calc.faq),
    __WEBPAGE_JSONLD__: jsonLdStringify(webpageLd),
    __FAQ_JSONLD__: jsonLdStringify(buildFaqJsonLd(calc.faq)),
    __BREADCRUMB_JSONLD__: calculatorBreadcrumbJsonLd(calc, cat),
    __CONFIG_JSON__: embedConfig(calc),
    __RELATED_LINKS__: buildRelatedLinksHtml(calc, allCalculators || []),
    __HEADER__: SITE_HEADER_HTML,
    __FOOTER__: SITE_FOOTER_HTML
  };

  return replaceAll(template, map);
}

/** Phase 18 — AEO article pages in /calculators/ (no interactive math, FAQ + static blocks). */
function generateArticlePage(template, calc, allCalculators) {
  var cat = CATEGORY[calc.category] || CATEGORY.finance;
  var canonical = canonicalUrl('/calculators/' + calc.slug + '.html');
  var webpageLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: calc.title,
    description: calc.metaDescription,
    url: canonical,
    isPartOf: {
      '@type': 'WebSite',
      name: 'roicalculator.live',
      url: SITE + '/'
    }
  };

  var map = {
    __LASTMOD__: LASTMOD,
    __LASTMOD_HTTP__: LASTMOD_HTTP,
    __TITLE__: escapeHtml(calc.title),
    __META_DESC__: escapeHtml(calc.metaDescription),
    __CANONICAL__: canonical,
    __STYLESHEET_HREF__: STYLESHEET_HREF,
    __HUB_PATH__: hubPathForCategory(calc.category),
    __CATEGORY_LABEL__: escapeHtml(cat.label),
    __SHORT_TITLE__: escapeHtml(shortTitle(calc.title)),
    __HERO_SUB__: calc.aeoEntry || escapeHtml(calc.metaDescription || ''),
    __AEO_ENTRY__: calc.aeoEntry || '',
    __STATIC_BLOCKS__: buildStaticBlocks(calc.staticBlocks),
    __FAQ_HTML__: buildFaqHtml(calc.faq),
    __WEBPAGE_JSONLD__: jsonLdStringify(webpageLd),
    __FAQ_JSONLD__: jsonLdStringify(buildFaqJsonLd(calc.faq)),
    __BREADCRUMB_JSONLD__: calculatorBreadcrumbJsonLd(calc, cat),
    __RELATED_LINKS__: buildRelatedLinksHtml(calc, allCalculators || []),
    __HEADER__: SITE_HEADER_HTML,
    __FOOTER__: SITE_FOOTER_HTML
  };

  return replaceAll(template, map);
}

function generateHubPage(categoryKey, calculators) {
  var cat = CATEGORY[categoryKey];
  if (!cat) return '';
  var canonical = canonicalUrl(hubPathForCategory(categoryKey));
  var items = calculators
    .filter(function (c) {
      return c.category === categoryKey;
    })
    .map(function (c) {
      return (
        '<li><a href="/calculators/' +
        encodeURIComponent(c.slug) +
        '.html">' +
        escapeHtml(c.title) +
        '</a> — ' +
        escapeHtml(stripTags(c.metaDescription).slice(0, 140)) +
        (stripTags(c.metaDescription).length > 140 ? '…' : '') +
        '</li>'
      );
    })
    .join('\n');

  return (
    '<!DOCTYPE html>\n' +
    '<html lang="en">\n' +
    '<head>\n' +
    '  <meta charset="UTF-8">\n' +
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">\n' +
    '  <meta name="theme-color" content="#0b0f14">\n' +
    '  <meta name="last-modified" content="' +
    LASTMOD +
    '">\n' +
    '  <meta http-equiv="last-modified" content="' +
    LASTMOD_HTTP +
    '">\n' +
    '  <title>' +
    escapeHtml(cat.hubTitle) +
    ' | roicalculator.live</title>\n' +
    '  <meta name="description" content="' +
    escapeHtml(cat.hubDescription) +
    '">\n' +
    '  <link rel="canonical" href="' +
    canonical +
    '">\n' +
    '  <meta property="og:type" content="website">\n' +
    '  <meta property="og:url" content="' +
    canonical +
    '">\n' +
    '  <meta property="og:title" content="' +
    escapeHtml(cat.hubTitle) +
    ' | roicalculator.live">\n' +
    '  <meta property="og:description" content="' +
    escapeHtml(cat.hubDescription) +
    '">\n' +
    '  <meta property="og:image" content="' +
    CANONICAL_ORIGIN +
    '/assets/og-placeholder.svg">\n' +
    '  <link rel="icon" href="data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 32 32\'><text y=\'.9em\' font-size=\'24\'>📊</text></svg>" type="image/svg+xml">\n' +
    '  <link rel="manifest" href="/manifest.json">\n' +
    '  <link rel="stylesheet" href="' + STYLESHEET_HREF + '">\n' +
    '  <script type="application/ld+json">\n' +
    hubBreadcrumbJsonLd(categoryKey, cat) +
    '\n  </script>\n' +
    '  <script type="application/ld+json">\n' +
    jsonLdStringify({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: cat.hubTitle,
      description: cat.hubDescription,
      url: canonical
    }) +
    '\n  </script>\n' +
    '</head>\n' +
    '<body>\n' +
    HTML_SITE_HEADER +
    '  <main>\n' +
    '    <section class="hero">\n' +
    '      <h1>' +
    escapeHtml(cat.hubTitle) +
    '</h1>\n' +
    '      <p class="hero-sub">' +
    escapeHtml(cat.hubDescription) +
    ' Also see <a href="/comparisons/">ROI comparisons</a> and <a href="/benchmarks/">benchmarks</a>.</p>\n' +
    '    </section>\n' +
    '    <article class="content-section">\n' +
    '      <h2>Calculators in this category</h2>\n' +
    '      <ul class="hub-calculator-list">\n' +
    items +
    '\n      </ul>\n' +
    '      <p><a href="/">← Main ROI calculator</a> · <a href="/sitemap.html">Sitemap</a></p>\n' +
    '    </article>\n' +
    '  </main>\n' +
    HTML_SITE_FOOTER +
    '  <script src="/assets/js/navigation.js" defer></script>\n' +
    '</body>\n' +
    '</html>\n'
  );
}

function patchSitemapXml(calculators) {
  var xml = fs.readFileSync(SITEMAP_XML, 'utf8');
  var block =
    '\n' +
    calculators
      .map(function (c) {
        return (
          '  <url>\n' +
          '    <loc>' +
          SITE +
          '/calculators/' +
          c.slug +
          '.html</loc>\n' +
          '    <lastmod>' +
          LASTMOD +
          '</lastmod>\n' +
          '    <changefreq>monthly</changefreq>\n' +
          '    <priority>0.85</priority>\n' +
          '  </url>'
        );
      })
      .join('\n') +
    '\n' +
    '  <url>\n' +
    '    <loc>' +
    SITE +
    '/marketing/</loc>\n' +
    '    <lastmod>' +
    LASTMOD +
    '</lastmod>\n' +
    '    <changefreq>weekly</changefreq>\n' +
    '    <priority>0.82</priority>\n' +
    '  </url>\n' +
    '  <url>\n' +
    '    <loc>' +
    SITE +
    '/finance/</loc>\n' +
    '    <lastmod>' +
    LASTMOD +
    '</lastmod>\n' +
    '    <changefreq>weekly</changefreq>\n' +
    '    <priority>0.82</priority>\n' +
    '  </url>\n' +
    '  <url>\n' +
    '    <loc>' +
    SITE +
    '/operations/</loc>\n' +
    '    <lastmod>' +
    LASTMOD +
    '</lastmod>\n' +
    '    <changefreq>weekly</changefreq>\n' +
    '    <priority>0.82</priority>\n' +
    '  </url>\n';

  var BEGIN = '<!-- GENERATED:calculators:BEGIN -->';
  var END = '<!-- GENERATED:calculators:END -->';
  var wrapped = BEGIN + block + '  ' + END;

  if (xml.includes(BEGIN) && xml.includes(END)) {
    xml = xml.replace(new RegExp(BEGIN + '[\\s\\S]*?' + END, 'm'), wrapped);
  } else {
    xml = xml.replace('</urlset>', wrapped + '\n</urlset>');
  }

  fs.writeFileSync(SITEMAP_XML, xml, 'utf8');
}

function patchSitemapHtml(calculators) {
  var html = fs.readFileSync(SITEMAP_HTML, 'utf8');
  var links =
    calculators
      .map(function (c) {
        return '        <li><a href="/calculators/' + c.slug + '.html">' + escapeHtml(c.title) + '</a></li>';
      })
      .join('\n') +
    '\n        <li><a href="/marketing/">Marketing hub (programmatic)</a></li>\n' +
    '        <li><a href="/finance/">Finance hub (programmatic)</a></li>\n' +
    '        <li><a href="/operations/">Operations hub (programmatic)</a></li>';

  var BEGIN = '<!-- GENERATED:calculators-html:BEGIN -->';
  var END = '<!-- GENERATED:calculators-html:END -->';
  var inner =
    '\n      <h2>Programmatic calculators</h2>\n      <ul>\n' +
    links +
    '\n      </ul>\n      ';
  var block = '      ' + BEGIN + inner + END + '\n';

  if (html.includes(BEGIN) && html.includes(END)) {
    html = html.replace(new RegExp(BEGIN + '[\\s\\S]*?' + END, 'm'), BEGIN + inner + END);
  } else {
    html = html.replace('      <h2>Comparisons</h2>', block + '      <h2>Comparisons</h2>');
  }

  fs.writeFileSync(SITEMAP_HTML, html, 'utf8');
}

function main() {
  var raw = fs.readFileSync(DATA_PATH, 'utf8');
  var calculators = JSON.parse(raw);
  if (!Array.isArray(calculators) || calculators.length === 0) {
    console.error('No calculators in', DATA_PATH);
    process.exit(1);
  }

  var quality = validateConfigs(calculators);
  quality.warnings.forEach(function (w) {
    console.warn('[config]', w);
  });
  if (quality.errors.length) {
    quality.errors.forEach(function (e) {
      console.error('[config]', e);
    });
    process.exit(1);
  }

  var template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  var articleTemplate = fs.readFileSync(ARTICLE_TEMPLATE_PATH, 'utf8');
  fs.mkdirSync(OUT_DIR, { recursive: true });

  calculators.forEach(function (calc) {
    var html =
      calc.isArticlePage === true
        ? generateArticlePage(articleTemplate, calc, calculators)
        : generateCalculatorPage(template, calc, calculators);
    var outFile = path.join(OUT_DIR, calc.slug + '.html');
    fs.writeFileSync(outFile, html, 'utf8');
    console.log('Wrote', path.relative(ROOT, outFile));
  });

  ['marketing', 'finance', 'operations'].forEach(function (cat) {
    var dir = path.join(ROOT, cat);
    fs.mkdirSync(dir, { recursive: true });
    var hubHtml = generateHubPage(cat, calculators);
    fs.writeFileSync(path.join(dir, 'index.html'), hubHtml, 'utf8');
    console.log('Wrote', cat + '/index.html');
  });

  patchSitemapXml(calculators);
  patchSitemapHtml(calculators);
  console.log('Updated sitemap.xml and sitemap.html');

  syncRedirects().forEach(function (f) {
    console.log('Wrote', path.relative(ROOT, f));
  });

  var patch = spawnSync(process.execPath, [path.join(__dirname, 'patch-site-chrome.mjs')], {
    cwd: ROOT,
    stdio: 'inherit'
  });
  if (patch.status !== 0) process.exit(patch.status || 1);
}

main();
