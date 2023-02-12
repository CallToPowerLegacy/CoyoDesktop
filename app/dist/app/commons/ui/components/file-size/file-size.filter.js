(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .filter('fileSize', fileSizeFilter);

  /**
   * @ngdoc filter
   * @name commons.ui.fileSize:fileSize
   * @function
   *
   * @description
   * Converts a byte number into a human readable file size.
   *
   * @param {number} bytes Number of bytes
   */
  function fileSizeFilter() {
    return function (bytes, precision) {
      if (isNaN(parseFloat(bytes)) || !isFinite(bytes) || parseFloat(bytes) < 0) {
        return '-';
      }

      if (angular.isUndefined(precision)) {
        precision = 1;
      }

      var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
      var number = Math.floor(Math.log(bytes) / Math.log(1024));

      return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
    };
  }

})(angular);
