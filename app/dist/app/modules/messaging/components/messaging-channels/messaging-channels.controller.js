(function (angular) {
  'use strict';

  angular
      .module('coyo.messaging')
      .config(registerToCurtain)
      .controller('MessagingChannelsController', MessagingChannelsController);

  function registerToCurtain(curtainServiceProvider) {
    curtainServiceProvider.register('messagingSidebarChannels');
  }

  function MessagingChannelsController($scope, $rootScope, curtainService, authService, socketService, MessageChannelModel,
                                       Pageable, browserNotificationsService, tabNotificationsService) {
    var vm = this;
    vm.loadMore = loadMore;

    // ----------------------------------------------------------------

    function _initChannels(hasPermission) {
      if (hasPermission) {
        vm.channels = [];
        vm.currentPage = null;
        loadMore();

        var unsubscribeUpdatedFn = socketService.subscribe('/user/topic/messaging', _handleChannelUpdated, 'channelUpdated');
        var unsubscribeStatusUpdatedFn = socketService.subscribe('/user/topic/messaging', _handleChannelStatusUpdated, 'channelStatusUpdated');
        var unsubscribeLeaveFn = socketService.subscribe('/user/topic/messaging', _handleChannelLeave, 'channelLeave');
        var unsubscribeNewMessageFn = socketService.subscribe('/user/topic/messaging', _handleNewMessage, 'messageCreated');

        $scope.$on('$destroy', unsubscribeUpdatedFn);
        $scope.$on('$destroy', unsubscribeStatusUpdatedFn);
        $scope.$on('$destroy', unsubscribeLeaveFn);
        $scope.$on('$destroy', unsubscribeNewMessageFn);
      } else {
        curtainService.loaded('messagingSidebarChannels');
      }
    }

    function _handleChannelUpdated(event) {
      $scope.$apply(function () {
        var messageChannel = event.content.messageChannel;
        var filtered = _.filter(vm.channels, {id: messageChannel.id});

        // Update list
        if (filtered.length === 1) {
          angular.extend(filtered[0], messageChannel);
        } else {
          var channel = new MessageChannelModel(messageChannel);
          channel.unreadCount = _.get(event, 'content.initialUnreadCount', 0);
          tabNotificationsService.setCounter('messaging-' + channel.id, channel.unreadCount);
          vm.channels.push(channel);
        }

        // Update current channel
        if (vm.msgSidebar.currentChannel && vm.msgSidebar.currentChannel.id === messageChannel.id) {
          angular.extend(vm.msgSidebar.currentChannel, messageChannel);
        }
      });
    }

    function _handleChannelStatusUpdated(event) {
      $scope.$apply(function () {
        var filtered = _.filter(vm.channels, {id: event.content.channelId});

        if (filtered.length === 1) {
          filtered[0].unreadCount = event.content.unreadCount;
          tabNotificationsService.setCounter('messaging-' + filtered[0].id, filtered[0].unreadCount);
          $rootScope.$emit('messaging-channel:' + event.content.channelId + ':updated');
        }
      });
    }

    function _handleChannelLeave(event) {
      $scope.$apply(function () {
        vm.channels = _.reject(vm.channels, {id: event.content});

        if (vm.msgSidebar.currentChannel && vm.msgSidebar.currentChannel.id === event.content) {
          vm.msgSidebar.home();
        }
      });
    }

    function _handleNewMessage(event) {
      var channel = _.find(vm.channels, {id: event.content.channelId});
      if (channel) {
        $scope.$apply(function () {
          channel.updated = event.content.created;

          // This variable can be used by other views to check if there are new messages available
          if (angular.isDefined(vm.msgSidebar.currentChannel)
              && _.get(event, 'content.channelId') !== _.get(vm, 'msgSidebar.currentChannel.id')) {
            vm.msgSidebar.hasNewMessages = true;
          }

          $rootScope.$emit('messaging-channel:' + event.content.channelId + ':updated');
        });
      }

      browserNotificationsService.notifyMessage(event, channel);
    }

    // ----------------------------------------------------------------

    function loadMore() {
      if (!vm.loading && (!vm.currentPage || vm.channels.length < vm.currentPage.totalElements)) {
        vm.loading = true;

        var pageable = new Pageable(0, 25, 'updated,desc', vm.channels.length);

        MessageChannelModel.pagedQuery(pageable, {userId: vm.currentUser.id}, {}).then(function (page) {
          vm.currentPage = page;

          // Calculate once and store for better performance
          angular.forEach(page.content, function (channel) {
            channel.unreadCount = channel.getUnreadCount(vm.currentUser);
            tabNotificationsService.setCounter('messaging-' + channel.id, channel.unreadCount);
          });

          vm.channels.push.apply(vm.channels, page.content);
        }).finally(function () {
          curtainService.loaded('messagingSidebarChannels');
          vm.loading = false;
        });
      }
    }

    // ----------------------------------------------------------------

    (function _init() {
      authService.onGlobalPermissions('USE_MESSAGING', _initChannels);
    })();

  }

})(angular);
