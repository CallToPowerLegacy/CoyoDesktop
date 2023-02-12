(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.wikiarticle')
      .directive('coyoSelectWikiArticleWidget', selectWikiArticle);

  /**
   * @ngdoc directive
   * @name coyo.widgets.wikiarticle:coyoSelectWikiArticleWidget
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Renders a ui-select to select a specific wiki article.
   */
  function selectWikiArticle(selectFactoryModel, WikiArticleWidgetModel, Pageable) {
    return selectFactoryModel({
      refresh: _refresh,
      multiple: false,
      pageSize: 15,
      sublines: ['context'],
      emptyText: 'WIDGETS.WIKIARTICLE.NO_ARTICLES'
    });

    function _refresh(pageable, search) {
      return WikiArticleWidgetModel.pagedQuery(new Pageable(pageable.page, pageable.size), {title: search}).then(function (response) {
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
