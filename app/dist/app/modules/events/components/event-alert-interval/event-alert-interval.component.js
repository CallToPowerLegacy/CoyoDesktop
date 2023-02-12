(function (angular) {
  'use strict';

  angular
      .module('coyo.events')
      .component('coyoEventAlertInterval', eventAlertInterval())
      .controller('EventAlertIntervalController', EventAlertIntervalController);

  /**
   * @ngdoc directive
   * @name coyo.events.coyoEventAlertInterval:coyoEventAlertInterval
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Renders a event alert selection dropdown.
   *
   * @param {object} ngModel
   * The alert model.
   */
  function eventAlertInterval() {
    return {
      templateUrl: 'app/modules/events/components/event-alert-interval/event-alert-interval.html',
      bindings: {
        ngModel: '='
      },
      controller: 'EventAlertIntervalController',
      controllerAs: '$ctrl'
    };
  }

  function EventAlertIntervalController() {
    var vm = this;

    vm.intervalValues = [
      {'value': 'FIVE_MINUTES'},
      {'value': 'FIFTEEN_MINUTES'},
      {'value': 'THIRTY_MINUTES'},
      {'value': 'ONE_HOUR'},
      {'value': 'FOUR_HOURS'},
      {'value': 'EIGHT_HOURS'},
      {'value': 'ONE_DAY'},
      {'value': 'TWO_DAYS'},
      {'value': 'ONE_WEEK'}
    ];
  }

})(angular);
