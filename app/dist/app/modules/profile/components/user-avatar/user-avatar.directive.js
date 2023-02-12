(function (angular) {
  'use strict';

  angular
      .module('coyo.profile')
      .directive('coyoUserAvatar', userAvatar)
      .controller('UserAvatarController', UserAvatarController);

  /**
   * @ngdoc directive
   * @name coyo.profile.coyoUserAvatar:coyoUserAvatar
   * @restrict 'E'
   * @element OWN
   * @scope
   *
   * @description
   * Creates a user avatar containing the online status.
   *
   * @param {object} user
   * the user to render the avatar for
   *
   * @param {string=} avatarSize
   * Desired size of the avatar. Possible values are xs, sm, md, lg and xl. Default: md;
   *
   * @param {boolean=} noLink
   * Can be set to 'true' if the avatar image should not link to the user's profile (default: 'false').
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
   */
  function userAvatar() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/modules/profile/components/user-avatar/user-avatar.html',
      scope: {},
      bindToController: {
        user: '=',
        avatarSize: '@?',
        noLink: '<?',
        showOnlineStatus: '<?',
        showFollowButton: '<?',
        showMessagingButton: '<?'
      },
      controllerAs: '$ctrl',
      controller: 'UserAvatarController'
    };
  }

  function UserAvatarController(targetService) {
    var vm = this;
    if (vm.noLink) {
      vm.isLink = false;
      vm.isNoLink = true;
    } else {
      targetService.onCanLinkTo(vm.user.target, function (canLink) {
        vm.isLink = canLink;
        // ng-if has an issue with negating undefined in one time bindings so we have a second property for the second DOM element
        vm.isNoLink = !canLink;
      });
    }
  }

})(angular);
