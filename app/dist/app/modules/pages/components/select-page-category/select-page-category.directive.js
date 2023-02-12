(function (angular) {
  'use strict';

  angular
      .module('coyo.pages')
      .directive('coyoSelectPageCategory', selectPageCategory);

  function selectPageCategory(selectFactoryModel, PageCategoryModel, Pageable) {
    return selectFactoryModel({
      refresh: _refresh,
      emptyText: 'PAGE.NO_CATEGORIES_FOUND',
      multiple: true
    });

    function _refresh(pageable, search) {
      var paramPageable = new Pageable(pageable.page, pageable.size);
      var paramSearch = {name: search};
      return PageCategoryModel.pagedQuery(paramPageable, paramSearch).then(function (response) {
        return angular.extend(_.map(response.content, function (category) {
          return {
            id: category.id,
            displayName: category.name
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
