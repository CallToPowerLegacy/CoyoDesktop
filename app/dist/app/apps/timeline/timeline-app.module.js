(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.apps.timeline
   *
   * @description
   * # Timeline app module #
   * The timeline app module contains the timeline app objects.
   *
   * @requires coyo.apps.api.appRegistryProvider
   */
  angular
      .module('coyo.apps.timeline', [
        'coyo.base',
        'coyo.apps.api',
        'commons.config',
        'commons.ui',
        'commons.i18n'
      ])
      .config(registerApp);

  function registerApp(appRegistryProvider) {
    appRegistryProvider.register({
      name: 'APP.TIMELINE.NAME',
      description: 'APP.TIMELINE.DESCRIPTION',
      key: 'timeline',
      icon: 'zmdi-comment-list',
      allowedInstances: 1,
      allowedInstancesErrorMessage: 'APP.TIMELINE.ALLOWEDINSTANCES.ERROR',
      states: [
        {
          templateUrl: 'app/apps/timeline/timeline-main.html',
          controller: /*@ngInject*/ function (app) {
            var vm = this;
            vm.app = app;
          },
          controllerAs: '$ctrl'
        }
      ],
      settings: {
        templateUrl: 'app/apps/timeline/timeline-settings.html',
        controller: 'TimelineSettingsController',
        controllerAs: 'ctrl'
      }
    });
  }

})(angular);
