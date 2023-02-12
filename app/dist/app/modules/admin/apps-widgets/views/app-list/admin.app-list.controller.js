(function (angular) {
  'use strict';

  angular.module('coyo.admin.apps-widgets')
      .controller('AdminAppListController', AdminAppListController);

  function AdminAppListController($rootScope, $scope, $q, $timeout, appRegistry, AppConfigurationModel, appConfigs,
                                  adminAppSettingsModal) {
    var vm = this;

    vm.$onInit = onInit;
    vm.openSettings = openSettings;

    function toggle(senderType, app) {
      var deferred = $q.defer();

      $timeout(function () { // wait for coyoCheckbox to update model
        var model = new AppConfigurationModel({
          key: app.key,
          senderType: senderType,
          enabled: app.enabledSenderTypes[senderType]
        });
        model.save().then(function (response) {
          app.enabledSenderTypes[senderType] = response.enabledSenderTypes[senderType];
          if (!_.some(_.values(app.enabledSenderTypes), function (value) { return value === true; })) {
            app.moderatorsOnly = false;
            app.enabled = false;
          } else {
            app.enabled = true;
          }
        }).finally(deferred.resolve);
      });

      return deferred.promise;
    }

    function toggleModerator(app) {
      $timeout(function () { // wait for coyoCheckbox to update model
        if (app.moderatorsOnly) {
          AppConfigurationModel.restrict(app.key);
        } else {
          AppConfigurationModel.derestrict(app.key);
        }
      });
    }

    function openSettings(app) {
      adminAppSettingsModal
          .open(vm.senderTypes, app)
          .then(_saveModalChanges);
    }

    function _saveModalChanges(changedApp) {
      var app = _.find(vm.apps, {key: changedApp.key});
      if (angular.isDefined(app)) {
        var savingPromises = [];
        _.forEach(vm.senderTypes, function (senderType) {
          if (angular.isUndefined(app.enabledSenderTypes)) {
            _.set(app, 'enabledSenderTypes', {});
          }
          if (angular.isUndefined(app.enabledSenderTypes[senderType])
              || changedApp.enabledSenderTypes[senderType] !== app.enabledSenderTypes[senderType]) {
            app.enabledSenderTypes[senderType] = changedApp.enabledSenderTypes[senderType];
            savingPromises.push(toggle(senderType, app));
          }
        });

        if (changedApp.moderatorsOnly !== app.moderatorsOnly) {
          $q.all(savingPromises).then(function () {
            app.moderatorsOnly = changedApp.moderatorsOnly;
            toggleModerator(app);
          });
        }
      }
    }

    function _loadApps() {
      vm.apps = _.map(appRegistry.getAll(), function (app) {
        var appConfig = _.find(appConfigs, {key: app.key});
        var enabled = angular.isDefined(appConfig) ? appConfig.hasEnabledSender() : false;

        return angular.extend(app, {enabled: enabled, moderatorsOnly: false}, appConfig);
      });
    }

    function onInit() {
      vm.senderTypes = appRegistry.getAppSenderTypes();
      vm.apps = [];
      vm.toggle = toggle;
      vm.toggleModerator = toggleModerator;
      vm.isMobile = $rootScope.screenSize.isXs || $rootScope.screenSize.isSm;

      var unsubscribe = $rootScope.$on('screenSize:changed', function (event, screenSize) {
        vm.isMobile = screenSize.isXs || screenSize.isSm;
      });
      $scope.$on('$destroy', unsubscribe);

      _loadApps();
    }
  }

})(angular);
