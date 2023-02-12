(function () {
  'use strict';

  angular.module('coyo.admin.apps-widgets')
      .factory('adminWidgetSettingsModal', adminWidgetSettingsModal)
      .controller('AdminWidgetSettingsModalController', AdminWidgetSettingsModalController);

  /**
   * @ngdoc service
   * @name coyo.account.adminWidgetSettingsModal
   *
   * @description
   * Provides a modal to set the widget settings for a given widget. Only used in mobile resolutions.
   *
   * @requires modalService
   */
  function adminWidgetSettingsModal(modalService) {

    return {
      open: open
    };

    /**
     * @ngdoc method
     * @name coyo.account.adminWidgetSettingsModal#open
     * @methodOf coyo.account.adminWidgetSettingsModal
     *
     * @description
     * Opens the modal to set the widget settings for a given widget.
     *
     * @param {object} widget the widget
     *
     * @returns {object} promise contains the result of the saving dialog
     */
    function open(widget) {
      return modalService.open({
        controller: 'AdminWidgetSettingsModalController',
        templateUrl: 'app/modules/admin/apps-widgets/views/widget-list/admin-widget-settings-modal.html',
        resolve: {
          widget: function () {
            return widget;
          }
        },
        controllerAs: '$ctrl'
      }).result;
    }

  }

  function AdminWidgetSettingsModalController($uibModalInstance, widget) {
    var vm = this;

    vm.$onInit = onInit;
    vm.isWidgetEnabled = _isWidgetEnabled;
    vm.save = save;

    function _isWidgetEnabled() {
      return vm.widget.enabled;
    }

    function save() {
      $uibModalInstance.close(vm.widget);
    }

    function onInit() {
      vm.widget = angular.copy(widget);
    }
  }

})();
