(function (angular) {
  'use strict';

  angular
      .module('coyo.workspaces')
      .directive('coyoWorkspaceSubscribe', WorkspaceSubscribe)
      .controller('WorkspaceSubscribeController', WorkspaceSubscribeController);

  /**
   * @ngdoc directive
   * @name coyo.workspaces.coyoWorkspaceSubscribe:coyoWorkspaceSubscribe
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Renders a list item toggle button which a user can use to subscribe or unsubscribe to a workspace. If the user is
   * already subscribed, he can unsubscribe by clicking the link. If he is not subscribed and a member of the workspace,
   * he can subscribe to the workspace.
   *
   * @param {object} workspace
   * The workspace to subscribe or unsubscribe to.
   *
   * @param {object} user
   * The current user which should subscribe or unsubscribe.
   */
  function WorkspaceSubscribe() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/modules/workspaces/components/workspace-subscribe/workspace-subscribe.html',
      scope: {},
      bindToController: {
        workspace: '<',
        user: '<'
      },
      controller: 'WorkspaceSubscribeController',
      controllerAs: '$ctrl'
    };
  }

  function WorkspaceSubscribeController($scope, subscriptionsService) {
    var vm = this;

    vm.loading = false;
    vm.subscribed = false;

    vm.toggle = toggle;

    function toggle() {
      if (vm.loading) {
        return;
      }
      vm.loading = true;

      if (vm.subscribed) {
        _unsubscribe();
      } else {
        _subscribe();
      }
    }

    function _subscribe() {
      subscriptionsService.subscribe(vm.user.id, vm.workspace.id, 'workspace', vm.workspace.id);
    }

    function _unsubscribe() {
      subscriptionsService.unsubscribe(vm.user.id, vm.workspace.id);
    }

    function _updateSubscription(subscription) {
      vm.subscribed = angular.isDefined(subscription);
      vm.loading = false;
    }

    (function _init() {
      vm.loading = true;
      var eventHandler = subscriptionsService.onSubscriptionChange(vm.user.id, vm.workspace.id, _updateSubscription);
      $scope.$on('$destroy', eventHandler);
    })();

  }

})(angular);
