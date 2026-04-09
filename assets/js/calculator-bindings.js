/**
 * Central registry for CalculatorEngine.bind() — simple, declarative calculators.
 * Complex tools (home ROI with reverse/chart, solar escalation model) stay in dedicated files.
 */
(function () {
  'use strict';

  function init() {
    // Cap rate (real estate) — form id re-cap-form
    if (document.getElementById('re-cap-form') && typeof window.CalculatorEngine === 'undefined') {
      var formFallback = document.getElementById('re-cap-form');
      formFallback.addEventListener('submit', function (e) {
        e.preventDefault();
        function pn(v) {
          var n = parseFloat(String(v).replace(/[^0-9.-]/g, ''));
          return isNaN(n) ? 0 : n;
        }
        var price = pn(document.getElementById('re-cap-price').value);
        var income = pn(document.getElementById('re-cap-income').value);
        var exp = pn(document.getElementById('re-cap-exp').value);
        if (price <= 0) {
          window.alert('Property price must be positive.');
          return;
        }
        var noi = income - exp;
        var cap = price > 0 ? (noi / price) * 100 : 0;
        document.getElementById('re-cap-noi').textContent =
          '$' + noi.toLocaleString(undefined, { maximumFractionDigits: 0 });
        document.getElementById('re-cap-result').textContent = cap.toFixed(2) + '%';
        document.getElementById('re-cap-panel').hidden = false;
      });
      return;
    }

    if (typeof window.CalculatorEngine === 'undefined') return;

    if (document.getElementById('re-cap-form')) {
      window.CalculatorEngine.bind({
        formId: 're-cap-form',
        config: {
          name: 'Cap Rate Calculator',
          description: 'Net operating income and capitalization rate from annual rent, expenses, and price.',
          formulas: {
            noi: 'annualRent - annualExp',
            capRate: 'price > 0 ? (noi / price) * 100 : 0'
          }
        },
        outputMap: {
          noi: { selector: '#re-cap-noi', type: 'currency', label: 'Net Operating Income (NOI)' },
          capRate: { selector: '#re-cap-result', type: 'percent', label: 'Capitalization Rate' }
        },
        options: {
          resultsPanelId: 're-cap-panel',
          enableStructuredData: true,
          enableStructuredDataAfterInteraction: true,
          once: true,
          validate: function (values) {
            if (values.price <= 0) {
              return { ok: false, msg: 'Property price must be positive.' };
            }
            return { ok: true };
          }
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
