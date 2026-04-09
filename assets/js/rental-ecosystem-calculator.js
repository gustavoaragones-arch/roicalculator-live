(function () {
  'use strict';

  var form = document.getElementById('rp-roi-form');
  if (!form) return;

  var el = function (id) {
    return document.getElementById(id);
  };

  function parseNum(val) {
    var n = parseFloat(String(val).replace(/[^0-9.-]/g, ''));
    return isNaN(n) ? 0 : n;
  }

  function monthlyPayment(principal, annualRatePct, termYears) {
    if (principal <= 0) return 0;
    var r = annualRatePct / 100 / 12;
    var n = Math.round(termYears * 12);
    if (n <= 0) return 0;
    if (r <= 0) return principal / n;
    return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  function loanBalanceAfter(principal, annualRatePct, termYears, yearsPaid) {
    if (principal <= 0) return 0;
    var r = annualRatePct / 100 / 12;
    var n = Math.round(termYears * 12);
    var p = Math.min(Math.round(yearsPaid * 12), n);
    if (p >= n) return 0;
    if (r <= 0) return principal * (1 - p / n);
    var pow = Math.pow(1 + r, n);
    return principal * ((pow - Math.pow(1 + r, p)) / (pow - 1));
  }

  function formatMoney(n) {
    return '$' + n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  function formatPct(n) {
    return n.toFixed(2) + '%';
  }

  var chartInstance = null;

  function run() {
    var purchase = parseNum(el('rp-purchase').value);
    var down = parseNum(el('rp-down').value);
    var monthlyRent = parseNum(el('rp-rent').value);
    var monthlyExp = parseNum(el('rp-expenses').value);
    var vacancyPct = parseNum(el('rp-vacancy').value);
    var appreciationPct = parseNum(el('rp-appreciation').value);
    var years = parseNum(el('rp-years').value);
    var ratePct = parseNum(el('rp-rate').value);
    var termYears = parseNum(el('rp-term').value);

    if (purchase <= 0) {
      alert('Purchase price must be positive.');
      return;
    }
    if (down < 0 || down > purchase) {
      alert('Down payment must be between zero and purchase price.');
      return;
    }
    if (years <= 0) {
      alert('Holding period must be positive.');
      return;
    }

    var loan = purchase - down;
    var pi = monthlyPayment(loan, ratePct, termYears);
    var vac = vacancyPct / 100;
    var effRent = monthlyRent * (1 - vac);
    var monthlyCF = effRent - monthlyExp - pi;
    var annualCF = monthlyCF * 12;

    var app = appreciationPct / 100;
    var cumCF = annualCF * years;

    var saleValue = purchase * Math.pow(1 + app, years);
    var balEnd = loanBalanceAfter(loan, ratePct, termYears, years);
    var saleProceeds = saleValue - balEnd;
    var totalProfit = cumCF + saleProceeds - down;
    var roiPct = down > 0 ? (totalProfit / down) * 100 : 0;
    var equityEnd = saleValue - balEnd;
    var equityGained = equityEnd - down;

    el('rp-result-roi').textContent = formatPct(roiPct);
    el('rp-result-annual-cf').textContent = formatMoney(annualCF);
    el('rp-result-profit').textContent = formatMoney(totalProfit);
    if (el('rp-result-equity')) el('rp-result-equity').textContent = formatMoney(equityGained);

    var panel = el('rp-results-panel');
    if (panel) panel.hidden = false;

    var chartMaxYear = years > 5 ? 5 : Math.max(Math.ceil(years), 1);

    var labels = [];
    var cumSeries = [];
    var valueSeries = [];
    var i;
    for (i = 0; i <= chartMaxYear; i++) {
      labels.push('Year ' + i);
      if (i === 0) {
        cumSeries.push(0);
        valueSeries.push(purchase);
      } else {
        var t = Math.min(i, years);
        cumSeries.push(annualCF * t);
        valueSeries.push(purchase * Math.pow(1 + app, t));
      }
    }

    var canvas = el('rp-projection-chart');
    if (!canvas || typeof window.Chart === 'undefined') {
      return;
    }

    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }

    chartInstance = new window.Chart(canvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Cumulative cash flow',
            data: cumSeries,
            borderColor: '#94a3b8',
            borderDash: [5, 5],
            fill: false,
            tension: 0.2
          },
          {
            label: 'Property value',
            data: valueSeries,
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            fill: true,
            tension: 0.2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#e6edf3' }
          }
        },
        scales: {
          x: {
            ticks: { color: '#9ca3af' },
            grid: { color: '#1e293b' }
          },
          y: {
            ticks: {
              color: '#9ca3af',
              callback: function (v) {
                return '$' + (v / 1000).toFixed(0) + 'k';
              }
            },
            grid: { color: '#1e293b' }
          }
        }
      }
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    run();
  });
})();
