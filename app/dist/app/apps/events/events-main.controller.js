(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.events')
      .controller('EventsAppMainController', EventsAppMainController);

  function EventsAppMainController($timeout, EventModel, Pageable, sender, eventsAppConfig) {
    var vm = this;

    vm.sender = sender;

    vm.search = search;
    vm.filter = filter;
    vm.clearDate = clearDate;

    /* ==================== */

    function search(searchTerm) {
      vm.query.term = searchTerm;
      _loadEvents();
    }

    function filter(dateRange) {
      vm.query.from = dateRange && dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : null;
      vm.query.to = dateRange && dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : null;
      _loadEvents();
    }

    function clearDate() {
      vm.dateRange = [];
      filter(vm.dateRange);
    }

    /* ==================== */

    function _loadEvents() {
      if (vm.loading) {
        return;
      }

      // perform search
      vm.loading = true;
      var term = vm.query.term;
      var from = vm.query.from ? (vm.query.from + 'T00:00:00') : null;
      var to = vm.query.to ? (vm.query.to + 'T23:59:59') : null;
      var sort = term ? ['_score,DESC', 'displayName.sort'] : 'displayName.sort';
      var pageable = new Pageable(0, eventsAppConfig.list.paging.pageSize, sort);
      var filters = angular.extend({sender: [sender.id]}, vm.query.filters);
      EventModel.searchWithFilter(term, from, to, pageable, filters).then(function (page) {
        vm.currentPage = page;
      }).finally(function () {
        vm.loading = false;
      });
    }

    (function _init() {
      vm.query = {};
      vm.dateRange = [];

      $timeout(function () {
        _loadEvents();
      });
    })();
  }

})(angular);
