(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.forum')
      /**
       * @ngdoc directive
       * @name coyo.apps.forum.forumThreadAddAnswer:forumThreadAddAnswer
       * @scope
       * @restrict 'E'
       * @element OWN
       *
       * @description
       * Renders the answers of a forum thread.
       *
       * @param {object} app The app
       * @param {object} thread The forum thread
       */
      .component('oyocForumThreadAddAnswer', {
        templateUrl: 'app/apps/forum/components/forum-thread-add-answer/forum-thread-add-answer.html',
        bindings: {
          app: '=',
          thread: '='
        },
        controller: 'ForumThreadAddAnswerController',
        controllerAs: '$ctrl'
      })
      .controller('ForumThreadAddAnswerController', ForumThreadAddAnswerController);

  function ForumThreadAddAnswerController($rootScope, $q, authService, tempUploadService, ForumThreadAnswerModel) {
    var vm = this;

    vm.$onInit = onInit;
    vm.save = save;
    vm.addAttachments = addAttachments;
    vm.removeAttachment = removeAttachment;

    function save() {
      var deferred = $q.defer();
      if (vm.status.saving || !vm.answer.text || _.filter(vm.newItemAttachments, {uploading: true}).length !== 0) {
        deferred.resolve();
      } else {
        vm.status.saving = true;

        vm.answer.attachments = _.map(vm.newItemAttachments, function (attachment) {
          return {
            name: attachment.name,
            uid: attachment.uid,
            contentType: attachment.contentType
          };
        });

        vm.answer.createWithPermissions(['delete']).then(function (savedAnswer) {
          vm.answer = savedAnswer;
          _addAnswer(savedAnswer);
          _reset();
        }).catch(function () {
          deferred.reject();
        }).finally(function () {
          vm.status.saving = false;
        });
      }

      return deferred.promise;
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
    }

    function removeAttachment(file) {
      vm.newItemAttachments = _.reject(vm.newItemAttachments, file);
    }

    function _reset() {
      vm.newItemAttachments = [];

      vm.answer = {};
      vm.answer = new ForumThreadAnswerModel(
          {
            senderId: vm.app.senderId,
            appId: vm.app.id,
            threadId: vm.thread.id
          }
      );
    }

    function _addAnswer(savedAnswer) {
      $rootScope.$broadcast('forum:answer:published', savedAnswer);
    }

    function onInit() {
      vm.status = {
        saving: false
      };
      vm.options = {
        rte: {
          height: 150
        }
      };

      authService.getUser().then(function (currentUser) {
        vm.currentUser = currentUser;
      });

      _reset();
    }
  }

})(angular);
