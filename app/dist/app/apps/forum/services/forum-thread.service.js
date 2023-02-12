(function (angular) {
  'use strict';

  angular.module('coyo.apps.forum')
      .factory('forumThreadService', forumThreadService);

  /**
   * @ngdoc service
   * @name coyo.apps.forum.forumThreadService
   *
   * @description
   * This service provides a common way manage threads.
   *
   * @requires commons.ui.modalService
   */
  function forumThreadService(modalService) {

    return {
      pin: pinThread,
      unpin: unpinThread,
      close: closeThread,
      reopen: reopenThread,
      delete: deleteThread,
      deleteAnswer: deleteAnswer
    };

    /**
     * @ngdoc method
     * @name coyo.apps.forum.forumThreadService#pinThread
     * @methodOf coyo.apps.forum.forumThreadService
     *
     * @description
     * Pins a thread.
     *
     * @param {object} thread
     * The thread to pin
     *
     * @returns {object} a promise which is resolved after the thread is pinned.
     */
    function pinThread(thread) {
      return thread.setPinned(true).then(function (savedThread) {
        thread = savedThread;
      });
    }

    /**
     * @ngdoc method
     * @name coyo.apps.forum.forumThreadService#unpinThread
     * @methodOf coyo.apps.forum.forumThreadService
     *
     * @description
     * Unpins a thread.
     *
     * @param {object} thread
     * The thread to unpin
     *
     * @returns {object} a promise which is resolved after the thread is unpinned.
     */
    function unpinThread(thread) {
      return thread.setPinned(false).then(function (savedThread) {
        thread = savedThread;
      });
    }

    /**
     * @ngdoc method
     * @name coyo.apps.forum.forumThreadService#closeThread
     * @methodOf coyo.apps.forum.forumThreadService
     *
     * @description
     * Opens a modal to close a thread.
     *
     * @param {object} thread
     * The thread to close
     *
     * @returns {object} a promise which is resolved after the thread is closed.
     */
    function closeThread(thread) {
      return modalService.confirm({
        title: 'APP.FORUM.THREAD.MODAL.CLOSE.TITLE',
        text: 'APP.FORUM.THREAD.MODAL.CLOSE.TEXT',
        translationContext: {title: thread.title},
        close: {title: 'YES'},
        dismiss: {title: 'NO'}
      }).result.then(function () {
        return thread.setClosed(true).then(function (savedThread) {
          thread = savedThread;
        });
      });
    }

    /**
     * @ngdoc method
     * @name coyo.apps.forum.forumThreadService#reopenThread
     * @methodOf coyo.apps.forum.forumThreadService
     *
     * @description
     * Reopens a thread.
     *
     * @param {object} thread
     * The thread to reopen
     *
     * @returns {object} a promise which is resolved after the thread is reopened.
     */
    function reopenThread(thread) {
      return thread.setClosed(false).then(function (savedThread) {
        thread = savedThread;
      });
    }

    /**
     * @ngdoc method
     * @name coyo.apps.forum.forumThreadService#deleteThread
     * @methodOf coyo.apps.forum.forumThreadService
     *
     * @description
     * Deletes a thread.
     *
     * @param {object} thread
     * The thread to delete
     *
     * @returns {object} a promise which is resolved after the thread is deleted.
     */
    function deleteThread(thread) {
      return modalService.confirm({
        title: 'APP.FORUM.THREAD.MODAL.DELETE.TITLE',
        text: 'APP.FORUM.THREAD.MODAL.DELETE.TEXT',
        translationContext: {title: thread.title},
        close: {title: 'YES'},
        dismiss: {title: 'NO'}
      }).result.then(function () {
        return thread.delete();
      });
    }

    /**
     * @ngdoc method
     * @name coyo.apps.forum.forumThreadService#deleteAnswer
     * @methodOf coyo.apps.forum.forumThreadService
     *
     * @description
     * Deletes a thread answer.
     *
     * @param {object} thread answer
     * The thread answer to delete
     *
     * @returns {object} a promise which is resolved after the thread answer is deleted.
     */
    function deleteAnswer(answer) {
      // Make sure that this method is not called with e.g. a thread
      _assert(answer.typeName === 'forum-thread-answer', 'The given object is not a forum thread answer:', answer.typeName);
      return modalService.confirm({
        title: 'APP.FORUM.THREAD.MODAL.ANSWER.DELETE.TITLE',
        text: 'APP.FORUM.THREAD.MODAL.ANSWER.DELETE.TEXT',
        translationContext: {},
        close: {title: 'YES'},
        dismiss: {title: 'NO'}
      }).result.then(function () {
        return answer.delete();
      });
    }

    function _assert(condition, message, objToLog) {
      if (!condition) {
        console.log('[ForumThreadService] ' + message, objToLog); //eslint-disable-line
        throw new Error('[ForumThreadService] ' + message);
      }
    }
  }

})(angular);
