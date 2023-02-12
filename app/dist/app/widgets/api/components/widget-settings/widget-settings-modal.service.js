(function (angular) {
  'use strict';

  angular.module('coyo.widgets.api')
      .factory('widgetSettingsModalService', widgetSettingsModalService)
      .controller('WidgetSettingsModalController', WidgetSettingsModalController);

  /**
   * @ngdoc service
   * @name coyo.widgets.api.widgetSettingsModalService
   *
   * @description
   * Opens a modal to edit a widget's settings.
   *
   * @requires modalService
   */
  function widgetSettingsModalService(modalService) {

    return {
      open: open
    };

    /**
     * @ngdoc method
     * @name coyo.widgets.api.widgetSettingsModalService#open
     * @methodOf coyo.widgets.api.widgetSettingsModalService
     *
     * @description
     * Opens the modal to edit a widgets settings (if existing).
     *
     * @param {object} widget
     * The model of the widget to edit the settings for.
     *
     * @returns {object} A promise containing the modified widget if saved.
     */
    function open(widget) {
      return modalService.open({
        size: 'lg',
        templateUrl: 'app/widgets/api/components/widget-settings/widget-settings-modal.html',
        controller: 'WidgetSettingsModalController',
        resolve: {
          widget: function () {
            return angular.copy(widget);
          }
        }
      }).result;
    }
  }

  function WidgetSettingsModalController(widget, $uibModalInstance, widgetRegistry, $q) {
    var vm = this;
    vm.widget = widget;
    vm.widgetConfig = widgetRegistry.get(widget.key);

    vm.saveCallbacks = {
      onBeforeSave: function () {
        return $q.resolve();
      }
    };

    vm.save = save;

    function save() {
      vm.saveCallbacks.onBeforeSave().then(function () {
        $uibModalInstance.close(widget);
      });
    }
  }

})(angular);
