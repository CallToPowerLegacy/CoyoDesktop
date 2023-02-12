(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .filter('hashtag', hashtagFilter);

  /**
   * @ngdoc filter
   * @name commons.ui.hashtag:hashtag
   * @function
   *
   * @description
   * Filter that converts a hashtag to a link.
   * The rules for hash-tagging are addressed to the twitter rules (see https://support.twitter.com/articles/511696).
   *
   * @requires $state
   * @requires HASHTAG_REGEX_PATTERN
   *
   * @param {string} text
   * The text to convert
   */
  function hashtagFilter($state, HASHTAG_REGEX_PATTERN) {
    var regExp = new RegExp('(^|\\s|>)(' + HASHTAG_REGEX_PATTERN + ')', 'g');
    return function (text) {
      return text ? text.replace(regExp, function (match, p1, p2) {
        return p1 + '<a href="' + $state.href('main.search', {term: p2}) + '">' + p2 + '</a>';
      }) : '';
    };
  }
})(angular);
