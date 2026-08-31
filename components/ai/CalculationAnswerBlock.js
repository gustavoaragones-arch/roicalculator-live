/**
 * Renders calculator result interpretation for semantic HTML / schema.org.
 * Plain prose — no "Quick Answer" label or SEO callout styling.
 */
(function (global) {
  'use strict';

  /**
   * @param {object} opts
   * @param {string} opts.containerId
   * @param {object} [opts.config]
   * @param {string} [opts.config.question] — optional interpretation heading
   * @param {function(object, object): string} [opts.config.answerTemplate]
   * @param {function(HTMLParagraphElement, object, object): void} [opts.config.buildInterpretationParagraph]
   * @param {function(HTMLParagraphElement, object, object): void} [opts.config.buildQuickAnswerParagraph] — legacy alias
   * @param {{text:string, href:string}[]} [opts.config.internalLinks]
   */
  function renderCalculationAnswer(opts) {
    var container = document.getElementById(opts.containerId);
    if (!container) return;

    var config = opts.config || {};
    var values = opts.values || {};
    var results = opts.results || {};
    var buildParagraph =
      typeof config.buildInterpretationParagraph === 'function'
        ? config.buildInterpretationParagraph
        : typeof config.buildQuickAnswerParagraph === 'function'
          ? config.buildQuickAnswerParagraph
          : null;
    var sentence = '';
    var useRich = Boolean(buildParagraph);

    if (!useRich) {
      if (typeof config.answerTemplate === 'function') {
        sentence = config.answerTemplate(values, results);
      } else {
        sentence = Object.keys(results)
          .map(function (k) {
            return k + ': ' + results[k];
          })
          .join(', ');
      }
    }

    container.textContent = '';
    container.className = 'calc-result-explanation';
    container.setAttribute('aria-live', 'polite');

    if (config.question) {
      container.setAttribute('itemscope', '');
      container.setAttribute('itemtype', 'https://schema.org/Question');

      var heading = document.createElement('h4');
      heading.className = 'calc-result-explanation-heading';
      heading.setAttribute('itemprop', 'name');
      heading.textContent = config.question;
      container.appendChild(heading);

      var answerHolder = document.createElement('div');
      answerHolder.setAttribute('itemprop', 'acceptedAnswer');
      answerHolder.setAttribute('itemscope', '');
      answerHolder.setAttribute('itemtype', 'https://schema.org/Answer');

      var p = document.createElement('p');
      p.className = 'calc-result-explanation-text';
      p.setAttribute('itemprop', 'text');
      fillInterpretationParagraph(p, buildParagraph, sentence, useRich, values, results);
      answerHolder.appendChild(p);

      if (!useRich) {
        appendInternalLinks(answerHolder, config.internalLinks);
      }

      container.appendChild(answerHolder);
    } else {
      var p2 = document.createElement('p');
      p2.className = 'calc-result-explanation-text';
      fillInterpretationParagraph(p2, buildParagraph, sentence, useRich, values, results);
      container.appendChild(p2);
      if (!useRich) {
        appendInternalLinks(container, config.internalLinks);
      }
    }
  }

  function fillInterpretationParagraph(p, buildParagraph, sentence, useRich, values, results) {
    if (useRich) {
      buildParagraph(p, values, results);
    } else {
      p.appendChild(document.createTextNode(sentence));
    }
  }

  function appendInternalLinks(parent, links) {
    if (!links || !links.length) return;
    var pLinks = document.createElement('p');
    pLinks.className = 'calc-result-internal-links';
    pLinks.appendChild(document.createTextNode('On this site: '));
    for (var i = 0; i < links.length; i++) {
      if (i > 0) {
        pLinks.appendChild(document.createTextNode(' · '));
      }
      var a = document.createElement('a');
      a.href = links[i].href;
      a.textContent = links[i].text;
      pLinks.appendChild(a);
    }
    parent.appendChild(pLinks);
  }

  global.CalculationAnswerBlock = global.CalculationAnswerBlock || {};
  global.CalculationAnswerBlock.renderCalculationAnswer = renderCalculationAnswer;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { renderCalculationAnswer: renderCalculationAnswer };
  }
})(typeof window !== 'undefined' ? window : this);
