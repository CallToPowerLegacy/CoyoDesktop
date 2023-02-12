(function (angular) {
  'use strict';

  angular
      .module('commons.auth')
      .config(httpRequestInterceptor);

  /**
   * @ngdoc object
   * @name commons.auth.httpRequestInterceptor
   *
   * @description
   * HTTP traffic interceptor for intercepting every request and prepending the backend URL. Also enriches requests
   * with a CSRF token.
   *
   * @requires $provide
   * @requires $httpProvider
   * @requires $injector
   * @requires $log
   * @requires $q
   * @requires commons.resource.backendUrlService
   */
  function httpRequestInterceptor($provide, $httpProvider) {

    function _httpRequestInterceptor($injector, $log, $q, backendUrlService, $localStorage, utilService) {

      var canceller = $q.defer();

      var csrfService, authService, $state;

      return {
        request: request,
        requestError: requestError,
        response: response,
        responseError: responseError
      };

      /**
       * @ngdoc method
       * @name commons.auth.httpRequestInterceptor#request
       * @methodOf commons.auth.httpRequestInterceptor
       *
       * @description
       * Request handler.
       *
       * Called before every request made with angular.
       *
       * @param {object} config The $http configuration
       * @returns {object} The configuration
       */
      function request(config) {
        if (config.url.indexOf('/web') === 0) {
          if (!backendUrlService.isSet()) {
            $log.error('Aborting XHR backend request to "' + config.url + '" because no backend URL is defined.');

            config.timeout = canceller.promise;
            canceller.resolve();
          } else {
            // Prepend backend URL
            config.originalUrl = config.url;
            config.url = backendUrlService.getUrl() + config.url;

            if (!$localStorage.clientId) {
              $localStorage.clientId = utilService.uuid();
            }
            config.headers = config.headers || {};
            config.headers['X-Coyo-Client-ID'] = $localStorage.clientId;

            // Add CSRF token for non 'GET' requests
            if (config.method !== 'GET') {
              if (angular.isUndefined(csrfService)) {
                csrfService = $injector.get('csrfService');
              }

              var deferred = $q.defer();

              csrfService.getToken().then(function (token) {
                config.headers[$httpProvider.defaults.xsrfHeaderName] = token;
                deferred.resolve(config);
              }).catch(function (error) {
                var buttons = backendUrlService.isConfigurable() ? ['RETRY', 'CONFIGURE_BACKEND'] : ['RETRY'];
                var $translate = $injector.get('$translate');
                var errorService = $injector.get('errorService');
                $translate('ERRORS.CSRF_TOKEN.FAILED_OBTAINING').then(function (translation) {
                  errorService.showErrorPage(translation, null, buttons);
                });
                deferred.reject(error);
              });

              return deferred.promise;
            }
          }
        }
        return config;
      }

      /**
       * @ngdoc method
       * @name commons.auth.httpRequestInterceptor#requestError
       * @methodOf commons.auth.httpRequestInterceptor
       *
       * @description
       * Request error handler.
       *
       * @param {object} response The response
       * @returns {object} The rejected response
       */
      function requestError(response) {
        return $q.reject(response);
      }

      /**
       * @ngdoc method
       * @name commons.auth.httpRequestInterceptor#response
       * @methodOf commons.auth.httpRequestInterceptor
       *
       * @description
       * Response handler.
       *
       * @param {object} response The response
       * @returns {object} The response
       */
      function response(response) {
        return $q.resolve(response);
      }

      /**
       * @ngdoc method
       * @name commons.auth.httpRequestInterceptor#responseError
       * @methodOf commons.auth.httpRequestInterceptor
       *
       * @description
       * Response error handler.
       *
       * @param {object} response The rejected response
       * @returns {object} The rejected response
       */
      function responseError(response) {
        // Check for invalid authentication
        if (response.status === 401) {
          if (angular.isUndefined(authService)) {
            authService = $injector.get('authService');
          }
          if (angular.isUndefined($state)) {
            $state = $injector.get('$state');
          }

          if (authService.isAuthenticated()) {
            authService.clearSession().then(function () {
              $state.go('front.login');
            });
          }
        }

        return $q.reject(response);
      }
    }

    $provide.factory('httpRequestInterceptor', _httpRequestInterceptor);
    $httpProvider.interceptors.push('httpRequestInterceptor');
  }

})(angular);
