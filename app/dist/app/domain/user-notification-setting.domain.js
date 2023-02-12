(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('UserNotificationSettingModel', UserNotificationSettingModel);

  /**
   * @ngdoc service
   * @name coyo.domain.UserNotificationSettingModel
   *
   * @description
   * Provides the Coyo user notification setting model.
   *
   * @requires restResourceFactory
   * @requires commons.config.coyoEndpoints
   */
  function UserNotificationSettingModel(restResourceFactory, coyoEndpoints) {
    var UserNotificationSetting = restResourceFactory({
      url: coyoEndpoints.user.notificationSettings
    });

    return UserNotificationSetting;
  }

})(angular);
