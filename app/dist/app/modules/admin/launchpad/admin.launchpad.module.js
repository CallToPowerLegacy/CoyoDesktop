(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.admin.launchpad
   *
   * @description
   * # Admin launchpad management module #
   * The admin launchpad management module provides views to manage launchpad categories.
   */
  angular
      .module('coyo.admin.launchpad', [
        'coyo.base',
        'commons.auth',
        'coyo.domain'
      ])
      .config(ModuleConfig)
      .constant('adminLaunchpadConfig', {
        templates: {
          launchpadList: 'app/modules/admin/launchpad/views/launchpad-list/admin.launchpad-list.html',
          launchpadDetails: 'app/modules/admin/launchpad/views/launchpad-details/admin.launchpad-details.html'
        }
      });

  /**
   * Module configuration
   */
  function ModuleConfig($stateProvider, adminLaunchpadConfig) {
    $stateProvider.state('admin.launchpad', {
      abstract: true,
      url: '/launchpad',
      template: '<ui-view></ui-view>',
      data: {
        globalPermissions: 'MANAGE_LAUNCHPAD',
        pageTitle: 'ADMIN.MENU.LAUNCHPAD'
      }
    }).state('admin.launchpad.list', {
      url: '',
      views: {
        '@admin.launchpad': {
          templateUrl: adminLaunchpadConfig.templates.launchpadList,
          controller: 'AdminLaunchpadListController',
          controllerAs: '$ctrl'
        }
      },
      resolve: {
        settings: function (SettingsModel) {
          return SettingsModel.retrieve();
        }
      }
    }).state('admin.launchpad.edit', {
      url: '/edit/{id}',
      views: {
        '@admin.launchpad': {
          templateUrl: adminLaunchpadConfig.templates.launchpadDetails,
          controller: 'AdminLaunchpadDetailsController',
          controllerAs: '$ctrl'
        }
      },
      resolve: {
        category: function (LaunchpadCategoryModel, $stateParams) {
          return LaunchpadCategoryModel.get($stateParams.id);
        }
      }
    }).state('admin.launchpad.create', {
      url: '/create',
      views: {
        '@admin.launchpad': {
          templateUrl: adminLaunchpadConfig.templates.launchpadDetails,
          controller: 'AdminLaunchpadDetailsController',
          controllerAs: '$ctrl'
        }
      },
      resolve: {
        currentUser: function (authService) {
          return authService.getUser();
        },
        category: function (LaunchpadCategoryModel, currentUser) {
          return new LaunchpadCategoryModel({
            adminIds: [currentUser.id],
            groupIds: []
          });
        }
      }
    });
  }

})(angular);
