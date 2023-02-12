(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoCounter', counter)
      .controller('CounterController', CounterController);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoCounter:coyoCounter
   * @scope
   * @restrict 'E'
   *
   * @description
   * Renders a list count (e.g. <em>'5 Users'</em>).
   *
   * Mobile view will reduce to a badge containing a number.
   *
   * @example
   * <example module="example">
   *   <file name="index.html">
   *     <div ng-controller="ExampleCtrl">
   *       <coyo-counter value="value" key-none="None" key-singular="User" key-plural="Users"></coyo-counter>
   *     </div>
   *   </file>
   *   <file name="script.js">
   *     angular
   *       .module('example', [])
   *       .controller('ExampleCtrl', ExampleCtrl);
   *
   *     function ExampleCtrl($scope) {
   *       $scope.value = 5;
   *     }
   *   </file>
   * </example>
   */
  function counter() {
    return {
      restrict: 'E',
      templateUrl: 'app/commons/ui/components/counter/counter.html',
      scope: {},
      bindToController: {
        keyNone: '@',
        keySingular: '@',
        keyPlural: '@',
        value: '='
      },
      controller: 'CounterController',
      controllerAs: '$ctrl'
    };
  }

  function CounterController() {
    var vm = this;

    vm.translationKey = translationKey;

    function translationKey() {
      if (vm.value === 0) {
        return vm.keyNone;
      }
      if (vm.value === 1) {
        return vm.keySingular;
      }
      return vm.keyPlural;
    }
  }

})(angular);
