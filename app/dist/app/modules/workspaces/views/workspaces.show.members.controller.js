(function (angular) {
  'use strict';

  angular
      .module('coyo.workspaces')
      .controller('WorkspaceMembersController', WorkspaceMembersController);

  function WorkspaceMembersController($state, $scope, authService, userChooserModalService, workspace) {
    var vm = this;
    var selfState = 'main.workspace.show.members.invited';

    vm.workspace = workspace;
    vm.$onInit = _init;

    vm.inviteMembers = inviteMembers;
    vm.inviteAdmins = inviteAdmins;

    function inviteMembers() {
      userChooserModalService.open({}, {usersOnly: !vm.canInviteGroups}).then(function (selected) {
        workspace.inviteMembers(selected).then(function () {
          $state.go(selfState, {
            idOrSlug: workspace.slug
          }, {
            reload: selfState
          });
        });
      });
    }

    function inviteAdmins() {
      userChooserModalService.open({}, {usersOnly: !vm.canInviteGroups}).then(function (selected) {
        workspace.inviteAdmins(selected).then(function () {
          $state.go(selfState, {
            idOrSlug: workspace.slug
          }, {
            reload: selfState
          });
        });
      });
    }
    function _init() {
      authService.onGlobalPermissions('PERMIT_WORKSPACE_GROUP_INVITES', function (canInviteGroups) {
        vm.canInviteGroups = canInviteGroups;
      }, true);
    }
  }

})(angular);
