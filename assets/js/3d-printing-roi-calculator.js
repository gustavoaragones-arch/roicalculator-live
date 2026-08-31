(function () {
  'use strict';

  var form = document.getElementById('tdp-form');
  if (!form) return;

  function el(id) {
    return document.getElementById(id);
  }

  function parseNum(val) {
    var n = parseFloat(String(val).replace(/[^0-9.-]/g, ''));
    return isNaN(n) ? 0 : n;
  }

  function formatMoney(n, decimals) {
    if (n === null || n === undefined || !isFinite(n)) return '—';
    var d = decimals === undefined ? 0 : decimals;
    var sign = n < 0 ? '-' : '';
    return sign + '$' + Math.abs(n).toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });
  }

  function formatPct(n) {
    if (n === null || n === undefined || !isFinite(n)) return '—';
    return n.toFixed(1) + '%';
  }

  function formatPaybackMonths(m) {
    if (m === null || m === undefined || !isFinite(m) || m < 0) return '—';
    if (m === 0) return '0 mo (no investment entered)';
    if (m < 1) return (m * 30).toFixed(0) + ' days';
    if (m < 18) return m.toFixed(1) + ' mo';
    return (m / 12).toFixed(1) + ' yr';
  }

  function formatUnits(n) {
    if (n === null || n === undefined || !isFinite(n)) return '—';
    return Math.ceil(n) + ' prints/mo';
  }

  /**
   * Interpretation sentence. Degrades gracefully when payback/ROI are not
   * meaningful (zero investment, or cash flow that never recovers it) rather
   * than exposing NaN/Infinity or a misleading number. See
   * reports/audits/PHASE-3D-PRINTING-01-RESEARCH-ARCHITECTURE.md §19.
   */
  function buildInterpretation(roi24, initialInvestment, paybackMonths, monthlyOperatingProfit, units) {
    var profitText = 'Monthly operating profit is estimated at ' + formatMoney(monthlyOperatingProfit) + ' on ' + units + ' prints sold.';

    if (initialInvestment <= 0) {
      return 'At the assumptions entered, no printer or setup investment was entered, so payback and ROI are not meaningful. ' + profitText;
    }

    var paybackReached = !(paybackMonths === null || paybackMonths === undefined || !isFinite(paybackMonths));
    var paybackClause = paybackReached
      ? 'with the ' + formatMoney(initialInvestment) + ' investment recovered in an estimated ' + formatPaybackMonths(paybackMonths)
      : 'though the ' + formatMoney(initialInvestment) + ' investment is not recovered from cash flow at these assumptions';

    if (roi24 === null || roi24 === undefined || !isFinite(roi24)) {
      var fallbackClause = paybackReached
        ? 'the investment is recovered in an estimated ' + formatPaybackMonths(paybackMonths)
        : 'the investment is not recovered from cash flow at these assumptions';
      return 'At the assumptions entered, ' + fallbackClause + '. ' + profitText;
    }

    return (
      'At the assumptions entered, this printer is modeled to return ' +
      formatPct(roi24) +
      ' over 24 months, ' +
      paybackClause +
      '. ' +
      profitText
    );
  }

  function run() {
    var printerPrice = parseNum(el('tdp-printer-cost').value);
    var setupCost = parseNum(el('tdp-setup-cost').value);
    var usefulLife = parseNum(el('tdp-useful-life').value);
    var residual = parseNum(el('tdp-residual').value);
    var price = parseNum(el('tdp-price').value);
    var units = parseNum(el('tdp-units').value);
    var filamentPrice = parseNum(el('tdp-filament-price').value);
    var materialGrams = parseNum(el('tdp-material-grams').value);
    var printTime = parseNum(el('tdp-print-time').value);
    var wattage = parseNum(el('tdp-wattage').value);
    var electricityRate = parseNum(el('tdp-electricity-rate').value);
    var failurePct = parseNum(el('tdp-failure-rate').value);
    var laborMinutes = parseNum(el('tdp-labor-minutes').value);
    var laborRate = parseNum(el('tdp-labor-rate').value);
    var platformFeePct = parseNum(el('tdp-platform-fee').value);
    var paymentFeePct = parseNum(el('tdp-payment-fee').value);
    var shipping = parseNum(el('tdp-shipping').value);
    var fixedCosts = parseNum(el('tdp-fixed-costs').value);

    if (usefulLife <= 0) {
      alert('Useful life must be greater than 0 hours.');
      return;
    }
    if (failurePct < 0 || failurePct > 99) {
      alert('Failure/reprint rate must be between 0 and 99%.');
      return;
    }

    var materialCost = (filamentPrice / 1000) * materialGrams;
    var electricityCost = (wattage / 1000) * printTime * electricityRate;
    // Guard: if residual value exceeds printer cost, depreciation cannot be
    // negative — clamp the depreciable base at 0 rather than crediting cost.
    var depreciableBase = Math.max(0, printerPrice - residual);
    var depreciationCost = (depreciableBase / usefulLife) * printTime;
    var laborCost = (laborMinutes / 60) * laborRate;
    var attemptCost = materialCost + electricityCost + depreciationCost + laborCost;

    var failureRate = failurePct / 100;
    // Guard: failureRate is capped below 1 by the 0-99 input range above, but
    // defend anyway so a division by zero/near-zero never reaches the DOM.
    var noSuccessfulPrints = failureRate >= 1;
    var costPerSuccess = noSuccessfulPrints ? null : attemptCost / (1 - failureRate);

    if (noSuccessfulPrints || costPerSuccess === null) {
      el('tdp-res-roi24').textContent = '—';
      el('tdp-res-interpretation').textContent =
        'No successful prints are modeled at this failure rate — reduce the failure rate below 100% to see results.';
      ['tdp-res-payback', 'tdp-res-monthly-profit', 'tdp-res-profit-per-print', 'tdp-res-breakeven', 'tdp-res-roi12', 'tdp-res-roi36', 'tdp-res-margin', 'tdp-res-markup', 'tdp-res-cost-per-success', 'tdp-res-total-cost'].forEach(function (id) {
        el(id).textContent = '—';
      });
      el('tdp-results').hidden = false;
      return;
    }

    var feeCost = price * ((platformFeePct + paymentFeePct) / 100);
    var totalCostPerPrint = costPerSuccess + shipping + feeCost;

    var profitPerPrint = price - totalCostPerPrint;
    var grossMarginPct = price > 0 ? (profitPerPrint / price) * 100 : null;
    var markupPct = totalCostPerPrint > 0 ? (profitPerPrint / totalCostPerPrint) * 100 : null;

    var monthlyRevenue = price * units;
    var monthlyVariableCost = totalCostPerPrint * units;
    var monthlyOperatingProfit = monthlyRevenue - monthlyVariableCost - fixedCosts;
    var monthlyDepreciationTotal = depreciationCost * units;

    var initialInvestment = printerPrice + setupCost;
    var monthlyCashProfit = monthlyOperatingProfit + monthlyDepreciationTotal;

    var paybackMonths = null;
    if (initialInvestment <= 0) {
      paybackMonths = 0;
    } else if (monthlyCashProfit > 0) {
      paybackMonths = initialInvestment / monthlyCashProfit;
    }

    function roiPct(months) {
      if (initialInvestment <= 0) return null;
      return ((monthlyCashProfit * months - initialInvestment) / initialInvestment) * 100;
    }
    var roi12 = roiPct(12);
    var roi24 = roiPct(24);
    var roi36 = roiPct(36);

    var breakEvenUnits = profitPerPrint > 0 ? Math.ceil(fixedCosts / profitPerPrint) : null;

    el('tdp-res-roi24').textContent = formatPct(roi24);
    el('tdp-res-payback').textContent = formatPaybackMonths(paybackMonths);
    el('tdp-res-monthly-profit').textContent = formatMoney(monthlyOperatingProfit);
    el('tdp-res-profit-per-print').textContent = formatMoney(profitPerPrint, 2);
    el('tdp-res-breakeven').textContent = breakEvenUnits === null ? '—' : formatUnits(breakEvenUnits);
    el('tdp-res-roi12').textContent = formatPct(roi12);
    el('tdp-res-roi36').textContent = formatPct(roi36);
    el('tdp-res-margin').textContent = formatPct(grossMarginPct);
    el('tdp-res-markup').textContent = formatPct(markupPct);
    el('tdp-res-cost-per-success').textContent = formatMoney(costPerSuccess, 2);
    el('tdp-res-total-cost').textContent = formatMoney(totalCostPerPrint, 2);

    el('tdp-res-interpretation').textContent = buildInterpretation(roi24, initialInvestment, paybackMonths, monthlyOperatingProfit, units);

    el('tdp-results').hidden = false;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    run();
  });
})();
