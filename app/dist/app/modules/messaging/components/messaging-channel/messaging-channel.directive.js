(function (angular) {
  'use strict';

  angular
      .module('coyo.messaging')
      .directive('oyocMessagingChannel', messagingChannel);

  /**
   * @ngdoc directive
   * @name coyo.messaging.oyocMessagingChannel:oyocMessagingChannel
   * @scope
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Renders a messaging channel.
   *
   * @param {object} msgSidebar The main sidebar controller
   * @param {object} channel The channel to render
   * @param {object} currentUser The current user
   */
  function messagingChannel() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/modules/messaging/components/messaging-channel/messaging-channel.html',
      scope: {},
      bindToController: {
        msgSidebar: '=',
        channel: '=',
        currentUser: '<'
      },
      controller: 'MessagingChannelController',
      controllerAs: '$ctrl'
    };
  }

})(angular);
