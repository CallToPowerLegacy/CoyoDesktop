(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.list')
      .controller('ListSettingsController', ListSettingsController);

  /**
   * The list settings controller
   *
   * @constructor
   */
  function ListSettingsController($scope) {
    var vm = this;
    var PERMISSIONS = ['ALL', 'OWN', 'NONE'];

    vm.$onInit = initController;
    vm.isEnabled = isEnabled;
    vm.handleReadPermissionChange = handleReadPermissionChange;


    function initController() {
      var defaults = {
        permissionCreate: 'YES',
        permissionRead: 'ALL',
        permissionEdit: 'OWN',
        permissionDelete: 'OWN',
        notification: 'NONE',
        maxEntries: 0
      };
      vm.app = $scope.model;
      vm.app.settings = angular.extend(defaults, vm.app.settings);
      vm.permissions = PERMISSIONS;
      vm.permissionIcons = {
        'NONE': 'zmdi-block',
        'OWN': 'zmdi-lock-outline',
        'ALL': 'zmdi-globe'
      };
    }

    function isEnabled(permission) {
      var readPermission = vm.app.settings.permissionRead;
      return !_isPermissionLessThan(readPermission, permission);
    }

    function handleReadPermissionChange() {
      var readPermission = vm.app.settings.permissionRead;
      if (_isPermissionLessThan(readPermission, vm.app.settings.permissionEdit)) {
        vm.app.settings.permissionEdit = readPermission;
      }
      if (_isPermissionLessThan(readPermission, vm.app.settings.permissionDelete)) {
        vm.app.settings.permissionDelete = readPermission;
      }
    }

    function _isPermissionLessThan(permission, other) {
      return PERMISSIONS.indexOf(permission) > PERMISSIONS.indexOf(other);
    }

  }

})(angular);
