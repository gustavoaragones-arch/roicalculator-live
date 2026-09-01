(function () {
  'use strict';

  function parseNum(val) {
    var n = parseFloat(String(val).replace(/[^0-9.-]/g, ''));
    return isNaN(n) ? 0 : n;
  }

  function el(id) {
    return document.getElementById(id);
  }

  function formatMoney(n) {
    return '$' + n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  function formatPct(n) {
    return n.toFixed(2) + '%';
  }

  function enablePdfButton() {
    var btn = el('btn-pdf');
    if (btn) btn.disabled = false;
  }

  (function coc() {
    var form = document.getElementById('re-coc-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var cf = parseNum(el('re-coc-cf').value);
      var cash = parseNum(el('re-coc-cash').value);
      if (cash <= 0) {
        alert('Cash invested must be positive.');
        return;
      }
      var pct = (cf / cash) * 100;
      el('re-coc-result').textContent = formatPct(pct);
      el('re-coc-interpretation').textContent = 'At these assumptions, cash-on-cash return is ' + formatPct(pct) + ' on ' + formatMoney(cash) + ' invested, based on ' + formatMoney(cf) + ' in annual pre-tax cash flow.';
      el('re-coc-panel').hidden = false;
      enablePdfButton();
    });
    window.getCalculatorPdfData = function () {
      return {
        title: 'Cash-on-Cash Return Calculator Results',
        sections: [
          {
            heading: 'Inputs',
            rows: [
              { label: 'Annual pre-tax cash flow', value: formatMoney(parseNum(el('re-coc-cf').value)) },
              { label: 'Total cash invested', value: formatMoney(parseNum(el('re-coc-cash').value)) }
            ]
          },
          {
            heading: 'Results',
            rows: [{ label: 'Cash-on-cash return', value: el('re-coc-result').textContent }]
          }
        ],
        disclaimer: 'For informational purposes only. Not financial or investment advice.'
      };
    };
  })();

  (function capRate() {
    var form = document.getElementById('re-cap-form');
    if (!form) return;
    form.addEventListener('submit', function () {
      var price = parseNum(el('re-cap-price').value);
      var income = parseNum(el('re-cap-income').value);
      var exp = parseNum(el('re-cap-exp').value);
      if (price <= 0) return;
      var noi = income - exp;
      var cap = (noi / price) * 100;
      var interp = el('re-cap-interpretation');
      if (interp) {
        interp.textContent = 'At these assumptions, net operating income is ' + formatMoney(noi) + ' on a ' + formatMoney(price) + ' property price, giving a cap rate of ' + formatPct(cap) + '.';
      }
      enablePdfButton();
    });
    window.getCalculatorPdfData = function () {
      return {
        title: 'Cap Rate Calculator Results',
        sections: [
          {
            heading: 'Inputs',
            rows: [
              { label: 'Property price', value: formatMoney(parseNum(el('re-cap-price').value)) },
              { label: 'Annual rental income', value: formatMoney(parseNum(el('re-cap-income').value)) },
              { label: 'Annual operating expenses', value: formatMoney(parseNum(el('re-cap-exp').value)) }
            ]
          },
          {
            heading: 'Results',
            rows: [
              { label: 'NOI', value: el('re-cap-noi').textContent },
              { label: 'Cap rate', value: el('re-cap-result').textContent }
            ]
          }
        ],
        disclaimer: 'For informational purposes only. Not financial or investment advice.'
      };
    };
  })();

  (function flip() {
    var form = document.getElementById('re-flip-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var buy = parseNum(el('re-flip-buy').value);
      var reno = parseNum(el('re-flip-reno').value);
      var hold = parseNum(el('re-flip-hold').value);
      var sell = parseNum(el('re-flip-sell').value);
      var totalCost = buy + reno + hold;
      var profit = sell - totalCost;
      var roi = totalCost > 0 ? (profit / totalCost) * 100 : 0;
      var margin = sell > 0 ? (profit / sell) * 100 : 0;
      el('re-flip-profit').textContent = formatMoney(profit);
      el('re-flip-roi').textContent = formatPct(roi);
      el('re-flip-cost').textContent = formatMoney(totalCost);
      el('re-flip-margin').textContent = formatPct(margin);
      el('re-flip-interpretation').textContent = 'At these assumptions, this flip is modeled to return ' + formatPct(roi) + ' on ' + formatMoney(totalCost) + ' in total project cost, for a profit of ' + formatMoney(profit) + '.';
      el('re-flip-panel').hidden = false;
      enablePdfButton();
    });
    window.getCalculatorPdfData = function () {
      return {
        title: 'Fix & Flip ROI Calculator Results',
        sections: [
          {
            heading: 'Inputs',
            rows: [
              { label: 'Purchase price', value: formatMoney(parseNum(el('re-flip-buy').value)) },
              { label: 'Renovation cost', value: formatMoney(parseNum(el('re-flip-reno').value)) },
              { label: 'Holding cost', value: formatMoney(parseNum(el('re-flip-hold').value)) },
              { label: 'Selling price', value: formatMoney(parseNum(el('re-flip-sell').value)) }
            ]
          },
          {
            heading: 'Results',
            rows: [
              { label: 'Total cost', value: el('re-flip-cost').textContent },
              { label: 'Profit', value: el('re-flip-profit').textContent },
              { label: 'ROI %', value: el('re-flip-roi').textContent },
              { label: 'Profit margin', value: el('re-flip-margin').textContent }
            ]
          }
        ],
        disclaimer: 'For informational purposes only. Not financial or investment advice.'
      };
    };
  })();
})();
