(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.apps.content
   *
   * @description
   * # Content app module #
   * The content app module contains the content app objects.
   *
   * @requires coyo.apps.api.appRegistryProvider
   */
  angular
      .module('coyo.apps.content', [
        'coyo.base',
        'coyo.apps.api',
        'commons.config',
        'commons.ui',
        'commons.i18n'
      ])
      .config(registerApp);

  function registerApp(appRegistryProvider) {
    appRegistryProvider.register({
      name: 'APP.CONTENT.NAME',
      description: 'APP.CONTENT.DESCRIPTION',
      key: 'content',
      icon: 'zmdi-view-compact',
      states: [
        {
          abstract: true,
          templateUrl: 'app/apps/content/content-app-frame.html',
          controller: angular.noop,
          resolve: {
            sender: /*@ngInject*/ function (SenderModel, app) {
              return SenderModel.getWithPermissions(app.senderId, {}, []);
            }
          }
        },
        {
          name: 'content',
          url: '',
          default: true,
          params: {created: false},
          templateUrl: 'app/apps/content/content-app-view.html',
          controller: 'ContentAppViewController',
          controllerAs: '$ctrl',
          resolve: {
            currentUser: /*@ngInject*/ function (authService) {
              return authService.getUser();
            },
            settings: /*@ngInject*/ function (SettingsModel) {
              return SettingsModel.retrieve();
            }
          }
        },
        {
          name: 'content.edit',
          url: '/edit',
          params: {created: null},
          views: {
            '@$appRoot': {
              templateUrl: 'app/apps/content/content-app-edit.html',
              controller: 'ContentAppEditController',
              controllerAs: '$ctrl'
            }
          }
        }
      ]
    });
  }

})(angular);
