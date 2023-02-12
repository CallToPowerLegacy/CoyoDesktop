(function (angular) {
  'use strict';

  angular
      .module('coyo.messaging')
      .directive('oyocMessagingChannelAvatar', messagingChannelAvatar);

  /**
   * @ngdoc directive
   * @name coyo.messaging.oyocMessagingChannelAvatar:oyocMessagingChannelAvatar
   * @scope
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Renders a messaging channel avatar.
   *
   * @param {object} channel The channel
   * @param {object} currentUser The current user
   * @param {string} size The size of the avatar. Any of [sm, xs]
   */
  function messagingChannelAvatar() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/modules/messaging/components/messaging-channel-avatar/messaging-channel-avatar.html',
      scope: {},
      bindToController: {
        channel: '<',
        currentUser: '<',
        size: '@'
      },
      controller: angular.noop,
      controllerAs: '$ctrl'
    };
  }

})(angular);
