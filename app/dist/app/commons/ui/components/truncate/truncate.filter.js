(function (angular) {
  'use strict';

  // based on https://github.com/sparkalow/angular-truncate
  angular
      .module('commons.ui')
      .filter('characters', charactersFilter)
      .filter('words', wordsFilter);

  /**
   * @ngdoc filter
   * @name commons.ui.characters:filterCharacters
   * @function
   *
   * @description
   * Limits the input to a specific number of characters.
   * Has an option to break on a word or to break after a word.
   *
   * @param {string} input The input
   * @param {int} chars Number of characters
   * @param {boolean} breakOnWord Flag whether to break a word (true) or after a word (false)
   */
  function charactersFilter() {
    return function (input, chars, breakOnWord) {
      if (isNaN(chars)) {
        return input;
      }
      if (chars <= 0) {
        return '';
      }
      if (input && input.length > chars) {
        input = input.substring(0, chars);

        if (!breakOnWord) {
          var lastspace = input.lastIndexOf(' ');
          if (lastspace !== -1) {
            input = input.substr(0, lastspace);
          }
        } else {
          while (input.charAt(input.length - 1) === ' ') {
            input = input.substr(0, input.length - 1);
          }
        }

        return input + '…';
      }

      return input;
    };
  }

  /**
   * @ngdoc filter
   * @name commons.ui.words:filterWords
   * @function
   *
   * @description
   * Limits the input to a specific number of words.
   *
   * @param {string} input The input
   * @param {int} words Number of words
   */
  function wordsFilter() {
    return function (input, words) {
      if (isNaN(words)) {
        return input;
      }
      if (words <= 0) {
        return '';
      }
      if (input) {
        var inputWords = input.split(/\s+/);
        if (inputWords.length > words) {
          input = inputWords.slice(0, words).join(' ') + '…';
        }
      }

      return input;
    };
  }

})(angular);
