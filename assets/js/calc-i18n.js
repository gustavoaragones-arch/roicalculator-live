/**
 * Phase 12 — locale presentation helpers for Spanish pilot pages.
 * English pages: CalcI18n.isEs() is false; existing formatters/strings unchanged.
 * Spanish pages: set <html lang="es"> and load this script before calculator JS.
 * Formulas are never defined here.
 */
(function (global) {
  'use strict';

  var LOCALE = 'es';

  function isEs() {
    return document.documentElement && document.documentElement.lang === 'es';
  }

  function currencySymbol() {
    var sel = document.getElementById('currency-symbol');
    if (sel && sel.value) return sel.value;
    return isEs() ? '€' : '$';
  }

  function formatNumber(n, minFrac, maxFrac) {
    if (n === null || n === undefined || !isFinite(n)) return '—';
    return Number(n).toLocaleString(LOCALE, {
      minimumFractionDigits: minFrac,
      maximumFractionDigits: maxFrac
    });
  }

  function formatMoney(n, decimals) {
    if (n === null || n === undefined || !isFinite(n)) return '—';
    var d = decimals === undefined ? 2 : decimals;
    var sign = n < 0 ? '-' : '';
    return sign + currencySymbol() + formatNumber(Math.abs(n), d, d);
  }

  function formatPct(n, decimals) {
    if (n === null || n === undefined || !isFinite(n)) return '—';
    var d = decimals === undefined ? 2 : decimals;
    return formatNumber(n, d, d) + ' %';
  }

  function formatCompactAxis(v) {
    return currencySymbol() + (v / 1000).toFixed(0) + 'k';
  }

  var S = {
    // Shared
    pdfPopup: 'Permite las ventanas emergentes para descargar el PDF.',
    pdfFallbackTitle: 'Resultados de la calculadora',
    disclaimer: 'Solo con fines informativos. No constituye asesoramiento financiero ni de inversión.',
    inputs: 'Entradas',
    results: 'Resultados',
    calculate: 'Calcular',
    downloadPdf: 'Descargar PDF',

    // Homepage ROI
    roiAlertInitial: 'La inversión inicial debe ser positiva',
    roiAlertFinal: 'El valor final no puede ser negativo',
    roiAlertPeriod: 'El periodo debe ser positivo',
    roiTargetLabel: 'ROI objetivo (%)',
    roiFinalLabel: 'Valor final',
    roiDataLabelRoi: 'Retorno de la inversión',
    roiDataLabelAnn: 'Retorno anualizado',
    roiDataLabelProfit: 'Beneficio total',
    roiAeoQuestion: '¿Qué ROI y retorno anualizado produce este escenario?',
    roiTierNeg: ' Esto representa un retorno negativo.',
    roiTierMod: ' Este es un retorno moderado.',
    roiTierStrong: ' Este es un retorno sólido.',
    roiTierHigh: ' Este es un retorno muy alto.',
    roiAeoLead: function (initial, finalValue, years, roi, ann) {
      return (
        'Una inversión de ' +
        initial +
        ' que crece hasta ' +
        finalValue +
        ' en ' +
        years +
        ' años produce un ROI del ' +
        roi +
        ' % y un retorno anualizado del ' +
        ann +
        ' %.'
      );
    },
    roiAeoTail: ' Compara este resultado con otras métricas financieras según el tipo de inversión.',
    roiPdfTitle: 'Resultados — Calculadora de ROI',
    roiPdfInitial: 'Inversión inicial',
    roiPdfFinal: 'Valor final',
    roiPdfPeriod: 'Periodo (años)',
    roiPdfRoi: 'ROI',
    roiPdfAnn: 'ROI anualizado',
    roiPdfProfit: 'Beneficio total',

    // Rental
    rpAlertPurchase: 'El precio de compra debe ser positivo.',
    rpAlertDown: 'La entrada debe estar entre cero y el precio de compra.',
    rpAlertYears: 'El periodo de tenencia debe ser positivo.',
    rpInterpBase: function (pct) {
      return (
        'Con los supuestos introducidos, esta propiedad produce un retorno estimado del ' +
        pct +
        ' respecto a la inversión modelada.'
      );
    },
    rpInterpCfPos: function (m) {
      return ' El flujo de caja anual modelado es positivo: ' + m + '.';
    },
    rpInterpCfNeg: function (m) {
      return ' El flujo de caja anual modelado es negativo: ' + m + ', antes de cualquier ingreso por venta.';
    },
    rpInterpProfitPos: function (profit, equity) {
      return (
        ' El beneficio total del periodo de tenencia, incluidos los ingresos por venta, es ' +
        profit +
        ', con ' +
        equity +
        ' de patrimonio ganado por encima de la entrada.'
      );
    },
    rpInterpProfitNeg: function (loss) {
      return (
        ' El beneficio total del periodo de tenencia, incluidos los ingresos por venta, es una pérdida modelada de ' +
        loss +
        '.'
      );
    },
    rpYear: function (i) {
      return 'Año ' + i;
    },
    rpChartCf: 'Flujo de caja acumulado',
    rpChartValue: 'Valor de la propiedad',
    rpPdfTitle: 'Resultados — Calculadora de rentabilidad de alquiler',
    rpPdfPurchase: 'Precio de compra',
    rpPdfDown: 'Entrada',
    rpPdfRent: 'Alquiler mensual',
    rpPdfExpenses: 'Gastos operativos mensuales',
    rpPdfVacancy: 'Tasa de vacancia (%)',
    rpPdfAppreciation: 'Plusvalía anual (%)',
    rpPdfYears: 'Años de tenencia',
    rpPdfRate: 'Tipo de interés (%)',
    rpPdfTerm: 'Plazo de la hipoteca (años)',
    rpPdfRoi: 'ROI',
    rpPdfCf: 'Flujo de caja anual',
    rpPdfProfit: 'Beneficio total',
    rpPdfEquity: 'Patrimonio ganado',

    // Service pricing
    spAlertLife: 'La vida útil esperada de la impresora debe ser mayor que 0 horas.',
    spAlertParts: 'Las piezas impresas deben ser al menos 1.',
    spAlertFailure: 'La reserva por fallos/reimpresiones debe estar entre 0 y 99 %.',
    spAlertFeeMargin: 'La comisión de plataforma y el margen objetivo deben estar dentro de los rangos permitidos.',
    spInvalidFailure:
      'No se puede modelar un coste de producción con una reserva de fallos/reimpresiones del 100 % (o superior): reduce la reserva por debajo del 100 %.',
    spInvalidFeeMargin:
      'La comisión de plataforma/pago y el margen de beneficio objetivo juntos deben ser inferiores al 100 %: reduce uno o ambos para calcular un precio.',
    spInterp: function (marginPct) {
      return (
        'A este precio, el trabajo cubre los costes de producción estimados y las comisiones de plataforma, apuntando a un margen de beneficio del ' +
        marginPct +
        '.'
      );
    },
    spPdfTitle: 'Resultados — Calculadora de precio de servicio de impresión 3D',
    spPdfMaterialG: 'Material usado (gramos)',
    spPdfMaterialPrice: 'Precio del material (por kg)',
    spPdfPrintTime: 'Tiempo de impresión (horas)',
    spPdfParts: 'Piezas impresas',
    spPdfMargin: 'Margen de beneficio objetivo (%)',
    spPdfFee: 'Comisión de plataforma (%)',
    spPdfPrice: 'Precio recomendado',
    spPdfMin: 'Precio mínimo viable',
    spPdfProfit: 'Beneficio esperado',
    spPdfMarginRes: 'Margen de beneficio',
    spPdfHourly: 'Ganancia horaria efectiva',
    spPdfPerHour: 'Precio por hora de impresión',
    spPdfPerPart: 'Precio por pieza',

    // CAC/LTV
    cacInterp: function (ltv, cac, ratio, roi, payback) {
      return (
        'Con estos supuestos, el LTV es ' +
        ltv +
        ' frente a un CAC de ' +
        cac +
        ' — una ratio LTV:CAC de ' +
        ratio +
        ':1 y un ROI del ' +
        roi +
        ', con recuperación en ' +
        payback +
        ' meses.'
      );
    },
    cacChartProfit: 'Beneficio bruto acumulado',
    cacChartCac: 'CAC',
    cacChartMonths: 'Meses',
    cacPdfTitle: 'Resultados — Calculadora CAC vs LTV',
    cacPdfCac: 'Coste de adquisición de cliente (CAC)',
    cacPdfArpu: 'Ingreso medio mensual por usuario (ARPU)',
    cacPdfMargin: 'Margen bruto (%)',
    cacPdfLifespan: 'Vida media del cliente (meses)',
    cacPdfRoi: 'ROI',
    cacPdfLtv: 'LTV',
    cacPdfRatio: 'Ratio LTV:CAC',
    cacPdfPayback: 'Periodo de recuperación (meses)'
  };

  global.CalcI18n = {
    isEs: isEs,
    locale: LOCALE,
    currencySymbol: currencySymbol,
    formatNumber: formatNumber,
    formatMoney: formatMoney,
    formatPct: formatPct,
    formatCompactAxis: formatCompactAxis,
    S: S
  };
})(typeof window !== 'undefined' ? window : globalThis);
