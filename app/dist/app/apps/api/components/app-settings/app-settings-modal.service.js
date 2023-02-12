(function (angular) {
  'use strict';

  angular.module('coyo.apps.api')
      .factory('appSettingsModalService', appSettingsModalService)
      .controller('AppSettingsModalController', AppSettingsModalController)
      .controller('DeleteAppConfirmationModalController', DeleteAppConfirmationModalController);

  /**
   * @ngdoc service
   * @name coyo.apps.api.appSettingsModalService
   *
   * @description
   * This service provides a method to open a modal dialog which uses
   * {@link coyo.apps.api.oyocAppSettings:oyocAppSettings appSettings} and
   * {@link commons.ui.oyocSettingsView:oyocSettingsView settingsView} to display the settings
   * of a passed app. Within this settings a user can edit the default settings (like 'name' and 'active'), all custom
   * settings and can delete the app.
   *
   * @requires appService
   * @requires modalService
   */
  function appSettingsModalService(appService, modalService) {

    return {
      open: open
    };

    /**
     * @ngdoc method
     * @name coyo.apps.api.appSettingsModalService#open
     * @methodOf coyo.apps.api.appSettingsModalService
     *
     * @description
     * This method opens the modal which shows the settings of the passed app. Note that this service reloads the
     * active app, when the app itself changed.
     *
     * @param {object} app
     * The app to show the settings for. Note that the app gets copied, when opening the modal and
     * the modified copy is returned on success.
     *
     * @returns {object} A promise with the updated (or deleted) app. If the app got deleted a property "deleted" with
     * the value "true" is added to the returned object.
     */
    function open(app) {
      return modalService.open({
        size: 'lg',
        templateUrl: 'app/apps/api/components/app-settings/app-settings-modal.html',
        controller: 'AppSettingsModalController',
        resolve: {
          app: function () {
            return angular.copy(app);
          }
        }
      }).result.then(function (app) {
        if (!app.deleted) {
          appService.reloadApp(app);
        }
        return app;
      });
    }
  }

  function AppSettingsModalController(app, $q, $log, $uibModalInstance, $rootScope, SenderModel, modalService) {
    var vm = this;

    vm.app = app;
    vm.saveCallbacks = {
      onBeforeSave: function () {
        return $q.resolve();
      }
    };

    vm.save = save;
    vm.confirmRemoveApp = confirmRemoveApp;

    function save() {
      $log.debug('[AppSettingsModalController] Saving app', vm.app);
      vm.saveCallbacks.onBeforeSave().then(function () {
        return vm.app.save().then(function (app) {
          $rootScope.$emit('app:updated', app);
          $uibModalInstance.close(app);
        });
      });
    }

    function confirmRemoveApp(event) {
      event.preventDefault();
      var app = vm.app;

      modalService.open({
        size: 'md',
        templateUrl: 'app/apps/api/components/app-settings/delete-app-confirmation-modal.html',
        controller: 'DeleteAppConfirmationModalController',
        controllerAs: '$ctrl',
        resolve: {
          app: function () {
            return angular.copy(app);
          }
        }
      }).result.then(function (deleteAppFiles) {
        _remove(deleteAppFiles);
      });
    }

    function _remove(deleteAppFiles) {
      var senderModel = new SenderModel({id: vm.app.senderId});
      return senderModel.removeApp(vm.app.id, {deleteAppFiles: deleteAppFiles}).then(function () {
        vm.app.deleted = true;
        $rootScope.$emit('app:deleted', vm.app.id);
        $uibModalInstance.close(app);
      });
    }

  }

  function DeleteAppConfirmationModalController(FolderModel, app) {
    var vm = this;
    vm.$onInit = onInit;
    vm.deleteAppFiles = true;

    function onInit() {
      vm.loading = true;
      FolderModel.hasChildren(app.senderId, app.rootFolderId).then(function (appFolderHasFiles) {
        vm.showDeleteFilesHint = appFolderHasFiles;
      }).finally(function () {
        vm.loading = false;
      });
    }
  }

})(angular);
