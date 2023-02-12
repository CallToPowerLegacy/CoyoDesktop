(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.admin.themes
   *
   * @description
   * # Admin theme management module #
   * The admin theme management module provides views to manage custom css styles.
   */
  angular
      .module('coyo.admin.themes', [
        'coyo.base',
        'coyo.domain'
      ])
      .config(ModuleConfig)
      .constant('adminThemeConfig', {
        templates: {
          themeList: 'app/modules/admin/themes/views/theme-list/admin.theme-list.html',
          themeDetails: 'app/modules/admin/themes/views/theme-details/admin.theme-details.html'
        }
      });

  /**
   * Module configuration
   */
  function ModuleConfig($stateProvider, adminThemeConfig) {
    $stateProvider.state('admin.themes', {
      abstract: true,
      url: '/themes',
      template: '<ui-view></ui-view>',
      data: {
        globalPermissions: 'MANAGE_THEMES',
        pageTitle: 'ADMIN.MENU.THEMES'
      },
      resolve: {
        themes: function (ThemeModel) {
          return ThemeModel.query();
        }
      }
    }).state('admin.themes.list', {
      url: '',
      views: {
        '@admin.themes': {
          templateUrl: adminThemeConfig.templates.themeList,
          controller: 'AdminThemeListController',
          controllerAs: '$ctrl'
        }
      },
      redirectTo: function (transition) {
        return transition.injector().getAsync('themes').then(function (themes) {
          if (themes.length === 1) {
            return {state: 'admin.themes.edit', params: {id: themes[0].id}};
          }
          return null;
        });
      }
    }).state('admin.themes.create', {
      url: '/create',
      views: {
        '@admin.themes': {
          templateUrl: adminThemeConfig.templates.themeDetails,
          controller: 'AdminThemeDetailsController',
          controllerAs: '$ctrl'
        }
      },
      resolve: {
        backendUrl: function (backendUrlService) {
          return backendUrlService.getUrl();
        },
        currentUser: function (authService) {
          return authService.getUser();
        },
        theme: function (ThemeModel, currentUser) {
          return new ThemeModel({
            active: true,
            userIds: [currentUser.id],
            userGroupIds: []
          });
        }
      }
    }).state('admin.themes.edit', {
      url: '/edit/{id}',
      views: {
        '@admin.themes': {
          templateUrl: adminThemeConfig.templates.themeDetails,
          controller: 'AdminThemeDetailsController',
          controllerAs: '$ctrl'
        }
      },
      resolve: {
        backendUrl: function (backendUrlService) {
          return backendUrlService.getUrl();
        },
        theme: function (ThemeModel, $stateParams) {
          return ThemeModel.get($stateParams.id);
        }
      }
    });
  }

})(angular);
