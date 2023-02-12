(function (angular) {
  'use strict';

  angular
      .module('coyo.workspaces')
      .controller('WorkspacesCreateController', WorkspacesCreateController);

  function WorkspacesCreateController($q, $state, authService, WorkspaceModel, coyoNotification, settings) {
    var vm = this;

    vm.back = back;
    vm.next = next;
    vm.$onInit = _init;

    function back() {
      vm.wizard.active = Math.max(0, vm.wizard.active - 1);
    }

    function next(form) {
      if (form && form.$valid) {
        if (vm.wizard.active < vm.wizard.states.length - 1) {
          return $q.resolve(vm.wizard.active++);
        } else {
          vm.workspace.categoryIds = _.map(vm.workspace.categories, 'id');
          return vm.workspace.create().then(function (workspace) {
            $state.go('main.workspace.show', {idOrSlug: workspace.slug});
            coyoNotification.success('MODULE.WORKSPACES.CREATE.SUCCESS');
          });
        }
      }
      return $q.reject();
    }

    function _init() {
      vm.wizard = {
        states: ['MODULE.WORKSPACES.CREATE.GENERAL', 'MODULE.WORKSPACES.CREATE.ACCESS'],
        active: 0
      };

      vm.workspace = new WorkspaceModel({
        visibility: settings.defaultVisibilityWorkspaces,
        adminIds: [],
        memberIds: [],
        adminGroupIds: [],
        memberGroupIds: []
      });

      authService.onGlobalPermissions('PERMIT_WORKSPACE_GROUP_INVITES', function (canInviteGroups) {
        vm.canInviteGroups = canInviteGroups;
      }, true);
    }
  }

})(angular);
