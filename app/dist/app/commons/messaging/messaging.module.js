(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name commons.messaging
   *
   * @description
   * # Messaging module #
   * The messaging module makes messaging functionality available to the entire coyo application.
   */
  angular
      .module('commons.messaging', [
        'commons.auth',
        'coyo.domain'
      ]);

})(angular);
