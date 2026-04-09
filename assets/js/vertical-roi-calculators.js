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
    return n.toFixed(1) + '%';
  }

  /* ---------- HVAC: payback ---------- */
  (function hvac() {
    var form = document.getElementById('hvac-roi-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bill = parseNum(el('hvac-bill').value);
      var oldPct = parseNum(el('hvac-old').value);
      var newPct = parseNum(el('hvac-new').value);
      var upgrade = parseNum(el('hvac-upgrade').value);
      if (bill <= 0) {
        alert('Annual energy cost must be positive.');
        return;
      }
      if (oldPct <= 0 || newPct <= 0 || newPct <= oldPct) {
        alert('New efficiency must be higher than old (both positive).');
        return;
      }
      if (upgrade <= 0) {
        alert('Upgrade cost must be positive.');
        return;
      }
      var eOld = oldPct / 100;
      var eNew = newPct / 100;
      var annualSave = bill * (1 - eOld / eNew);
      var payback = annualSave > 0 ? upgrade / annualSave : null;
      el('hvac-result-payback').textContent =
        payback !== null && payback < 200 ? payback.toFixed(1) + ' yr' : '—';
      el('hvac-result-save').textContent = formatMoney(annualSave);
      el('hvac-result-pct').textContent = formatPct((1 - eOld / eNew) * 100);
      el('hvac-results-panel').hidden = false;
    });
  })();

  /* ---------- HR: retention cost ---------- */
  (function hr() {
    var form = document.getElementById('hr-roi-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var n = parseNum(el('hr-headcount').value);
      var salary = parseNum(el('hr-salary').value);
      var turn = parseNum(el('hr-turnover').value);
      var hire = parseNum(el('hr-hire').value);
      var weeks = parseNum(el('hr-weeks').value);
      if (n <= 0) {
        alert('Headcount must be positive.');
        return;
      }
      if (salary < 0 || hire < 0 || turn < 0 || turn > 100) {
        alert('Check salary, hiring cost, and turnover (0–100%).');
        return;
      }
      if (weeks < 0 || weeks > 52) {
        alert('Weeks vacancy should be 0–52.');
        return;
      }
      var t = turn / 100;
      var exits = t * n;
      var vacancyCostPerExit = (weeks / 52) * salary;
      var annualAddressable = exits * (hire + vacancyCostPerExit);
      el('hr-result-saved').textContent = formatMoney(annualAddressable);
      el('hr-result-exits').textContent = exits.toFixed(1);
      el('hr-result-per').textContent = formatMoney(hire + vacancyCostPerExit);
      el('hr-results-panel').hidden = false;
    });
  })();
})();
