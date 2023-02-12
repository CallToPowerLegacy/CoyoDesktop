(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.file-library')
      .controller('FileLibraryAppSettingsController', FileLibraryAppSettingsController);

  function FileLibraryAppSettingsController($q, $scope, SenderModel) {
    var vm = this;
    vm.$onInit = onInit;

    vm.app = $scope.model;
    vm.isNewApp = (!vm.app.id);
    vm.options = {
      senderAsRoot: true,
      selectMode: 'folder'
    };
    vm.app.settings.modifyRole = vm.app.settings.modifyRole || 'NONE';

    vm.setAppFolderPermissions = setAppFolderPermissions;

    function onInit() {
      SenderModel.getWithPermissions(SenderModel.getCurrentIdOrSlug(), null, ['manage', 'createFile'])
          .then(function (sender) {
            vm.sender = sender;
            vm.app.senderId = sender.id;
          });
      vm.setAppFolderPermissions();
    }

    function setAppFolderPermissions() {
      vm.app.settings.folderPermissions = vm.app.settings.folderPermissions || {};
      if (vm.app.settings.modifyRole === 'NONE') {
        vm.app.settings.folderPermissions.modifyRole = 'VIEWER';
      } else {
        vm.app.settings.folderPermissions.modifyRole = vm.app.settings.modifyRole;
      }
    }
  }

})(angular);

