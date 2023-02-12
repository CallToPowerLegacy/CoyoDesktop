(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.timeline')
      .controller('TimelineSettingsController', TimelineSettingsController);

  function TimelineSettingsController($scope) {
    var vm = this;

    vm.app = $scope.model;
    vm.app.settings.authorType = _.getNullUndefined(vm, 'app.settings.authorType', 'VIEWER');
  }

})(angular);
