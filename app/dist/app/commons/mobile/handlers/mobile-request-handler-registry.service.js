(function () {
  'use strict';

  angular
      .module('commons.mobile')
      .factory('mobileRequestHandlerRegistry', mobileRequestHandlerRegistry);

  /**
   * Registration for mobile app request handlers.
   */
  function mobileRequestHandlerRegistry(mobileStorageHandler, deviceRegistrationHandler) {

    var handlers = {
      'setValue': mobileStorageHandler.setStorageValue,
      'getValue': mobileStorageHandler.getStorageValue,
      'deviceRegistration': deviceRegistrationHandler.registerPushDevice
    };

    return {
      getHandler: function (handlerName) {
        return handlers[handlerName];
      }
    };
  }
})();
