(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .factory('fileLibraryModalService', fileLibraryModalService)
      .controller('FileLibraryModalController', FileLibraryModalController);

  /**
   * @ngdoc service
   * @name commons.ui.fileLibraryModalService
   *
   * @description
   * Service for showing the file library within a modal.
   *
   * @requires modalService
   * @requires $uibModalInstance
   */
  function fileLibraryModalService(modalService) {
    return {
      open: open
    };

    /**
     * @ngdoc method
     * @name commons.ui.fileLibraryModalService#open
     * @methodOf commons.ui.fileLibraryModalService
     *
     * @description
     * Opens the file library in a modal and passes the various options to the file library.
     *
     * @param {object=} sender
     * The sender for the file library. If provided the file library is opened with the given sender being the active
     * view.
     *
     * @param {object=} options
     * File library options. See {@link commons.ui:fileLibrary fileLibrary}
     *
     * @param {object=} cropSettings
     * Image crop settings. See {@link commons.ui:fileLibrary fileLibrary}
     *
     * @param {string=} title
     * Translation key of the title of the modal
     *
     * @returns {promise} An http promise
     */
    function open(sender, options, cropSettings, title) {
      return modalService.open({
        controller: 'FileLibraryModalController',
        templateUrl: 'app/commons/ui/components/file-library/file-library-modal.html',
        size: 'lg',
        resolve: {
          sender: function () {
            return sender;
          },
          options: function () {
            return options;
          },
          cropSettings: function () {
            return cropSettings;
          },
          title: function () {
            return title || 'FILE_LIBRARY.TITLE';
          }
        }
      }).result;
    }
  }

  function FileLibraryModalController($uibModalInstance, sender, options, cropSettings, authService, $scope, title) {
    var vm = this;

    vm.sender = sender;
    vm.options = options;
    vm.cropSettings = cropSettings;
    vm.title = title;
    vm.selectedFiles = [];

    vm.saveAndClose = saveAndClose;

    /**
     * Closes the modal and returns the selected files
     */
    function saveAndClose() {
      $uibModalInstance.close(vm.options.selectMode === 'multiple' ? vm.selectedFiles : _.get(vm.selectedFiles, '[0]'));
    }
  }

})(angular);
