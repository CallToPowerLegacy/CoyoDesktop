(function (angular) {
  'use strict';

  angular.module('coyo.admin.apps-widgets')
      .controller('AdminWidgetListController', AdminWidgetListController);

  function AdminWidgetListController($rootScope, $scope, $q, $timeout, widgetRegistry, WidgetConfigurationModel,
                                     widgetConfigs, adminWidgetSettingsModal) {
    var vm = this;

    vm.$onInit = onInit;
    vm.openSettings = openSettings;

    function toggle(widget) {
      var deferred = $q.defer();

      $timeout(function () { // wait for coyoCheckbox to update model
        if (widget.enabled) {
          WidgetConfigurationModel.enable(widget.key).finally(deferred.resolve);
        } else {
          widget.moderatorsOnly = false;
          WidgetConfigurationModel.disable(widget.key).finally(deferred.resolve);
        }
      });

      return deferred.promise;
    }

    function toggleModerator(widget) {
      $timeout(function () { // wait for coyoCheckbox to update model
        if (widget.moderatorsOnly) {
          WidgetConfigurationModel.restrict(widget.key);
        } else {
          WidgetConfigurationModel.derestrict(widget.key);
        }
      });
    }

    function openSettings(widget) {
      adminWidgetSettingsModal
          .open(widget)
          .then(_saveModalChanges);
    }

    function _saveModalChanges(changedWidget) {
      var widget = _.find(vm.widgets, {key: changedWidget.key});
      if (widget) {
        if (changedWidget.enabled !== widget.enabled) {
          widget.enabled = changedWidget.enabled;
          toggle(widget).then(function () {
            _checkAndToggleModerator(widget, changedWidget);
          });
        } else {
          _checkAndToggleModerator(widget, changedWidget);
        }
      }
    }

    function _checkAndToggleModerator(widget, changedWidget) {
      if (widget.enabled && changedWidget.moderatorsOnly !== widget.moderatorsOnly) {
        widget.moderatorsOnly = changedWidget.moderatorsOnly;
        toggleModerator(widget);
      }
    }

    function _loadWidgets() {
      vm.widgets = _.map(widgetRegistry.getAll(), function (widget) {
        return angular.extend(widget, {enabled: false, moderatorsOnly: false}, _.find(widgetConfigs, {key: widget.key}));
      });
    }

    function onInit() {
      vm.widgets = [];
      vm.toggle = toggle;
      vm.toggleModerator = toggleModerator;
      vm.isMobile = $rootScope.screenSize.isXs || $rootScope.screenSize.isSm;

      var unsubscribe = $rootScope.$on('screenSize:changed', function (event, screenSize) {
        vm.isMobile = screenSize.isXs || screenSize.isSm;
      });
      $scope.$on('$destroy', unsubscribe);

      _loadWidgets();
    }
  }

})(angular);
