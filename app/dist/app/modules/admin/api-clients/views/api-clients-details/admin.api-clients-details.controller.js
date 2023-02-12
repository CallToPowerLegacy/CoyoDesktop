(function (angular) {
  'use strict';

  angular.module('coyo.admin.apiClients')
      .controller('AdminApiClientsDetailsController', AdminApiClientsDetailsController);

  function AdminApiClientsDetailsController($state, client) {
    var vm = this;

    vm.client = client;

    vm.save = save;

    function save() {
      return vm.client.create()
          .then(function () {
            $state.go('^.list');
          });
    }
  }

})(angular);
