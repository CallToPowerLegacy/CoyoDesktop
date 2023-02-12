(function (angular) {
  'use strict';

  angular
      .module('coyo.profile')
      .directive('oyocUserAvatarOverlay', userAvatarOverlay);

  /**
   * @ngdoc directive
   * @name coyo.profile.oyocUserAvatarOverlay:oyocUserAvatarOverlay
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Adds an overlay to a user avatar.
   *
   * This directive must be set as sibling to the user avatar directive.
   *
   * @param {function} a function to trigger in click
   * @param {string} class of the icon to display
   */
  function userAvatarOverlay() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/modules/profile/components/user-avatar-overlay/user-avatar-overlay.html',
      scope: {
        clickFn: '&',
        iconClass: '@'
      }
    };
  }

})(angular);
