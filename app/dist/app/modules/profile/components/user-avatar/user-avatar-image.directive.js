(function (angular) {
  'use strict';

  angular
      .module('coyo.profile')
      .directive('oyocUserAvatarImage', userAvatarImage)
      .controller('UserAvatarImageController', UserAvatarImageController);

  /**
   * @ngdoc directive
   * @name coyo.profile.oyocUserAvatarImage:oyocUserAvatarImage
   * @element OWN
   * @restrict E
   *
   * @description
   * This is an internal directive rendering a user's avatar image. Do not use this directive directly but
   * {@link coyo.profile.coyoUserAvatar:coyoUserAvatar}.
   *
   * @param {object} user
   * The user to render the avatar image for
   *
   * @param {string=} showOnlineStatus
   * Can be set to 'true' if the user's online status should be displayed in the top right corner of the avatar
   * (default: false).
   *
   * @param {string=} showFollowButton
   * Can be set to 'true' if a follow button should be shown.
   *
   * @param {string=} showMessagingButton
   * Can be set to 'true' if a messaging button (start new chat) should be shown.
   *
   * @requires $scope
   * @requires coyo.profile.userService
   * @requires commons.auth.authService
   * @requires commons.auth.messagingService
   */
  function userAvatarImage() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/modules/profile/components/user-avatar/user-avatar-image.html',
      controller: 'UserAvatarImageController',
      controllerAs: '$subctrl'
    };
  }

  function UserAvatarImageController($scope, $rootScope, userService, authService, messagingService) {
    var vm = this;

    vm.user = $scope.$ctrl.user;
    vm.startConversation = messagingService.start;
    vm.errorHandler = function () {
      vm.loadError = true;
    };

    $scope.$on('$destroy', $rootScope.$on('currentUser:updated', function (event, currentUser) {
      if (currentUser.id === vm.user.id && !_.isEqual(vm.user.imageUrls, currentUser.imageUrls)) {
        vm.user.imageUrls = currentUser.imageUrls;
      }
    }));

    if ($scope.$ctrl.showOnlineStatus) {
      authService.getUser().then(function (currentUser) {
        var permissionName = currentUser.id === vm.user.id ? 'ACCESS_OWN_USER_PROFILE' : 'ACCESS_OTHER_USER_PROFILE';
        authService.onGlobalPermissions(permissionName, function (hasPermission) {
          if (hasPermission) {
            vm.showOnlineStatus = true;
            userService.getPresenceStatus(vm.user, function (status) {
              vm.presenceStatus = status;
            }, $scope);
          } else {
            vm.showOnlineStatus = false;
          }
        });
      });
    }
  }

})(angular);
