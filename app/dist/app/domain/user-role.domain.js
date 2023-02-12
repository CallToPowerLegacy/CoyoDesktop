(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('RoleModel', RoleModel);

  /**
   * @ngdoc service
   * @name coyo.domain.RoleModel
   *
   * @description
   * Provides the Coyo role model.
   *
   * @requires restResourceFactory
   * @requires commons.config.coyoEndpoints
   */
  function RoleModel(restResourceFactory, coyoEndpoints) {
    var Role = restResourceFactory({
      url: coyoEndpoints.user.roles
    });

    // class members
    angular.extend(Role, {

      /**
       * @ngdoc function
       * @name coyo.domain.RoleModel#permissionConfiguration
       * @methodOf coyo.domain.RoleModel
       *
       * @description
       * Configures the permissions.
       *
       * @returns {promise} An $http promise
       */
      permissionConfiguration: function () {
        return this.$http({
          method: 'GET',
          url: this.$url('permission-groups')
        });
      }
    });

    return Role;
  }

})(angular);
