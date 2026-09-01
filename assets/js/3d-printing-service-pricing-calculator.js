(function () {
  'use strict';

  var form = document.getElementById('sp-form');
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
    var d = decimals === undefined ? 2 : decimals;
    var sign = n < 0 ? '-' : '';
    return sign + '$' + Math.abs(n).toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });
  }

  function formatPct(n) {
    if (n === null || n === undefined || !isFinite(n)) return '—';
    return n.toFixed(1) + '%';
  }

  var ALL_RESULT_IDS = [
    'sp-res-price', 'sp-res-min-price', 'sp-res-profit', 'sp-res-margin', 'sp-res-hourly',
    'sp-res-price-per-hour', 'sp-res-price-per-part',
    'sp-bd-material', 'sp-bd-electricity', 'sp-bd-depreciation', 'sp-bd-labor', 'sp-bd-overhead',
    'sp-bd-failure', 'sp-bd-cost-before-fees', 'sp-bd-platform-fee', 'sp-bd-price'
  ];

  function showInvalid(message) {
    el('sp-res-price').textContent = '—';
    el('sp-res-interpretation').textContent = message;
    ALL_RESULT_IDS.forEach(function (id) {
      if (id === 'sp-res-price') return;
      var target = el(id);
      // Cost-breakdown cells wrap their value in <strong> for two rows;
      // clear the inner element's text without dropping the tag.
      if (target.querySelector('strong')) {
        target.querySelector('strong').textContent = '—';
      } else {
        target.textContent = '—';
      }
    });
    el('sp-results').hidden = false;
  }

  function setBreakdownCell(id, value) {
    var target = el(id);
    if (target.querySelector('strong')) {
      target.querySelector('strong').textContent = value;
    } else {
      target.textContent = value;
    }
  }

  function run() {
    var materialGrams = parseNum(el('sp-material-grams').value);
    var materialPricePerKg = parseNum(el('sp-material-price').value);
    var printTimeHours = parseNum(el('sp-print-time').value);
    var printedParts = parseNum(el('sp-printed-parts').value);
    var printerPrice = parseNum(el('sp-printer-price').value);
    var printerLifeHours = parseNum(el('sp-printer-life').value);
    var electricityRate = parseNum(el('sp-electricity-rate').value);
    var printerPowerWatts = parseNum(el('sp-printer-power').value);
    var setupHours = parseNum(el('sp-setup-hours').value);
    var laborRate = parseNum(el('sp-labor-rate').value);
    var overheadPerJob = parseNum(el('sp-overhead').value);
    var platformFeePct = parseNum(el('sp-platform-fee').value);
    var targetMarginPct = parseNum(el('sp-target-margin').value);
    var failurePct = parseNum(el('sp-failure-rate').value);

    if (printerLifeHours <= 0) {
      alert('Expected printer life must be greater than 0 hours.');
      return;
    }
    if (printedParts < 1) {
      alert('Printed parts must be at least 1.');
      return;
    }
    if (failurePct < 0 || failurePct > 99) {
      alert('Failure/reprint allowance must be between 0 and 99%.');
      return;
    }
    if (platformFeePct < 0 || platformFeePct > 100 || targetMarginPct < 0 || targetMarginPct > 99) {
      alert('Platform fee and target margin must be within their allowed ranges.');
      return;
    }

    var platformFeeRate = platformFeePct / 100;
    var targetMarginRate = targetMarginPct / 100;
    var failureRate = failurePct / 100;

    // ---------- A-E: base production cost ----------
    var materialCost = (materialGrams / 1000) * materialPricePerKg;
    var electricityCost = ((printTimeHours * printerPowerWatts) / 1000) * electricityRate;
    var depreciationCost = (printerPrice / printerLifeHours) * printTimeHours;
    var laborCost = setupHours * laborRate;
    var baseCost = materialCost + electricityCost + depreciationCost + laborCost + overheadPerJob;

    // ---------- F: failure/reprint allowance ----------
    var failureFactor = failureRate >= 1 ? null : 1 / (1 - failureRate);
    if (failureFactor === null) {
      showInvalid('No production cost can be modeled at a 100% (or higher) failure/reprint allowance — reduce the failure allowance below 100%.');
      return;
    }
    var costBeforeFees = baseCost * failureFactor;
    var failureAllowanceCost = costBeforeFees - baseCost;

    // ---------- G: recommended price (denominator guard) ----------
    var priceDenominator = 1 - platformFeeRate - targetMarginRate;
    if (priceDenominator <= 0) {
      showInvalid('The platform/payment fee and target profit margin together must be less than 100% — reduce one or both to calculate a price.');
      return;
    }
    var recommendedPrice = costBeforeFees / priceDenominator;

    // ---------- H-J: fee, profit, margin ----------
    var platformFee = recommendedPrice * platformFeeRate;
    var expectedProfit = recommendedPrice - platformFee - costBeforeFees;
    var profitMargin = recommendedPrice > 0 ? (expectedProfit / recommendedPrice) * 100 : null;

    // ---------- K: effective hourly earnings ----------
    var totalHours = printTimeHours + setupHours;
    var effectiveHourlyEarnings = totalHours > 0 ? expectedProfit / totalHours : null;

    // ---------- L: price per printed hour ----------
    var pricePerPrintedHour = printTimeHours > 0 ? recommendedPrice / printTimeHours : null;

    // ---------- M: minimum viable price ----------
    var minimumViablePrice = platformFeeRate >= 1 ? null : costBeforeFees / (1 - platformFeeRate);

    // ---------- N: price per part ----------
    var pricePerPart = printedParts > 0 ? recommendedPrice / printedParts : null;

    // ---------- Render dominant result + interpretation ----------
    el('sp-res-price').textContent = formatMoney(recommendedPrice);
    el('sp-res-interpretation').textContent =
      'At this price, the job covers estimated production costs and platform fees while targeting a ' +
      formatPct(profitMargin) +
      ' profit margin.';

    // ---------- Render supporting metrics ----------
    el('sp-res-min-price').textContent = minimumViablePrice === null ? '—' : formatMoney(minimumViablePrice);
    el('sp-res-profit').textContent = formatMoney(expectedProfit);
    el('sp-res-margin').textContent = formatPct(profitMargin);
    el('sp-res-hourly').textContent = effectiveHourlyEarnings === null ? '—' : formatMoney(effectiveHourlyEarnings);
    el('sp-res-price-per-hour').textContent = pricePerPrintedHour === null ? '—' : formatMoney(pricePerPrintedHour);
    el('sp-res-price-per-part').textContent = pricePerPart === null ? '—' : formatMoney(pricePerPart);

    // ---------- Render cost breakdown ----------
    setBreakdownCell('sp-bd-material', formatMoney(materialCost));
    setBreakdownCell('sp-bd-electricity', formatMoney(electricityCost));
    setBreakdownCell('sp-bd-depreciation', formatMoney(depreciationCost));
    setBreakdownCell('sp-bd-labor', formatMoney(laborCost));
    setBreakdownCell('sp-bd-overhead', formatMoney(overheadPerJob));
    setBreakdownCell('sp-bd-failure', formatMoney(failureAllowanceCost));
    setBreakdownCell('sp-bd-cost-before-fees', formatMoney(costBeforeFees));
    setBreakdownCell('sp-bd-platform-fee', formatMoney(platformFee));
    setBreakdownCell('sp-bd-price', formatMoney(recommendedPrice));

    el('sp-results').hidden = false;
    var pdfBtn = el('btn-pdf');
    if (pdfBtn) pdfBtn.disabled = false;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    run();
  });

  window.getCalculatorPdfData = function () {
    return {
      title: '3D Print Service Pricing Calculator Results',
      sections: [
        {
          heading: 'Inputs',
          rows: [
            { label: 'Material used (grams)', value: el('sp-material-grams').value },
            { label: 'Material price ($/kg)', value: el('sp-material-price').value },
            { label: 'Print time (hours)', value: el('sp-print-time').value },
            { label: 'Printed parts', value: el('sp-printed-parts').value },
            { label: 'Target profit margin (%)', value: el('sp-target-margin').value },
            { label: 'Platform fee (%)', value: el('sp-platform-fee').value }
          ]
        },
        {
          heading: 'Results',
          rows: [
            { label: 'Recommended price', value: el('sp-res-price').textContent },
            { label: 'Minimum viable price', value: el('sp-res-min-price').textContent },
            { label: 'Expected profit', value: el('sp-res-profit').textContent },
            { label: 'Profit margin', value: el('sp-res-margin').textContent },
            { label: 'Effective hourly earnings', value: el('sp-res-hourly').textContent },
            { label: 'Price per printed hour', value: el('sp-res-price-per-hour').textContent },
            { label: 'Price per part', value: el('sp-res-price-per-part').textContent }
          ]
        }
      ],
      disclaimer: 'For informational purposes only. Not financial or investment advice.'
    };
  };
})();
