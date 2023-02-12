(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .factory('imageCropModal', imageCropModal)
      .controller('ImageCropModalController', ImageCropModalController);

  /**
   * @ngdoc service
   * @name commons.ui.imageCropModal
   *
   * @description
   * This service opens a modal in which the user can crop a selected image.
   *
   * @requires modalService
   */
  function imageCropModal(modalService) {

    return {
      open: open
    };

    /**
     * @ngdoc method
     * @name commons.ui.imageCropModal#open
     * @methodOf commons.ui.imageCropModal
     *
     * @description
     * Opens modal with the given image to crop by the user. Note that if both options `cropAspectRatio` and
     * `imageSize` are set, the cropping selection will only select in the given constraints.
     *
     * @param {object} image
     * The image to be cropped
     *
     * @param {object} options
     * The crop options. See specific options listed below.
     *
     * @param {string=} options.areaType
     * The area type of the cropping selection. Either 'circle' or 'rectangular'
     *
     * @param {string=} options.cropAspectRatio
     * The aspect ratio of the cropping selection e.g. '1'.
     *
     * @param {object=} options.imageSize
     * The width and height of the cropping selection e.g. {w: 400, h: 400}. Default is 200 x 200.
     *
     * @returns {object}
     * Returns a promise with the cropped image.
     */
    function open(image, options) {
      return modalService.open({
        size: 'lg',
        templateUrl: 'app/commons/ui/components/image-crop/image-crop-modal.html',
        controller: 'ImageCropModalController',
        resolve: {
          image: function () { return image; },
          options: function () { return options; }
        }
      }).result;
    }
  }

  function ImageCropModalController($uibModalInstance, $timeout, image, options) {
    var vm = this;

    vm.busy = false;
    vm.image = image;
    vm.croppedImage = '';
    vm.areaType = _validAreaType(options.areaType) ? options.areaType : 'rectangle';
    vm.cropAspectRatio = options.cropAspectRatio || '';
    vm.imageSize = options.imageSize || 'max';
    vm.liveView = {block: true};
    vm.contentType = _.includes(['image/png', 'image/gif'], vm.image.type) ? 'image/png' : 'image/jpeg';

    vm.saveAndClose = saveAndClose;

    function saveAndClose() {
      vm.busy = true;
      $timeout(function () {
        vm.liveView.render(function (dataURL) {
          $uibModalInstance.close(dataURL);
        });
      });
    }

    // ====================

    function _validAreaType(areaType) {
      return areaType === 'circle' || areaType === 'rectangle';
    }
  }

})(angular);
