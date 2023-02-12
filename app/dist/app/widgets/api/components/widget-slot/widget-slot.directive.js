(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.api')
      .directive('coyoWidgetSlot', widgetSlot)
      .controller('WidgetSlotController', WidgetSlotController);

  /**
   * @ngdoc directive
   * @name coyo.widgets.api.coyoWidgetSlot:coyoWidgetSlot
   * @restrict E
   * @scope
   *
   * @description
   * This directive creates a slot for widgets. Within this slot one or more widgets can be placed. Widgets can be
   * deleted, reordered and edited. In order to do so the user has to toggle into an edit mode which is also provided
   * by this directive.
   *
   * Slots can be independent (e.g. a slot on the timeline) or depend on a parent (e.g. a page, a workspace etc.). If
   * the slot depends on a parent this entity must be passed into the directive.
   *
   * @param {string} name
   * The name of the slot. This name must be unique within the whole system. All widgets of this slot will be assigned
   * to this name or a combination of the name and the assigned parent.
   *
   * @param {boolean=} canManage
   * A boolean determining whether the current user can manage the slot. This might (but not always does) depend on the
   * parent this slot belongs to. If not set, this is automatically set to `true`.
   *
   * @param {object=} parent
   * The parent of this widget / slot if there is one. This is needed in case there is a parent the given slot belongs
   * to. E.g. slots for a page or a workspace need to be passed as parent so we can make sure, that the widget is only
   * shown for this particular page / workspace.
   *
   * @param {string} parent.id
   * If a parent is provided it needs an id to be identified.
   *
   * @param {string} parent.typeName
   * If a parent is provided it needs a `typeName` so the type can be resolved (e.g. `page` or `workspace`).
   *
   * @param {string} renderStyle
   * The style of the widget slot. The following styles are available: `plain` (no additional styling), `panel` (slot is
   * rendered inside of a panel), `panels` (each widget is rendered inside of a panel). Defaults to `panel`.
   *
   * @param {boolean=} globalEvents
   * Specifies whether the slot should react to global events (default) or to local events only.
   *
   * @param {boolean} [hideSlotPlaceholder=false]
   * Optional flag to hide the slot placeholder divider which is usually shown if a slot has no widget.
   *
   * @param {boolean=} initialEditMode
   * Optional flag, if set to true any newly created slot will be set in edit mode without having to be sent an event.
   *
   * @param {object[]=} loadingPromises
   * Optional array that this directive can add it's loading promise to so that the loading state can be displayed up the hierarchy.
   *
   * @param {boolean=} copyMode
   * If set to true, existing widgets are not updated on save but created. Requires that the slot name is changed
   * between loading and saving. Useful when persisting multiple versions of a widget slot.
   *
   * @param {boolean=} simpleMode
   * If true, the add widget option will be hidden.
   *
   * @param {boolean=} options
   * Additional options.
   *
   * @param {boolean=} addInitialWidget
   * If true tell the slots to add a default widget if there are not widgets present.
   *
   * @requires coyo.widgets.api.widgetRegistry
   */
  function widgetSlot() {
    return {
      restrict: 'E',
      templateUrl: 'app/widgets/api/components/widget-slot/widget-slot.html',
      scope: {},
      replace: true,
      bindToController: {
        name: '@',
        canManage: '<?',
        parent: '<?',
        renderStyle: '@',
        globalEvents: '<?',
        hideSlotPlaceholder: '<?',
        initialEditMode: '<?',
        loadingPromises: '=?',
        copyMode: '<?',
        simpleMode: '<?',
        options: '<?',
        addInitialWidget: '<?'
      },
      controller: 'WidgetSlotController',
      controllerAs: '$ctrl'
    };
  }

  function WidgetSlotController($rootScope, $scope, $q, $timeout, modalService, WidgetModel,
                                widgetRegistry, widgetEditService, widgetChooserModalService,
                                widgetSettingsModalService) {
    var vm = this;

    vm.widgets = [];
    vm.originalWidgets = [];
    vm.editMode = vm.initialEditMode || false;
    vm.renderStyle = vm.renderStyle || 'panel';
    vm.canManage = angular.isDefined(vm.canManage) ? vm.canManage : true;
    vm.globalEvents = angular.isDefined(vm.globalEvents) ? vm.globalEvents : true;
    vm.hideSlotPlaceholder = vm.hideSlotPlaceholder || false;

    vm.addWidget = addWidget;
    vm.editWidget = editWidget;
    vm.removeWidget = removeWidget;
    vm.cutWidget = cutWidget;
    vm.renameWidget = renameWidget;
    vm.pasteWidget = pasteWidget;
    vm.toggleMobile = toggleMobile;
    vm.orderWidget = orderWidget;
    vm.hasPanel = hasPanel;
    vm.hasPanelBody = hasPanelBody;
    vm.hasVisibleWidgets = hasVisibleWidgets;
    vm.showOptionsDivider = showOptionsDivider;
    vm.isMobileHidden = isMobileHidden;
    vm.isAddButtonVisible = isAddButtonVisible;
    vm.isPasteButtonVisible = isPasteButtonVisible;

    vm.enableEditMode = enableEditMode;
    vm.clearClipboard = clearClipboard;
    vm.save = save;
    vm.cancel = cancel;

    // ----------

    function addWidget() {
      if (!vm.editMode) {
        enableEditMode(false);
      }
      widgetChooserModalService.open(vm.name, vm.parent).then(function (widget) {
        widget.snapshot();
        var newWidget = _buildWidget(widget);
        newWidget.model.tempId = Date.now();
        vm.widgets.push(newWidget);
      });
    }

    function editWidget(widget, widgetScope) {
      widgetSettingsModalService.open(widget.model).then(function (result) {
        widget.model = result;
        $timeout(function () {
          widgetScope.$broadcast('widget:settingsChanged', result);
        });
      });
    }

    function removeWidget(widget) {
      if ($rootScope.widgetClipboard && $rootScope.widgetClipboard.widget.id === widget.model.id) {
        clearClipboard();
      }
      modalService.confirm({
        title: 'WIDGETS.MODAL.REMOVE.TITLE',
        text: 'WIDGETS.MODAL.REMOVE.TEXT',
        close: {title: 'YES'},
        dismiss: {title: 'NO'}
      }).result.then(function () {
        if (widget.model.isNew()) {
          _.remove(vm.widgets, widget);
        } else {
          widget.deleted = true;
        }
      });
    }

    function renameWidget(widget) {
      widget.model._showTitleInput = !widget.model._showTitleInput;
    }

    function cutWidget(originalStack, widget) {
      if ($rootScope.widgetClipboard && $rootScope.widgetClipboard.widget === widget.model) {
        clearClipboard();
      } else {
        $rootScope.widgetClipboard = {
          widget: angular.copy(widget.model),
          onAfterMove: function (slot) {
            if (!_.some(slot.widgets, function (elem) {
              return hasSameId(widget, elem);
            })) {
              widget.model.slot = slot.name;
              if (slot.parent) {
                widget.model.parentId = slot.parent.id;
                widget.model.parentType = slot.parent.typeName;
              }
              _.remove(originalStack, function (row) {
                return hasSameId(row, widget);
              });
              slot.widgets.push(widget);
              clearClipboard();
            }
          }
        };
      }
    }

    function hasSameId(widget, otherWidget) {
      if (angular.isUndefined(widget.model.id)) {
        if (angular.isDefined(widget.model._id)) {
          return otherWidget.model._id === widget.model._id;
        } else {
          return otherWidget.model.tempId === widget.model.tempId;
        }
      } else {
        return otherWidget.model.id === widget.model.id;
      }
    }

    function pasteWidget() {
      if ($rootScope.widgetClipboard) {
        $rootScope.widgetClipboard.onAfterMove(vm);
      }
    }

    function toggleMobile(widgetModel) {
      widgetModel.settings._hideMobile = !widgetModel.settings._hideMobile;
    }

    function orderWidget(widget, up) {
      var currentIndex = _.indexOf(vm.widgets, widget);
      var newIndex = currentIndex + (up ? -1 : 1);
      if (newIndex >= 0 && newIndex < vm.widgets.length) {
        vm.widgets.splice(currentIndex, 1);
        vm.widgets.splice(newIndex, 0, widget);
      }
    }

    function hasPanel(widget) {
      return !_getRenderOption(widget, 'noPanel') && vm.renderStyle === 'panels';
    }

    function hasPanelBody(widget) {
      return !_getRenderOption(widget, 'noPanel') && (vm.renderStyle === 'panels' || vm.renderStyle === 'panel');
    }

    function hasVisibleWidgets() {
      return _.filter(vm.widgets, function (widget) {
        return widget.deleted !== true;
      }).length > 0;
    }

    function showOptionsDivider() {
      return !vm.hideSlotPlaceholder && vm.editMode && !vm.hasVisibleWidgets() && !vm.simpleMode;
    }

    function isMobileHidden(widget) {
      return _.get(widget, 'model.settings._hideMobile', false);
    }

    function isAddButtonVisible() {
      return vm.editMode && !vm.simpleMode && !isPasteButtonVisible();
    }

    function isPasteButtonVisible() {
      return vm.editMode
          && angular.isDefined($rootScope.widgetClipboard)
          && !vm.simpleMode;
    }

    // ----------

    function enableEditMode(isGlobal) {
      if (!vm.globalEvents && isGlobal) {
        return;
      }

      vm.editMode = true;
      _.forEach(vm.widgets, function (widget) {
        widget.model.snapshot();
      });
      vm.originalWidgets = vm.widgets.slice();
    }

    function clearClipboard() {
      $rootScope.widgetClipboard = undefined;
    }

    function save(isGlobal) {
      if (!vm.globalEvents && isGlobal) {
        return $q.resolve();
      }

      var deferred = $q.defer();

      vm.saving = true;
      $timeout(function () { // when in a layout, we need for the slot names to be updated by the layout directive
        _.forEach(vm.widgets, function (widget) {
          widget.model.slot = vm.name;
          if (vm.parent) {
            widget.model.parentId = vm.parent.id;
            widget.model.parentType = vm.parent.typeName;
          }
        });

        $q.all([_deleteMarkedWidgets(), _saveModifiedWidgets()]).then(function () {
          return _updateWidgetOrder();
        }).then(function () {
          vm.editMode = false;
        }).catch(function (error) {
          // when there are multiple widget slots saved in parallel, not all errors will reject the combined promise up the hierarchy
          // and the caller may want to react to the fact that some call was not successful (e.g. by not disabling edit mode)
          $scope.$emit('widget-slot:save-error', error);
        }).finally(function () {
          vm.saving = false;
          deferred.resolve();
        });
      });

      return deferred.promise;
    }

    function cancel(isGlobal) {
      if (!vm.globalEvents && isGlobal) {
        return;
      }

      vm.editMode = false;
      vm.widgets = vm.originalWidgets;
      _.forEach(vm.widgets, function (widget) {
        widget.model.rollback();
        widget.deleted = false;
      });

      $scope.$broadcast('widget:settingsChanged');
    }

    /* ===== PRIVATE METHODS ===== */

    function _buildWidget(widget) {
      return {
        model: widget,
        config: widgetRegistry.get(widget.key),
        deleted: false
      };
    }

    function _deleteMarkedWidgets() {
      var deletedWidgets = _.filter(vm.widgets, function (widget) {
        return widget.deleted && !widget.model.isNew() && widget.model.id;
      });
      return $q.all(_.map(deletedWidgets, function (widget) {
        return widget.model.remove();
      })).then(function () {
        vm.widgets = _.filter(vm.widgets, function (widget) {
          return !widget.deleted;
        });
      });
    }

    function _saveModifiedWidgets() {
      var modifiedWidgets = _.filter(vm.widgets, function (widget) {
        return (widget.model.unsnappedChanges() || widget.model.isNew() || vm.copyMode) && !widget.deleted;
      });
      return $q.all(_.map(modifiedWidgets, function (widget) {
        return widget.model.save().then(function (result) {
          result._id = result.id;
          widget.model = result;
          return result;
        });
      }));
    }

    function _updateWidgetOrder() {
      var widgetIds = _.map(vm.widgets, 'model.id');
      var originalWidgetIds = _.map(vm.originalWidgets, 'model.id');
      if (widgetIds.length > 0 && !angular.equals(widgetIds, originalWidgetIds)) {
        return WidgetModel.order(vm.name, vm.parent, widgetIds);
      }
      return $q.resolve();
    }

    function _getRenderOption(widget, option) {
      return _.get(widget.config, 'renderOptions.' + vm.renderStyle + '.' + option);
    }

    (function init() {
      if (vm.canManage && vm.globalEvents) {
        widgetEditService.register(vm.name, !vm.parent);
      }

      // react to outside edit controls via events
      var unsubscribeEditFn = $scope.$on('widget-slot:edit', function (event, isGlobal) {
        enableEditMode(isGlobal);
      });
      var unsubscribeSaveFn = $scope.$on('widget-slot:save', function (event, savingPromises, isGlobal) {
        var promise = save(isGlobal);
        if (angular.isArray(savingPromises)) {
          savingPromises.push(promise);
        }
      });
      var unsubscribeCollectFn = $scope.$on('widget-slot:collect', function (event, data, name, promises) {
        var deferred = $q.defer();
        promises.push(deferred.promise);

        $timeout(function () { // when in a layout, we need for the slot names to be updated by the layout directive
          _.forEach(vm.widgets, function (widget) {
            if (widget.deleted) {
              return;
            }
            widget.model.slot = vm.name;
            if (vm.parent) {
              widget.model.parentId = vm.parent.id;
              widget.model.parentType = vm.parent.typeName;
            }
            data.slots.push(widget);
          });
          deferred.resolve();
        });
      });
      var unsubscribeFillFn = $scope.$on('widget-slot:fill-slots', function (event, data, name) {
        if (!_.includes(vm.name, name)) {
          return;
        }

        promise.then(function () {
          vm.widgets.length = 0;
          _.forEach(data.slots, function (widget) {
            if (vm.name === widget.model.slot) {
              vm.widgets.push(_buildWidget(new WidgetModel(widget.model)));
            }
          });
          vm.originalWidgets = vm.widgets.slice();
        });
      });
      var unsubscribeCancelFn = $scope.$on('widget-slot:cancel', function (event, isGlobal) {
        cancel(isGlobal);
      });

      $scope.$on('$destroy', function () {
        clearClipboard();
        widgetEditService.deregister(vm.name);
        unsubscribeEditFn();
        unsubscribeSaveFn();
        unsubscribeCollectFn();
        unsubscribeFillFn();
        unsubscribeCancelFn();
      });

      if (vm.initialEditMode) {
        enableEditMode(false);
      }

      var params = (vm.parent) ? {
        parentId: vm.parent.id,
        parentType: vm.parent.typeName
      } : {};

      // Get all widgets for this slot and filter with list of enabled widgets
      var promise = WidgetModel.queryWithCache(params, vm.name).then(function (widgets) {
        _.forEach(widgets, function (widget) {
          widget._id = widget.id; //do this always so we can reference this instead of id when we are in copy mode
          if (vm.copyMode) {
            widget.dataReference = widget.dataReference || widget.id;
            delete widget.id;
          }

        });
        vm.widgets = _.map(widgets, _buildWidget);
        if (vm.addInitialWidget && !vm.widgets.length) {
          vm.widgets.push(_buildWidget(new WidgetModel({key: 'rte', _permissions: {manage: true, update: true}})));
        }
      });
      if (vm.loadingPromises) {
        vm.loadingPromises.push(promise);
      }
    })();
  }

})(angular);
