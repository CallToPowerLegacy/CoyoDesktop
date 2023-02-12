(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.userprofile')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('de', {
          "WIDGET.USERPROFILE.DESCRIPTION": "Zeigt das Profil eines Benutzers an.",
          "WIDGET.USERPROFILE.NAME": "User-Profil",
          "WIDGET.USERPROFILE.SETTINGS.HELP": "Bitte wähle einen Benutzer aus, dessen Profil angezeigt werden soll.",
          "WIDGET.USERPROFILE.SHOW.INFO": "Info",
          "WIDGET.USERPROFILE.SHOW.INFO.LABEL": "Zeige Kontaktinformationen",
          "WIDGET.USERPROFILE.SHOW.INFO.DESC": "Zeige die Kontaktinformationen des Benutzers an.",
          "WIDGET.USERPROFILE.USER": "Benutzer",
          "WIDGET.USERPROFILE.USER.NOTFOUND": "Der ausgewählte Benutzer kann nicht angezeigt werden."
        });
        /* eslint-enable quotes */
      });
})(angular);
