(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.wiki')
      .factory('WikiArticleModel', WikiArticleModel);

  /**
   * @ngdoc service
   * @name coyo.domain.WikiArticleModel
   *
   * @description
   * Domain model representation of the wiki article configuration endpoint. Creates a new WikiArticleModel object.
   *
   * @requires coyo.apps.api.appResourceFactory
   */
  function WikiArticleModel(appResourceFactory) {
    var WikiArticle = appResourceFactory({
      appKey: 'wiki',
      url: '/articles/{{id}}',
      name: 'wikiArticle',
      extensions: ['snapshots']
    });

    // class members
    angular.extend(WikiArticle, {
      /**
       * @ngdoc function
       * @name coyo.domain.WikiArticleModel#count
       * @methodOf coyo.domain.WikiArticleModel
       *
       * @description
       * Counts all wiki articles for the given app.
       *
       * @returns {promise} An $http promise
       */
      count: function (app) {
        return this.$get(this.$url({
          senderId: app.senderId,
          appId: app.id
        }, 'count'));
      },

      /**
       * @ngdoc method
       * @name coyo.domain.WikiArticleModel#getSubArticles
       * @methodOf coyo.domain.WikiArticleModel
       *
       * @description
       * Returns the sub-articles of the given article.
       *
       * @param {object} app
       * The wiki app the given article belongs to.
       *
       * @param {string} parentId
       * The id of the article to return the sub-articles for.
       *
       * @returns {promise} an $http promise which resolves into an array of wiki articles.
       */
      getSubArticles: function (app, parentId) {
        return this.$get(this.$url({
          senderId: app.senderId,
          appId: app.id
        }) + '/children', {parentId: parentId});
      },

      /**
       * @ngdoc function
       * @name coyo.domain.WikiArticleModel#getSubArticlesWithPermissions
       * @methodOf coyo.domain.WikiArticleModel
       *
       * @description
       * Returns the sub articles of the given article, including the permissions.
       *
       * @param {object} app
       * The wiki app the given article belongs to.
       *
       * @param {string} parentId
       * The id of the article to return the sub-articles for.
       *
       * @returns {promise} an $http promise which resolves into an array of wiki articles including their permissions.
       */
      getSubArticlesWithPermissions: function (app, parentId) {
        var queryParams = this.applyPermissions(['edit', 'delete']);
        if (parentId) {
          queryParams.parentId = parentId;
        }
        return this.$get(this.$url({
          senderId: app.senderId,
          appId: app.id
        }) + '/children', queryParams);
      }
    });
    // instance members
    angular.extend(WikiArticle.prototype, {

      /**
       * @ngdoc function
       * @name coyo.domain.WikiArticleModel#buildLayoutName
       * @methodOf coyo.domain.WikiArticleModel
       *
       * @description
       * Build the localised layout name of a wiki article.
       *
       * @returns {string} The layout name
       */
      buildLayoutName: function (appId, key) {
        var name = 'app-wiki-' + appId + '-' + this.id + '-' + this.revisionNumber;
        if (!!key && !!this.defaultLanguage && key !== 'NONE' && this.defaultLanguage !== key) {
          name += '-' + key;
        }
        return name;
      },

      /**
       * @ngdoc function
       * @name coyo.domain.WikiArticleModel#lock
       * @methodOf coyo.domain.WikiArticleModel
       *
       * @description
       * Locks the article and returns it updated (with updated lock information).
       *
       * @returns {promise} An $http promise
       */
      lock: function () {
        return this.$post(this.$url('/lock'));
      },
      /**
       * @ngdoc function
       * @name coyo.domain.WikiArticleModel#unlock
       * @methodOf coyo.domain.WikiArticleModel
       *
       * @description
       * Unlocks the article and returns it updated (with updated lock information).
       *
       * @returns {promise} An $http promise
       */
      unlock: function (changed) {
        var params = (changed) ? {changed: changed} : {};
        return this.$delete(this.$url('/lock'), params);
      },

      /**
       * @ngdoc method
       * @name coyo.domain.WikiArticleModel#getRevisions
       * @methodOf coyo.domain.WikiArticleModel
       *
       * @description
       * Loads all revision information of the current article.
       *
       * @param {object=} pageable
       * The paging information. If not set an offset of 0 and a page size of 20 will be used.
       *
       * @returns {object[]} list of revision containing author, title and modification date
       */
      getRevisions: function (pageable) {
        return this.get('revisions', pageable.getParams());
      },

      /**
       * @ngdoc method
       * @name coyo.domain.WikiArticleModel#move
       * @methodOf coyo.domain.WikiArticleModel
       *
       * @description
       * Moves an article from one parent to another and / or changes the position within one parent.
       *
       * @param {string=} parentId
       * If set the article is moved to the parent with the given id. If not set the article is moved to the root of
       * the app. If you don't ant to move the article to another parent, you will have to pass the current parent ID.
       *
       * @param {number} sortOrder
       * The new index the article should be moved to.
       *
       * @returns {object} a promise which returns the updated article on success.
       */
      move: function (parentId, sortOrder) {
        var params = {
          parentId: parentId,
          sortOrder: sortOrder
        };
        return this.$put(this.$url('move'), {}, params);
      }
    });

    return WikiArticle;
  }

})(angular);
