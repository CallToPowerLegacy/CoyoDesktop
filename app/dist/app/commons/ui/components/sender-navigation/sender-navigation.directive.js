(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoSenderNavigation', senderNavigation)
      .controller('SenderNavigationController', SenderNavigationController);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoSenderNavigation:coyoSenderNavigation
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Renders the navigation for senders showing the senders' apps. Apps can be re-arranged via drag and drop.
   *
   * @param {object} sender
   * The sender to display the navigation for.
   *
   * @param {object[]} apps
   * The apps of the given sender.
   *
   * @requires $log
   * @requires SenderModel
   * @requires appRegistry
   */
  function senderNavigation() {
    return {
      restrict: 'E',
      templateUrl: 'app/commons/ui/components/sender-navigation/sender-navigation.html',
      scope: {},
      bindToController: {
        apps: '<',
        appsStatus: '=',
        sender: '='
      },
      controller: 'SenderNavigationController',
      controllerAs: '$ctrl'
    };
  }

  function SenderNavigationController($scope, $rootScope, SenderModel, appRegistry, appSettingsModalService) {
    var vm = this;
    var senderModel = new SenderModel({id: vm.sender.id});

    vm.lastAppUpdate = new Date().getTime();
    vm.treeOptions = {
      dropped: saveNavigation
    };

    vm.getRootState = getRootState;
    vm.getApp = getApp;
    vm.getAppsByGroup = getAppsByGroup;
    vm.getIcon = appRegistry.getIcon;
    vm.saveNavigation = saveNavigation;
    vm.deleteGroup = deleteGroup;
    vm.openSettings = openSettings;
    vm.containsActiveApps = containsActiveApps;

    function getRootState(app) {
      return appRegistry.getRootStateName(app.key, vm.sender.typeName) + '({appIdOrSlug: app.slug })';
    }

    function getAppsByGroup(appGroup) {
      return _.chain(appGroup.apps).map(getApp).filter(angular.isDefined).value();
    }

    function getApp(id) {
      return _.find(vm.apps, {id: id});
    }

    function saveNavigation() {
      if (vm.sender._permissions.manageApps) {
        _saveNavigation(vm.sender.appNavigation);
      }
    }

    function deleteGroup(index) {
      var appNavigation = angular.copy(vm.sender.appNavigation);
      appNavigation.splice(index, 1);
      _saveNavigation(appNavigation);
    }

    function openSettings(app, $event) {
      $event.preventDefault();
      $event.stopImmediatePropagation();
      if (vm.appsStatus.busy) { return; }

      appSettingsModalService.open(app);
    }

    function containsActiveApps(appGroup) {
      return _.findIndex(getAppsByGroup(appGroup), {active: true}) >= 0;
    }

    function _saveNavigation(appNavigation) {
      if (vm.appsStatus.busy) { return; }
      vm.appsStatus.busy = true;

      senderModel.updateNavigation(appNavigation).then(function (result) {
        vm.sender.appNavigation = result;
        vm.lastAppUpdate = new Date().getTime();
      }).finally(function () {
        vm.appsStatus.busy = false;
      });
    }

    (function _init() {
      // update nav on app creation
      var unsubscribeAppCreated = $rootScope.$on('app:created', function (event, app) {
        if (!angular.isArray(_.get(vm.sender, 'appNavigation[0].apps'))) {
          vm.sender.appNavigation = [{name: _.get(vm.sender, 'appNavigation[0].name', ''), apps: [app.id]}];
        } else {
          vm.sender.appNavigation[0].apps.push(app.id);
        }
        vm.lastAppUpdate = new Date().getTime();
      });

      // update nav on app deletion
      var unsubscribeAppDeleted = $rootScope.$on('app:deleted', function (event, appId) {
        _.forEach(vm.sender.appNavigation, function (group) {
          _.pull(group.apps, appId);
        });
        vm.lastAppUpdate = new Date().getTime();
      });

      // update nav on app update
      var unsubscribeAppUpdated = $rootScope.$on('app:updated', function () {
        vm.lastAppUpdate = new Date().getTime();
      });

      $scope.$on('$destroy', unsubscribeAppCreated);
      $scope.$on('$destroy', unsubscribeAppDeleted);
      $scope.$on('$destroy', unsubscribeAppUpdated);
    })();
  }

})(angular);
