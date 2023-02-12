(function (angular) {
  'use strict';

  angular
      .module('coyo.messaging')
      .directive('oyocMessagingPresenceStatus', messagingPresenceStatus);

  /**
   * @ngdoc directive
   * @name coyo.messaging.oyocMessagingPresenceStatus:oyocMessagingPresenceStatus
   * @scope
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Renders the presence status form.
   *
   * @param {object} msgSidebar The main sidebar controller.
   * @param {object} presenceStatus The current presence status.
   */
  function messagingPresenceStatus() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/modules/messaging/components/messaging-presence-status/messaging-presence-status.html',
      scope: {},
      bindToController: {
        msgSidebar: '=',
        currentUser: '<',
        presenceStatus: '='
      },
      controller: 'MessagingPresenceStatusController',
      controllerAs: '$ctrl'
    };
  }

})(angular);
