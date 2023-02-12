(function (angular) {
  'use strict';

  angular
      .module('coyo.workspaces')
      .controller('WorkspaceMemberRequestedController', WorkspaceMemberRequestedController);

  function WorkspaceMemberRequestedController($q, $rootScope, Pageable, currentUser, workspace, workspacesConfig) {
    var vm = this;

    vm.loading = false;
    vm.currentUser = currentUser;

    vm.approve = approve;
    vm.decline = decline;

    function approve(userId, event) {
      event.stopPropagation();
      workspace.approveMember(userId).then(function () {
        _removeListItemAndUpdateCurrentPage(userId);
        $rootScope.$emit('workspace.member:added', userId);
      });
    }

    function decline(userId, event) {
      event.stopPropagation();
      workspace.removeMember(userId).then(function () {
        _removeListItemAndUpdateCurrentPage(userId);
      });
    }

    function _loadMembers(pageable) {
      if (!vm.loading) {
        vm.loading = true;

        var _pageable = pageable || new Pageable(0, workspacesConfig.members.paging.pageSize);
        return workspace.getRequested(_pageable).then(function (page) {
          vm.currentPage = page;
          workspace.requestedCount = page.totalElements;
        }).finally(function () {
          vm.loading = false;
        });
      }

      return $q.reject();
    }

    function _removeListItemAndUpdateCurrentPage(userId) {
      _.remove(vm.currentPage.content, function (membership) {
        return membership.user.id === userId;
      });
      --workspace.requestedCount;

      var pageDiff = !vm.currentPage.first && !vm.currentPage.content.length ? 1 : 0;
      var pageable = new Pageable(vm.currentPage.number - pageDiff, workspacesConfig.members.paging.pageSize);
      _loadMembers(pageable);
    }

    (function _init() {
      _loadMembers();
    })();
  }

})(angular);
