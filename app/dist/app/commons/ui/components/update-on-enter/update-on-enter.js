(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoUpdateOnEnter', updateOnEnter);

  /**
   * @ngdoc directive
   * @name commons.ui:coyoUpdateOnEnter
   * @scope
   * @restrict 'A'
   *
   * @description
   * Updates the given ngModel on enter.
   */
  function updateOnEnter() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, element, attrs, ctrl) {
        element.bind('keyup', function (event) {
          if (event.keyCode === 13) {
            ctrl.$commitViewValue();
            ctrl.$setTouched();
            scope.$apply();
          }
        });
      }
    };
  }

})(angular);
