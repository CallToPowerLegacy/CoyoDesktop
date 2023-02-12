(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.wiki')
      .directive('coyoSelectWikiArticle', selectWikiArticle);

  /**
   * @ngdoc directive
   * @name coyo.apps.wiki:coyoSelectWikiArticle
   * @element ANY
   * @restrict E
   * @scope
   *
   * @description
   * Renders a ui-select to select a specific wiki article.
   */
  function selectWikiArticle(selectFactoryModel, WikiArticleModel, Pageable, SenderModel, AppModel, appService) {
    return selectFactoryModel({
      refresh: _refresh,
      transform: _transform,
      emptyText: 'APP.WIKI.SELECT.PARENT.NO_ARTICLES_FOUND',
      pageSize: 30
    });

    function _refresh(pageable, search, parameters) {
      return SenderModel.get({id: SenderModel.getCurrentIdOrSlug()}).then(function (sender) {
        return AppModel.get({senderId: sender.id, id: appService.getCurrentAppIdOrSlug()}).then(function (app) {
          var params = angular.extend({
            title: search
          }, parameters);
          return WikiArticleModel.pagedQuery(
              new Pageable(pageable.page, pageable.size),
              params,
              {senderId: sender.id, appId: app.id}
          ).then(function (response) {
            return angular.extend(response.content, {
              meta: {
                last: response.last,
                number: response.number
              }
            });
          });
        });
      });
    }

    function _transform(article) {
      return article ? article.id : null;
    }
  }

})(angular);
