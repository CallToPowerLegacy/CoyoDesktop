(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.forum')
      .controller('ForumThreadListController', ForumThreadListController);

  /**
   * Controller for the forum app.
   *
   * @requires $rootScope
   * @requires $scope
   * @requires $state
   * @requires app
   * @requires coyo.apps.forum.ForumThreadModel
   * @requires coyo.apps.forum.forumAppConfig
   * @requires coyo.apps.forum.forumThreadService
   * @constructor
   */
  function ForumThreadListController($rootScope, $scope, $state, app, ForumThreadModel, forumAppConfig, forumThreadService) {
    var vm = this;

    vm.$onInit = onInit;
    vm.pin = pinThread;
    vm.unpin = unpinThread;
    vm.close = closeThread;
    vm.reopen = reopenThread;
    vm.delete = deleteThread;
    vm.statusFilterActive = statusFilterActive;
    vm.searchTermFilterActive = searchTermFilterActive;
    vm.toggleIncludeOpen = toggleIncludeOpen;
    vm.toggleIncludeClosed = toggleIncludeClosed;
    vm.search = search;

    function pinThread(thread) {
      forumThreadService.pin(thread)
          .then(function () {
            _reloadState();
          });
    }

    function unpinThread(thread) {
      forumThreadService.unpin(thread)
          .then(function () {
            _reloadState();
          });
    }

    function closeThread(thread) {
      forumThreadService.close(thread)
          .then(function () {
            _reloadState();
          });
    }

    function reopenThread(thread) {
      forumThreadService.reopen(thread)
          .then(function () {
            _reloadState();
          });
    }

    function deleteThread(thread) {
      forumThreadService.delete(thread)
          .then(function () {
            _reloadState();
          });
    }

    function statusFilterActive() {
      return !vm.forumThreads._queryParams.includeOpen || !vm.forumThreads._queryParams.includeClosed;
    }

    function searchTermFilterActive() {
      return !_.isEmpty(vm.forumThreads._queryParams.searchTerm);
    }

    function toggleIncludeOpen() {
      vm.forumThreads._queryParams.includeOpen = !vm.forumThreads._queryParams.includeOpen;
      if (!vm.forumThreads._queryParams.includeOpen && !vm.forumThreads._queryParams.includeClosed) {
        vm.forumThreads._queryParams.includeClosed = true;
      }
      _loadThreads();
    }

    function toggleIncludeClosed() {
      vm.forumThreads._queryParams.includeClosed = !vm.forumThreads._queryParams.includeClosed;
      if (!vm.forumThreads._queryParams.includeOpen && !vm.forumThreads._queryParams.includeClosed) {
        vm.forumThreads._queryParams.includeOpen = true;
      }
      _loadThreads();
    }

    function search(searchTerm) {
      vm.forumThreads._queryParams.searchTerm = searchTerm;
      _loadThreads();
    }

    function _reloadState() {
      $state.reload($state.current.name);
    }

    function _loadThreads() {
      ForumThreadModel.pagedQueryWithPermissions(
          undefined, vm.forumThreads._queryParams, {senderId: app.senderId, appId: app.id}, ['close', 'pin', 'delete']
      ).then(function (result) {
        vm.forumThreads = result;
        vm.threadCount = result.totalElements;
      }).finally(function () {
        vm.loading = false;
      });
    }

    function onInit() {
      vm.app = app;
      vm.loading = true;
      vm.threadCount = 0;
      vm.contextMenuTemplate = forumAppConfig.templates.contextMenuList;
      vm.forumThreads = {
        content: [],
        _queryParams: {
          _page: 0,
          _pageSize: forumAppConfig.paging.threads.pageSize,
          includeOpen: true,
          includeClosed: true,
          _orderBy: 'lastAnswerDate,desc',
          searchTerm: ''
        }
      };

      var unsubscribe = $rootScope.$on('screenSize:changed', function (event, screenSize) {
        vm.isMobile = screenSize.isXs || screenSize.isSm;
      });
      $scope.$on('$destroy', unsubscribe);

      vm.isMobile = $rootScope.screenSize.isXs || $rootScope.screenSize.isSm;
      _loadThreads();
    }
  }

})(angular);
