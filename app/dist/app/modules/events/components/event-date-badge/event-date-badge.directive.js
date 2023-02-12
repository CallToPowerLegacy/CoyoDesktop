(function (angular) {
  'use strict';

  angular
      .module('coyo.events')
      .directive('coyoEventDateBadge', eventDateBadge);

  /**
   * @ngdoc directive
   * @name coyo.events.coyoEventDateBadge:coyoEventDateBadge
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Shows a date badge of an event.
   *
   * @param {date} date
   * The date of the event.
   */
  function eventDateBadge() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/modules/events/components/event-date-badge/event-date-badge.html',
      scope: {
        date: '<'
      }
    };
  }

})(angular);
