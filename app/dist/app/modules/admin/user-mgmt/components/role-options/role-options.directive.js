(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.userManagement')
      .directive('oyocRoleOptions', roleOptions);

  /**
   * @ngdoc directive
   * @name coyo.admin.userManagement.oyocRoleOptions:oyocRoleOptions
   * @restrict 'E'
   *
   * @description
   * Context menu options for user role list.
   *
   * @param {object} actions actions
   * @param {object} role role
   */
  function roleOptions() {
    return {
      restrict: 'E',
      templateUrl: 'app/modules/admin/user-mgmt/components/role-options/role-options.html',
      scope: {},
      bindToController: {
        actions: '<',
        role: '<'
      },
      controller: function () {},
      controllerAs: '$ctrl'
    };
  }

})(angular);
