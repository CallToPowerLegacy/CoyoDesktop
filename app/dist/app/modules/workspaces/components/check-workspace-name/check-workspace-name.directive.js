(function (angular) {
  'use strict';

  angular
      .module('coyo.workspaces')
      .directive('coyoCheckWorkspaceName', workspaceName);

  /**
   * @ngdoc directive
   * @name coyo.workspaces.coyoCheckWorkspaceName:coyoCheckWorkspaceName
   * @element A
   *
   * @description
   * Validates a workspace name.
   *
   * @example
   * <example module="example">
   *   <file name="index.html">
   *     <div ng-controller="ExampleCtrl">
   *       <input type="text" coyo-check-workspace-name>
   *       <input type="text" coyo-check-workspace-name="workspaceId">
   *     </div>
   *   </file>
   *   <file name="script.js">
   *     angular
   *       .module('example', [])
   *       .controller('ExampleCtrl', ExampleCtrl);
   *
   *     function ExampleCtrl($scope) {
   *       $scope.workspaceId = 'WorkspaceId';
   *     }
   *   </file>
   * </example>
   */
  function workspaceName($http, $q, $window, coyoEndpoints) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function ($scope, elem, attrs, ngModel) {
        ngModel.$asyncValidators.workspaceName = function (modelValue) {
          if (modelValue) {
            return $http({
              method: 'GET',
              url: coyoEndpoints.workspace.checkName.replace('{name}', $window.encodeURIComponent(modelValue))
                  .replace('{workspaceId}', attrs.coyoCheckWorkspaceName)
            }).then(function (r) {
              if (r.data.taken) {
                return $q.reject();
              }
              return true;
            });
          } else {
            return $q.resolve(true);
          }
        };
      }
    };
  }

})(angular);
