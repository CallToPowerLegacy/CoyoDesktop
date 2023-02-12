(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.forum')
      /**
       * @ngdoc directive
       * @name coyo.apps.forum.forumThreadStatus:forumThreadStatus
       * @scope
       * @restrict 'E'
       * @element OWN
       *
       * @description
       * Renders the status of a forum thread.
       *
       * @param {object} thread The forum thread
       */
      .component('oyocForumThreadStatus', {
        templateUrl: 'app/apps/forum/components/forum-thread-status/forum-thread-status.html',
        bindings: {
          thread: '='
        },
        controller: 'ForumThreadStatusController',
        controllerAs: '$ctrl'
      })
      .controller('ForumThreadStatusController', angular.noop);

})(angular);
