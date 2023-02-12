(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name commons.layout
   *
   * @description
   * # Layout module #
   * The layout module provides layouts for the most common use cases, e.g.
   * * the loading curtain,
   * * the admin navigation and sidebar,
   * * the main navigation and sidebar.
   */
  angular
      .module('commons.layout', [
        'coyo.base',
        'commons.ui',
        'commons.startup',
        'commons.terms',
        'coyo.notifications'
      ]);

})(angular);
