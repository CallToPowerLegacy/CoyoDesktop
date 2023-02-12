(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.authenticationProviders.oauth2', [
        'coyo.base',
        'coyo.domain',
        'coyo.admin.authenticationProviders.api'
      ])
      .constant('OAUTH2_PRESETS', {
        office365: {
          mappingId: 'mail',
          clientId: '',
          clientSecret: '',
          authenticationEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
          tokenEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
          userInfoEndpoint: 'https://graph.microsoft.com/v1.0/me',
          scope: 'openid https://graph.microsoft.com/User.Read',
          authenticationScheme: 'header',
          clientAuthenticationScheme: 'form'
        },
        facebook: {
          mappingId: 'email',
          clientId: '',
          clientSecret: '',
          authenticationEndpoint: 'https://www.facebook.com/dialog/oauth',
          tokenEndpoint: 'https://graph.facebook.com/oauth/access_token',
          userInfoEndpoint: 'https://graph.facebook.com/me',
          scope: 'email',
          authenticationScheme: 'query',
          clientAuthenticationScheme: 'form'
        },
        empty: {
          mappingId: '',
          clientId: '',
          clientSecret: '',
          authenticationEndpoint: '',
          tokenEndpoint: '',
          userInfoEndpoint: '',
          scope: '',
          authenticationScheme: 'header',
          clientAuthenticationScheme: 'header'
        }
      })
      .config(registerOauth2);

  function registerOauth2(authenticationProviderTypeRegistryProvider) {
    authenticationProviderTypeRegistryProvider.register({
      key: 'oauth2',
      name: 'ADMIN.AUTHENTICATION.OAUTH2.NAME',
      description: 'ADMIN.AUTHENTICATION.OAUTH2.DESCRIPTION',
      directive: 'oyoc-oauth2-settings',
      editSlug: true
    });
  }

})(angular);
