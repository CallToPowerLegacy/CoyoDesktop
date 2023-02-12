(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoBtnSubscribe', btnSubscribe)
      .controller('BtnSubscribeController', BtnSubscribeController);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoBtnSubscribe:coyoBtnSubscribe
   * @scope
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Renders a subscription button from the perspective of the current user.
   *
   * @requires $log
   *
   * @param {object} target The target to subscribe to.
   */
  function btnSubscribe() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/commons/ui/components/btn-subscribe/btn-subscribe.html',
      scope: {},
      bindToController: {
        target: '<',
        tooltipSubscribe: '@'
      },
      controller: 'BtnSubscribeController',
      controllerAs: '$ctrl'
    };
  }

  function BtnSubscribeController($scope, authService, subscriptionsService) {
    var vm = this;

    vm.loading = false;
    vm.subscribed = false;
    vm.tooltip = {
      subscribe: vm.tooltipSubscribe || 'MODULE.TIMELINE.TOOLTIPS.SUBSCRIBE',
      unsubscribe: 'MODULE.TIMELINE.TOOLTIPS.UNSUBSCRIBE'
    };

    vm.toggle = toggle;

    function toggle() {
      if (vm.loading) {
        return;
      }

      vm.loading = true;
      if (vm.subscribed) {
        subscriptionsService.unsubscribe(vm.currentUser.id, vm.target.id);
      } else {
        subscriptionsService.subscribe(vm.currentUser.id, vm.target.id, vm.target.typeName, vm.target.author.id);
      }
    }

    function _updateSubscription(subscription) {
      vm.subscribed = angular.isDefined(subscription);
      vm.loading = false;
      $scope.$broadcast('subscribe:refresh');
    }

    (function _init() {
      vm.loading = true;
      authService.getUser().then(function (user) {
        vm.currentUser = user;
        var eventHandler =
            subscriptionsService.onSubscriptionChange(vm.currentUser.id, vm.target.id, _updateSubscription);
        $scope.$on('$destroy', eventHandler);
      });
    })();
  }

})(angular);
