(function (angular) {
  'use strict';

  angular
      .module('coyo.notifications')
      .config(registerToCurtain)
      .directive('oyocNotificationsDialog', notificationsDialog)
      .controller('NotificationsDialogController', NotificationsDialogController);

  function registerToCurtain(curtainServiceProvider) {
    curtainServiceProvider.register('notificationsDialog');
  }

  /**
   * @ngdoc directive
   * @name coyo.notifications.oyocNotificationsDialog:oyocNotificationsDialog
   * @element ANY
   *
   * @description
   * Displays the notifications dialog.
   */
  function notificationsDialog() {
    return {
      templateUrl: 'app/modules/notifications/components/notifications-dialog.html',
      replace: true,
      scope: {},
      controller: 'NotificationsDialogController',
      controllerAs: '$ctrl'
    };
  }

  function NotificationsDialogController($log, $scope, curtainService, notificationsMainService, coyoConfig,
                                         targetService, socketService, authService, browserNotificationsService, tabNotificationsService) {
    var vm = this;

    vm.show = false;
    vm.categories = ['DISCUSSION', 'ACTIVITY'];
    vm.data = {};
    vm.status = {};

    vm.toggle = toggle;
    vm.close = close;
    vm.switchCategory = switchCategory;
    vm.unsubscribe = unsubscribe;
    vm.subscribe = subscribe;
    vm.open = open;
    vm.getIcon = getIcon;
    vm.markAllClicked = markAllClicked;
    vm.loadMore = loadMore;

    // ----------------------------------------------------------------

    function toggle() {
      vm.show = !vm.show;
      if (vm.show) {
        vm.data = {};
        vm.switchCategory(vm.category || vm.categories[0]);
      }
    }

    function close() {
      vm.show = false;
    }

    function switchCategory(category) {
      vm.category = category;

      // mark all seen
      if (vm.status.unseen[category] > 0) {
        vm.status.unseen[category] = 0;
        notificationsMainService.markAllSeen(category);
      }
    }

    function unsubscribe(notification) {
      $log.error('Missing implementation for unsubscribe', notification);
    }

    function subscribe(notification) {
      $log.error('Missing implementation for subscribe', notification);
    }

    function open(notification) {
      targetService.go(notification.target);
      vm.show = false;
      if (!notification.clicked) {
        notificationsMainService.markClicked(notification).then(function () {
          notification.clicked = true;
          vm.status.unclicked[notification.category]--;
        });
      }
    }

    function getIcon(notificationTypeName) {
      var config = coyoConfig.notificationTypeIcons[notificationTypeName];
      return config ? config.icon : coyoConfig.notificationTypeIcons.default.icon;
    }

    function markAllClicked(category) {
      notificationsMainService.markAllClicked(category).then(function () {
        angular.forEach(vm.data[category].items, function (item) {
          item.clicked = true;
        });
      });
    }

    function loadMore(category) {
      if (!vm.data[category]) {
        vm.data[category] = {};
      }

      var data = vm.data[category];
      if (!data.loading && !_.get(data.currentPage, 'last', false)) {
        data.loading = true;

        var pageNumber = data.currentPage ? data.currentPage.number + 1 : 0;
        var pageSize = 10;
        notificationsMainService.getNotifications(category, pageNumber, pageSize).then(function (response) {
          data.currentPage = response;
          data.items = _.concat(data.items || [], response.content);
        }).finally(function () {
          data.loading = false;
        });
      }
    }

    // ----------------------------------------------------------------

    function _handleNewNotification(event) {
      $log.debug('Receiving event for new notification', event);

      if (event.content.status) {
        vm.status = event.content.status;
        tabNotificationsService.setCounter('notifications-ACTIVITY', event.content.status.unseen.ACTIVITY);
        tabNotificationsService.setCounter('notifications-DISCUSSION', event.content.status.unseen.DISCUSSION);
        $scope.$apply();
      }
      if (vm.show && event.content.notification) {
        vm.data[event.content.notification.category] = {};
        vm.loadMore(event.content.notification.category);
      }

      browserNotificationsService.notifyEvent(event);
    }

    function _handleStatusChanged(event) {
      $log.debug('Receiving event for notification status update', event);

      if (event.content.status) {
        vm.status = event.content.status;
        $scope.$apply();
      }
    }

    // ----------------------------------------------------------------

    (function _init() {
      authService.onGlobalPermissions('ACCESS_NOTIFICATIONS', function (permission) {
        vm.visible = permission;

        if (permission) {
          authService.getUser().then(function (user) {
            notificationsMainService.getStatus(user).then(function (status) {
              vm.status = status;
            });
          }).finally(function () {
            curtainService.loaded('notificationsDialog');
          });

          var unsubscribeRaisedFn = socketService.subscribe('/user/topic/notification', _handleNewNotification, 'raised');
          var unsubscribeStatusFn = socketService.subscribe('/user/topic/notification', _handleStatusChanged, 'statusChanged');
          $scope.$on('$destroy', unsubscribeRaisedFn);
          $scope.$on('$destroy', unsubscribeStatusFn);
        } else {
          curtainService.loaded('notificationsDialog');
        }
      });
    })();
  }

})(angular);
