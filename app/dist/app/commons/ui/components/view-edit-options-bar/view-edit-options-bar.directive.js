(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('oyocViewEditOptionsBar', viewEditOptionsBar)
      .controller('ViewEditOptionsBarController', ViewEditOptionsBarController);

  /**
   * @ngdoc directive
   * @name commons.ui.oyocViewEditOptionsBar:oyocViewEditOptionsBar
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Renders the options bar for the global widget slot edit mode. The bar displays a button to save or cancel the
   * current changes.
   *
   * @requires $rootScope
   * @requires coyo.widgets.api.widgetLayoutService
   */
  function viewEditOptionsBar() {
    return {
      restrict: 'E',
      templateUrl: 'app/commons/ui/components/view-edit-options-bar/view-edit-options-bar.html',
      scope: {},
      bindToController: {},
      controller: 'ViewEditOptionsBarController',
      controllerAs: '$ctrl'
    };
  }

  function ViewEditOptionsBarController($rootScope, widgetLayoutService, $sessionStorage, $scope) {
    var vm = this;

    vm.save = save;
    vm.cancel = cancel;

    $scope.$watch(function () {
      return _.get($sessionStorage, 'messagingSidebar.compact', false);
    }, function (newVal) {
      vm.compact = newVal;
    });

    function save() {
      widgetLayoutService.save($rootScope, true);
    }

    function cancel() {
      widgetLayoutService.cancel($rootScope, true);
    }
  }

})(angular);
