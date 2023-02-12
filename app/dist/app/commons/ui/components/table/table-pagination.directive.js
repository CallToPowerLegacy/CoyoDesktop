(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoTablePagination', tablePagination)
      .controller('TablePaginationController', TablePaginationController);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoTablePagination:coyoTablePagination
   * @restrict 'E'
   *
   * @description
   * Renders a pagination element backed by a mindsmash.resource.Page using ui-bootstrap.
   *
   * @param {object} page the current page
   * @param {function=} onChange an optional update function that is called when the current page is changed
   *
   * @requires $attrs
   */
  function tablePagination() {
    return {
      replace: true,
      restrict: 'E',
      templateUrl: 'app/commons/ui/components/table/table-pagination.html',
      scope: {},
      bindToController: {
        page: '<',
        onChange: '&'
      },
      controller: 'TablePaginationController',
      controllerAs: '$ctrl'
    };
  }

  function TablePaginationController($attrs) {
    var vm = this;
    vm.loading = false;

    // translate between zero and one based index
    Object.defineProperty(vm, 'currentPage', {
      get: function () {
        return vm.page._queryParams._page + 1;
      },
      set: function (page) {
        vm.page._queryParams._page = page - 1;
      }
    });

    vm.change = function () {
      var hasOnChange = angular.isDefined($attrs.onChange);
      if (vm.loading || (!hasOnChange && !vm.page.page)) {
        return;
      }

      vm.loading = true;
      (hasOnChange ? vm.onChange(vm.page) : vm.page.page(vm.page._queryParams._page)).finally(function () {
        vm.loading = false;
      });
    };
  }

})(angular);
