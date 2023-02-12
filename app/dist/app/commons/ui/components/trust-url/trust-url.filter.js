(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .filter('trustUrl', trustUrlFilter);

  /**
   * @ngdoc filter
   * @name commons.ui:trustUrl
   * @function
   *
   * @description
   * Parses a URL as trusted resource URL via `$sce`.
   *
   * @param {string} url The URL.
   *
   * @requires $sce
   */
  function trustUrlFilter($sce) {
    return function (url) {
      return $sce.trustAsResourceUrl(url);
    };
  }

})(angular);
