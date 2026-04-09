/**
 * Global Calculator Engine — shared formulas, formatting, URL state, AEO structured data.
 * Used by homepage ROI, real-estate cluster, and as helpers for ecosystem calculators (e.g. solar).
 */
(function () {
  'use strict';

  var LD_SCRIPT_ID = 'calculator-engine-dataset-json';

  function safeEval(expression, scope) {
    try {
      var scope2 = Object.assign({ Math: Math }, scope);
      var keys = Object.keys(scope2);
      var vals = keys.map(function (k) {
        return scope2[k];
      });
      var fn = new Function(keys.join(','), 'return (' + expression + ');');
      return fn.apply(null, vals);
    } catch (e) {
      return null;
    }
  }

  function formatNumber(value, type) {
    type = type || 'number';
    if (value === null || value === undefined || (typeof value === 'number' && (isNaN(value) || !isFinite(value)))) {
      return '—';
    }

    switch (type) {
      case 'currency':
        return '$' + Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 });
      case 'percent':
        return Number(value).toFixed(2) + '%';
      case 'years':
        return Number(value).toFixed(1) + ' yr';
      default:
        return Number(value).toLocaleString(undefined, { maximumFractionDigits: 4 });
    }
  }

  function calculate(config, inputs) {
    var results = {};
    var formulas = (config && config.formulas) || {};
    var merged;

    for (var key in formulas) {
      if (!Object.prototype.hasOwnProperty.call(formulas, key)) continue;
      merged = Object.assign({}, inputs, results);
      results[key] = safeEval(formulas[key], merged);
    }

    return results;
  }

  function generateStructuredData(config, inputs, results) {
    var href = typeof window !== 'undefined' && window.location ? window.location.href : '';
    inputs = inputs || {};
    results = results || {};

    var variableMeasured = Object.keys(inputs).map(function (key) {
      return {
        '@type': 'PropertyValue',
        name: key,
        value: inputs[key]
      };
    });

    var distribution = Object.keys(results).map(function (key) {
      return {
        '@type': 'DataDownload',
        name: key,
        contentUrl: href,
        encodingFormat: 'application/json'
      };
    });

    return {
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      name: (config && config.name) || 'ROI Calculation',
      description: (config && config.description) || 'Financial return calculation',
      creator: {
        '@type': 'Organization',
        name: 'Albor Digital LLC'
      },
      variableMeasured: variableMeasured,
      measurementTechnique: 'ROI calculation',
      distribution: distribution,
      value: results
    };
  }

  function updateURL(values, options) {
    options = options || {};
    var params = new URLSearchParams();
    var omit = options.omitKeys || [];

    Object.keys(values).forEach(function (key) {
      if (omit.indexOf(key) !== -1) return;
      var v = values[key];
      if (v === null || v === undefined) return;
      if (typeof v === 'boolean') {
        params.set(key, v ? '1' : '0');
        return;
      }
      if (typeof v === 'number' && !isFinite(v)) return;
      params.set(key, String(v));
    });

    var q = params.toString();
    try {
      history.replaceState(null, '', q ? '?' + q : window.location.pathname);
    } catch (e) {
      /* ignore */
    }
  }

  function loadFromURL(form) {
    if (!form) return;
    var params = new URLSearchParams(window.location.search);
    params.forEach(function (value, key) {
      var el = form.elements.namedItem(key);
      if (!el) return;
      var input = el.nodeName ? el : el.length ? el[0] : null;
      if (!input || !input.type) return;
      if (input.type === 'checkbox') {
        input.checked = value === '1' || value === 'true' || value === 'on';
      } else {
        input.value = value;
      }
    });
  }

  function collectFormValues(form, options) {
    options = options || {};
    var values = {};
    if (!form) return values;

    var nodes = form.querySelectorAll('input, select, textarea');
    for (var i = 0; i < nodes.length; i++) {
      var input = nodes[i];
      if (input.disabled) continue;
      var key = input.name || input.id;
      if (!key) continue;
      if (input.type === 'submit' || input.type === 'button' || input.type === 'file') continue;

      if (input.type === 'checkbox') {
        values[key] = input.checked ? 1 : 0;
      } else {
        var raw = input.value;
        var n = parseFloat(String(raw).replace(/[^0-9.-]/g, ''));
        values[key] = isNaN(n) ? 0 : n;
      }
    }

    return values;
  }

  function injectDatasetJsonLd(config, inputs, results) {
    var existing = document.getElementById(LD_SCRIPT_ID);
    if (existing) existing.remove();

    var data = generateStructuredData(config, inputs, results);
    var script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = LD_SCRIPT_ID;
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  /**
   * @param {object} opts
   * @param {string} opts.formId
   * @param {object} opts.config - { name?, formulas: { key: expression } }
   * @param {object} opts.outputMap - { resultKey: { selector, type? } }
   * @param {object} [opts.options]
   * @param {string} [opts.options.resultsPanelId] - remove hidden when results render
   * @param {boolean} [opts.options.enableURL=true]
   * @param {boolean} [opts.options.enableStructuredData=false]
   * @param {boolean} [opts.options.enableStructuredDataAfterInteraction=false]
   * @param {boolean} [opts.options.once=false] — inject JSON-LD at most once (after gates pass)
   * @param {boolean} [opts.config.once] — same as options.once
   * @param {string[]} [opts.options.urlOmitKeys]
   * @param {function(object):object} [opts.options.transformInputs]
   * @param {function({values:object, results:object}):void} [opts.options.afterRun]
   */
  function bindCalculator(opts) {
    function init() {
      var form = document.getElementById(opts.formId);
      if (!form) return;

      var config = opts.config || { formulas: {} };
      var outputMap = opts.outputMap || {};
      var bopts = opts.options || {};

      var hasInteracted = false;
      var hasInjectedStructuredData = false;

      function run() {
        var values = collectFormValues(form);
        if (typeof bopts.transformInputs === 'function') {
          var transformed = bopts.transformInputs(values);
          if (transformed === null || transformed === false) return;
          values = transformed;
        }

        if (typeof bopts.validate === 'function') {
          var chk = bopts.validate(values);
          if (!chk || !chk.ok) {
            if (chk && chk.msg) window.alert(chk.msg);
            return;
          }
        }

        var results = calculate(config, values);

        for (var key in outputMap) {
          if (!Object.prototype.hasOwnProperty.call(outputMap, key)) continue;
          var spec = outputMap[key];
          var elNode = typeof spec.selector === 'string' ? document.querySelector(spec.selector) : null;
          if (!elNode) continue;
          var val = results[key];
          elNode.textContent = formatNumber(val, spec.type || 'number');
          if (spec.label) {
            elNode.setAttribute('data-label', spec.label);
          } else {
            elNode.setAttribute('data-label', key);
          }
        }

        if (bopts.resultsPanelId) {
          var panel = document.getElementById(bopts.resultsPanelId);
          if (panel) panel.hidden = false;
        }

        if (bopts.enableURL !== false && hasInteracted) {
          updateURL(values, { omitKeys: bopts.urlOmitKeys || [] });
        }

        if (bopts.enableStructuredData) {
          var afterInteractOnly = bopts.enableStructuredDataAfterInteraction === true;
          var once = bopts.once === true || config.once === true;
          if (!afterInteractOnly || hasInteracted) {
            if (!once || !hasInjectedStructuredData) {
              injectDatasetJsonLd(config, values, results);
              if (once) {
                hasInjectedStructuredData = true;
              }
            }
          }
        }

        if (typeof bopts.afterRun === 'function') {
          bopts.afterRun({ values: values, results: results });
        }
      }

      loadFromURL(form);

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        hasInteracted = true;
        run();
      });

      var inputs = form.querySelectorAll('input, select, textarea');
      for (var j = 0; j < inputs.length; j++) {
        inputs[j].addEventListener('input', function () {
          hasInteracted = true;
          run();
        });
        inputs[j].addEventListener('change', function () {
          hasInteracted = true;
          run();
        });
      }

      run();
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }

  window.CalculatorEngine = {
    bind: bindCalculator,
    calculate: calculate,
    formatNumber: formatNumber,
    safeEval: safeEval,
    generateStructuredData: generateStructuredData,
    updateURL: updateURL,
    loadFromURL: loadFromURL,
    collectFormValues: collectFormValues,
    injectDatasetJsonLd: injectDatasetJsonLd
  };
})();
