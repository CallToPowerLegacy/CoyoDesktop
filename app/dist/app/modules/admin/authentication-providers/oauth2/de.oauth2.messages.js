(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.authenticationProviders.oauth2')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('de', {
          "ADMIN.AUTHENTICATION.OAUTH2.NAME": "OpenID Connect",
          "ADMIN.AUTHENTICATION.OAUTH2.DESCRIPTION": "OpenID Connect Authentifizierung (zum Beispiel Office 365, Facebook)",
          "ADMIN.AUTHENTICATION.OAUTH2.PRESETS": "Voreinstellungen",
          "ADMIN.AUTHENTICATION.OAUTH2.PRESETS.HELP": "Hier finden sich die Einstellungen häufig genutzter Anbieter. Bei Auswahl wird das Formular befüllt und alle Werte überschrieben.",
          "ADMIN.AUTHENTICATION.OAUTH2.TABS.HEADINGS.GENERAL": "Einstellungen",
          "ADMIN.AUTHENTICATION.OAUTH2.MAPPING_ID": "Mapping-ID",
          "ADMIN.AUTHENTICATION.OAUTH2.MAPPING_ID.HELP": "Der Name des Feldes mit dem eindeutigen Bezeichner. Wird lokal mit dem 'loginName' des Benutzers abgeglichen.",
          "ADMIN.AUTHENTICATION.OAUTH2.CLIENT_ID": "Client-ID",
          "ADMIN.AUTHENTICATION.OAUTH2.CLIENT_ID.HELP": "Die Client-ID des Authentifizierungs-Endpunkts.",
          "ADMIN.AUTHENTICATION.OAUTH2.CLIENT_SECRET": "Client-Secret",
          "ADMIN.AUTHENTICATION.OAUTH2.CLIENT_SECRET.HELP": "Das Client-Secret des Authentifizierungs-Endpunkts.",
          "ADMIN.AUTHENTICATION.OAUTH2.AUTH_ENDPOINT": "Authentifizierungs-URL",
          "ADMIN.AUTHENTICATION.OAUTH2.AUTH_ENDPOINT.HELP": "Der Endpunkt um eine Authentifizierung durchzuführen.",
          "ADMIN.AUTHENTICATION.OAUTH2.TOKEN_ENDPOINT": "Access-Token-URL",
          "ADMIN.AUTHENTICATION.OAUTH2.TOKEN_ENDPOINT.HELP": "Der Endpunkt um ein Access-Token abzufragen.",
          "ADMIN.AUTHENTICATION.OAUTH2.USER_INFO_ENDPOINT": "User-Info-URL",
          "ADMIN.AUTHENTICATION.OAUTH2.USER_INFO_ENDPOINT.HELP": "Der Endpunkt um die Informationen des Benutzers abzufragen.",
          "ADMIN.AUTHENTICATION.OAUTH2.SCOPE": "Anwendungsbereich",
          "ADMIN.AUTHENTICATION.OAUTH2.SCOPE.HELP": "Die benötigten Berechtigungen zum Erfragen der Informationen des Benutzers.",
          "ADMIN.AUTHENTICATION.OAUTH2.AUTH_SCHEMA": "Token Schema",
          "ADMIN.AUTHENTICATION.OAUTH2.AUTH_SCHEMA.HELP": "Das Schema des Tokens für diese Ressource.",
          "ADMIN.AUTHENTICATION.OAUTH2.CLIENT_SCHEMA": "Authentifizierungs Schema",
          "ADMIN.AUTHENTICATION.OAUTH2.CLIENT_SCHEMA.HELP": "Das verwendete Schema zur Authentifizierung.",
          "ADMIN.AUTHENTICATION.OAUTH2.REDIRECT_URL": "Weiterleitungs-URL",
          "ADMIN.AUTHENTICATION.OAUTH2.REDIRECT_URL.NOT_YET": "Die URL steht erst nach dem erfolgreichen Speichern zur Verfügung."
        });
        /* eslint-enable quotes */
      });
})(angular);
