(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('oyocViewEditNavItem', viewEditNavItem)
      .controller('ViewEditNavItemController', ViewEditNavItemController);

  /**
   * @ngdoc directive
   * @name commons.ui.oyocViewEditNavItem:oyocViewEditNavItem
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Renders a navigation item which triggers the edit mode for widget slots. If called from the sidebar navigation
   * the sidebar is closed after clicking the item.
   *
   * @requires $rootScope
   * @requires coyo.widgets.api.widgetLayoutService
   * @requires commons.ui.sidebarService
   */
  function viewEditNavItem() {
    return {
      restrict: 'E',
      templateUrl: 'app/commons/ui/components/view-edit-nav-item/view-edit-nav-item.html',
      replace: true,
      scope: {},
      bindToController: {},
      controller: 'ViewEditNavItemController',
      controllerAs: '$ctrl'
    };
  }

  function ViewEditNavItemController($rootScope, $scope, widgetLayoutService, sidebarService, widgetEditService) {
    var vm = this;

    vm.edit = edit;

    function edit() {
      widgetLayoutService.edit($rootScope, true);
      sidebarService.closeAll();
    }

    (function _init() {
      $scope.$watch(function () {
        return widgetEditService.switchable;
      }, function (newVal) {
        vm.isVisible = newVal;
      });
    })();
  }

})(angular);
