(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoActiveLabel', activeLabel);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoActiveLabel:coyoActiveLabel
   * @element ANY
   * @restrict E
   *
   * @description
   * Displays a green or a red label for an active/inactive state based on a boolean flag.
   *
   * @param {boolean} ngModel Boolean flag whether the state is active or inactive
   * @param {boolean} ngClick Boolean flag if the element is clickable or not
   *
   * @example
   * <example module="example">
   *   <file name="index.html">
   *     <div ng-controller="ExampleCtrl">
   *       <coyo-active-label ng-model="activated" ng-click="onClick()"></coyo-active-label>
   *     </div>
   *   </file>
   *   <file name="script.js">
   *     angular
   *       .module('example', [])
   *       .controller('ExampleCtrl', ExampleCtrl);
   *
   *     function ExampleCtrl($scope) {
   *       $scope.activated = true;
   *       $scope.onClick = function() {
   *         $scope.activated = !$scope.activated;
   *       };
   *     }
   *   </file>
   * </example>
   */
  function activeLabel() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        ngModel: '=',
        ngClick: '@'
      },
      templateUrl: 'app/commons/ui/components/active-label/active-label.html'
    };
  }

})(angular);
