(function (angular) {
  'use strict';

  angular
      .module('commons.resource')
      .factory('setupService', setupService);

  /**
   * @ngdoc service
   * @name commons.resource.setupService
   *
   * @description
   * Service for getting and setting up the installation.
   *
   * @requires $http
   * @requires commons.config.coyoEndpoints
   */
  function setupService($http, coyoEndpoints) {

    return {
      check: check,
      setUp: setUp
    };

    /**
     * @ngdoc method
     * @name commons.resource.setupService#check
     * @methodOf commons.resource.setupService
     *
     * @description
     * Checks whether the setup has already been completed.
     *
     * @return {boolean} A boolean flag that indicates whether the setup has already been completed
     */
    function check() {
      return $http.get(coyoEndpoints.setup + '/check').then(function (obj) {
        return obj.data && obj.data.setUp;
      });
    }

    /**
     * @ngdoc method
     * @name commons.resource.setupService#setUp
     * @methodOf commons.resource.setupService
     *
     * @description
     * Completes the setup, sends information about the installation.
     *
     * @params {object}
     *  A setup model containing the network name, the administrative user information and demo data information
     * @return {object}
     *  An object containing the initially created administrative user and information about the installation
     */
    function setUp(model) {
      return $http.post(coyoEndpoints.setup, model);
    }
  }

})(angular);
