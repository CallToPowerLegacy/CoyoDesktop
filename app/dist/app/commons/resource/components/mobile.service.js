(function (angular) {
  'use strict';

  angular
      .module('commons.resource')
      .factory('mobileService', mobileService);

  /**
   * @ngdoc service
   * @name commons.resource.mobileService
   *
   * @description
   * Service for getting mobile information.
   * Checks for the cordova wrapper and tries to identify iOS and Android devices via its device plugin.
   * The following information is available afterwards:
   * info: {
   *  mobile  : true/false,
   *  ios     : true/false,
   *  android : true/false
   * }
   *
   * @requires $window
   */
  function mobileService($window) {

    var info = {
      mobile: angular.isDefined($window.cordova),
      ios: false,
      android: false
    };

    _intialize();

    return {
      getInfo: getInfo,
      isMobile: isMobile,
      isIOS: isIOS,
      isAndroid: isAndroid
    };

    /**
     * @ngdoc method
     * @name commons.resource.mobileService#getInfo
     * @methodOf commons.resource.mobileService
     *
     * @description
     * Gets the complete mobile information.
     */
    function getInfo() {
      return info;
    }

    /**
     * @ngdoc method
     * @name commons.resource.mobileService#isMobile
     * @methodOf commons.resource.mobileService
     *
     * @description
     * Gets the information whether the device is a mobile device.
     */
    function isMobile() {
      return info.mobile;
    }

    /**
     * @ngdoc method
     * @name commons.resource.mobileService#isIOS
     * @methodOf commons.resource.mobileService
     *
     * @description
     * Gets the information whether the device is an iOS device.
     */
    function isIOS() {
      return info.ios;
    }

    /**
     * @ngdoc method
     * @name commons.resource.mobileService#isAndroid
     * @methodOf commons.resource.mobileService
     *
     * @description
     * Gets the information whether the device is an Android device.
     */
    function isAndroid() {
      return info.android;
    }

    /***************************************************************************/

    function _intialize() {
      if (info.mobile) {
        var devicePlatform = _.get($window, 'device.platform', '').toLowerCase();
        info.ios = devicePlatform.indexOf('ios') !== -1;
        info.android = devicePlatform.indexOf('android') !== -1;
      }
    }
  }

})(angular);
