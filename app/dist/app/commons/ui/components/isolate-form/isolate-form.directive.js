(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoIsolateForm', IsolateForm);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoIsolateForm:coyoIsolateForm
   * @element ANY
   * @restrict A
   * @scope
   *
   * @description
   * Directive to disconnect a nested sub-form (ng-form) from it's parent form.
   * Useful when embedding forms that contain validation in widgets that could otherwise prevent the surrounding
   * form that includes the widget layout from saving.
   * The element this directive is used on must also define a sub form via ng-form.
   *
   * @requires ngForm
   */
  function IsolateForm() {
    return {
      restrict: 'A',
      require: 'form',
      link: function (scope, element, attrs, ctrl) {
        // eslint-disable-next-line angular/no-private-call
        ctrl.$$parentForm.$removeControl(ctrl);
      }
    };
  }

})(angular);
