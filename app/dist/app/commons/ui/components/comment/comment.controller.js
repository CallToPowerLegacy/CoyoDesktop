(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .controller('CommentController', CommentController);

  /**
   * Controller for managing a comment.
   *
   * @requires backendUrlService
   * @requires coyoEndpoints
   * @requires authService
   *
   * @constructor
   */
  function CommentController($rootScope, $scope, $timeout, backendUrlService, coyoEndpoints, authService, tempUploadService) {
    var vm = this;

    vm.$onInit = onInit;
    vm.edit = edit;
    vm.remove = remove;
    vm.toggleOriginalAuthor = toggleOriginalAuthor;

    vm.formKeyPress = formKeyPress;
    vm.isUploading = isUploading;
    vm.submitForm = submitForm;
    vm.resetForm = resetForm;
    vm.addAttachments = addAttachments;
    vm.removeAttachment = removeAttachment;
    vm.addFileLibraryAttachments = addFileLibraryAttachments;
    vm.removeFileLibraryAttachment = removeFileLibraryAttachment;

    function edit() {
      vm.formModel = angular.copy(vm.ngModel);
      vm.formModel.attachments = _getAttachments(vm.ngModel);
      vm.formModel.fileLibraryAttachments = _getFileLibraryAttachments(vm.ngModel, true);

      vm.editMode = true;
      $rootScope.showBackdrop = false;
    }

    function remove() {
      vm.ngModel.delete();
    }

    function toggleOriginalAuthor() {
      if (!vm.originalAuthor) {
        vm.ngModel.getOriginalAuthor().then(function (originalAuthor) {
          vm.originalAuthor = originalAuthor;
          vm.originalAuthorDisplayed = !vm.originalAuthorDisplayed;
        });
      } else {
        vm.originalAuthorDisplayed = !vm.originalAuthorDisplayed;
      }
    }

    function formKeyPress($event) {
      if ($event.keyCode === 13 && !$event.ctrlKey && !$event.shiftKey) {
        $event.preventDefault();
        submitForm();
      }
    }

    function isUploading() {
      return _.filter(vm.formModel.attachments, {uploading: true}).length > 0;
    }

    function submitForm() {
      var oldAttachments = _getAttachments(vm.ngModel);
      var oldFileLibraryAttachments = _getFileLibraryAttachments(vm.ngModel, true);

      var ngModelAttachmentIds = _mapToIds(oldAttachments, 'id');
      var ngModelFileLibAttachmentIds = _mapToIds(oldFileLibraryAttachments, 'fileId');
      var formModelAttachmentIds = _mapToIds(vm.formModel.attachments, 'id');
      var formModelFileLibAttachmentIds = _mapToIds(vm.formModel.fileLibraryAttachments, 'fileId');

      // check whether anything changed
      if (vm.ngModel.message === vm.formModel.message
          && _.isEqual(ngModelAttachmentIds, formModelAttachmentIds)
          && _.isEqual(ngModelFileLibAttachmentIds, formModelFileLibAttachmentIds)) {
        resetForm(true);

        return null;
      }

      if (vm.form.$valid && !isUploading()) {
        vm.loading = true;

        vm.formModel.attachments = _.map(vm.formModel.attachments, function (attachment) {
          return {
            name: attachment.name,
            uid: _.isUndefined(attachment.id) ? attachment.uid : attachment.id,
            contentType: attachment.contentType
          };
        });

        vm.formModel.authorId = vm.authorId;

        return vm.formModel.update().then(function () {
          resetForm(false);
        }).catch(_onError);
      }

      return null;
    }

    function resetForm(leaveEditMode) {
      $timeout(function () {
        if (vm.form) {
          vm.form.$setPristine();
          vm.form.$setUntouched();
        }

        vm.error = false;
        if (leaveEditMode) {
          vm.editMode = false;
        }
      });
    }

    function addAttachments(files) {
      vm.formModel.attachments.push.apply(vm.formModel.attachments, files);

      angular.forEach(files, function (file) {
        tempUploadService.upload(file, 300).then(function (blob) {
          angular.extend(file, blob);
        }).catch(function () {
          removeAttachment(file);
        });
      });

      vm.focusMessageFormField = true;
    }

    function removeAttachment(file) {
      vm.formModel.attachments = _.reject(vm.formModel.attachments, file);
      vm.focusMessageFormField = true;
    }

    function addFileLibraryAttachments(files) {
      vm.formModel.fileLibraryAttachments = _.unionBy(vm.formModel.fileLibraryAttachments, files, 'fileId');
    }

    function removeFileLibraryAttachment(file) {
      vm.formModel.fileLibraryAttachments = _.reject(vm.formModel.fileLibraryAttachments, file);
      vm.focusMessageFormField = true;
    }

    function isOriginalAuthorOptionDisplayed() {
      var isAuthor = vm.ngModel.author.id !== vm.currentUser.id;
      return vm.currentUser && isAuthor && vm.ngModel._permissions.accessoriginalauthor;
    }

    function isContextMenuDisplayed() {
      return vm.deleteOptionDisplayed || isOriginalAuthorOptionDisplayed();
    }

    function _onError() {
      vm.error = true;
    }

    function _getAttachments(model) {
      return _.filter(model.attachments, function (att) {
        return !att.fileLibraryAttachment;
      });
    }

    function _getFileLibraryAttachments(model, mapToFormat) {
      var chain = _.filter(model.attachments, function (att) {
        return att.fileLibraryAttachment;
      });
      if (mapToFormat) {
        chain = _.map(chain, function (att) {
          return {
            senderId: att.senderId,
            fileId: att.id,
            displayName: att.name
          };
        });
      }

      return chain;
    }

    function _mapToIds(attachments, id) {
      return _.map(attachments, function (attachment) {
        return attachment[id];
      });
    }

    function _updateComment(comment) {
      vm.ngModel.edited = comment.edited;
      vm.ngModel.modified = comment.modified;
      vm.ngModel.message = comment.message;
      vm.ngModel.attachments = _getAttachments(comment);
      _.forEach(_getFileLibraryAttachments(comment, false), function (att) {
        vm.ngModel.attachments.push(att);
      });
      vm.loading = false;
      vm.editMode = false;
      $scope.$broadcast('comment.' + comment.id + ':updateDone');
    }

    function _registerEvents() {
      var unsubscribeUpdatedFn = $scope.$on('comment.' + vm.ngModel.id + ':updated', function (event, comment) {
        if (comment.id === vm.ngModel.id) {
          _updateComment(comment);
        }
      });
      var unsubscribeNewFn = $scope.$on('comment:addedNew', function (event, comment) {
        if (vm.editMode) {
          _onError();
        }
        vm.ngModel._permissions.edit = false;
        _updatePermissions();
        vm.newComments.push(comment);
      });
      var unsubscribeDeletedFn = $scope.$on('comment:deleted', function (event, comment) {
        if (_.find(vm.newComments, {id: comment.id})) {
          _.remove(vm.newComments, {id: comment.id});
          if (vm.newComments.length <= 0) {
            vm.ngModel._permissions.edit = vm.editPermissions;
            _updatePermissions();
          }
        }
      });

      $scope.$on('$destroy', function () {
        unsubscribeUpdatedFn();
        unsubscribeNewFn();
        unsubscribeDeletedFn();
      });
    }

    function _updatePermissions() {
      vm.deleteOptionDisplayed = vm.ngModel._permissions.delete;
      vm.editOptionDisplayed = vm.ngModel._permissions.edit;
    }

    function _emitEditMode() {
      $scope.$emit('comment:editMode', vm.ngModel.id, vm.editMode);
    }

    function onInit() {
      vm.previewUrl = coyoEndpoints.comments.preview;
      vm.backendUrl = backendUrlService.getUrl();
      vm.originalAuthor = undefined;
      vm.error = false;

      vm.editPermissions = vm.ngModel._permissions.edit;
      vm.newComments = [];

      _registerEvents();
      _updatePermissions();

      $scope.$watch(function () {
        return vm.editMode;
      }, function () {
        _emitEditMode();
      });

      authService.getUser().then(function (user) {
        vm.currentUser = user;
        vm.originalAuthorOptionDisplayed = isOriginalAuthorOptionDisplayed();
        vm.contextMenuDisplayed = isContextMenuDisplayed();
      });
    }
  }

})(angular);
