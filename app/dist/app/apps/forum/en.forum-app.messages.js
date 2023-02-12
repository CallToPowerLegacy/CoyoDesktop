(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.forum')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('en', {
          "APP.FORUM.ATTACH_FILES": "Attach files",
          "APP.FORUM.ANSWER.TITLE": "Add answer",
          "APP.FORUM.CREATE": "Create thread",
          "APP.FORUM.CREATE.TITLE": "Create a thread",
          "APP.FORUM.DESCRIPTION": "Ask questions, give answers or simply discuss any topic you like with your colleagues.",
          "APP.FORUM.EMPTY": "This forum does not have any threads, yet.",
          "APP.FORUM.EMPTY.FILTER": "No threads found according to the filter criteria.",
          "APP.FORUM.EMPTY_LINK": "Create the first thread now.",
          "APP.FORUM.FILTER.STATUS.CLOSED": "Closed",
          "APP.FORUM.FILTER.STATUS.OPEN": "Open",
          "APP.FORUM.FILTER.STATUS.TITLE": "Status",
          "APP.FORUM.NAME": "Forum",
          "APP.FORUM.SEARCH.LIST": "Search by title",
          "APP.FORUM.THREAD_NONE": "Threads",
          "APP.FORUM.THREAD_OPTIONS": "Options",
          "APP.FORUM.THREAD_PLURAL": "Threads",
          "APP.FORUM.THREAD_SINGULAR": "Thread",
          "APP.FORUM.THREAD.ANSWER.DELETE": "Delete answer",
          "APP.FORUM.THREAD.ANSWER.DELETED": "This answer has been deleted.",
          "APP.FORUM.THREAD.ANSWER.DELETED.LABEL": "Deleted",
          "APP.FORUM.THREAD.CLOSE": "Close",
          "APP.FORUM.THREAD.CLOSED": "Closed",
          "APP.FORUM.THREAD.CLOSED.MESSAGE": "This thread has been closed.",
          "APP.FORUM.THREAD.CREATOR": "Creator",
          "APP.FORUM.THREAD.DELETE": "Delete",
          "APP.FORUM.THREAD.LIST.TITLE": "Title",
          "APP.FORUM.THREAD.LIST.ANSWERS": "Answers",
          "APP.FORUM.THREAD.LIST.CREATED": "Created",
          "APP.FORUM.THREAD.LIST.LATESTACTIVITY": "Latest activity",
          "APP.FORUM.THREAD.MODAL.CLOSE.TITLE": "Close thread?",
          "APP.FORUM.THREAD.MODAL.CLOSE.TEXT": "Do you really want to close the thread \"{title}\"?",
          "APP.FORUM.THREAD.MODAL.ANSWER.DELETE.TEXT": "Do you really want to delete this answer?",
          "APP.FORUM.THREAD.MODAL.ANSWER.DELETE.TITLE": "Delete answer?",
          "APP.FORUM.THREAD.MODAL.DELETE.TEXT": "Do you really want to delete the thread \"{title}\"?",
          "APP.FORUM.THREAD.MODAL.DELETE.TITLE": "Delete thread?",
          "APP.FORUM.THREAD.OPEN": "Open",
          "APP.FORUM.THREAD.OVERVIEW": "Back to the thread overview",
          "APP.FORUM.THREAD.PIN": "Pin",
          "APP.FORUM.THREAD.PINNED": "Pinned",
          "APP.FORUM.THREAD.PINNED.SUCCESS": "Thread pinned",
          "APP.FORUM.THREAD.REOPEN": "Reopen",
          "APP.FORUM.THREAD.TITLE": "Title",
          "APP.FORUM.THREAD.UNPIN": "Unpin",
          "APP.FORUM.THREAD.UNPINNED.SUCCESS": "Thread unpinned",
          "ENTITY_TYPE.FORUM_THREAD": "Forum Thread",
          "NOTIFICATIONS.FORUM.THREAD.ANSWER.PUBLISHED": "*{s1}* has answered to the thread '*{s3}*' in *{s4}*.",
          "NOTIFICATIONS.FORUM.THREAD.PUBLISHED": "*{s1}* has published the thread '*{s2}*' in *{s3}*."
        });
        /* eslint-enable quotes */
      });
})(angular);
