(function () {
  'use strict';

  angular
      .module('commons.ui')
      .filter('dateRange', dateRangeFilter);

  /**
   * @ngdoc filter
   * @name commons.ui.dateRange:dateRange
   * @function
   *
   * @description
   * Takes an array of two moment dates and returns a string representation of this date range. If both dates are the
   * same only one date is returned. If one of the dates is today, the string "today" is used.
   *
   * @param {array} input An array of two moment dates to format as a date range.
   *
   * @requires $rootScope
   * @requires $translate
   * @requires $log
   * @requires moment
   */
  function dateRangeFilter($rootScope, $translate, $log, moment) {
    return filter;

    function filter(input) {
      if (!_.isArray(input) || input.length !== 2) {
        $log.error('[date-range-filter] Input needs to be array of size 2.', input);
        return '';
      }
      if (input[0].isSame(input[1], 'd')) {
        return _getDateString(input[0]);
      }
      return _getDateString(input[0]) + ' - ' + _getDateString(input[1]);
    }

    function _getDateString(momentDate) {
      if (momentDate.isSame(moment(), 'd')) {
        return $translate.instant('TODAY');
      }
      var format = _.get($rootScope, 'dateFormat.short', 'M/D/YYYY');
      return momentDate.format(format);
    }
  }

})();
