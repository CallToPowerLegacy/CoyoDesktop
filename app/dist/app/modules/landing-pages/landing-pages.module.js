(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.landing-pages
   *
   * @description
   * # Landing page module #
   * The landing page module contains the landing page objects.
   */
  angular
      .module('coyo.landing-pages', [
        'coyo.base',
        'commons.auth'
      ])
      .config(ModuleConfig);

  /**
   * Module configuration
   */
  function ModuleConfig($stateProvider) {
    $stateProvider.state('main.landing-page', {
      url: '/home',
      templateUrl: 'app/modules/landing-pages/views/landing-pages.html',
      controller: 'LandingPagesController',
      controllerAs: '$ctrl',
      data: {
        guide: 'home',
        globalPermissions: 'ACCESS_LANDING_PAGES'
      },
      params: {
        refreshLandingPages: null
      },
      resolve: {
        landingPages: function (landingPages, $stateParams, LandingPageModel) {
          if ($stateParams.refreshLandingPages) {
            return LandingPageModel.queryWithPermissions({all: true}, {}, ['manage', 'manageSlots']);
          }
          return landingPages;
        }
      },
      redirectTo: function (transition) {
        var resolvePromise = transition.injector().getAsync('landingPages');
        return resolvePromise.then(function (landingPages) {
          if (landingPages.length > 0 && transition.to().name === 'main.landing-page') {
            return {state: 'main.landing-page.show', params: {idOrSlug: landingPages[0].slug}, location: 'replace'};
          }
          return null;
        }, function () { return null; });
      }
    }).state('main.landing-page.show', {
      url: '/:idOrSlug',
      views: {
        '': {
          templateUrl: 'app/modules/landing-pages/views/landing-page.html',
          controller: 'LandingPageController',
          controllerAs: '$ctrl'
        }
      },
      data: {
        guide: 'home',
        senderParam: 'idOrSlug',
        pageTitle: false
      },
      resolve: {
        landingPage: function (landingPages, $stateParams) {
          var landingPage = _.find(landingPages, function (landingPage) {
            return landingPage.slug === $stateParams.idOrSlug || landingPage.id === $stateParams.idOrSlug;
          });
          if (!landingPage) {
            throw {status: 404, data: {errorStatus: 'NOT_FOUND'}};
          }
          return landingPage;
        },
        senderId: function (landingPage) {
          return landingPage.id;
        }
      },
      onEnter: function (landingPage, titleService) {
        titleService.set(landingPage.displayName, false);
      }
    });
  }

})(angular);
