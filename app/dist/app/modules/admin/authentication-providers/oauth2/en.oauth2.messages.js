(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.authenticationProviders.oauth2')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('en', {
          "ADMIN.AUTHENTICATION.OAUTH2.NAME": "OpenID Connect",
          "ADMIN.AUTHENTICATION.OAUTH2.DESCRIPTION": "OpenID Connect authentication (e.g. Office 365, Facebook)",
          "ADMIN.AUTHENTICATION.OAUTH2.PRESETS": "Presets",
          "ADMIN.AUTHENTICATION.OAUTH2.PRESETS.HELP": "A list of frequently used providers. Selection will override the form and replace all values.",
          "ADMIN.AUTHENTICATION.OAUTH2.TABS.HEADINGS.GENERAL": "Settings",
          "ADMIN.AUTHENTICATION.OAUTH2.MAPPING_ID": "Mapping-ID",
          "ADMIN.AUTHENTICATION.OAUTH2.MAPPING_ID.HELP": "The name of the field with the unique identifier. Will be locally mapped on the 'loginName' field of the user.",
          "ADMIN.AUTHENTICATION.OAUTH2.CLIENT_ID": "Client-ID",
          "ADMIN.AUTHENTICATION.OAUTH2.CLIENT_ID.HELP": "The client identifier of the authentication endpoint.",
          "ADMIN.AUTHENTICATION.OAUTH2.CLIENT_SECRET": "Client-Secret",
          "ADMIN.AUTHENTICATION.OAUTH2.CLIENT_SECRET.HELP": "The client secret of the authentication endpoint.",
          "ADMIN.AUTHENTICATION.OAUTH2.AUTH_ENDPOINT": "Authentifizierungs-URL",
          "ADMIN.AUTHENTICATION.OAUTH2.AUTH_ENDPOINT.HELP": "The endpoint to request authentication.",
          "ADMIN.AUTHENTICATION.OAUTH2.TOKEN_ENDPOINT": "Access-Token-URL",
          "ADMIN.AUTHENTICATION.OAUTH2.TOKEN_ENDPOINT.HELP": "The endpoint to request an access token.",
          "ADMIN.AUTHENTICATION.OAUTH2.USER_INFO_ENDPOINT": "User-Info-URL",
          "ADMIN.AUTHENTICATION.OAUTH2.USER_INFO_ENDPOINT.HELP": "The endpoint to request additional user information.",
          "ADMIN.AUTHENTICATION.OAUTH2.SCOPE": "Scope",
          "ADMIN.AUTHENTICATION.OAUTH2.SCOPE.HELP": "The required permissions to request additional user information.",
          "ADMIN.AUTHENTICATION.OAUTH2.AUTH_SCHEMA": "Token Schema",
          "ADMIN.AUTHENTICATION.OAUTH2.AUTH_SCHEMA.HELP": "The bearer token method for this resource.",
          "ADMIN.AUTHENTICATION.OAUTH2.CLIENT_SCHEMA": "Authentication Schema",
          "ADMIN.AUTHENTICATION.OAUTH2.CLIENT_SCHEMA.HELP": "The scheme used to authenticate the client.",
          "ADMIN.AUTHENTICATION.OAUTH2.REDIRECT_URL": "Redirect-URL",
          "ADMIN.AUTHENTICATION.OAUTH2.REDIRECT_URL.NOT_YET": "The URL will be available once the provider has been successfully saved."
        });
        /* eslint-enable quotes */
      });
})(angular);
