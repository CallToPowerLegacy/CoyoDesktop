(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.wiki')
      .controller('WikiWidgetSettingsController', WikiWidgetSettingsController);

  function WikiWidgetSettingsController($scope, $translate, AppModel) {
    var vm = this;

    vm.model = $scope.model;
    vm.loading = false;
    vm.model.settings._articleCount = vm.model.settings._articleCount || 5;

    $scope.$watch(function () { return vm.selectedApp; }, function (newVal, oldVal) {
      if (newVal !== oldVal) {

        vm.model.settings._appId = null;
        vm.model.settings._senderId = null;

        if (vm.selectedApp) {
          vm.model.settings._appId = vm.selectedApp.id;
          vm.model.settings._senderId = vm.selectedApp.senderId;
        }
      }
    });

    (function _init() {
      if (!vm.model.settings._appId && !vm.model.settings._senderId) {
        return;
      }
      vm.loading = true;

      AppModel.get({senderId: vm.model.settings._senderId, id: vm.model.settings._appId}).then(function (app) {

        vm.selectedApp = {
          id: app.id,
          senderId: app.senderId,
          displayName: app.name
        };
      }).catch(function () {
        $translate('WIDGETS.WIKI.SETTINGS.APP_LOAD_ERROR').then(function (msg) {
          vm.selectedApp = {displayName: '<' + msg + '>'};
        });
      }).finally(function () {
        vm.loading = false;
      });
    })();
  }

})(angular);
