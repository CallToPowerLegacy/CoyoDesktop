(function (angular) {
  'use strict';

  angular
      .module('coyo.messaging')
      .directive('oyocMessagingNavbarItem', messagingNavbarItem)
      .controller('MessagingNavbarItemController', MessagingNavbarItemController);

  /**
   * @ngdoc directive
   * @name coyo.messaging.oyocMessagingNavbarItem:oyocMessagingNavbarItem
   * @scope
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Renders the messaging navbar item with information about unread messages.
   */
  function messagingNavbarItem() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/modules/messaging/components/messaging-navbar-item/messaging-navbar-item.html',
      scope: {},
      controller: 'MessagingNavbarItemController',
      controllerAs: '$ctrl'
    };
  }

  function MessagingNavbarItemController($scope, authService, sidebarService, socketService, MessageModel) {
    var vm = this;

    // Load unread count initially and then subscribe to changes
    var unsubscribeStatusUpdatedFn;
    authService.onGlobalPermissions('USE_MESSAGING', function (hasPermission, currentUser) {
      if (hasPermission) {
        MessageModel.getUnreadCount(currentUser.id).then(function (result) {
          vm.unreadCount = result.data;
          unsubscribeStatusUpdatedFn = socketService.subscribe('/user/topic/messaging', _handleChannelStatusUpdated, 'channelStatusUpdated');
        });
      } else if (unsubscribeStatusUpdatedFn) {
        unsubscribeStatusUpdatedFn();
      }
    });

    $scope.$on('$destroy', function () {
      if (unsubscribeStatusUpdatedFn) {
        unsubscribeStatusUpdatedFn();
      }
    });

    vm.openMessagingSidebar = openMessagingSidebar;

    // ------------------------------------------------------------------------------------------

    function _handleChannelStatusUpdated(event) {
      $scope.$apply(function () {
        vm.unreadCount += event.content.unreadCount - event.content.oldUnreadCount;
      });
    }

    // ------------------------------------------------------------------------------------------

    function openMessagingSidebar() {
      sidebarService.open('messaging');
    }
  }

})(angular);
