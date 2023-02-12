(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.api')
      .factory('appChooserModalService', appChooserModalService)
      .controller('AppChooserModalController', AppChooserModalController);

  /**
   * @ngdoc service
   * @name coyo.apps.api.appChooserModalService
   *
   * @description
   * This service opens a modal in which the user can choose and configure a new app. The modal consists of two
   * pages. One for selecting the type of the new app and one for specifying the settings of the chosen app type.
   *
   * @requires $uibModalInstance
   * @requires modalService
   * @requires sender
   */
  function appChooserModalService(modalService) {
    return {
      open: open
    };

    /**
     * @ngdoc method
     * @name coyo.apps.api.appChooserModalService#open
     * @methodOf coyo.apps.api.appChooserModalService
     *
     * @description
     * Opens the modal to choose and configure an app from.
     *
     * @param {object} sender
     * The sender context the newly created app should belong to.
     *
     * @returns {object}
     * Returns a promise with the saved app.
     */
    function open(sender) {
      return modalService.open({
        size: 'lg',
        templateUrl: 'app/apps/api/components/app-chooser/app-chooser-modal.html',
        controller: 'AppChooserModalController',
        resolve: {
          sender: function () { return sender; },
          apps: /*@ngInject*/ function (SenderModel) {
            return new SenderModel({id: sender.id}).getApps();
          }
        }
      }).result;
    }
  }

  function AppChooserModalController($q, $rootScope, $uibModalInstance, appRegistry, sender, apps) {
    var vm = this;
    var senderAppInformation = [];

    vm.$onInit = onInit;

    vm.senderType = sender.typeName;
    vm.saveCallbacks = {
      onBeforeSave: function () {
        return $q.resolve();
      }
    };

    vm.canCreateApp = canCreateApp;
    vm.getAppTypeInformation = getAppTypeInformation;
    vm.goBack = goBack;
    vm.save = save;

    /**
     * Checks whether the app can be created or enough instances of it have already been created.
     *
     * @param {object} app The app
     */
    function canCreateApp(app) {
      var appTypeInformation = _.find(senderAppInformation, {key: app.key});
      return !appTypeInformation || appTypeInformation.allowedInstances <= 0 || appTypeInformation.instances < appTypeInformation.allowedInstances;
    }

    /**
     * Returns global type information of the app.
     *
     * @param {object} app The app
     */
    function getAppTypeInformation(app) {
      return _.find(senderAppInformation, {key: app.key}) || {};
    }

    function goBack() {
      vm.selectedApp = null;
    }

    function save() {
      if (canCreateApp(vm.selectedApp)) {
        vm.selectedApp.senderId = sender.id;
        return vm.saveCallbacks.onBeforeSave().then(function () {
          return vm.selectedApp.createWithPermissions(['manage']).then(function (app) {
            $rootScope.$emit('app:created', app);
            $uibModalInstance.close(app);
          });
        });
      }
      return $q.reject();
    }

    function onInit() {
      senderAppInformation = _.map(_.countBy(apps, 'key'), function (count, appKey) {
        return {
          key: appKey,
          instances: count,
          allowedInstances: appRegistry.get(appKey).allowedInstances,
          allowedInstancesErrorMessage: appRegistry.get(appKey).allowedInstancesErrorMessage
        };
      });
    }
  }

})(angular);
