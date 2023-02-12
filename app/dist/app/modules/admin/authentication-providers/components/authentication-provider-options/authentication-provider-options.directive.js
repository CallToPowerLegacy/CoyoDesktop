(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.authenticationProviders')
      .component('oyocAuthenticationProviderOptions', authenticationProviderOptions());

  /**
   * @ngdoc directive
   * @name coyo.admin.authenticationProviders.oyocAuthenticationProviderOptions:oyocAuthenticationProviderOptions
   * @restrict 'E'
   *
   * @description
   * Context menu options for the authentication provider list.
   *
   * @param {object} actions actions
   * @param {object} authenticationProvider authenticationProvider
   */
  function authenticationProviderOptions() {
    return {
      restrict: 'E',
      templateUrl: 'app/modules/admin/authentication-providers/components/authentication-provider-options/authentication-provider-options.html',
      scope: {},
      bindings: {
        actions: '<',
        authenticationProvider: '<'
      },
      controller: function () {},
      controllerAs: '$ctrl'
    };
  }

})(angular);
