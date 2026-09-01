(function () {
  'use strict';

  var form = document.getElementById('saas-cluster-form');
  if (!form) return;

  function el(id) {
    return document.getElementById(id);
  }

  function parseNum(val) {
    var n = parseFloat(String(val).replace(/[^0-9.-]/g, ''));
    return isNaN(n) ? 0 : n;
  }

  function formatMoney(n) {
    return '$' + n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  function formatPct(n) {
    return n.toFixed(1) + '%';
  }

  function formatPaybackMonths(m) {
    if (m === 0) return 'Immediate';
    if (m === null || m === undefined || !isFinite(m) || m < 0) return '—';
    if (m < 1) return (m * 30).toFixed(0) + ' days';
    if (m < 18) return m.toFixed(1) + ' mo';
    return (m / 12).toFixed(1) + ' yr';
  }

  /**
   * Dynamically generated interpretation sentence. Describes the calculation
   * result — it does not recommend a business decision or apply an
   * unsupported quality threshold (e.g. "excellent ROI"), since this
   * calculator has no defensible threshold model. See
   * reports/audits/MASTER-DIAGNOSTIC.md and the Phase 2 brief, Step 6.
   */
  function buildInterpretation(roiPct, netProfit, paybackMonths) {
    if (!isFinite(roiPct)) {
      return 'At the assumptions entered, this investment’s return cannot be computed because the modeled total cost is zero.';
    }
    var base =
      'At the assumptions entered, this investment produces an estimated ' +
      formatPct(roiPct) +
      ' return relative to its modeled cost.';
    var extension;
    if (netProfit < 0) {
      extension =
        ' The modeled result over this horizon is a net loss of ' +
        formatMoney(Math.abs(netProfit)) +
        '.';
    } else if (paybackMonths === null || paybackMonths === undefined || !isFinite(paybackMonths) || paybackMonths < 0) {
      extension =
        ' Based on these inputs, the ongoing subscription cost offsets enough of the modeled monthly benefit that the implementation cost is not recovered from net benefit.';
    } else {
      extension =
        ' At this rate, the implementation cost is modeled to be recovered (payback) in ' +
        formatPaybackMonths(paybackMonths) +
        '.';
    }
    return base + extension;
  }

  var chartInstance = null;

  function toggleMode() {
    var rev = el('saas-revenue-mode').checked;
    el('saas-time-fields').hidden = rev;
    el('saas-revenue-field').hidden = !rev;
  }

  if (el('saas-revenue-mode')) {
    el('saas-revenue-mode').addEventListener('change', toggleMode);
    toggleMode();
  }

  function run() {
    var employees = parseNum(el('saas-employees').value);
    var wage = parseNum(el('saas-wage').value);
    var hoursWeek = parseNum(el('saas-hours-week').value);
    var monthly = parseNum(el('saas-monthly').value);
    var implementation = parseNum(el('saas-impl').value);
    var years = parseNum(el('saas-years').value);
    var revenueMode = el('saas-revenue-mode').checked;
    var revenueAnnual = parseNum(el('saas-revenue-annual').value);

    if (!revenueMode && (employees < 1 || !Number.isFinite(employees))) {
      alert('Number of employees must be at least 1.');
      return;
    }
    if (years <= 0) {
      alert('Time horizon must be positive.');
      return;
    }
    if (monthly < 0 || implementation < 0) {
      alert('Monthly cost and implementation cannot be negative.');
      return;
    }

    var annualValue;
    if (revenueMode) {
      if (revenueAnnual <= 0) {
        alert('Enter a positive annual revenue increase, or turn off revenue mode.');
        return;
      }
      annualValue = revenueAnnual;
    } else {
      if (wage < 0 || hoursWeek < 0) {
        alert('Wage and hours cannot be negative.');
        return;
      }
      annualValue = employees * wage * hoursWeek * 52;
    }

    var totalSubscription = monthly * 12 * years;
    var totalCost = totalSubscription + implementation;
    var totalValue = annualValue * years;
    var netProfit = totalValue - totalCost;
    var roiPct = totalCost > 0 ? (netProfit / totalCost) * 100 : NaN;

    // Payback = time to recover the one-time implementation cost from NET
    // monthly benefit, i.e. gross monthly value created minus the ongoing
    // monthly subscription cost paid during that same window. Netting out
    // the subscription cost (rather than dividing implementation by gross
    // monthly value alone) is required for this to be a true payback period
    // — see reports/audits/AUDIT-03-CALCULATOR-PRODUCT.md §4.1.
    var monthlyValue = annualValue / 12;
    var netMonthlyBenefit = monthlyValue - monthly;
    var paybackMonths;
    if (implementation <= 0) {
      paybackMonths = 0;
    } else if (netMonthlyBenefit > 0) {
      paybackMonths = implementation / netMonthlyBenefit;
    } else {
      // Ongoing subscription cost consumes all (or more than all) of the
      // gross monthly value created, so the implementation cost is never
      // recovered from net benefit under these assumptions.
      paybackMonths = null;
    }

    el('saas-res-roi').textContent = isFinite(roiPct) ? formatPct(roiPct) : '—';
    el('saas-res-annual-value').textContent = formatMoney(annualValue);
    el('saas-res-total-cost').textContent = formatMoney(totalCost);
    el('saas-res-net').textContent = formatMoney(netProfit);
    el('saas-res-payback').textContent = formatPaybackMonths(paybackMonths);

    var interpretationEl = el('saas-res-interpretation');
    if (interpretationEl) {
      interpretationEl.textContent = buildInterpretation(roiPct, netProfit, paybackMonths);
    }

    el('saas-cluster-results').hidden = false;
    var pdfBtn = el('btn-pdf');
    if (pdfBtn) pdfBtn.disabled = false;

    var chartYears = Math.min(5, Math.max(1, Math.ceil(years)));
    var labels = [];
    var valSeries = [];
    var costSeries = [];
    for (var y = 1; y <= chartYears; y++) {
      labels.push('Year ' + y);
      valSeries.push(annualValue * y);
      costSeries.push(implementation + monthly * 12 * y);
    }

    var canvas = el('saas-projection-chart');
    if (canvas && typeof window.Chart !== 'undefined') {
      if (chartInstance) chartInstance.destroy();
      chartInstance = new window.Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Cumulative value created',
              data: valSeries,
              borderColor: 'rgb(16, 185, 129)',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              fill: true,
              tension: 0.15
            },
            {
              label: 'Cumulative cost (impl. + subscription)',
              data: costSeries,
              borderColor: 'rgb(161, 161, 170)',
              backgroundColor: 'rgba(161, 161, 170, 0.05)',
              fill: false,
              tension: 0.15
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#a1a1aa' } }
          },
          scales: {
            x: { ticks: { color: '#a1a1aa' }, grid: { color: 'rgba(255,255,255,0.06)' } },
            y: {
              ticks: {
                color: '#a1a1aa',
                callback: function (v) {
                  if (Math.abs(v) >= 1000) return '$' + (v / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
                  return '$' + v;
                }
              },
              grid: { color: 'rgba(255,255,255,0.06)' }
            }
          }
        }
      });
    }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    run();
  });

  window.getCalculatorPdfData = function () {
    var revenueMode = el('saas-revenue-mode') && el('saas-revenue-mode').checked;
    var inputRows = revenueMode
      ? [{ label: 'Annual revenue increase', value: el('saas-revenue-annual').value }]
      : [
          { label: 'Number of employees affected', value: el('saas-employees').value },
          { label: 'Average hourly wage', value: el('saas-wage').value },
          { label: 'Hours saved per week (per employee)', value: el('saas-hours-week').value }
        ];
    inputRows.push(
      { label: 'Monthly SaaS cost', value: el('saas-monthly').value },
      { label: 'Implementation cost', value: el('saas-impl').value },
      { label: 'Time horizon (years)', value: el('saas-years').value }
    );
    return {
      title: 'SaaS ROI Calculator Results',
      sections: [
        { heading: 'Inputs', rows: inputRows },
        {
          heading: 'Results',
          rows: [
            { label: 'Estimated ROI', value: el('saas-res-roi').textContent },
            { label: 'Annual value created', value: el('saas-res-annual-value').textContent },
            { label: 'Total cost', value: el('saas-res-total-cost').textContent },
            { label: 'Net profit', value: el('saas-res-net').textContent },
            { label: 'Payback period', value: el('saas-res-payback').textContent }
          ]
        }
      ],
      disclaimer: 'For informational purposes only. Not financial or investment advice.'
    };
  };
})();
