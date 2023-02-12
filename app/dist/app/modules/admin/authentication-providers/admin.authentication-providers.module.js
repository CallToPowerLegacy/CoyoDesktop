(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.admin.authenticationProviders
   *
   * @description
   * # Admin authentication providers module #
   * The admin authentication module provides views to manage different authentication providers like SAML oder OpenID.
   */
  angular
      .module('coyo.admin.authenticationProviders', [
        'coyo.base',
        'coyo.domain',
        'coyo.admin.authenticationProviders.api',
        'coyo.admin.authenticationProviders.saml',
        'coyo.admin.authenticationProviders.oauth2'
      ])
      .config(ModuleConfig)
      .constant('adminAuthenticationProviderConfig', {
        templates: {
          list: 'app/modules/admin/authentication-providers/views/authentication-provider-list/admin.authentication-provider-list.html',
          details: 'app/modules/admin/authentication-providers/views/authentication-provider-details/admin.authentication-provider-details.html'
        }
      });

  /**
   * Module configuration
   */
  function ModuleConfig($stateProvider, adminAuthenticationProviderConfig) {
    $stateProvider.state('admin.authentication-providers', {
      abstract: true,
      url: '/authentication-providers',
      template: '<ui-view></ui-view>',
      data: {
        globalPermissions: 'MANAGE_AUTHENTICATION_PROVIDER_CONFIGS',
        pageTitle: 'ADMIN.MENU.AUTHENTICATION_PROVIDERS'
      }
    }).state('admin.authentication-providers.list', {
      url: '',
      views: {
        '@admin.authentication-providers': {
          templateUrl: adminAuthenticationProviderConfig.templates.list,
          controller: 'AdminAuthenticationProviderListController',
          controllerAs: '$ctrl'
        }
      }
    }).state('admin.authentication-providers.create', {
      url: '/create',
      views: {
        '@admin.authentication-providers': {
          templateUrl: adminAuthenticationProviderConfig.templates.details,
          controller: 'AdminAuthenticationProviderDetailsController',
          controllerAs: '$ctrl'
        }
      },
      resolve: {
        authenticationProvider: function (AuthenticationProviderModel) {
          return new AuthenticationProviderModel();
        }
      }
    }).state('admin.authentication-providers.edit', {
      url: '/edit/{id}',
      views: {
        '@admin.authentication-providers': {
          templateUrl: adminAuthenticationProviderConfig.templates.details,
          controller: 'AdminAuthenticationProviderDetailsController',
          controllerAs: '$ctrl'
        }
      },
      resolve: {
        authenticationProvider: function (AuthenticationProviderModel, $stateParams) {
          return AuthenticationProviderModel.get($stateParams.id);
        }
      }
    });
  }
})(angular);
