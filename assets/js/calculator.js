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
    var S = window.CalcI18n && window.CalcI18n.isEs() ? window.CalcI18n.S : null;
    if (initial <= 0) return { ok: false, msg: S ? S.roiAlertInitial : 'Initial investment must be positive' };
    if (!isReverse && finalVal < 0) return { ok: false, msg: S ? S.roiAlertFinal : 'Final value cannot be negative' };
    if (years <= 0) return { ok: false, msg: S ? S.roiAlertPeriod : 'Period must be positive' };
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
    if (window.CalcI18n && window.CalcI18n.isEs()) return window.CalcI18n.formatPct(n, 2);
    return n.toFixed(2) + '%';
  }

  function formatMoney(n) {
    if (window.CalcI18n && window.CalcI18n.isEs()) return window.CalcI18n.formatMoney(n, 2);
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
    if (window.CalcI18n && window.CalcI18n.isEs()) return window.CalcI18n.formatMoney(Number(n), 2);
    return '$' + Number(n).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }

  function renderAeoAnswer(initial, finalValue, years, results) {
    if (!window.CalculationAnswerBlock || typeof window.CalculationAnswerBlock.renderCalculationAnswer !== 'function') {
      return;
    }
    var es = window.CalcI18n && window.CalcI18n.isEs();
    var S = es ? window.CalcI18n.S : null;
    window.CalculationAnswerBlock.renderCalculationAnswer({
      containerId: 'aeo-answer',
      config: {
        question: S ? S.roiAeoQuestion : 'What ROI and annualized return does this scenario produce?',
        buildInterpretationParagraph: function (p, v, r) {
          var roiNum = typeof r.roi === 'number' && isFinite(r.roi) ? r.roi : NaN;
          var roi =
            typeof r.roi === 'number' && isFinite(r.roi) ? (es ? window.CalcI18n.formatNumber(r.roi, 2, 2) : r.roi.toFixed(2)) : '—';
          var ann =
            typeof r.annualized === 'number' && isFinite(r.annualized)
              ? es
                ? window.CalcI18n.formatNumber(r.annualized, 2, 2)
                : r.annualized.toFixed(2)
              : '—';

          var interpretation = '';
          if (!isNaN(roiNum)) {
            if (roiNum < 0) {
              interpretation = S ? S.roiTierNeg : ' This represents a negative return.';
            } else if (roiNum < 50) {
              interpretation = S ? S.roiTierMod : ' This is a moderate return.';
            } else if (roiNum < 150) {
              interpretation = S ? S.roiTierStrong : ' This is a strong return.';
            } else {
              interpretation = S ? S.roiTierHigh : ' This is a very high return.';
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

          if (S) {
            appendText(
              S.roiAeoLead(
                fmtSentenceMoney(v.initialInvestment),
                fmtSentenceMoney(v.finalValue),
                v.years,
                roi,
                ann
              )
            );
            appendText(interpretation);
            appendText(S.roiAeoTail);
          } else {
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
            appendText(' This result can be compared to other financial metrics such as ');
            appendLink('/learn/roi-vs-irr.html', 'ROI vs IRR');
            appendText(' or ');
            appendLink('/real-estate/cap-rate-calculator.html', 'cap rate calculator');
            appendText(', depending on the type of investment.');
          }
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
    var Sd = window.CalcI18n && window.CalcI18n.isEs() ? window.CalcI18n.S : null;
    resultRoi.setAttribute('data-label', Sd ? Sd.roiDataLabelRoi : 'Return on Investment');
    resultAnnualized.setAttribute('data-label', Sd ? Sd.roiDataLabelAnn : 'Annualized Return');
    resultProfit.setAttribute('data-label', Sd ? Sd.roiDataLabelProfit : 'Total Profit');
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
      var Sr0 = window.CalcI18n && window.CalcI18n.isEs() ? window.CalcI18n.S : null;
      finalLabel.textContent = reverseModeCheckbox.checked
        ? Sr0
          ? Sr0.roiTargetLabel
          : 'Target ROI (%)'
        : Sr0
          ? Sr0.roiFinalLabel
          : 'Final Value ($)';
    }
  }

  reverseModeCheckbox.addEventListener('change', function () {
    hasInteracted = true;
    if (finalLabel) {
      var Sr = window.CalcI18n && window.CalcI18n.isEs() ? window.CalcI18n.S : null;
      finalLabel.textContent = this.checked
        ? Sr
          ? Sr.roiTargetLabel
          : 'Target ROI (%)'
        : Sr
          ? Sr.roiFinalLabel
          : 'Final Value ($)';
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
  window.getCalculatorPdfData = function () {
    var initial = parseNum(initialInput.value);
    var finalValue = parseNum(finalInput.value);
    var years = parseNum(periodInput.value);
    var Sp = window.CalcI18n && window.CalcI18n.isEs() ? window.CalcI18n.S : null;
    return {
      title: Sp ? Sp.roiPdfTitle : 'ROI Calculator Results',
      sections: [
        {
          heading: Sp ? Sp.inputs : 'Inputs',
          rows: [
            {
              label: Sp ? Sp.roiPdfInitial : 'Initial Investment',
              value: formatMoney(initial)
            },
            {
              label: Sp ? Sp.roiPdfFinal : 'Final Value',
              value: formatMoney(finalValue)
            },
            { label: Sp ? Sp.roiPdfPeriod : 'Period (years)', value: years }
          ]
        },
        {
          heading: Sp ? Sp.results : 'Results',
          rows: [
            { label: Sp ? Sp.roiPdfRoi : 'ROI', value: resultRoi.textContent },
            { label: Sp ? Sp.roiPdfAnn : 'Annualized ROI', value: resultAnnualized.textContent },
            { label: Sp ? Sp.roiPdfProfit : 'Total Profit', value: resultProfit.textContent }
          ]
        }
      ],
      disclaimer: Sp ? Sp.disclaimer : 'For educational purposes only. Not financial advice.'
    };
  };
})();
