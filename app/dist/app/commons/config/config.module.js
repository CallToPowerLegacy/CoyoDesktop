(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name commons.config
   *
   * @description
   * # Configuration module #
   * The configuration module contains the main Coyo configuration and the definition of the endpoints.
   *
   * The following constants are available:
   * * commons.config.coyoEndpoints
   * * commons.config.coyoConfig
   */
  angular
      .module('commons.config', [
        'coyo.base'
      ])
      .run(infoLog);

  function infoLog($log, coyoConfig) {
    $log.info('Running version:', coyoConfig.version);
  }
})(angular);
