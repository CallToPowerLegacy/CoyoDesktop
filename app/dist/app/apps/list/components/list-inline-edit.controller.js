(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.list')
      .controller('ListInlineEditController', ListInlineEditController);

  function ListInlineEditController(fieldTypeRegistry, listService, ListEntryModel) {
    var vm = this;

    vm.$onInit = init;
    vm.save = save;

    var previousValue;

    function init() {
      vm.fieldValue = listService.getFieldValue(vm.entry, vm.field.id);
      vm.templateUrl = fieldTypeRegistry.getInlineEditProperty(vm.field.key).templateUrl;
      previousValue = vm.fieldValue.value;
    }

    function save() {
      var context = {
        appId: vm.app.id,
        senderId: vm.app.senderId,
        id: vm.entry.id
      };
      ListEntryModel.updateValue(context, vm.fieldValue).then(function (entry) {
        entry._permissions = vm.entry._permissions;
        vm.entry = entry;
        if (angular.isFunction(vm.onSave)) {
          vm.onSave(vm.entry);
        }
        previousValue = vm.fieldValue.value;
      }).catch(function () {
        vm.fieldValue.value = previousValue;
      });
    }
  }

})(angular);
