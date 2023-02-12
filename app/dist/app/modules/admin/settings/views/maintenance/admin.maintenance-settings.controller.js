(function (angular) {
  'use strict';

  angular.module('coyo.admin.settings')
      .controller('AdminMaintenanceSettingsController', AdminMaintenanceSettingsController);

  function AdminMaintenanceSettingsController($rootScope, MaintenanceModel, coyoNotification) {
    var vm = this;

    vm.$onInit = onInit;
    vm.submit = submit;

    function submit() {
      vm.maintenance.save().then(_onModelUpdated);
    }

    function _onModelUpdated(updatedMaintenance) {
      vm.maintenance = updatedMaintenance;
      coyoNotification.success('ADMIN.SETTINGS.SAVE.SUCCESS');
      $rootScope.maintenanceAdminMessageActive = updatedMaintenance.active;
      $rootScope.$broadcast('onMaintenanceAdminMessageStateChange', updatedMaintenance.active);
    }

    function onInit() {
      MaintenanceModel.getLatest().then(function (maintenance) {
        vm.maintenance = new MaintenanceModel(maintenance);
      });
    }
  }

})(angular);
