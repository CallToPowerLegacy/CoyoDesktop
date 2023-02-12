(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoFileLibrary', FileLibrary)
      .controller('FileLibraryController', FileLibraryController);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoFileLibrary:coyoFileLibrary
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Renders a file library to browse and (optionally) select files.
   *
   * @param {object=} options
   * The options for the file library as described below.
   *
   * @param {string=} options.selectMode
   * Sets the select mode for the file library. If not set files can't be selected and only browsing and uploading is
   * available. If set valid select modes are 'single' and 'multiple'.
   *
   * @param {boolean=} options.uploadMultiple
   * Determines whether multiple files can be uploaded or only one file at once. Default true.
   *
   * @param {string=} options.filterContentType
   * This can be set to define a filter for content types. If the filter applies, only files of the given content type
   * are selectable. E.g. if you want to allow the user to only select images, set this parameter to 'image'. Note that
   * the content type of the file is checked for any appearance of the given string. So 'image' will apply to `image/*`.
   * Parameter can also be an array of filter types, then it must be used like ['image', 'video'] and will check for any
   * file to match file types of `image/*` and `video/*`.
   *
   * @param {boolean=} options.senderAsRoot
   * If set then the given sender will be used as root of the tree without the possibility to navigate outside of the sender.
   * Requires sender attribute to be set.
   *
   * @param {object=} options.initialFolder
   * If set, the file library will be opened at the specified folder. This only works if the 'sender' is
   * provided and if the folder actually belongs to the sender.
   *
   * @param {boolean=} options.initialFolderAsRoot
   * If true then the initialFolder (which must be set) will be the root of the tree without the possibility to navigate outside of the folder.
   *
   * @param {string=} options.highlightedFileId
   * If set, the file with given ID will be highlighted.
   *
   * @param {object=} sender
   * The sender for the file library. If provided the file library is opened with the given sender being the active
   * view.
   *
   * @param {object=} cropSettings
   * Image crop settings can be passed to control image cropping. See {@link commons.ui.imageCropModal imageCropModal}
   *
   * @param {boolean=} cropSettings.cropImage
   * Boolean flag whether a modal to crop an uploaded image should be displayed after successful upload. This only
   * works if `uploadMultiple` is set to `false`. Default false.
   *
   * @param {object[]=} selectedFiles
   * Currently selected files by the user. Note that this array is reset every time the user triggers the directive.
   *
   * @param {boolean=} modalMode
   * Determines whether this file library is contained in a modal. This is needed to fix the infinate scrolling element
   * in the file listing.
   *
   * @requires $log
   * @requires $injector
   * @requires $timeout
   * @requires $scope
   * @requires $q
   * @requires Upload
   * @requires commons.resource.backendUrlService
   * @requires commons.ui.alertConfirmModalService
   * @requires commons.ui.coyoNotification
   * @requires commons.config.coyoConfig
   * @requires commons.auth.authService
   * @requires commons.ui.filenameModalService
   * @requires coyo.domain.AppModel
   * @requires commons.ui.imageCropModal
   * @requires coyo.domain.FileModel
   * @requires coyo.domain.FolderModel
   * @requires coyo.domain.DocumentModel
   * @requires commons.config.coyoEndpoints
   * @requires commons.resource.Pageable
   * @requires commons.ui.fileDetailsModalService
   */
  function FileLibrary() {
    return {
      restrict: 'E',
      templateUrl: 'app/commons/ui/components/file-library/file-library.html',
      scope: {},
      bindToController: {
        options: '<?',
        sender: '=?',
        cropSettings: '<?',
        selectedFiles: '=?',
        modalMode: '<?'
      },
      controller: 'FileLibraryController',
      controllerAs: '$ctrl'
    };
  }

  function FileLibraryController($log, $injector, $timeout, $scope, $rootScope, $q, Upload, backendUrlService,
                                 alertConfirmModalService, coyoNotification, coyoConfig, authService,
                                 filenameModalService, AppModel, imageCropModal, FileModel, FolderModel, DocumentModel,
                                 coyoEndpoints, Pageable, fileDetailsModalService, publicLinkModalService) {
    var vm = this;
    vm.loading = true;
    vm.loadingMove = {};
    vm.senderTypes = [];
    vm.selectedFiles = [];
    vm.originalSender = vm.sender;
    vm.options = vm.options || {};
    vm.cropSettings = vm.cropSettings || {cropImage: false};
    vm.scrollElement = _determineScrollElementFromScreenSize($rootScope.screenSize);

    vm.openHome = openHome;
    vm.openSender = openSender;
    vm.openSenders = openSenders;
    vm.handleClick = handleClick;
    vm.loadMore = loadMore;
    vm.getDownloadUrl = getDownloadUrl;
    vm.createFolder = createFolder;
    vm.toggleRename = toggleRename;
    vm.renameFile = renameFile;
    vm.uploadVersion = uploadVersion;
    vm.saveNewFolder = saveNewFolder;
    vm.openPublicLinkModal = openPublicLinkModal;
    vm.openFolderModal = openFolderModal;
    vm.openFilenameModal = openFilenameModal;
    vm.uploadFiles = uploadFiles;
    vm.deleteFile = deleteFile;
    vm.isSelected = isSelected;
    vm.isSelectable = isSelectable;
    vm.selectAll = selectAll;
    vm.deselectAll = deselectAll;
    vm.moveFile = moveFile;
    vm.showDetails = showDetails;
    vm.getFileIconTooltip = getFileIconTooltip;

    // watch files dropped onto the drop area and upload them immediately
    $scope.$watch(function () {
      return vm.droppedFiles;
    }, function (newValue) {
      if (newValue) {
        uploadFiles(newValue);
      }
    });

    var deregisterDragStart = $scope.$on('draggable:start', function () {
      $timeout(function () {
        vm.dragging = true;
      }, 100);
    });
    var deregisterDragEnd = $scope.$on('draggable:end', function () {
      $timeout(function () {
        vm.dragging = false; // delay reset until next digest cycle to prevent clicks on element while dragging
      }, 110);
    });
    $scope.$on('$destroy', deregisterDragStart);
    $scope.$on('$destroy', deregisterDragEnd);

    authService.getUser().then(function (user) {
      vm.currentUser = user;

      _initSenderTypes(user);

      if (vm.sender) {
        openSender(vm.sender, vm.options.initialFolder);
      } else {
        openHome();
      }
    });

    authService.onGlobalPermissions('MANAGE_FILES', function (canManageFiles) {
      vm.canManageFiles = canManageFiles;
    });
    var unsubscribeScreenChange = $rootScope.$on('screenSize:changed', function (event, screenSize) {
      vm.scrollElement = _determineScrollElementFromScreenSize(screenSize);
    });
    $scope.$on('$destroy', unsubscribeScreenChange);


    // --------------------------------------------------------------------------------

    /**
     * Opens the home view.
     */
    function openHome() {
      _clear();
      vm.view = 'home';
      vm.loading = false;
    }

    /**
     * Opens the given sender
     *
     * @param {object} sender The sender to open
     * @param {object} initialFolder The folder to open initially
     */
    function openSender(sender, initialFolder) {
      _clear();
      vm.view = 'files';
      vm.sender = sender;
      vm.senderType = _getSenderType(sender);

      if (initialFolder) {
        _openFolder(sender, initialFolder);
      } else {
        _loadFiles(sender);
        _initFolderPermissions(sender);
      }
    }

    /**
     * Opens the sender list view for given sender type.
     *
     * @param {object} senderType Sender type
     */
    function openSenders(senderType) {
      vm.loading = true;

      _clear();
      vm.view = 'senders';
      vm.senderType = senderType;
      _loadSenders(senderType);
    }

    /**
     * Opens or selects the files of given sender with optional parent file.
     *
     * @param {object} sender Sender
     * @param {object} file File to open (optional). If this is a folder, the folder will be opened.
     */
    function handleClick(sender, file) {
      if (file.editMode) {
        return;
      }
      if (vm.dragging) {
        return; // ignore click while dragging
      }

      if (file && !file.folder) {
        _selectFile(sender, file);
      } else {
        _openFolder(sender, file);
      }
    }

    /**
     * Called when the user scrolls down. Loads more items depending on the current view.
     */
    function loadMore() {
      if (vm.loading || !vm.currentPage || vm.currentPage.last) {
        return;
      }

      if (vm.view === 'senders') {
        _loadSenders(vm.senderType);
      } else if (vm.view === 'files') {
        _loadFiles(vm.sender, vm.parent);
        _loadParentFolder(vm.sender, vm.parent).then(function (folder) {
          _initFolderPermissions(vm.sender, folder);
        }).catch(function () {
          _initFolderPermissions(vm.sender);
        });
      }
    }

    /**
     * @param {object} sender Sender of the file
     * @param {object} file The file
     * @returns {string} The download URL
     */
    function getDownloadUrl(sender, file) {
      return backendUrlService.getUrl() + DocumentModel.$url({senderId: sender.id, id: file.id});
    }

    /**
     * Opens a modal which shows details about the given file.
     *
     * @param {object} sender The sender the file belongs to
     * @param {object} file The file to show the details for
     */
    function showDetails(sender, file) {
      if (!file.uploading) {
        return fileDetailsModalService.open(sender.id, file.id).result;
      }

      return $q.reject();
    }

    /**
     * Displays a new folder dummy model that can be persisted via "saveNewFolder".
     */
    function createFolder() {
      var context = {senderId: vm.sender.id};
      if (vm.parent) {
        context.parentId = vm.parent.id;
      }
      vm.newFolder = new FolderModel(context);
      vm.newFolder.folder = true;
    }

    /**
     * Toggles to a state where the filename is displayed in a text input box. In this mode the user can rename the
     * file or folder.
     *
     * @param {object} file
     * The file to toggle the rename mode for.
     */
    function toggleRename(file) {
      vm.newFilename = file.name;
      file.editMode = true;
    }

    /**
     * Renames a file or folder. If the name has not changed or is empty, nothing is done.
     *
     * @param {object} file
     * The file or folder to rename.
     *
     * @param {string} name
     * The new filename to rename the file to.
     */
    function renameFile(file, name) {
      if (!name || file.name === name) {
        file.editMode = false;
        return;
      }

      FileModel.rename(vm.sender.id, file, name).then(function (renamedFile) {
        var index = _.findIndex(vm.files, {id: renamedFile.id});
        if (index >= 0) {
          vm.files[index] = renamedFile;
        }
      }).catch(function () {
        file.editMode = false;
      });
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
      fileModel.progress = 0;
      fileModel.uploading = true;
      fileModel.uploadFailed = false;

      return _uploadFile(fileModel, fileData, url);
    }

    /**
     * Opens a modal dialogue that asks for a folder name. A new folder with this name is created afterwards. This is
     * an alternative way to create a new folder for mobile devices.
     */
    function openFolderModal() {
      filenameModalService.open('FILE_LIBRARY.MODAL.TITLE.CREATE_FOLDER').then(function (folderName) {
        createFolder();
        saveNewFolder(vm.newFolder, folderName);
      });
    }

    /**
     * Opens a modal dialogue that lets the user create a public link for the given file.
     */
    function openPublicLinkModal(senderId, file) {
      publicLinkModalService.open(senderId, file.id, file.hasPublicLink).result.catch(function (link) {
        file.hasPublicLink = link !== null;
        file.activePublicLink = file.hasPublicLink && link.active;
      });
    }

    /**
     * Opens a modal dialogue that lets the user rename the given file. This is an alternative way to rename an
     * existing file or folder for mobile devices.
     */
    function openFilenameModal(file) {
      filenameModalService.open('FILE_LIBRARY.MODAL.TITLE.RENAME', file.name).then(function (fileName) {
        renameFile(file, fileName);
      });
    }

    /**
     * Saves the new folder dummy model if a folder name is present.
     * Deletes the new folder dummy model if not.
     */
    function saveNewFolder(folder, name) {
      if (folder && name) {
        folder.name = name;
        folder.createWithPermissions(['manage']).then(function (newFolder) {
          vm.files.unshift(newFolder);
        }).finally(function () {
          vm.newFolder = null;
        });
      } else {
        vm.newFolder = null;
      }
    }

    /**
     * Simultaneously uploads given files. Sets the progress for every file.
     *
     * @param {object[]} files A list of files that should be uploaded.
     */
    function uploadFiles(files) {
      if (!angular.isArray(files)) {
        files = [files];
      }

      angular.forEach(files, function (file) {
        // create a new file
        var newFile = {
          name: file.name,
          contentType: file.type,
          folder: false,
          progress: 0,
          uploading: true,
          uploadFailed: false
        };

        // crop image before the upload
        var canCrop = (newFile.contentType.indexOf('image') > -1);
        var promise;
        var url = coyoEndpoints.sender.documents.replace('{{senderId}}', vm.sender.id).replace('/{{id}}', '');
        if (!vm.options.uploadMultiple && vm.cropSettings.cropImage && canCrop) {
          promise = imageCropModal.open(file, vm.cropSettings).then(function (croppedImage) {
            vm.files.unshift(newFile);
            return _uploadFile(newFile, Upload.dataUrltoBlob(croppedImage, file.name), url);
          });
        } else {
          vm.files.unshift(newFile);
          if (vm.options.uploadMultiple && vm.cropSettings.cropImage) {
            $log.warn('[FileLibrary] Cropping images does not work for multiple uploads. Skipping cropping.');
          }
          if (vm.cropSettings.cropImage && !canCrop) {
            $log.warn('[FileLibrary] The uploaded file does not have the correct content type. Skipping cropping.');
          }
          promise = _uploadFile(newFile, file, url);
        }

        promise.then(function () {
          if (vm.options.selectMode) {
            _selectFile(null, newFile);
          }
        });
      });
    }

    /**
     * Moves the given file to its destination with a new parent.
     *
     * @param {object} source The file to be moved
     * @param {object} destination The new parent of the file
     */
    function moveFile(source, destination) {
      if (source && vm.loadingMove[source.id]) {
        return; // file is already being moved
      } else if (destination && (!destination.folder || source.id === destination.id)) {
        return; // file cannot be moved to this destination
      }

      vm.loadingMove[source.id] = true;
      var destinationId = destination ? destination.id : null;
      FileModel.move(vm.sender.id, source.id, destinationId).then(function () {
        _.remove(vm.files, {id: source.id});
        if (destination) {
          destination.childCount++;
        }
      }).finally(function () {
        delete vm.loadingMove[source.id];
      });
    }

    /**
     * Deletes the given file (document or folder). The user has to confirm this action before it is triggered.
     *
     * @param {object} file The file to be deleted
     */
    function deleteFile(file) {
      var confirmOptions = {
        title: 'FILE_LIBRARY.MODAL.REMOVE.TITLE',
        text: 'FILE_LIBRARY.MODAL.REMOVE.TEXT',
        translationContext: {filename: file.name}
      };

      var promise = $q.resolve();

      if (file.folder && vm.sender) {
        promise = FolderModel.getSettings(vm.sender.id, file.id).then(function (folderSettings) {
          if (folderSettings.appLockId) {
            return AppModel.get({
              id: folderSettings.appLockId,
              senderId: vm.sender.id
            }).then(function (app) {
              angular.extend(confirmOptions, {
                alerts: [{
                  alertClass: 'alert-danger',
                  alertTitle: 'FILE_LIBRARY.MODAL.REMOVE.ALERT_TITLE',
                  alertText: 'FILE_LIBRARY.MODAL.REMOVE.ALERT_TEXT'
                }]
              });
              angular.extend(confirmOptions.translationContext, {
                appName: app.name
              });
            });
          }
          return null;
        });
      }

      promise.then(function () {
        alertConfirmModalService.confirm(confirmOptions).then(function () {
          vm.loading = true;
          var url = FileModel.$url({
            id: file.id,
            senderId: vm.sender.id
          });
          FileModel.$delete(url).then(function () {
            var index = _.findIndex(vm.files, {id: file.id});
            if (index >= 0) {
              vm.files.splice(index, 1);
            }
          }).finally(function () {
            vm.loading = false;
          });
        });
      });
    }

    /**
     * Select all currently displayed files
     */
    function selectAll() {
      angular.forEach(vm.files, function (file) {
        if (file && !file.folder && !isSelected(file)) {
          file.senderId = vm.sender.id;
          vm.selectedFiles.push(file);
        }
      });
    }

    /**
     * Deselect all currently displayed files
     */
    function deselectAll() {
      angular.forEach(vm.files, function (file) {
        if (file && !file.folder && isSelected(file)) {
          _.remove(vm.selectedFiles, {id: file.id});
        }
      });
    }

    /**
     * Checks whether the given file is currently selected.
     *
     * @param {object} file The file to check for selection
     * @returns {boolean} "true" if the given file is currently selected, "false" else
     */
    function isSelected(file) {
      return angular.isDefined(_.find(vm.selectedFiles, {id: file.id}));
    }

    /**
     * Checks whether the file/folder is currently selectable. Folders are not selectable by default (except in selectMode 'folder').
     *
     * @param {object} file The file to be checked
     * @returns {boolean} "true" if the file is currently selectable, "false" else
     */
    function isSelectable(file) {
      if (vm.options.selectMode === 'folder') {
        return file.folder;
      }
      if (file.uploading || file.uploadFailed) {
        return false;
      }
      if (vm.options.filterContentType && !file.folder) {
        return angular.isDefined(file.contentType) && matchesFilteredContentType(vm.options.filterContentType,
            file.contentType);
      }
      return true;
    }

    function matchesFilteredContentType(filterType, fileType) {
      return _.isArray(filterType) ? _.some(filterType, function (type) {
        return fileType.indexOf(type) > -1;
      }) : fileType.indexOf(filterType) > -1;
    }

    function getFileIconTooltip(file) {
      return (file.appRoot) ? 'FILE_LIBRARY.APP_ROOT_FOLDER_TOOLTIP' : undefined;
    }

    // --------------------------------------------------------------------------------

    function _initSenderTypes(currentUser) {
      vm.senderTypes = angular.copy(coyoConfig.fileLibrary.senderTypes);
      _.forEach(vm.senderTypes, function (senderType) {
        if (senderType.permission) {
          senderType.hasPermission = currentUser.hasGlobalPermissions(senderType.permission);
          authService.onGlobalPermissions(senderType.permission, function (hasPermission) {
            senderType.hasPermission = hasPermission;
          });
        } else {
          senderType.hasPermission = true;
        }
      });
    }

    function _clear() {
      vm.view = null;
      vm.sender = null;
      vm.files = null;
      vm.parent = null;
      vm.parentDropZone = false;
      vm.breadcrumbs = null;
      vm.senders = null;
      vm.senderType = null;
      vm.currentPage = null;
    }

    function _openFolder(sender, file) {
      _clear();
      vm.view = 'files';
      vm.sender = sender;
      vm.senderType = _getSenderType(sender);
      vm.parentDropZone = file && (!vm.options.initialFolderAsRoot || file.id !== vm.options.initialFolder.id);

      _loadFiles(sender, file);
      _loadParentFolder(sender, file).then(function (folder) {
        vm.parent = folder;
        _initFolderPermissions(sender, folder);
        vm.breadcrumbs = _initBreadcrumbs(folder);
      }).catch(function () {
        _initFolderPermissions(sender);
      });
    }

    function _handleFileUpdate(payload) {
      if (payload) {
        var fileModel = _.get(payload, 'file');
        switch (_.get(payload, 'action', '')) {
          case 'refresh':
            _updateFile(fileModel.id, fileModel);
            break;
          case 'refreshAndReopen':
            if (_updateFile(fileModel.id, fileModel)) {
              handleClick(vm.sender, fileModel);
            }
            break;
        }
      }
    }

    function _selectFile(sender, file) {
      if (file && !file.folder && isSelectable(file) && !file.isOpen) {
        // no selection mode or file is filtered
        if (!vm.options.selectMode) {
          file.isOpen = true;
          return showDetails(sender, file)
              .catch(function (payload) {
                _handleFileUpdate(payload);
              }).finally(function () {
                file.isOpen = false;
                return undefined;
              });
        }

        // handle single selection
        if (vm.options.selectMode === 'single') {
          file.senderId = vm.sender.id;
          vm.selectedFiles = [file];
          return undefined;
        }

        // handle multiple selection
        if (isSelected(file)) {
          _.remove(vm.selectedFiles, {id: file.id});
        } else {
          file.senderId = vm.sender.id;
          vm.selectedFiles.push(file);
        }
      }
      return undefined;
    }

    function _updateFile(id, replacementFile) {
      var index = _.findIndex(vm.files, {id: id});
      if (index >= 0) {
        vm.files[index] = replacementFile;
      }

      return index >= 0;
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
          fileModel.uploading = false;

          angular.extend(fileModel, response.data);
          if (_updateFile(fileModel.id, response.data)) {
            deferred.resolve(response.data);
          }

          deferred.resolve(fileModel);
        });

        return deferred.promise;
      }, function (error) {
        fileModel.uploadFailed = true;
        $log.error('An error occurred while uploading the file ', fileData, error);
        coyoNotification.error('FILE_LIBRARY.ERROR.FILE_UPLOAD', {filename: fileData.name});
      }, function (evt) {
        fileModel.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      });
    }

    function _loadSenders(senderType) {
      vm.loading = true;

      if (!vm.senders) {
        vm.senders = [];
      }
      var page = new Pageable((vm.currentPage ? vm.currentPage.number + 1 : 0), 30);
      $injector.invoke(senderType.query, undefined, page).then(function (page) {
        vm.currentPage = page;
        vm.senders.push.apply(vm.senders, page.content);
      }).finally(function () {
        vm.loading = false;
      });
    }

    function _getSenderType(sender) {
      return (sender) ? vm.senderTypes[sender.typeName] : null;
    }

    function _loadFiles(sender, parent) {
      vm.loading = true;

      if (!vm.files) {
        vm.files = [];
      }

      var queryParams = {};
      if (parent) {
        queryParams.parentId = parent.id;
      }

      var page = new Pageable((vm.currentPage ? vm.currentPage.number + 1 : 0), 30, ['folder,DESC', 'name']);

      FileModel.pagedQueryWithPermissions(page, queryParams, {senderId: sender.id}, ['manage', 'publicLink'])
          .then(function (page) {
            vm.currentPage = page;
            vm.files.push.apply(vm.files, page.content);
            if (vm.options.selectMode === 'folder' && parent) {
              vm.selectedFiles = [parent];
            }
          })
          .finally(function () {
            vm.loading = false;
          });
    }

    function _loadParentFolder(sender, parent) {
      if (sender && parent) {
        return FileModel.getWithPermissions({
          id: parent.id,
          senderId: sender.id
        }, null, ['manage']).then(function (folder) {
          return folder;
        }).catch(function (errorResponse) {
          if (_.get(errorResponse, 'data.errorStatus') === 'NOT_FOUND') {
            vm.folderNotFound = true;
          }
        });
      }
      return $q.reject();
    }

    function _initFolderPermissions(sender, folder) {
      vm.canManageFolder = false;
      if (folder) {
        vm.canManageFolder = folder._permissions.manage;
      } else if (sender) {
        vm.canManageFolder = _.get(sender, '_permissions.createFile');
      }
    }

    function _initBreadcrumbs(cursor) {
      var breadcrumbs = [];
      do {
        if (vm.options.initialFolder && vm.options.initialFolderAsRoot && cursor.id === vm.options.initialFolder.id) {
          break;
        }
        breadcrumbs.push(cursor);
        cursor = cursor.parent;
      } while (cursor);
      return breadcrumbs.reverse();
    }

    function _determineScrollElementFromScreenSize(screenSize) {
      if (vm.modalMode) {
        if (screenSize.isXs) {
          return '.modal-body';
        } else {
          return '.modal';
        }
      } else if (screenSize.isXs || screenSize.isSm) {
        return '$window';
      } else {
        return '.body';
      }
    }

  }

})(angular);
