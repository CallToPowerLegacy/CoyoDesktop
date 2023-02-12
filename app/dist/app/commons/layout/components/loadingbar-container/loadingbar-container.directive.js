(function () {
  'use strict';

  angular
      .module('commons.layout')
      .directive('oyocLoadingbarContainer', LoadingbarContainer)
      .controller('LoadingbarContainerController', LoadingbarContainerController);

  /**
   * @ngdoc directive
   * @name commons.layout.oyocLoadingbarContainer:oyocLoadingbarContainer
   * @element ANY
   * @restrict AE
   * @scope
   *
   * @description
   * Internal directive to create a container for the loading bar. This container has the same color as the loading
   * bar, but is always visible and turns gray if the actual loading bar is active. This creates an actual progress
   * bar in an configurable color.
   *
   * @requires $scope
   * @requires $rootScope
   */
  function LoadingbarContainer() {
    return {
      restrict: 'E',
      templateUrl: 'app/commons/layout/components/loadingbar-container/loadingbar-container.html',
      replace: true,
      scope: {},
      bindToController: {},
      controller: 'LoadingbarContainerController',
      controllerAs: '$ctrl'
    };
  }

  function LoadingbarContainerController($scope, $rootScope) {
    var vm = this;

    var unsubscribeCompleted = $rootScope.$on('cfpLoadingBar:completed', function () {
      vm.isLoading = false;
    });

    var unsubscribeLoading = $rootScope.$on('cfpLoadingBar:loading', function () {
      vm.isLoading = true;
    });

    $scope.$on('$destroy', unsubscribeCompleted);
    $scope.$on('$destroy', unsubscribeLoading);
  }
})();
