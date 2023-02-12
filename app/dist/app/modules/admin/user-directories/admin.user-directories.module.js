(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.userDirectories', [
        'coyo.base',
        'coyo.domain',
        'coyo.admin.userDirectories.ldap'
      ])
      .config(ModuleConfig)
      .constant('adminUserDirectoriesConfig', {
        templates: {
          list: 'app/modules/admin/user-directories/views/user-directories-list/admin.user-directories-list.html',
          details: 'app/modules/admin/user-directories/views/user-directories-details/admin.user-directories-details.html'
        }
      });

  /**
   * Module configuration
   */
  function ModuleConfig($stateProvider, adminUserDirectoriesConfig) {
    $stateProvider.state('admin.user-directories', {
      abstract: true,
      url: '/user-directories',
      template: '<ui-view></ui-view>',
      data: {
        globalPermissions: 'MANAGE_USER_DIRECTORIES',
        pageTitle: 'ADMIN.MENU.USER_DIRECTORIES'
      }
    }).state('admin.user-directories.list', {
      url: '',
      views: {
        '@admin.user-directories': {
          templateUrl: adminUserDirectoriesConfig.templates.list,
          controller: 'AdminUserDirectoriesListController',
          controllerAs: '$ctrl'
        }
      }
    }).state('admin.user-directories.create', {
      url: '/create',
      views: {
        '@admin.user-directories': {
          templateUrl: adminUserDirectoriesConfig.templates.details,
          controller: 'AdminUserDirectoriesDetailsController',
          controllerAs: '$ctrl'
        }
      },
      resolve: {
        userDirectory: function (UserDirectoryModel) {
          return new UserDirectoryModel();
        }
      }
    }).state('admin.user-directories.edit', {
      url: '/edit/{id}',
      views: {
        '@admin.user-directories': {
          templateUrl: adminUserDirectoriesConfig.templates.details,
          controller: 'AdminUserDirectoriesDetailsController',
          controllerAs: '$ctrl'
        }
      },
      resolve: {
        userDirectory: function (UserDirectoryModel, $stateParams) {
          return UserDirectoryModel.get($stateParams.id);
        }
      }
    });
  }
})(angular);
