(function (angular) {
  'use strict';

  angular
      .module('coyo.pages')
      .controller('PageController', PageController);

  /**
   * Controller for the pages details/show view
   */
  function PageController($scope, $rootScope, page, apps, senderService, appService, backendUrlService, SenderModel) {
    var vm = this;
    var senderModel = new SenderModel({id: page.id});

    vm.page = page;
    vm.apps = apps;
    vm.appsStatus = {busy: false};
    vm.backendUrl = backendUrlService.getUrl();
    vm.displayMobileNavigation = vm.apps.length || (vm.page._permissions.manage) || vm.page._permissions.manageApps;

    vm.changeCover = senderService.changeCover({title: 'MODULE.PAGES.MODALS.CHANGE_BG_IMAGE.TITLE'});
    vm.changeAvatar = function (sender) {
      senderService.changeAvatar({title: 'MODULE.PAGES.MODALS.CHANGE_AVATAR.TITLE'})(sender).then(function () {
        $scope.$broadcast('pageAvatar:changed');
      });
    };
    vm.addApp = addApp;
    vm.addGroup = addGroup;

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

      var appNavigation = vm.page.appNavigation ? angular.copy(vm.page.appNavigation) : [];
      appNavigation.push({name: '', apps: []});
      senderModel.updateNavigation(appNavigation).then(function (result) {
        vm.page.appNavigation = result;
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
      vm.currentApp = _getCurrentApp(appService.getCurrentAppIdOrSlug());
      if (!vm.currentApp) {
        appService.redirectToSender(vm.page, vm.apps);
      }

      // Subscribe to events (and unsubscribe if not needed anymore)
      var unsubscribeAppChanged = appService.onAppChanged(function (appId) {
        vm.currentApp = _getCurrentApp(appId);
      });
      var unsubscribeAppUpdated = $rootScope.$on('app:updated', function (event, app) {
        appService.updateApp(app, vm.apps);
        // redirect to app if slug of current app changed
        if (vm.currentApp && vm.currentApp.id === app.id && vm.currentApp.slug !== app.slug) {
          appService.redirectToApp(vm.page, app, false);
        }
      });
      var unsubscribeAppDeleted = $rootScope.$on('app:deleted', function (event, appId) {
        appService.deleteApp(appId, vm.apps);
        if (vm.currentApp && vm.currentApp.id === appId) {
          appService.redirectToSender(vm.page, vm.apps);
        }
      });

      $scope.$on('$destroy', unsubscribeAppChanged);
      $scope.$on('$destroy', unsubscribeAppUpdated);
      $scope.$on('$destroy', unsubscribeAppDeleted);
    })();
  }

})(angular);
