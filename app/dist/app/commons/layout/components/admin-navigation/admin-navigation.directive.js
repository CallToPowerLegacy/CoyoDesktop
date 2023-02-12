(function (angular) {
  'use strict';

  angular
      .module('commons.layout')
      .directive('oyocAdminNavigation', adminNavigation)
      .controller('AdminNavigationController', AdminNavigationController);

  /**
   * @ngdoc directive
   * @name commons.layout.oyocAdminNavigation:oyocAdminNavigation
   * @element ANY
   *
   * @description
   * Displays the admin top navigation.
   *
   * @requires commons.ui.sidebarService
   */
  function adminNavigation() {
    return {
      replace: true,
      templateUrl: 'app/commons/layout/components/admin-navigation/admin-navigation.html',
      controller: 'AdminNavigationController',
      controllerAs: '$ctrl'
    };
  }

  function AdminNavigationController(sidebarService) {
    var vm = this;

    vm.openMenu = openMenu;

    function openMenu() {
      sidebarService.open('admin-menu');
    }
  }

})(angular);
