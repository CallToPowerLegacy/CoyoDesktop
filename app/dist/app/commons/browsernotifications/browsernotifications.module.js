(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name commons.browsernotifications
   *
   * @description
   * # Browser notifications module #
   * The browser notifications module contains
   * 1. Information about browser notifications such as
   *   - Are browser notifications available in the current browser?
   *   - Are browser notifications currently used?
   *   - Has the user granted/denied permissions for browser notifications?
   * and
   * 2. Utility functions for accessing browser notifications.
   * 3. Utilities to notify the user via the browser about new interactions
   */
  angular
      .module('commons.browsernotifications', [
        'coyo.base',
        'commons.auth',
        'commons.target',
        'commons.resource',
        'coyo.domain',
        'commons.markdown'
      ]);

})(angular);
