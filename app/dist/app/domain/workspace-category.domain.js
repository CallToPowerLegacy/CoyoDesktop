(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('WorkspaceCategoryModel', WorkspaceCategoryModel);

  /**
   * @ngdoc service
   * @name coyo.domain.WorkspaceCategoryModel
   *
   * @description
   * Provides the Coyo workspace category model.
   *
   * @requires restResourceFactory
   * @requires commons.config.coyoEndpoints
   */
  function WorkspaceCategoryModel(restResourceFactory, coyoEndpoints) {
    var WorkspaceCategoryModel = restResourceFactory({
      url: coyoEndpoints.workspace.categories
    });

    // class members
    angular.extend(WorkspaceCategoryModel, {

      /**
       * @ngdoc function
       * @name coyo.domain.WorkspaceCategoryModel#order
       * @methodOf coyo.domain.WorkspaceCategoryModel
       *
       * @description
       * Sorts the list of workspace categories based on the given order definition.
       *
       * @param {string[]} ids The list of workspace category IDs.
       * @returns {promise} An $http promise
       */
      order: function (ids) {
        return WorkspaceCategoryModel.$put(WorkspaceCategoryModel.$url('action/order'), ids);
      }
    });

    return WorkspaceCategoryModel;
  }

})(angular);
