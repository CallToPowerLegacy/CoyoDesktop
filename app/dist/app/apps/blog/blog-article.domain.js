(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.blog')
      .factory('BlogArticleModel', BlogArticleModel);

  /**
   * @ngdoc service
   * @name coyo.domain.BlogArticleModel
   *
   * @description
   * Domain model representation of the blog article configuration endpoint. Creates a new BlogArticleModel object.
   *
   * @requires coyo.apps.api.appResourceFactory
   */
  function BlogArticleModel(appResourceFactory) {
    var BlogArticle = appResourceFactory({
      appKey: 'blog',
      url: '/articles/{{id}}',
      name: 'blogArticle'
    });

    // class members
    angular.extend(BlogArticle, {

      /**
       * @ngdoc function
       * @name coyo.domain.BlogArticleModel#count
       * @methodOf coyo.domain.BlogArticleModel
       *
       * @description
       * Counts all blog articles for the given app grouped by month and year.
       *
       * @returns {promise} An $http promise
       */
      count: function (app, includePublished, includeScheduled, includeDrafts) {
        return this.$get(this.$url({
          senderId: app.senderId,
          appId: app.id
        }, 'count'), {
          includePublished: includePublished,
          includeScheduled: includeScheduled,
          includeDrafts: includeDrafts
        });
      }
    });

    // instance members
    angular.extend(BlogArticle.prototype, {

      /**
       * @ngdoc function
       * @name coyo.domain.BlogArticleModel#buildLayoutName
       * @methodOf coyo.domain.BlogArticleModel
       *
       * @description
       * Build the localised layout name of a blog article.
       *
       * @returns {string} The layout name
       */
      buildLayoutName: function (appId, key) {
        var name = 'app-blog-' + appId + '-' + this.id;
        if (!!key && !!this.defaultLanguage && key !== 'NONE' && this.defaultLanguage !== key) {
          name += '-' + key;
        }
        return name;
      },

      /**
       * @ngdoc function
       * @name coyo.domain.BlogArticleModel#save
       * @methodOf coyo.domain.BlogArticleModel
       *
       * @description
       * Save the blog article.
       *
       * @returns {promise} An $http promise
       */
      save: function (raiseNotification) {
        if (this.isNew()) {
          return this.create(raiseNotification);
        } else {
          return this.update(raiseNotification);
        }
      },

      /**
       * @ngdoc function
       * @name coyo.domain.BlogArticleModel#create
       * @methodOf coyo.domain.BlogArticleModel
       *
       * @description
       * Creates the blog article.
       *
       * @returns {promise} An $http promise
       */
      create: function (raiseNotification) {
        return this.$http({
          method: 'POST',
          url: this.$url(),
          data: this,
          params: {
            'raiseNotification': raiseNotification
          }
        });
      },

      /**
       * @ngdoc function
       * @name coyo.domain.BlogArticleModel#create
       * @methodOf coyo.domain.BlogArticleModel
       *
       * @description
       * Updates the blog article.
       *
       * @returns {promise} An $http promise
       */
      update: function (raiseNotification) {
        return this.$http({
          method: 'PUT',
          url: this.$url(),
          data: this,
          params: {
            'raiseNotification': raiseNotification
          }
        });
      },

      getContext: function (params) {
        return this.$http({
          method: 'GET',
          url: this.$url() + '/context',
          data: this,
          params: params
        });
      }
    });

    return BlogArticle;
  }

})(angular);
