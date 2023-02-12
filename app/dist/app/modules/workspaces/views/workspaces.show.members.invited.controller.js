(function (angular) {
  'use strict';

  angular
      .module('coyo.workspaces')
      .controller('WorkspaceMemberInvitedController', WorkspaceMemberInvitedController);

  function WorkspaceMemberInvitedController($q, Pageable, currentUser, workspace, workspacesConfig) {
    var vm = this;

    vm.loading = false;
    vm.currentUser = currentUser;

    vm.decline = decline;

    function decline(userId, event) {
      event.stopPropagation();
      workspace.removeMember(userId).then(function () {
        _.remove(vm.currentPage.content, function (membership) {
          return membership.user.id === userId;
        });

        var pageDiff = !vm.currentPage.first && !vm.currentPage.content.length ? 1 : 0;
        var pageable = new Pageable(vm.currentPage.number - pageDiff, workspacesConfig.members.paging.pageSize);
        _loadMembers(pageable);
      });
    }

    function _loadMembers(pageable) {
      if (!vm.loading) {
        vm.loading = true;
        var _pageable = pageable || new Pageable(0, workspacesConfig.members.paging.pageSize);
        return workspace.getInvited(_pageable).then(function (page) {
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
