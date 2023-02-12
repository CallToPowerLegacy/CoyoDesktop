(function (angular) {
  'use strict';

  angular
      .module('coyo.senders')
      .controller('SenderFilesController', SenderFilesController);

  /**
   * Controller for the workspace or pages files view
   */
  function SenderFilesController(sender) {
    var vm = this;
    vm.sender = sender;
    vm.fileLibraryOptions = {
      uploadMultiple: true,
      senderAsRoot: true
    };
  }

})(angular);
