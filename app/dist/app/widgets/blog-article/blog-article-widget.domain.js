(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.blogarticle')
      .factory('BlogArticleWidgetModel', BlogArticleWidgetModel);

  /**
   * @ngdoc service
   * @name coyo.widgets.blogarticle.BlogArticleWidgetModel
   *
   * @description
   * Domain model representation for a single blog article shown in the blog article widget
   *
   * @requires restResourceFactory
   */
  function BlogArticleWidgetModel(restResourceFactory) {
    var BlogArticleWidget = restResourceFactory({
      url: '/web/widgets/blogarticle',
      httpConfig: {
        autoHandleErrors: false
      }
    });

    angular.extend(BlogArticleWidget, {

      /**
       * @ngdoc function
       * @name coyo.widgets.blogarticle.BlogArticleWidgetModel#getArticle
       * @methodOf coyo.widgets.blogarticle.BlogArticleWidgetModel
       *
       * @description
       * Returns a blog article
       *
       * @param {string} articleId ID of the article.
       *
       * @returns {promise} An $http promise resolving the blog article.
       */
      getArticle: function (articleId) {
        return BlogArticleWidget.get('article/' + articleId);
      }
    });

    return BlogArticleWidget;
  }

})(angular);
