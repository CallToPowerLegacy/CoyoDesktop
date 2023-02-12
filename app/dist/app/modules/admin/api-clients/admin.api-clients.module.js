(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.admin.api-clients
   *
   * @description
   * # Admin API clients management module #
   * The admin API clients management module provides views to manage API clients.
   */
  angular
      .module('coyo.admin.apiClients', [
        'coyo.base',
        'commons.auth',
        'coyo.domain'
      ])
      .config(ModuleConfig)
      .constant('adminApiClientsConfig', {
        templates: {
          apiClientsList: 'app/modules/admin/api-clients/views/api-clients-list/admin.api-clients-list.html',
          apiClientsDetails: 'app/modules/admin/api-clients/views/api-clients-details/admin.api-clients-details.html'
        }
      });

  /**
   * Module configuration
   */
  function ModuleConfig($stateProvider, adminApiClientsConfig) {
    $stateProvider.state('admin.api-clients', {
      abstract: true,
      url: '/api-clients',
      template: '<ui-view></ui-view>',
      data: {
        globalPermissions: 'MANAGE_API_CLIENTS',
        pageTitle: 'ADMIN.MENU.API_CLIENTS'
      }
    }).state('admin.api-clients.list', {
      url: '',
      views: {
        '@admin.api-clients': {
          templateUrl: adminApiClientsConfig.templates.apiClientsList,
          controller: 'AdminApiClientsListController',
          controllerAs: '$ctrl'
        }
      }
    }).state('admin.api-clients.create', {
      url: '/create',
      views: {
        '@admin.api-clients': {
          templateUrl: adminApiClientsConfig.templates.apiClientsDetails,
          controller: 'AdminApiClientsDetailsController',
          controllerAs: '$ctrl'
        }
      },
      resolve: {
        client: function (ApiClientModel) {
          return new ApiClientModel();
        }
      }
    });
  }

})(angular);
