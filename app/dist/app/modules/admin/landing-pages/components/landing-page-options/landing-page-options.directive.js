(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.landingPages')
      .directive('oyocLandingPageOptions', landingPageOptions);

  /**
   * @ngdoc directive
   * @name coyo.admin.landingPages.oyocLandingPageOptions:oyocLandingPageOptions
   * @restrict 'E'
   *
   * @description
   * Context menu options for landing page list.
   *
   * @param {object} actions actions
   * @param {object} page page
   */
  function landingPageOptions() {
    return {
      restrict: 'E',
      templateUrl: 'app/modules/admin/landing-pages/components/landing-page-options/landing-page-options.html',
      scope: {},
      bindToController: {
        actions: '<',
        page: '<'
      },
      controller: function () {},
      controllerAs: '$ctrl'
    };
  }

})(angular);
