(function () {
  'use strict';

  angular
      .module('commons.ui')
      .directive('oyocModeratorNavbarItem', moderatorNavbarItem)
      .controller('ModeratorNavbarItemController', ModeratorNavbarItemController);

  /**
   * @ngdoc directive
   * @name commons.ui.moderatorNavbarItem:moderatorNavbarItem
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Displays a navigation item for users (with moderator permission) to toggle the moderator mode on or off. Note that
   * enabling or disabling the moderator mode causes a full page reload to happen.
   *
   * @param {object} user
   * The user to toggle the moderator mode for.
   *
   * @requires $window
   *
   */
  function moderatorNavbarItem() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/commons/ui/components/moderator-navbar-item/moderator-navbar-item.html',
      scope: {},
      bindToController: {
        user: '<'
      },
      controller: 'ModeratorNavbarItemController',
      controllerAs: '$ctrl'
    };
  }

  function ModeratorNavbarItemController($window) {
    var vm = this;

    vm.toggleModeratorMode = toggleModeratorMode;

    function toggleModeratorMode() {
      vm.user.setModeratorMode(!vm.user.moderatorMode).then(function () {
        $window.location.reload();
      });
    }
  }
})();
