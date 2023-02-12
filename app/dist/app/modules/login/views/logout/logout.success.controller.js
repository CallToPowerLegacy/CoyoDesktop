(function (angular) {
  'use strict';

  angular
      .module('coyo.login')
      .controller('LogoutSuccessController', LogoutSuccessController);

  function LogoutSuccessController(curtainService) {
    var vm = this;
    vm.$onInit = onInit;

    function onInit() {
      curtainService.hide();
    }
  }

})(angular);
