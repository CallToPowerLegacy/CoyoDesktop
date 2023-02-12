(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.file-library')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('de', {
          "APP.FILE_LIBRARY.DESCRIPTION": "Lade Dateien in die Dokumenten-App hoch, sortiere sie in Ordnern und teile sie mit deinen Kollegen.",
          "APP.FILE_LIBRARY.NAME": "Dokumente",
          "APP.FILE_LIBRARY.SETTINGS.EDITORS.LABEL": "Berechtigungen",
          "APP.FILE_LIBRARY.SETTINGS.EDITORS.EVERYONE.LABEL": "Alle",
          "APP.FILE_LIBRARY.SETTINGS.EDITORS.EVERYONE.DESCRIPTION": "Alle Benutzer können Dokumente hochladen und bearbeiten.",
          "APP.FILE_LIBRARY.SETTINGS.EDITORS.ADMINS.LABEL": "Admins",
          "APP.FILE_LIBRARY.SETTINGS.EDITORS.ADMINS.DESCRIPTION": "Nur Admins können Dokumente hochladen und bearbeiten."
        });
        /* eslint-enable quotes */
      });
})(angular);
