(function (angular) {
  'use strict';

  var component = {
    templateUrl: 'app/modules/pages/components/page-subscribe/page-subscribe.html',
    bindings: {
      page: '<',
      size: '@',
      darkTheme: '<?'
    },
    controller: 'PageSubscribeController'
  };

  /**
   * @ngdoc directive
   * @name coyo.pages.coyoPageSubscribe:coyoPageSubscribe
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Renders a page's subscribe/unsubscribe button.
   *
   * @requires $timeout
   * @requires commons.auth.authService
   *
   * @param {object} page The page
   * @param {string} size The size
   * @param {boolean=} darkTheme Whether to use a dark theme or not. Default false.
   */
  angular
      .module('coyo.pages')
      .component('coyoPageSubscribe', component)
      .controller('PageSubscribeController', PageSubscribeController);

  function PageSubscribeController($timeout, $scope, authService, subscriptionsService) {
    var vm = this;

    vm.loading = false;
    vm.subscribed = false;
    vm.autoSubscribe = false;

    vm.toggle = toggle;
    vm.$onInit = init;

    /* --- INIT --- */

    function init() {
      vm.show = false;
      authService.getUser().then(function (user) {
        vm.currentUser = user;

        vm.loading = true;
        var eventHandler = subscriptionsService.onSubscriptionChange(vm.currentUser.id, vm.page.id, _updateSubscription);
        $scope.$on('$destroy', eventHandler);

        $timeout(function () {
          vm.show = true;
        });
      });
    }

    /* --- PUBLIC METHODS --- */

    function toggle(event) {
      if (vm.loading) {
        return;
      }
      vm.loading = true;
      event.stopPropagation();

      if (vm.subscribed) {
        _unsubscribe();
      } else {
        _subscribe();
      }
    }

    /* --- PRIVATE METHODS --- */

    function _subscribe() {
      subscriptionsService.subscribe(vm.currentUser.id, vm.page.id, 'page', vm.page.id).then(function () {
        ++vm.page.userSubscriptionsCount;
      });
    }

    function _unsubscribe() {
      subscriptionsService.unsubscribe(vm.currentUser.id, vm.page.id).then(function () {
        --vm.page.userSubscriptionsCount;
      });
    }

    function _updateSubscription(subscription) {
      vm.subscribed = angular.isDefined(subscription);
      vm.autoSubscribe = vm.subscribed && _.get(subscription, 'autoSubscribe', false);
      vm.loading = false;
    }
  }

})(angular);
