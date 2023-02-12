(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.singlefile')
      .controller('SingleFileWidgetSettingsController', SingleFileWidgetSettingsController);

  function SingleFileWidgetSettingsController($scope, SenderModel, FileModel, $translate) {
    var vm = this;
    vm.model = $scope.model;

    // Change selected File
    $scope.$watch(function () { return vm.model.selectedFile; }, function (newVal, oldVal) {
      if (oldVal !== newVal) {
        if (vm.model.selectedFile) {
          vm.model.settings._fileId = newVal.id;
          // When modal closes without changes and no senderId is present, save the current senderId from model settings
          vm.model.settings._senderId = newVal.senderId || vm.model.settings._senderId;
        } else {
          vm.model.settings._fileId = undefined;
          vm.model.settings._senderId = undefined;
        }
      }
    });

    function getFile() {
      // Set empty file ids to false, because otherwise it will get all files of the sender
      var fileId = vm.model.settings._fileId ? vm.model.settings._fileId : false;

      return FileModel.get({senderId: vm.model.settings._senderId, id: fileId}).then(function (loadedFile) {
        loadedFile.title = vm.model.settings.title || loadedFile.name;
        return loadedFile;
      }).catch(function () {
        return $translate('WIDGET.SINGLEFILE.UNABLE_TO_LOAD').then(function (msg) {
          return {
            title: null,
            name: ('<' + msg + '>'),
            originalName: null,
            id: fileId,
            senderId: vm.model.settings._senderId
          };
        });
      });
    }

    (function _init() {
      vm.loading = true;

      // check mode
      var senderIdOrSlug = SenderModel.getCurrentIdOrSlug();
      if (angular.isDefined(senderIdOrSlug)) {
        SenderModel.getWithPermissions(senderIdOrSlug, {}, ['createFile']).then(function (sender) {
          vm.sender = sender;
        });
      }
      // preselect file
      if (vm.model.settings._fileId) {
        getFile().then(function (file) {
          vm.model.selectedFile = file;
          vm.loading = false;
        });
      } else {
        vm.loading = false;
      }
    })();
  }
})(angular);
