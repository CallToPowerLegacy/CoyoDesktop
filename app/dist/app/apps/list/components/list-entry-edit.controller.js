(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.list')
      .controller('ListEntryEditController', ListEntryEditController);

  function ListEntryEditController(listEntryDetailsService, ListEntryModel, $timeout) {
    var vm = this;
    vm.loading = true;

    vm.$onInit = onInit;
    vm.save = save;

    function save() {
      vm.entry.senderId = vm.context.senderId;
      vm.entry.appId = vm.context.appId;
      vm.entry.save().then(function (result) {
        listEntryDetailsService.editComplete(result);
        vm.entry._permissions = vm.entry._permissions ||
            {
              edit: true,
              comment: true
            };
      });
    }

    function onInit() {
      vm.context = listEntryDetailsService.getCurrentContext();
      vm.loading = true;
      ListEntryModel.get(vm.context, {
        dto: 'edit'
      }).then(function (result) {
        vm.entry = result;
      }).finally(function () {
        $timeout(function () {
          vm.loading = false;
        });
      });
    }
  }

})(angular);
