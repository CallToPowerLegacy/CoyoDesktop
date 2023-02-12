(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .controller('AboutCoyoController', AboutCoyoController);

  /**
   * @ngdoc service
   * @name commons.ui.AboutCoyoController
   *
   * @description
   * Renders about coyo.
   */
  function AboutCoyoController(coyoConfig) {
    var vm = this;
    var version = coyoConfig.version;
    vm.version = version.major + '.' + version.minor + '.' + version.patch + '-' + version.qualifier;
  }

})(angular);
