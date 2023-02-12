(function (angular) {
  'use strict';

  angular
      .module('coyo.events')
      .directive('coyoEventSubscribe', EventSubscribe)
      .controller('EventSubscribeController', EventSubscribeController);

  /**
   * @ngdoc directive
   * @name coyo.events.coyoEventSubscribe:coyoEventSubscribe
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Renders a list item toggle button which a user can use to subscribe or unsubscribe to a event. If the user is
   * already subscribed, he can unsubscribe by clicking the link.
   *
   * @param {object} event
   * The event to subscribe or unsubscribe to.
   *
   * @param {object} user
   * The current user which should subscribe or unsubscribe.
   *
   * @requires $scope
   * @requires commons.subscriptions.subscriptionsService
   */
  function EventSubscribe() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/modules/events/components/event-subscribe/event-subscribe.html',
      scope: {},
      bindToController: {
        event: '<',
        user: '<'
      },
      controller: 'EventSubscribeController',
      controllerAs: '$ctrl'
    };
  }

  function EventSubscribeController($scope, subscriptionsService) {
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
      subscriptionsService.subscribe(vm.user.id, vm.event.id, 'event', vm.event.id);
    }

    function _unsubscribe() {
      subscriptionsService.unsubscribe(vm.user.id, vm.event.id);
    }

    function _updateSubscription(subscription) {
      vm.subscribed = angular.isDefined(subscription);
      vm.loading = false;
    }

    (function _init() {
      vm.loading = true;
      var eventHandler = subscriptionsService.onSubscriptionChange(vm.user.id, vm.event.id, _updateSubscription);
      $scope.$on('$destroy', eventHandler);
    })();
  }

})(angular);
