/**
 * CAC vs LTV ROI calculator — shared engine (extracted from inline HTML for EN/ES reuse).
 * Math unchanged from the Phase 10 page implementation.
 */
(function () {
  'use strict';

  function boot() {
    var form = document.getElementById('cac-ltv-form');
    if (!form) return;

    var parse =
      window.mktParseNum ||
      function (v) {
        return parseFloat(String(v).replace(/[^0-9.-]/g, '')) || 0;
      };
    var fmt =
      window.mktFormatMoney ||
      function (n) {
        return '$' + n.toLocaleString(undefined, { minimumFractionDigits: 0 });
      };
    var fmtPct =
      window.mktFormatPct ||
      function (n) {
        return n.toFixed(2) + '%';
      };
    var cacLtvChart = null;

    function run() {
      var cac = parse(document.getElementById('cac').value);
      var arpu = parse(document.getElementById('arpu').value);
      var margin = parse(document.getElementById('margin').value) / 100;
      var lifespan = Math.max(1, Math.floor(parse(document.getElementById('lifespan').value)));
      if (cac <= 0 || arpu <= 0) return;
      var monthlyProfit = arpu * margin;
      var ltv = monthlyProfit * lifespan;
      var ratio = cac > 0 ? ltv / cac : 0;
      var roi = cac > 0 ? ((ltv - cac) / cac) * 100 : 0;
      var payback = monthlyProfit > 0 ? cac / monthlyProfit : 0;
      document.getElementById('ltv').textContent = fmt(ltv);
      document.getElementById('ratio').textContent = ratio.toFixed(2) + ':1';
      document.getElementById('roi').textContent = fmtPct(roi);
      document.getElementById('payback').textContent = payback.toFixed(1);
      var S = window.CalcI18n && window.CalcI18n.isEs() ? window.CalcI18n.S : null;
      document.getElementById('cac-ltv-interpretation').textContent = S
        ? S.cacInterp(fmt(ltv), fmt(cac), ratio.toFixed(2), fmtPct(roi), payback.toFixed(1))
        : 'At these assumptions, LTV is ' +
          fmt(ltv) +
          ' against a CAC of ' +
          fmt(cac) +
          ' — an LTV:CAC ratio of ' +
          ratio.toFixed(2) +
          ':1 and an ROI of ' +
          fmtPct(roi) +
          ', with payback in ' +
          payback.toFixed(1) +
          ' months.';
      var pdfBtn = document.getElementById('btn-pdf');
      if (pdfBtn) pdfBtn.disabled = false;
      var months = Math.min(60, Math.max(lifespan + 6, 24));
      var labels = [];
      var revLine = [];
      var costLine = [];
      for (var i = 0; i <= months; i++) {
        labels.push(i);
        revLine.push(i <= lifespan ? monthlyProfit * i : ltv);
        costLine.push(cac);
      }
      var canvas = document.getElementById('cac-ltv-chart');
      if (canvas && typeof Chart !== 'undefined') {
        if (cacLtvChart) cacLtvChart.destroy();
        cacLtvChart = new Chart(canvas, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [
              {
                label: S ? S.cacChartProfit : 'Cumulative gross profit',
                data: revLine,
                borderColor: '#2563eb',
                fill: true,
                backgroundColor: 'rgba(37,99,235,0.1)'
              },
              {
                label: S ? S.cacChartCac : 'CAC',
                data: costLine,
                borderColor: '#94a3b8',
                borderDash: [5, 5],
                fill: false
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } },
            scales: {
              x: { title: { display: true, text: S ? S.cacChartMonths : 'Months' } },
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function (v) {
                    if (window.CalcI18n && window.CalcI18n.isEs()) return window.CalcI18n.formatCompactAxis(v);
                    return '$' + v / 1000 + 'k';
                  }
                }
              }
            }
          }
        });
      }
      document.getElementById('cac-ltv-results').hidden = false;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      run();
    });
    run();

    window.getCalculatorPdfData = function () {
      var Sp = window.CalcI18n && window.CalcI18n.isEs() ? window.CalcI18n.S : null;
      return {
        title: Sp ? Sp.cacPdfTitle : 'CAC vs LTV ROI Calculator Results',
        sections: [
          {
            heading: Sp ? Sp.inputs : 'Inputs',
            rows: [
              { label: Sp ? Sp.cacPdfCac : 'Customer Acquisition Cost (CAC)', value: document.getElementById('cac').value },
              {
                label: Sp ? Sp.cacPdfArpu : 'Average Monthly Revenue per User (ARPU)',
                value: document.getElementById('arpu').value
              },
              { label: Sp ? Sp.cacPdfMargin : 'Gross Margin (%)', value: document.getElementById('margin').value },
              {
                label: Sp ? Sp.cacPdfLifespan : 'Average Customer Lifespan (months)',
                value: document.getElementById('lifespan').value
              }
            ]
          },
          {
            heading: Sp ? Sp.results : 'Results',
            rows: [
              { label: Sp ? Sp.cacPdfRoi : 'ROI', value: document.getElementById('roi').textContent },
              { label: Sp ? Sp.cacPdfLtv : 'LTV', value: document.getElementById('ltv').textContent },
              { label: Sp ? Sp.cacPdfRatio : 'LTV:CAC ratio', value: document.getElementById('ratio').textContent },
              {
                label: Sp ? Sp.cacPdfPayback : 'Payback period (months)',
                value: document.getElementById('payback').textContent
              }
            ]
          }
        ],
        disclaimer: Sp ? Sp.disclaimer : 'For informational purposes only. Not financial or investment advice.'
      };
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
