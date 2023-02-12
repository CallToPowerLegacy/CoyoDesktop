(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.task')
      .controller('TaskSettingsController', TaskSettingsController);

  function TaskSettingsController($scope) {
    var vm = this;

    vm.$onInit = _onInit;

    // ====================

    function _onInit() {
      $scope.model.settings.manageTasks = $scope.model.settings.manageTasks || 'VIEWER';
      $scope.model.settings.manageList = $scope.model.settings.manageList || 'ADMIN';
    }
  }

})(angular);
