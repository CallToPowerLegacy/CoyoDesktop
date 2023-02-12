(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoCheckEquals', checkEquals);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoCheckEquals:coyoCheckEquals
   * @scope
   * @restrict 'A'
   * @element ANY
   *
   * @description
   * Compares model values in forms (adds <em>'equals'</em> to the validation).
   *
   * @requires $parse
   *
   * @param {string} coyo-check-equals The value of the model to compare to the current model
   */
  function checkEquals($parse) {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, ngModel) {
        var referenceGet = $parse(attrs.coyoCheckEquals);
        ngModel.$validators.equals = function (modelValue) {
          return modelValue === referenceGet(scope);
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
