(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name commons.sockets
   *
   * @description
   * WebSockets module.
   */

  // eslint-disable-next-line angular/service-name
  angular
      .module('commons.sockets', [
        'commons.auth',
        'coyo.base'
      ])
      .constant('Stomp', Stomp) // eslint-disable-line no-undef
      .constant('SockJS', SockJS); // eslint-disable-line no-undef

})(angular);
