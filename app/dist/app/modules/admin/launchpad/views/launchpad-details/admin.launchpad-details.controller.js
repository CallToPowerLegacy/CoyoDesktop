(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.launchpad')
      .controller('AdminLaunchpadDetailsController', AdminLaunchpadDetailsController);

  function AdminLaunchpadDetailsController($state, category) {
    var vm = this;

    vm.category = category;

    vm.save = save;

    function save() {
      vm.category.save().then(function () {
        $state.go('^.list');
      });
    }
  }

})(angular);
