(function () {
  'use strict';

  var form = document.getElementById('pf-form');
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

  function formatPrintsPerMonth(n) {
    if (n === null || n === undefined || !isFinite(n)) return '—';
    return Math.round(n).toLocaleString() + ' prints/mo';
  }

  function formatBreakEven(n) {
    if (n === null || n === undefined || !isFinite(n)) return '—';
    return n.toLocaleString() + ' prints/mo';
  }

  /**
   * Interpretation sentence. States 24-month ROI, payback, monthly operating
   * profit, and whether demand or printer capacity is the limiting factor —
   * factually, with no evaluative language. See
   * chat brief "PHASE 3 — 3D PRINT FARM ROI CALCULATOR" §12.
   */
  function buildInterpretation(roi24, initialInvestment, paybackMonths, monthlyOperatingProfit, constraintText) {
    var profitText = 'Monthly operating profit is estimated at ' + formatMoney(monthlyOperatingProfit) + '.';

    if (initialInvestment <= 0) {
      return 'At the assumptions entered, no printer or setup investment was entered, so payback and ROI are not meaningful. ' + profitText + ' ' + constraintText;
    }

    var paybackReached = !(paybackMonths === null || paybackMonths === undefined || !isFinite(paybackMonths));
    var paybackClause = paybackReached
      ? 'with the ' + formatMoney(initialInvestment) + ' investment recovered in an estimated ' + formatPaybackMonths(paybackMonths)
      : 'though the ' + formatMoney(initialInvestment) + ' investment is not recovered from cash flow at these assumptions';

    if (roi24 === null || roi24 === undefined || !isFinite(roi24)) {
      var fallbackClause = paybackReached
        ? 'the investment is recovered in an estimated ' + formatPaybackMonths(paybackMonths)
        : 'the investment is not recovered from cash flow at these assumptions';
      return 'At the assumptions entered, ' + fallbackClause + '. ' + profitText + ' ' + constraintText;
    }

    return (
      'At the assumptions entered, this print farm is modeled to return ' +
      formatPct(roi24) +
      ' over 24 months, ' +
      paybackClause +
      '. ' +
      profitText +
      ' ' +
      constraintText
    );
  }

  function run() {
    var printerCount = parseNum(el('pf-printer-count').value);
    var printerCost = parseNum(el('pf-printer-cost').value);
    var setupCost = parseNum(el('pf-setup-cost').value);
    var usefulLife = parseNum(el('pf-useful-life').value);
    var residual = parseNum(el('pf-residual').value);
    var printTime = parseNum(el('pf-print-time').value);
    var utilizationPct = parseNum(el('pf-utilization').value);
    var failurePct = parseNum(el('pf-failure-rate').value);
    var price = parseNum(el('pf-price').value);
    var filamentPrice = parseNum(el('pf-filament-price').value);
    var materialGrams = parseNum(el('pf-material-grams').value);
    var wattage = parseNum(el('pf-wattage').value);
    var electricityRate = parseNum(el('pf-electricity-rate').value);
    var laborMinutes = parseNum(el('pf-labor-minutes').value);
    var laborRate = parseNum(el('pf-labor-rate').value);
    var platformFeePct = parseNum(el('pf-platform-fee').value);
    var paymentFeePct = parseNum(el('pf-payment-fee').value);
    var shipping = parseNum(el('pf-shipping').value);
    var fixedCosts = parseNum(el('pf-fixed-costs').value);
    var orders = parseNum(el('pf-orders').value);

    if (printerCount < 1) {
      alert('Number of printers must be at least 1.');
      return;
    }
    if (usefulLife <= 0) {
      alert('Useful life must be greater than 0 hours.');
      return;
    }
    if (failurePct < 0 || failurePct > 99) {
      alert('Failure/reprint rate must be between 0 and 99%.');
      return;
    }

    var failureRate = failurePct / 100;
    var utilizationRate = utilizationPct / 100;

    // ---------- Fleet capacity ----------
    // If print time is 0, capacity cannot be meaningfully computed — treat
    // capacity as unmodeled ("—") and fall back to the entered sales volume
    // directly, rather than dividing by zero.
    var capacityKnown = printTime > 0;
    var fleetAvailableHours = printerCount * (24 * 30);
    var utilizedFleetHours = fleetAvailableHours * utilizationRate;
    var attemptCapacity = capacityKnown ? utilizedFleetHours / printTime : null;
    var successfulPrintCapacity = capacityKnown ? attemptCapacity * (1 - failureRate) : null;

    var monthlySuccessfulPrints;
    var isCapacityConstrained;
    if (capacityKnown) {
      monthlySuccessfulPrints = Math.min(successfulPrintCapacity, orders);
      isCapacityConstrained = orders >= successfulPrintCapacity;
    } else {
      monthlySuccessfulPrints = orders;
      isCapacityConstrained = null;
    }

    // ---------- Per-attempt cost (failure rate applied to the FULL attempt cost) ----------
    var materialCost = (filamentPrice / 1000) * materialGrams;
    var electricityCost = (wattage / 1000) * printTime * electricityRate;
    var depreciableBase = Math.max(0, printerCost - residual);
    var depreciationCostPerAttempt = (depreciableBase / usefulLife) * printTime;
    var laborCost = (laborMinutes / 60) * laborRate;
    var attemptCost = materialCost + electricityCost + depreciationCostPerAttempt + laborCost;

    var noSuccessfulPrints = failureRate >= 1;
    var costPerSuccessfulPrint = noSuccessfulPrints ? null : attemptCost / (1 - failureRate);

    if (noSuccessfulPrints || costPerSuccessfulPrint === null) {
      el('pf-res-roi24').textContent = '—';
      el('pf-res-interpretation').textContent =
        'No successful prints are modeled at this failure rate — reduce the failure rate below 100% to see results.';
      [
        'pf-res-payback', 'pf-res-monthly-profit', 'pf-res-monthly-prints', 'pf-res-capacity-utilization',
        'pf-res-breakeven', 'pf-res-capacity', 'pf-res-revenue', 'pf-res-profit-per-print',
        'pf-res-roi12', 'pf-res-roi36', 'pf-res-margin', 'pf-res-markup', 'pf-res-cash-profit'
      ].forEach(function (id) {
        el(id).textContent = '—';
      });
      el('pf-results').hidden = false;
      return;
    }

    // ---------- Sales / fleet economics ----------
    var marketplaceFee = price * (platformFeePct / 100);
    var paymentFee = price * (paymentFeePct / 100);
    var sellingVariableCost = costPerSuccessfulPrint + marketplaceFee + paymentFee;
    var profitPerSuccessfulPrint = price - sellingVariableCost;

    var actualOrders = monthlySuccessfulPrints;
    var monthlyShippingCost = actualOrders * shipping;
    var monthlyRevenue = price * monthlySuccessfulPrints;
    var monthlyProductionCost = costPerSuccessfulPrint * monthlySuccessfulPrints;
    var monthlySellingFees = price * ((platformFeePct + paymentFeePct) / 100) * monthlySuccessfulPrints;
    var monthlyDepreciation = (depreciationCostPerAttempt * monthlySuccessfulPrints) / (1 - failureRate);

    var monthlyOperatingProfit =
      monthlyRevenue - monthlyProductionCost - monthlySellingFees - monthlyShippingCost - fixedCosts;
    var monthlyCashProfit = monthlyOperatingProfit + monthlyDepreciation;

    // ---------- Initial investment, payback, ROI ----------
    var initialInvestment = printerCount * printerCost + printerCount * setupCost;

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

    // ---------- Break-even (contribution profit includes shipping) ----------
    var contributionProfitPerPrint = price - costPerSuccessfulPrint - marketplaceFee - paymentFee - shipping;
    var breakEvenPrints = contributionProfitPerPrint > 0 ? Math.ceil(fixedCosts / contributionProfitPerPrint) : null;

    // ---------- Margin / markup (based on per-print profit excluding shipping) ----------
    var grossMarginPct = price > 0 ? (profitPerSuccessfulPrint / price) * 100 : null;
    var markupPct = sellingVariableCost > 0 ? (profitPerSuccessfulPrint / sellingVariableCost) * 100 : null;

    // ---------- Capacity utilization: share of modeled capacity actually sold ----------
    var capacityUtilizationPct =
      capacityKnown && successfulPrintCapacity > 0 ? (monthlySuccessfulPrints / successfulPrintCapacity) * 100 : null;

    // ---------- Constraint interpretation ----------
    var constraintText;
    if (!capacityKnown) {
      constraintText = 'Print time is 0, so fleet production capacity cannot be modeled; the entered sales volume is used directly.';
    } else if (isCapacityConstrained) {
      constraintText = 'Modeled production capacity is below the requested sales volume, so printer capacity is the limiting factor at these assumptions.';
    } else {
      constraintText = 'Sales volume is below modeled production capacity, so demand is the limiting factor at these assumptions.';
    }

    // ---------- Render ----------
    el('pf-res-roi24').textContent = formatPct(roi24);
    el('pf-res-payback').textContent = formatPaybackMonths(paybackMonths);
    el('pf-res-monthly-profit').textContent = formatMoney(monthlyOperatingProfit);
    el('pf-res-monthly-prints').textContent = formatPrintsPerMonth(monthlySuccessfulPrints);
    el('pf-res-capacity-utilization').textContent = formatPct(capacityUtilizationPct);
    el('pf-res-breakeven').textContent = breakEvenPrints === null ? '—' : formatBreakEven(breakEvenPrints);
    el('pf-res-capacity').textContent = capacityKnown ? formatPrintsPerMonth(successfulPrintCapacity) : '—';
    el('pf-res-revenue').textContent = formatMoney(monthlyRevenue);
    el('pf-res-profit-per-print').textContent = formatMoney(profitPerSuccessfulPrint, 2);
    el('pf-res-roi12').textContent = formatPct(roi12);
    el('pf-res-roi36').textContent = formatPct(roi36);
    el('pf-res-margin').textContent = formatPct(grossMarginPct);
    el('pf-res-markup').textContent = formatPct(markupPct);
    el('pf-res-cash-profit').textContent = formatMoney(monthlyCashProfit);

    el('pf-res-interpretation').textContent = buildInterpretation(
      roi24,
      initialInvestment,
      paybackMonths,
      monthlyOperatingProfit,
      constraintText
    );

    el('pf-results').hidden = false;
    var pdfBtn = el('btn-pdf');
    if (pdfBtn) pdfBtn.disabled = false;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    run();
  });

  window.getCalculatorPdfData = function () {
    return {
      title: '3D Print Farm ROI Calculator Results',
      sections: [
        {
          heading: 'Inputs',
          rows: [
            { label: 'Number of printers', value: el('pf-printer-count').value },
            { label: 'Printer cost', value: el('pf-printer-cost').value },
            { label: 'Utilization (%)', value: el('pf-utilization').value },
            { label: 'Orders/month', value: el('pf-orders').value },
            { label: 'Price per print', value: el('pf-price').value },
            { label: 'Failure/reprint rate (%)', value: el('pf-failure-rate').value }
          ]
        },
        {
          heading: 'Results',
          rows: [
            { label: '24-Month ROI', value: el('pf-res-roi24').textContent },
            { label: 'Payback period', value: el('pf-res-payback').textContent },
            { label: 'Monthly operating profit', value: el('pf-res-monthly-profit').textContent },
            { label: 'Profit per successful print', value: el('pf-res-profit-per-print').textContent },
            { label: 'Break-even prints/month', value: el('pf-res-breakeven').textContent },
            { label: 'Monthly successful prints', value: el('pf-res-monthly-prints').textContent },
            { label: 'Theoretical capacity/month', value: el('pf-res-capacity').textContent },
            { label: 'Capacity utilization', value: el('pf-res-capacity-utilization').textContent },
            { label: 'Monthly revenue', value: el('pf-res-revenue').textContent },
            { label: 'Monthly cash profit', value: el('pf-res-cash-profit').textContent },
            { label: '12-month ROI', value: el('pf-res-roi12').textContent },
            { label: '36-month ROI', value: el('pf-res-roi36').textContent },
            { label: 'Gross margin', value: el('pf-res-margin').textContent },
            { label: 'Markup', value: el('pf-res-markup').textContent }
          ]
        }
      ],
      disclaimer: 'For informational purposes only. Not financial or investment advice.'
    };
  };
})();
