(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('PageCategoryModel', PageCategoryModel);

  /**
   * @ngdoc service
   * @name coyo.domain.PageCategoryModel
   *
   * @description
   * Provides the Coyo page category model.
   *
   * @requires restResourceFactory
   * @requires commons.config.coyoEndpoints
   */
  function PageCategoryModel(restResourceFactory, coyoEndpoints) {
    var PageCategoryModel = restResourceFactory({
      url: coyoEndpoints.page.categories
    });

    // class members
    angular.extend(PageCategoryModel, {

      /**
       * @ngdoc function
       * @name coyo.domain.PageCategoryModel#order
       * @methodOf coyo.domain.PageCategoryModel
       *
       * @description
       * Sorts the list of page categories based on the given order definition.
       *
       * @param {string[]} ids The list of page category IDs.
       * @returns {promise} An $http promise
       */
      order: function (ids) {
        return PageCategoryModel.$put(PageCategoryModel.$url('action/order'), ids);
      }
    });

    return PageCategoryModel;
  }

})(angular);
