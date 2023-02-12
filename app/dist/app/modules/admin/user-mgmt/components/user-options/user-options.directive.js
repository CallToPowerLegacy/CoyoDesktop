(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.userManagement')
      .directive('oyocUserOptions', userOptions);

  /**
   * @ngdoc directive
   * @name coyo.admin.userManagement.oyocUserOptions:oyocUserOptions
   * @restrict 'E'
   *
   * @description
   * Renders a list of options (edit, delete, recover, activate, deactivate) to be used inside a context-menu on
   * a list of users.
   *
   * Extracted to directive to be used in both user table and mobile list view.
   *
   * @param {object} actions object containing action methods to be called (expected: delete, revover, activate, deactivate)
   *
   * @example
   * <example module="example">
   *   <file name="index.html">
   *     <div ng-controller="ExampleCtrl">
   *       <coyo-context-menu ...>
   *         <oyoc-user-options actions="actions" user="user"></oyoc-user-options>
   *       </coyo-context-menu>
   *     </div>
   *   </file>
   *   <file name="script.js">
   *     angular
   *       .module('example', [])
   *       .controller('ExampleCtrl', ExampleCtrl);
   *
   *     function ExampleCtrl($scope) {
   *       $scope.actions = {};
   *       $scope.user = {id: 'UserId'};
   *     }
   *   </file>
   * </example>
   */
  function userOptions() {
    return {
      restrict: 'E',
      templateUrl: 'app/modules/admin/user-mgmt/components/user-options/user-options.html',
      scope: {},
      bindToController: {
        actions: '<',
        user: '<'
      },
      controller: function () {},
      controllerAs: '$ctrl'
    };
  }

})(angular);
