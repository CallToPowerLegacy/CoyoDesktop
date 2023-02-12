(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.userManagement')
      .directive('oyocGroupOptions', groupOptions);

  /**
   * @ngdoc directive
   * @name coyo.admin.userManagement.oyocGroupOptions:oyocGroupOptions
   * @restrict 'E'
   *
   * @description
   * Context menu options for user group list.
   *
   * @param {object} actions actions
   * @param {object} group group
   */
  function groupOptions() {
    return {
      restrict: 'E',
      templateUrl: 'app/modules/admin/user-mgmt/components/group-options/group-options.html',
      scope: {},
      bindToController: {
        actions: '<',
        group: '<'
      },
      controller: function () {},
      controllerAs: '$ctrl'
    };
  }

})(angular);
