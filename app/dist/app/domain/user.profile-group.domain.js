(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('UserProfileGroupModel', UserProfileGroupModel);

  /**
   * @ngdoc service
   * @name coyo.domain.UserProfileGroupModel
   *
   * @description
   * Provides the COYO user profile group model.
   *
   * @requires $http
   * @requires restResourceFactory
   * @requires commons.config.coyoEndpoints
   */
  function UserProfileGroupModel($http, restResourceFactory, coyoEndpoints) {
    var UserProfileGroupModel = restResourceFactory({
      url: coyoEndpoints.user.profile.groups
    });

    return UserProfileGroupModel;
  }

})(angular);
