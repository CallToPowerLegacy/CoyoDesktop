(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoFilterExpand', filterExpand)
      .controller('FilterExpandController', FilterExpandController);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoFilterExpand:coyoFilterExpand
   * @scope
   * @restrict 'E'
   *
   * @description
   * Renders a single filter entry used to expand the filter list
   *
   * @param {function} onClick click handler for when the expand entry is selected
   *
   * @see commons.ui.coyoFilter:coyoFilter
   */
  function filterExpand() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/commons/ui/components/filterbox/filter-expand.html',
      scope: {},
      bindToController: {
        onClick: '&'
      },
      controller: 'FilterExpandController',
      controllerAs: '$ctrl'
    };
  }

  function FilterExpandController() {
    var vm = this;
    vm.clickHandler = function () {
      if (vm.loading) {
        return;
      }
      var promise = vm.onClick();
      if (promise) {
        vm.loading = true;
        promise.finally(function () {
          vm.loading = false;
        });
      }
    };
  }

})(angular);
