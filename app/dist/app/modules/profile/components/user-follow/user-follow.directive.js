(function (angular) {
  'use strict';

  angular
      .module('coyo.profile')
      .directive('coyoUserFollow', userFollow);

  /**
   * @ngdoc directive
   * @name coyo.profile.coyoUserFollow:coyoUserFollow
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Creates a user follow button.
   *
   * @requires $scope
   * @requires $timeout
   * @requires commons.auth.authService
   *
   * @param {object} page The page
   * @param {int} size The size
   * @param {string} textFollowing The text if following
   * @param {string} textFollow The text for "follow"
   * @param {boolean=} darkTheme Whether to use a dark theme or not. Default false.
   */
  function userFollow() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/modules/profile/components/user-follow/user-follow.html',
      scope: {},
      bindToController: {
        user: '=',
        size: '@',
        textFollowing: '@',
        textFollow: '@',
        darkTheme: '<?',
        noLabel: '<?'
      },
      controller: UserFollowController,
      controllerAs: 'follow'
    };
  }

  function UserFollowController($rootScope, $scope, $timeout, authService, subscriptionsService) {
    var vm = this;

    vm.loading = false;
    vm.following = false;
    vm.show = false;
    vm.textFollowing = vm.textFollowing || 'USER.FOLLOWING';
    vm.textFollow = vm.textFollow || 'USER.CLICK_TO_FOLLOW';

    vm.toggle = toggle;

    function toggle() {
      if (vm.loading) {
        return;
      }
      vm.loading = true;

      if (!vm.following) {
        subscriptionsService.subscribe(vm.currentUser.id, vm.user.id, 'user', vm.user.id).then(function () {
          $rootScope.$emit('currentUser.follow:update', {userId: vm.user.id, follow: true});
        });
      } else {
        subscriptionsService.unsubscribe(vm.currentUser.id, vm.user.id).then(function () {
          $rootScope.$emit('currentUser.follow:update', {userId: vm.user.id, follow: false});
        });
      }
    }

    function _updateSubscription(subscription) {
      vm.following = angular.isDefined(subscription);
      vm.loading = false;
    }

    (function _init() {
      vm.show = false;
      authService.getUser().then(function (user) {
        vm.currentUser = user;

        vm.loading = true;
        var eventHandler = subscriptionsService.onSubscriptionChange(vm.currentUser.id, vm.user.id, _updateSubscription);
        $scope.$on('$destroy', eventHandler);

        $timeout(function () {
          if (vm.currentUser.id !== vm.user.id) {
            vm.show = true;
          }
        });
      });
    })();
  }

})(angular);
