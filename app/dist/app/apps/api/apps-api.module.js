(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.apps.api
   *
   * @description
   * This module provides an API for managing, registering and displaying apps.
   */
  angular
      .module('coyo.apps.api', [
        'coyo.base',
        'commons.config',
        'commons.resource'
      ]);

})(angular);
