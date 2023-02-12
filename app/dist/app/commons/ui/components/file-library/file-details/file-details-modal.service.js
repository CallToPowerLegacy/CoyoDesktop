(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .factory('fileDetailsModalService', fileDetailsModalService)
      .controller('FileDetailsModalController', FileDetailsModalController);

  /**
   * @ngdoc service
   * @name  commons.ui.fileDetailsModalService
   *
   * @description
   * Service to show modal with file information and file preview
   *
   * @requires $uibModal
   */
  function fileDetailsModalService($uibModal) {

    return {
      open: open,
      close: close
    };

    /**
     * @ngdoc method
     * @name commons.ui.fileDetailsModalService#open
     * @methodOf commons.ui.fileDetailsModalService
     *
     * @description
     * Open modal with file details and preview
     *
     * @param {string} senderId
     * The ID of the sender the file belongs to
     *
     * @param {string} fileId
     * The ID of the file to show the details view for
     *
     * @param {boolean=} linkToFileLibrary
     * If true a link to the file library will be displayed in the details actions. Useful when deep-linking files.
     *
     * @returns {object} modalDetails
     * Returns a promise
     */
    function open(senderId, fileId, linkToFileLibrary) {
      return $uibModal.open({
        animation: true,
        backdrop: 'static',
        templateUrl: 'app/commons/ui/components/file-library/file-details/file-details-modal.html',
        controller: 'FileDetailsModalController',
        controllerAs: '$ctrl',
        resolve: {
          sender: function (SenderModel) {
            return SenderModel.get(senderId);
          },
          file: function (FileModel) {
            return FileModel.getWithPermissions({senderId: senderId, id: fileId}, {}, ['manage', 'publicLink', 'comment', 'like']);
          },
          linkToFileLibrary: function () {
            return linkToFileLibrary || false;
          }
        },
        size: '',
        bindToController: true,
        windowTopClass: 'modal-file-details'
      });
    }

    /**
     * @ngdoc method
     * @name  commons.ui.fileDetailsModalService#close
     * @methodOf commons.ui.fileDetailsModalService
     *
     * @description
     * Closes the modal
     *
     * @param {object} uibModalInstance
     * Instance of the current modal
     */
    function close(uibModalInstance) {
      uibModalInstance.dismiss();
    }
  }

  function FileDetailsModalController($log, $q, $filter, $uibModalInstance, $timeout, coyoNotification, Upload,
                                      DocumentModel, backendUrlService, coyoEndpoints, fileLibraryModalService, sender,
                                      file, linkToFileLibrary) {
    var vm = this;

    vm.sender = sender;
    vm.file = file;
    vm.fileType = $filter('fileTypeName')(file.contentType);
    vm.linkToFileLibrary = linkToFileLibrary;
    vm.$onInit = onInit;
    vm.openFileLibrary = openFileLibrary;
    vm.selectVersion = selectVersion;
    vm.loadFileVersions = loadFileVersions;
    vm.uploadVersion = uploadVersion;
    vm.restoreVersion = restoreVersion;
    vm.getDownloadUrlForVersion = getDownloadUrlForVersion;
    vm.switchTab = switchTab;
    vm.previewUrl = coyoEndpoints.sender.preview;
    vm.fileLink = _getDownloadUrl();

    vm.previewOptions = {
      showPdfDesktop: true
    };

    vm.tabs = {
      active: 1,
      INFORMATION: 1,
      HISTORY: 2
    };

    function switchTab(tab) {
      vm.tabs.active = tab;

      if (tab === vm.tabs.INFORMATION) {
        selectVersion(vm.versions.content[0]);
      } else if (tab === vm.tabs.HISTORY) {
        loadFileVersions();
      }
    }

    function openFileLibrary() {
      $uibModalInstance.dismiss();

      fileLibraryModalService.open(sender, {
        highlightedFileId: file.id,
        initialFolder: file.parent
      });
    }

    function selectVersion(version) {
      if (vm.currentVersionNumber === version.versionNumber) {
        return;
      }
      vm.currentVersion = version;
      vm.currentVersionNumber = version.versionNumber;
      var file = new DocumentModel(vm.file);
      vm.preview.url = file.getVersionPreviewUrl(version);
    }

    function loadFileVersions() {
      if (vm.versions.content.length === 0) {
        _refreshFileVersions();
      }
    }

    /**
     * Uploads a new version of a file.
     *
     * @param {object} fileModel
     * The file model (with the old file data)
     *
     * @param {object} files
     * List of valid files to be uploaded as a new version. Only the first one will be used.
     *
     * @returns {promise} A promise
     */
    function uploadVersion(fileModel, files) {
      var fileData;

      if (!angular.isArray(files)) {
        fileData = files;
      } else {
        fileData = files[0];
      }

      if (!fileData) {
        return $q.resolve();
      }

      if (fileModel.contentType !== fileData.type) {
        coyoNotification.error('FILE_LIBRARY.ERROR.VERSION.CONTENT_TYPE');
        return $q.resolve();
      }

      var url = coyoEndpoints.sender.versions.replace('{{senderId}}', vm.sender.id).replace('{{id}}', fileModel.id);

      // Attention: Don't set the name of the uploaded file, it cannot be changed!
      fileModel.contentType = fileData.type;

      return _uploadFile(fileModel, fileData, url).then(function () {
        $uibModalInstance.dismiss({file: fileModel, action: 'refreshAndReopen'});
      });
    }

    /**
     * Restores the given version of this view model's file.
     *
     * @param {object} version
     * The version to be restored.
     *
     */
    function restoreVersion(version) {
      new DocumentModel(file).restoreVersion(version.id).then(function () {
        vm.versions._queryParams._page = 0;
        _refreshFileVersions();
      });
    }

    /**
     * Returns the download URL for a specific version.
     *
     * @param {string} versionId
     * @return {string} The download URL for a specific version
     */
    function getDownloadUrlForVersion(versionId) {
      return backendUrlService.getUrl() + new DocumentModel(file).getDownloadUrlForVersion(versionId);
    }

    /**
     * Returns the download URL.
     *
     * @return {string} The download URL
     */
    function _getDownloadUrl() {
      return backendUrlService.getUrl() + new DocumentModel(file).getDownloadUrl();
    }

    function _uploadFile(fileModel, fileData, url) {
      // upload the file
      var data = {
        file: fileData
      };
      if (vm.parent) {
        data.parentId = vm.parent.id;
      }

      fileData.upload = Upload.upload({
        url: url,
        data: data,
        headers: {
          'X-Permissions': ['manage', 'publicLink']
        }
      });

      // fill the dummy with data
      return fileData.upload.then(function (response) {
        var deferred = $q.defer();

        $timeout(function () {
          angular.extend(fileModel, response.data);
          deferred.resolve(fileModel);
        });

        return deferred.promise;
      }, function (error) {
        $log.error('An error occurred while uploading the file ', fileData, error);
        coyoNotification.error('FILE_LIBRARY.ERROR.FILE_UPLOAD', {filename: fileData.name});
      });
    }

    function _refreshFileVersions() {
      vm.versions.loading = true;
      new DocumentModel(file).getVersions(vm.versions._queryParams).then(function (page) {
        vm.versions = page;
        selectVersion(vm.versions.content[0]);
      });
    }

    function onInit() {
      vm.sender = sender;
      vm.file = file;
      vm.previewFile = file;
      vm.fileType = $filter('fileTypeName')(file.contentType);
      vm.fileLink = _getDownloadUrl();
      vm.linkToFileLibrary = linkToFileLibrary;
      vm.previewUrl = coyoEndpoints.sender.preview;
      vm.versions = {
        content: [],
        _queryParams: {
          _page: 0,
          _pageSize: 5,
          _sort: 'created,desc'
        }
      };
      vm.preview = {
        url: coyoEndpoints.sender.preview
      };
    }
  }

})(angular);
