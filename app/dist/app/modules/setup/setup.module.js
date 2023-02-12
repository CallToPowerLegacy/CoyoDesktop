(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.setup
   *
   * @description
   * # Setup module #
   * The setup module renders the setup page and handles everything setup-related.
   *
   * @requires $stateProvider
   */
  angular
      .module('coyo.setup', [
        'coyo.base',
        'commons.resource'
      ])
      .config(ModuleConfig)
      .constant('setupConfig', {
        templates: {
          main: 'app/modules/setup/views/main/setup.main.html'
        }
      });

  /**
   * Module configuration
   */
  function ModuleConfig($stateProvider, setupConfig) {
    $stateProvider.state('setup', {
      url: '/setup',
      templateUrl: setupConfig.templates.main,
      controller: 'SetupController',
      controllerAs: 'vm',
      data: {
        authenticate: false
      },
      resolve: {
        isSetUp: /*@ngInject*/ function (setupService) {
          return setupService.check();
        },
        emailPattern: /*@ngInject*/ function (SettingsModel) {
          return SettingsModel.retrieveByKey('emailPattern');
        },
        passwordPattern: /*@ngInject*/ function (SettingsModel) {
          return SettingsModel.retrieveByKey('passwordPattern');
        }
      }
    });
  }

})(angular);
