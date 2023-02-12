(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.file-library')
      .controller('FileLibraryAppMainController', FileLibraryAppMainController);

  function FileLibraryAppMainController(app, sender) {
    var vm = this;
    vm.app = app;
    vm.sender = sender;
    vm.fileLibraryOptions = {
      uploadMultiple: true,
      senderAsRoot: !app.rootFolderId,
      initialFolder: {id: app.rootFolderId},
      initialFolderAsRoot: !!app.rootFolderId
    };
  }

})(angular);
