(function (angular) {
  'use strict';

  angular
      .module('coyo.events')
      .controller('EventsListController', EventsListController);

  function EventsListController($sessionStorage, $state, $stateParams, $timeout, EventModel, Pageable, moment,
                                eventsConfig) {
    var vm = this;

    vm.search = search;
    vm.filter = filter;
    vm.clearDate = clearDate;

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

    var PARAMS = ['term', 'from', 'to'];

    function _pick(obj, keys) {
      return obj ? _.chain(obj)
          .pick(keys)
          .omitBy(_.isEmpty)
          .value() : {};
    }

    function _loadEvents() {
      if (vm.loading) {
        return;
      }

      // write params to URL
      $state.transitionTo('main.event', _pick(vm.query, PARAMS), {notify: false});

      // perform search
      $sessionStorage.eventQuery = vm.query;
      vm.loading = true;
      var term = vm.query.term;
      var from = vm.query.from ? (vm.query.from + 'T00:00:00') : null;
      var to = vm.query.to ? (vm.query.to + 'T23:59:59') : null;
      var sort = term ? ['_score,DESC', 'displayName.sort'] : 'displayName.sort';
      var pageable = new Pageable(0, eventsConfig.list.paging.pageSize, sort);
      var filters = {};
      EventModel.searchWithFilter(term, from, to, pageable, filters).then(function (page) {
        vm.currentPage = page;
      }).finally(function () {
        vm.loading = false;
      });
    }

    (function _init() {
      // extract search from URL / storage
      $sessionStorage.eventQuery = angular.extend(
          _pick($sessionStorage.eventQuery, PARAMS),
          _pick($stateParams, PARAMS));
      vm.query = $sessionStorage.eventQuery;

      // // rewrite to URL
      $state.transitionTo('main.event', _pick(vm.query, PARAMS), {notify: false});

      // init date range filter
      vm.dateRange = [];
      if (vm.query.from) {
        vm.dateRange.push(moment(vm.query.from, 'YYYY-MM-DD'));
        if (vm.query.to) {
          vm.dateRange.push(moment(vm.query.to, 'YYYY-MM-DD'));
        }
      }

      $timeout(function () {
        _loadEvents();
      });
    })();
  }

})(angular);
