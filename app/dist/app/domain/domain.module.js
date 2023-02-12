(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.domain
   *
   * @description
   * # Domain module #
   * The domain module contains the Coyo domain objects.
   */
  angular
      .module('coyo.domain', [
        'coyo.base',
        'commons.config',
        'commons.resource'
      ]);

})(angular);
