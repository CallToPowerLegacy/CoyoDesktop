(function (angular) {
  'use strict';

  angular
      .module('coyo.landing-pages')
      .controller('LandingPageController', LandingPageController);

  function LandingPageController($scope, landingPages, landingPage, widgetLayoutService) {
    var vm = this;

    vm.landingPages = landingPages;
    vm.landingPage = landingPage;

    vm.edit = edit;
    vm.save = save;
    vm.cancel = cancel;

    function edit() {
      widgetLayoutService.edit($scope);
      vm.editMode = true;
    }

    function save() {
      widgetLayoutService.save($scope).then(function () {
        vm.editMode = false;
      });
    }

    function cancel() {
      widgetLayoutService.cancel($scope);
      vm.editMode = false;
    }
  }

})(angular);
