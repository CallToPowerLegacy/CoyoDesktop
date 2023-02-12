(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.userDirectories')
      .controller('AdminUserDirectoriesDetailsController', AdminUserDirectoriesDetailsController);

  function AdminUserDirectoriesDetailsController($state, userDirectory, errorService) {
    var vm = this;
    vm.userDirectory = userDirectory;
    vm.validationErrors = {};

    vm.save = save;

    function save() {
      vm.validationErrors = {};
      return vm.userDirectory.save().then(function () {
        $state.go('^.list');
      }).catch(function (errorResponse) {
        if (errorResponse.status === 400) {
          vm.validationErrors = errorService.getValidationErrors(errorResponse);
        }
      });
    }
  }
})(angular);
