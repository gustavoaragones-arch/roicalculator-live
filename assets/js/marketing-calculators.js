(function () {
  'use strict';

  function parseNum(val) {
    var n = parseFloat(String(val).replace(/[^0-9.-]/g, ''));
    return isNaN(n) ? 0 : n;
  }

  function formatPct(n) {
    return n.toFixed(2) + '%';
  }

  function formatMoney(n) {
    return '$' + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  window.mktParseNum = parseNum;
  window.mktFormatPct = formatPct;
  window.mktFormatMoney = formatMoney;
})();
