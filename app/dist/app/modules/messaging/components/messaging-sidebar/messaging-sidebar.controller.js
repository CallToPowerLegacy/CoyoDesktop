(function (angular) {
  'use strict';

  angular
      .module('coyo.messaging')
      .config(registerToCurtain)
      .controller('MessagingSidebarController', MessagingSidebarController);

  function registerToCurtain(curtainServiceProvider) {
    curtainServiceProvider.register('messagingSidebar');
  }

  /**
   * Main messaging sidebar controller.
   */
  function MessagingSidebarController($scope, $rootScope, $timeout, $sessionStorage, authService, sidebarService,
                                      curtainService, userService, targetService) {
    var vm = this;

    vm.presenceStatus = {
      state: 'OFFLINE'
    };

    vm.toggleCompact = toggleCompact;
    vm.home = home;
    vm.openChannel = openChannel;
    vm.switchView = switchView;
    vm.openProfile = openProfile;

    // ----------------------------------------------------------------

    function open() {
      vm.show = true;
      $rootScope.showBackdrop = !$rootScope.screenSize.isLg;
    }

    function close() {
      vm.show = false;
      $rootScope.showBackdrop = false;
    }

    function toggleCompact(on) {
      vm.compact = on;
      $rootScope.messagingCompact = on;
      $sessionStorage.messagingSidebar.compact = on;
    }

    function home() {
      vm.view = null;
      vm.currentChannel = null;
      vm.hasNewMessages = false;
    }

    function openChannel(channel) {
      vm.currentChannel = channel;
      switchView('channel');
    }

    function switchView(view) {
      toggleCompact(false);
      vm.view = view;
    }

    function openProfile(channel, currentUser) {
      var sender = channel.getChannelPartner(currentUser);
      if (sender) {
        targetService.onCanLinkTo(sender.target, function (canLink) {
          if (canLink) {
            targetService.go(sender.target);
          } else {
            switchView('channelInfo');
          }
        });
      }
    }

    // ----------------------------------------------------------------

    (function _init() {
      if (!$sessionStorage.messagingSidebar) {
        $sessionStorage.messagingSidebar = {
          compact: false
        };
      }

      toggleCompact($sessionStorage.messagingSidebar.compact);

      sidebarService.register({
        name: 'messaging',
        open: open,
        close: close,
        isOpen: function () {
          return vm.show;
        }
      });

      authService.getUser().then(function (user) {
        vm.currentUser = user;

        userService.getPresenceStatus(user, function (status) {
          vm.presenceStatus = status;
        }, $scope);
      }).finally(function () {
        curtainService.loaded('messagingSidebar');
      });

      // react to outside toggle via event
      var unsubscribeToggleFn = $rootScope.$on('messaging:toggle', function (event, compact) {
        return toggleCompact(compact);
      });

      // react to outside toggle via event
      var unsubscribeStartFn = $rootScope.$on('messaging:start', function (event, channel) {
        vm.view = null;
        $timeout(function () {
          openChannel(channel);
          sidebarService.open('messaging');
        });
      });

      // react to resize via event
      var unsubscribeChangedFn = $rootScope.$on('screenSize:changed', function (event, screenSize) {
        if (vm.show) {
          $rootScope.showBackdrop = !screenSize.isLg;
        }
      });

      $scope.$on('$destroy', function () {
        unsubscribeToggleFn();
        unsubscribeStartFn();
        unsubscribeChangedFn();
      });
    })();
  }

})(angular);
