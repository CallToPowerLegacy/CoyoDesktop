(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.rss')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('de', {
          "WIDGET.RSS.DESCRIPTION": "Zeigt einen RSS-Feed an.",
          "WIDGET.RSS.ERRORS.AUTHENTICATION": "Bitte melde dich an",
          "WIDGET.RSS.ERRORS.VALIDATION.INVALID_URL": "Ungültige Feed-Url, bitte überprüfe die angegebene Url.",
          "WIDGET.RSS.ERRORS.VALIDATION.VALID_URL": "RSS-Feed ist gültig.",
          "WIDGET.RSS.SETTINGS.CONFIG.CONNECTIONFAILURE": "Es konnte keine Verbindung zum Server hergestellt werden.",
          "WIDGET.RSS.NAME": "RSS-Feed",
          "WIDGET.RSS.READ_MORE": "Zum Beitrag",
          "WIDGET.RSS.SETTINGS.CONFIG": "RSS-Einstellungen",
          "WIDGET.RSS.SETTINGS.CONFIG.CREDENTIALS.INVALID": "Ungültige Anmeldedaten",
          "WIDGET.RSS.SETTINGS.CONFIG.FURTHER.CONFIG": "Weitere Einstellungen",
          "WIDGET.RSS.SETTINGS.CONFIG.IMAGE.HELP": "Aktivieren: Bilder des RSS-Feeds anzeigen.",
          "WIDGET.RSS.SETTINGS.CONFIG.IMAGE": "Artikel Bilder anzeigen",
          "WIDGET.RSS.SETTINGS.CONFIG.LOADING": "Überprüfe Feed...",
          "WIDGET.RSS.SETTINGS.CONFIG.MAX.COUNT": "Anzahl der RSS-Einträge",
          "WIDGET.RSS.SETTINGS.CONFIG.MAX.COUNT.HELP": "Die Anzahl der Einträge, die im Widget angezeigt werden.",
          "WIDGET.RSS.SETTINGS.CONFIG.PASSWORD.HELP": "Passwort für die Authentifizierung.",
          "WIDGET.RSS.SETTINGS.CONFIG.PASSWORD.LABEL": "Passwort",
          "WIDGET.RSS.SETTINGS.CONFIG.RSS.LABEL": "RSS-Einstellungen",
          "WIDGET.RSS.SETTINGS.CONFIG.USER.HELP": "Benutzername für eine Authentifizierung.",
          "WIDGET.RSS.SETTINGS.CONFIG.URL.LABEL": "RSS-URL",
          "WIDGET.RSS.SETTINGS.CONFIG.USER.LABEL": "Benutzer",
          "WIDGET.RSS.SETTINGS.CONFIG.VERIFY.LABEL": "Überprüfen"
        });
        /* eslint-enable quotes */
      });
})(angular);
