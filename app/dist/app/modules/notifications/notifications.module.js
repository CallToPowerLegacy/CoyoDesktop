(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.notifications
   *
   * @description
   * # Notifications module #
   * The notifications module provides
   * * the notifications view,
   * * a directive to render notifications and
   * * a service that provides methods for handling notifications.
   */
  angular
      .module('coyo.notifications', [
        'coyo.base',
        'commons.config',
        'commons.browsernotifications',
        'commons.auth',
        'commons.startup'
      ]);

})(angular);
