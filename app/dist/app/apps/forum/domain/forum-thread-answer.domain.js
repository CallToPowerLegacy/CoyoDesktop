(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.forum')
      .factory('ForumThreadAnswerModel', ForumThreadAnswerModel);

  /**
   * @ngdoc service
   * @name coyo.domain.ForumThreadAnswerModel
   *
   * @description
   * Domain model representation of the forum thread answer configuration endpoint. Creates a new ForumThreadAnswerModel object.
   *
   * @requires coyo.apps.api.appResourceFactory
   * @requires coyo.apps.forum.forumAppConfig
   */
  function ForumThreadAnswerModel(appResourceFactory, forumAppConfig) {
    var ForumThreadAnswer = appResourceFactory({
      appKey: 'forum',
      url: '/threads/{{threadId}}/answers/{{id}}',
      name: 'forumThreadAnswer'
    });

    // class members
    angular.extend(ForumThreadAnswer, {
      /**
       * @ngdoc function
       * @name coyo.domain.ForumThreadAnswerModel#count
       * @methodOf coyo.domain.ForumThreadAnswerModel
       *
       * @description
       * Counts all forum thread answers for the given thread.
       *
       * @returns {promise} An $http promise
       */
      count: function (app, thread) {
        return this.$get(this.$url({
          senderId: app.senderId,
          appId: app.id,
          threadId: thread.id
        }, 'count'));
      }
    });

    // instance members
    angular.extend(ForumThreadAnswer.prototype, {

      /**
       * @ngdoc function
       * @name coyo.domain.ForumThreadAnswerModel#previewUrl
       * @methodOf coyo.domain.ForumThreadAnswerModel
       *
       * @description
       * Create the preview url for a thread answer.
       *
       * @returns {string} preview url.
       */
      previewUrl: function () {
        return this.$url(forumAppConfig.endpoints.threadAnswer.preview);
      }
    });

    return ForumThreadAnswer;
  }

})(angular);
