(function (angular) {
  'use strict';

  angular.module('coyo.widgets.suggestpages')
      .directive('coyoSelectPages', selectPages);

  /**
   * @ngdoc directive
   * @name coyo.widgets.suggestpages:coyoSelectPages
   * @element ANY
   * @restrict E
   * @scope
   *
   * @description
   * Renders a ui-select to select multiple pages.
   */
  function selectPages(selectFactoryModel, PageModel, Pageable) {
    return selectFactoryModel({
      refresh: refresh,
      multiple: true,
      pageSize: 50,
      limit: 10,
      emptyText: 'WIDGETS.SUGGEST_PAGES.NO_PAGE_FOUND'
    });

    function refresh(pageable, search) {
      return PageModel.pagedQuery(new Pageable(pageable.page, pageable.size), {name: search})
          .then(function (response) {
            return angular.extend(_.map(response.content, function (page) {
              return {
                id: page.id,
                displayName: page.name
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
