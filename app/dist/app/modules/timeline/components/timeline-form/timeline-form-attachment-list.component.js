(function () {
  'use strict';

  angular
      .module('coyo.timeline')
      .component('oyocTimelineFormAttachmentList', oyocTimelineFormAttachmentList())
      .controller('TimelineFormAttachmentListController', TimelineFormAttachmentListController);

  /**
   * @ngdoc directive
   * @name commons.ui.oyocTimelineFormAttachmentList:oyocTimelineFormAttachmentList
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Renders the attachment list for the timeline item form
   *
   * @param {array} attachments
   * Files selected to upload
   *
   * @param {array} fileLibraryAttachments
   * Selected file library files
   *
   */
  function oyocTimelineFormAttachmentList() {
    return {
      templateUrl: 'app/modules/timeline/components/timeline-form/timeline-form-attachment-list.html',
      bindings: {
        attachments: '=',
        fileLibraryAttachments: '='
      },
      controller: 'TimelineFormAttachmentListController'
    };
  }

  function TimelineFormAttachmentListController() {
    var vm = this;
    vm.removeAttachment = removeAttachment;
    vm.removeFileLibraryAttachment = removeFileLibraryAttachment;

    function removeAttachment(file) {
      vm.attachments = _.reject(vm.attachments, file);
    }

    function removeFileLibraryAttachment(file) {
      vm.fileLibraryAttachments = _.reject(vm.fileLibraryAttachments, file);
    }
  }
})();
