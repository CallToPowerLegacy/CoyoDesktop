(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.list')
      .component('coyoListEntrySubscribe', listEntrySubscribe())
      .controller('ListEntrySubscribeController', ListEntrySubscribeController);

  /**
   * @ngdoc directive
   * @name coyo.apps.list.coyoListEntrySubscribe:coyoListEntrySubscribe
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Renders a list item toggle button which a user can use to subscribe or unsubscribe to a list-entry. If the user is
   * already subscribed, he can unsubscribe by clicking the link.
   *
   * @param {object} target
   * The target to subscribe or unsubscribe to.
   *
   */
  function listEntrySubscribe() {
    return {
      templateUrl: 'app/apps/list/components/list-entry-subscribe/list-entry-subscribe.html',
      bindings: {
        target: '<'
      },
      controller: 'ListEntrySubscribeController'
    };
  }

  function ListEntrySubscribeController($scope, subscriptionsService, authService) {
    var vm = this;

    vm.loading = false;
    vm.subscribed = false;
    vm.$onInit = _init();

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
      subscriptionsService.subscribe(vm.currentUser.id, vm.target.id, vm.target.typeName, vm.target.author.id);
    }

    function _unsubscribe() {
      subscriptionsService.unsubscribe(vm.currentUser.id, vm.target.id);
    }

    function _updateSubscription(subscription) {
      vm.subscribed = angular.isDefined(subscription);
      vm.loading = false;
    }

    function _init() {
      vm.loading = true;

      authService.getUser().then(function (user) {
        vm.currentUser = user;
        var eventHandler = subscriptionsService.onSubscriptionChange(vm.currentUser.id, vm.target.id, _updateSubscription);
        $scope.$on('$destroy', eventHandler);
      }).finally(function () {
        vm.loading = false;
      });
    }

  }

})(angular);
