(function (angular) {
  'use strict';

  angular.module('coyo.widgets.blog')
      .directive('coyoSelectBlogApp', selectBlogApp);

  /**
   * @ngdoc directive
   * @name coyo.widgets.blog.coyoSelectBlogApp:coyoSelectBlogApp
   * @element ANY
   * @restrict E
   * @scope
   *
   * @description
   * Renders a ui-select to select a specific blog app.
   */
  function selectBlogApp(selectFactoryModel, GlobalAppModel, Pageable) {
    return selectFactoryModel({
      refresh: refresh,
      multiple: false,
      pageSize: 50,
      sublines: ['senderName'],
      emptyText: 'WIDGETS.BLOG.NO_BLOG_APPS_FOUND'
    });

    function refresh(pageable, search) {
      return GlobalAppModel.pagedQuery(new Pageable(pageable.page, pageable.size), {name: search, key: 'blog'})
          .then(function (response) {
            return angular.extend(_.map(response.content, function (app) {
              return {
                id: app.id,
                displayName: app.name,
                senderName: app.senderName
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
