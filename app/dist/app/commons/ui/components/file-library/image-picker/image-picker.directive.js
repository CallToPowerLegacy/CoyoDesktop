(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoImagePicker', CoyoImagePicker)
      .controller('ImagePickerController', ImagePickerController);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoImagePicker:coyoImagePicker
   * @scope
   * @restrict 'E'
   * @element ANY
   *
   * @description
   * Renders a button which opens the file library to select an image from. New images can be uploaded. The selected
   * images are displayed with their thumbnail and can be removed from the selection afterwards.
   *
   * @param {object} selectedImages
   * An array to store the selected images in.
   *
   * @param {object=} sender
   * A sender can be passed along with this directive. In this case the file library is opened with this sender being
   * the active view.
   *
   * @param {string=} options
   * Sets the options for the file library. See {@link commons.ui.coyoFileLibrary:coyoFileLibrary}. Note that
   * `filterContentType` is always set to `image` and can't be changed. The following defaults are set:
   *
   * ```
   * {
   *  uploadMultiple: false,
      selectMode: 'single'
   * }
   * ```
   *
   * @param {object=} cropSettings
   * Defines the crop settings. See {@link commons.ui.coyoFileLibrary:coyoFileLibrary}. Enabled by default.
   */
  function CoyoImagePicker() {
    return {
      restrict: 'E',
      require: 'ngModel',
      templateUrl: 'app/commons/ui/components/file-library/image-picker/image-picker.html',
      scope: {},
      bindToController: {
        selectedImages: '=ngModel',
        sender: '<?',
        options: '<?',
        cropSettings: '<?'
      },
      controller: 'ImagePickerController',
      controllerAs: '$ctrl'
    };
  }

  function ImagePickerController(fileLibraryModalService, $element) {
    var vm = this;
    var ngModelController = $element.controller('ngModel');
    var defaultOptions = {
      uploadMultiple: false,
      selectMode: 'single'
    };
    var defaultCropSettings = {
      cropImage: true
    };

    vm.selectedImages = vm.selectedImages || (_.get(vm, 'options.selectMode') === 'multiple' ? [] : undefined);
    vm.options = angular.extend(vm.options || {}, defaultOptions);
    vm.options.filterContentType = 'image';
    vm.cropSettings = angular.extend(vm.cropSettings || {}, defaultCropSettings);

    vm.openFileLibrary = openFileLibrary;
    vm.removeFile = removeFile;
    vm.getSelectedImages = getSelectedImages;

    function openFileLibrary() {
      fileLibraryModalService.open(vm.sender, vm.options, vm.cropSettings).then(function (selection) {
        if (vm.options.selectMode === 'multiple') {
          angular.forEach(selection, function (file) {
            file.fileId = file.id;
          });
          ngModelController.$setViewValue(_.unionWith(vm.selectedImages, selection, function (a, b) {
            return a.fileId === b.fileId;
          }));
        } else {
          selection.fileId = selection.id;
          ngModelController.$setViewValue(selection);
        }
      });
    }

    function removeFile(file) {
      if (vm.options.selectMode === 'multiple') {
        ngModelController.$setViewValue(_.filter(ngModelController.$viewValue, function (f) { return f.fileId !== file.fileId; }));
      } else {
        ngModelController.$setViewValue(undefined);
      }
    }

    function getSelectedImages() {
      if (vm.options.selectMode === 'multiple') {
        return ngModelController.$viewValue;
      }
      return ngModelController.$viewValue ? [ngModelController.$viewValue] : [];
    }
  }

})(angular);
