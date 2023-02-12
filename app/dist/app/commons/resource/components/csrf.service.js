(function (angular) {
  'use strict';

  angular
      .module('commons.resource')
      .factory('csrfService', csrfService);

  /**
   * @ngdoc service
   * @name commons.resource.csrfService
   *
   * @description
   * Service for getting and setting the CSRF token.
   *
   * @requires $log
   * @requires $http
   * @requires $q
   * @requires $rootScope
   * @requires commons.config.coyoEndpoints
   */
  function csrfService($log, $http, $q, $rootScope, coyoEndpoints) {
    $rootScope.$on('authService:logout:success', clearToken);
    $rootScope.$on('authService:logout:failed', clearToken);
    $rootScope.$on('backendUrlService:url:updated', clearToken);
    $rootScope.$on('backendUrlService:url:cleared', clearToken);

    return {
      isSet: isSet,
      getToken: getToken,
      clearToken: clearToken
    };

    /**
     * @ngdoc method
     * @name commons.resource.csrfService#isSet
     * @methodOf commons.resource.csrfService
     *
     * @description
     * Checks if a CSRF token is set.
     */
    function isSet() {
      return angular.isDefined($rootScope.csrfToken) && $rootScope.csrfToken !== null;
    }

    /**
     * @ngdoc method
     * @name commons.resource.csrfService#getToken
     * @methodOf commons.resource.csrfService
     *
     * @description
     * Resolves the token in a promise. Loads a new token if none is available.
     *
     * @return {object} Promise that resolves to a token.
     */
    function getToken() {
      if (isSet()) {
        return $q.resolve($rootScope.csrfToken);
      } else {
        return $http.get(coyoEndpoints.csrf).then(function (response) {
          var token = response.data.token;
          $log.debug('[csrfService] Obtained CSRF token:', token);
          $rootScope.csrfToken = token;
          $rootScope.$emit('csrfService:token:updated');
          return $q.resolve(token);
        }).catch(function (error) {
          $log.error('[csrfService] Failed to obtain CSRF token.');
          return $q.reject(error);
        });
      }
    }

    /**
     * @ngdoc method
     * @name commons.resource.csrfService#clearToken
     * @methodOf commons.resource.csrfService
     *
     * @description
     * Clears the current CSRF token.
     */
    function clearToken() {
      $log.debug('[csrfService] Clearing CSRF token');
      delete $rootScope.csrfToken;
      $rootScope.$emit('csrfService:token:cleared');
    }
  }

})(angular);
