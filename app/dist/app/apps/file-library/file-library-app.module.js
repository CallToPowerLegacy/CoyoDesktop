(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.apps.file-library
   *
   * @description
   * # File library app module #
   * The file library app module contains the timeline app objects.
   *
   * @requires coyo.apps.api.appRegistryProvider
   */
  angular
      .module('coyo.apps.file-library', [
        'coyo.base',
        'coyo.apps.api',
        'commons.i18n'
      ])
      .config(registerApp);

  function registerApp(appRegistryProvider) {
    appRegistryProvider.register({
      name: 'APP.FILE_LIBRARY.NAME',
      description: 'APP.FILE_LIBRARY.DESCRIPTION',
      key: 'file-library',
      icon: 'zmdi-file',
      states: [
        {
          templateUrl: 'app/apps/file-library/file-library-app-main.html',
          controller: 'FileLibraryAppMainController',
          controllerAs: '$ctrl',
          resolve: {
            sender: /*@ngInject*/ function (app, SenderModel) {
              return SenderModel.getWithPermissions(app.senderId, {}, ['manage', 'createFile']);
            }
          }
        }
      ],
      settings: {
        templateUrl: 'app/apps/file-library/file-library-app-settings.html',
        controller: 'FileLibraryAppSettingsController',
        controllerAs: '$ctrl'
      }
    });
  }

})(angular);
