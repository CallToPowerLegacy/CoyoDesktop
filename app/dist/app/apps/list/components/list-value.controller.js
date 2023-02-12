(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.list')
      .controller('ListValueController', ListValueController);

  function ListValueController(fieldTypeRegistry, listService) {
    var vm = this;

    vm.$onInit = init;
    vm.showInlineEdit = showInlineEdit;

    function init() {
      vm.fieldValue = listService.getFieldValue(vm.entry, vm.field.id);
      vm.renderConfig = fieldTypeRegistry.getRenderProperty(vm.field.key);
    }

    function showInlineEdit() {
      return vm.entry._permissions.edit && angular.isDefined(fieldTypeRegistry.getInlineEditProperty(vm.field.key));
    }
  }

})(angular);
