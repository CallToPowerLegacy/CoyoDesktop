(function (angular) {
  'use strict';

  angular
      .module('commons.layout')
      .directive('oyocAdminSidebar', adminSidebar)
      .controller('AdminSidebarController', AdminSidebarController);

  /**
   * @ngdoc directive
   * @name commons.layout.oyocAdminSidebar:oyocAdminSidebar
   * @restrict E
   * @element OWN
   *
   * @description
   * Displays the sidebar navigation menu of the admin area.
   *
   * @requires $rootScope
   * @requires commons.ui.sidebarService
   */
  function adminSidebar() {
    return {
      restrict: 'E',
      scope: true,
      replace: true,
      templateUrl: 'app/commons/layout/components/admin-sidebar/admin-sidebar.html',
      controller: 'AdminSidebarController',
      controllerAs: '$ctrl'
    };
  }

  function AdminSidebarController($rootScope, sidebarService) {
    var vm = this;

    vm.showSidebar = false;
    vm.open = open;
    vm.close = close;

    function open() {
      vm.showSidebar = true;
      $rootScope.showBackdrop = true;
    }

    function close() {
      vm.showSidebar = false;
      $rootScope.showBackdrop = false;
    }

    sidebarService.register({
      name: 'admin-menu',
      open: open,
      close: close,
      isOpen: function () {
        return vm.showSidebar;
      }
    });
  }

})(angular);
