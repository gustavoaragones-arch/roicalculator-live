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

  function enablePdfButton() {
    var btn = el('btn-pdf');
    if (btn) btn.disabled = false;
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
      var paybackText = payback !== null && payback < 200 ? payback.toFixed(1) + ' yr' : '—';
      el('hvac-result-payback').textContent = paybackText;
      el('hvac-result-save').textContent = formatMoney(annualSave);
      el('hvac-result-pct').textContent = formatPct((1 - eOld / eNew) * 100);
      el('hvac-result-interpretation').textContent = payback !== null && payback < 200
        ? 'At these assumptions, the upgrade is modeled to pay back in ' + paybackText + ', saving ' + formatMoney(annualSave) + ' per year (' + formatPct((1 - eOld / eNew) * 100) + ' bill reduction).'
        : 'At these assumptions, payback exceeds a reasonable modeling horizon. Annual savings are estimated at ' + formatMoney(annualSave) + ' (' + formatPct((1 - eOld / eNew) * 100) + ' bill reduction).';
      el('hvac-results-panel').hidden = false;
      enablePdfButton();
    });
    window.getCalculatorPdfData = function () {
      return {
        title: 'HVAC ROI Calculator Results',
        sections: [
          {
            heading: 'Inputs',
            rows: [
              { label: 'Annual HVAC energy cost', value: formatMoney(parseNum(el('hvac-bill').value)) },
              { label: 'Old system efficiency', value: parseNum(el('hvac-old').value) + '%' },
              { label: 'New system efficiency', value: parseNum(el('hvac-new').value) + '%' },
              { label: 'Upgrade installed cost', value: formatMoney(parseNum(el('hvac-upgrade').value)) }
            ]
          },
          {
            heading: 'Results',
            rows: [
              { label: 'Payback period', value: el('hvac-result-payback').textContent },
              { label: 'Annual energy savings', value: el('hvac-result-save').textContent },
              { label: 'Bill reduction', value: el('hvac-result-pct').textContent }
            ]
          }
        ],
        disclaimer: 'For informational purposes only. Not financial or investment advice.'
      };
    };
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
      el('hr-result-interpretation').textContent = 'At these assumptions, addressable annual turnover cost is ' + formatMoney(annualAddressable) + ', driven by ' + exits.toFixed(1) + ' expected exits per year at ' + formatMoney(hire + vacancyCostPerExit) + ' each.';
      el('hr-results-panel').hidden = false;
      enablePdfButton();
    });
    window.getCalculatorPdfData = function () {
      return {
        title: 'Employee Retention ROI Calculator Results',
        sections: [
          {
            heading: 'Inputs',
            rows: [
              { label: 'Headcount in scope', value: parseNum(el('hr-headcount').value) },
              { label: 'Average salary', value: formatMoney(parseNum(el('hr-salary').value)) },
              { label: 'Annual turnover rate', value: parseNum(el('hr-turnover').value) + '%' },
              { label: 'Hiring cost per exit', value: formatMoney(parseNum(el('hr-hire').value)) },
              { label: 'Weeks role vacant', value: parseNum(el('hr-weeks').value) }
            ]
          },
          {
            heading: 'Results',
            rows: [
              { label: 'Annual cost (addressable)', value: el('hr-result-saved').textContent },
              { label: 'Expected exits / year', value: el('hr-result-exits').textContent },
              { label: 'Cost per exit', value: el('hr-result-per').textContent }
            ]
          }
        ],
        disclaimer: 'For informational purposes only. Not financial or investment advice.'
      };
    };
  })();
})();
