(function (angular) {
  'use strict';

  /**
   * ===== IMPORTANT NOTE
   *
   * This implementation of a markdown filter is not only used in the frontend to display markdown-formatted text. It is
   * also used to strip markdown from the input of the backend search engine. This has two vital consequences: a) this
   * file must stay in strict sync with `coyo-backend/src/main/resources/com/mindsmash/coyo/services/markdown.filter.js`
   * and b) the code between the marker comments `% SYNC START` and `% SYNC START` must contain vanilla JS (i.e. no
   * references to AngularJS, Lodash, ...).
   */

  angular
      .module('commons.ui')
      .filter('markdown', markdownFilter);

  /**
   * @ngdoc filter
   * @name commons.ui.markdown:markdown
   * @function
   *
   * @description
   * Filter that converts markdown to HTML.
   *
   * @requires commons.ui.marked
   *
   * @param {string} text
   * The markdown text to convert
   *
   * @param {boolean} [minimal=true]
   * Whether the filter should be restricted to a subset of markdown elements (e.g. no headings, no tables, ...). If
   * this is false, classic markdown is applied.
   */
  function markdownFilter(marked) {

    /* eslint-disable no-useless-escape */
    //% SYNC START

    function clone(obj) {
      var copy = obj.constructor();
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) {
          copy[attr] = obj[attr];
        }
      }
      return copy;
    }

    function noop() {}
    noop.exec = noop;

    function highlight(code, lang) {
      // eslint-disable-next-line no-undef, angular/definedundefined
      return typeof hljs !== 'undefined' && lang ? hljs.highlight(lang, code, true).value : code;
    }

    function disableOrderedLists(rules) {
      var bullet = /(?:[*+-])/;
      rules.item = new RegExp(rules.item.source
          .replace(rules.bullet.source, bullet.source)
          .replace(rules.bullet.source, bullet.source), 'gm');
      rules.list = new RegExp(rules.list.source
          .replace(rules.bullet.source, bullet.source)
          .replace(rules.bullet.source, bullet.source));
      rules.bullet = bullet;
    }

    var OPTIONS_CLASSIC = {gfm: true, breaks: false, highlight: highlight, smartLists: true};
    var OPTIONS_MINIMAL = {gfm: true, tables: false, breaks: true, highlight: highlight, smartLists: true};

    var BLOCK_RULES_CLASSIC = clone(marked.Lexer.rules.tables);
    var BLOCK_RULES_MINIMAL = clone(marked.Lexer.rules.tables);
    BLOCK_RULES_MINIMAL.code = noop;
    BLOCK_RULES_MINIMAL.def = noop;
    BLOCK_RULES_MINIMAL.heading = noop;
    BLOCK_RULES_MINIMAL.hr = noop;
    BLOCK_RULES_MINIMAL.lheading = noop;
    BLOCK_RULES_MINIMAL.nptable = noop;
    BLOCK_RULES_MINIMAL.table = noop;

    disableOrderedLists(BLOCK_RULES_CLASSIC);
    disableOrderedLists(BLOCK_RULES_MINIMAL);

    var INLINE_RULES_CLASSIC = clone(marked.InlineLexer.rules.gfm);
    INLINE_RULES_CLASSIC.url = new RegExp(marked.InlineLexer.rules.gfm.url.source.replace('https?:\\\/\\\/', '(?:https?:\/\/|www\\.)'), 'i');
    INLINE_RULES_CLASSIC.text = new RegExp(marked.InlineLexer.rules.gfm.text.source.replace('https?:\\\/\\\/', 'https?:\/\/|www\\.'), 'i');
    var INLINE_RULES_MINIMAL = clone(marked.InlineLexer.rules.breaks);
    INLINE_RULES_MINIMAL.autolink = noop;
    INLINE_RULES_MINIMAL.link = noop;
    INLINE_RULES_MINIMAL.nolink = noop;
    INLINE_RULES_MINIMAL.reflink = noop;
    INLINE_RULES_MINIMAL.tag = noop;
    INLINE_RULES_MINIMAL.url = new RegExp(marked.InlineLexer.rules.breaks.url.source.replace('https?:\\\/\\\/', '(?:https?:\/\/|www\\.)'), 'i');
    INLINE_RULES_MINIMAL.text = new RegExp(marked.InlineLexer.rules.breaks.text.source.replace('https?:\\\/\\\/', 'https?:\/\/|www\\.'), 'i');

    function markdown(text, minimal) {
      // set marked options
      marked.setOptions(minimal ? OPTIONS_MINIMAL : OPTIONS_CLASSIC);

      // set block lexer rules
      marked.prototype.constructor.Lexer.lex = function (src, options) {
        var lexer = new marked.Lexer(options);
        lexer.rules = minimal ? BLOCK_RULES_MINIMAL : BLOCK_RULES_CLASSIC;
        return lexer.lex(src);
      };

      // set inline lexer rules
      marked.prototype.constructor.Parser.prototype.parse = function (src) {
        this.inline = new marked.InlineLexer(src.links, this.options, this.renderer);
        this.inline.rules = minimal ? INLINE_RULES_MINIMAL : INLINE_RULES_CLASSIC;
        this.tokens = src.reverse();

        var out = '';
        while (this.next()) {
          out += this.tok();
        }

        return out;
      };

      var markedText = marked(text)                      // Apply markdown
          .replace(/href="www/gi, 'href="http://www')    // Prepend http:// to links that only start with 'www'
          .replace(/href="/g, 'target="_blank" href="'); // Open links in a new tab

      // window location is just set in frontend, backend do not need to refactor internal links
      // because markdown is just used for the search index
      // eslint-disable-next-line angular/window-service
      if (window.location) {
        // eslint-disable-next-line angular/window-service
        var sameOriginRegEx = new RegExp('target="_blank" href="(http|https)://(www.)?' + window.location.host, 'i');
        markedText = markedText.replace(sameOriginRegEx, 'href="'); // open internal links in same tab
      }

      return markedText;
    }

    //% SYNC END
    /* eslint-enable no-useless-escape */

    return function (text, minimal) {
      if (!text || !angular.isString(text)) {
        return text;
      } else if (angular.isUndefined(minimal)) {
        minimal = true;
      }

      return markdown(text, minimal)
          .replace(/\n$/g, ''); // remove trailing linebreak (LF)
    };
  }

})(angular);
