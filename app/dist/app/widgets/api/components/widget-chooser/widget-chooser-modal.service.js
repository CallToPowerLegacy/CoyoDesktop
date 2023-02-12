(function (angular) {
  'use strict';

  angular.module('coyo.widgets.api')
      .factory('widgetChooserModalService', widgetChooserModalService)
      .controller('WidgetChooserModalController', WidgetChooserModalController);

  /**
   * @ngdoc service
   * @name coyo.widgets.api.widgetChooserModalService
   *
   * @description
   * This service opens a modal which can be used to choose a widget from all registered widgets. Widgets that have been
   * deactivated are not listed in this modal. The widget is then added to the given slot for the given parent (if
   * there is one).
   *
   * @requires modalService
   */
  function widgetChooserModalService(modalService) {

    return {
      open: open
    };

    /**
     * @ngdoc method
     * @name coyo.widgets.api.widgetChooserModalService#open
     * @methodOf coyo.widgets.api.widgetChooserModalService
     *
     * @description
     * Opens the modal to choose a widget from. When saved the chosen widget is created and added to the given slot
     * with the given parent (if existent).
     *
     * @param {string} slot
     * The name / identifier of the slot to add the new widget to.
     *
     * @param {object=} parent
     * The parent of this widget / slot. This is needed in case there is a parent the given slot belongs to. E.g. slots
     * for a page or a workspace need to be passed as parent so we can make sure, that the widget is only shown for
     * this particular page / workspace.
     *
     * @param {string} parent.id
     * If a parent is provided it needs an id to be identified.
     *
     * @param {string} parent.typeName
     * If a parent is provided it needs a typeName so the type can be resolved (e.g. `page` or `workspace`).
     *
     * @returns {object} Promise to resolve when the modal is closed. The promise contains the newly created widget if
     * saved successfully.
     */
    function open(slot, parent) {
      return modalService.open({
        size: 'lg',
        templateUrl: 'app/widgets/api/components/widget-chooser/widget-chooser-modal.html',
        controller: 'WidgetChooserModalController',
        resolve: {
          slot: function () { return slot; },
          parent: function () { return parent; }
        }
      }).result;
    }
  }

  function WidgetChooserModalController(widgetRegistry,
                                        WidgetModel,
                                        $uibModalInstance,
                                        $scope,
                                        slot,
                                        parent,
                                        $rootScope,
                                        $q) {
    var vm = this;

    vm.widgets = widgetRegistry.getAll();

    vm.save = save;
    vm.goBack = goBack;

    $scope.$watch(function () {
      return vm.widgetConfig;
    }, function (newVal, oldVal) {
      if (oldVal !== newVal) {
        if (newVal) {
          vm.widget = WidgetModel.fromConfig(newVal);
          if (parent) {
            vm.widget.parentId = parent.id;
            vm.widget.parentType = parent.typeName;
          }
          if (!newVal.settings || newVal.settings.skipOnCreate) {
            save();
          }
        } else {
          vm.widget = null;
        }
      }
    });

    vm.saveCallbacks = {
      onBeforeSave: function () {
        return $q.resolve();
      }
    };

    function goBack() {
      vm.widgetConfig = null;
    }

    function save() {
      vm.saveCallbacks.onBeforeSave().then(function () {
        vm.widget.slot = slot;
        if (parent) {
          vm.widget.parentId = parent.id;
          vm.widget.parentType = parent.typeName;
        }
        _.set(vm.widget, '_permissions.manage', true);
        $uibModalInstance.close(vm.widget);
        $rootScope.$emit('widget:created', vm.widget);
      });
    }
  }

})(angular);
