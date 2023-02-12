(function () {
  'use strict';

  angular
      .module('commons.ui')
      .component('coyoPreviewList', previewList())
      .controller('PreviewListController', PreviewListController);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoPreviewList:coyoPreviewList
   * @restrict E
   * @scope
   *
   * @description
   * Renders a list of preview images in a grid. Files without previews will be considered and displayed in a seprarate
   * listview. The first image of the grid will be displayed over the full width of the directive.
   *
   * @param {array} attachments
   * An array with all files {objects}
   *
   * @param {string} groupId
   * The group ID to be replaced in the URL
   *
   * @param {string} backendUrl
   * The backend URL to generate the download URL in the modal
   *
   * @param {object} author
   * The author to display the name of the author in the modal
   *
   * @param {string} previewUrl
   * The preview URL to generate the preview
   *
   * @param {string} size
   * The size of the preview. Possible values are xs, sm, md, lg and xl and original. Default: md.
   *
   * @requires $rootScope
   * @requires attachmentDetailsModalService
   */
  function previewList() {
    return {
      restrict: 'E',
      templateUrl: 'app/commons/ui/components/preview-list/preview-list.html',
      scope: {},
      bindings: {
        attachments: '<',
        groupId: '<',
        backendUrl: '<',
        author: '<',
        previewUrl: '<',
        size: '@?',
        sameSize: '='
      },
      controller: 'PreviewListController',
      controllerAs: '$ctrl'
    };
  }

  function PreviewListController($rootScope, attachmentDetailsModalService, CapabilitiesModel, coyoEndpoints,
                                 FileModel, fileDetailsModalService) {
    var vm = this;
    vm.imageSize = vm.size || 'xl';
    vm.showDetails = showDetails;
    vm.getPreviewUrl = getPreviewUrl;
    vm.getGroupId = getGroupId;

    angular.forEach(vm.attachments, function (attachment) {
      CapabilitiesModel.imgAvailable(attachment.contentType).then(function (available) {
        attachment.previewAvailable = available;
      });
      $rootScope.$on('previewNotAvailable', function (e, id) {
        if (attachment.id === id && attachment.previewAvailable) {
          attachment.previewAvailable = false;
        }
      });
    });

    // show attachment details
    function showDetails(attachment) {
      if (attachment.fileLibraryAttachment) {
        fileDetailsModalService.open(attachment.senderId, attachment.id, true);
      } else {
        openModal(attachment);
      }
    }

    function openModal(attachment) {
      attachmentDetailsModalService.open(getGroupId(attachment),
          attachment,
          vm.backendUrl,
          vm.author,
          getPreviewUrl(attachment));
    }

    function getGroupId(file) {
      if (file.fileLibraryAttachment) {
        return file.senderId;
      } else {
        return vm.groupId;
      }
    }

    function getPreviewUrl(file) {
      if (file.fileLibraryAttachment) {
        return coyoEndpoints.sender.preview;
      } else {
        return vm.previewUrl;
      }
    }

  }
})();
