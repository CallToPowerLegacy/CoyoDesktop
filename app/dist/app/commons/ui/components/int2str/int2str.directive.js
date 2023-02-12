(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoInt2Str', coyoInt2Str);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoInt2Str:coyoInt2Str
   * @restrict 'A'
   * @scope
   *
   * @description
   * Convert numeric values to string to simplify binding of a string value via ngModel parsing / formatting.
   */
  function coyoInt2Str() {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, ngModel) {
        ngModel.$formatters.push(function (val) {
          var int = parseInt(val, 10);
          return isNaN(int) ? null : int;
        });
        ngModel.$parsers.push(function (val) {
          return val ? '' + val : '0';
        });
      }
    };
  }

})(angular);
