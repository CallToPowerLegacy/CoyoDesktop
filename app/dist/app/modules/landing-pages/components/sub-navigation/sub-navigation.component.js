(function (angular) {
  'use strict';

  /**
   * @ngdoc directive
   * @name coyo.landingPages.oyocSubNavigation:oyocSubNavigation
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Displays the landing page navigation.
   *
   * @requires $rootScope
   * @requires $scope
   * @requires $state
   * @requires coyo.domain.SettingsModel
   */
  angular
      .module('coyo.landing-pages')
      .component('oyocSubNavigation', subNavigation())
      .controller('SubNavigationController', SubNavigationController);

  function subNavigation() {
    return {
      templateUrl: 'app/modules/landing-pages/components/sub-navigation/sub-navigation.html',
      controller: 'SubNavigationController',
      bindings: {
        landingPages: '<'
      },
      controllerAs: '$ctrl'
    };
  }

  function SubNavigationController($scope, $state, SettingsModel, $transitions) {
    var vm = this;

    vm.subNavigationActive = false;

    vm.$onInit = init;

    function init() {
      SettingsModel.retrieveByKey('subNavigationActive').then(function (newVal) {
        if (newVal === 'true') {
          vm.subNavigationActive = true;
        } else {
          vm.subNavigationActive = $state.includes('main.landing-page');
          var deregisterHook = $transitions.onSuccess({}, function (transition) {
            var $state = transition.injector().get('$state');
            vm.subNavigationActive = $state.includes('main.landing-page');
          });
          $scope.$on('$destroy', deregisterHook);
        }
      });
    }
  }

})(angular);
