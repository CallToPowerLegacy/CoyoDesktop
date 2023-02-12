(function () {
  'use strict';

  angular
      .module('commons.mobile')
      .factory('deviceRegistrationHandler', deviceRegistrationHandler);

  /**
   * This handler adds a push device with with device information from native app.
   */
  function deviceRegistrationHandler($rootScope, $log, $injector) {

    var authService;

    return {
      registerPushDevice: registerPushDevice
    };

    /**
     * Takes a UserPushDevice and adds it to the user.
     *
     * Example:
     * { "method": "deviceRegistration",
     *   "argument": {
     *     "device": {
     *       "active": true,
     *       "token": "unique-firebase-device-token",
     *       "name": "Roberts iPhone",
     *       "type": "SMARTPHONE"
     *     }
     *   }
     * }
     *
     * @param {object} argument the request object
     */
    function registerPushDevice(argument) {
      if (!argument || !argument.device) {
        $log.error('[deviceRegistrationHandler] The device property is missing or invalid.');
      } else {
        authService = $injector.get('authService');
        _awaitLoginAndRegisterDevice(argument.device);
      }
    }

    function _awaitLoginAndRegisterDevice(device) {
      if (authService.isAuthenticated) {
        _registerPushDeviceForCurrentUser(device);
      } else {
        $rootScope.$on('authService:login:success', function () {
          _registerPushDeviceForCurrentUser(device);
        });
      }
    }

    function _registerPushDeviceForCurrentUser(device) {
      authService.getUser().then(function (currentUser) {
        currentUser.addPushDevice(device).then(_handleRegistrationSuccess).catch(_handleRegistrationError);
      });
    }

    function _handleRegistrationSuccess() {
      $log.info('[deviceRegistrationHandler] The new device has successfully been added to the current user.');
    }

    function _handleRegistrationError(error) {
      if (error.errorStatus === 'INVALID_ARGUMENTS') {
        $log.error('[deviceRegistrationHandler] One or more device properties are missing. Please check the'
          + ' docs for expected device information.');
      }
    }
  }
})();
