(function (angular) {
  'use strict';

  angular
      .module('commons.resource')
      .factory('versionCheckService', versionCheckService);

  /**
   * @ngdoc service
   * @name commons.resource.versionCheckService
   *
   * @description
   * Service for checking the Coyo version.
   *
   * @requires $http
   * @requires commons.config.coyoEndpoints
   * @requires commons.config.coyoConfig
   */
  function versionCheckService($http, coyoEndpoints, coyoConfig) {

    return {
      check: check
    };

    /**
     * @ngdoc method
     * @name commons.resource.versionCheckService#check
     * @methodOf commons.resource.versionCheckService
     *
     * @description
     * Calls the given URL, retrieves the Coyo version and checks it.
     *
     * Returned status codes are the following:
     *   1: Success
     *  -1: general error
     *  -2: major server version too old
     *   2: major server version too new
     *  -3: minor server version too old
     *   3: minor server version too new
     *
     * @param {string} url The backend URL.
     * @return {integer} A status code indicating the status of the call (see description for status code values).
     */
    function check(url) {
      var apiUrl = (_.endsWith(url, '/') ? url.substring(0, url.length - 1) : url) + coyoEndpoints.info;
      return $http({
        method: 'GET',
        url: apiUrl,
        autoHandleErrors: false,
        headers: {
          Authorization: ''
        }
      }).then(function (result) {
        if (!result || !result.data || !result.data.version || angular.isUndefined(result.data.version.major)
            || angular.isUndefined(result.data.version.minor)) {
          return -1;
        }

        // Match major version
        if (coyoConfig.version.major > result.data.version.major) {
          return -2;
        } else if (coyoConfig.version.major < result.data.version.major) {
          return 2;
        }

        // Match minor version
        if (coyoConfig.version.minor > result.data.version.minor) {
          return -3;
        } else if (coyoConfig.version.minor < result.data.version.minor) {
          return 3;
        }

        return 1;
      }).catch(function () {
        return -1;
      });
    }
  }

})(angular);
