(function () {
  'use strict';

  angular.module('coyo.admin.apps-widgets')
      .factory('adminAppSettingsModal', adminAppSettingsModal)
      .controller('AdminAppSettingsModalController', AdminAppSettingsModalController);

  /**
   * @ngdoc service
   * @name coyo.account.adminAppSettingsModal
   *
   * @description
   * Provides a modal to set the app settings for a given app. Only used in mobile resolutions.
   *
   * @requires modalService
   */
  function adminAppSettingsModal(modalService) {

    return {
      open: open
    };

    /**
     * @ngdoc method
     * @name coyo.account.adminAppSettingsModal#open
     * @methodOf coyo.account.adminAppSettingsModal
     *
     * @description
     * Opens the modal to set the app settings for a given app.
     *
     * @param {object} senderTypes the list of sender types
     * @param {object} app the app
     *
     * @returns {object} promise contains the result of the saving dialog
     */
    function open(senderTypes, app) {
      return modalService.open({
        controller: 'AdminAppSettingsModalController',
        templateUrl: 'app/modules/admin/apps-widgets/views/app-list/admin-app-settings-modal.html',
        resolve: {
          senderTypes: function () {
            return senderTypes;
          },
          app: function () {
            return app;
          }
        },
        controllerAs: '$ctrl'
      }).result;
    }

  }

  function AdminAppSettingsModalController($uibModalInstance, senderTypes, app) {
    var vm = this;

    vm.$onInit = onInit;

    vm.hasEnabledSender = _hasEnabledSender;
    vm.save = _save;

    function _hasEnabledSender() {
      if (angular.isUndefined(vm.app.enabledSenderTypes)) {
        return false;
      }

      var enabledSenderTypesValues = _.values(vm.app.enabledSenderTypes, function (value) { return value; });
      return _.some(enabledSenderTypesValues, function (property) { return property === true; });
    }

    function _save() {
      $uibModalInstance.close(vm.app);
    }

    function onInit() {
      vm.senderTypes = senderTypes;
      vm.app = angular.copy(app);
    }
  }

})();
