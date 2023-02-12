(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoCheckPassword', checkPassword);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoCheckPassword:coyoCheckPassword
   * @element A
   *
   * @description
   * Validates a password against the pattern configured in the backend.
   *
   * @example
   * <example module="example">
   *   <file name="index.html">
   *     <div>
   *       <input type="password" coyo-check-password>
   *     </div>
   *   </file>
   *   <file name="script.js">
   *     angular
   *       .module('example', []);
   *   </file>
   * </example>
   */
  function checkPassword(SettingsModel) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function ($scope, element, attrs, ngModel) {
        var pattern;
        SettingsModel.retrieveByKey('passwordPattern').then(function (result) {
          pattern = result;
        });
        ngModel.$validators.password = function (modelValue) {
          if (!modelValue || modelValue === '') {
            return true;
          }
          return modelValue.match(pattern) !== null;
        };
      }
    };
  }

})(angular);
