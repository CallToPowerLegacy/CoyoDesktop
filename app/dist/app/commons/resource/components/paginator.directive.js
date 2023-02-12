(function (angular) {
  'use strict';

  angular
      .module('commons.resource')
      .directive('coyoPaginator', coyoPaginator)
      .controller('PaginatorController', PaginatorController);

  function coyoPaginator() {
    return {
      restrict: 'A',
      templateUrl: 'app/commons/resource/components/paginator.html',
      replace: true,
      scope: {},
      bindToController: {
        page: '=coyoPaginator'
      },
      controller: 'PaginatorController',
      controllerAs: '$ctrl'
    };
  }

  function PaginatorController() {
    var vm = this;

    vm.prev = prev;
    vm.next = next;

    function prev() {
      if (!vm.page.first) {
        vm.page.prev();
      }
    }

    function next() {
      if (!vm.page.last) {
        vm.page.next();
      }
    }
  }

})(angular);
