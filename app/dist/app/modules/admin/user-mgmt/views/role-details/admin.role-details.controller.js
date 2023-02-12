(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.userManagement')
      .controller('AdminRoleDetailsController', AdminRoleDetailsController);

  function AdminRoleDetailsController($state, role, permissionConfiguration) {
    var vm = this;
    vm.role = role;
    vm.groups = role.groups;
    vm.permissionConfiguration = permissionConfiguration;

    vm.save = save;

    function save() {
      vm.role.groupIds = _.map(vm.groups, 'id');
      return vm.role.save().then(function () {
        $state.go('^');
      });
    }

    // ----------

    (function _init() {
      vm.permissions = {};
      _.flatten(_.map(vm.permissionConfiguration, function (group) {
        return _.map(group.permissions, function (permission) {
          return permission.key;
        });
      })).forEach(function (permission) {
        Object.defineProperty(vm.permissions, permission, {
          get: function () {
            return vm.role.permissions.indexOf(permission) >= 0;
          },
          set: function (value) {
            var index = vm.role.permissions.indexOf(permission);
            if (value && index === -1) {
              vm.role.permissions.push(permission);
            }
            if (!value && index >= 0) {
              vm.role.permissions.splice(index, 1);
            }
          }
        });
      });
    })();
  }

})(angular);
