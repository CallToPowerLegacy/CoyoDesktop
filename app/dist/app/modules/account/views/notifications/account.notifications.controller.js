(function (angular) {
  'use strict';

  angular
      .module('coyo.account')
      .controller('AccountNotificationsController', AccountNotificationsController);

  /**
   * Controller for the account notification settings view
   */
  function AccountNotificationsController($scope, notificationSettings, notificationsSettingsModal,
                                          browserNotificationsService, hashtagSubscriptionsModal) {
    var vm = this;

    vm.$onInit = onInit;

    vm.openSettings = openSettings;
    vm.openHashtagSubscriptions = openHashtagSubscriptions;
    vm.toggle = toggle;
    vm.isEnabled = isEnabled;
    vm.save = save;

    function openSettings(setting) {
      notificationsSettingsModal
          .open(setting, vm.channelMetadata[setting.channel], vm.browserNotificationsActive)
          .then(save);
    }

    function openHashtagSubscriptions() {
      hashtagSubscriptionsModal.open();
    }

    function toggle(setting) {
      setting.active = !setting.active;
      save(setting);
    }

    function save(setting) {
      return setting.update().then(function (result) {
        angular.merge(setting, result);
        // Update the reference (needed for the modal)
        for (var i = 0; i < vm.settings.length; ++i) {
          if (vm.settings[i].channel === setting.channel) {
            vm.settings[i] = result;
          }
        }

        if (setting.active && setting.channel === 'BROWSER') {
          browserNotificationsService.requestPermission().then(function (result) {
            _updateBrowserNotificationsActiveFlag(result.result, result.requested);
          });
        }

        return result;
      });
    }

    function isEnabled(channelName) {
      return _.get(vm.channelMetadata, channelName + '.enabled');
    }

    function _updateBrowserNotificationsActiveFlag(result, digest) {
      switch (result) {
        case 'granted':
          vm.browserNotificationsActive = true;
          break;
        default:
        case 'denied':
          vm.browserNotificationsActive = false;
          break;
      }
      if (digest) {
        $scope.$digest();
      }
    }

    function _initSettings() {
      var browserNotificationSources = [
        'discussion',
        'activity',
        'post',
        'message'
      ];
      var pushNotificationSources = [
        'message'
      ];

      vm.settings = notificationSettings;

      vm.channelMetadata = {
        BROWSER: {
          icon: 'globe-alt',
          intervalConfigurable: false,
          selectNotificationSources: browserNotificationsService.available(),
          notificationSources: browserNotificationSources
        },
        SOUND: {
          icon: 'volume-up',
          configurationKey: 'notifications',
          intervalConfigurable: false,
          selectNotificationSources: false
        },
        EMAIL: {
          icon: 'email',
          intervalConfigurable: true,
          selectNotificationSources: false
        },
        PUSH: {
          icon: 'smartphone-ring',
          intervalConfigurable: false,
          selectNotificationSources: true,
          notificationSources: pushNotificationSources
        }
      };
    }

    function onInit() {
      _initSettings();
      vm.browserNotificationsActive = browserNotificationsService.permissionGranted();

      browserNotificationsService.active(true, false, false, false, false).then(function (isActive) {
        if (isActive) {
          browserNotificationsService.requestPermission().then(function (result) {
            _updateBrowserNotificationsActiveFlag(result.result, result.requested);
          });
        }
      });
    }
  }

})(angular);
