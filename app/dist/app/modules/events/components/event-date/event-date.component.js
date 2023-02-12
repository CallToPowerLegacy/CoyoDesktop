(function (angular) {
  'use strict';

  angular
      .module('coyo.events')
      .component('coyoEventDate', eventDate());

  /**
   * @ngdoc directive
   * @name coyo.events.coyoEventDate:coyoEventDate
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Renders the date of an event in accordance to its start and end date.
   *
   * @param {object} event
   * The corresponding event.
   */
  function eventDate() {
    return {
      templateUrl: 'app/modules/events/components/event-date/event-date.html',
      bindings: {
        event: '<'
      }
    };
  }

})(angular);
