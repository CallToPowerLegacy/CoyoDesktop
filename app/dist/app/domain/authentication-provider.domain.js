(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('AuthenticationProviderModel', AuthenticationProviderModel);

  /**
   * @ngdoc service
   * @name coyo.domain.AuthenticationProviderModel
   *
   * @description
   * Provides the Coyo AuthenticationProviderModel model.
   *
   * @requires restResourceFactory
   * @requires commons.config.coyoEndpoints
   */
  function AuthenticationProviderModel(restResourceFactory, coyoEndpoints) {
    var AuthenticationProviderModel = restResourceFactory({
      url: coyoEndpoints.authenticationProvider.authenticationProviders
    });

    // class members
    angular.extend(AuthenticationProviderModel, {

      /**
       * @ngdoc function
       * @name coyo.domain.AuthenticationProviderModel#order
       * @methodOf coyo.domain.AuthenticationProviderModel
       *
       * @description
       * Sorts the list of providers based on the given order definition.
       *
       * @param {string[]} ids The list of authentication provider IDs.
       * @returns {promise} An $http promise
       */
      order: function (ids) {
        return this.$put(this.$url('action/order'), ids);
      }
    });

    // instance members
    angular.extend(AuthenticationProviderModel.prototype, {

      /**
       * @ngdoc function
       * @name coyo.domain.AuthenticationProviderModel#activate
       * @methodOf coyo.domain.AuthenticationProviderModel
       *
       * @description
       * Activates the authentication provider.
       *
       * @returns {promise} An $http promise
       */
      activate: function () {
        return this.$put(this.$url('activate'));
      },

      /**
       * @ngdoc function
       * @name coyo.domain.AuthenticationProviderModel#deactivate
       * @methodOf coyo.domain.AuthenticationProviderModel
       *
       * @description
       * Deactivates the authentication provider.
       *
       * @returns {promise} An $http promise
       */
      deactivate: function () {
        return this.$put(this.$url('deactivate'));
      }
    });

    return AuthenticationProviderModel;

  }

})(angular);
