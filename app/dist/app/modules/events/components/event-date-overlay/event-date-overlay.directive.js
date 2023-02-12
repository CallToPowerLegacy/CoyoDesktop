(function (angular) {
  'use strict';

  angular
      .module('coyo.events')
      .directive('coyoEventDateOverlay', eventDateOverlay);

  /**
   * @ngdoc directive
   * @name coyo.events.coyoEventDateOverlay:coyoEventDateOverlay
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Shows a date badge of an event.
   *
   * @param {date} date
   * The date of the event.
   */
  function eventDateOverlay() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/modules/events/components/event-date-overlay/event-date-overlay.html',
      scope: {
        date: '<'
      }
    };
  }

})(angular);
