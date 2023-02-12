(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.messaging
   *
   * @description
   * # Messaging module #
   * The messaging module contains everything messaging-related.
   */
  angular
      .module('coyo.messaging', [
        'commons.auth',
        'commons.browsernotifications',
        'coyo.profile',
        'coyo.base'
      ]);

})(angular);
