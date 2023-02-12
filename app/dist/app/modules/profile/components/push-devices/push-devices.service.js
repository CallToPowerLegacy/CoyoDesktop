(function (angular) {
  'use strict';

  angular
      .module('coyo.profile')
      .factory('pushDevicesService', pushDevicesService);

  // TODO move to UserModel

  /**
   * @ngdoc service
   * @name coyo.profile.pushDevicesService
   *
   * @description
   * Retrieves push device information.
   *
   * @requires $http
   * @requires $log
   * @requires commons.config.coyoEndpoints
   */
  function pushDevicesService($http, coyoEndpoints) {

    return {
      getPushDevices: getPushDevices,
      togglePushDevice: togglePushDevice,
      deletePushDevice: deletePushDevice
    };

    /**
     * @ngdoc method
     * @name coyo.profile.pushDevicesService#getPushDevices
     * @methodOf coyo.profile.pushDevicesService
     *
     * @description
     * Retrieves push devices information of a user.
     *
     * @returns {promise} An http promise
     */
    function getPushDevices(user) {
      return $http({
        url: coyoEndpoints.user.pushDevices
            .replace('{id}', user.id),
        method: 'GET'
      }).then(function (response) {
        return response.data;
      });
    }

    /**
     * @ngdoc method
     * @name coyo.profile.pushDevicesService#togglePushDevice
     * @methodOf coyo.profile.pushDevicesService
     *
     * @description
     * Toggles the active state of a push device of a user.
     *
     * @returns {promise} An http promise
     */
    function togglePushDevice(user, pushDevice) {
      if (pushDevice.active) {
        return $http({
          url: coyoEndpoints.user.pushDeviceDeactivate
              .replace('{id}', user.id)
              .replace('{deviceid}', pushDevice.id),
          method: 'PUT'
        }).then(function (response) {
          return response.data;
        });
      } else {
        return $http({
          url: coyoEndpoints.user.pushDeviceActivate
              .replace('{id}', user.id)
              .replace('{deviceid}', pushDevice.id),
          method: 'PUT'
        }).then(function (response) {
          return response.data;
        });
      }
    }

    /**
     * @ngdoc method
     * @name coyo.profile.pushDevicesService#deletePushDevice
     * @methodOf coyo.profile.pushDevicesService
     *
     * @description
     * Toggles the active state of a push device of a user.
     *
     * @returns {promise} An http promise
     */
    function deletePushDevice(user, pushDevice) {
      return $http({
        url: coyoEndpoints.user.pushDeviceDelete
            .replace('{id}', user.id)
            .replace('{deviceid}', pushDevice.id),
        method: 'DELETE'
      }).then(function (response) {
        return response.data;
      });
    }
  }

})(angular);
