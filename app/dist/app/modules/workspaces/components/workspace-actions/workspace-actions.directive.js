(function (angular) {
  'use strict';

  angular
      .module('coyo.workspaces')
      .directive('oyocWorkspaceActions', workspaceActions)
      .controller('WorkspaceActionsController', WorkspaceActionsController);

  /**
   * @ngdoc directive
   * @name coyo.workspaces.oyocWorkspaceActions:oyocWorkspaceActions
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Displays the membership actions for a workspace
   *
   * @requires $state
   */
  function workspaceActions() {
    return {
      restrict: 'E',
      templateUrl: 'app/modules/workspaces/components/workspace-actions/workspace-actions.html',
      scope: {},
      bindToController: {
        workspace: '='
      },
      controller: 'WorkspaceActionsController',
      controllerAs: '$ctrl'
    };
  }

  function WorkspaceActionsController($state) {
    var vm = this;
    vm.loading = false;

    vm.joinIcon = _getJoinIcon();

    vm.join = join;
    vm.leave = leave;

    function join() {
      if (vm.loading || vm.workspace.membershipStatus === 'REQUESTED') {
        return;
      }
      vm.loading = true;

      vm.workspace.join().then(function (response) {
        vm.workspace.membershipStatus = response.status;
        if (vm.workspace.membershipStatus === 'APPROVED') {
          $state.go('main.workspace.show', {idOrSlug: vm.workspace.slug});
        }
      }).finally(function () {
        vm.loading = false;
      });
    }

    function leave() {
      if (vm.loading) {
        return;
      }
      vm.loading = true;

      vm.workspace.leave().then(function () {
        vm.workspace.membershipStatus = 'NONE';
        vm.joinIcon = _getJoinIcon();
      }).finally(function () {
        vm.loading = false;
      });
    }

    function _getJoinIcon() {
      if (vm.workspace.membershipStatus === 'REQUESTED') {
        return ''; // no join button for pending requests
      }

      if (vm.workspace.membershipStatus === 'INVITED') {
        return 'zmdi-check';
      }
      if (vm.workspace.visibility === 'PROTECTED') {
        return 'zmdi-lock';
      }

      if (vm.workspace.visibility === 'PUBLIC') {
        return 'zmdi-plus';
      }
      return '';
    }

  }

})(angular);
