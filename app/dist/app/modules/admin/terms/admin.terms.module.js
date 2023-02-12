(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.admin.themes
   *
   * @description
   * # Admin terms of use management module #
   * The admin terms of use management module provides views to manage the terms of use feature.
   */
  angular
      .module('coyo.admin.terms', [
        'coyo.base',
        'coyo.domain'
      ])
      .config(ModuleConfig);

  /**
   * Module configuration
   */
  function ModuleConfig($stateProvider) {
    $stateProvider.state('admin.terms', {
      url: '/terms',
      templateUrl: 'app/modules/admin/terms/admin.terms.html',
      redirect: 'admin.terms.general',
      data: {
        globalPermissions: 'MANAGE_TERMS',
        pageTitle: 'ADMIN.MENU.TERMS'
      },
      resolve: {
        backendUrl: function (backendUrlService) {
          return backendUrlService.getUrl();
        }
      }
    }).state('admin.terms.general', {
      url: '/general',
      views: {
        '@admin.terms': {
          templateUrl: 'app/modules/admin/terms/views/general/admin.terms.general.html',
          controller: 'AdminTermsGeneralController',
          controllerAs: '$ctrl'
        }
      },
      resolve: {
        languages: function (LanguagesModel) {
          return LanguagesModel.retrieve();
        },
        settings: function (SettingsModel) {
          return SettingsModel.retrieve();
        },
        translations: function (TermsModel) {
          return TermsModel.get();
        }
      }
    }).state('admin.terms.log', {
      url: '/log',
      views: {
        '@admin.terms': {
          templateUrl: 'app/modules/admin/terms/views/log/admin.terms.log.html',
          controller: 'AdminTermsLogController',
          controllerAs: '$ctrl'
        }
      }
    });
  }

})(angular);
