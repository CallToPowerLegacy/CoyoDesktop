(function (angular) {
  'use strict';

  /**
   * @ngdoc directive
   * @name coyo.events.coyoEventDateLabel:coyoEventDateLabel
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Displays the date and time of an event. Full day events will display the date only (not the time). The end date
   * is shown if the event spans over multiple days:
   *   - Full Day / Single Day: ---
   *   - Full Day / Multiple Day: to June 1st 2017
   *   - Non Full Day / Single Day: 11:06am to 12:06pm
   *   - Non Full Day / Multiple Day: 11:06am to June 1st 2017, 12:06pm
   *
   * @param {object} event
   * The corresponding event to display the date and time for.
   */
  angular
      .module('coyo.events')
      .component('coyoEventDateLabel', eventDateLabel())
      .controller('EventDateLabelController', EventDateLabelController);

  function eventDateLabel() {
    return {
      templateUrl: 'app/modules/events/components/event-date-label/event-date-label.html',
      scope: {},
      bindings: {
        event: '<'
      },
      controller: 'EventDateLabelController',
      controllerAs: '$ctrl'
    };
  }

  function EventDateLabelController($rootScope, moment) {
    var vm = this;
    var dateFormat = $rootScope.dateFormat.long;
    var timeFormat = $rootScope.timeFormat.short;

    vm.$onInit = onInit;

    function onInit() {
      var fullDay = vm.event.fullDay;
      vm.startPattern = fullDay ? '' : timeFormat;
      vm.endPattern = fullDay ? '' : timeFormat;
      vm.startDate = moment(vm.event.startDate);
      vm.endDate = moment(vm.event.endDate);

      if (!vm.startDate.isSame(vm.endDate, 'day')) {
        vm.endPattern = dateFormat + (fullDay ? '' : ', ') + vm.endPattern;
      }
    }
  }

})(angular);
