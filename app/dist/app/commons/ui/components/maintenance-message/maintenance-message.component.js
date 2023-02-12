(function (angular) {
  'use strict';

  /**
   * @ngdoc directive
   * @name commons.ui.maintenanceMessage:maintenanceMessage
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Displays a bar on the bottom of the screen when the system admin enables a system wide message.
   * This message can be hidden with a link on the bar.
   */
  var maintenanceMessageComponent = {
    templateUrl: 'app/commons/ui/components/maintenance-message/maintenance-message.html',
    controller: 'MaintenanceMessageController'
  };

  angular
      .module('commons.ui')
      .controller('MaintenanceMessageController', MaintenanceMessageController)
      .component('oyocMaintenanceMessage', maintenanceMessageComponent);

  function MaintenanceMessageController($scope, socketService, $q, adminStates, authService, SettingsModel, $timeout, $sessionStorage) {
    var vm = this;
    vm.close = close;
    var timeout;

    function updateDisplay() {
      if (vm.message.endDate) {
        if (timeout) {
          $timeout.cancel(timeout);
        }
        var endIn = Date.now() - vm.message.endDate;
        timeout = $timeout(updateDisplay, endIn);
      }
      var currentTime = new Date().getTime();

      authService.getUser().then(function (user) {
        var checkAdmin = vm.message.onlyAdmins !== 'true' ||
          (vm.message.onlyAdmins === 'true' && user.hasGlobalPermissions(vm.allAdminPermissions));
        var checkTime = !vm.message.endDate || currentTime <= vm.message.endDate;
        var checkMessage = vm.message.message && vm.message.message !== '';
        var checkHidden = angular.isUndefined($sessionStorage['maintenanceMessage.' + vm.message.id]);
        vm.display = checkMessage && checkAdmin && checkTime && checkHidden;
      });
    }

    function updateMessageFromSettings() {
      var promises = [SettingsModel.retrieveByKey('maintenanceMessage'),
        SettingsModel.retrieveByKey('maintenanceMessageOnlyAdmins'),
        SettingsModel.retrieveByKey('maintenanceMessageEndDate'),
        SettingsModel.retrieveByKey('maintenanceMessageId')];

      return $q.all(promises).then(function (values) {
        return {
          id: values[3],
          message: values[0],
          onlyAdmins: values[1],
          endDate: values[2]
        };
      });
    }

    function close() {
      $sessionStorage['maintenanceMessage.' + vm.message.id] = true;
      updateDisplay();
    }

    (function activate() {
      vm.message = {};
      vm.allAdminPermissions = _.map(adminStates, 'globalPermission').join(',');
      vm.display = false;


      updateMessageFromSettings().then(function (message) {
        vm.message = message;
        updateDisplay();
      });
      authService.getUser().then(function (user) {
        var destination = '/topic/setting.' + user.tenant;
        var listenerMessage = socketService.subscribe(destination, function (message) {
          vm.message.message = message.content.value;
          updateDisplay();
          $scope.$apply();
        }, {content: {key: 'maintenanceMessage'}});
        var listenerMessageId = socketService.subscribe(destination, function (message) {
          vm.message.id = message.content.value;
          updateDisplay();
          $scope.$apply();
        }, {content: {key: 'maintenanceMessageId'}});
        var listenerEndDate = socketService.subscribe(destination, function (message) {
          vm.message.endDate = message.content.value;
          updateDisplay();
          $scope.$apply();
        }, {content: {key: 'maintenanceMessageEndDate'}});
        var listenerOnlyAdmins = socketService.subscribe(destination, function (message) {
          vm.message.onlyAdmins = message.content.value;
          updateDisplay();
          $scope.$apply();
        }, {content: {key: 'maintenanceMessageOnlyAdmins'}});

        $scope.$on('$destroy', listenerMessage);
        $scope.$on('$destroy', listenerMessageId);
        $scope.$on('$destroy', listenerEndDate);
        $scope.$on('$destroy', listenerOnlyAdmins);
        $scope.$on('$destroy', function () {
          $timeout.cancel(timeout);
        });
      });
    })();
  }
})(angular);
