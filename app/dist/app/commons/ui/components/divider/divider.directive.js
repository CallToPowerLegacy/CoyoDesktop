(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoDivider', divider);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoDivider:coyoDivider
   * @element ANY
   * @restrict E
   * @scope
   *
   * @description
   * Renders a horizontal divider with (optional) transcluded content.
   */
  function divider() {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      template: '<div class="coyo-divider" ng-class="::{empty: isEmpty}"><span ng-transclude></span></div>',
      controller: function ($scope, $transclude) {
        $transclude(function (clone) {
          $scope.isEmpty = !clone.length;
        });
      }
    };
  }

})(angular);
