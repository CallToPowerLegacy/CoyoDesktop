(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoValidationStatusIcon', validationStatusIcon);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoValidationStatusIcon:coyoValidationStatusIcon
   * @scope
   * @restrict 'E'
   *
   * @description
   * Displays a form field's validation status as an icon.
   *
   * @param {object} formField The form field validate
   */
  function validationStatusIcon() {
    return {
      require: 'formField',
      restrict: 'E',
      templateUrl: 'app/commons/ui/components/validation/validation-status-icon.html',
      replace: true,
      scope: {
        formField: '='
      }
    };
  }

})(angular);
