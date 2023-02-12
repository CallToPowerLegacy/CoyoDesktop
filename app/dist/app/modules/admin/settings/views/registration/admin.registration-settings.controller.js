(function (angular) {
  'use strict';

  angular.module('coyo.admin.settings')
      .controller('AdminRegistrationSettingsController', AdminRegistrationSettingsController);

  function AdminRegistrationSettingsController(coyoNotification, SettingsModel, settings) {
    var vm = this;

    vm.settings = settings;
    vm.save = save;

    function save() {
      return settings.update().then(function () {
        SettingsModel.retrieve(true); // reset settings cache
        coyoNotification.success('ADMIN.SETTINGS.SAVE.SUCCESS');
      });
    }
  }

})(angular);
