(function (angular) {
  'use strict';

  angular
      .module('coyo.workspaces')
      .controller('WorkspaceMemberListController', WorkspaceMemberListController);

  function WorkspaceMemberListController($q, $rootScope, $state, Pageable, currentUser, workspace, workspacesConfig) {

    var vm = this;
    var selfState = 'main.workspace.show.members.list';

    vm.loading = false;
    vm.currentUser = currentUser;
    vm.workspace = workspace;

    vm.promote = promote;
    vm.demote = demote;
    vm.remove = removeMember;

    function promote(userId, event) {
      event.stopPropagation();
      workspace.promote(userId).then(function () {
        $state.reload(selfState);
      });
    }

    function demote(userId, event) {
      event.stopPropagation();
      workspace.demote(userId).then(function () {
        $state.reload(selfState);
      });
    }

    function removeMember(userId, event) {
      event.stopPropagation();
      workspace.removeMember(userId).then(function () {
        _.remove(vm.currentPage.content, function (membership) {
          return membership.user.id === userId;
        });
        $rootScope.$emit('workspace.member:removed', userId);
      });
    }

    function _loadMembers(pageable) {
      if (!vm.loading) {
        vm.loading = true;
        var _pageable = pageable || new Pageable(0, workspacesConfig.members.paging.pageSize);
        return workspace.getMembers(_pageable).then(function (page) {
          vm.currentPage = page;
        }).finally(function () {
          vm.loading = false;
        });
      }

      return $q.reject();
    }

    (function _init() {
      _loadMembers();
    })();
  }

})(angular);
