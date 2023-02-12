(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('oyocBackdrop', backdrop)
      .controller('BackdropController', BackdropController);

  /**
   * @ngdoc directive
   * @name commons.ui.oyocBackdrop:oyocBackdrop
   * @element ANY
   *
   * @description
   * Displays a backdrop shadow as a background for sidebars.
   *
   * @requires $rootScope
   */
  function backdrop() {
    return {
      scope: true,
      templateUrl: 'app/commons/ui/components/backdrop/backdrop.html',
      controller: 'BackdropController',
      controllerAs: '$ctrl'
    };
  }

  function BackdropController($rootScope, $scope, $transitions) {
    var vm = this;

    vm.close = close;

    function close() {
      if ($rootScope.showBackdrop) {
        $rootScope.showBackdrop = false;
        $rootScope.$emit('backdrop:hidden');
      }
    }

    // hide on state change
    var deregisterHook = $transitions.onSuccess({}, function () {
      $rootScope.showBackdrop = false;
    });

    $scope.$on('$destroy', deregisterHook);

  }

})(angular);
