(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.widgets.api
   *
   * @description
   * This module provides an API for managing, registering and displaying widgets.
   */
  angular
      .module('coyo.widgets.api', [
        'coyo.base',
        'coyo.domain',
        'commons.error'
      ]);

})(angular);
