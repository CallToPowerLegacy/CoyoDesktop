(function (angular) {
  'use strict';

  angular
      .module('coyo.profile')
      .component('oyocUserSuperior', userSuperior())
      .controller('UserSuperiorController', UserSuperiorController);

  /**
   * @ngdoc directive
   * @name coyo.profile.coyoUserSuperior:coyoUserSuperior
   * @restrict 'E'
   * @element OWN
   * @scope
   *
   * @description
   * Displays the superior of the given user.
   *
   * @param {object} user
   * the user to render the superior for
   *
   * @requires coyo.domain.UserModel
   */
  function userSuperior() {
    return {
      templateUrl: 'app/modules/profile/components/user-superior/user-superior.html',
      bindings: {
        managerId: '<'
      },
      controller: 'UserSuperiorController'
    };
  }

  function UserSuperiorController(UserModel) {
    var vm = this;

    vm.$onInit = init;

    function init() {
      if (!_.isEmpty(vm.managerId)) {
        UserModel.get(vm.managerId).then(function (superior) {
          vm.superior = superior;
        });
      }
    }
  }

})(angular);
