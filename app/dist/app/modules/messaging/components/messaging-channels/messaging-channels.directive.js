(function (angular) {
  'use strict';

  angular
      .module('coyo.messaging')
      .directive('oyocMessagingChannels', messagingChannels);

  /**
   * @ngdoc directive
   * @name coyo.messaging.oyocMessagingChannels:oyocMessagingChannels
   * @scope
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Lists a user's channels.
   */
  function messagingChannels() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/modules/messaging/components/messaging-channels/messaging-channels.html',
      scope: {},
      bindToController: {
        msgSidebar: '=',
        currentUser: '<'
      },
      controller: 'MessagingChannelsController',
      controllerAs: '$ctrl'
    };
  }

})(angular);
