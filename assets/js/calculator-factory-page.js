/**
 * Binds CalculatorEngine to programmatic /calculators/*.html pages using #factory-page-config JSON.
 */
(function () {
  'use strict';

  function init() {
    var el = document.getElementById('factory-page-config');
    if (!el) return;

    var cfg;
    try {
      cfg = JSON.parse(el.textContent);
    } catch (e) {
      return;
    }

    var outputMap = {};
    (cfg.outputs || []).forEach(function (o) {
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
        once: true
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
