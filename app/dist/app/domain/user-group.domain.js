(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('GroupModel', GroupModel);

  /**
   * @ngdoc service
   * @name coyo.domain.GroupModel
   *
   * @description
   * Provides the Coyo group model.
   *
   * @requires restResourceFactory
   * @requires commons.config.coyoEndpoints
   */
  function GroupModel(restResourceFactory, coyoEndpoints) {
    var Group = restResourceFactory({
      url: coyoEndpoints.user.groups
    });

    // class members
    angular.extend(Group, {

      /**
       * @ngdoc function
       * @name coyo.domain.GroupModel#search
       * @methodOf coyo.domain.UserModel
       *
       * @description
       * Performs a search for groups.
       *
       * @param {string} term the current search term.
       * @param {object} pageable The pagination data.
       *
       * @returns {promise} An $http promise
       */
      search: function (term, status, pageable) {
        var params = angular.extend({
          displayName: (term || '').toLowerCase(),
          status: status
        }, pageable.getParams());

        return Group.$http({
          method: 'GET',
          url: Group.$url(),
          params: params
        });
      }
    });

    return Group;
  }

})(angular);
