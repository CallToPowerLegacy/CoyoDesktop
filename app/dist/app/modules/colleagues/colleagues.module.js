(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.colleagues
   *
   * @description
   * # Colleagues module #
   * The colleagues module contains the colleagues overview.
   */
  angular
      .module('coyo.colleagues', [
        'coyo.base',
        'commons.auth'
      ])
      .config(ModuleConfig)
      .constant('colleaguesConfig', {
        templates: {
          list: 'app/modules/colleagues/views/colleagues.main.html'
        },
        paging: {
          pageSize: 20
        }
      });

  /**
   * Module configuration
   */
  function ModuleConfig($stateProvider, colleaguesConfig) {
    $stateProvider.state('main.colleagues', {
      url: '/colleagues',
      templateUrl: colleaguesConfig.templates.list,
      controller: 'ColleaguesMainController',
      controllerAs: 'ctrl',
      resolve: {
        currentUser: function (authService) {
          return authService.getUser();
        },
        profileFieldGroups: function (profileFieldsService) {
          return profileFieldsService.getGroups();
        }
      },
      data: {
        guide: 'colleagues',
        globalPermissions: 'ACCESS_COLLEAGUE_LIST',
        pageTitle: 'MODULE.COLLEAGUES.PAGE_TITLE'
      }
    });
  }

})(angular);
