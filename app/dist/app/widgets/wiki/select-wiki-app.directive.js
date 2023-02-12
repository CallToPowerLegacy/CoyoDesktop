(function (angular) {
  'use strict';

  angular.module('coyo.widgets.wiki')
      .directive('coyoSelectWikiApp', selectWikiApp);

  /**
   * @ngdoc directive
   * @name coyo.widgets.wiki:coyoSelectWikiApp
   * @element ANY
   * @restrict E
   * @scope
   *
   * @description
   * Renders a ui-select to select a specific wiki app.
   */
  function selectWikiApp(selectFactoryModel, GlobalAppModel, Pageable) {
    return selectFactoryModel({
      refresh: refresh,
      multiple: false,
      pageSize: 50,
      sublines: ['senderName'],
      emptyText: 'WIDGETS.WIKI.NO_WIKI_APPS_FOUND'
    });

    function refresh(pageable, search) {
      return GlobalAppModel.pagedQuery(new Pageable(pageable.page, pageable.size), {name: search, key: 'wiki'})
          .then(function (response) {
            return angular.extend(_.map(response.content, function (app) {
              return {
                id: app.id,
                displayName: app.name,
                senderName: app.senderName,
                senderId: app.senderId
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
