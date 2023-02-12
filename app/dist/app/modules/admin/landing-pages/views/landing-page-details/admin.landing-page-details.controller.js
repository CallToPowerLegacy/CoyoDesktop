(function (angular) {
  'use strict';

  angular.module('coyo.admin.landingPages')
      .controller('AdminLandingPageDetailsController', AdminLandingPageDetailsController);

  function AdminLandingPageDetailsController($state, landingPage) {
    var vm = this;

    vm.oldSlug = landingPage.slug;
    vm.baseUrl = $state.href('main.landing-page', {}) + '/';
    vm.landingPage = landingPage;
    vm.showAdvanced = vm.landingPage.configuredUrl;

    vm.save = save;

    function save() {
      vm.landingPage.save().then(function () {
        $state.go('^.list');
      });
    }
  }

})(angular);
