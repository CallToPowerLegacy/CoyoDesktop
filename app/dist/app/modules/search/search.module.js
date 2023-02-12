(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.search
   *
   * @description
   * # Search module #
   * The search module provides the search view and a service for search requests.
   *
   * @requires $stateProvider
   */
  angular
      .module('coyo.search', [
        'coyo.base',
        'coyo.profile',
        'commons.resource',
        'commons.auth',
        'commons.ui'
      ])
      .config(ModuleConfig)
      .constant('searchConfig', {
        templates: {
          search: 'app/modules/search/views/search.html'
        }
      });

  /**
   * Module configuration
   */
  function ModuleConfig($stateProvider, searchConfig) {
    $stateProvider.state('main.search', {
      url: '/search?:term&:type[]&:modified[]&:sender[]',
      templateUrl: searchConfig.templates.search,
      controller: 'SearchController',
      controllerAs: '$ctrl',
      data: {
        guide: 'search',
        pageTitle: 'MODULE.SEARCH.PAGE_TITLE'
      }
    });
  }

})(angular);
