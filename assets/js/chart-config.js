(function () {
  'use strict';

  var chartInstance = null;
  var canvas = document.getElementById('projection-chart');

  function buildProjectionData(initial, finalValue, years) {
    var labels = [];
    var investmentLine = [];
    var growthLine = [];
    var yearsNum = Math.min(Math.max(years, 0.1), 5);
    if (yearsNum <= 0) yearsNum = 5;
    var annualRate = yearsNum > 0 ? Math.pow(finalValue / initial, 1 / yearsNum) : 1;

    for (var i = 0; i <= 5; i++) {
      labels.push('Year ' + i);
      investmentLine.push(i === 0 ? initial : initial);
      growthLine.push(initial * Math.pow(annualRate, i));
    }

    return { labels: labels, investmentLine: investmentLine, growthLine: growthLine };
  }

  function updateChart(data) {
    if (!canvas || typeof Chart === 'undefined') return;

    var initial = data.initial || 0;
    var finalValue = data.finalValue || 0;
    var years = data.years || 1;
    var projected = buildProjectionData(initial, finalValue, years);

    if (chartInstance) {
      chartInstance.data.labels = projected.labels;
      chartInstance.data.datasets[0].data = projected.investmentLine;
      chartInstance.data.datasets[1].data = projected.growthLine;
      chartInstance.update('none');
      return;
    }

    chartInstance = new Chart(canvas, {
      type: 'line',
      data: {
        labels: projected.labels,
        datasets: [
          {
            label: 'Initial Investment',
            data: projected.investmentLine,
            borderColor: '#94a3b8',
            backgroundColor: 'transparent',
            borderDash: [5, 5],
            fill: false,
            tension: 0
          },
          {
            label: 'Projected Value',
            data: projected.growthLine,
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            fill: true,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        },
        scales: {
          x: {
            grid: { display: false }
          },
          y: {
            beginAtZero: false,
            ticks: {
              callback: function (val) {
                return '$' + (val / 1000).toFixed(0) + 'k';
              }
            }
          }
        }
      }
    });
  }

  window.updateChart = updateChart;
})();
