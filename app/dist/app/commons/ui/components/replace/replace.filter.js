(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .filter('replace', replace);

  /**
   * @ngdoc filter
   * @name commons.ui.replace:replace
   * @function
   *
   * @description
   * Replaces a string on the given input.
   *
   * @param {string} str The string.
   * @param {string} pattern The search pattern.
   * @param {string} replacement The replacement string.
   * @param {boolean} global Search the string globally.
   */
  function replace() {
    return function (str, pattern, replacement, global) {
      global = angular.isDefined(global) ? global : true;
      try {
        if (!angular.isString(str)) {
          return '';
        }
        return (str || '').replace(new RegExp(pattern, global ? 'g' : ''), function () {
          return replacement || '';
        });
      } catch (e) {
        return (str || '');
      }
    };
  }

})(angular);
