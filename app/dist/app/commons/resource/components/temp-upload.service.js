(function (angular) {
  'use strict';

  angular
      .module('commons.resource')
      .factory('tempUploadService', tempUploadService);

  /**
   * @ngdoc service
   * @name commons.resource.tempUploadService
   *
   * @description
   * Service for uploading temporary files to the backend.
   *
   * @requires $log
   * @requires $q
   * @requires Upload
   * @requires commons.config.coyoEndpoints
   */
  function tempUploadService($log, $q, Upload, coyoEndpoints) {

    return {
      upload: upload
    };

    /**
     * @ngdoc method
     * @name commons.resource.tempUploadService#upload
     * @methodOf commons.resource.tempUploadService
     *
     * @description
     * Uploads given file to the backend for a given amount of time. The return value of this
     *
     * @param {object} file ngUpload file object
     * @param {number} forSeconds Number of seconds after which the uploaded file is deleted in the frontend
     *
     * @return {object} Promise that resolves to an identify object (Blob)
     */
    function upload(file, forSeconds) {
      $log.debug('[tempUploadService] Start uploading file:', file);

      var deferred = $q.defer();

      file.uploading = true;
      file.progress = 0;

      Upload.upload({
        url: coyoEndpoints.upload.temp,
        data: {
          'for': forSeconds,
          'file': file
        }
      }).then(function (response) {
        file.uploading = false;
        file.progress = 100;
        deferred.resolve(response.data);
      }, function (error) {
        file.uploading = false;
        $log.error('An error occurred while uploading the file ', file, error);
        deferred.reject(error);
      }, function (evt) {
        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      });

      return deferred.promise;
    }
  }

})(angular);
