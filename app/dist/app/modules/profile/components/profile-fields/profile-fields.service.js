(function (angular) {
  'use strict';

  angular
      .module('coyo.profile')
      .factory('profileFieldsService', profileFieldsService);

  /**
   * @ngdoc service
   * @name coyo.profile.profileFieldsService
   *
   * @description
   * Retrieves user profile field information.
   *
   * @requires $http
   * @requires commons.config.coyoEndpoints
   */
  function profileFieldsService($http, coyoEndpoints, UserProfileGroupModel) {
    /**
     * @ngdoc method
     * @name coyo.profile.profileFieldsService#getGroups
     * @methodOf coyo.profile.profileFieldsService
     *
     * @description
     * Retrieves all user profile groups.
     *
     * @returns {promise} An http promise
     */
    var getGroups = function () {
      return UserProfileGroupModel.get();
    };

    return {
      getGroups: getGroups
    };
  }

})(angular);
