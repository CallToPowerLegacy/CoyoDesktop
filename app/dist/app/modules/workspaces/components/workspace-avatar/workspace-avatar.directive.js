(function (angular) {
  'use strict';

  /**
   * @ngdoc directive
   * @name coyo.workspaces.coyoWorkspaceAvatar:coyoWorkspaceAvatar
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Displays a workspace avatar.
   *
   * @param {object} workspace
   * The workspace to render the avatar for.
   *
   * @param {boolean=} noLink
   * Can be set to 'true' if the avatar image should not link to the workspace itself (default: 'false').
   *
   * @param {string=} avatarSize
   * Desired size of the avatar. Possible values are xs, sm, md, lg and xl.
   *
   * @requires $scope
   * @requires $state
   * @requires commons.target.targetService
   */
  angular
      .module('coyo.workspaces')
      .directive('coyoWorkspaceAvatar', workspaceAvatar)
      .controller('WorkspaceAvatarController', WorkspaceAvatarController);

  function workspaceAvatar() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/modules/workspaces/components/workspace-avatar/workspace-avatar.html',
      scope: {},
      bindToController: {
        workspace: '<',
        noLink: '<?',
        avatarSize: '@?'
      },
      controller: 'WorkspaceAvatarController',
      controllerAs: '$ctrl'
    };
  }

  function WorkspaceAvatarController($scope, $state, targetService) {
    var vm = this;
    var canLinkToWorkspace = false;

    vm.open = open;
    vm.errorHandler = errorHandler;

    function open(event) {
      if (vm.isLink) {
        event.stopPropagation();
        $state.go('main.workspace.show', {idOrSlug: vm.workspace.slug}, {inherit: false, reload: 'main.workspace.show'});
      }
    }

    function errorHandler() {
      vm.loadError = true;
    }

    (function _init() {
      // check whether user has permission to link to workspace
      targetService.onCanLinkTo(vm.workspace.target, function (canLink) {
        canLinkToWorkspace = canLink;
        vm.isLink = !vm.noLink && canLinkToWorkspace;
      });

      // check whether no link parameter is set or changed
      $scope.$watch(function () {
        return vm.noLink;
      }, function (newValue, oldValue) {
        if (newValue !== oldValue) {
          vm.isLink = !newValue && canLinkToWorkspace;
        }
      });
    })();

  }

})(angular);
