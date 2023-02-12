(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('LandingPageModel', LandingPageModel);

  /**
   * @ngdoc service
   * @name coyo.domain.LandingPageModel
   *
   * @description
   * Domain model representing the landing page endpoint.
   *
   * @requires restResourceFactory
   * @requires commons.config.coyoEndpoints
   */
  function LandingPageModel(restResourceFactory, coyoEndpoints) {
    var LandingPage = restResourceFactory({
      url: coyoEndpoints.landingPage.landingPages
    });

    // class members
    angular.extend(LandingPage, {

      /**
       * @ngdoc function
       * @name coyo.domain.LandingPageModel#order
       * @methodOf coyo.domain.LandingPageModel
       *
       * @description
       * Sorts the list of landing pages based on the given order definition.
       *
       * @param {string[]} ids The list of landing page IDs.
       * @returns {promise} An $http promise
       */
      order: function (ids) {
        return LandingPage.$put(LandingPage.$url('action/order'), ids);
      }
    });

    return LandingPage;
  }

})(angular);
