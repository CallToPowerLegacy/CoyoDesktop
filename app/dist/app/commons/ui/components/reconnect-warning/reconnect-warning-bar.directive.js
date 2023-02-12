(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .component('oyocReconnectWarningBar', reconnectWarningBar())
      .controller('ReconnectWarningBarController', ReconnectWarningBarController);

  /**
   * @ngdoc directive
   * @name commons.ui.oyocReconnectWarningBar:oyocReconnectWarningBar
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Renders the warning bar when websockets reconnect. The bar displays a button to try reconnect immediately.
   *
   * @requires $rootScope
   * @requires $scope
   * @requires $interval
   * @requires $sessionStorage
   * @requires $timeout
   * @requires $window
   * @requires socketService
   * @requires reconnectWarningModalService
   */
  function reconnectWarningBar() {
    return {
      templateUrl: 'app/commons/ui/components/reconnect-warning/reconnect-warning-bar.html',
      scope: {},
      controller: 'ReconnectWarningBarController',
      controllerAs: '$ctrl'
    };
  }

  function ReconnectWarningBarController($rootScope, $scope, $interval, $sessionStorage, $timeout, $window,
                                         socketService, reconnectWarningModalService) {
    var vm = this;

    /* The interval handling the reconnect countdown */
    var countdownTimer = null;

    /* The number of silent reconnect attempts before showing the warning bar */
    var silentAttempts = 2;

    /* The current reconnection attempt number */
    var attempt = null;

    vm.state = 'CONNECTED';
    vm.isSilent = true;
    vm.countdown = 0;

    vm.reload = reload;
    vm.reconnect = reconnect;

    function reconnect() {
      socketService.connect();
    }

    function reload() {
      $window.location.reload();
    }

    function _startCountdown(sleep) {
      _resetCountdown();
      vm.countdown = sleep / 1000;
      countdownTimer = $interval(function () {
        vm.countdown--;
      }, 1000, sleep / 1000);
    }

    function _resetCountdown() {
      vm.countdown = 0;
      if (countdownTimer) {
        $interval.cancel(countdownTimer);
        countdownTimer = null;
      }
    }

    function _setState(state) {
      return $timeout(function () {
        vm.state = state;
        _resetCountdown();
      });
    }

    (function _init() {
      $scope.$watch(function () {
        return _.get($sessionStorage, 'messagingSidebar.compact', false);
      }, function (newVal) {
        vm.compact = newVal;
      });

      var unsubscribeSleepFn = $rootScope.$on('socketService:sleep', function (event, sleep) {
        if (attempt !== null) { // ignore silent reconnect
          _setState('SLEEP').then(function () {
            if (attempt >= silentAttempts) {
              vm.isSilent = false;
            }
            if (!vm.isSilent) {
              _startCountdown(sleep);
            }
          });
        }
      });

      var unsubscribeOfflineFn = $rootScope.$on('socketService:offline', function () {
        _setState('OFFLINE').then(function () {
          vm.isSilent = true;
          reconnectWarningModalService.open().finally(function () {
            vm.isSilent = false;
          });
        });
      });

      var unsubscribeConnectingFn = $rootScope.$on('socketService:connecting', function (event, newAttempt) {
        _setState('CONNECTING').then(function () {
          attempt = newAttempt;
        });
      });

      var unsubscribeConnectedFn = $rootScope.$on('socketService:connected', function () {
        _setState('CONNECTED').then(function () {
          attempt = null;
          vm.isSilent = true;
        });
      });

      $scope.$on('$destroy', function () {
        unsubscribeSleepFn();
        unsubscribeOfflineFn();
        unsubscribeConnectingFn();
        unsubscribeConnectedFn();
      });
    })();
  }

})(angular);
