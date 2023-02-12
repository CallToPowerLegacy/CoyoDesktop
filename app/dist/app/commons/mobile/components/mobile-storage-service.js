(function () {
  'use strict';

  angular
      .module('commons.mobile')
      .factory('mobileStorageService', mobileStorageService);

  /**
   * This service is used to persist data from mobile applications. It's simply extending the
   * $localStorage service by handling with prefixes for those values to prevent them from overriding
   * web application data.
   *
   * @required $localStorage
   */
  function mobileStorageService(mobileServiceConfig, $localStorage) {

    return {
      set: setValue,
      get: getValue
    };

    function setValue(key, value) {
      $localStorage[_prefix(key)] = value;
    }

    function getValue(key, defaultValue) {
      return $localStorage[_prefix(key)] || defaultValue || null;
    }

    function _prefix(key) {
      return mobileServiceConfig.storageKeyPrefix + key;
    }
  }
})();
