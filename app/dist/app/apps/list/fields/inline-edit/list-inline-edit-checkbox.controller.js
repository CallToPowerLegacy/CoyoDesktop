(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.list')
      .controller('ListInlineEditCheckboxController', ListInlineEditCheckboxController);

  function ListInlineEditCheckboxController() {
    var vm = this;

    vm.$onInit = init;
    vm.isToggleable = isToggleable;
    vm.toggle = toggle;

    function init() {
      vm.fieldValue.value = angular.isUndefined(vm.fieldValue.value) ? vm.field.settings.preselect || false : vm.fieldValue.value;
    }

    function isToggleable() {
      return !vm.field.required || vm.fieldValue.value === false;
    }

    function toggle() {
      if (isToggleable()) {
        vm.fieldValue.value = !vm.fieldValue.value;
        vm.inlineEditCtrl.save();
      }
    }
  }

})(angular);
