(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .component('coyoTimeAgo', timeAgo());

  /**
   * @ngdoc directive
   * @name commons.ui.coyoTimeAgo:coyoTimeAgo
   *
   * @description
   * Adds a tooltip with the original date and time to the am-time-ago directive.
   *
   * @param {object} date tha date to be displayed
   * @param {string} [tooltipPlacement=auto bottom] the positioning of the tooltip
   */
  function timeAgo() {
    return {
      templateUrl: 'app/commons/ui/components/time-ago/time-ago.html',
      bindings: {
        date: '<',
        tooltipPlacement: '@'
      },
      controller: angular.noop,
      controllerAs: '$ctrl'
    };
  }
})(angular);
