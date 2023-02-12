(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('ThemeModel', ThemeModel);

  /**
   * @ngdoc service
   * @name coyo.domain.ThemeModel
   *
   * @description
   * Domain model representing the theme endpoint.
   *
   * @requires restResourceFactory
   * @requires commons.config.coyoEndpoints
   */
  function ThemeModel(restResourceFactory, coyoEndpoints) {
    var Theme = restResourceFactory({
      url: coyoEndpoints.theme.themes
    });

    // class members
    angular.extend(Theme, {

      /**
       * @ngdoc function
       * @name coyo.domain.ThemeModel#order
       * @methodOf coyo.domain.ThemeModel
       *
       * @description
       * Sorts the list of themes based on the given order definition.
       *
       * @param {string[]} ids The list of theme IDs.
       * @returns {promise} An $http promise
       */
      order: function (ids) {
        return Theme.$put(Theme.$url('action/order'), ids);
      }
    });

    return Theme;
  }

})(angular);
