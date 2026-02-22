(function () {
  'use strict';

  var btn = document.getElementById('btn-pdf');
  if (!btn) return;

  btn.addEventListener('click', function () {
    var data = typeof window.getCalculatorData === 'function' ? window.getCalculatorData() : {};
    var dateStr = new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    var content = [
      'ROI Calculator Results',
      'roicalculator.live',
      '---',
      'Date: ' + dateStr,
      '',
      'Inputs:',
      'Initial Investment: ' + (data.initial != null ? '$' + Number(data.initial).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '—'),
      'Final Value: ' + (data.finalValue != null ? '$' + Number(data.finalValue).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '—'),
      'Period (years): ' + (data.years != null ? data.years : '—'),
      '',
      'Results:',
      'ROI: ' + (data.roi || '—'),
      'Annualized ROI: ' + (data.annualizedRoi || '—'),
      'Total Profit: ' + (data.profit || '—'),
      '',
      'For educational purposes only. Not financial advice.'
    ].join('\n');

    var printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to download the PDF.');
      return;
    }
    printWindow.document.write('<html><head><title>ROI Calculator Results</title>');
    printWindow.document.write('<style>body{font-family:sans-serif;max-width:600px;margin:2rem auto;padding:1rem;} h1{font-size:1.25rem;} pre{background:#f5f5f5;padding:1rem;border-radius:6px;}</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write('<h1>ROI Calculator Results</h1>');
    printWindow.document.write('<p><strong>roicalculator.live</strong> — ' + dateStr + '</p>');
    printWindow.document.write('<h2>Inputs</h2>');
    printWindow.document.write('<p>Initial Investment: ' + (data.initial != null ? '$' + Number(data.initial).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '—') + '</p>');
    printWindow.document.write('<p>Final Value: ' + (data.finalValue != null ? '$' + Number(data.finalValue).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '—') + '</p>');
    printWindow.document.write('<p>Period: ' + (data.years != null ? data.years + ' years' : '—') + '</p>');
    printWindow.document.write('<h2>Results</h2>');
    printWindow.document.write('<p>ROI: ' + (data.roi || '—') + '</p>');
    printWindow.document.write('<p>Annualized ROI: ' + (data.annualizedRoi || '—') + '</p>');
    printWindow.document.write('<p>Total Profit: ' + (data.profit || '—') + '</p>');
    printWindow.document.write('<p style="margin-top:2rem;font-size:0.875rem;color:#666;">For educational purposes only. Not financial advice.</p>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.onafterprint = function () { printWindow.close(); };
  });
})();
