(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .filter('capitalize', capitalizeFilter);

  /**
   * @ngdoc filter
   * @name commons.ui.capitalize:capitalize
   * @function
   *
   * @description
   * Capitalizes a given input string.
   *
   * @param {string} input An input string to be capitalized
   */
  function capitalizeFilter() {

    return function (input) {
      if (input && input.toLowerCase && input.substring) {
        input = input.toLowerCase();
        return input.substring(0, 1).toUpperCase() + input.substring(1);
      }
      return input;
    };
  }

})(angular);
