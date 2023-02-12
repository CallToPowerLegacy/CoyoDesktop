(function (angular) {
  'use strict';

  angular
      .module('coyo.app')
      .controller('LayoutMainController', LayoutMainController);

  function LayoutMainController(landingPages) {
    var vm = this;

    vm.landingPages = landingPages;
  }

})(angular);
