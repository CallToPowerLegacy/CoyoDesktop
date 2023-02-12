(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.userManagement')
      .controller('AdminGroupDetailsController', AdminGroupDetailsController);

  function AdminGroupDetailsController($state, group) {
    var vm = this;
    vm.group = group;
    vm.roles = group.roles;

    vm.save = save;

    function save() {
      vm.group.roleIds = _.map(vm.roles, 'id');
      return vm.group.save().then(function () {
        $state.go('^');
      });
    }
  }

})(angular);
