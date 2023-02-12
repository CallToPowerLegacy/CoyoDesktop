(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.api')
      .directive('oyocAppSettings', appSettings)
      .controller('AppSettingsController', AppSettingsController);

  /**
   * @ngdoc directive
   * @name coyo.apps.api.oyocAppSettings:oyocAppSettings
   * @element ANY
   * @restrict E
   * @scope
   *
   * @description
   * Creates an settings dialog for an app. In this dialog the user can specify a name and whether the app should be
   * active or not. In addition settings from the {@link commons.ui.oyocSettingsView:oyocSettingsView settingsView}
   * directive are included if provided.
   *
   * @param {object} app
   * The app to create the settings for. If this app does not contain any settings an empty settings object is created.
   *
   * @param {object} formCtrl
   * The settingsForm controller, needed for proper validation inside custom settings.
   *
   * @param {object} saveCallbacks
   * On object containing functions with callback methods, that are synchronously executed before the settings are
   * saved. This gives developers the opportunity to modify the settings object before it is persisted. Make sure that
   * the callback function returns a promise. If the promise is rejected, the save operation is canceled.
   *
   * ```
   * vm.saveCallbacks.onBeforeSave = function () {
   *   // do something before save
   *   return $q.resolve();
   * };
   * ```
   *
   * @requires coyo.apps.api.appRegistry
   */
  function appSettings() {
    return {
      restrict: 'E',
      templateUrl: 'app/apps/api/components/app-settings/app-settings.html',
      scope: {},
      bindToController: {
        app: '=',
        formCtrl: '=',
        saveCallbacks: '='
      },
      controller: 'AppSettingsController',
      controllerAs: '$ctrl'
    };
  }

  function AppSettingsController(appRegistry) {
    var vm = this;

    vm.appConfig = appRegistry.get(vm.app.key);
    vm.app.settings = vm.app.settings || {};
    vm.oldSlug = vm.app.slug;
  }

})(angular);
