(function (angular) {
  'use strict';

  angular
      .module('commons.error', [
        'coyo.base',
        'commons.config',
        'commons.auth',
        'commons.resource',
        'commons.startup'
      ])
      .config(errorInterceptor)
      .config(errorStates);

  /**
   * @ngdoc overview
   * @name commons.error.config:errorInterceptor
   *
   * @description
   * Intercepts errors and checks for the error status code.
   * Displays a graphical message if a status code has been found.
   *
   * The display of the notification can be suppressed by adding a property to the httpConfig used for the request.
   * * `config.autoHandleErrors = false` will suppress all notifications
   * * 'config.autoHandleErrors = { excludeHttpCodes: [codes] }` will suppress notifications for the given http response codes.
   * * 'config.autoHandleErrors = { excludeCodes: [codes] }` will suppress notifications for the given coyo error response codes.
   *
   * To prevent the error notification from being displayed simply call errorService.suppressNotification(errorResponse)
   * in a catch block on the offending http call.
   *
   * @requires $httpProvider
   * @requires $q
   * @requires $injector
   * @requires $timeout
   * @requires commons.error.errorService
   * @requires commons.ui.coyoNotification
   * @constructor
   */
  function errorInterceptor($httpProvider) {
    $httpProvider.interceptors.push(function ($q, $injector, $timeout) {
      var errorInterceptor = {
        errorThrottle: {},
        responseError: function (errorResponse) {
          var errorService = $injector.get('errorService');
          var $state = $injector.get('$state');
          var authService = $injector.get('authService');

          if (errorResponse.status === 401) { // UNAUTHORIZED
            return $q.reject(errorResponse);
          } else if (errorResponse.status === 503) { // SYSTEM UNAVAILABLE
            errorService.suppressNotification(errorResponse);
            return _handleMaintenanceMode(authService, errorResponse, $state, $q);
          }

          if (_.get(errorResponse, 'config.autoHandleErrors', true) === false) {
            return $q.reject(errorResponse);
          }

          $injector.get('$log').error('[ErrorInterceptor] Error in server communication', errorResponse);

          var excludeHttpCodes = _.get(errorResponse, 'config.autoHandleErrors.excludeHttpCodes', []);
          if (excludeHttpCodes.indexOf(errorResponse.status) >= 0) {
            return $q.reject(errorResponse);
          }

          var excludeCodes;
          if (errorResponse.config && errorResponse.config.autoHandleErrors) {
            excludeCodes = errorResponse.config.autoHandleErrors.excludeCodes;
          }
          var statusCode = _.get(errorResponse, 'data.errorStatus.errorCode', 'UNKNOWN');
          var ignoreStatus = angular.isArray(excludeCodes) && excludeCodes.indexOf(statusCode) >= 0;
          if (ignoreStatus) {
            return $q.reject(errorResponse);
          }

          $timeout(function () { // allow catch handlers to suppress the notification
            var errorService = $injector.get('errorService');
            if (!errorService.isNotificationSuppressed(errorResponse)) {
              errorService.getMessage(errorResponse).then(function (translation) {
                if (!_handleInvalidTenant(errorResponse, translation, $injector)) {
                  var now = new Date().getTime();
                  errorInterceptor.errorThrottle = _.pickBy(errorInterceptor.errorThrottle, function (time) {
                    return time > now - 2500; // remove old error timestamps (older 2.5sec)
                  });
                  var hash = _hashCode(translation);
                  if (!errorInterceptor.errorThrottle[hash]) {
                    errorInterceptor.errorThrottle[hash] = now;
                    $injector.get('coyoNotification').error(translation, false);
                  }
                }
              });
            }
          });
          return $q.reject(errorResponse);
        }
      };

      return errorInterceptor;
    });

    /**
     * Special handling when the response indicated that a maintenance mode is active.
     * In case the maintenance mode is set globally also the admins that can manage maintenance cannot login anymore.
     * If the maintenance mode is not global the tenant's admins can login to edit maintenance mode.
     *
     * @private
     */
    function _handleMaintenanceMode(authService, errorResponse, $state, $q) {
      var status = _.get(errorResponse, 'data.errorStatus');
      var deferred = $q.defer();
      if (status === 'GLOBAL_MAINTENANCE') {
        $state.go('front.maintenance', {'global': true}, {
          location: false
        });
        deferred.reject(errorResponse);
      } else {
        authService.getUser().then(function (currentUser) {
          if (!currentUser.hasGlobalPermissions('MANAGE_MAINTENANCE')) {
            $state.go('front.maintenance', {'global': false}, {location: false});
          }
          deferred.reject(errorResponse);
        }).catch(function () {
          if ($state.current.name !== 'front.login') {
            $state.go('front.login');
          }
          deferred.reject(errorResponse);
        });
      }
      return deferred.promise;
    }

    /**
     * Special handling when the response indicated the tenant is invalid or inactive.
     * In that case that it is invalid we always redirect to the error page and offer options to configure the url
     * (if configurable). If it is inactive we show the error message with a link to the customer center.
     *
     * @private
     */
    function _handleInvalidTenant(errorResponse, message, $injector) {
      var status = _.get(errorResponse, 'data.errorStatus');
      if (status !== 'INVALID_TENANT' && status !== 'INACTIVE_TENANT') {
        return false;
      }

      var buttons = [];
      if (status === 'INVALID_TENANT') {
        var backendUrlService = $injector.get('backendUrlService');
        if (backendUrlService.isConfigurable()) {
          buttons.push('CONFIGURE_BACKEND');
        } else {
          buttons.push('RETRY');
        }
      } else if (status === 'INACTIVE_TENANT') {
        buttons.push('CUSTOMER_CENTER');
      }

      $injector.get('errorService').showErrorPage(message, errorResponse.status, buttons);
      return true;
    }
  }

  /**
   * @ngdoc overview
   * @name commons.error.config:errorStates
   *
   * @description
   * Registers a state for displaying error messages and directs invalid frontend routes to that state.
   *
   * @requires $stateProvider
   * @requires $urlRouterProvider
   */
  function errorStates($stateProvider, $urlRouterProvider) {
    $stateProvider.state('error', {
      url: '/error',
      data: {
        authenticate: false,
        pageTitle: 'ERRORS.TITLE'
      },
      templateUrl: 'app/commons/error/views/error.html',
      params: {message: null, status: null, buttons: null},
      controller: 'ErrorController',
      controllerAs: '$ctrl',
      onEnter: function (curtainService) {
        curtainService.hide();
      }
    });

    $urlRouterProvider.otherwise(function ($injector, $location) {
      // special handling for loading from local file url (e.g. in mobile wrapper) where no default route is found
      if (_.endsWith($location.path(), '.html')) {
        $injector.get('$state').go('main');
        return;
      }

      var errorService = $injector.get('errorService');
      var $translate = $injector.get('$translate');
      $translate('ERRORS.NOT_FOUND').then(function (translation) {
        errorService.showErrorPage(translation, 404);
      });
    });
  }

  /* Source: http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery */
  function _hashCode(string) {
    var hash = 0, i, chr;
    if (string.length === 0) {
      return hash;
    }
    for (i = 0; i < string.length; i++) {
      chr = string.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

})(angular);
