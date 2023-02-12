(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.iframe')
      .controller('IframeWidgetSettingsController', IframeWidgetSettingsController);

  function IframeWidgetSettingsController($scope) {
    var vm = this;

    vm.model = $scope.model;

    // set default height
    if (angular.isUndefined(vm.model.settings.height)) {
      vm.model.settings.height = 240;
    }

    // set default scrolling
    if (angular.isUndefined(vm.model.settings.scrolling)) {
      vm.model.settings.scrolling = true;
    }
  }
})(angular);
