(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .factory('publicLinkModalService', publicLinkModalService);

  /**
   * @ngdoc service
   * @name commons.ui.publicLinkModalService
   *
   * @description
   * This service opens a modal in which the user can activate or deactivate the public link functionality
   * for a given file or folder.
   *
   * @requires modalService
   */
  function publicLinkModalService(modalService) {

    return {
      open: open
    };

    /**
     * @ngdoc method
     * @name commons.ui.publicLinkModalService#open
     * @methodOf commons.ui.publicLinkModalService
     *
     * @description
     * Opens the modal for the public link functionality.
     *
     * @param {string=} fileId
     * The fileId of the current file.
     *
     * @param {string=} senderId
     * The senderId of the current sender.
     *
     * @param {boolean=} loadExistingLink
     * Pass true if the link already exists and should be loaded.
     *
     * @returns {promise} The modal instance
     */
    function open(senderId, fileId, loadExistingLink) {
      return modalService.open({
        templateUrl: 'app/commons/ui/components/file-library/public-link-modal/public-link-modal.html',
        controller: 'PublicLinkModalController',
        resolve: {
          fileId: function () {
            return fileId || '';
          },
          senderId: function () {
            return senderId || '';
          },
          link: /*@ngInject*/ function (FilePublicLinkModel) {
            return loadExistingLink ? FilePublicLinkModel.getLink(senderId, fileId) : null;
          }
        }
      });
    }
  }

})(angular);
