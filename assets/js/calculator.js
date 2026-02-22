(function () {
  'use strict';

  var form = document.getElementById('roi-form');
  var resultsPanel = document.getElementById('results-panel');
  var resultRoi = document.getElementById('result-roi');
  var resultAnnualized = document.getElementById('result-annualized');
  var resultProfit = document.getElementById('result-profit');
  var reverseModeCheckbox = document.getElementById('reverse-mode');
  var initialInput = document.getElementById('initial-investment');
  var finalInput = document.getElementById('final-value');
  var periodInput = document.getElementById('period-years');
  var finalLabel = document.querySelector('label[for="final-value"]');

  function parseNum(val) {
    var n = parseFloat(String(val).replace(/[^0-9.-]/g, ''));
    return isNaN(n) ? 0 : n;
  }

  function validateInputs(initial, finalVal, years) {
    if (initial <= 0) return { ok: false, msg: 'Initial investment must be positive' };
    if (finalVal < 0) return { ok: false, msg: 'Final value cannot be negative' };
    if (years <= 0) return { ok: false, msg: 'Period must be positive' };
    return { ok: true };
  }

  function calculateROI(initial, finalVal) {
    if (initial === 0) return 0;
    return ((finalVal - initial) / initial) * 100;
  }

  function calculateAnnualizedROI(initial, finalVal, years) {
    if (initial <= 0 || years <= 0) return 0;
    if (finalVal <= 0) return -100;
    var ratio = finalVal / initial;
    return (Math.pow(ratio, 1 / years) - 1) * 100;
  }

  function calculateReverseROI(initial, targetRoiPct, years) {
    if (initial <= 0 || years <= 0) return 0;
    var factor = 1 + targetRoiPct / 100;
    return initial * Math.pow(factor, years);
  }

  function formatPct(n) {
    return n.toFixed(2) + '%';
  }

  function formatMoney(n) {
    return '$' + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function updateResults(data) {
    resultRoi.textContent = formatPct(data.roi);
    resultAnnualized.textContent = formatPct(data.annualizedRoi);
    resultProfit.textContent = formatMoney(data.profit);
    resultsPanel.hidden = false;
    if (typeof window.updateChart === 'function') {
      window.updateChart(data);
    }
  }

  reverseModeCheckbox.addEventListener('change', function () {
    if (finalLabel) {
      finalLabel.textContent = this.checked ? 'Target ROI (%)' : 'Final Value ($)';
    }
    if (this.checked && parseNum(finalInput.value) === 15000) {
      finalInput.value = '10';
    } else if (!this.checked && parseNum(finalInput.value) === 10) {
      finalInput.value = '15000';
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var initial = parseNum(initialInput.value);
    var finalVal = parseNum(finalInput.value);
    var years = parseNum(periodInput.value);
    var isReverse = reverseModeCheckbox.checked;

    var valid = validateInputs(initial, isReverse ? 0 : finalVal, years);
    if (!valid.ok) {
      alert(valid.msg);
      return;
    }

    var finalValue;
    if (isReverse) {
      finalValue = calculateReverseROI(initial, finalVal, years);
      finalInput.value = finalValue.toFixed(2);
    } else {
      finalValue = finalVal;
    }

    var roi = calculateROI(initial, finalValue);
    var annualizedRoi = calculateAnnualizedROI(initial, finalValue, years);
    var profit = finalValue - initial;

    updateResults({
      initial: initial,
      finalValue: finalValue,
      years: years,
      roi: roi,
      annualizedRoi: annualizedRoi,
      profit: profit
    });
  });

  function runCalculation() {
    var initial = parseNum(initialInput.value);
    var finalVal = parseNum(finalInput.value);
    var years = parseNum(periodInput.value);
    var isReverse = reverseModeCheckbox.checked;
    var valid = validateInputs(initial, finalVal, years);
    if (!valid.ok) return;
    var finalValue = isReverse ? calculateReverseROI(initial, finalVal, years) : finalVal;
    if (isReverse) finalInput.value = finalValue.toFixed(2);
    var roi = calculateROI(initial, finalValue);
    var annualizedRoi = calculateAnnualizedROI(initial, finalValue, years);
    var profit = finalValue - initial;
    updateResults({
      initial: initial,
      finalValue: finalValue,
      years: years,
      roi: roi,
      annualizedRoi: annualizedRoi,
      profit: profit
    });
  }

  runCalculation();

  window.calculateROI = calculateROI;
  window.calculateAnnualizedROI = calculateAnnualizedROI;
  window.calculateReverseROI = calculateReverseROI;
  window.getCalculatorData = function () {
    return {
      initial: parseNum(initialInput.value),
      finalValue: parseNum(finalInput.value),
      years: parseNum(periodInput.value),
      roi: resultRoi.textContent,
      annualizedRoi: resultAnnualized.textContent,
      profit: resultProfit.textContent
    };
  };
})();
