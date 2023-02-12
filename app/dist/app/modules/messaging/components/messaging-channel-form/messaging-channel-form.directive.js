(function (angular) {
  'use strict';

  angular
      .module('coyo.messaging')
      .directive('oyocMessagingChannelForm', messagingChannelForm);

  /**
   * @ngdoc directive
   * @name coyo.messaging.oyocMessagingChannelForm:oyocMessagingChannelForm
   * @scope
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Renders the form for a messaging channel.
   *
   * @param {object} msgSidebar The main sidebar controller.
   * @param {object} currentUser The current user.
   * @param {string} channelType Type of channel to create. Either of 'GROUP' or 'SINGLE'.
   * @param {object} channel Optionally, a channel that should be edited by this form.
   */
  function messagingChannelForm() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/modules/messaging/components/messaging-channel-form/messaging-channel-form.html',
      scope: {},
      bindToController: {
        msgSidebar: '=',
        currentUser: '<',
        channel: '=?'
      },
      controller: 'MessagingChannelFormController',
      controllerAs: '$ctrl'
    };
  }

})(angular);
