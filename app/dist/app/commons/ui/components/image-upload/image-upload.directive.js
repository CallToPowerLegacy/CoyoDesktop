(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoImageUpload', imageUpload)
      .controller('ImageUploadController', ImageUploadController);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoImageUpload:coyoImageUpload
   * @scope
   * @restrict 'E'
   * @element ANY
   *
   * @description
   * Renders an image upload area.
   *
   * @param {object} ngModel model to save the image in
   * @param {boolean} selecting Boolean flag whether an image is currently selected (set by this directive)
   * @param {string} keyDragNDrop i18n message key for message to show in drop area
   * @param {string} areaType The area type of the crop tool. Options: <em>circle</em>, <em>square</em> and <em>rectangle</em>
   * @param {string} cropAspectRatio The crop aspect ratio, e.g. <em>1</em> or <em>4</em>
   * @param {object} imageSize The image size, e.g. <em>{w: 320, h: 320}</em> or <em>{w: 1600, h: 400}</em>
   */
  function imageUpload() {
    return {
      restrict: 'E',
      templateUrl: 'app/commons/ui/components/image-upload/image-upload.html',
      scope: {},
      replace: true,
      require: 'ngModel',
      bindToController: {
        ngModel: '=',
        selecting: '=',
        keyDragNDrop: '@',
        keyContentError: '@',
        areaType: '@',
        cropAspectRatio: '@',
        imageSize: '<'
      },
      controller: 'ImageUploadController',
      controllerAs: '$ctrl'
    };
  }

  function ImageUploadController() {
    var vm = this;

    vm.image = '';
    vm.ngModel = '';
    vm.contentError = false;
    vm.selecting = 0;

    vm.beforeChange = beforeChange;
    vm.onChange = onChange;

    /**
     * Callback for ng-file-upload 'before-model-change'
     * and ui-cropper 'load-begin' when images start loading.
     *
     * Note: ui-cropper does not reliably trigger 'load-begin' event before 'load-done' event.
     * Thus we use a counter for vm.selecting to prevent it from blocking the upload if called the other way round.
     */
    function beforeChange() {
      vm.selecting++;
    }

    /**
     * Callback for ng-file-upload 'model-change'
     * and ui-cropper 'load-done' when images are loaded.
     *
     * Note: ui-cropper does not reliably trigger 'load-begin' event before 'load-done' event.
     * Thus we use a counter for vm.selecting to prevent it from blocking the upload if called the other way round.
     */
    function onChange() {
      vm.selecting--;
      if (vm.image) {
        vm.contentError = false;
        vm.contentType = _.includes(['image/png', 'image/gif'], vm.image.type) ? 'image/png' : 'image/jpeg';
      } else {
        vm.contentError = true;
      }
    }
  }

})(angular);
