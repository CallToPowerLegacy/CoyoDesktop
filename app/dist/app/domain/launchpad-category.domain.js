(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('LaunchpadCategoryModel', LaunchpadCategoryModel);

  /**
   * @ngdoc service
   * @name coyo.domain.LaunchpadCategoryModel
   *
   * @description
   * Domain model representing the launchpad categories.
   *
   * @requires restResourceFactory
   * @requires commons.config.coyoEndpoints
   */
  function LaunchpadCategoryModel(restResourceFactory, restSerializer, coyoEndpoints) {
    var LaunchpadCategory = restResourceFactory({
      url: coyoEndpoints.launchpad.categories,
      serializer: restSerializer(function () {
        this.resource('links', 'LaunchpadLinkModel');
      })
    });

    angular.extend(LaunchpadCategory, {

      /**
       * @ngdoc function
       * @name coyo.domain.LaunchpadCategoryModel#order
       * @methodOf coyo.domain.LaunchpadCategoryModel
       *
       * @description
       * Sorts the list of categories based on the given order definition.
       *
       * @param {string[]} ids The list of landing page IDs.
       * @returns {promise} An $http promise
       */
      order: function (ids) {
        return LaunchpadCategory.$put(LaunchpadCategory.$url('order'), ids);
      }
    });

    return LaunchpadCategory;
  }

})(angular);
