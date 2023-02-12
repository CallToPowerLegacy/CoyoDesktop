(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.blogarticle')
      .directive('coyoSelectBlogArticle', selectBlogArticle);

  /**
   * @ngdoc directive
   * @name coyo.widgets.blogarticle.coyoSelectBlogArticle:coyoSelectBlogArticle
   * @element ANY
   * @restrict E
   * @scope
   *
   * @description
   * Renders a ui-select to select a specific blog article.
   */
  function selectBlogArticle(selectFactoryModel, BlogArticleWidgetModel, Pageable) {
    return selectFactoryModel({
      refresh: _refresh,
      multiple: false,
      pageSize: 15,
      sublines: ['context'],
      emptyText: 'WIDGETS.BLOGARTICLE.NO_ARTICLES'
    });

    function _refresh(pageable, search) {
      return BlogArticleWidgetModel.pagedQuery(new Pageable(pageable.page, pageable.size), {title: search}, {appId: null}).then(function (response) {
        return angular.extend(_.map(response.content, function (article) {
          return {
            id: article.id,
            displayName: article.title,
            context: article.senderName + ': ' + article.appName
          };
        }), {
          meta: {
            last: response.last,
            number: response.number
          }
        });
      });
    }
  }

})(angular);
