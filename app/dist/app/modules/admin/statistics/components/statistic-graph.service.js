(function () {
  'use strict';

  angular.module('coyo.admin.statistics')
      .factory('statisticService', statisticService);

  /**
   * @ngdoc service
   * @name coyo.admin.statistics.statisticService
   *
   * @description
   * Provides methods for displaying and managing statistics.
   *
   * @requires moment
   */
  function statisticService(moment) {
    var dateRange = [moment().subtract(30, 'days'), moment()];

    return {
      getDateRange: getDateRange,
      setDateRange: setDateRange
    };

    /**
     * @ngdoc method
     * @name coyo.admin.statistics.statisticService#getDateRange
     * @methodOf coyo.admin.statistics.statisticService
     *
     * @description
     * Returns the currently set date range. This is reset on reload. Default is 30 days ago until today.
     *
     * @returns {array} An array of 2 moment objects specifying the time range to display in all statistics.
     */
    function getDateRange() {
      return dateRange;
    }

    /**
     * @ngdoc method
     * @name coyo.admin.statistics.statisticService#setDateRange
     * @methodOf coyo.admin.statistics.statisticService
     *
     * @description
     * Sets the current time range. This method should always been called after the user set a new time range for a
     * statistic to display. This way the newly set time range is applied to all statistics.
     *
     * @param {array} newRange an array of 2 moment objects specifying the time range to display in all statistics.
     */
    function setDateRange(newRange) {
      dateRange = newRange;
    }
  }

})();
