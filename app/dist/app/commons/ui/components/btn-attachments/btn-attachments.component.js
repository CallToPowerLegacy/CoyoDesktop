(function () {
  'use strict';

  angular
      .module('commons.ui')
      .component('coyoBtnAttachments', attachmentButton())
      .controller('attachmentButtonController', attachmentButtonController);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoBtnAttachments:coyoBtnAttachments
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Renders an attachment button with an context menu. The context menu has two options:
   * Upload File and Select from file Library.
   *
   * @param {expression} onSelectAttachments
   * Callback when files are selected to upload
   *
   * @param {expression} onSelectFileLibrary
   * Callback when file library files are selected
   *
   * @param {boolean} active
   * Flag that indicates if the button should have active class
   *
   * @param {object} author
   * The current author in which context the file library should be opened
   *
   * @param {string} contextId
   * The context in which the button is created (e.g. WS or Page id)
   *
   * @param {string} timelineType
   * The type of the timeline the attachment are supposed to be added. If not 'personal' the fileLibrary is opened with
   * the contextId as starting point. Default is 'personal'.
   *
   */
  function attachmentButton() {
    return {
      templateUrl: 'app/commons/ui/components/btn-attachments/btn-attachments.html',
      bindings: {
        onSelectAttachments: '&',
        onSelectFileLibrary: '&',
        active: '<',
        author: '<',
        contextId: '@',
        timelineType: '<'
      },
      controller: 'attachmentButtonController'
    };
  }

  function attachmentButtonController(fileLibraryModalService, utilService) {
    var vm = this;
    vm.$onInit = _init();
    vm.openFileLibrary = openFileLibrary;

    function openFileLibrary() {

      fileLibraryModalService.open(vm.timelineType === 'personal' ? vm.author : {id: vm.contextId},
          {selectMode: 'multiple'})
          .then(function (selectedFiles) {
            var attachments = _.map(selectedFiles, function (elem) {
              return {
                fileId: elem.id,
                senderId: elem.senderId,
                displayName: elem.displayName
              };
            });
            vm.onSelectFileLibrary({files: attachments});
          });
    }

    function _init() {
      vm.uuid = utilService.uuid();
      if (!vm.timelineType) {
        vm.timelineType = 'personal';
      }
    }
  }
})();
