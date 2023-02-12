(function (angular) {
  'use strict';

  angular
      .module('coyo.messaging')
      .directive('oyocMessagingChannelHeader', messagingChannelHeader)
      .controller('MessageChannelHeaderController', MessageChannelHeaderController);

  /**
   * @ngdoc directive
   * @name coyo.messaging.oyocMessagingChannelHeader:oyocMessagingChannelHeader
   * @scope
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Renders the messaging channel header.
   *
   * @param {object} msgSidebar The main sidebar controller
   * @param {boolean} loading Binding for the loading indicator
   * @param {object} channel The channel
   * @param {object} currentUser The current user
   *
   * @requires domain.MessageChannelMemberModel
   */
  function messagingChannelHeader() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/modules/messaging/components/messaging-channel-header/messaging-channel-header.html',
      scope: {},
      bindToController: {
        msgSidebar: '=',
        loading: '=',
        channel: '<',
        currentUser: '<'
      },
      controller: 'MessageChannelHeaderController',
      controllerAs: '$ctrl'
    };
  }

  function MessageChannelHeaderController(MessageChannelMemberModel) {
    var vm = this;

    vm.member = new MessageChannelMemberModel({
      channelId: vm.channel.id,
      id: vm.currentUser.id
    });

    vm.leaveChannel = leaveChannel;
    vm.back = back;

    // ------------------------------------------------------------------------------------------------------

    function leaveChannel() {
      vm.member.delete();
    }

    function back() {
      if (vm.msgSidebar.view === 'channel') {
        vm.msgSidebar.home();
      } else if (vm.msgSidebar.view === 'channelInfo') {
        vm.msgSidebar.switchView('channel');
      }
    }
  }

})(angular);
