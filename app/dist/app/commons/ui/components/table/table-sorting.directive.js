(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoTableSorting', tableSorting)
      .controller('TableSortingController', TableSortingController);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoTableSorting:coyoTableSorting
   * @restrict 'A'
   *
   * @description
   * Renders a table column header with sorting links and indicator icons.
   *
   * Tables must be backed by mindsmash.resource.Page.
   *
   * Note: Must be used as attribute directive as otherwise the elements end up in the wrong place in the DOM.
   *
   * @requires lodash
   *
   * @param {object} page The mindsmash.resource.Page
   * @param {string} property The property to sort by
   * @param {string} title Text content for the th element
   */
  function tableSorting() {
    return {
      replace: true,
      restrict: 'A',
      templateUrl: 'app/commons/ui/components/table/table-sorting.html',
      scope: {},
      bindToController: {
        page: '=',
        property: '@',
        title: '@'
      },
      controller: 'TableSortingController',
      controllerAs: '$ctrl'
    };
  }

  function TableSortingController() {
    var vm = this;

    vm.sort = sort;
    vm.isDirection = isDirection;

    function sort() {
      var orderBy = vm.property + ',' + (vm.isDirection('ASC') ? 'desc' : 'asc');
      vm.page.sort(orderBy);
    }

    function isDirection(direction) {
      var sorting = _.get(vm, 'page.sorting');
      if (!sorting) {
        return false;
      }
      return _.join(_.map(sorting, 'property'), ',') === vm.property && sorting[0].direction === direction;
    }
  }

})(angular);
