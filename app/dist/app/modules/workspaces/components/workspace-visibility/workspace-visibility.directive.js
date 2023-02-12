(function (angular) {
  'use strict';

  angular
      .module('coyo.workspaces')
      .directive('coyoWorkspaceVisibility', workspaceVisibility);

  /**
   * @ngdoc directive
   * @name coyo.workspaces.coyoWorkspaceVisibility:coyoWorkspaceVisibility
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Displays the workspace visibility.
   */
  function workspaceVisibility() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/modules/workspaces/components/workspace-visibility/workspace-visibility.html',
      scope: {
        workspace: '<?',
        visibility: '@'
      }
    };
  }

})(angular);
