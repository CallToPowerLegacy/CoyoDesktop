(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoStr2Int', str2int);

  /**
   * @ngdoc directive
   * @name commons.ui.str2int:str2int
   * @restrict 'A'
   * @scope
   *
   * @description
   * Convert strings to numeric values to simplify binding of a non-string value via ngModel parsing / formatting.
   *
   * @see https://code.angularjs.org/1.4.7/docs/api/ng/directive/select
   *
   * @example
   * <select ng-model="model.id" str-to-int>
   *   <option value="0">Zero</option>
   *   <option value="1">One</option>
   *   <option value="2">Two</option>
   * </select>
   */
  function str2int() {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, ngModel) {
        ngModel.$parsers.push(function (val) {
          var int = parseInt(val, 10);
          return isNaN(int) ? null : int;
        });
        ngModel.$formatters.push(function (val) {
          return val ? '' + val : null;
        });
      }
    };
  }

})(angular);
