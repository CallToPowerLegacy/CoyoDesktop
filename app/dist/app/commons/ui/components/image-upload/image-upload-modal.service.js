(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .factory('imageUploadModal', imageUploadModal)
      .controller('ImageUploadModalController', ImageUploadModalController);

  /**
   * @ngdoc service
   * @name commons.ui.imageUploadModal
   *
   * @requires $log
   * @requires $http
   * @requires $uibModalInstance
   * @requires Upload
   * @requires modalService
   *
   * @description
   * Renders a custom styled modal for image upload, resizing and cropping.
   */
  function imageUploadModal(modalService) {

    /**
     * @ngdoc method
     * @name commons.ui.imageUploadModal#open
     * @methodOf commons.ui.imageUploadModal
     *
     * @description
     * Displays a custom modal for uploading, cropping and resizing images.
     *
     * @param {object} options
     *     An options object. The following option keys are valid:
     *       * title:
     *           The modal's title.
     *       * url:
     *           The upload URL for the file upload.
     */
    function openImageUploadModal(options) {
      return modalService.open({
        size: 'lg',
        templateUrl: 'app/commons/ui/components/image-upload/image-upload-modal.html',
        controller: 'ImageUploadModalController',
        resolve: {
          options: function () { return options; }
        }
      });
    }

    return {
      open: openImageUploadModal
    };
  }

  function ImageUploadModalController($log, $http, $uibModalInstance, Upload, options) {
    var vm = this;

    vm.title = options.title || 'MODULE.PROFILE.MODALS.IMAGE_UPLOAD.TITLE';
    vm.status = {
      uploading: false,
      selecting: false,
      deleting: false
    };
    vm.areaType = _validAreaType(options.areaType) ? options.areaType : 'rectangle';
    vm.cropAspectRatio = options.cropAspectRatio || '1';
    vm.imageSize = options.imageSize || {w: 400, h: 400};
    vm.canDelete = options.canDelete;

    vm.upload = upload;
    vm.deleteImage = deleteImage;

    function upload(imageData) {
      vm.status.uploading = true;

      Upload.upload({
        url: options.url,
        data: {
          file: Upload.dataUrltoBlob(imageData)
        }
      }).then(function (response) {
        $uibModalInstance.close(response.data);
      }).catch(function (response) {
        $log.error('Failed to set new avatar image.', response);
      }).finally(function () {
        vm.status.uploading = false;
      });
    }

    function deleteImage() {
      if (vm.canDelete) {
        vm.status.deleting = true;

        $http({
          method: 'DELETE',
          url: options.url
        }).then(function (response) {
          $uibModalInstance.close(response.data);
        }).catch(function (response) {
          $log.error('Failed to delete avatar image.', response);
        }).finally(function () {
          vm.status.deleting = false;
        });
      }
    }

    // ====================

    function _validAreaType(areaType) {
      return areaType === 'circle' || areaType === 'rectangle';
    }
  }

})(angular);
