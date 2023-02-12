(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoCheckBoolean', checkBoolean);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoCheckBoolean:coyoCheckBoolean
   * @scope
   * @restrict 'A'
   * @element ANY
   *
   * @description
   * Checks whether the given argument can be parsed to 'true'. This can be used to validate or invalid ngModel objects
   * in forms based on an expression. If the passed expression is not 'true' the ngModel will be set to invalid within
   * a form.
   *
   * @param {string} coyoCheckBoolean
   * The value of an boolean expression. If 'true' the model is considered valid.
   * Please note that you need to pass an evaluated string. The directive watches the expression and will refresh if
   * the value changes.
   */
  function checkBoolean() {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, ngModel) {
        ngModel.$validators.checkBoolean = function () {
          return attrs.coyoCheckBoolean === 'true';
        };

        scope.$watch(function () {
          return attrs.coyoCheckBoolean;
        }, function (newValue, oldValue) {
          if (newValue !== oldValue) {
            ngModel.$$parseAndValidate(); // eslint-disable-line angular/no-private-call
          }
        });
      }
    };
  }

})(angular);
