(function () {
  'use strict';

  angular
      .module('coyo.profile')
      .component('oyocProfileInfoSidebar', profileInfoSidebar())
      .controller('ProfileInfoSidebarController', ProfileInfoSidebarController);

  /**
   * @ngdoc directive
   * @name coyo.profile.oyocProfileInfoSidebar:oyocProfileInfoSidebar
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Internal directive to render the sidebar on the info tab of any user's profile page. The sidebar displays the
   * user's superior and other colleagues the user is the superior of. If none of this applies, the sidebar is hidden.
   *
   * @param {object} user
   * The user to render the sidebar for.
   */
  function profileInfoSidebar() {
    return {
      templateUrl: 'app/modules/profile/components/profile-info-sidebar/profile-info-sidebar.html',
      bindings: {
        user: '<'
      },
      controller: 'ProfileInfoSidebarController'
    };
  }

  function ProfileInfoSidebarController() {
    var vm = this;
    vm.managedUsers = [];
  }
})();
