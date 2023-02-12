(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.list.fields')
      .controller('OptionsFieldSettingsController', OptionsFieldSettingsController);

  function OptionsFieldSettingsController($scope) {
    var vm = this;
    vm.settings = $scope.model;
    vm.optionName = '';
    vm.treeOptions = {};

    vm.$onInit = init;
    vm.hasError = hasError;

    function hasError() {
      var field = $scope.settingsForm['field-options'];
      return (field)
        ? $scope.settingsForm['field-options'].$error.noOptions && $scope.settingsForm['field-options'].$dirty
        : false;
    }

    function init() {
      if (!vm.settings.options) {
        vm.settings.options = [];
      }
    }
  }
})(angular);
