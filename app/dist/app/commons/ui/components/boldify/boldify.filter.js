(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .filter('boldify', boldifyFilter);

  /**
   * @ngdoc filter
   * @name commons.ui.boldify:boldify
   * @function
   *
   * @description
   * Replaces '*' encapsuled strings with <em>'strong'</em>-tags.
   *
   * @param {string} input An input string to be boldified
   */
  function boldifyFilter() {
    return function (input) {
      /* eslint-disable no-useless-escape */
      return input.replace(/\*([^\*]*)\*/g, '<strong>$1</strong>');
      /* eslint-enable no-useless-escape */
    };
  }

})(angular);
