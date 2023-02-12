(function (angular) {
  'use strict';

  angular.module('coyo.widgets.wikiarticle')
      .factory('WikiArticleWidgetModel', WikiArticleWidgetModel);

  /**
   * @ngdoc service
   * @name coyo.widgets.wikiarticle.WikiArticleWidgetModel
   *
   * @description
   * Domain model representation for a single wiki article shown in the wiki article widget
   *
   * @requires restResourceFactory
   */
  function WikiArticleWidgetModel(restResourceFactory) {
    var wikiArticleWidget = restResourceFactory({
      url: '/web/widgets/wikiarticle',
      httpConfig: {
        autoHandleErrors: false
      }
    });

    angular.extend(wikiArticleWidget, {

      /**
       * @ngdoc function
       * @name coyo.widgets.wikiarticle.WikiArticleWidgetModel#getArticle
       * @methodOf coyo.widgets.wikiarticle.WikiArticleWidgetModel
       *
       * @description
       * Returns a wiki article
       *
       * @param {string} articleId ID of the article.
       *
       * @returns {promise} An $http promise resolving the wiki article.
       */
      getArticle: function (articleId) {
        return wikiArticleWidget.get('article/' + articleId);
      }
    });

    return wikiArticleWidget;
  }

})(angular);
