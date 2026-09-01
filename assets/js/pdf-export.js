/**
 * Reusable "Download PDF" utility for calculator pages.
 * Client-side only: opens a blank window, writes a minimal HTML summary into
 * it, and invokes the browser's native print dialog (the user chooses "Save
 * as PDF" as the destination) — no PDF library, no server call.
 *
 * Contract: any page using this script must define
 *   window.getCalculatorPdfData()
 * returning { title, sections: [{ heading, rows: [{ label, value }] }], disclaimer }
 * and must have a <button id="btn-pdf">Download PDF</button>.
 */
(function () {
  'use strict';

  var btn = document.getElementById('btn-pdf');
  if (!btn) return;

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  btn.addEventListener('click', function () {
    if (typeof window.getCalculatorPdfData !== 'function') return;
    var data = window.getCalculatorPdfData();
    if (!data) return;

    var dateStr = new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    var title = data.title || 'Calculator Results';

    var html = '<html><head><title>' + escapeHtml(title) + '</title>';
    html += '<style>body{font-family:sans-serif;max-width:600px;margin:2rem auto;padding:1rem;} h1{font-size:1.25rem;} h2{font-size:1rem;margin-top:1.5rem;} p{margin:0.35rem 0;}</style>';
    html += '</head><body>';
    html += '<h1>' + escapeHtml(title) + '</h1>';
    html += '<p><strong>roicalculator.live</strong> — ' + escapeHtml(dateStr) + '</p>';

    (data.sections || []).forEach(function (section) {
      if (section.heading) {
        html += '<h2>' + escapeHtml(section.heading) + '</h2>';
      }
      (section.rows || []).forEach(function (row) {
        var value = row.value != null && row.value !== '' ? row.value : '—';
        html += '<p>' + escapeHtml(row.label) + ': ' + escapeHtml(value) + '</p>';
      });
    });

    if (data.disclaimer) {
      html += '<p style="margin-top:2rem;font-size:0.875rem;color:#666;">' + escapeHtml(data.disclaimer) + '</p>';
    }
    html += '</body></html>';

    var printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to download the PDF.');
      return;
    }
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.onafterprint = function () {
      printWindow.close();
    };
  });
})();
