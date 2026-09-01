(function () {
  'use strict';

  var form = document.getElementById('sp-roi-form');
  if (!form) return;

  var hasInteracted = false;
  var hasInjectedStructuredData = false;

  if (window.CalculatorEngine) {
    window.CalculatorEngine.loadFromURL(form);
  }

  function el(id) {
    return document.getElementById(id);
  }

  function parseNum(val) {
    var n = parseFloat(String(val).replace(/[^0-9.-]/g, ''));
    return isNaN(n) ? 0 : n;
  }

  function savingsInYear(kwh, ratePerKwh, annualEscalation, yearIndex) {
    return kwh * ratePerKwh * Math.pow(1 + annualEscalation, yearIndex - 1);
  }

  function cumulativeSavingsThroughYear(kwh, ratePerKwh, annualEscalation, years) {
    var sum = 0;
    var y = Math.max(0, Math.floor(years));
    for (var t = 1; t <= y; t++) {
      sum += savingsInYear(kwh, ratePerKwh, annualEscalation, t);
    }
    return sum;
  }

  /**
   * @returns {number|null} fractional years to recover net cost; null if not within maxYears; -1 if no annual savings
   */
  function paybackYears(kwh, ratePerKwh, annualEscalation, netCost, maxYears) {
    if (netCost <= 0) return 0;
    var s1 = savingsInYear(kwh, ratePerKwh, annualEscalation, 1);
    if (s1 <= 0) return -1;
    var cum = 0;
    for (var y = 1; y <= maxYears; y++) {
      var s = savingsInYear(kwh, ratePerKwh, annualEscalation, y);
      if (cum + s >= netCost) {
        return y - 1 + (netCost - cum) / s;
      }
      cum += s;
    }
    return null;
  }

  function formatMoney(n) {
    return '$' + n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  function formatYears(y) {
    if (y === -1) return '—';
    if (y === null || y === undefined) return '150+ yr';
    if (y > 149.5) return '150+ yr';
    return y.toFixed(1) + ' yr';
  }

  function formatPct(n) {
    return n.toFixed(1) + '%';
  }

  /**
   * Dynamically generated interpretation sentence. Describes the modeled
   * result only — no evaluative language ("worth it", "great investment")
   * since this calculator has no defensible quality threshold. See the
   * Phase 4 brief, Section 8.
   */
  function buildInterpretation(pb, roi20, totalSave20) {
    if (pb === -1) {
      return 'At the assumptions entered, this system generates no first-year savings, so payback cannot be computed.';
    }
    if (pb === null || pb > 149.5) {
      return 'At the assumptions entered, cumulative savings do not recover net cost within a 150-year horizon; the modeled 20-year return is ' + formatPct(roi20) + '.';
    }
    return (
      'At the assumptions entered, this system is estimated to pay back its net cost in ' +
      formatYears(pb) +
      ', with a modeled ' +
      formatPct(roi20) +
      ' return and ' +
      formatMoney(totalSave20) +
      ' in cumulative savings over 20 years.'
    );
  }

  function run() {
    var systemCost = parseNum(el('sp-cost').value);
    var taxCreditPct = parseNum(el('sp-credit').value);
    var kwh = parseNum(el('sp-kwh').value);
    var rate = parseNum(el('sp-rate').value);
    var rateIncreasePct = parseNum(el('sp-escalation').value);
    var lifespan = parseNum(el('sp-lifespan').value);

    if (systemCost <= 0) {
      alert('System cost must be positive.');
      return;
    }
    if (taxCreditPct < 0 || taxCreditPct > 100) {
      alert('Tax credit must be between 0% and 100%.');
      return;
    }
    if (kwh < 0 || rate < 0) {
      alert('Usage and rate cannot be negative.');
      return;
    }
    if (lifespan <= 0) {
      alert('System lifespan must be positive.');
      return;
    }

    var netCost = systemCost * (1 - taxCreditPct / 100);
    var g = rateIncreasePct / 100;
    var annualSaveY1 = kwh * rate;

    var lifeYears = Math.max(1, Math.floor(lifespan));
    var total20 = cumulativeSavingsThroughYear(kwh, rate, g, 20);
    var totalLife = cumulativeSavingsThroughYear(kwh, rate, g, lifeYears);

    var roi20 = netCost > 0 ? ((total20 - netCost) / netCost) * 100 : 0;
    var roiLife = netCost > 0 ? ((totalLife - netCost) / netCost) * 100 : 0;

    var pb = paybackYears(kwh, rate, g, netCost, 150);

    el('sp-result-payback').textContent = formatYears(pb);
    el('sp-result-roi-20').textContent = formatPct(roi20);
    el('sp-result-roi-life').textContent = formatPct(roiLife);
    el('sp-result-save-20').textContent = formatMoney(total20);
    el('sp-result-save-life').textContent = formatMoney(totalLife);
    el('sp-result-annual').textContent = formatMoney(annualSaveY1);

    var interpretationEl = el('sp-result-interpretation');
    if (interpretationEl) {
      interpretationEl.textContent = buildInterpretation(pb, roi20, total20);
    }

    var lifeLabel = el('sp-roi-life-label');
    if (lifeLabel) {
      lifeLabel.textContent = 'ROI (lifetime, ' + lifeYears + ' yr)';
    }

    var note = el('sp-horizon-note');
    if (note) {
      note.hidden = false;
      note.textContent =
        '20-year metrics use exactly 20 years of escalating savings. Lifetime metrics use your system lifespan (' +
        lifeYears +
        ' yr). Net cost = price after tax credit.';
    }

    el('sp-results-panel').hidden = false;
    var pdfBtn = el('btn-pdf');
    if (pdfBtn) pdfBtn.disabled = false;

    if (window.CalculatorEngine) {
      if (hasInteracted) {
        window.CalculatorEngine.updateURL({
          systemCost: systemCost,
          taxCreditPct: taxCreditPct,
          kwh: kwh,
          rate: rate,
          rateIncreasePct: rateIncreasePct,
          lifespan: lifespan
        });
      }
      if (hasInteracted && !hasInjectedStructuredData) {
        window.CalculatorEngine.injectDatasetJsonLd(
          {
            name: 'Solar ROI Calculator',
            description: 'Payback, 20-year and lifetime ROI from net cost and escalating bill savings.'
          },
          {
            systemCost: systemCost,
            taxCreditPct: taxCreditPct,
            kwh: kwh,
            rate: rate,
            rateIncreasePct: rateIncreasePct,
            lifespan: lifespan
          },
          {
            netCost: netCost,
            annualSavingsYear1: annualSaveY1,
            paybackYears: pb,
            roi20Percent: roi20,
            roiLifetimePercent: roiLife,
            totalSavings20Year: total20,
            totalSavingsLifetime: totalLife,
            horizonYears20: 20,
            horizonYearsLife: lifeYears
          }
        );
        hasInjectedStructuredData = true;
      }
    }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    hasInteracted = true;
    run();
  });

  var spInputs = form.querySelectorAll('input, select, textarea');
  for (var i = 0; i < spInputs.length; i++) {
    spInputs[i].addEventListener('input', function () {
      hasInteracted = true;
    });
    spInputs[i].addEventListener('change', function () {
      hasInteracted = true;
    });
  }

  if (window.location.search && window.location.search.length > 1) {
    run();
  }

  window.getCalculatorPdfData = function () {
    return {
      title: 'Solar ROI Calculator Results',
      sections: [
        {
          heading: 'Inputs',
          rows: [
            { label: 'System cost', value: el('sp-cost').value },
            { label: 'Tax credit (% of system cost)', value: el('sp-credit').value },
            { label: 'Annual electricity usage (kWh)', value: el('sp-kwh').value },
            { label: 'Electricity rate ($/kWh)', value: el('sp-rate').value },
            { label: 'Annual rate increase (%)', value: el('sp-escalation').value },
            { label: 'System lifespan (years)', value: el('sp-lifespan').value }
          ]
        },
        {
          heading: 'Results',
          rows: [
            { label: 'Payback period', value: el('sp-result-payback').textContent },
            { label: 'ROI (20-year)', value: el('sp-result-roi-20').textContent },
            { label: el('sp-roi-life-label').textContent, value: el('sp-result-roi-life').textContent },
            { label: 'Total savings (20-year)', value: el('sp-result-save-20').textContent },
            { label: 'Total savings (lifetime)', value: el('sp-result-save-life').textContent },
            { label: 'Annual savings (year 1)', value: el('sp-result-annual').textContent }
          ]
        }
      ],
      disclaimer: 'For informational purposes only. Not financial or investment advice.'
    };
  };
})();
