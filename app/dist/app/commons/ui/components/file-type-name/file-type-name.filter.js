(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .filter('fileTypeName', fileTypeNameFilter);

  /**
   * @ngdoc filter
   * @name commons.ui.fileTypeName:fileTypeName
   * @function
   *
   * @description
   * Converts a content (mime) type into a type name.
   */
  function fileTypeNameFilter() {
    return function (contentType) {
      if (contentType) {
        // Microsoft Office document types
        if (contentType.indexOf('officedocument') >= 0) {
          if (contentType.indexOf('word') >= 0) {
            return 'FILE_TYPE_NAME.WORD';
          }

          if (contentType.indexOf('sheet') >= 0) {
            return 'FILE_TYPE_NAME.EXCEL';
          }

          if (contentType.indexOf('presentation') >= 0) {
            return 'FILE_TYPE_NAME.POWERPOINT';
          }
        }

        // Images
        if (contentType.indexOf('image') >= 0) {
          return 'FILE_TYPE_NAME.IMAGE';
        }

        // Videos
        if (contentType.indexOf('video') >= 0) {
          return 'FILE_TYPE_NAME.VIDEO';
        }

        // PDF
        if (contentType.indexOf('pdf') >= 0) {
          return 'FILE_TYPE_NAME.PDF';
        }

        // Text
        if (contentType.indexOf('plain') >= 0) {
          return 'FILE_TYPE_NAME.PLAIN';
        }
      }

      // Default
      return 'FILE_TYPE_NAME.DEFAULT';
    };
  }

})(angular);
