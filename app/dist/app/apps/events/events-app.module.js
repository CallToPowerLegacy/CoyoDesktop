(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.apps.events
   *
   * @description
   * # Events app module #
   * The events app module contains the Events app objects.
   *
   * @requires coyo.apps.api.appRegistryProvider
   */
  angular
      .module('coyo.apps.events', [
        'coyo.base',
        'coyo.events',
        'coyo.apps.api',
        'commons.config',
        'commons.ui',
        'commons.i18n'
      ])
      .config(registerApp)
      .constant('eventsAppConfig', {
        list: {
          paging: {
            pageSize: 20
          }
        }
      });

  function registerApp(appRegistryProvider) {
    appRegistryProvider.register({
      name: 'APP.EVENTS.NAME',
      description: 'APP.EVENTS.DESCRIPTION',
      key: 'events',
      icon: 'zmdi-calendar',
      states: [{
        templateUrl: 'app/apps/events/events-main.html',
        controller: 'EventsAppMainController',
        controllerAs: '$ctrl',
        resolve: {
          user: /*@ngInject*/ function (authService) {
            return authService.getUser();
          },
          sender: /*@ngInject*/ function (SenderModel, app) {
            return SenderModel.getWithPermissions(app.senderId, {}, ['createEvent']);
          }
        }
      }]
    });
  }

})(angular);
