(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoCounterLabel', counterLabel);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoCounterLabel:coyoCounterLabel
   * @scope
   * @restrict 'E'
   *
   * @description
   * Renders a count label with an icon.
   *
   * Uses bootstrap default label if value is zero, success label otherwise.
   *
   * @example
   * <example module="example">
   *   <file name="index.html">
   *     <div ng-controller="ExampleCtrl">
   *       <coyo-counter-label icon="zmdi-account" value="userCount"></coyo-counter-label>
   *     </div>
   *   </file>
   *   <file name="script.js">
   *     angular
   *       .module('example', [])
   *       .controller('ExampleCtrl', ExampleCtrl);
   *
   *     function ExampleCtrl($scope) {
   *       $scope.userCount = 5;
   *     }
   *   </file>
   * </example>
   */
  function counterLabel() {
    return {
      restrict: 'E',
      templateUrl: 'app/commons/ui/components/counter/counter-label.html',
      scope: {},
      bindToController: {
        value: '=',
        icon: '@'
      },
      controller: function () {},
      controllerAs: '$ctrl'
    };
  }

})(angular);
