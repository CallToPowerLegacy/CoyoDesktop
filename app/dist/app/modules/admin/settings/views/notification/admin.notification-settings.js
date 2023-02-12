(function (angular) {
  'use strict';

  angular.module('coyo.admin.settings')
      .controller('AdminNotificationSettingsController', AdminNotificationSettingsController);

  function AdminNotificationSettingsController(coyoNotification, SettingsModel, settings) {
    var vm = this;

    vm.settings = settings;
    vm.save = save;

    vm.channelMetadata = {
      BROWSER: {
        key: 'browser',
        id: 'BROWSER',
        model: 'browserNotificationsActive'
      },
      EMAIL: {
        key: 'email',
        id: 'EMAIL',
        model: 'emailNotificationsActive'
      },
      PUSH: {
        key: 'push',
        id: 'PUSH',
        model: 'pushNotificationsActive'
      },
      PUSH_ACTUAL_CONTENT: {
        key: 'pushActualContent',
        id: 'PUSH_ACTUAL_CONTENT',
        model: 'pushNotificationsActualContentEnabled',
        disabled: _isPushDisabled
      }
    };

    function save() {
      return settings.update().then(function () {
        SettingsModel.retrieve(true); // reset settings cache
        coyoNotification.success('ADMIN.SETTINGS.SAVE.SUCCESS');
      });
    }

    function _isPushDisabled() {
      return !_.get(vm.settings, 'pushNotificationsActive');
    }
  }

})(angular);
