(function (angular) {
  'use strict';

  angular
      .module('commons.error')
      .factory('errorLogService', errorLogService)
      .provider('$exceptionHandler', {
        $get: function (errorLogService) {
          return errorLogService.log;
        }
      });

  function errorLogService($injector, $log, $window, coyoEndpoints) {
    var $http, $q, $timeout, authService;
    var throttle = -1;

    var errorCache = {};
    var errorPromise = null;

    return {
      init: init,
      log: log
    };

    function init() {
      $http = $injector.get('$http');
      $q = $injector.get('$q');
      $timeout = $injector.get('$timeout');
      authService = $injector.get('authService');

      $injector.get('SettingsModel').retrieveByKey('jsLogThrottle').then(function (jsLogThrottle) {
        throttle = _.toInteger(jsLogThrottle);
      });
    }

    function log(exception) {
      $log.error.apply($log, arguments);

      if (throttle < 0 || !authService.isAuthenticated()) {
        return;
      }

      try {
        _cache(exception).then(function () {
          if (!errorPromise) {
            errorPromise = $timeout(function () {
              $http({
                url: coyoEndpoints.log,
                method: 'POST',
                data: _.values(errorCache),
                autoHandleErrors: false
              });
              errorCache = {};
              errorPromise = null;
            }, throttle, false);
          }
        });
      } catch (logError) {
        $log.warn('Error logging failed', logError);
      }
    }

    function _cache(exception) {
      var errorUrl = $window.location.href;
      var errorName = exception.name;
      var errorMessage = exception.message;
      var errorKey = [errorUrl, errorName, errorMessage].join('::');

      if (errorCache[errorKey]) {
        return $q.resolve(errorCache[errorKey].timestamps.push(new Date().getTime()));
      } else {
        return StackTrace.fromError(exception).then(function (trace) {
          errorCache[errorKey] = {
            url: errorUrl,
            message: errorName + ': ' + errorMessage,
            stacktrace: _.map(trace, 'source'),
            timestamps: [new Date().getTime()]
          };
        });
      }
    }
  }

})(angular);
