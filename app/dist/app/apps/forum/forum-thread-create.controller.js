(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.forum')
      .controller('ForumThreadCreateController', ForumThreadCreateController);

  /**
   * Controller for creating a forum thread.
   *
   * @requires $scope
   * @requires $state
   * @requires $q
   * @requires $timeout
   * @requires commons.resource.tempUploadService
   * @requires app
   * @requires thread
   * @constructor
   */
  function ForumThreadCreateController($scope, $state, $q, $timeout, tempUploadService, app, thread) {
    var vm = this;

    vm.$onInit = onInit;

    vm.cancel = cancel;
    vm.save = save;
    vm.addAttachments = addAttachments;
    vm.removeAttachment = removeAttachment;

    function cancel() {
      vm.saving = false;
      $state.go('^');
    }

    function save() {
      var deferred = $q.defer();
      if (_isUploading()) {
        deferred.resolve();
      } else {
        vm.saving = true;

        vm.thread.attachments = _.map(vm.newItemAttachments, function (attachment) {
          return {
            name: attachment.name,
            uid: attachment.uid,
            contentType: attachment.contentType
          };
        });

        vm.thread.create().then(function (savedThread) {
          vm.newItemAttachments = [];
          vm.thread = savedThread;

          $state.go('^.view', {id: vm.thread.id}).then(function () {
            deferred.resolve();
          });
        }).catch(function () {
          deferred.reject();
        });
      }

      return deferred.promise;
    }

    function addAttachments(files) {
      vm.newItemAttachments.push.apply(vm.newItemAttachments, files);
      vm.uploadChange = new Date();

      angular.forEach(files, function (file) {
        tempUploadService.upload(file, 300).then(function (blob) {
          angular.extend(file, blob);
        }).catch(function () {
          removeAttachment(file);
        }).finally(function () {
          vm.uploadChange = new Date();
        });
      });
    }

    function removeAttachment(file) {
      vm.newItemAttachments = _.reject(vm.newItemAttachments, file);
      vm.uploadChange = new Date();
    }

    function _isUploading() {
      return _.filter(vm.newItemAttachments, {uploading: true}).length > 0;
    }

    function _updateFormLoading() {
      $timeout(function () {
        _.set(vm, 'form.loading', _isUploading());
      });
    }

    function onInit() {
      vm.app = app;
      vm.thread = thread;
      vm.newItemAttachments = [];

      vm.saving = false;
      vm.options = {
        rte: {
          height: 150
        }
      };

      _updateFormLoading();
      $scope.$watch(function () {
        return vm.uploadChange;
      }, function () {
        _updateFormLoading();
      });
    }

  }

})(angular);
