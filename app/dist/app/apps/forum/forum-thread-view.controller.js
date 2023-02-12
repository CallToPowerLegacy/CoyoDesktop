(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.forum')
      .controller('ForumThreadViewController', ForumThreadViewController);

  /**
   * Controller for viewing a forum thread.
   *
   * @requires $scope
   * @requires $state
   * @requires $timeout
   * @requires $element
   * @requires $compile
   * @requires commons.resource.backendUrlService
   * @requires coyo.apps.forum.forumThreadService
   * @requires app
   * @requires thread
   * @requires forumAppConfig
   * @constructor
   */
  function ForumThreadViewController($scope, $state, $timeout, $element, $compile,
                                     backendUrlService, forumThreadService, app, thread, forumAppConfig) {
    var vm = this;

    vm.$onInit = onInit;

    vm.pin = pinThread;
    vm.unpin = unpinThread;
    vm.close = closeThread;
    vm.reopen = reopenThread;
    vm.delete = deleteThread;

    function pinThread() {
      forumThreadService.pin(vm.thread);
    }

    function unpinThread() {
      forumThreadService.unpin(vm.thread);
    }

    function closeThread() {
      forumThreadService.close(vm.thread);
    }

    function reopenThread() {
      forumThreadService.reopen(vm.thread);
    }

    function deleteThread() {
      forumThreadService.delete(vm.thread)
          .then(function () {
            $state.go('^');
          });
    }

    function onInit() {
      vm.app = app;
      vm.thread = thread;
      vm.backendUrl = backendUrlService.getUrl();
      vm.contextMenuTemplate = forumAppConfig.templates.contextMenuView;
      vm.options = {
        rte: {
          height: 150
        }
      };

      $timeout(function () {
        // re-compile coyo-download directives to update file URLs after exit of edit mode
        $element.find('.note-file-link[coyo-download]').replaceWith(function () {
          var elem = angular.element(this); // eslint-disable-line angular/controller-as-vm
          elem.attr('coyo-download', '\'' + elem.attr('coyo-download') + '\'');
          return $compile(elem)($scope);
        });
      });
    }
  }

})(angular);
