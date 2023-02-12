(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoSelectVisibility', coyoSelectVisibility);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoSelectVisibility:coyoSelectVisibility
   * @restrict E
   * @scope
   *
   * @description
   * Renders a UI select field for visibility selection.
   *
   * @param {string} placeholder The placeholder for the input field
   * @param {boolean} languageKeyPrefix The message key prefix to use.
   * @param {boolean} noProtected Removes protected from the list
   *
   */
  function coyoSelectVisibility() {
    return {
      restrict: 'E',
      require: 'ngModel',
      templateUrl: 'app/commons/ui/components/select-visibility/select-visibility.html',
      scope: {
        placeholder: '@?',
        languageKeyPrefix: '<',
        noProtected: '<?'
      },
      link: function (scope, elem, attrs, ctrl) {
        scope.data = {
          visibilities: ['PRIVATE', 'PROTECTED', 'PUBLIC'],
          selected: null
        };

        // model -> select
        ctrl.$render = function () {
          scope.data.selected = ctrl.$viewValue;
        };

        // select -> model
        scope.$watch('data.selected', function (newVal, oldVal) {
          if (newVal !== oldVal) {
            ctrl.$setViewValue(newVal);
          }
        });

        if (scope.noProtected) {
          _.pull(scope.data.visibilities, 'PROTECTED');
        }
      }
    };
  }

})(angular);
