(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.forum')
      /**
       * @ngdoc directive
       * @name coyo.apps.forum.forumThreadAnswers:forumThreadAnswers
       * @scope
       * @restrict 'E'
       * @element OWN
       *
       * @description
       * Renders the answers of a forum thread.
       *
       * @param {object} thread The forum thread
       */
      .component('oyocForumThreadAnswers', {
        templateUrl: 'app/apps/forum/components/forum-thread-answers/forum-thread-answers.html',
        bindings: {
          app: '=',
          thread: '='
        },
        controller: 'ForumThreadAnswersController',
        controllerAs: '$ctrl'
      })
      .controller('ForumThreadAnswersController', ForumThreadAnswersController);

  function ForumThreadAnswersController($rootScope, $scope, $timeout, $element, $compile,
                                        ForumThreadAnswerModel, forumAppConfig, forumThreadService) {
    var vm = this;

    vm.$onInit = onInit;
    vm.deleteAnswer = deleteAnswer;

    function deleteAnswer(answer) {
      forumThreadService.deleteAnswer(answer).then(function (anonAnswer) {
        anonAnswer.lastUpdate = new Date();
        vm.forumThreadAnswers.content[_.find(vm.forumThreadAnswers.content, {
          id: answer.id
        })] = anonAnswer;
      });
    }

    function _updateCount() {
      return ForumThreadAnswerModel.count(vm.app, vm.thread).then(function (data) {
        vm.threadCount = data;
        return vm.threadCount;
      });
    }

    function _loadAnswers() {
      vm.status.loadingAnswers = true;
      _getLoadInfos().then(function (infos) {
        if (infos.count > 0) {
          vm.forumThreadAnswers._queryParams._page = infos.page;
          ForumThreadAnswerModel.pagedQueryWithPermissions(
              undefined,
              vm.forumThreadAnswers._queryParams,
              {senderId: vm.app.senderId, appId: vm.app.id, threadId: vm.thread.id},
              ['delete']
          ).then(function (result) {
            vm.forumThreadAnswers = result;
            $timeout(function () {
              // re-compile coyo-download directives to update file URLs after exit of edit mode
              $element.find('.note-file-link[coyo-download]').replaceWith(function () {
                var elem = angular.element(this); // eslint-disable-line angular/controller-as-vm
                elem.attr('coyo-download', '\'' + elem.attr('coyo-download') + '\'');
                return $compile(elem)($scope);
              });
            });
          }).finally(function () {
            vm.status.loadingAnswers = false;
          });
        } else {
          vm.status.loadingAnswers = false;
        }
      });
    }

    function _getLoadInfos() {
      return _updateCount().then(function (count) {
        return {
          count: count,
          page: _calculateLastPageNumber(count, forumAppConfig.paging.threadAnswers.pageSize)
        };
      });
    }

    function _calculateLastPageNumber(count, pageSize) {
      if (count <= 0) {
        return 0;
      }

      return _.ceil(count / pageSize) - 1;
    }

    function _reloadState() {
      _loadAnswers();
    }

    function _newAnswerPublished() {
      _reloadState();
    }

    function onInit() {
      vm.status = {
        loadingAnswers: true
      };
      vm.options = {
        rte: {
          height: 150
        }
      };
      vm.forumThreadAnswers = {
        content: [],
        _queryParams: {
          _page: 0,
          _pageSize: forumAppConfig.paging.threadAnswers.pageSize,
          _orderBy: 'created,asc'
        }
      };
      vm.contextMenuTemplate = forumAppConfig.templates.contextMenuAnswer;

      var event = $rootScope.$on('forum:answer:published', _newAnswerPublished);
      $scope.$on('$destroy', event);

      _loadAnswers();
    }
  }

})(angular);
