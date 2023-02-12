(function (angular) {
  'use strict';

  angular
      .module('coyo.launchpad')
      .directive('oyocLaunchpadNavbarItem', launchpadNavbarItem)
      .controller('LaunchpadNavbarItemController', LaunchpadNavbarItemController);

  /**
   * @ngdoc directive
   * @name coyo.launchpad.oyocLaunchpadNavbarItem:oyocLaunchpadNavbarItem
   * @scope
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Renders the launchpad navbar item.
   */
  function launchpadNavbarItem() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/modules/launchpad/components/launchpad-navbar-item/launchpad-navbar-item.html',
      scope: {},
      controller: 'LaunchpadNavbarItemController',
      controllerAs: '$ctrl'
    };
  }

  function LaunchpadNavbarItemController($uibModal, SettingsModel) {
    var vm = this;

    vm.openLaunchpad = openLaunchpad;

    function openLaunchpad() {
      $uibModal.open({
        animation: false,
        controller: 'LaunchpadModalController',
        windowClass: 'launchpad-modal',
        backdropClass: 'launchpad-backdrop',
        templateUrl: 'app/modules/launchpad/components/launchpad-modal/launchpad-modal.html',
        controllerAs: 'vm',
        bindToController: true
      });
    }

    (function init() {
      SettingsModel.retrieve().then(function (settings) {
        vm.isActive = settings.launchpadActive === 'true';
      });
    })();
  }

})(angular);
