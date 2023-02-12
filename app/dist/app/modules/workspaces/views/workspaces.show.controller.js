(function (angular) {
  'use strict';

  angular
      .module('coyo.workspaces')
      .controller('WorkspacesShowController', WorkspacesShowController);

  function WorkspacesShowController($scope, $rootScope, $state, appService, senderService, currentUser, workspace, apps, SenderModel) {
    var vm = this;
    var senderModel = new SenderModel({id: workspace.id});

    vm.currentUser = currentUser;
    vm.workspace = workspace;
    vm.apps = apps;
    vm.appsStatus = {busy: false};

    vm.join = join;
    vm.leave = leave;
    vm.changeAvatar = function (sender) {
      senderService.changeAvatar({title: 'MODULE.WORKSPACES.MODALS.CHANGE_AVATAR.TITLE'})(sender).then(function () {
        $scope.$broadcast('workspaceAvatar:changed');
      });
    };

    vm.addApp = addApp;
    vm.addGroup = addGroup;

    vm.showMembers = !$rootScope.screenSize.isXs;

    function join() {
      vm.workspace.join().then(function () {
        // we need to reload the state here since the workspace, the user and the members must be resolved again
        $state.reload('main.workspace.show');
      });
    }

    function leave() {
      vm.workspace.leave().then(function () {
        $state.go('main.workspace');
      });
    }

    function addApp(sender, apps) {
      if (!vm.appsStatus.busy) {
        appService.addApp(sender, apps);
      }
    }

    function addGroup() {
      if (vm.appsStatus.busy) {
        return;
      }
      vm.appsStatus.busy = true;

      var appNavigation = vm.workspace.appNavigation ? angular.copy(vm.workspace.appNavigation) : [];
      appNavigation.push({name: '', apps: []});
      senderModel.updateNavigation(appNavigation).then(function (result) {
        vm.workspace.appNavigation = result;
      }).finally(function () {
        vm.appsStatus.busy = false;
      });
    }

    function _getCurrentApp(appIdOrSlug) {
      return _.find(vm.apps, function (app) {
        return appIdOrSlug === app.slug || appIdOrSlug === app.id;
      });
    }

    (function _init() {
      // async load of pending request count
      if (vm.workspace._permissions.manage) {
        vm.workspace.countRequested().then(function (requested) {
          vm.workspace.requestedCount = requested.count;
        });
      }

      /*
       * We need to redirect to the first app when...
       * ... the main state of the workspace was called and at least one app exists
       * ... an app state was called, but no current app is selected
       */
      if (vm.apps.length > 0 && $state.is('main.workspace.show') || $state.includes('main.workspace.show.apps')) {
        vm.currentApp = _getCurrentApp(appService.getCurrentAppIdOrSlug());
        if (!vm.currentApp) {
          appService.redirectToSender(vm.workspace, vm.apps);
        }
      }

      // Subscribe to events (and unsubscribe if not needed anymore)
      var unsubscribeAppChanged = appService.onAppChanged(function (appId) {
        vm.currentApp = _getCurrentApp(appId);
      });
      var unsubscribeAppUpdated = $rootScope.$on('app:updated', function (event, app) {
        appService.updateApp(app, vm.apps);
        if (vm.currentApp && vm.currentApp.slug !== app.slug) {
          appService.redirectToApp(vm.workspace, app, false);
        }
      });
      var unsubscribeAppDeleted = $rootScope.$on('app:deleted', function (event, appId) {
        appService.deleteApp(appId, vm.apps);
        if (vm.currentApp && vm.currentApp.id === appId) {
          appService.redirectToSender(vm.workspace, vm.apps);
        }
      });

      $scope.$on('$destroy', unsubscribeAppChanged);
      $scope.$on('$destroy', unsubscribeAppUpdated);
      $scope.$on('$destroy', unsubscribeAppDeleted);
    })();
  }

})(angular);
