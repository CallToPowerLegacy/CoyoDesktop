(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .controller('CommentsController', CommentsController);

  /**
   * Controller for creating and managing comments.
   *
   * @requires $scope
   * @requires $timeout
   * @requires $log
   * @requires authService
   * @requires socketService
   * @requires CommentModel
   * @requires Pageable
   * @requires tempUploadService
   * @requires commentsService
   *
   * @constructor
   */
  function CommentsController($scope, $timeout, $log, authService, socketService, CommentModel, Pageable, tempUploadService,
                              commentsService) {
    var vm = this;

    vm.comments = [];
    vm.newComments = [];
    vm.loading = false;
    vm.total = 0;

    vm.$onInit = onInit;
    vm.loadMore = loadMore;
    vm.formKeyPress = formKeyPress;
    vm.isUploading = isUploading;
    vm.submitForm = submitForm;
    vm.resetForm = resetForm;
    vm.addAttachments = addAttachments;
    vm.removeAttachment = removeAttachment;
    vm.addFileLibraryAttachments = addFileLibraryAttachments;
    vm.removeFileLibraryAttachment = removeFileLibraryAttachment;

    // ------------------------------------------------------------------------------------------------

    function loadMore() {
      if (!vm.loading) {
        vm.loading = true;

        var page = (vm.currentPage ? vm.currentPage.number + 1 : 0);
        var pageSize = (!vm.currentPage ? 2 : 8);
        var offset = vm.comments.length + vm.newComments.length;
        var pageable = new Pageable(page, pageSize, 'created,desc', offset);
        var params = {
          targetId: vm.target.id,
          targetType: vm.target.typeName
        };

        CommentModel.pagedQueryWithPermissions(pageable, params, {}, ['delete', 'edit', 'like', 'accessoriginalauthor'])
            .then(_setPage)
            .finally(function () {
              vm.loading = false;
            });
      }
    }

    function formKeyPress($event) {
      if ($event.keyCode === 13 && !$event.ctrlKey && !$event.shiftKey) {
        $event.preventDefault();
        submitForm();
      }
    }

    function isUploading() {
      return _.filter(vm.newItemAttachments, {uploading: true}).length > 0;
    }

    function submitForm() {
      if (vm.form.$valid && !isUploading()) {
        vm.loading = true;

        vm.formModel.attachments = _.map(vm.newItemAttachments, function (attachment) {
          return {
            name: attachment.name,
            uid: attachment.uid,
            contentType: attachment.contentType
          };
        });

        vm.formModel.authorId = vm.authorId;

        return vm.formModel.create()
            .then(resetForm)
            .finally(function () {
              vm.loading = false;
            });
      }

      return null;
    }

    function resetForm() {
      $timeout(function () {
        vm.newItemAttachments = [];

        vm.formModel = new CommentModel({
          targetId: vm.target.id,
          targetType: vm.target.typeName
        });

        if (vm.form) {
          vm.form.$setPristine();
          vm.form.$setUntouched();
        }
      });
    }

    function addAttachments(files) {
      vm.newItemAttachments.push.apply(vm.newItemAttachments, files);

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
      vm.newItemAttachments = _.reject(vm.newItemAttachments, file);
      vm.focusMessageFormField = true;
    }

    function addFileLibraryAttachments(files) {
      vm.formModel.fileLibraryAttachments = _.unionBy(vm.formModel.fileLibraryAttachments,
          files, 'fileId');
    }

    function removeFileLibraryAttachment(file) {
      vm.formModel.fileLibraryAttachments = _.reject(vm.formModel.fileLibraryAttachments, file);
      vm.focusMessageFormField = true;
    }

    // ------------------------------------------------------------------------------------------------

    function _add(event) {
      $scope.$apply(function () {
        CommentModel.getWithPermissions(event.content, {}, ['delete', 'edit', 'like', 'accessoriginalauthor'])
            .then(function (comment) {
              vm.newComments.push(new CommentModel(comment));
              vm.total++;
              $scope.$broadcast('comment:addedNew', comment);
            });
      });
    }

    function _update(event) {
      $scope.$apply(function () {
        CommentModel.getWithPermissions(event.content, {}, ['delete', 'edit', 'like', 'accessoriginalauthor'])
            .then(function (comment) {
              var commentModel = new CommentModel(comment);
              if (_.remove(vm.comments, {id: event.content}).length) {
                vm.comments.push(commentModel);
              } else if (_.remove(vm.newComments, {id: event.content}).length) {
                vm.newComments.push(commentModel);
              }
              $scope.$broadcast('comment.' + comment.id + ':updated', commentModel);
            });
      });
    }

    function _remove(event) {
      $scope.$apply(function () {
        var comment = _.find(vm.comments, {id: event.content});
        if (comment) {
          _.remove(vm.comments, {id: event.content});
        } else {
          comment = _.find(vm.newComments, {id: event.content});
          if (comment) {
            _.remove(vm.newComments, {id: event.content});
          }
        }
        if (comment) {
          $scope.$broadcast('comment:deleted', comment);
        }
        vm.total--;
      });
    }

    function _setPage(page) {
      vm.currentPage = page;
      vm.comments = _.concat(page.content.reverse(), vm.comments);
      vm.total = page.totalElements;
    }

    function _registerEvents() {
      var unsubscribeCreateFn = socketService.subscribe('/topic/comment.' + vm.target.id + '.' + vm.target.typeName,
          _add, 'created');

      var unsubscribeUpdateFn = socketService.subscribe('/topic/comment.' + vm.target.id + '.' + vm.target.typeName,
          _update, 'updated');

      var unsubscribeRemoveFn = socketService.subscribe('/topic/comment.' + vm.target.id + '.' + vm.target.typeName,
          _remove, 'deleted');

      var unsubscribeEditFn = $scope.$on('comment:editMode', function (event, commentId, editMode) {
        if (_.find(vm.comments, {id: commentId}) || _.find(vm.newComments, {id: commentId})) {
          vm.showAddComment = !editMode;
        }
      });

      $scope.$on('$destroy', function () {
        unsubscribeCreateFn();
        unsubscribeUpdateFn();
        unsubscribeRemoveFn();
        unsubscribeEditFn();
      });
    }

    function onInit() {
      if (angular.isUndefined(vm.authorId)) {
        authService.getUser().then(function (user) {
          vm.authorId = user.id;
        });
      }

      resetForm();

      vm.loading = true;
      vm.showAddComment = true;

      commentsService.getComments(vm.target.id, vm.target.typeName)
          .then(_setPage)
          .catch(function () {
            $log.error('[Comments] Could not load comments for target with id [' + vm.target.id + ']');
          })
          .finally(function () {
            vm.loading = false;
          });

      _registerEvents();
    }
  }

})(angular);
