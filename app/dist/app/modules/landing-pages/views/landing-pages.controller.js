(function (angular) {
  'use strict';

  angular
      .module('coyo.landing-pages')
      .controller('LandingPagesController', LandingPagesController);

  function LandingPagesController(landingPages) {
    var vm = this;

    vm.landingPages = landingPages;
  }

})(angular);
