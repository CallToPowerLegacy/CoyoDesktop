(function (angular) {
  'use strict';

  angular
      .module('coyo.events')
      .component('coyoEventList', coyoEventList())
      .controller('EventListComponentController', EventListComponentController);

  /**
   * @ngdoc directive
   * @name coyo.events.coyoEventList:coyoEventList
   * @scope
   * @restrict 'E'
   * @element ANY
   *
   * @description
   * Renders a list of events.
   *
   * @param {object} page
   * The current page of events.
   *
   * @param {boolean} loading
   * The loading state of the list.
   *
   * @param {boolean} showTour
   * Whether or not to include the coyo tour for this event list.
   */
  function coyoEventList() {
    return {
      templateUrl: 'app/modules/events/components/event-list/event-list.html',
      bindings: {
        page: '=',
        loading: '<',
        showTour: '<'
      },
      controller: 'EventListComponentController',
      controllerAs: '$ctrl'
    };
  }

  function EventListComponentController(moment) {
    var vm = this;

    vm.hasStarted = hasStarted;
    vm.isOngoing = isOngoing;
    vm.isToday = isToday;
    vm.showDivider = showDivider;

    function hasStarted(start) {
      return moment().isSameOrAfter(start);
    }

    function isOngoing(start, end) {
      var now = moment();
      return now.isSameOrAfter(start) && now.isSameOrBefore(end);
    }

    function isToday(date) {
      return moment().isSame(date, 'day');
    }

    function showDivider($index) {
      var currentEvent = _.get(vm.page, 'content[' + $index + ']');
      var previousEvent = _.get(vm.page, 'content[' + ($index - 1) + ']');
      return angular.isUndefined(previousEvent) || !moment(previousEvent.startDate).isSame(currentEvent.startDate, 'day');
    }
  }

})(angular);
