(function (angular) {
  'use strict';

  angular
      .module('coyo.workspaces')
      .directive('coyoWorkspaceMemberAvatars', workspaceMemberAvatars)
      .controller('WorkspaceMemberAvatarsController', WorkspaceMemberAvatarsController);

  /**
   * @ngdoc directive
   * @name coyo.workspaces.coyoWorkspaceMembers:coyoWorkspaceMembers
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Renders an excerpt (max. 10 user) of the members of the given workspace. Members are listed by their user avatar.
   * The avatar images are overlapping each other. In addition the directive displays the overall member count of the
   * workspace.
   *
   * @param {object} workspace
   * The workspace to display the members of.
   */
  function workspaceMemberAvatars() {
    return {
      restrict: 'E',
      templateUrl: 'app/modules/workspaces/components/workspace-member-avatars/workspace-member-avatars.html',
      scope: {},
      bindToController: {
        workspace: '<'
      },
      controller: 'WorkspaceMemberAvatarsController',
      controllerAs: '$ctrl'
    };
  }

  function WorkspaceMemberAvatarsController($scope, $rootScope, Pageable) {
    var vm = this;

    vm.members = [];
    vm.memberCount = 0;
    vm.loading = false;

    function _loadMembers() {
      vm.loading = true;
      var pageable = new Pageable(0, 10);
      vm.workspace.getMembers(pageable).then(function (page) {
        vm.members = _.map(page.content, 'user');
        vm.memberCount = page.totalElements;
      }).finally(function () {
        vm.loading = false;
      });
    }

    (function _init() {
      _loadMembers();

      var addMember = $rootScope.$on('workspace.member:added', function () {
        if (vm.members.length < 10) {
          _loadMembers();
        } else { // only correct count
          ++vm.memberCount;
        }
      });
      $scope.$on('$destroy', addMember);

      var removeMember = $rootScope.$on('workspace.member:removed', function (event, userId) {
        if (_.some(vm.members, {id: userId})) {
          _loadMembers();
        } else { // only correct count
          --vm.memberCount;
        }
      });
      $scope.$on('$destroy', removeMember);
    })();
  }

})(angular);
