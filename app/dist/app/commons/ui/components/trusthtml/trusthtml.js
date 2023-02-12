(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .filter('trusthtml', trusthtml);

  /**
   * @ngdoc filter
   * @name commons.ui:trustedHtml
   * @function
   *
   * @description
   * Marks an HTML string as trusted.
   */
  function trusthtml($sce) {
    return function (htmlString) {
      return $sce.trustAsHtml(htmlString);
    };
  }

})(angular);
