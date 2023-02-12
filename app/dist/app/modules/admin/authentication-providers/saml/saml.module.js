(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.authenticationProviders.saml', [
        'coyo.base',
        'coyo.domain',
        'coyo.admin.authenticationProviders.api'
      ])
      .config(registerSaml);

  function registerSaml(authenticationProviderTypeRegistryProvider) {
    authenticationProviderTypeRegistryProvider.register({
      key: 'saml',
      name: 'ADMIN.AUTHENTICATION.SAML.NAME',
      description: 'ADMIN.AUTHENTICATION.SAML.DESCRIPTION',
      directive: 'oyoc-saml-settings',
      editSlug: true
    });
  }

})(angular);
