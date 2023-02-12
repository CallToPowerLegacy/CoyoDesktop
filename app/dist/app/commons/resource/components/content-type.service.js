(function (angular) {
  'use strict';

  angular
      .module('commons.resource')
      .factory('contentTypeService', contentTypeService);

  /**
   * @ngdoc service
   * @name commons.resource.contentTypeService
   *
   * @description
   * General service for content types.
   */
  function contentTypeService() {

    return {
      isImage: isImage,
      isVideo: isVideo
    };

    /**
     * @ngdoc function
     * @name commons.resource.contentTypeServicee#isImage
     * @methodOf commons.resource.contentTypeService
     *
     * @description
     * Decides whether the given content type is an image or not.
     *
     * @param {string} contentType
     * The content type of the file.
     * @returns {boolean} Image or not.
     */
    function isImage(contentType) {
      return contentType ? contentType.indexOf('image') > -1 : false;
    }

    /**
     * @ngdoc function
     * @name commons.resource.contentTypeServicee#isVideo
     * @methodOf commons.resource.contentTypeService
     *
     * @description
     * Decides whether the given content type is a video or not.
     *
     * @param {string} contentType
     * The content type of the file.
     * @returns {boolean} Video or not.
     */
    function isVideo(contentType) {
      return contentType ? contentType.indexOf('video') > -1 : false;
    }
  }

})(angular);
