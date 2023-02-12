(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.forum')
      .factory('ForumThreadModel', ForumThreadModel);

  /**
   * @ngdoc service
   * @name coyo.domain.ForumThreadModel
   *
   * @description
   * Domain model representation of the forum thread configuration endpoint. Creates a new ForumThreadModel object.
   *
   * @requires coyo.apps.api.appResourceFactory
   * @requires coyo.apps.forum.forumAppConfig
   */
  function ForumThreadModel(appResourceFactory, forumAppConfig) {
    var ForumThread = appResourceFactory({
      appKey: 'forum',
      url: '/threads/{{id}}',
      name: 'forumThread'
    });

    // instance members
    angular.extend(ForumThread.prototype, {
      /**
       * @ngdoc function
       * @name coyo.domain.ForumThreadModel#pinned
       * @methodOf coyo.domain.ForumThreadModel
       *
       * @description
       * Set the pinned attribute of an thread.
       *
       * @param {boolean} pinned thread is pinned or not
       *
       * @returns {promise} An $http promise
       */
      setPinned: function (pinned) {
        this.pinned = pinned;
        return this.$put(this.$url('/pin'));
      },

      /**
       * @ngdoc function
       * @name coyo.domain.ForumThreadModel#closed
       * @methodOf coyo.domain.ForumThreadModel
       *
       * @description
       * Set the closed attribute of an thread.
       *
       * @param {boolean} closed thread is closed or not
       *
       * @returns {promise} An $http promise
       */
      setClosed: function (closed) {
        this.closed = closed;
        return this.$put(this.$url('/close'));
      },

      /**
       * @ngdoc function
       * @name coyo.domain.ForumThreadModel#previewUrl
       * @methodOf coyo.domain.ForumThreadModel
       *
       * @description
       * Create the preview url for a thread.
       *
       * @returns {string} preview url.
       */
      previewUrl: function () {
        return this.$url(forumAppConfig.endpoints.thread.preview);
      }
    });

    return ForumThread;
  }

})(angular);
