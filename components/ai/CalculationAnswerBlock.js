/**
 * Renders Question + Quick Answer for AEO / AI citation.
 * Optional schema.org Question / Answer microdata when `config.question` is set.
 * Use `buildQuickAnswerParagraph(p, values, results)` for semantic in-sentence links.
 */
(function (global) {
  'use strict';

  /**
   * @param {object} opts
   * @param {string} opts.containerId
   * @param {object} [opts.config]
   * @param {string} [opts.config.question]
   * @param {function(object, object): string} [opts.config.answerTemplate] — plain text (no links)
   * @param {function(HTMLParagraphElement, object, object): void} [opts.config.buildQuickAnswerParagraph] — rich text + links inside `p`
   * @param {{text:string, href:string}[]} [opts.config.internalLinks] — legacy; skipped if buildQuickAnswerParagraph is set
   * @param {object} opts.values
   * @param {object} opts.results
   */
  function renderCalculationAnswer(opts) {
    var container = document.getElementById(opts.containerId);
    if (!container) return;

    var config = opts.config || {};
    var values = opts.values || {};
    var results = opts.results || {};
    var sentence = '';
    var useRich = typeof config.buildQuickAnswerParagraph === 'function';

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

    if (config.question) {
      var outer = document.createElement('div');
      outer.className = 'aeo-calculation-answer';
      outer.setAttribute('itemscope', '');
      outer.setAttribute('itemtype', 'https://schema.org/Question');

      var qEl = document.createElement('h3');
      qEl.className = 'aeo-question';
      qEl.setAttribute('itemprop', 'name');
      qEl.textContent = config.question;
      outer.appendChild(qEl);

      var answerHolder = document.createElement('div');
      answerHolder.setAttribute('itemprop', 'acceptedAnswer');
      answerHolder.setAttribute('itemscope', '');
      answerHolder.setAttribute('itemtype', 'https://schema.org/Answer');

      var block = document.createElement('div');
      block.className = 'aeo-answer-block';
      block.setAttribute('role', 'region');
      block.setAttribute('aria-label', 'Calculation summary');

      var p = document.createElement('p');
      p.setAttribute('itemprop', 'text');
      fillQuickAnswerParagraph(p, config, values, results, sentence, useRich);
      block.appendChild(p);

      if (!useRich) {
        appendInternalLinks(block, config.internalLinks);
      }

      answerHolder.appendChild(block);
      outer.appendChild(answerHolder);
      container.appendChild(outer);
    } else {
      var wrap = document.createElement('div');
      wrap.className = 'aeo-answer-block';
      wrap.setAttribute('role', 'region');
      wrap.setAttribute('aria-label', 'Calculation summary');
      var p2 = document.createElement('p');
      p2.setAttribute('itemprop', 'text');
      fillQuickAnswerParagraph(p2, config, values, results, sentence, useRich);
      wrap.appendChild(p2);
      if (!useRich) {
        appendInternalLinks(wrap, config.internalLinks);
      }
      container.appendChild(wrap);
    }
  }

  function fillQuickAnswerParagraph(p, config, values, results, sentence, useRich) {
    var strong = document.createElement('strong');
    strong.textContent = 'Quick Answer: ';
    p.appendChild(strong);
    if (useRich) {
      config.buildQuickAnswerParagraph(p, values, results);
    } else {
      p.appendChild(document.createTextNode(sentence));
    }
  }

  function appendInternalLinks(parent, links) {
    if (!links || !links.length) return;
    var pLinks = document.createElement('p');
    pLinks.className = 'aeo-answer-internal-links';
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
