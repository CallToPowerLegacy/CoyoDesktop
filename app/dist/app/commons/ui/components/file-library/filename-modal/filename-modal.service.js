(function (angular) {
  'use strict';

  angular.module('commons.ui')
      .factory('filenameModalService', fileNameModalService)
      .controller('FilenameModalController', FilenameModalController);

  /**
   * @ngdoc service
   * @name commons.ui.fileNameModalService
   *
   * @description
   * This service opens a modal in which the user can choose a folder or file name. This can be used to create a new
   * folder or rename an existing file / folder.
   *
   * @requires modalService
   */
  function fileNameModalService(modalService) {

    return {
      open: open
    };

    /**
     * @ngdoc method
     * @name commons.ui.fileNameModalService#open
     * @methodOf commons.ui.fileNameModalService
     *
     * @description
     * Opens the modal to choose the folder name in.
     *
     * @param {string} title
     * A title for the modal window
     *
     * @param {object=} filename
     * The current name of the file or folder to rename. If none set an empty input field is displayed.
     *
     * @returns {object}
     * Returns a promise with the folder name.
     */
    function open(title, filename) {
      return modalService.open({
        templateUrl: 'app/commons/ui/components/file-library/filename-modal/filename-modal.html',
        controller: 'FilenameModalController',
        resolve: {
          title: function () {
            return title || '';
          },
          filename: function () {
            return filename || '';
          }
        }
      }).result;
    }
  }

  function FilenameModalController(title, filename) {
    var vm = this;
    vm.modalTitle = title;
    vm.filename = filename;
  }

})(angular);
