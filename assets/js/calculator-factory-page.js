/**
 * Binds CalculatorEngine to programmatic /calculators/*.html pages using #factory-page-config JSON.
 */
(function () {
  'use strict';

  function buildInterpretation(primaryKey, primaryValue, primaryType) {
    if (primaryValue === null || primaryValue === undefined) return '';
    if (typeof primaryValue === 'number' && (!isFinite(primaryValue) || isNaN(primaryValue))) return '';

    if (primaryType === 'percent') {
      if (primaryValue > 0) {
        return 'Positive return on the inputs you entered—a higher percentage means more gain relative to cost.';
      }
      if (primaryValue < 0) {
        return 'Negative return on these assumptions—modeled costs exceed modeled benefits.';
      }
      return 'Break-even on these assumptions—benefits match costs before timing effects.';
    }

    if (primaryType === 'currency') {
      if (primaryValue > 0) return 'Net positive value on these inputs.';
      if (primaryValue < 0) return 'Net negative value on these inputs.';
      return 'Neutral net value on these inputs.';
    }

    if (primaryKey === 'roi' || /roi/i.test(primaryKey)) {
      return buildInterpretation('roi', primaryValue, 'percent');
    }

    return 'Result computed from your inputs using the formulas on this page.';
  }

  function init() {
    var el = document.getElementById('factory-page-config');
    if (!el) return;

    var cfg;
    try {
      cfg = JSON.parse(el.textContent);
    } catch (e) {
      return;
    }

    var outputs = cfg.outputs || [];
    var primary = outputs[0] || { key: 'roi', type: 'percent' };

    var outputMap = {};
    outputs.forEach(function (o) {
      outputMap[o.key] = {
        selector: '#factory-out-' + o.key,
        type: o.type || 'number',
        label: o.label || o.key
      };
    });

    window.CalculatorEngine.bind({
      formId: 'factory-calc-form',
      config: {
        name: cfg.title,
        description: cfg.metaDescription || '',
        formulas: cfg.formulas || {}
      },
      outputMap: outputMap,
      options: {
        resultsPanelId: 'factory-results-panel',
        enableStructuredData: true,
        enableStructuredDataAfterInteraction: true,
        once: true,
        afterRun: function (ctx) {
          var interp = document.getElementById('factory-result-interpretation');
          if (!interp) return;
          var val = ctx.results[primary.key];
          interp.textContent = buildInterpretation(primary.key, val, primary.type || 'number');
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
