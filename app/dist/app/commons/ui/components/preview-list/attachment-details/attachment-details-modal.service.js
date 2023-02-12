(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .factory('attachmentDetailsModalService', attachmentDetailsModalService)
      .controller('AttachmentDetailsModalController', AttachmentDetailsModalController);

  /**
   * @ngdoc service
   * @name  commons.ui.attachmentDetailsModalService
   *
   * @description
   * Service to show modal with attachment information and attachment preview
   *
   * @requires $uibModal
   */
  function attachmentDetailsModalService($uibModal) {
    return {
      open: open,
      close: close
    };

    /**
     * @ngdoc method
     * @name  commons.ui.attachmentDetailsModalService#open
     * @methodOf commons.ui.attachmentDetailsModalService
     *
     * @description
     * Open modal with attachment details and preview
     *
     * @param {string} groupId
     * The group ID to be replaced in the URL
     *
     * @param {object} attachment
     * The attachment to get the preview of.
     *
     * @param {string} backendUrl
     * The backend URL to generate the download URL
     *
     * @param {object} author
     * The author to display the name of the author
     *
     * @param {string} previewUrl
     * The URL to check the available preview formats
     *
     * @returns {object} modalDetails
     * Returns a promise
     */
    function open(groupId, attachment, backendUrl, author, previewUrl) {
      return $uibModal.open({
        animation: true,
        backdrop: 'static',
        templateUrl: 'app/commons/ui/components/preview-list/attachment-details/attachment-details-modal.html',
        controller: 'AttachmentDetailsModalController',
        controllerAs: '$ctrl',
        resolve: {
          groupId: function () { return groupId; },
          attachment: function () { return attachment; },
          backendUrl: function () { return backendUrl; },
          author: function () { return author; },
          previewUrl: function () { return previewUrl; }
        },
        size: '',
        windowTopClass: 'modal-file-details'
      });
    }

    /**
     * @ngdoc method
     * @name  commons.ui.attachmentDetailsModalService#close
     * @methodOf commons.ui.attachmentDetailsModalService
     *
     * @description
     * Closes the modal
     *
     * @param {object} uibModalInstance
     * Instance of the current modal
     */
    function close(uibModalInstance) {
      uibModalInstance.dissmiss();
    }
  }

  function AttachmentDetailsModalController($filter, groupId, attachment, backendUrl, author, previewUrl) {
    var vm = this;
    vm.groupId = groupId;
    vm.attachment = attachment;
    vm.backendUrl = backendUrl;
    vm.author = author;
    vm.fileType = $filter('fileTypeName')(attachment.contentType);
    vm.previewUrl = previewUrl;
    vm.downloadUrl = vm.backendUrl + previewUrl.replace('{{groupId}}', vm.groupId).replace('{{id}}', vm.attachment.id);

    vm.previewOptions = {
      showPdfDesktop: true
    };
  }
})(angular);
