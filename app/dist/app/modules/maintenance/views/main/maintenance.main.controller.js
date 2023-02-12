(function (angular) {
  'use strict';

  angular
      .module('coyo.maintenance')
      .controller('MaintenanceMainController', MaintenanceMainController);

  /**
   * Controller for the maintenance page
   */
  function MaintenanceMainController(curtainService, $window, MaintenanceModel, authService, $stateParams) {
    var vm = this;

    vm.$onInit = onInit;
    vm.logout = logout;

    function logout() {
      authService.logout(!$stateParams.global).then(function () {
        vm.currentUser = undefined;
      });
    }

    function onInit() {
      curtainService.hide();
      vm.selfLink = $window.location.href;

      MaintenanceModel.getPublic().then(function (result) {
        vm.headline = result.headline;
        vm.message = result.message;
      });

      authService.getUser().then(function (user) {
        vm.currentUser = user;
      });
    }
  }
})(angular);
