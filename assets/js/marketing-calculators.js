(function () {
  'use strict';

  function parseNum(val) {
    var n = parseFloat(String(val).replace(/[^0-9.-]/g, ''));
    return isNaN(n) ? 0 : n;
  }

  function formatPct(n) {
    if (window.CalcI18n && window.CalcI18n.isEs()) return window.CalcI18n.formatPct(n, 2);
    return n.toFixed(2) + '%';
  }

  function formatMoney(n) {
    if (window.CalcI18n && window.CalcI18n.isEs()) return window.CalcI18n.formatMoney(n, 2);
    return '$' + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  window.mktParseNum = parseNum;
  window.mktFormatPct = formatPct;
  window.mktFormatMoney = formatMoney;
})();
