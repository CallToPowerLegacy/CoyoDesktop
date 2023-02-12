(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.maintenance
   *
   * @description
   * # Maintenance module #
   * The maintenance module renders the maintenance page
   *
   * @requires $stateProvider
   */
  angular
      .module('coyo.maintenance', [
        'coyo.base',
        'commons.auth',
        'commons.ui',
        'commons.i18n',
        'coyo.domain'
      ])
      .config(ModuleConfig)
      .constant('maintenanceConfig', {
        templates: {
          main: 'app/modules/maintenance/views/main/maintenance.main.html'
        }
      });

  /**
   * Module configuration
   */
  function ModuleConfig($stateProvider, maintenanceConfig) {
    $stateProvider.state('front.maintenance', {
      url: '/maintenance',
      templateUrl: maintenanceConfig.templates.main,
      controller: 'MaintenanceMainController',
      controllerAs: '$ctrl',
      params: {
        'global': true
      },
      resolve: {

      }
    });
  }

})(angular);
