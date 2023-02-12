(function () {
  'use strict';

  angular
      .module('coyo.apps.list')
      .component('oyocListAppTableHeader', listAppTableHeader())
      .controller('ListAppTableHeaderController', ListAppTableHeaderController);

  /**
   * @ngdoc directive
   * @name coyo.apps.list.oyocListAppTableHeader:oyocListAppTableHeader
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Displays the table header with the given fields. Takes hidden fields into account and adds sorting mechanism. Users
   * can click on headers to sort the respective column. Note that this component does not execute the update of the
   * table data. Use the callback function 'onSortFn' to fetch the new data.
   *
   * @param {array} fields
   * An array of objects containing all relevant field data.
   *
   * @param {function} onSortFn
   * Function to be called to update the table data after a user clicked a column header.
   *
   * @requires coyo.apps.list.listSortService
   */
  function listAppTableHeader() {
    return {
      templateUrl: 'app/apps/list/components/list-app-table-header.html',
      bindings: {
        fields: '<',
        onSortFn: '&'
      },
      controller: 'ListAppTableHeaderController'
    };
  }

  function ListAppTableHeaderController(listSortService) {
    var vm = this;

    vm.$onInit = init;
    vm.sort = sort;

    function init() {
      vm.sortConfig = listSortService.getSortConfig();
    }

    function sort(field) {
      vm.sortConfig = listSortService.updateSortConfig(field);

      if (vm.onSortFn) {
        vm.onSortFn();
      }
    }

  }
})();
