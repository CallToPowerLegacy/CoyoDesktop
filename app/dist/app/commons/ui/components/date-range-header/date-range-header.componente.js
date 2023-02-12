(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .component('coyoDateRangeHeader', dateRangeHeader());

  /**
   * @ngdoc directive
   * @name commons.ui.coyoDateRangeHeader:coyoDateRangeHeader
   * @scope
   * @restrict 'E'
   * @param {object[]} dateRange the array of selected dates
   *
   * @description
   * Displays a header for a date-range calendar.
   */
  function dateRangeHeader() {
    return {
      templateUrl: 'app/commons/ui/components/date-range-header/date-range-header.html',
      bindings: {
        dateRange: '<'
      }
    };
  }

})(angular);
