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

  (function capRate() {
    var form = document.getElementById('re-cap-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var price = parseNum(el('re-cap-price').value);
      var income = parseNum(el('re-cap-income').value);
      var exp = parseNum(el('re-cap-exp').value);
      if (price <= 0) {
        alert('Property price must be positive.');
        return;
      }
      var noi = income - exp;
      var cap = price > 0 ? (noi / price) * 100 : 0;
      el('re-cap-noi').textContent = formatMoney(noi);
      el('re-cap-result').textContent = formatPct(cap);
      el('re-cap-panel').hidden = false;
    });
  })();

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
      el('re-coc-panel').hidden = false;
    });
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
      el('re-flip-profit').textContent = formatMoney(profit);
      el('re-flip-roi').textContent = formatPct(roi);
      el('re-flip-cost').textContent = formatMoney(totalCost);
      el('re-flip-panel').hidden = false;
    });
  })();
})();
