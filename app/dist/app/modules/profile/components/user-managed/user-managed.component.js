(function () {
  'use strict';

  angular
      .module('coyo.profile')
      .component('oyocUserManaged', userManaged())
      .controller('UserManagedController', UserManagedController);

  /**
   * @ngdoc directive
   * @name coyo.profile.oyocUserManaged:oyocUserManaged
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Shows a list of users that the given user is the manager of. If the given user does not manage any other users,
   * the list is hidden.
   *
   * @param {object} user
   * The user to display the depending managed users for. Must not be null nor undefined.
   *
   * @param {array=[]}
   * Array of managed users displayed by this component. Note that this array changes when the user pages through the
   * list. This can be used to check whether the list has any content. Should be an empty array when the component is
   * called.
   *
   * @requires commons.resource.Pageable
   */
  function userManaged() {
    return {
      templateUrl: 'app/modules/profile/components/user-managed/user-managed.html',
      bindings: {
        user: '<',
        managedUsers: '='
      },
      controller: 'UserManagedController'
    };
  }

  function UserManagedController(Pageable) {
    var vm = this;
    vm.loading = false;
    vm.managedUsers = vm.managedUsers || [];

    vm.$onInit = init;
    vm.loadMore = loadMore;

    function init() {
      loadMore();
    }

    function loadMore() {
      if (!vm.currentPage || !vm.currentPage.last) {
        vm.loading = true;

        var pageable = new Pageable((vm.currentPage ? vm.currentPage.number + 1 : 0), 10, 'firstname,asc');
        vm.user.getManaged(pageable).then(function (response) {
          vm.managedUsers = vm.managedUsers.concat(response.content);
          vm.currentPage = response;
        }).finally(function () {
          vm.loading = false;
        });
      }
    }

  }

})();
