(function () {
  'use strict';

  angular.module('coyo.account')
      .factory('notificationsSettingsModal', notificationsSettingsModal)
      .controller('NotificationsSettingsModalController', NotificationsSettingsModalController);

  /**
   * @ngdoc service
   * @name coyo.account.notificationsSettingsModal
   *
   * @description
   * Provides a modal to set the notifications settings for a given channel. Only used in mobile resolutions.
   *
   * @requires modalService
   */
  function notificationsSettingsModal(modalService) {

    return {
      open: open
    };

    /**
     * @ngdoc method
     * @name coyo.account.notificationsSettingsModal#open
     * @methodOf coyo.account.notificationsSettingsModal
     *
     * @description
     * Opens the modal to set the notifications settings for a given channel.
     *
     * @param {object} setting settings of the notification channel
     * @param {object} metadata metadata of the notification channel
     * @param {object} browserNotificationsActive if notification channel is browser notification
     *
     *
     * @returns {object} promise contains the result of the saving dialog
     */
    function open(setting, metadata, browserNotificationsActive) {
      return modalService.open({
        controller: 'NotificationsSettingsModalController',
        templateUrl: 'app/modules/account/components/notifications-settings-modal/notifications-settings-modal.html',
        resolve: {
          setting: function () {
            return setting;
          },
          metadata: function () {
            return metadata;
          },
          browserNotificationsActive: function () {
            return browserNotificationsActive;
          }
        }
      }).result;
    }

  }

  function NotificationsSettingsModalController($uibModalInstance, setting, metadata, browserNotificationsActive) {
    var vm = this;

    vm.setting = angular.copy(setting);
    vm.metadata = metadata;
    vm.browserNotificationsActive = browserNotificationsActive;

    vm.save = save;

    function save() {
      $uibModalInstance.close(vm.setting);
    }
  }

})();
