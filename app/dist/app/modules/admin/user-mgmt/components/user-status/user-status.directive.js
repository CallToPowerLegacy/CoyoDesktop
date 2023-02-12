(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.userManagement')
      .directive('oyocUserStatus', userStatus);

  /**
   * @ngdoc directive
   * @name coyo.admin.userManagement.oyocUserStatus:oyocUserStatus
   * @restrict 'E'
   *
   * @description
   * Render a label containing the user status. Differs from active-label.directive as it also supports deleted user status.
   *
   * @param {string} status The user status (one of 'active', 'inactive', 'deleted')
   *
   * @example
   * <example module="example">
   *   <file name="index.html">
   *     <div ng-controller="ExampleCtrl">
   *       <oyoc-user-status status="user.status"></oyoc-user-status>
   *     </div>
   *   </file>
   *   <file name="script.js">
   *     angular
   *       .module('example', [])
   *       .controller('ExampleCtrl', ExampleCtrl);
   *
   *     function ExampleCtrl($scope) {
   *       $scope.actions = {};
   *       $scope.user = {id: 'UserId', status: 'active'};
   *     }
   *   </file>
   * </example>
   */
  function userStatus() {
    return {
      restrict: 'E',
      templateUrl: 'app/modules/admin/user-mgmt/components/user-status/user-status.html',
      scope: {},
      bindToController: {
        status: '='
      },
      controller: function () {
        var vm = this;
        vm.labelClass = function () {
          return {
            'ACTIVE': 'label-success',
            'INACTIVE': 'label-default',
            'DELETED': 'label-danger',
            'HIDDEN': 'label-warning'
          }[vm.status];
        };
      },
      controllerAs: 'userStatus'
    };
  }

})(angular);
