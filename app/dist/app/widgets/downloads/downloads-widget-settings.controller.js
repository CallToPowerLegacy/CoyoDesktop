(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.downloads')
      .controller('DownloadsWidgetSettingsController', DownloadsWidgetSettingsController);

  function DownloadsWidgetSettingsController($scope, SenderModel, FileModel, $translate, utilService, $q) {
    var vm = this;

    vm.model = $scope.model;

    $scope.$watch(function () { return vm.model.selectedFiles; }, function (newVal, oldVal) {
      if (oldVal !== newVal) {
        vm.model.settings._files = _.map(vm.model.selectedFiles, function (file) {
          return {
            senderId: file.senderId,
            id: file.id,
            title: file.title,
            name: file.originalName || file.name
          };
        });
      }
    });

    function getFile(file) {
      // Set empty file ids to false, because otherwise it will get all files of the sender
      var fileId = file.id ? file.id : false;
      return FileModel.get({senderId: file.senderId, id: fileId}).then(function (loadedFile) {
        loadedFile.senderId = file.senderId;
        loadedFile.title = file.title;
        return loadedFile;
      }).catch(function () {
        return $translate('WIDGETS.DOWNLOADS.UNABLE_TO_LOAD').then(function (msg) {
          return {
            title: file.title,
            name: ('<' + msg + ' ' + file.name + '>'),
            originalName: file.name,
            id: fileId || utilService.uuid(),
            senderId: file.senderId
          };
        });
      });
    }

    (function _init() {
      vm.loading = true;

      var senderIdOrSlug = SenderModel.getCurrentIdOrSlug();
      if (angular.isDefined(senderIdOrSlug)) {
        SenderModel.getWithPermissions(senderIdOrSlug, {}, ['manage']).then(function (sender) {
          vm.model.settings._sender = sender;
        });
      }

      if (vm.model.settings._files) {
        $q.all(_.map(vm.model.settings._files, getFile)).then(function (loadedFiles) {
          vm.model.selectedFiles = loadedFiles;
          vm.loading = false;
        });
      } else {
        vm.loading = false;
      }
    })();
  }

})(angular);
