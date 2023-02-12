(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.api')
      .controller('WidgetLayoutController', WidgetLayoutController);

  function WidgetLayoutController($q, $scope, $timeout, modalService, widgetEditService, WidgetLayoutModel, WidgetModel,
                                  utilService) {
    var vm = this;

    vm.renderStyle = vm.renderStyle || 'plain';
    vm.loading = true;
    vm.loadingPromises = [];
    vm.editMode = false;
    vm.canManage = angular.isDefined(vm.canManage) ? vm.canManage : true;
    vm.globalEvents = angular.isDefined(vm.globalEvents) ? vm.globalEvents : true;

    vm.addRow = addRow;
    vm.removeRow = removeRow;
    vm.isRowVisible = isRowVisible;
    vm.buildSlotName = buildSlotName;

    var createMode = vm.createMode; // preserve initial status as it might change before the save event is handled

    var layoutResponse;
    if (createMode) {
      layoutResponse = $q.resolve(new WidgetLayoutModel({
        settings: {rows: [{slots: [{cols: 12}]}]}
      }));
    } else {
      layoutResponse = new WidgetLayoutModel({name: vm.name}).getWithWidgets();
    }

    layoutResponse.then(function (layout) {
      vm.layout = layout;

      angular.forEach(vm.layout.settings.rows, function (row) {
        if (!row.name) {
          row.name = utilService.uuid();
        }
      });

      $scope.$emit('widget-layout:loaded');
    }).catch(function (error) {
      $scope.$emit('widget-layout:loadError', error);
    }).finally(function () {
      $timeout(function () {
        $q.all(vm.loadingPromises).finally(function () {
          vm.loading = false;
        });
      });
    });

    function buildSlotName(slotName) {
      return 'layout-' + vm.layout.name + '-slot-' + slotName;
    }

    function buildNextSlotName(slotData) {
      var nextSlotName = '';
      do {
        nextSlotName = vm.name + '-' + slotData.index++;
      } while (_.indexOf(slotData.names, nextSlotName) > -1);
      return nextSlotName;
    }

    function extractSlotNames(rows) {
      return _.map(_.flatMap(_.map(rows, 'slots')), 'name');
    }

    var unsubscribeEditFn = $scope.$on('widget-slot:edit', function (event, isGlobal) {
      if (!vm.globalEvents && isGlobal) {
        return;
      }
      layoutResponse.then(function () {
        vm.layout.snapshot();
        vm.editMode = true;
      });
    });

    var unsubscribeCancelFn = $scope.$on('widget-slot:cancel', function (event, isGlobal) {
      if (!vm.globalEvents && isGlobal) {
        return;
      }
      vm.layout.rollback();
      vm.editMode = false;
    });

    var unsubscribeCollectFn = $scope.$on('widget-slot:collect', function (event, data, name) {
      if (name !== vm.name || !vm.layout) {
        return;
      }

      vm.layout.name = vm.name;
      data.layout.name = vm.name;
      data.layout.parent = vm.parent;
      data.layout.isNew = createMode || vm.copyMode;

      var slotData = {
        names: extractSlotNames(vm.layout.settings.rows),
        index: 0
      };
      data.layout.rows = _.map(_.filter(vm.layout.settings.rows, function (row) {
        return !row.$deleted;
      }), function (row) {
        return {
          name: row.name,
          slots: _.map(row.slots, function (slot) {
            if (!slot.name) {
              slot.name = buildNextSlotName(slotData);
            }
            return {cols: slot.cols, name: slot.name};
          })
        };
      });
    });

    var unsubscribeFillFn = $scope.$on('widget-slot:fill-layout', function (event, data, name) {
      if (name === vm.name) {
        vm.layout.name = vm.name;
        vm.parent = data.layout.parent;
        vm.layout.settings.rows = data.layout.rows;
      }
    });

    var unsubscribeSaveFn = $scope.$on('widget-slot:save', function (event, promises, isGlobal) {
      if (!vm.globalEvents && isGlobal) {
        return;
      }
      angular.extend(vm.layout, {
        name: vm.name,
        parentId: angular.isDefined(vm.parent) ? vm.parent.id : null,
        parentType: angular.isDefined(vm.parent) ? vm.parent.typeName : null
      });

      var slotData = {
        names: extractSlotNames(vm.layout.settings.rows),
        index: 0
      };
      _.forEach(vm.layout.settings.rows, function (row) {
        _.forEach(row.slots, function (slot) {
          if (!slot.name) {
            slot.name = buildNextSlotName(slotData);
          }
        });
      });

      if (vm.layout.$deleted) {
        promises.push(vm.layout.remove());
      } else if (createMode || vm.copyMode) {
        promises.push(vm.layout.create());
      } else {
        promises.push(vm.layout.update());
      }

      vm.editMode = false;
    });

    if (vm.canManage && vm.globalEvents) {
      widgetEditService.register(vm.name, !vm.parent);
    }

    $scope.$on('$destroy', function () {
      widgetEditService.deregister(vm.name);
      unsubscribeEditFn();
      unsubscribeCancelFn();
      unsubscribeCollectFn();
      unsubscribeFillFn();
      unsubscribeSaveFn();
    });

    // ------------------------------------------------------------------------------------------

    function addRow(index) {
      modalService.open({
        controller: 'WidgetLayoutRowChooserController',
        templateUrl: 'app/widgets/api/components/widget-layout/widget-layout-row-chooser-modal.html',
        resolve: {
          layout: function () {
            return vm.layout;
          },
          index: function () {
            return index;
          }
        }
      });
    }

    function removeRow(index) {
      modalService.confirm({
        title: 'WIDGETS.LAYOUT.ROW.DELETE',
        text: 'WIDGETS.LAYOUT.ROW.DELETE.CONFIRM',
        close: {title: 'YES'},
        dismiss: {title: 'NO'}
      }).result.then(function () {
        vm.layout.settings.rows[index].$deleted = true;
      });
    }

    function isRowVisible(row) {
      return row.$deleted !== true;
    }
  }

})(angular);
