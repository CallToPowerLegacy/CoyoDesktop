(function (angular) {
  'use strict';

  angular
      .module('commons.markdown')
      .factory('markdownService', markdownService);

  /**
   * @ngdoc service
   * @name commons.markdown.markdownService
   *
   * @description
   * Provides methods for markdown processing.
   */
  function markdownService() {

    return {
      strip: strip
    };

    /**
     * @ngdoc method
     * @name commons.markdown.markdownService#strip
     * @methodOf commons.markdown.markdownService
     *
     * @description
     * Strips all markdown from the given string.
     *
     * @param {string} str String to strip
     * @return {boolean} True if browser notifications are supported by the user's browser, false else
     */
    function strip(str) {
      if (!str || str.length <= 0) {
        return str;
      }
      return _strip(str, false, true);
    }

  }

  /******************************************************************/

  // Based on: https://github.com/stiang/remove-markdown
  /* eslint-disable no-useless-escape */
  function _strip(str, stripListLeaders, gfm) {
    // Stripping list headers will retain any list characters (*, -, +, (digit).)
    if (stripListLeaders) {
      str = str.replace(/^([\s\t]*)([\*\-\+]|\d\.)\s+/g, '$1');
    }
    if (gfm) {
      str = str.replace(/\n={2,}/g, '\n') // header
          .replace(/~~/g, '') // strikethrough
          .replace(/`{3}.*\n/g, ''); // fenced codeblocks
    }
    // HTML tags
    str = str.replace(/<(.*?)>/g, '$1')
        .replace(/\[\^.+?\](\: .*?$)?/g, '').replace(/\s{0,2}\[.*?\]: .*?$/g, '') // footnotes
        .replace(/\!\[.*?\][\[\(].*?[\]\)]/g, '') // images
        .replace(/\[(.*?)\][\[\(].*?[\]\)]/g, '$1') // inline links
        .replace(/>/g, '') // blockquotes
        .replace(/^\s{1,2}\[(.*?)\]: (\S+)( ".*?")?\s*$/g, ''); // reference-style links
    // Remove atx-style headers
    str = str.replace(/^\#{1,6}\s*([^#]*)\s*(\#{1,6})?/gm, '$1')
        .replace(/([\*_]{1,3})(\S.*?\S*)\1/g, '$2') // <- fixed an error in the linked remove-markdown
        .replace(/(`{3,})(.*?)\1/gm, '$2')
        .replace(/^-{3,}\s*$/g, '')
        .replace(/`(.+?)`/g, '$1')
        .replace(/\n{2,}/g, '\n\n');

    return str;
  }
  /* eslint-enable no-useless-escape */
})(angular);
