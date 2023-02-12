(function (angular) {
  'use strict';

  angular.module('coyo.admin.settings')
      .controller('AdminGeneralSettingsController', AdminGeneralSettingsController);

  function AdminGeneralSettingsController(coyoNotification, SettingsModel, settings, $translate) {
    var vm = this;

    vm.$onInit = onInit;
    vm.save = save;

    function save() {
      return settings.update().then(function () {
        SettingsModel.retrieve(true); // reset settings cache
        coyoNotification.success('ADMIN.SETTINGS.SAVE.SUCCESS');
      });
    }

    function onInit() {
      vm.settings = settings;

      $translate('ADMIN.SETTINGS.ANONYMIZE_DELETEDUSERS.DELETED_NAME.DEFAULT').then(function (translation) {
        vm.settings.deletedUserDisplayName = vm.settings.deletedUserDisplayName || translation;
      });
    }
  }

})(angular);
