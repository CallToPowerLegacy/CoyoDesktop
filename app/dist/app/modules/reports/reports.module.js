(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.reports
   *
   * @description
   * # Reports module #
   */
  angular
      .module('coyo.reports', [
        'coyo.base',
        'coyo.domain'
      ])
      .config(ModuleConfig)
      .constant('reportsConfig', {
        templates: {
          list: 'app/modules/reports/views/reports.list.html'
        }
      });

  /**
   * Module configuration
   */
  function ModuleConfig($stateProvider, reportsConfig) {
    $stateProvider.state('main.report', {
      url: '/reports',
      templateUrl: reportsConfig.templates.list,
      controller: 'ReportsListController',
      controllerAs: '$ctrl',
      data: {
        globalPermissions: 'MANAGE_REPORTS',
        pageTitle: 'MODULE.REPORTS.PAGE_TITLE'
      }
    });
  }

})(angular);
