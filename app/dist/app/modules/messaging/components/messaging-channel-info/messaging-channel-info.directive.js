(function (angular) {
  'use strict';

  angular
      .module('coyo.messaging')
      .directive('oyocMessagingChannelInfo', messagingChannelInfo);

  /**
   * @ngdoc directive
   * @name coyo.messaging.oyocMessagingChannelInfo:oyocMessagingChannelInfo
   * @scope
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Renders the messaging channel info.
   *
   * @param {object} msgSidebar The main sidebar controller
   * @param {object} channel The channel to render
   * @param {object} currentUser The current user
   */
  function messagingChannelInfo() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/modules/messaging/components/messaging-channel-info/messaging-channel-info.html',
      scope: {},
      bindToController: {
        msgSidebar: '=',
        channel: '=',
        currentUser: '<'
      },
      controller: 'MessagingChannelInfoController',
      controllerAs: '$ctrl'
    };
  }

})(angular);
