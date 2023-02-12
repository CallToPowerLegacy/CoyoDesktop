(function () {
  'use strict';

  angular
      .module('coyo.apps.list.fields')
      .component('userFieldUserList', userFieldUserList())
      .controller('userFieldListController', userFieldListController);

  function userFieldUserList() {
    return {
      templateUrl: 'app/apps/list/fields/form/user-field-user-list.html',
      require: {
        'ngModel': '^ngModel'
      },
      controller: 'userFieldListController'
    };
  }

  function userFieldListController($scope, UserModel) {
    var vm = this;

    $scope.$watch(function () {
      return vm.ngModel.$viewValue && vm.ngModel.$viewValue.value;
    }, function (newValue) {
      if (newValue && !_.isEmpty(newValue)) {
        UserModel.query({userIds: newValue.join()}).then(function (result) {
          vm.users = result;
        });
      } else {
        vm.users = [];
      }
    }, true);

  }
})();
