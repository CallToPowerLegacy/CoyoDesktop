(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.admin.landingPages
   *
   * @description
   * # Admin landing page management module #
   * The admin landing page management module provides views to manage landing pages.
   */
  angular
      .module('coyo.admin.landingPages', [
        'coyo.base',
        'commons.auth',
        'coyo.domain'
      ])
      .config(ModuleConfig)
      .constant('adminLandingPageConfig', {
        templates: {
          landingPageList: 'app/modules/admin/landing-pages/views/landing-page-list/admin.landing-page-list.html',
          landingPageDetails: 'app/modules/admin/landing-pages/views/landing-page-details/admin.landing-page-details.html'
        }
      });

  /**
   * Module configuration
   */
  function ModuleConfig($stateProvider, adminLandingPageConfig) {
    $stateProvider.state('admin.landing-pages', {
      abstract: true,
      url: '/landing-pages',
      template: '<ui-view></ui-view>',
      data: {
        globalPermissions: 'MANAGE_LANDING_PAGES',
        pageTitle: 'ADMIN.MENU.LANDING_PAGES'
      }
    }).state('admin.landing-pages.list', {
      url: '',
      views: {
        '@admin.landing-pages': {
          templateUrl: adminLandingPageConfig.templates.landingPageList,
          controller: 'AdminLandingPageListController',
          controllerAs: '$ctrl'
        }
      }
    }).state('admin.landing-pages.edit', {
      url: '/edit/{id}',
      views: {
        '@admin.landing-pages': {
          templateUrl: adminLandingPageConfig.templates.landingPageDetails,
          controller: 'AdminLandingPageDetailsController',
          controllerAs: '$ctrl'
        }
      },
      resolve: {
        landingPage: function (LandingPageModel, $stateParams) {
          return LandingPageModel.get($stateParams.id);
        }
      }
    }).state('admin.landing-pages.create', {
      url: '/create',
      views: {
        '@admin.landing-pages': {
          templateUrl: adminLandingPageConfig.templates.landingPageDetails,
          controller: 'AdminLandingPageDetailsController',
          controllerAs: '$ctrl'
        }
      },
      resolve: {
        currentUser: function (authService) {
          return authService.getUser();
        },
        landingPage: function (LandingPageModel, currentUser) {
          return new LandingPageModel({
            active: true,
            visibility: 'PUBLIC',
            adminIds: [currentUser.id],
            userIds: [currentUser.id],
            adminGroupIds: [],
            userGroupIds: []
          });
        }
      }
    });
  }

})(angular);
