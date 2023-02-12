(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoCheckNotEquals', checkNotEquals);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoCheckNotEquals:coyoCheckNotEquals
   * @scope
   * @restrict 'A'
   * @element ANY
   *
   * @description
   * Compares model values in forms (adds <em>'not-equals'</em> to the validation).
   *
   * @requires $parse
   *
   * @param {string} coyo-check-not-equals The value of the model to compare to the current model.
   */
  function checkNotEquals($parse) {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, ngModel) {
        var referenceGet = $parse(attrs.coyoCheckNotEquals);
        ngModel.$validators.notEquals = function (modelValue) {
          return modelValue !== referenceGet(scope);
        };

        scope.$watch(function () {
          return referenceGet(scope);
        }, function () {
          ngModel.$$parseAndValidate(); // eslint-disable-line angular/no-private-call
        });
      }
    };
  }

})(angular);
