(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .component('coyoFilePicker', coyoFilePicker())
      .controller('FilePickerController', FilePickerController);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoFilePicker:coyoFilePicker
   * @scope
   * @restrict 'E'
   * @element ANY
   *
   * @description
   * Renders a button which opens the file library to select files from. The selected files are listed and can be
   * removed afterwards.
   *
   * @param {object|array} ngModel
   * An array (multi-select) or object (single/folder select) to store the selected file(s) in.
   *
   * @param {object=} sender
   * A sender can be passed along with this directive. In this case the file library is opened with this sender being
   * the active view.
   *
   * @param {string=} options
   * Sets the options for the file library. See {@link commons.ui.coyoFileLibrary:coyoFileLibrary}. The following defaults are
   * set:
   *
   * ```
   * {
   *  uploadMultiple: true,
      selectMode: 'multiple'
   * }
   * ```
   *
   * @param {object=} cropSettings
   * Defines the crop settings. See {@link commons.ui.coyoFileLibrary:coyoFileLibrary}. Disabled by default.
   *
   * @param {string=} modalTitle
   * Translation key of the title of the modal.
   */
  function coyoFilePicker() {
    return {
      templateUrl: 'app/commons/ui/components/file-library/file-picker/file-picker.html',
      require: {
        ngModel: '^ngModel'
      },
      bindings: {
        sender: '<?',
        options: '<?',
        cropSettings: '<?',
        modalTitle: '@'
      },
      controller: 'FilePickerController',
      controllerAs: '$ctrl'
    };
  }

  function FilePickerController(appService, fileLibraryModalService) {
    var vm = this;

    var defaultOptions = {
      uploadMultiple: true,
      selectMode: 'multiple'
    };

    var defaultCropSettings = {
      cropImage: false
    };

    vm.options = angular.extend(defaultOptions, vm.options);
    vm.cropSettings = angular.extend(vm.cropSettings || {}, defaultCropSettings);

    vm.pickFile = pickFile;
    vm.removeFile = removeFile;
    vm.getSelectedFiles = getSelectedFiles;

    function pickFile() {
      var appIdOrSlug = appService.getCurrentAppIdOrSlug();
      if (appIdOrSlug) {
        vm.sender.getApp(appIdOrSlug).then(function (app) {
          vm.options.initialFolder = {id: app.rootFolderId};
          _openFileLibrary(vm.options);
        });
      } else {
        _openFileLibrary(vm.options);
      }
    }

    function _openFileLibrary(options) {
      fileLibraryModalService.open(vm.sender, options, vm.cropSettings, vm.modalTitle).then(function (selection) {
        if (vm.options.selectMode === 'multiple') {
          vm.ngModel.$setViewValue(_.unionWith(vm.ngModel.$viewValue, selection, function (a, b) {
            return a.id === b.id;
          }));
        } else {
          vm.ngModel.$setViewValue(selection);
        }
      });
    }

    function removeFile(file) {
      if (vm.options.selectMode === 'multiple') {
        vm.ngModel.$setViewValue(_.filter(vm.ngModel.$viewValue, function (f) { return f.id !== file.id; }));
      } else {
        vm.ngModel.$setViewValue(undefined);
      }
    }

    function getSelectedFiles() {
      if (vm.options.selectMode === 'multiple') {
        return vm.ngModel.$viewValue;
      }
      return vm.ngModel.$viewValue ? [vm.ngModel.$viewValue] : [];
    }
  }

})(angular);
