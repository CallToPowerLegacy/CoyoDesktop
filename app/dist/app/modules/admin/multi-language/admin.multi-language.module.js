(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.admin.multiLanguage
   *
   * @description
   * # Admin translations management module #
   * The admin multi language management module provides views to manage custom translation keys.
   */
  angular
      .module('coyo.admin.multiLanguage', [
        'coyo.base',
        'coyo.domain'
      ])
      .config(ModuleConfig)
      .constant('adminMultiLanguageConfig', {
        templates: {
          home: 'app/modules/admin/multi-language/admin.multi-language.html',
          languages: 'app/modules/admin/multi-language/views/languages/admin.languages.html',
          translations: 'app/modules/admin/multi-language/views/translations/admin.translations.html',
          edit: 'app/modules/admin/multi-language/views/edit/admin.translations-edit.html'
        }
      });

  /**
   * Module configuration
   */
  function ModuleConfig($stateProvider, adminMultiLanguageConfig) {
    $stateProvider.state('admin.multi-language', {
      url: '/multi-language',
      templateUrl: adminMultiLanguageConfig.templates.home,
      redirectTo: 'admin.multi-language.languages',
      data: {
        globalPermissions: 'MANAGE_LANGUAGES',
        pageTitle: 'ADMIN.MENU.MULTI_LANGUAGE'
      }
    }).state('admin.multi-language.languages', {
      url: '/languages',
      views: {
        '@admin.multi-language': {
          templateUrl: adminMultiLanguageConfig.templates.languages,
          controller: 'AdminLanguagesController',
          controllerAs: '$ctrl'
        }
      },
      resolve: {
        languageModels: function (LanguagesModel) {
          return LanguagesModel.getAll();
        }
      }
    }).state('admin.multi-language.translations', {
      url: '/translations',
      views: {
        '@admin.multi-language': {
          templateUrl: adminMultiLanguageConfig.templates.translations,
          controller: 'AdminTranslationsController',
          controllerAs: '$ctrl'
        }
      },
      resolve: {
        settings: function (SettingsModel) {
          return SettingsModel.retrieve();
        },
        languages: function (LanguagesModel) {
          return LanguagesModel.getAll();
        }
      }
    });
  }

})(angular);
