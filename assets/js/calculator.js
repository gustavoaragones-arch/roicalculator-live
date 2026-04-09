(function () {
  'use strict';

  var form = document.getElementById('roi-form');
  if (!form) return;

  var resultsPanel = document.getElementById('results-panel');
  var resultRoi = document.getElementById('result-roi');
  var resultAnnualized = document.getElementById('result-annualized');
  var resultProfit = document.getElementById('result-profit');
  var reverseModeCheckbox = document.getElementById('reverse-mode');
  var initialInput = document.getElementById('initial-investment');
  var finalInput = document.getElementById('final-value');
  var periodInput = document.getElementById('period-years');
  var finalLabel = document.querySelector('label[for="final-value"]');

  var hasInteracted = false;
  var hasInjectedStructuredData = false;

  var ENGINE_CONFIG = {
    name: 'Main ROI Calculator',
    description: 'Simple ROI, annualized ROI, and profit from initial investment, ending value, and period.',
    formulas: {
      profit: 'finalValue - initialInvestment',
      roi: 'initialInvestment > 0 ? ((finalValue - initialInvestment) / initialInvestment) * 100 : 0',
      annualized:
        'initialInvestment > 0 && years > 0 ? (finalValue <= 0 ? -100 : ((Math.pow(finalValue / initialInvestment, 1 / years) - 1) * 100)) : 0'
    }
  };

  function parseNum(val) {
    var n = parseFloat(String(val).replace(/[^0-9.-]/g, ''));
    return isNaN(n) ? 0 : n;
  }

  function validateInputs(initial, finalVal, years, isReverse) {
    if (initial <= 0) return { ok: false, msg: 'Initial investment must be positive' };
    if (!isReverse && finalVal < 0) return { ok: false, msg: 'Final value cannot be negative' };
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

  function computeResults(initial, finalValue, years) {
    if (window.CalculatorEngine) {
      return window.CalculatorEngine.calculate(ENGINE_CONFIG, {
        initialInvestment: initial,
        finalValue: finalValue,
        years: years
      });
    }
    return {
      profit: finalValue - initial,
      roi: calculateROI(initial, finalValue),
      annualized: calculateAnnualizedROI(initial, finalValue, years)
    };
  }

  function pushURLState(initial, years, isReverse, finalRaw, finalValueComputed) {
    if (!window.CalculatorEngine || !hasInteracted) return;
    window.CalculatorEngine.updateURL({
      initialInvestment: initial,
      finalValue: isReverse ? finalRaw : finalValueComputed,
      years: years,
      reverse: isReverse ? 1 : 0
    });
  }

  function pushStructuredData(initial, finalValue, years, isReverse, finalRaw, results) {
    if (!window.CalculatorEngine) return;
    if (!hasInteracted) return;
    if (hasInjectedStructuredData) return;
    var inputsPayload = {
      initialInvestment: initial,
      finalValue: finalValue,
      years: years,
      reverse: isReverse ? 1 : 0
    };
    if (isReverse) inputsPayload.targetRoiPercent = finalRaw;
    window.CalculatorEngine.injectDatasetJsonLd(ENGINE_CONFIG, inputsPayload, results);
    hasInjectedStructuredData = true;
  }

  function fmtSentenceMoney(n) {
    return '$' + Number(n).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }

  function renderAeoAnswer(initial, finalValue, years, results) {
    if (!window.CalculationAnswerBlock || typeof window.CalculationAnswerBlock.renderCalculationAnswer !== 'function') {
      return;
    }
    window.CalculationAnswerBlock.renderCalculationAnswer({
      containerId: 'aeo-answer',
      config: {
        question:
          'What ROI and annualized return does this scenario produce?',
        buildQuickAnswerParagraph: function (p, v, r) {
          var roiNum = typeof r.roi === 'number' && isFinite(r.roi) ? r.roi : NaN;
          var roi =
            typeof r.roi === 'number' && isFinite(r.roi) ? r.roi.toFixed(2) : '—';
          var ann =
            typeof r.annualized === 'number' && isFinite(r.annualized) ? r.annualized.toFixed(2) : '—';

          var interpretation = '';
          if (!isNaN(roiNum)) {
            if (roiNum < 0) {
              interpretation = ' This represents a negative return.';
            } else if (roiNum < 50) {
              interpretation = ' This is a moderate return.';
            } else if (roiNum < 150) {
              interpretation = ' This is a strong return.';
            } else {
              interpretation = ' This is a very high return.';
            }
          }

          function appendText(s) {
            p.appendChild(document.createTextNode(s));
          }
          function appendLink(href, label) {
            var a = document.createElement('a');
            a.href = href;
            a.textContent = label;
            p.appendChild(a);
          }

          appendText(
            'An investment of ' +
              fmtSentenceMoney(v.initialInvestment) +
              ' growing to ' +
              fmtSentenceMoney(v.finalValue) +
              ' over ' +
              v.years +
              ' years results in an ROI of ' +
              roi +
              '% and an annualized return of ' +
              ann +
              '%.'
          );
          appendText(interpretation);
          appendText(
            ' This result can be compared to other financial metrics such as '
          );
          appendLink('/learn/roi-vs-irr.html', 'ROI vs IRR');
          appendText(' or ');
          appendLink('/real-estate/cap-rate-calculator.html', 'cap rate calculator');
          appendText(', depending on the type of investment.');
        }
      },
      values: {
        initialInvestment: initial,
        finalValue: finalValue,
        years: years
      },
      results: results
    });
  }

  function updateResults(data) {
    resultRoi.textContent = formatPct(data.roi);
    resultAnnualized.textContent = formatPct(data.annualizedRoi);
    resultProfit.textContent = formatMoney(data.profit);
    resultRoi.setAttribute('data-label', 'Return on Investment');
    resultAnnualized.setAttribute('data-label', 'Annualized Return');
    resultProfit.setAttribute('data-label', 'Total Profit');
    resultsPanel.hidden = false;
    if (typeof window.updateChart === 'function') {
      window.updateChart(data);
    }
  }

  function runCalculation(silent) {
    var initial = parseNum(initialInput.value);
    var finalVal = parseNum(finalInput.value);
    var years = parseNum(periodInput.value);
    var isReverse = reverseModeCheckbox.checked;

    var valid = validateInputs(initial, finalVal, years, isReverse);
    if (!valid.ok) {
      if (!silent) window.alert(valid.msg);
      return;
    }

    var finalValue = isReverse ? calculateReverseROI(initial, finalVal, years) : finalVal;
    if (isReverse) {
      finalInput.value = finalValue.toFixed(2);
    }

    var results = computeResults(initial, finalValue, years);

    updateResults({
      initial: initial,
      finalValue: finalValue,
      years: years,
      roi: results.roi,
      annualizedRoi: results.annualized,
      profit: results.profit
    });

    renderAeoAnswer(initial, finalValue, years, results);

    pushURLState(initial, years, isReverse, finalVal, finalValue);
    pushStructuredData(initial, finalValue, years, isReverse, finalVal, results);
  }

  if (window.CalculatorEngine) {
    window.CalculatorEngine.loadFromURL(form);
    if (reverseModeCheckbox && finalLabel) {
      finalLabel.textContent = reverseModeCheckbox.checked ? 'Target ROI (%)' : 'Final Value ($)';
    }
  }

  reverseModeCheckbox.addEventListener('change', function () {
    hasInteracted = true;
    if (finalLabel) {
      finalLabel.textContent = this.checked ? 'Target ROI (%)' : 'Final Value ($)';
    }
    if (this.checked && parseNum(finalInput.value) === 15000) {
      finalInput.value = '10';
    } else if (!this.checked && parseNum(finalInput.value) === 10) {
      finalInput.value = '15000';
    }
    runCalculation(true);
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    hasInteracted = true;
    runCalculation(false);
  });

  [initialInput, finalInput, periodInput].forEach(function (el) {
    if (!el) return;
    el.addEventListener('input', function () {
      hasInteracted = true;
      runCalculation(true);
    });
    el.addEventListener('change', function () {
      hasInteracted = true;
      runCalculation(true);
    });
  });

  runCalculation(true);

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
